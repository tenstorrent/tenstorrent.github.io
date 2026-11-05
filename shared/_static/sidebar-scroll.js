/*
 * Sidebar scroll stability.
 *
 * The Read the Docs theme (theme.js) runs ThemeNav.reset() on every page load
 * and on hashchange. reset() locates the current page's nav link (rendered as
 * href="#") and calls scrollIntoView() on it, which snaps that link to the TOP
 * of the fixed, independently-scrolling sidebar (.wy-side-scroll). Because every
 * left-menu item is a real page link, each click is a full-page navigation -> on
 * the new page reset() fires and the menu visibly jumps/jitters to reposition
 * the active item at the top.
 *
 * Fix, in two parts:
 *   1. Suppress the scrollIntoView() call inside reset() (keeping its
 *      current-class / expand logic intact). reset() runs at DOMContentLoaded
 *      via jQuery's ready queue, so a plain "restore scroll afterwards" loses the
 *      race -- reset() runs last and re-scrolls. Replacing nav.reset HERE (at
 *      parse time, before theme.js's deferred enable() runs) means both the
 *      on-load reset and the hashchange-bound reset use the no-scroll version.
 *   2. Persist the sidebar's scroll position across navigations so the menu
 *      stays exactly where it was instead of resetting to the top.
 *
 * Loaded from the footer block (after theme.js defines SphinxRtdTheme, but
 * before its enable() fires on DOMContentLoaded).
 */
(function () {
  "use strict";

  var KEY = "tt-sidebar-scroll";

  function sidebar() {
    return document.querySelector(".wy-side-scroll");
  }

  // 1. Neutralize the scrollIntoView() that reset() performs on the active item.
  var nav = window.SphinxRtdTheme && window.SphinxRtdTheme.Navigation;
  if (nav && typeof nav.reset === "function" && !nav.__ttNoScroll) {
    nav.__ttNoScroll = true;
    var origReset = nav.reset;
    nav.reset = function () {
      var realScrollIntoView = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function () {};
      try {
        return origReset.apply(this, arguments);
      } finally {
        Element.prototype.scrollIntoView = realScrollIntoView;
      }
    };
  }

  // 2. Restore the saved scroll position; keep saving it as the user navigates.
  function restore() {
    var el = sidebar();
    if (!el) return;
    var saved = sessionStorage.getItem(KEY);
    if (saved !== null) el.scrollTop = parseInt(saved, 10) || 0;
  }

  function save() {
    var el = sidebar();
    if (!el) return;
    try {
      sessionStorage.setItem(KEY, String(el.scrollTop));
    } catch (e) {
      /* sessionStorage may be unavailable (privacy mode); fail quietly */
    }
  }

  restore();                                            // parse time (best effort)
  document.addEventListener("DOMContentLoaded", restore); // after layout is resolved
  window.addEventListener("pagehide", save);
  window.addEventListener("beforeunload", save);

  // 3. Keep the top-nav "Get Started" dropdown current on sub-sites that ship
  //    their own copy of the shared layout.
  //
  //    Several projects (tt-metal, tt-mlir, tt-xla, tt-lang, ...) vendor
  //    shared/_templates/layout.html into their own repo and publish under
  //    docs.tenstorrent.com/<project>/. Their copy of the Get Started dropdown
  //    goes stale whenever the Get Started section changes here, but every one
  //    of them loads THIS file from docs.tenstorrent.com/_static/ at runtime.
  //    So, when a page's dropdown predates the current Get Started section
  //    (detected by the absence of the Operating page), rewrite its entries to
  //    the list below. Pages whose dropdown is already current are untouched.
  //    Keep GET_STARTED in step with the dropdown in shared/_templates/layout.html.
  var GET_STARTED = [
    ["getting-started/README.html", "Installing Tenstorrent"],
    ["getting-started/tt-software-stack.html", "Building"],
    ["getting-started/operating-tt-software.html", "Operating"],
    ["getting-started/serve-models.html", "Serve Models"],
    ["getting-started/manual-software-install.html", "Manual Installation"]
  ];

  function refreshGetStarted() {
    var heads = document.querySelectorAll('.tt-nav-links a[href$="#get-started"]');
    for (var i = 0; i < heads.length; i++) {
      var head = heads[i];
      var menu = head.nextElementSibling;
      if (!menu || !menu.classList.contains("tt-nav-dropdown")) continue;
      if (menu.querySelector('a[href*="getting-started/operating-tt-software.html"]')) continue;
      var home = head.getAttribute("href").replace(/#get-started$/, "");
      var stale = menu.querySelectorAll('a[href*="getting-started/"]');
      for (var j = 0; j < stale.length; j++) menu.removeChild(stale[j]);
      var tail = menu.querySelector('a[href*="tt-vscode-toolkit"]'); // "Learn by Building" stays last
      for (var k = 0; k < GET_STARTED.length; k++) {
        var a = document.createElement("a");
        a.setAttribute("href", home + GET_STARTED[k][0]);
        a.textContent = GET_STARTED[k][1];
        menu.insertBefore(a, tail);
      }
    }
  }

  refreshGetStarted();                                            // nav is parsed before this footer script
  document.addEventListener("DOMContentLoaded", refreshGetStarted); // guard makes a second pass a no-op
})();
