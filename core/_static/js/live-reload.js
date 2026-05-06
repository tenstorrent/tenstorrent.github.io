/* Dev-only (TT_DOCS_LIVE=1): detect rebuilt HTML via Last-Modified + reload.
   Works with scripts/doc_preview.py (no WebSocket). Debounced to avoid reload storms. */
(function () {
  var lastMod = null;
  var cooldownUntil = 0;
  function tick() {
    var now = Date.now();
    if (now < cooldownUntil) return;
    var sep = window.location.pathname.indexOf("?") === -1 ? "?" : "&";
    var url = window.location.pathname + sep + "_doclive=" + now;
    fetch(url, { method: "HEAD", cache: "no-store", credentials: "same-origin" })
      .then(function (r) {
        var lm = r.headers.get("Last-Modified");
        if (lastMod !== null && lm && lm !== lastMod) {
          cooldownUntil = now + 1500;
          window.location.reload();
          return;
        }
        lastMod = lm || lastMod;
      })
      .catch(function () {});
  }
  tick();
  setInterval(tick, 650);
})();
