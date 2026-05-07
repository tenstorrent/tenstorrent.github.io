# tensix-viz Repository — Design Spec

**Date:** 2026-05-07
**Repo:** `tsingletaryTT/tensix-viz` (migrate to `tenstorrent/tensix-viz` when ready to go official)
**Depends on:** `tt-vscode-toolkit` (add `tensix-viz` as a package dep)

---

## Problem

The `tensix-viz.js` chip renderer lives inside `tt-vscode-toolkit` with no versioning, no changelog, and no published API. Any project that wants to use it (docs, lessons, external tools) must copy the file manually. The renderer currently only visualizes a single chip — there is no way to show how chips compose into cards, systems, or cluster-scale topology.

## Goal

Extract `tensix-viz.js` into a standalone versioned library and extend it with a full hardware topology hierarchy: Tensix core → BH chip → P300c card → QB2 system → Galaxy BH server → Galaxy SuperCluster. The library should be usable from Sphinx docs (script tag, local file), VS Code lessons (ESM import), and the browser (CDN).

---

## Design Decisions

### 1. Repository & Distribution

**Repo:** `tsingletaryTT/tensix-viz` to start; move to `tenstorrent/tensix-viz` when ready for official release.

**Files shipped:**

| File | Purpose |
|------|---------|
| `tensix-viz.js` | IIFE bundle — zero deps, drop-in for current file, exports `window.TensixViz` + all new classes |
| `tensix-viz.esm.js` | ESM build for bundler users |
| `tensix-viz.css` | Base styles (extracted from tt-vscode-toolkit, same file as today) |
| `topologies/` | JSON config files describing each hardware level (see Section 4) |
| `README.md` | Installation, quick-start, full API reference, CDN URL, link to examples |
| `examples/index.html` | Self-contained runnable demo — all four classes, all animation modes, drill-down interaction. No server required — open directly in browser. |
| `package.json` | `name: "tensix-viz"`, `version: "1.0.0"`. Dev deps only: `esbuild`. No runtime dependencies. |
| `build.js` | Single esbuild script producing IIFE (`tensix-viz.js`) and ESM (`tensix-viz.esm.js`) from same source |

**CDN (convenience only — not a runtime dep for any Tenstorrent-shipped product):**
```
https://cdn.jsdelivr.net/gh/tsingletaryTT/tensix-viz@v1/tensix-viz.js
```
Always include SRI hash in examples to mitigate CDN compromise risk:
```html
<script src="https://cdn.jsdelivr.net/gh/tsingletaryTT/tensix-viz@v1/tensix-viz.js"
        integrity="sha384-..." crossorigin="anonymous"></script>
```

**Sphinx docs:** Copy `tensix-viz.js` locally into `_static/js/` — no CDN dependency. Already done for QB2 welcome page.

**VS Code lesson integration:** Add to `tt-vscode-toolkit/package.json`:
```json
"dependencies": {
  "tensix-viz": "github:tsingletaryTT/tensix-viz#v1"
}
```
Then in lesson code: `import { CardViz, SystemViz } from 'tensix-viz'`
When migrated to `tenstorrent/tensix-viz` and published to npm, this is a one-line dep change.

**Versioning:** Semver tags on GitHub. Consumers pin to major version (`@v1`).

**jsDelivr risk assessment:** CDN outage or compromise would only affect external developers using the CDN quick-start. Sphinx docs and VS Code lessons install the file locally/as a package dep — no CDN exposure. Risk is acceptable for the convenience use case; SRI hashes mitigate the compromise scenario.

---

### 2. Class Hierarchy

Four renderer classes, each composing the level below. Higher levels contain instances of lower-level renderers.

```
TensixViz     chip level     BH 17×12 or WH 10×12 core grid — existing, unchanged
CardViz       card level     P300c: 2 chips + intra-card ETH links
SystemViz     system level   QB2 / T3000 / other: N cards + inter-card links
ClusterViz    cluster level  Galaxy BH (32 chips) → Galaxy SC (128) → SuperCluster (4,608)
```

**Shared interface** — all four classes implement:

```js
viz.activate(mode)              // play a workload animation (inference, diffusion, agents, explore, idle)
viz.reset()                     // return to idle state
viz.highlight(indices)          // mark specific chips/cards/nodes by index
viz.transitionTo(level, opts)   // zoom into a child element (returns Promise)
viz.destroy()                   // clean up canvas contexts and event listeners
```

