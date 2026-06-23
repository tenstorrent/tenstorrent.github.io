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

  // Kapa lazy-load state.
  var kapaLoaded = false;

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
      aiInput.placeholder = 'Ask about the docs…';
      aiInput.focus();
      preloadKapa();
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

  // ── Ask AI ──────────────────────────────────────────────────────────────

  function startAiChat(query) {
    aiInput.value = '';
    loadAndOpenKapa(query);
  }

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
