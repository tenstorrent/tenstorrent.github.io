/* Tenstorrent docs — Search / Ask AI command modal.
 *
 * Opens from the navbar / sidebar search buttons (or ⌘K / Ctrl+K). The Search
 * tab does live, full-text search against the OpenSearch-backed docs search
 * service; if that service is unreachable it falls back to filtering Sphinx's
 * own local search index so the modal still works offline / on previews.
 * The Ask AI tab mirrors the "Ask about …" prompt. Enter jumps to the top hit,
 * or falls back to Sphinx's /search page. */
(function () {
  'use strict';

  var script = document.getElementById('tt-search-script');
  // pathto('search') — e.g. "search.html" or "../search.html".
  var SEARCH_URL = (script && script.dataset.searchUrl) || 'search.html';
  // Everything before "search.html" is the docs root the index is relative to.
  var ROOT = SEARCH_URL.replace(/search\.html$/, '');

  // Remote (OpenSearch) config — overridable via data-* attributes on the
  // script tag or a window.TT_DOCS_REMOTE_SEARCH object.
  var REMOTE = getRemoteConfig();
  var KAPA_SRC            = (script && script.dataset.kapaSrc) || '';
  var KAPA_INTEGRATION_ID = (script && script.dataset.kapaIntegrationId) || '';
  var DEBOUNCE_MS = 180;
  var MAX_HITS = 8;

  var modal, searchInput, aiInput, results, empty, searchBody;
  var activeTab = 'search';
  var debounceTimer = null;
  var activeController = null;   // AbortController for the in-flight request
  var seq = 0;                   // guards against out-of-order responses
  var remoteDown = false;        // reset each open so stale failures don't block remote

  // Kapa lazy-load state (widget fallback).
  var kapaLoaded = false;

  // Ask AI embedded chat state.
  var aiEmbed, aiIntro, aiExamples;
  var aiChatActive    = false;
  var kapaReactMounted = false;

  // Sphinx-index fallback state (loaded lazily, only if the remote API fails).
  var records = null;
  var indexLoading = false;

  document.addEventListener('DOMContentLoaded', init);

  function getRemoteConfig() {
    var ds = (script && script.dataset) || {};
    var runtime = window.TT_DOCS_REMOTE_SEARCH || {};
    var apiBase = runtime.apiBase || ds.searchApiBase ||
      'https://csl860x2oj.execute-api.us-east-2.amazonaws.com/prod';
    return {
      apiBase: apiBase.replace(/\/+$/, ''),
      sourceId: runtime.sourceId || ds.searchSource || 'docs-tenstorrent',
      siteBaseUrl: runtime.siteBaseUrl || ds.siteBaseUrl || 'https://docs.tenstorrent.com/'
    };
  }

  function init() {
    modal = document.getElementById('tt-search-modal');
    if (!modal) return;
    searchInput = document.getElementById('tt-search-input');
    aiInput     = document.getElementById('tt-ai-input');
    results     = document.getElementById('tt-search-results');
    empty       = document.getElementById('tt-search-empty');
    searchBody  = modal.querySelector('.tt-search-body');
    aiIntro    = document.getElementById('tt-ai-intro')    || modal.querySelector('.tt-ai-intro');
    aiExamples = document.getElementById('tt-ai-examples') || modal.querySelector('.tt-ai-examples');
    aiEmbed    = document.getElementById('tt-kapa-embed');

    // If the HTML was built before the embed block was added to the template,
    // create it dynamically so the chat UI still works without a Sphinx rebuild.
    if (!aiEmbed) {
      var aiPanel = modal.querySelector('.tt-search-panel[data-panel="ai"]');
      if (aiPanel) {
        aiEmbed = document.createElement('div');
        aiEmbed.id = 'tt-kapa-embed';
        aiEmbed.hidden = true;
        aiEmbed.innerHTML =
          '<div class="tt-chat-toolbar">' +
            '<button type="button" class="tt-ai-new-chat" id="tt-ai-new-chat">' +
              '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
                '<path d="M5 8h6M8 5l-3 3 3 3" stroke="currentColor" stroke-width="1.4"' +
                ' stroke-linecap="round" stroke-linejoin="round"/>' +
              '</svg>' +
              ' New conversation' +
            '</button>' +
          '</div>' +
          '<div id="tt-kapa-mount"></div>';
        aiPanel.appendChild(aiEmbed);
      }
    }

    document.querySelectorAll('.tt-search-trigger').forEach(function (el) {
      el.addEventListener('click', open);
    });

    modal.querySelectorAll('[data-search-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    modal.querySelectorAll('.tt-search-tab').forEach(function (tab) {
      tab.addEventListener('click', function () { switchTab(tab.dataset.tab); });
    });

    modal.querySelectorAll('.tt-ai-example').forEach(function (btn) {
      btn.addEventListener('click', function () {
        startAiChat(btn.textContent.trim());
      });
    });

    var newChatBtn = document.getElementById('tt-ai-new-chat') ||
                     (aiEmbed && aiEmbed.querySelector('.tt-ai-new-chat'));
    if (newChatBtn) newChatBtn.addEventListener('click', resetAiChat);

    searchInput.addEventListener('input', onInput);
    searchInput.addEventListener('keydown', onSearchKeydown);
    aiInput.addEventListener('keydown', onAiKeydown);

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        modal.hidden ? open() : close();
      } else if (e.key === 'Escape' && !modal.hidden) {
        close();
      }
    });
  }

  function open() {
    modal.hidden = false;
    document.body.classList.add('tt-search-locked');
    remoteDown = false;
    var active = activeTab === 'ai' ? aiInput : searchInput;
    setTimeout(function () { active.focus(); }, 0);
    if (activeTab === 'search' && searchInput.value.trim()) onInput();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('tt-search-locked');
  }

  function switchTab(name) {
    activeTab = name;
    modal.querySelectorAll('.tt-search-tab').forEach(function (tab) {
      var active = tab.dataset.tab === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    modal.querySelectorAll('.tt-search-panel').forEach(function (panel) {
      panel.hidden = panel.dataset.panel !== name;
    });
    if (name === 'ai') {
      searchInput.hidden = true;
      aiInput.hidden = false;
      aiInput.placeholder = aiChatActive ? 'Ask a follow-up question…' : 'Ask about the docs…';
      aiInput.focus();
      if (!KAPA_INTEGRATION_ID) preloadKapa();
    } else {
      aiInput.hidden = true;
      searchInput.hidden = false;
      searchInput.focus();
      if (searchInput.value.trim()) onInput();
    }
  }

  // Eagerly load the Kapa script without opening the modal.
  function preloadKapa() {
    if (kapaLoaded || !KAPA_SRC) return;
    kapaLoaded = true;
    var s = document.createElement('script');
    s.src = KAPA_SRC;
    document.head.appendChild(s);
  }

  // Load Kapa (if needed) then open its modal with an optional pre-filled query.
  // Closes our search modal first so both modals never overlap.
  function loadAndOpenKapa(query) {
    var opts = {};
    if (query) { opts.query = query; opts.submitQuery = true; }

    close();

    if (window.Kapa && typeof window.Kapa.open === 'function') {
      window.Kapa.open(opts);
      return;
    }
    if (!KAPA_SRC) return;
    if (!kapaLoaded) {
      kapaLoaded = true;
      var s = document.createElement('script');
      s.src = KAPA_SRC;
      document.head.appendChild(s);
    }
    var attempts = 0;
    var poll = setInterval(function () {
      if (window.Kapa && typeof window.Kapa.open === 'function') {
        clearInterval(poll);
        window.Kapa.open(opts);
      } else if (++attempts > 30) {
        clearInterval(poll);
      }
    }, 100);
  }

  // ── Ask AI inline chat (Kapa React SDK) ─────────────────────────────────

  function startAiChat(query) {
    aiChatActive = true;
    if (aiIntro)    aiIntro.hidden    = true;
    if (aiExamples) aiExamples.hidden = true;
    if (aiEmbed)    aiEmbed.hidden    = false;
    aiInput.value = '';
    aiInput.placeholder = 'Ask a follow-up question…';

    if (KAPA_INTEGRATION_ID) {
      mountKapaReact(query);
    } else {
      loadAndOpenKapa(query);
    }
  }

  function mountKapaReact(query) {
    if (!kapaReactMounted) {
      kapaReactMounted = true;
      window.KAPA_INTEGRATION_ID = KAPA_INTEGRATION_ID;
      if (aiEmbed) aiEmbed.dataset.initialQuery = query;

      // Inject importmap before the module so bare specifiers ('react', 'react-dom/client')
      // resolve to esm.sh — required for ?external=react,react-dom to share one instance.
      // This is a no-op if the rebuilt HTML already has the importmap in <head>.
      if (!document.querySelector('script[type="importmap"]')) {
        var imap = document.createElement('script');
        imap.type = 'importmap';
        imap.textContent = '{"imports":{"react":"https://esm.sh/react@18","react/jsx-runtime":"https://esm.sh/react@18/jsx-runtime","react-dom":"https://esm.sh/react-dom@18","react-dom/client":"https://esm.sh/react-dom@18/client"}}';
        document.head.appendChild(imap);
      }

      var s = document.createElement('script');
      s.type = 'module';
      s.textContent = KAPA_REACT_MODULE;
      document.head.appendChild(s);
    } else if (window.ttKapaSubmit) {
      window.ttKapaSubmit(query);
    } else {
      var attempts = 0;
      var poll = setInterval(function () {
        if (window.ttKapaSubmit) { clearInterval(poll); window.ttKapaSubmit(query); }
        else if (++attempts > 50) { clearInterval(poll); }
      }, 100);
    }
  }

  function resetAiChat() {
    aiChatActive = false;
    if (window.ttKapaReset) window.ttKapaReset();
    if (aiEmbed)    aiEmbed.hidden    = true;
    if (aiIntro)    aiIntro.hidden    = false;
    if (aiExamples) aiExamples.hidden = false;
    aiInput.value = '';
    aiInput.placeholder = 'Ask about the docs…';
    aiInput.focus();
  }

  // Inline ES-module: mounts the Kapa React SDK chat inside #tt-kapa-mount.
  // Loaded once, lazily, when the user first submits an AI question.
  var KAPA_REACT_MODULE = [
    "(async function(){",
    "try{",
    // ?external=react,react-dom tells esm.sh not to bundle React — use the importmap instead.
    "var m=await import('https://esm.sh/@kapaai/react-sdk?external=react,react-dom');",
    "var KapaProvider=m.KapaProvider,useChat=m.useChat;",
    // 'react' and 'react-dom/client' resolve via the importmap declared in <head>.
    "var r=await import('react');",
    "var h=r.createElement,useEffect=r.useEffect,useRef=r.useRef;",
    "var createRoot=(await import('react-dom/client')).createRoot;",
    "function Turn(props){",
    "  var ans=props.qa.answer;",
    "  return h('div',{className:'tt-chat-turn'},",
    "    h('div',{className:'tt-chat-q'},props.qa.question),",
    "    h('div',{className:'tt-chat-a'+(ans?'':' tt-chat-a--loading')},",
    "      ans||h('span',{className:'tt-chat-dots'},h('span'),h('span'),h('span'))",
    "    )",
    "  );",
    "}",
    "function Chat(){",
    "  var ref=useChat();",
    "  var conversation=ref.conversation,submitQuery=ref.submitQuery,resetConversation=ref.resetConversation;",
    "  var endRef=useRef(null);",
    "  useEffect(function(){",
    "    window.ttKapaSubmit=function(q){if(q)submitQuery(q);};",
    "    window.ttKapaReset=function(){resetConversation();};",
    "  },[submitQuery,resetConversation]);",
    "  useEffect(function(){if(endRef.current)endRef.current.scrollIntoView({behavior:'smooth'});},[conversation]);",
    "  return h('div',{className:'tt-chat-messages'},",
    "    conversation.map(function(qa,i){return h(Turn,{key:i,qa:qa});}),",
    "    h('div',{ref:endRef})",
    "  );",
    "}",
    "var el=document.getElementById('tt-kapa-mount');",
    "if(!el){console.error('[tt-search] #tt-kapa-mount not found');return;}",
    "var root=createRoot(el);",
    "root.render(h(KapaProvider,{integrationId:window.KAPA_INTEGRATION_ID},h(Chat)));",
    "var embedEl=document.getElementById('tt-kapa-embed');",
    "var initQ=embedEl&&embedEl.dataset.initialQuery;",
    "if(initQ){var t=setInterval(function(){if(window.ttKapaSubmit){clearInterval(t);window.ttKapaSubmit(initQ);}},50);}",
    "}catch(e){console.error('[tt-search] Kapa React SDK error:',e);}",
    "})();"
  ].join('\n');

  function onInput() {
    var q = searchInput.value.trim();

    if (debounceTimer) clearTimeout(debounceTimer);

    if (!q) {
      cancelInFlight();
      showEmpty('Start typing to search the documentation.');
      return;
    }

    // Immediate visual feedback while debounce + network round-trip is pending.
    showEmpty('Searching…');

    debounceTimer = setTimeout(function () { runSearch(q); }, DEBOUNCE_MS);
  }

  function onSearchKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var first = results.querySelector('a');
      if (first) window.location.href = first.href;
      // No fallback redirect — stay in the modal if results aren't ready yet.
    }
  }

  function onAiKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var q = aiInput.value.trim();
      if (q) startAiChat(q);
    }
  }

  function panelHidden(name) {
    var panel = modal.querySelector('.tt-search-panel[data-panel="' + name + '"]');
    return !panel || panel.hidden;
  }

  function cancelInFlight() {
    if (activeController) {
      activeController.abort();
      activeController = null;
    }
  }

  // ── Live search ─────────────────────────────────────────────────────────
  function runSearch(q) {
    if (remoteDown) {
      renderLocal(q);
      return;
    }

    cancelInFlight();
    var mySeq = ++seq;
    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    activeController = controller;

    fetch(remoteSearchUrl(q), { method: 'GET', signal: controller && controller.signal })
      .then(function (response) {
        if (!response.ok) throw new Error('Search request failed (' + response.status + ').');
        return response.json();
      })
      .then(function (payload) {
        if (mySeq !== seq) return;   // a newer query already superseded this one
        var hits = Array.isArray(payload && payload.hits) ? payload.hits : [];
        renderRemoteHits(q, hits);
      })
      .catch(function (err) {
        if (err && err.name === 'AbortError') return;
        // Remote failed for this query — show local results but retry remote next keystroke.
        loadIndex();
        renderLocal(q);
      });
  }

  function remoteSearchUrl(q) {
    return REMOTE.apiBase + '/v1/search?q=' + encodeURIComponent(q) +
      '&source=' + encodeURIComponent(REMOTE.sourceId);
  }

  function renderRemoteHits(q, hits) {
    if (!hits.length) {
      showEmpty('No results found.');
      return;
    }
    var rendered = hits.slice(0, MAX_HITS).map(function (hit) {
      var url = normalizeUrl(hit && hit.url, REMOTE.siteBaseUrl);
      return {
        url: url,
        title: cleanTitle(hit && hit.title) || pathLabel(url) || 'Untitled result',
        path: pathLabel(url)
      };
    });
    renderList(rendered);
  }

  function renderList(items) {
    results.innerHTML = '';
    empty.hidden = true;
    items.forEach(function (rec) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = rec.url;
      a.className = 'tt-search-result';
      a.innerHTML =
        '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
        '<path d="M4 2.5h6l2.5 2.5v8.5H4V2.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<path d="M9.5 2.5V5H12" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>' +
        '<span class="tt-search-result-main">' +
        '<span class="tt-search-result-title"></span>' +
        '<span class="tt-search-result-path"></span></span>';
      a.querySelector('.tt-search-result-title').textContent = rec.title;
      var pathEl = a.querySelector('.tt-search-result-path');
      if (rec.path) { pathEl.textContent = rec.path; } else { pathEl.remove(); }
      li.appendChild(a);
      results.appendChild(li);
    });
  }

  function showEmpty(message) {
    results.innerHTML = '';
    empty.textContent = message;
    empty.hidden = false;
  }

  // ── URL / title helpers (match the remote payload shape) ─────────────────
  function normalizeUrl(rawUrl, siteBaseUrl) {
    if (!rawUrl) return '#';
    try {
      var parsed = new URL(rawUrl, siteBaseUrl);
      // Rewrite canonical docs.tenstorrent.com links onto the current origin so
      // results resolve on previews / local builds too.
      if (parsed.hostname === 'docs.tenstorrent.com') {
        return window.location.origin + parsed.pathname + parsed.search + parsed.hash;
      }
      return parsed.toString();
    } catch (_err) {
      return rawUrl;
    }
  }

  function cleanTitle(title) {
    var raw = (title || '').trim();
    if (!raw) return '';
    return raw.replace(/\s+[—-]\s+.*documentation$/i, '').trim() || raw;
  }

  function pathLabel(url) {
    try {
      var u = new URL(url, REMOTE.siteBaseUrl);
      var path = u.pathname.replace(/^\/+/, '');
      if (!path || path === 'index.html') return 'Home';
      return decodeURIComponent(path);
    } catch (_err) {
      return '';
    }
  }

  // ── Sphinx-index fallback (only used when the remote API is down) ─────────
  function renderLocal(q) {
    if (!records) {
      showEmpty('Loading search index…');
      return;
    }
    var needle = q.toLowerCase();
    var hits = [];
    for (var i = 0; i < records.length && hits.length < MAX_HITS; i++) {
      if (records[i].title.toLowerCase().indexOf(needle) !== -1) {
        hits.push({ url: records[i].url, title: records[i].title, path: pathLabel(records[i].url) });
      }
    }
    if (!hits.length) {
      showEmpty('No results found.');
      return;
    }
    renderList(hits);
  }

  // Lazily pull Sphinx's searchindex.js. It calls Search.setIndex(obj); we shim
  // a minimal Search to capture that object, then build {title, url} records.
  function loadIndex() {
    if (records || indexLoading) return;
    indexLoading = true;

    var prev = window.Search;
    window.Search = {
      setIndex: function (idx) {
        try { records = buildRecords(idx); } catch (err) { records = []; }
        window.Search = prev;
        if (!modal.hidden && searchInput.value.trim()) renderLocal(searchInput.value.trim());
      }
    };

    var s = document.createElement('script');
    s.src = ROOT + 'searchindex.js';
    s.onerror = function () { records = []; window.Search = prev; };
    document.head.appendChild(s);
  }

  function buildRecords(idx) {
    var docnames = idx.docnames || [];
    var titles = idx.titles || [];
    var suffix = idx.docurls ? null : '.html';
    var out = [];
    for (var i = 0; i < docnames.length; i++) {
      var title = titles[i] || docnames[i];
      if (title === 'search' || docnames[i] === 'search') continue;
      out.push({ title: title, url: ROOT + docnames[i] + suffix });
    }
    return out;
  }
})();