**TensixViz** (existing, constructor signature frozen):
```js
new TensixViz(canvas, { arch: 'blackhole' | 'wormhole' })
```
All existing methods (`.play()`, `.stepThrough()`, `.next()`, `.reset()`, `.renderLegend()`) preserved unchanged. No modifications to this class — it becomes Task 1 of the implementation plan only to the extent of extracting it from tt-vscode-toolkit into its own module.

**CardViz:**
```js
new CardViz(canvas, 'bh-p300c')
// or inline config:
new CardViz(canvas, { chips: ['bh-chip', 'bh-chip'], layout: 'horizontal', intra_links: [...] })
```
Renders two `TensixViz` instances side by side with ETH link lines drawn between them. Supports per-chip or whole-card animation modes.

**SystemViz:**
```js
new SystemViz(canvas, 'qb2')
```
Renders N `CardViz` instances with inter-card link connectors. QB2 = 2× bh-p300c connected via Samtec cable.

**ClusterViz:**
```js
new ClusterViz(canvas, 'bh-galaxy')
new ClusterViz(canvas, 'bh-galaxy-sc')
```
At small scale (≤32 chips): renders `SystemViz` instances with mesh topology links. At large scale (>64 chips): chips render as abstract colored tiles — individual core grids not shown, topology links drawn as lines. Transition between modes is automatic based on chip count in the config.

**HTML auto-init** (same pattern as existing `data-arch`):
```html
<canvas data-viz="card" data-config="bh-p300c" width="600" height="300"></canvas>
<canvas data-viz="system" data-config="qb2" width="800" height="400"></canvas>
```
The IIFE bundle scans for `data-viz` attributes on DOMContentLoaded and initializes automatically.

---

### 3. Transition System

**Interactive (user-driven):**
- Click a chip or card → zoom into that element
- Click background or breadcrumb → zoom out
- Breadcrumb renders above the canvas: `Cluster › Server › Card › Chip`
- Each breadcrumb segment is a clickable link back to that level

**Programmatic (lesson-driven):**
```js
await viz.transitionTo('card', { index: 0 })           // zoom into card 0
await viz.transitionTo('chip', { card: 0, chip: 1 })   // zoom into chip 1 of card 0
await viz.transitionTo('cluster')                       // zoom back out to top level
```
Returns a Promise that resolves when the transition animation completes. Lessons can `await` before running the next step.

**Mechanism:** The container is a positioned `<div>`. On transition, the target child animates to fill the container (`transform: scale()` + opacity cross-fade, ~300ms). Siblings fade out. No new canvas elements are created during transition — just CSS transforms on existing ones. This avoids re-initialization cost and keeps animation smooth.

**Depth limit at cluster scale:** SuperCluster (4,608 chips) does not render all the way to chip level in a single view. Clicking a Galaxy node in the cluster view transitions to a `SystemViz` for that server. From there you can drill into a card, then a chip. Maximum drill depth from any starting level: 3 transitions.

---

### 4. Topology Models

Hardware configs in `topologies/` as JSON. Renderers load by name or accept inline config objects. All link indices reference the hardware documentation.

**`topologies/bh-chip.json`** — Blackhole single chip
```json
{
  "arch": "blackhole",
  "cols": 17, "rows": 12,
  "dram_rows": [0, 11],
  "eth_cols": [0, 9],
  "pcie_col": 8,
  "eth_links": { "per_side": 2, "sides": ["N", "S", "E", "W"] }
}
```

**`topologies/wh-chip.json`** — Wormhole single chip
```json
{
  "arch": "wormhole",
  "cols": 10, "rows": 12,
  "eth_links": { "per_side": 4, "sides": ["N", "S", "E", "W"] }
}
```

**`topologies/bh-p300c.json`** — P300c card (2 BH chips)
```json
{
  "chips": ["bh-chip", "bh-chip"],
  "layout": "horizontal",
  "labels": ["ASIC1 (left)", "ASIC0 (right)"],
  "intra_links": [
    { "from": { "chip": 0, "eth": [10, 11] }, "to": { "chip": 1, "eth": [2, 3] } }
  ]
}
```
Source: P300c hardware documentation — Left ETH 10,11 ↔ Right ETH 2,3 for BH-to-BH intra-card link.

**`topologies/qb2.json`** — QB2 system (2× P300c)
```json
{
  "cards": ["bh-p300c", "bh-p300c"],
  "layout": "vertical",
  "labels": ["CARD 0", "CARD 1"],
  "inter_links": [
    { "connector": "samtec", "label": "Samtec cable · inter-card link", "from": { "card": 0 }, "to": { "card": 1 } }
  ]
}
```

