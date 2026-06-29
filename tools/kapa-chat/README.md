# tt-kapa-chat — inline Ask AI bundle

Builds `shared/_static/tt-kapa-chat.js`, the self-contained bundle that powers
the **Ask AI** tab inside the docs search modal.

## Why a bundle?

The Kapa React SDK (`@kapaai/react-sdk`) must share a single React instance with
the code that renders it, and it generates its own captcha token internally.
Loading it off a CDN with an importmap gives you two React copies → the classic
`Cannot read properties of null (reading 'useContext')` crash. Bundling React +
react-dom + the SDK together guarantees exactly one React instance, and keeps the
SDK's built-in captcha/fingerprint flow intact (so no direct, captcha-blocked API
calls).

## How it's wired

- `entry.jsx` exposes `window.ttKapaChat.mount(el, integrationId)`.
- The mounted `<Chat>` component publishes `window.ttKapaSubmit(query)` and
  `window.ttKapaReset()`.
- `shared/_static/tt-search.js` lazy-loads this bundle the first time the user
  opens the Ask AI tab, mounts it into `#tt-kapa-mount`, and drives it via those
  globals.

The integration ID comes from `data-kapa-integration-id` on the
`#tt-search-script` tag in each repo's `layout.html`.

## Rebuild

```bash
cd tools/kapa-chat
npm install
npm run build      # → ../../shared/_static/tt-kapa-chat.js
```

Commit the regenerated `shared/_static/tt-kapa-chat.js`. It is served from the
tenstorrent-sandbox GitHub Pages `_static/` dir to all four docs sites.
