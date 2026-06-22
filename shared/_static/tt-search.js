/* Tenstorrent docs — Search / Ask AI command modal.
 *
 * Opens from the navbar search button (or ⌘K / Ctrl+K). The Search tab does
 * live filtering over Sphinx's own search index; the Ask AI tab mirrors the
 * "Ask about …" prompt. Both fall back to Sphinx's /search page on Enter. */
(function () {
  'use strict';

  var script = document.getElementById('tt-search-script');
  // pathto('search') — e.g. "search.html" or "../search.html".
  var SEARCH_URL = (script && script.dataset.searchUrl) || 'search.html';
  // Everything before "search.html" is the docs root the index is relative to.
  var ROOT = SEARCH_URL.replace(/search\.html$/, '');

  var modal, input, results, empty, askQuery;
  var records = null;      // [{title, url}] built lazily from the index
  var indexLoading = false;

  document.addEventListener('DOMContentLoaded', init);

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
    if (ask) ask.addEventListener('click', submitSearch);

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
    loadIndex();
    setTimeout(function () { input.focus(); }, 0);
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('tt-search-locked');
  }

  function switchTab(name) {
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
    renderResults(q);
  }

  function onKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var first = results.querySelector('a');
      // On the Search tab, jump straight to the top hit if there is one.
      if (first && !panelHidden('search')) {
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

  function renderResults(q) {
    results.innerHTML = '';
    if (!q) {
      empty.textContent = 'Start typing to search the documentation.';
      empty.hidden = false;
      return;
    }
    if (!records) {
      empty.textContent = 'Loading search index…';
      empty.hidden = false;
      return;
    }

    var needle = q.toLowerCase();
    var hits = [];
    for (var i = 0; i < records.length && hits.length < 8; i++) {
      if (records[i].title.toLowerCase().indexOf(needle) !== -1) hits.push(records[i]);
    }

    if (!hits.length) {
      empty.textContent = 'No matches. Press Enter to search all documentation.';
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    hits.forEach(function (rec) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = rec.url;
      a.className = 'tt-search-result';
      a.innerHTML =
        '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
        '<path d="M4 2.5h6l2.5 2.5v8.5H4V2.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>' +
        '<path d="M9.5 2.5V5H12" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>' +
        '<span></span>';
      a.querySelector('span').textContent = rec.title;
      li.appendChild(a);
      results.appendChild(li);
    });
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
        if (!modal.hidden && input.value.trim()) renderResults(input.value.trim());
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