**`topologies/bh-galaxy.json`** — Galaxy BH server (32 chips, 4×8 mesh)
```json
{
  "chips": 32,
  "grid": [4, 8],
  "arch": "blackhole",
  "mesh_links": "full_2d",
  "eth_ports": 56,
  "eth_speed": "800G"
}
```

**`topologies/bh-galaxy-sc.json`** — Galaxy SuperCluster (4× Galaxy = 128 chips)
```json
{
  "servers": 4,
  "server_config": "bh-galaxy",
  "topology": "2d_torus",
  "grid": [4, 32],
  "total_chips": 128
}
```

---

### 5. Integration

**Sphinx docs (existing pattern, no change to workflow):**
```html
<!-- local file, no CDN dependency -->
<script src="_static/tensix-viz.js"></script>
<canvas data-viz="system" data-config="qb2" width="800" height="400"></canvas>
```
Or manually from a `.. raw:: html` block in a `.md` file:
```js
const viz = new SystemViz(document.getElementById('qb2-canvas'), 'qb2')
viz.activate('inference')
```

**VS Code lessons (ESM import after adding package dep):**
```js
import { CardViz, SystemViz, ClusterViz } from 'tensix-viz'
const viz = new SystemViz(canvas, 'qb2')
await viz.transitionTo('card', { index: 0 })
await viz.activate('diffusion')
```

**CDN (README quick-start and examples/index.html only):**
```html
<script src="https://cdn.jsdelivr.net/gh/tsingletaryTT/tensix-viz@v1/tensix-viz.js"
        integrity="sha384-[hash]" crossorigin="anonymous"></script>
```

**Backward compatibility:** The `TensixViz` constructor signature is frozen. Any existing page using `new TensixViz(canvas, {arch: 'blackhole'})` works without changes after swapping the file.

---

## Content for `examples/index.html`

One section per class, each with a live canvas and controls:

1. **TensixViz** — BH chip idle + all 4 animation modes (inference, diffusion, agents, explore)
2. **CardViz** — P300c card with intra-card ETH links highlighted, per-chip vs whole-card animation
3. **SystemViz** — QB2 with inter-card Samtec link, workload animations across all 4 chips
4. **ClusterViz** — Galaxy BH mesh at server scale; Galaxy SC at cluster scale; drill-down interaction demo
5. **Programmatic control** — Code snippet + live demo showing `await viz.transitionTo()` and `await viz.activate()` chained together

---

## File Changes

| File | Change |
|------|--------|
| `tsingletaryTT/tensix-viz` | New GitHub repo |
| `tensix-viz.js` | IIFE bundle (source extracted from tt-vscode-toolkit) |
| `tensix-viz.esm.js` | ESM build output |
| `tensix-viz.css` | Extracted from tt-vscode-toolkit |
| `topologies/*.json` | New — 5 topology config files |
| `examples/index.html` | New — self-contained runnable demos |
| `README.md` | New — API reference + quick-start |
| `package.json` | New — package metadata + esbuild dev dep |
| `build.js` | New — esbuild script |
| `tt-vscode-toolkit/package.json` | Add `"tensix-viz": "github:tsingletaryTT/tensix-viz#v1"` |

---

## Migration Path

1. **Now:** `tsingletaryTT/tensix-viz` — personal repo, iterate freely
2. **When stable:** Transfer to `tenstorrent/tensix-viz`, publish `@tenstorrent/tensix-viz` on npm
3. **Update consumers:** Change `tt-vscode-toolkit` dep from `github:tsingletaryTT/...` to `@tenstorrent/tensix-viz`. Update CDN URL in docs/examples.
4. **Deprecate:** Remove `tensix-viz.js` from `tt-vscode-toolkit/src/webview/tensix-viz/` and replace all internal usages with the package import.

---

## Success Criteria

- `new TensixViz(canvas, {arch: 'blackhole'})` works identically to today — zero breaking changes
- `CardViz` correctly renders P300c intra-card ETH links (ETH 10,11 ↔ ETH 2,3)
- `SystemViz` correctly renders QB2 inter-card layout (2 cards, 4 chips, Samtec label)
- `ClusterViz` renders Galaxy BH at full 32-chip scale with mesh topology
- Drill-down transition completes in ≤300ms and resolves its Promise correctly
- `examples/index.html` opens in browser with no server and all demos run without console errors
- IIFE bundle loads without errors in Sphinx RTD build
- ESM build imports correctly from `tt-vscode-toolkit` after adding the package dep
