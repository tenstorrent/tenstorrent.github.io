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
  var DEBOUNCE_MS = 180;
  var MAX_HITS = 8;

  var modal, input, results, empty, askQuery;
  var debounceTimer = null;
  var activeController = null;   // AbortController for the in-flight request
  var seq = 0;                   // guards against out-of-order responses
  var remoteDown = false;        // flips true once the remote API errors out

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
    input = document.getElementById('tt-search-input');
    results = document.getElementById('tt-search-results');
    empty = document.getElementById('tt-search-empty');
    askQuery = document.getElementById('tt-search-ask-query');

    document.querySelectorAll('.tt-search-trigger').forEach(function (el) {
      el.addEventListener('click', open);
    });

    modal.querySelectorAll('[data-search-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    modal.querySelectorAll('.tt-search-tab').forEach(function (tab) {
      tab.addEventListener('click', function () { switchTab(tab.dataset.tab); });
    });

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKeydown);

    var ask = document.getElementById('tt-search-ask');
    if (ask) ask.addEventListener('click', openKapa);

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
    setTimeout(function () { input.focus(); }, 0);
    // Re-run the current query so re-opening keeps showing results.
    if (input.value.trim()) onInput();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('tt-search-locked');
  }

  function switchTab(name) {
    if (name === 'ai') {
      openKapa();
      return;
    }
    modal.querySelectorAll('.tt-search-tab').forEach(function (tab) {
      var active = tab.dataset.tab === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    modal.querySelectorAll('.tt-search-panel').forEach(function (panel) {
      panel.hidden = panel.dataset.panel !== name;
    });
    input.focus();
  }

  function onInput() {
    var q = input.value.trim();
    askQuery.textContent = q || 'anything';

    if (debounceTimer) clearTimeout(debounceTimer);

    if (!q) {
      cancelInFlight();
      showEmpty('Start typing to search the documentation.');
      return;
    }

    debounceTimer = setTimeout(function () { runSearch(q); }, DEBOUNCE_MS);
  }

  function onKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!panelHidden('ai')) {
        openKapa();
        return;
      }
      var first = results.querySelector('a');
      // On the Search tab, jump straight to the top hit if there is one.
      if (first) {
        window.location.href = first.href;
      } else {
        submitSearch();
      }
    }
  }

  function panelHidden(name) {
    var panel = modal.querySelector('.tt-search-panel[data-panel="' + name + '"]');
    return !panel || panel.hidden;
  }

  // Send the query to Sphinx's built-in search page (works without a backend).
  function submitSearch() {
    var q = input.value.trim();
    if (!q) return;
    window.location.href = SEARCH_URL + '?q=' + encodeURIComponent(q);
  }

  // Close our modal and open the Kapa.ai widget with the current query pre-filled.
  function openKapa() {
    var q = input.value.trim();
    close();
    if (window.Kapa && typeof window.Kapa.open === 'function') {
      window.Kapa.open({ mode: 'ai', query: q || undefined });
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
        // Remote service is unreachable — degrade to the local Sphinx index.
        remoteDown = true;
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
      showEmpty('No matches. Press Enter to search all documentation.');
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
      showEmpty('No matches. Press Enter to search all documentation.');
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
        if (!modal.hidden && input.value.trim()) renderLocal(input.value.trim());
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
