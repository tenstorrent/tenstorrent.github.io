# tensix-viz Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone versioned library at `~/code/tensix-viz/` that provides hierarchical hardware topology visualizations — from a single Tensix chip up to a Galaxy SuperCluster — with a shared `activate(mode)` / `transitionTo(level)` API and a zero-dependency IIFE bundle.

**Architecture:** Four renderer classes (`TensixViz`, `CardViz`, `SystemViz`, `ClusterViz`), each composing instances of the level below. Topology data lives in JSON config files bundled at build time by esbuild. The IIFE bundle exposes all four classes on `window`; the ESM build exports them as named exports. Transition animations are CSS transform + opacity cross-fades; the logic is inline in each renderer class (`CardViz`, `SystemViz`, `ClusterViz`) — no separate transition module.

**Tech Stack:** Vanilla JS (ES2020), esbuild (build), vitest (tests), JSON topology configs.

---

> **Important — new repo, not a worktree:** This plan builds a brand-new git repository at `~/code/tensix-viz/`. Create the directory, run `git init`, and work there. Do NOT make changes to `tenstorrent.github.io`.

---

## File Map

```
~/code/tensix-viz/
├── src/
│   ├── topology.js    — loadTopology() registry (imports all 8 JSONs)
│   ├── chip.js        — TensixViz (extracted from tt-vscode-toolkit + activate())
│   ├── card.js        — CardViz (2-chip card renderer)
│   ├── system.js      — SystemViz (N-card system renderer)
│   ├── cluster.js     — ClusterViz (server/cluster renderer)
│   └── index.js       — Entry point: exports, auto-init for data-viz + legacy attrs
├── topologies/
│   ├── bh-chip.json
│   ├── wh-chip.json
│   ├── bh-p300c.json
│   ├── wh-n300.json
│   ├── qb2.json
│   ├── t3000.json
│   ├── bh-galaxy.json
│   └── bh-galaxy-sc.json
├── tests/
│   ├── setup.js        — canvas + RAF + DOM mocks
│   ├── topology.test.js
│   ├── chip.test.js
│   ├── card.test.js
│   ├── system.test.js
│   ├── cluster.test.js
│   └── index.test.js
├── examples/
│   └── index.html
├── tensix-viz.js      (built — IIFE)
├── tensix-viz.esm.js  (built — ESM)
├── tensix-viz.css
├── build.js
├── vitest.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## Task 1: Repo Scaffolding

**Files:**
- Create: `~/code/tensix-viz/` (new git repo)
- Create: `package.json`
- Create: `vitest.config.js`
- Create: `tests/setup.js`
- Create: `.gitignore`
- Create: `build.js`

- [ ] **Step 1: Create repo directory and init git**

```bash
mkdir ~/code/tensix-viz
cd ~/code/tensix-viz
git init
mkdir -p src topologies tests examples
```

- [ ] **Step 2: Write package.json**

```json
{
  "name": "tensix-viz",
  "version": "1.0.0",
  "description": "Tenstorrent hardware topology visualizer — chip to cluster",
  "main": "tensix-viz.js",
  "module": "tensix-viz.esm.js",
  "type": "module",
  "scripts": {
    "build": "node build.js",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "esbuild": "^0.25.0",
    "vitest": "^3.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/tsingletaryTT/tensix-viz"
  },
  "license": "Apache-2.0"
}
```

- [ ] **Step 3: Install dev dependencies**

```bash
cd ~/code/tensix-viz
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 4: Write vitest.config.js**

```js
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    environment: 'node',
  },
})
```

- [ ] **Step 5: Write tests/setup.js (canvas + RAF + DOM mocks)**

```js
// tests/setup.js
// Mock browser globals so tests can run in Node.js without jsdom.

class MockCanvas {
  constructor() { this._w = 400; this._h = 300; this.style = {} }
  get width()  { return this._w }
  set width(v) { this._w = Number(v) }
  get height()  { return this._h }
  set height(v) { this._h = Number(v) }
  getContext() {
    return {
      clearRect: () => {}, fillRect: () => {}, beginPath: () => {},
      moveTo: () => {}, lineTo: () => {}, quadraticCurveTo: () => {},
      closePath: () => {}, fill: () => {}, stroke: () => {}, arc: () => {},
      save: () => {}, restore: () => {}, scale: () => {},
      setLineDash: () => {}, fillText: () => {},
      measureText: () => ({ width: 50 }),
      fillStyle: '', strokeStyle: '', lineWidth: 0, globalAlpha: 1,
      font: '', textAlign: '', textBaseline: '',
      shadowColor: '', shadowBlur: 0,
    }
  }
}

class MockElement {
  constructor(tag) {
    this._tag = tag
    this._children = []
    this.style = {}
    this.dataset = {}
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c),
    }
    this.innerHTML = ''
    if (tag === 'canvas') Object.assign(this, new MockCanvas())
  }
  appendChild(child) { this._children.push(child); return child }
  querySelectorAll(sel) { return [] }
  querySelector(sel) { return null }
  get children() { return this._children }
  addEventListener() {}
  removeEventListener() {}
}

globalThis.HTMLCanvasElement = MockCanvas

globalThis.document = {
  createElement: (tag) => new MockElement(tag),
  querySelectorAll: () => [],
  readyState: 'complete',
  addEventListener: () => {},
}

globalThis.requestAnimationFrame = (fn) => setTimeout(fn, 16)
globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
globalThis.performance = { now: () => Date.now() }
globalThis.window = {
  devicePixelRatio: 1,
  TensixViz: undefined, CardViz: undefined,
  SystemViz: undefined, ClusterViz: undefined,
}
```

- [ ] **Step 6: Write build.js**

```js
// build.js
import esbuild from 'esbuild'

async function build() {
  const shared = {
    entryPoints: ['src/index.js'],
    bundle: true,
    loader: { '.json': 'json' },
    sourcemap: false,
    minify: false,
  }

  // IIFE: all classes on window.*
  await esbuild.build({
    ...shared,
    format: 'iife',
    globalName: '_TensixVizBundle',
    outfile: 'tensix-viz.js',
    footer: {
      js: [
        'window.TensixViz  = _TensixVizBundle.TensixViz;',
        'window.CardViz    = _TensixVizBundle.CardViz;',
        'window.SystemViz  = _TensixVizBundle.SystemViz;',
        'window.ClusterViz = _TensixVizBundle.ClusterViz;',
      ].join('\n'),
    },
  })

  // ESM: named exports for bundlers
  await esbuild.build({
    ...shared,
    format: 'esm',
    outfile: 'tensix-viz.esm.js',
  })

  console.log('Build complete: tensix-viz.js + tensix-viz.esm.js')
}

build().catch(err => { console.error(err); process.exit(1) })
```

- [ ] **Step 7: Write .gitignore**

```
node_modules/
*.log
.DS_Store
```

- [ ] **Step 8: Commit**

```bash
cd ~/code/tensix-viz
git add -A
git commit -m "chore: repo scaffolding — package.json, build.js, vitest, test setup"
```

---

## Task 2: Topology Loader + JSON Configs

**Files:**
- Create: `src/topology.js`
- Create: `topologies/bh-chip.json`
- Create: `topologies/wh-chip.json`
- Create: `topologies/bh-p300c.json`
- Create: `topologies/wh-n300.json`
- Create: `topologies/qb2.json`
- Create: `topologies/t3000.json`
- Create: `topologies/bh-galaxy.json`
- Create: `topologies/bh-galaxy-sc.json`
- Create: `tests/topology.test.js`

- [ ] **Step 1: Write the failing tests**

```js
// tests/topology.test.js
import { describe, it, expect } from 'vitest'
import { loadTopology } from '../src/topology.js'

describe('loadTopology', () => {
  it('loads bh-chip by name', () => {
    const t = loadTopology('bh-chip')
    expect(t.arch).toBe('blackhole')
    expect(t.cols).toBe(17)
    expect(t.rows).toBe(12)
  })

  it('loads wh-chip by name', () => {
    const t = loadTopology('wh-chip')
    expect(t.arch).toBe('wormhole')
    expect(t.cols).toBe(10)
    expect(t.rows).toBe(12)
  })

  it('loads bh-p300c with two chips and intra_links', () => {
    const t = loadTopology('bh-p300c')
    expect(t.chips).toHaveLength(2)
    expect(t.intra_links).toHaveLength(1)
    expect(t.intra_links[0].from.eth).toEqual([10, 11])
    expect(t.intra_links[0].to.eth).toEqual([2, 3])
  })

  it('loads wh-n300 with two chips and intra_links', () => {
    const t = loadTopology('wh-n300')
    expect(t.chips).toHaveLength(2)
    expect(t.intra_links[0].link_count).toBe(2)
  })

  it('loads qb2 with two cards', () => {
    const t = loadTopology('qb2')
    expect(t.cards).toHaveLength(2)
    expect(t.inter_links[0].connector).toBe('samtec')
  })

  it('loads t3000 with four cards in a grid', () => {
    const t = loadTopology('t3000')
    expect(t.cards).toHaveLength(4)
    expect(t.grid).toEqual([2, 4])
  })

  it('loads bh-galaxy with 32 chips', () => {
    const t = loadTopology('bh-galaxy')
    expect(t.chips).toBe(32)
    expect(t.grid).toEqual([4, 8])
  })

  it('loads bh-galaxy-sc with 128 total chips', () => {
    const t = loadTopology('bh-galaxy-sc')
    expect(t.total_chips).toBe(128)
  })

  it('returns inline config objects unchanged', () => {
    const cfg = { arch: 'blackhole', cols: 17, rows: 12 }
    expect(loadTopology(cfg)).toBe(cfg)
  })

  it('throws for unknown topology name', () => {
    expect(() => loadTopology('foobar')).toThrow('Unknown topology: "foobar"')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd ~/code/tensix-viz
npm test
```

Expected: FAIL — `Cannot find module '../src/topology.js'`

- [ ] **Step 3: Write all 8 topology JSON files**

```json
// topologies/bh-chip.json
{
  "arch": "blackhole",
  "cols": 17,
  "rows": 12,
  "dram_rows": [0, 11],
  "eth_cols": [0, 16],
  "pcie_col": 8,
  "compute_grid": { "col_start": 1, "col_end": 15, "row_start": 1, "row_end": 10 },
  "eth_links": { "per_side": 2, "sides": ["N", "S", "E", "W"] }
}
```

```json
// topologies/wh-chip.json
{
  "arch": "wormhole",
  "cols": 10,
  "rows": 12,
  "dram_rows": [0, 9],
  "eth_cols": [0, 9],
  "compute_grid": { "col_start": 1, "col_end": 8, "row_start": 1, "row_end": 8 },
  "eth_links": { "per_side": 4, "sides": ["N", "S", "E", "W"] }
}
```

```json
// topologies/bh-p300c.json
{
  "chips": ["bh-chip", "bh-chip"],
  "layout": "horizontal",
  "labels": ["ASIC1 (left)", "ASIC0 (right)"],
  "intra_links": [
    { "from": { "chip": 0, "eth": [10, 11] }, "to": { "chip": 1, "eth": [2, 3] } }
  ]
}
```

```json
// topologies/wh-n300.json
{
  "chips": ["wh-chip", "wh-chip"],
  "layout": "horizontal",
  "labels": ["Left (L)", "Right (R)"],
  "intra_links": [
    { "from": { "chip": 0 }, "to": { "chip": 1 }, "link_count": 2, "speed_gbps": 100 }
  ]
}
```

```json
// topologies/qb2.json
{
  "cards": ["bh-p300c", "bh-p300c"],
  "layout": "vertical",
  "labels": ["CARD 0", "CARD 1"],
  "inter_links": [
    { "connector": "samtec", "label": "Samtec cable · inter-card link", "from": { "card": 0 }, "to": { "card": 1 } }
  ]
}
```

```json
// topologies/t3000.json
{
  "cards": ["wh-n300", "wh-n300", "wh-n300", "wh-n300"],
  "layout": "grid",
  "grid": [2, 4],
  "labels": ["Card 0", "Card 1", "Card 2", "Card 3"],
  "inter_links": [
    { "topology": "2d_mesh", "link_count": 2, "speed_gbps": 100 }
  ]
}
```

```json
// topologies/bh-galaxy.json
{
  "chips": 32,
  "grid": [4, 8],
  "arch": "blackhole",
  "mesh_links": "full_2d",
  "eth_ports": 56,
  "eth_speed": "800G"
}
```

```json
// topologies/bh-galaxy-sc.json
{
  "servers": 4,
  "server_config": "bh-galaxy",
  "topology": "2d_torus",
  "grid": [4, 32],
  "total_chips": 128
}
```

- [ ] **Step 4: Write src/topology.js**

```js
// src/topology.js
import bhChip     from '../topologies/bh-chip.json'     assert { type: 'json' }
import whChip     from '../topologies/wh-chip.json'     assert { type: 'json' }
import bhP300c    from '../topologies/bh-p300c.json'    assert { type: 'json' }
import whN300     from '../topologies/wh-n300.json'     assert { type: 'json' }
import qb2        from '../topologies/qb2.json'         assert { type: 'json' }
import t3000      from '../topologies/t3000.json'       assert { type: 'json' }
import bhGalaxy   from '../topologies/bh-galaxy.json'   assert { type: 'json' }
import bhGalaxySc from '../topologies/bh-galaxy-sc.json' assert { type: 'json' }

const REGISTRY = {
  'bh-chip':       bhChip,
  'wh-chip':       whChip,
  'bh-p300c':      bhP300c,
  'wh-n300':       whN300,
  'qb2':           qb2,
  't3000':         t3000,
  'bh-galaxy':     bhGalaxy,
  'bh-galaxy-sc':  bhGalaxySc,
}

/**
 * Resolve a topology config by name or return an inline config object as-is.
 * @param {string|object} nameOrConfig
 * @returns {object}
 */
export function loadTopology(nameOrConfig) {
  if (typeof nameOrConfig === 'string') {
    const topo = REGISTRY[nameOrConfig]
    if (!topo) {
      throw new Error(
        `Unknown topology: "${nameOrConfig}". Available: ${Object.keys(REGISTRY).join(', ')}`
      )
    }
    return topo
  }
  return nameOrConfig
}
```

Note: esbuild handles JSON imports natively without the `assert` clause — but the `assert { type: 'json' }` is needed for Node.js ESM (which vitest uses). If vitest complains, add `"--experimental-vm-modules"` to the test runner or replace static imports with:
```js
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bhChip = require('../topologies/bh-chip.json')
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd ~/code/tensix-viz
npm test -- topology.test.js
```

Expected: 10/10 PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: topology loader + 8 hardware config JSON files"
```

---

## Task 3: Extract TensixViz (src/chip.js)

Source: `~/code/tt-vscode-toolkit/src/webview/tensix-viz/tensix-viz.js` (817 lines)

**Files:**
- Create: `src/chip.js`
- Create: `tests/chip.test.js`

The source file is an IIFE. This task converts it to an ES module and adds `activate(mode)`.

- [ ] **Step 1: Write the failing tests**

```js
// tests/chip.test.js
import { describe, it, expect, vi } from 'vitest'
import { TensixViz } from '../src/chip.js'

function makeCanvas() {
  const c = document.createElement('canvas')
  c.width = 340; c.height = 240
  return c
}

describe('TensixViz', () => {
  it('constructs without throwing for blackhole', () => {
    expect(() => new TensixViz(makeCanvas(), { arch: 'blackhole' })).not.toThrow()
  })

  it('constructs without throwing for wormhole', () => {
    expect(() => new TensixViz(makeCanvas(), { arch: 'wormhole' })).not.toThrow()
  })

  it('reset() does not throw', () => {
    const viz = new TensixViz(makeCanvas(), { arch: 'blackhole' })
    expect(() => viz.reset()).not.toThrow()
  })

  it('activate("idle") does not throw', () => {
    const viz = new TensixViz(makeCanvas(), { arch: 'blackhole' })
    expect(() => viz.activate('idle')).not.toThrow()
    viz.reset()
  })

  it('activate("inference") does not throw', () => {
    const viz = new TensixViz(makeCanvas(), { arch: 'blackhole' })
    expect(() => viz.activate('inference')).not.toThrow()
    viz.reset()
  })

  it('activate("diffusion") does not throw', () => {
    const viz = new TensixViz(makeCanvas(), { arch: 'blackhole' })
    expect(() => viz.activate('diffusion')).not.toThrow()
    viz.reset()
  })

  it('activate("agents") does not throw', () => {
    const viz = new TensixViz(makeCanvas(), { arch: 'blackhole' })
    expect(() => viz.activate('agents')).not.toThrow()
    viz.reset()
  })

  it('activate("explore") does not throw', () => {
    const viz = new TensixViz(makeCanvas(), { arch: 'blackhole' })
    expect(() => viz.activate('explore')).not.toThrow()
    viz.reset()
  })

  it('activate with unknown mode throws', () => {
    const viz = new TensixViz(makeCanvas(), { arch: 'blackhole' })
    expect(() => viz.activate('unknown')).toThrow('Unknown animation mode: "unknown"')
  })

  it('play() accepts a valid script', () => {
    const viz = new TensixViz(makeCanvas(), { arch: 'blackhole' })
    expect(() => viz.play([{ step: 'pause', ms: 10 }])).not.toThrow()
    viz.reset()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd ~/code/tensix-viz
npm test -- chip.test.js
```

Expected: FAIL — `Cannot find module '../src/chip.js'`

- [ ] **Step 3: Create src/chip.js by copying and transforming the source**

Copy `~/code/tt-vscode-toolkit/src/webview/tensix-viz/tensix-viz.js` to `src/chip.js`, then apply these three changes:

**Change 1 — Remove the IIFE wrapper.** The source starts with:
```js
(function (global) {
  'use strict';
  // ... 815 lines ...
  global.TensixViz = TensixViz;
  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', TensixViz.autoInit);
  } else {
    TensixViz.autoInit();
  }
}(typeof window !== 'undefined' ? window : this));
```

Replace with:
```js
// src/chip.js — TensixViz ES module (extracted from tt-vscode-toolkit)
'use strict';

// ... paste all the internal code unchanged ...

// Auto-init is now handled by src/index.js — do NOT call it here.
// (Removed: global.TensixViz = TensixViz and the DOMContentLoaded block)

export { TensixViz };
export default TensixViz;
```

**Change 2 — Add `activate(mode, opts)` method** (append after the `_stepPause` method, before the `_floatLabel` method):

```js
// ─── Named animation modes (continuous RAF loop) ──────────────────────────

TensixViz.prototype.activate = function (mode, opts) {
  this.reset();                                // stop any existing animation
  opts = opts || {};

  var chip = this.chip;
  var cg   = chip.computeGrid;
  var W    = cg.colEnd   - cg.colStart + 1;   // number of compute cols
  var H    = cg.rowEnd   - cg.rowStart + 1;   // number of compute rows

  var t    = opts.phaseOffset || 0;           // animation time, increments each frame
  var gen  = this._animGen;
  var self = this;

  // prev[r][c] = 0..1, 0-based compute grid indices (for decay-based modes)
  var prev = [];
  for (var r = 0; r < H; r++) {
    prev[r] = [];
    for (var c = 0; c < W; c++) prev[r][c] = 0;
  }

  var MODES = {
    idle: function (c, r) {
      return Math.min(1, prev[r][c] * 0.90 + (Math.random() < 0.03 ? Math.random() * 0.35 : 0));
    },
    inference: function (c, r) {
      var wave = (t % 1) * W;
      return Math.max(0, 1 - Math.abs(c - wave) / 3) * 0.9;
    },
    diffusion: function (c, r) {
      var cx = W / 2, cy = H / 2;
      var dist = Math.sqrt((c - cx) * (c - cx) + (r - cy) * (r - cy));
      var ring = (t % 1) * Math.sqrt(cx * cx + cy * cy);
      return Math.max(0, 1 - Math.abs(dist - ring) / 2) * 0.9;
    },
    agents: function (c, r) {
      return Math.min(1, prev[r][c] * 0.85 + (Math.random() < 0.06 ? Math.random() * 0.8 : 0));
    },
    explore: function (c, r) {
      return (Math.sin(c * 0.6 + t * Math.PI * 4) * Math.cos(r * 0.4 + t * Math.PI * 2) + 1) / 2 * 0.85;
    },
  };

  var fn = MODES[mode];
  if (!fn) throw new Error('Unknown animation mode: "' + mode + '"');

  self._running = true;

  function tick() {
    if (self._animGen !== gen) return;
    t += 0.012;

    var next = [];
    var hmap = [];

    for (var r = 0; r < H; r++) {
      next[r] = [];
      var row = r + cg.rowStart;
      if (!hmap[row]) hmap[row] = [];
      for (var c = 0; c < W; c++) {
        var col = c + cg.colStart;
        var v   = fn(c, r);
        next[r][c]   = v;
        hmap[row][col] = v;
      }
    }

    prev         = next;
    self._heatmap = hmap;
    self.render();
    self._rafId  = requestAnimationFrame(tick);
  }

  self._rafId = requestAnimationFrame(tick);
};
```

**Change 3 — Remove the auto-init call at the bottom of the file** (keep `TensixViz.autoInit` function definition — it will be called from `index.js`):

Remove these lines from the end of the file (before the export):
```js
// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', TensixViz.autoInit);
} else {
  TensixViz.autoInit();
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd ~/code/tensix-viz
npm test -- chip.test.js
```

Expected: 10/10 PASS

- [ ] **Step 5: Commit**

```bash
git add src/chip.js tests/chip.test.js
git commit -m "feat: TensixViz ES module — extracted from tt-vscode-toolkit + activate(mode)"
```

---

## Task 4: CardViz

**Files:**
- Create: `src/card.js`
- Create: `tests/card.test.js`

CardViz renders 2 chip canvases side by side inside a container `<div>` it owns. It draws ETH link indicators between them.

- [ ] **Step 1: Write the failing tests**

```js
// tests/card.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { CardViz } from '../src/card.js'

function makeDiv() {
  const el = document.createElement('div')
  el._children = []
  return el
}

describe('CardViz', () => {
  let container

  beforeEach(() => { container = makeDiv() })

  it('creates two chip canvases for bh-p300c', () => {
    const viz = new CardViz(container, 'bh-p300c')
    expect(container.children.length).toBeGreaterThanOrEqual(2)
    viz.destroy()
  })

  it('creates two chip canvases for wh-n300', () => {
    const viz = new CardViz(container, 'wh-n300')
    expect(container.children.length).toBeGreaterThanOrEqual(2)
    viz.destroy()
  })

  it('activate("inference") does not throw', () => {
    const viz = new CardViz(container, 'bh-p300c')
    expect(() => viz.activate('inference')).not.toThrow()
    viz.destroy()
  })

  it('reset() does not throw', () => {
    const viz = new CardViz(container, 'bh-p300c')
    expect(() => viz.reset()).not.toThrow()
    viz.destroy()
  })

  it('highlight([0]) does not throw', () => {
    const viz = new CardViz(container, 'bh-p300c')
    expect(() => viz.highlight([0])).not.toThrow()
    viz.destroy()
  })

  it('transitionTo("chip", {index:0}) returns a Promise', () => {
    const viz = new CardViz(container, 'bh-p300c')
    const p = viz.transitionTo('chip', { index: 0 })
    expect(p).toBeInstanceOf(Promise)
    viz.destroy()
  })

  it('destroy() empties the container', () => {
    const viz = new CardViz(container, 'bh-p300c')
    viz.destroy()
    expect(container.children.length).toBe(0)
  })

  it('throws for unknown config name', () => {
    expect(() => new CardViz(container, 'bad-config')).toThrow()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- card.test.js
```

Expected: FAIL — `Cannot find module '../src/card.js'`

- [ ] **Step 3: Write src/card.js**

```js
// src/card.js
import { TensixViz } from './chip.js'
import { loadTopology } from './topology.js'

/**
 * CardViz — renders a 2-chip card (P300c BH or n300 WH) with intra-card ETH
 * link visualization. Manages its own child canvases inside the container div.
 *
 * @param {HTMLElement} container  - The div that CardViz owns
 * @param {string|object} config   - Topology name ('bh-p300c', 'wh-n300') or inline config
 */
export function CardViz(container, config) {
  this._container = container
  this._topo      = loadTopology(config)
  this._chips     = []   // TensixViz instances, one per chip
  this._chipEls   = []   // wrapper divs
  this._zoomed    = -1   // index of currently zoomed chip, or -1
  this._breadcrumb = null
  this._init()
}

CardViz.prototype._init = function () {
  const self   = this
  const topo   = this._topo
  const container = this._container

  container.classList.add('tv-card')

  topo.chips.forEach(function (chipName, i) {
    // Chip wrapper div
    const wrapper = document.createElement('div')
    wrapper.classList.add('tv-chip-wrapper')
    wrapper.dataset.chipIndex = String(i)

    // Label
    const label = document.createElement('div')
    label.classList.add('tv-chip-label')
    label.textContent = (topo.labels && topo.labels[i]) || ('Chip ' + i)
    wrapper.appendChild(label)

    // Canvas
    const canvas = document.createElement('canvas')
    canvas.width  = 340
    canvas.height = 240
    wrapper.appendChild(canvas)

    container.appendChild(wrapper)
    self._chipEls.push(wrapper)

    const chipTopo = loadTopology(chipName)
    const viz = new TensixViz(canvas, { arch: chipTopo.arch })
    self._chips.push(viz)
    viz.activate('idle')

    // ETH link divider between chips (except after last)
    if (i < topo.chips.length - 1) {
      const link = document.createElement('div')
      link.classList.add('tv-card-link')
      link.title = 'Intra-card ETH link'
      container.appendChild(link)
    }
  })
}

CardViz.prototype.activate = function (mode) {
  this._chips.forEach(function (chip, i) {
    setTimeout(function () { chip.activate(mode) }, i * 120)
  })
}

CardViz.prototype.reset = function () {
  this._chips.forEach(function (chip) { chip.reset() })
}

CardViz.prototype.highlight = function (indices) {
  // Highlight specific chip wrappers by adding a CSS class
  const self = this
  this._chipEls.forEach(function (el, i) {
    if (indices.indexOf(i) !== -1) {
      el.classList.add('tv-highlighted')
    } else {
      el.classList.remove('tv-highlighted')
    }
  })
}

CardViz.prototype.transitionTo = function (level, opts) {
  const self = this
  opts = opts || {}

  if (level === 'chip') {
    const idx = opts.index || 0
    this._zoomed = idx
    this._chipEls.forEach(function (el, i) {
      if (i === idx) {
        el.classList.add('tv-active')
        el.classList.remove('tv-hidden')
      } else {
        el.classList.remove('tv-active')
        el.classList.add('tv-hidden')
      }
    })
    this._container.classList.add('tv-zoomed-in')
    this._showBreadcrumb('Card › Chip ' + idx)
  } else {
    // Zoom out
    this._zoomed = -1
    this._chipEls.forEach(function (el) {
      el.classList.remove('tv-active', 'tv-hidden')
    })
    this._container.classList.remove('tv-zoomed-in')
    this._hideBreadcrumb()
  }

  return new Promise(function (resolve) { setTimeout(resolve, 300) })
}

CardViz.prototype._showBreadcrumb = function (text) {
  if (!this._breadcrumb) {
    this._breadcrumb = document.createElement('div')
    this._breadcrumb.classList.add('tv-breadcrumb')
    this._container.insertBefore(this._breadcrumb, this._container.children[0])
  }
  this._breadcrumb.textContent = text
  this._breadcrumb.style.display = 'block'
}

CardViz.prototype._hideBreadcrumb = function () {
  if (this._breadcrumb) this._breadcrumb.style.display = 'none'
}

CardViz.prototype.destroy = function () {
  this._chips.forEach(function (chip) { chip.reset() })
  this._chips = []
  this._chipEls = []
  // Clear all children
  while (this._container.children && this._container.children.length > 0) {
    this._container.children[0].remove
      ? this._container.children[0].remove()
      : this._container._children.shift()
  }
  this._container._children = []
  this._container.innerHTML = ''
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- card.test.js
```

Expected: 8/8 PASS

- [ ] **Step 5: Commit**

```bash
git add src/card.js tests/card.test.js
git commit -m "feat: CardViz — 2-chip card renderer with ETH link divider"
```

---

## Task 5: SystemViz

**Files:**
- Create: `src/system.js`
- Create: `tests/system.test.js`

SystemViz renders N cards (each a CardViz instance) in a grid layout. For QB2: 2 cards vertical. For T3000: 4 cards in a 2×4 grid.

- [ ] **Step 1: Write the failing tests**

```js
// tests/system.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { SystemViz } from '../src/system.js'

function makeDiv() {
  const el = document.createElement('div')
  el._children = []
  return el
}

describe('SystemViz', () => {
  let container

  beforeEach(() => { container = makeDiv() })

  it('creates two card wrappers for qb2', () => {
    const viz = new SystemViz(container, 'qb2')
    expect(container.children.length).toBeGreaterThanOrEqual(2)
    viz.destroy()
  })

  it('creates four card wrappers for t3000', () => {
    const viz = new SystemViz(container, 't3000')
    expect(container.children.length).toBeGreaterThanOrEqual(4)
    viz.destroy()
  })

  it('activate("inference") does not throw', () => {
    const viz = new SystemViz(container, 'qb2')
    expect(() => viz.activate('inference')).not.toThrow()
    viz.destroy()
  })

  it('reset() does not throw', () => {
    const viz = new SystemViz(container, 'qb2')
    expect(() => viz.reset()).not.toThrow()
    viz.destroy()
  })

  it('transitionTo("card", {index:0}) returns a Promise', () => {
    const viz = new SystemViz(container, 'qb2')
    const p = viz.transitionTo('card', { index: 0 })
    expect(p).toBeInstanceOf(Promise)
    viz.destroy()
  })

  it('transitionTo("chip", {card:0, chip:1}) returns a Promise', () => {
    const viz = new SystemViz(container, 'qb2')
    const p = viz.transitionTo('chip', { card: 0, chip: 1 })
    expect(p).toBeInstanceOf(Promise)
    viz.destroy()
  })

  it('destroy() empties the container', () => {
    const viz = new SystemViz(container, 'qb2')
    viz.destroy()
    expect(container._children.length).toBe(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- system.test.js
```

Expected: FAIL — `Cannot find module '../src/system.js'`

- [ ] **Step 3: Write src/system.js**

```js
// src/system.js
import { CardViz } from './card.js'
import { loadTopology } from './topology.js'

/**
 * SystemViz — renders a multi-card system (QB2: 2 cards, T3000: 4 cards).
 * Each card is a CardViz instance in its own wrapper div.
 *
 * @param {HTMLElement} container
 * @param {string|object} config  - 'qb2', 't3000', or inline config
 */
export function SystemViz(container, config) {
  this._container = container
  this._topo      = loadTopology(config)
  this._cards     = []   // CardViz instances
  this._cardEls   = []   // wrapper divs
  this._breadcrumb = null
  this._init()
}

SystemViz.prototype._init = function () {
  const self   = this
  const topo   = this._topo
  const container = this._container

  container.classList.add('tv-system')

  topo.cards.forEach(function (cardName, i) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('tv-card-wrapper')
    wrapper.dataset.cardIndex = String(i)

    const label = document.createElement('div')
    label.classList.add('tv-system-card-label')
    label.textContent = (topo.labels && topo.labels[i]) || ('Card ' + i)
    wrapper.appendChild(label)

    container.appendChild(wrapper)
    self._cardEls.push(wrapper)

    const card = new CardViz(wrapper, cardName)
    self._cards.push(card)

    // Inter-card link divider
    if (i < topo.cards.length - 1 && topo.inter_links && topo.inter_links.length) {
      const link = document.createElement('div')
      link.classList.add('tv-system-link')
      const linkDef = topo.inter_links[0]
      link.textContent = linkDef.label || (linkDef.connector || linkDef.topology || 'link')
      container.appendChild(link)
    }
  })
}

SystemViz.prototype.activate = function (mode) {
  this._cards.forEach(function (card, i) {
    setTimeout(function () { card.activate(mode) }, i * 150)
  })
}

SystemViz.prototype.reset = function () {
  this._cards.forEach(function (card) { card.reset() })
}

SystemViz.prototype.highlight = function (indices) {
  const self = this
  this._cardEls.forEach(function (el, i) {
    if (indices.indexOf(i) !== -1) el.classList.add('tv-highlighted')
    else el.classList.remove('tv-highlighted')
  })
}

SystemViz.prototype.transitionTo = function (level, opts) {
  opts = opts || {}

  if (level === 'card') {
    const idx = opts.index !== undefined ? opts.index : 0
    this._cardEls.forEach(function (el, i) {
      if (i === idx) { el.classList.add('tv-active'); el.classList.remove('tv-hidden') }
      else           { el.classList.remove('tv-active'); el.classList.add('tv-hidden') }
    })
    this._container.classList.add('tv-zoomed-in')
    this._showBreadcrumb('System › Card ' + idx)
    return new Promise(function (resolve) { setTimeout(resolve, 300) })
  }

  if (level === 'chip') {
    const cardIdx = opts.card || 0
    const chipIdx = opts.chip !== undefined ? opts.chip : 0
    // First zoom into the card, then into the chip
    return this.transitionTo('card', { index: cardIdx }).then(function () {
      return this._cards[cardIdx].transitionTo('chip', { index: chipIdx })
    }.bind(this))
  }

  // Zoom out to system level
  this._cardEls.forEach(function (el) {
    el.classList.remove('tv-active', 'tv-hidden')
  })
  this._container.classList.remove('tv-zoomed-in')
  this._hideBreadcrumb()
  // Also reset any card-level zoom
  this._cards.forEach(function (card) { card.transitionTo('system') })
  return new Promise(function (resolve) { setTimeout(resolve, 300) })
}

SystemViz.prototype._showBreadcrumb = function (text) {
  if (!this._breadcrumb) {
    this._breadcrumb = document.createElement('div')
    this._breadcrumb.classList.add('tv-breadcrumb')
    this._container.insertBefore
      ? this._container.insertBefore(this._breadcrumb, this._container.children[0])
      : this._container._children.unshift(this._breadcrumb)
  }
  this._breadcrumb.textContent = text
  this._breadcrumb.style.display = 'block'
}

SystemViz.prototype._hideBreadcrumb = function () {
  if (this._breadcrumb) this._breadcrumb.style.display = 'none'
}

SystemViz.prototype.destroy = function () {
  this._cards.forEach(function (card) { card.destroy() })
  this._cards = []
  this._cardEls = []
  this._container._children = []
  this._container.innerHTML = ''
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- system.test.js
```

Expected: 7/7 PASS

- [ ] **Step 5: Commit**

```bash
git add src/system.js tests/system.test.js
git commit -m "feat: SystemViz — multi-card system renderer (QB2, T3000)"
```

---

## Task 6: ClusterViz

**Files:**
- Create: `src/cluster.js`
- Create: `tests/cluster.test.js`

ClusterViz renders abstract chip tile grids for server/cluster-scale views. At ≤32 chips: renders a colored grid of tile divs. At >64 chips: chips are tiny dots. No per-core rendering. Clicking a tile can drill into a `SystemViz` (drill-down is wired in Task 7).

- [ ] **Step 1: Write the failing tests**

```js
// tests/cluster.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { ClusterViz } from '../src/cluster.js'

function makeDiv() {
  const el = document.createElement('div')
  el._children = []
  return el
}

describe('ClusterViz', () => {
  let container

  beforeEach(() => { container = makeDiv() })

  it('constructs for bh-galaxy without throwing', () => {
    expect(() => new ClusterViz(container, 'bh-galaxy')).not.toThrow()
  })

  it('constructs for bh-galaxy-sc without throwing', () => {
    expect(() => new ClusterViz(container, 'bh-galaxy-sc')).not.toThrow()
  })

  it('renders 32 tile elements for bh-galaxy', () => {
    const viz = new ClusterViz(container, 'bh-galaxy')
    // The tile grid div contains one element per chip
    const grid = container._children.find(el => el._tag === 'div')
    expect(viz.chipCount).toBe(32)
    viz.destroy()
  })

  it('chipCount is 128 for bh-galaxy-sc', () => {
    const viz = new ClusterViz(container, 'bh-galaxy-sc')
    expect(viz.chipCount).toBe(128)
    viz.destroy()
  })

  it('activate("inference") does not throw', () => {
    const viz = new ClusterViz(container, 'bh-galaxy')
    expect(() => viz.activate('inference')).not.toThrow()
    viz.destroy()
  })

  it('reset() does not throw', () => {
    const viz = new ClusterViz(container, 'bh-galaxy')
    expect(() => viz.reset()).not.toThrow()
    viz.destroy()
  })

  it('transitionTo returns a Promise', () => {
    const viz = new ClusterViz(container, 'bh-galaxy-sc')
    const p = viz.transitionTo('server', { index: 0 })
    expect(p).toBeInstanceOf(Promise)
    viz.destroy()
  })

  it('destroy() empties the container', () => {
    const viz = new ClusterViz(container, 'bh-galaxy')
    viz.destroy()
    expect(container._children.length).toBe(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- cluster.test.js
```

Expected: FAIL — `Cannot find module '../src/cluster.js'`

- [ ] **Step 3: Write src/cluster.js**

```js
// src/cluster.js
import { loadTopology } from './topology.js'

// Threshold: above this chip count, use dot mode instead of tile mode
const DOT_MODE_THRESHOLD = 64

/**
 * ClusterViz — renders an abstract chip grid for server/cluster-scale views.
 * Tiles represent chips; clicking a tile triggers transitionTo('server', {index}).
 *
 * @param {HTMLElement} container
 * @param {string|object} config  - 'bh-galaxy', 'bh-galaxy-sc', or inline config
 */
export function ClusterViz(container, config) {
  this._container  = container
  this._topo       = loadTopology(config)
  this._tiles      = []       // tile div elements
  this._activeMode = 'idle'
  this._animFrame  = null
  this._breadcrumb = null

  // Resolve chip count
  if (this._topo.total_chips) {
    this.chipCount = this._topo.total_chips
  } else if (typeof this._topo.chips === 'number') {
    this.chipCount = this._topo.chips
  } else if (Array.isArray(this._topo.chips)) {
    this.chipCount = this._topo.chips.length
  } else {
    this.chipCount = (this._topo.servers || 1) * 32
  }

  this._dotMode = this.chipCount > DOT_MODE_THRESHOLD
  this._init()
}

ClusterViz.prototype._init = function () {
  const self      = this
  const container = this._container
  const topo      = this._topo

  container.classList.add('tv-cluster')
  if (this._dotMode) container.classList.add('tv-cluster-dot-mode')

  // Spec strip
  const spec = document.createElement('div')
  spec.classList.add('tv-cluster-spec')
  spec.textContent = [
    this.chipCount + ' chips',
    topo.eth_ports ? topo.eth_ports + '× ' + (topo.eth_speed || '') + ' ETH' : '',
    topo.topology  ? topo.topology : (topo.mesh_links ? '2D mesh' : ''),
  ].filter(Boolean).join(' · ')
  container.appendChild(spec)

  // Tile grid
  const grid = document.createElement('div')
  grid.classList.add('tv-cluster-grid')
  container.appendChild(grid)
  this._grid = grid

  for (var i = 0; i < this.chipCount; i++) {
    const tile = document.createElement('div')
    tile.classList.add('tv-cluster-tile')
    tile.dataset.chipIndex = String(i)
    tile.title = 'Chip ' + i
    ;(function (idx) {
      tile.addEventListener('click', function () {
        self.transitionTo('server', { index: Math.floor(idx / 32) })
      })
    })(i)
    grid.appendChild(tile)
    this._tiles.push(tile)
  }

  // Start idle animation
  this._startAnimation()
}

// Idle animation: pulse random tiles
ClusterViz.prototype._startAnimation = function () {
  const self   = this
  const tiles  = this._tiles
  const mode   = this._activeMode

  if (this._animFrame) cancelAnimationFrame(this._animFrame)

  var t = 0
  function tick() {
    t += 0.02

    tiles.forEach(function (tile, i) {
      var col = i % (self._topo.grid ? self._topo.grid[1] : 8)
      var row = Math.floor(i / (self._topo.grid ? self._topo.grid[1] : 8))
      var W   = self._topo.grid ? self._topo.grid[1] : 8
      var H   = self._topo.grid ? self._topo.grid[0] : 4

      var heat
      switch (mode) {
        case 'inference':
          heat = Math.max(0, 1 - Math.abs(col - (t % 1) * W) / 3)
          break
        case 'diffusion': {
          var cx = W / 2, cy = H / 2
          var dist = Math.sqrt((col - cx) * (col - cx) + (row - cy) * (row - cy))
          var ring = (t % 1) * Math.sqrt(cx * cx + cy * cy)
          heat = Math.max(0, 1 - Math.abs(dist - ring) / 2)
          break
        }
        case 'agents':
          heat = Math.random() < 0.04 ? Math.random() : parseFloat(tile.dataset.heat || '0') * 0.85
          break
        case 'explore':
          heat = (Math.sin(col * 0.6 + t * Math.PI * 4) + 1) / 2
          break
        default: // idle
          heat = Math.random() < 0.02 ? Math.random() * 0.35 : parseFloat(tile.dataset.heat || '0') * 0.92
      }

      tile.dataset.heat = String(heat.toFixed(3))
      // Map 0..1 to color: cool teal → warm gold → hot red
      var r, g, b
      if (heat < 0.5) {
        var s = heat * 2
        r = Math.round(30  + (244 - 30)  * s)
        g = Math.round(74  + (196 - 74)  * s)
        b = Math.round(88  + (113 - 88)  * s)
      } else {
        var s = (heat - 0.5) * 2
        r = Math.round(244 + (255 - 244) * s)
        g = Math.round(196 + (107 - 196) * s)
        b = Math.round(113 + (107 - 113) * s)
      }
      tile.style.background = 'rgb(' + r + ',' + g + ',' + b + ')'
    })

    self._animFrame = requestAnimationFrame(tick)
  }

  this._animFrame = requestAnimationFrame(tick)
}

ClusterViz.prototype.activate = function (mode) {
  this._activeMode = mode
  // Restart animation with new mode
  this._startAnimation()
}

ClusterViz.prototype.reset = function () {
  this._activeMode = 'idle'
  this._tiles.forEach(function (tile) {
    tile.style.background = ''
    tile.dataset.heat = '0'
  })
  if (this._animFrame) { cancelAnimationFrame(this._animFrame); this._animFrame = null }
  this._startAnimation()
}

ClusterViz.prototype.highlight = function (indices) {
  const self = this
  this._tiles.forEach(function (tile, i) {
    if (indices.indexOf(i) !== -1) tile.classList.add('tv-highlighted')
    else tile.classList.remove('tv-highlighted')
  })
}

ClusterViz.prototype.transitionTo = function (level, opts) {
  // level: 'server' | 'cluster'
  opts = opts || {}
  const self = this

  if (level === 'server') {
    const serverIdx = opts.index || 0
    const tilesPerServer = 32
    const start = serverIdx * tilesPerServer
    this._tiles.forEach(function (tile, i) {
      if (i >= start && i < start + tilesPerServer) tile.classList.add('tv-active')
      else tile.classList.add('tv-hidden')
    })
    this._container.classList.add('tv-zoomed-in')
    this._showBreadcrumb('Cluster › Server ' + serverIdx)
  } else {
    // Zoom back out
    this._tiles.forEach(function (tile) {
      tile.classList.remove('tv-active', 'tv-hidden')
    })
    this._container.classList.remove('tv-zoomed-in')
    this._hideBreadcrumb()
  }

  return new Promise(function (resolve) { setTimeout(resolve, 300) })
}

ClusterViz.prototype._showBreadcrumb = function (text) {
  if (!this._breadcrumb) {
    this._breadcrumb = document.createElement('div')
    this._breadcrumb.classList.add('tv-breadcrumb')
    this._container.insertBefore
      ? this._container.insertBefore(this._breadcrumb, this._container.children[0])
      : this._container._children.unshift(this._breadcrumb)
  }
  this._breadcrumb.textContent = text
  this._breadcrumb.style.display = 'block'
}

ClusterViz.prototype._hideBreadcrumb = function () {
  if (this._breadcrumb) this._breadcrumb.style.display = 'none'
}

ClusterViz.prototype.destroy = function () {
  if (this._animFrame) cancelAnimationFrame(this._animFrame)
  this._tiles = []
  this._container._children = []
  this._container.innerHTML = ''
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- cluster.test.js
```

Expected: 8/8 PASS

- [ ] **Step 5: Commit**

```bash
git add src/cluster.js tests/cluster.test.js
git commit -m "feat: ClusterViz — abstract chip tile grid for server/cluster scale"
```

---

## Task 7: Entry Point + Auto-Init (src/index.js)

**Files:**
- Create: `src/index.js`
- Create: `tests/index.test.js`

`index.js` is the bundle entry point. It exports all four classes and adds the new `data-viz` auto-init alongside the legacy `.tensix-viz-container` auto-init.

- [ ] **Step 1: Write the failing tests**

```js
// tests/index.test.js
import { describe, it, expect } from 'vitest'
import { TensixViz, CardViz, SystemViz, ClusterViz, autoInit } from '../src/index.js'

describe('index exports', () => {
  it('exports TensixViz', () => { expect(typeof TensixViz).toBe('function') })
  it('exports CardViz',   () => { expect(typeof CardViz).toBe('function') })
  it('exports SystemViz', () => { expect(typeof SystemViz).toBe('function') })
  it('exports ClusterViz',() => { expect(typeof ClusterViz).toBe('function') })
  it('exports autoInit',  () => { expect(typeof autoInit).toBe('function') })
})

describe('autoInit', () => {
  it('does not throw when no data-viz elements exist', () => {
    expect(() => autoInit()).not.toThrow()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- index.test.js
```

Expected: FAIL — `Cannot find module '../src/index.js'`

- [ ] **Step 3: Write src/index.js**

```js
// src/index.js — bundle entry point
export { TensixViz } from './chip.js'
export { CardViz }   from './card.js'
export { SystemViz } from './system.js'
export { ClusterViz } from './cluster.js'

import { TensixViz } from './chip.js'
import { CardViz }   from './card.js'
import { SystemViz } from './system.js'
import { ClusterViz } from './cluster.js'

/**
 * autoInit — scans the DOM for:
 *   - [data-viz] elements (new API)
 *   - .tensix-viz-container elements (legacy TensixViz API, unchanged behavior)
 */
export function autoInit() {
  // New API: data-viz attribute
  if (typeof document !== 'undefined') {
    document.querySelectorAll('[data-viz]').forEach(function (el) {
      const type   = el.dataset.viz
      const config = el.dataset.config || el.dataset.arch || 'bh-chip'
      const mode   = el.dataset.mode   || 'idle'

      try {
        var viz
        switch (type) {
          case 'chip':
            // data-viz="chip" uses a <canvas> element directly
            viz = new TensixViz(el, { arch: config })
            viz.activate(mode)
            break
          case 'card':
            viz = new CardViz(el, config)
            viz.activate(mode)
            break
          case 'system':
            viz = new SystemViz(el, config)
            viz.activate(mode)
            break
          case 'cluster':
            viz = new ClusterViz(el, config)
            viz.activate(mode)
            break
        }
        if (viz) el._tensixViz = viz  // store ref for programmatic access
      } catch (err) {
        console.warn('[tensix-viz] autoInit failed for element', el, err)
      }
    })

    // Legacy API: .tensix-viz-container (delegates to TensixViz.autoInit)
    TensixViz.autoInit()
  }
}

// Auto-run on DOMContentLoaded (browser context only)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit)
  } else {
    // Defer to next microtask so the page's own scripts run first
    Promise.resolve().then(autoInit)
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- index.test.js
```

Expected: 6/6 PASS

- [ ] **Step 5: Run full test suite**

```bash
npm test
```

Expected: all tests pass (topology + chip + card + system + cluster + index)

- [ ] **Step 6: Commit**

```bash
git add src/index.js tests/index.test.js
git commit -m "feat: entry point — all exports + data-viz auto-init + legacy .tensix-viz-container"
```

---

## Task 8: Build Pipeline + CSS

**Files:**
- Modify: `build.js` (already written — verify it works)
- Create: `tensix-viz.css`

- [ ] **Step 1: Run the build**

```bash
cd ~/code/tensix-viz
node build.js
```

Expected output:
```
Build complete: tensix-viz.js + tensix-viz.esm.js
```

Both files should appear in the repo root. If esbuild errors on JSON imports, change the static JSON imports in `src/topology.js` from `import ... assert { type: 'json' }` to:

```js
import { createRequire } from 'module'
const _req = createRequire(import.meta.url)
const bhChip     = _req('../topologies/bh-chip.json')
const whChip     = _req('../topologies/wh-chip.json')
const bhP300c    = _req('../topologies/bh-p300c.json')
const whN300     = _req('../topologies/wh-n300.json')
const qb2        = _req('../topologies/qb2.json')
const t3000      = _req('../topologies/t3000.json')
const bhGalaxy   = _req('../topologies/bh-galaxy.json')
const bhGalaxySc = _req('../topologies/bh-galaxy-sc.json')
```

esbuild handles `require()` calls and bundles the JSONs correctly in both IIFE and ESM outputs.

- [ ] **Step 2: Verify IIFE bundle exports all four classes**

Open a Node.js REPL and verify:
```bash
node -e "
const fs = require('fs')
const code = fs.readFileSync('tensix-viz.js', 'utf8')
console.log('Has TensixViz:', code.includes('window.TensixViz'))
console.log('Has CardViz:',   code.includes('window.CardViz'))
console.log('Has SystemViz:', code.includes('window.SystemViz'))
console.log('Has ClusterViz:',code.includes('window.ClusterViz'))
"
```

Expected: all four `true`.

- [ ] **Step 3: Write tensix-viz.css**

Start by copying the original CSS from `tt-vscode-toolkit` so the legacy `.tensix-viz-container`, `.tv-legend-item`, and `.tv-legend-dot` styles are preserved:

```bash
cp ~/code/tt-vscode-toolkit/src/webview/tensix-viz/tensix-viz.css ~/code/tensix-viz/tensix-viz.css
```

Then append the new card/system/cluster styles below. The final file contains the legacy chip styles at the top, new styles below. If the original CSS file does not exist or is empty, create the file from scratch with the content below.

```css
/* tensix-viz.css — styles for CardViz, SystemViz, ClusterViz containers */

/* ─── Card ─────────────────────────────────────────────────────────────── */

.tv-card {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0d1f2d;
  border-radius: 8px;
  padding: 12px;
  position: relative;
  overflow: hidden;
}

.tv-chip-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.tv-chip-wrapper.tv-hidden   { opacity: 0; pointer-events: none; }
.tv-chip-wrapper.tv-active   { transform: scale(1.1); }
.tv-chip-wrapper.tv-highlighted { outline: 2px solid #4fd1c5; border-radius: 4px; }

.tv-chip-label {
  color: #607d8b;
  font-size: 0.7rem;
  font-family: monospace;
  text-align: center;
}

.tv-card-link {
  width: 24px;
  height: 40px;
  border-top: 2px dashed #5b3da0;
  border-bottom: 2px dashed #5b3da0;
  position: relative;
  flex-shrink: 0;
}

.tv-card-link::after {
  content: 'ETH';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #5b3da0;
  font-size: 0.55rem;
  font-family: monospace;
  white-space: nowrap;
}

/* ─── System ────────────────────────────────────────────────────────────── */

.tv-system {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: #0a1820;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.tv-card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.tv-card-wrapper.tv-hidden   { opacity: 0; pointer-events: none; }
.tv-card-wrapper.tv-active   { transform: scale(1.05); }
.tv-card-wrapper.tv-highlighted { outline: 2px solid #4fd1c5; border-radius: 6px; }

.tv-system-card-label {
  color: #607d8b;
  font-size: 0.75rem;
  font-family: monospace;
  letter-spacing: 0.05em;
}

.tv-system-link {
  color: #5b3da0;
  font-size: 0.65rem;
  font-family: monospace;
  text-align: center;
  padding: 2px 8px;
  border-left: 2px dashed #5b3da0;
  border-right: 2px dashed #5b3da0;
  white-space: nowrap;
}

/* ─── Cluster ───────────────────────────────────────────────────────────── */

.tv-cluster {
  background: #080f18;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.tv-cluster-spec {
  color: #607d8b;
  font-size: 0.7rem;
  font-family: monospace;
  margin-bottom: 12px;
  text-align: center;
}

.tv-cluster-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 3px;
}

.tv-cluster-dot-mode .tv-cluster-grid {
  grid-template-columns: repeat(16, 1fr);
  gap: 2px;
}

.tv-cluster-tile {
  aspect-ratio: 1;
  border-radius: 2px;
  background: #1e4a58;
  cursor: pointer;
  transition: background 0.1s ease;
}

.tv-cluster-tile.tv-highlighted { outline: 2px solid #4fd1c5; }
.tv-cluster-tile.tv-hidden      { opacity: 0.1; pointer-events: none; }
.tv-cluster-tile.tv-active      { outline: 2px solid #4fd1c5; }

/* ─── Breadcrumb ────────────────────────────────────────────────────────── */

.tv-breadcrumb {
  position: absolute;
  top: 6px;
  left: 8px;
  font-size: 0.7rem;
  font-family: monospace;
  color: #4fd1c5;
  cursor: pointer;
  z-index: 10;
  background: rgba(13,31,45,0.85);
  padding: 2px 8px;
  border-radius: 4px;
}

/* ─── Zoom state ────────────────────────────────────────────────────────── */

.tv-zoomed-in { overflow: visible; }
```

- [ ] **Step 4: Add tensix-viz.css to .gitignore exclusion and commit**

```bash
git add tensix-viz.js tensix-viz.esm.js tensix-viz.css build.js
git commit -m "feat: build pipeline (esbuild IIFE+ESM) + tensix-viz.css"
```

---

## Task 9: examples/index.html

**Files:**
- Create: `examples/index.html`

Self-contained demo. References `../tensix-viz.js` (relative path — works when opened from repo clone with no server).

- [ ] **Step 1: Write examples/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>tensix-viz — Examples</title>
  <link rel="stylesheet" href="../tensix-viz.css">
  <style>
    body { font-family: system-ui, sans-serif; background: #0a1420; color: #c0ccd8; margin: 0; padding: 32px; }
    h1 { color: #4fd1c5; font-size: 1.4rem; margin-bottom: 4px; }
    h2 { color: #81e6d9; font-size: 1rem; margin: 32px 0 12px; border-bottom: 1px solid #1a3c47; padding-bottom: 6px; }
    p  { color: #607d8b; font-size: 0.875rem; margin-bottom: 16px; }
    .demo-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; margin-bottom: 24px; }
    .demo-card { background: #0d1f2d; border: 1px solid #1a3c47; border-radius: 8px; padding: 16px; }
    .mode-btn  {
      background: none; border: 1px solid #1a3c47; color: #81e6d9;
      border-radius: 4px; padding: 4px 12px; cursor: pointer; font-size: 0.8rem;
      margin: 4px 4px 0 0;
    }
    .mode-btn:hover { border-color: #4fd1c5; }
    .mode-btn.active { background: #1a3c47; border-color: #4fd1c5; }
    code { background: #1a3c47; padding: 2px 6px; border-radius: 3px; font-size: 0.8rem; }
    pre  { background: #0d1f2d; border: 1px solid #1a3c47; border-radius: 6px;
           padding: 16px; overflow-x: auto; font-size: 0.8rem; color: #81e6d9; }
  </style>
</head>
<body>
  <h1>tensix-viz</h1>
  <p>Tenstorrent hardware topology visualizer. Open this file directly — no server needed.</p>

  <!-- ── 1. Single chip ─────────────────────────────────────────────── -->
  <h2>1. TensixViz — Single chip (Blackhole 17×12)</h2>
  <p>Activate an animation mode to see workload patterns across the core grid.</p>
  <div class="demo-row">
    <div class="demo-card">
      <canvas id="chip-bh" width="340" height="240"></canvas>
      <div style="margin-top:8px">
        <button class="mode-btn active" onclick="setChipMode('idle',this)">idle</button>
        <button class="mode-btn" onclick="setChipMode('inference',this)">inference</button>
        <button class="mode-btn" onclick="setChipMode('diffusion',this)">diffusion</button>
        <button class="mode-btn" onclick="setChipMode('agents',this)">agents</button>
        <button class="mode-btn" onclick="setChipMode('explore',this)">explore</button>
      </div>
    </div>
    <div class="demo-card">
      <canvas id="chip-wh" width="240" height="240"></canvas>
      <p style="margin:8px 0 0;font-size:0.75rem">Wormhole 10×12 — same modes</p>
    </div>
  </div>

  <!-- ── 2. Card ────────────────────────────────────────────────────── -->
  <h2>2. CardViz — P300c (2 BH chips, intra-card ETH)</h2>
  <p>Click "zoom" to drill into a single chip. <code>viz.transitionTo('chip', {index: 0})</code></p>
  <div class="demo-row">
    <div class="demo-card">
      <div id="card-bh"></div>
      <div style="margin-top:8px">
        <button class="mode-btn" onclick="cardViz.transitionTo('chip',{index:0})">zoom chip 0</button>
        <button class="mode-btn" onclick="cardViz.transitionTo('chip',{index:1})">zoom chip 1</button>
        <button class="mode-btn" onclick="cardViz.transitionTo('card')">zoom out</button>
      </div>
    </div>
    <div class="demo-card">
      <div id="card-wh"></div>
      <p style="margin:8px 0 0;font-size:0.75rem">n300 (2 WH chips)</p>
    </div>
  </div>

  <!-- ── 3. System ──────────────────────────────────────────────────── -->
  <h2>3. SystemViz — QB2 (2× P300c, 4 BH chips)</h2>
  <div class="demo-row">
    <div class="demo-card">
      <div id="system-qb2"></div>
      <div style="margin-top:8px">
        <button class="mode-btn active" onclick="setSystemMode('idle',this)">idle</button>
        <button class="mode-btn" onclick="setSystemMode('inference',this)">inference</button>
        <button class="mode-btn" onclick="setSystemMode('diffusion',this)">diffusion</button>
        <button class="mode-btn" onclick="setSystemMode('agents',this)">agents</button>
      </div>
    </div>
    <div class="demo-card">
      <div id="system-t3000"></div>
      <p style="margin:8px 0 0;font-size:0.75rem">T3000 (4× n300, 8 WH chips, 2×4 mesh)</p>
    </div>
  </div>

  <!-- ── 4. Cluster ─────────────────────────────────────────────────── -->
  <h2>4. ClusterViz — Galaxy BH (32 chips, 4×8 mesh)</h2>
  <p>Click any tile to zoom into a server. <code>await viz.transitionTo('server', {index: 0})</code></p>
  <div class="demo-row">
    <div class="demo-card">
      <div id="cluster-galaxy"></div>
      <div style="margin-top:8px">
        <button class="mode-btn active" onclick="setClusterMode('idle',this)">idle</button>
        <button class="mode-btn" onclick="setClusterMode('inference',this)">inference</button>
        <button class="mode-btn" onclick="setClusterMode('explore',this)">explore</button>
        <button class="mode-btn" onclick="clusterViz.transitionTo('cluster')">zoom out</button>
      </div>
    </div>
    <div class="demo-card">
      <div id="cluster-sc"></div>
      <p style="margin:8px 0 0;font-size:0.75rem">Galaxy SC (128 chips, 2D torus)</p>
    </div>
  </div>

  <!-- ── 5. Programmatic control ────────────────────────────────────── -->
  <h2>5. Programmatic control</h2>
  <p>Chain <code>await viz.transitionTo()</code> and <code>viz.activate()</code> for lesson sequences.</p>
  <pre>const viz = new SystemViz(el, 'qb2')
await viz.transitionTo('card', { index: 0 })   // zoom into card 0
await viz.transitionTo('chip', { card: 0, chip: 1 }) // zoom into chip 1
viz.activate('inference')                       // run animation
await new Promise(r => setTimeout(r, 3000))
await viz.transitionTo('system')               // zoom back out</pre>
  <button class="mode-btn" onclick="runProgrammaticDemo()">▶ Run demo on QB2 above</button>

  <script src="../tensix-viz.js"></script>
  <script>
    // ── 1. Chip ──
    const chipBH = new TensixViz(document.getElementById('chip-bh'), { arch: 'blackhole' })
    const chipWH = new TensixViz(document.getElementById('chip-wh'), { arch: 'wormhole'  })
    chipBH.activate('idle')
    chipWH.activate('idle')

    function setChipMode(mode, btn) {
      document.querySelectorAll('#chip-bh ~ div .mode-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      chipBH.activate(mode)
      chipWH.activate(mode)
    }

    // ── 2. Card ──
    const cardViz   = new CardViz(document.getElementById('card-bh'), 'bh-p300c')
    const cardVizWH = new CardViz(document.getElementById('card-wh'), 'wh-n300')
    cardViz.activate('idle')
    cardVizWH.activate('idle')

    // ── 3. System ──
    const sysQB2   = new SystemViz(document.getElementById('system-qb2'),   'qb2')
    const sysT3000 = new SystemViz(document.getElementById('system-t3000'), 't3000')
    sysQB2.activate('idle')
    sysT3000.activate('idle')

    function setSystemMode(mode, btn) {
      document.querySelectorAll('#system-qb2 ~ div .mode-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      sysQB2.activate(mode)
    }

    // ── 4. Cluster ──
    const clusterViz = new ClusterViz(document.getElementById('cluster-galaxy'), 'bh-galaxy')
    const clusterSC  = new ClusterViz(document.getElementById('cluster-sc'),     'bh-galaxy-sc')

    function setClusterMode(mode, btn) {
      document.querySelectorAll('#cluster-galaxy ~ div .mode-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      clusterViz.activate(mode)
    }

    // ── 5. Programmatic ──
    async function runProgrammaticDemo() {
      await sysQB2.transitionTo('card', { index: 0 })
      sysQB2._cards[0].activate('inference')
      await new Promise(r => setTimeout(r, 3000))
      await sysQB2.transitionTo('system')
      sysQB2.activate('idle')
    }
  </script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify**

```bash
open ~/code/tensix-viz/examples/index.html
```

Check:
- Both chip canvases render dark background with colored core grid
- Mode buttons change animation on chip canvases
- CardViz renders two chip canvases side by side
- SystemViz renders two card wrappers
- ClusterViz renders a 32-tile grid
- No console errors

- [ ] **Step 3: Commit**

```bash
git add examples/index.html
git commit -m "feat: examples/index.html — self-contained runnable demos for all 4 classes"
```

---

## Task 10: README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md**

````markdown
# tensix-viz

Tenstorrent hardware topology visualizer. Single-file, zero-dependency Canvas renderer
from a single Tensix chip up to a Galaxy SuperCluster.

## Quick Start

**CDN (no install):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tsingletaryTT/tensix-viz@v1/tensix-viz.css">
<script src="https://cdn.jsdelivr.net/gh/tsingletaryTT/tensix-viz@v1/tensix-viz.js"
        integrity="sha384-[computed at first release build]" crossorigin="anonymous"></script>
```

**npm / GitHub:**
```json
"tensix-viz": "github:tsingletaryTT/tensix-viz#v1"
```
```js
import { TensixViz, CardViz, SystemViz, ClusterViz } from 'tensix-viz'
```

## HTML auto-init

```html
<!-- chip: use a <canvas> element -->
<canvas data-viz="chip" data-config="blackhole" data-mode="idle" width="340" height="240"></canvas>

<!-- card/system/cluster: use a <div> container -->
<div data-viz="card"    data-config="bh-p300c" data-mode="inference"></div>
<div data-viz="system"  data-config="qb2"      data-mode="idle"></div>
<div data-viz="cluster" data-config="bh-galaxy" data-mode="explore"></div>
```

## API

All classes share a common interface:

| Method | Description |
|--------|-------------|
| `activate(mode)` | Start continuous animation. Modes: `idle`, `inference`, `diffusion`, `agents`, `explore` |
| `reset()` | Stop animation, clear state |
| `highlight(indices)` | Highlight chips/cards/nodes by index array |
| `transitionTo(level, opts)` | Zoom in/out. Returns `Promise` resolving after 300ms |
| `destroy()` | Clean up DOM and animation frames |

### TensixViz — single chip

```js
const viz = new TensixViz(canvas, { arch: 'blackhole' | 'wormhole' })
viz.activate('inference')
// Legacy lesson API (unchanged)
viz.play([{ step: 'highlight', cores: [[1,1]], color: 'teal', ms: 600 }])
```

### CardViz — 2-chip card (P300c BH or n300 WH)

```js
const viz = new CardViz(container, 'bh-p300c')   // or 'wh-n300'
viz.activate('diffusion')
await viz.transitionTo('chip', { index: 0 })     // zoom into chip 0
await viz.transitionTo('card')                   // zoom back out
```

### SystemViz — multi-card system (QB2, T3000)

```js
const viz = new SystemViz(container, 'qb2')      // or 't3000'
viz.activate('agents')
await viz.transitionTo('card', { index: 0 })
await viz.transitionTo('chip', { card: 0, chip: 1 })
await viz.transitionTo('system')
```

### ClusterViz — server/cluster (Galaxy BH, Galaxy SC)

```js
const viz = new ClusterViz(container, 'bh-galaxy')   // or 'bh-galaxy-sc'
viz.activate('explore')
await viz.transitionTo('server', { index: 0 })
await viz.transitionTo('cluster')
```

## Topology configs

| Name | Description |
|------|-------------|
| `bh-chip` | Blackhole single chip (17×12, 120 Tensix cores) |
| `wh-chip` | Wormhole single chip (10×12, 64 Tensix cores) |
| `bh-p300c` | P300c card (2 BH chips, intra-card ETH links) |
| `wh-n300` | n300 card (2 WH chips, 2 intra-card ETH links) |
| `qb2` | QB2 system (2× P300c = 4 BH chips, Samtec inter-card) |
| `t3000` | T3000 system (4× n300 = 8 WH chips, 2×4 mesh) |
| `bh-galaxy` | Galaxy BH server (32 chips, 4×8 mesh, 56× 800G ETH) |
| `bh-galaxy-sc` | Galaxy SuperCluster (4× Galaxy = 128 chips, 2D torus) |

## Examples

Open `examples/index.html` in a browser — no server required.

## Build

```bash
npm install
npm run build     # produces tensix-viz.js + tensix-viz.esm.js
npm test          # run vitest suite
```

## Migration from tt-vscode-toolkit

If you were using `tensix-viz.js` directly from tt-vscode-toolkit:

1. Replace the file reference with this repo's `tensix-viz.js`
2. All existing `new TensixViz(canvas, {arch})` calls work unchanged
3. Optionally add `CardViz`/`SystemViz`/`ClusterViz` for multi-chip views
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README — quick-start, API reference, topology table, examples"
```

---

## Task 11: Add to tt-vscode-toolkit as a dependency

**Files:**
- Modify: `~/code/tt-vscode-toolkit/package.json`

- [ ] **Step 1: Add the dependency**

Open `~/code/tt-vscode-toolkit/package.json` and add to `dependencies`:

```json
"tensix-viz": "github:tsingletaryTT/tensix-viz#v1"
```

Note: This requires that `tsingletaryTT/tensix-viz` is pushed to GitHub first. Push the repo:

```bash
cd ~/code/tensix-viz
git remote add origin https://github.com/tsingletaryTT/tensix-viz.git
git push -u origin main
git tag v1
git push origin v1
```

Then in tt-vscode-toolkit:

```bash
cd ~/code/tt-vscode-toolkit
npm install
```

- [ ] **Step 2: Verify the import works**

In a new file `src/webview/tensix-viz/test-import.mjs` (delete after verifying):

```js
import { TensixViz, CardViz, SystemViz, ClusterViz } from 'tensix-viz'
console.log('TensixViz:', typeof TensixViz)
console.log('CardViz:',   typeof CardViz)
console.log('SystemViz:', typeof SystemViz)
console.log('ClusterViz:',typeof ClusterViz)
```

```bash
cd ~/code/tt-vscode-toolkit
node src/webview/tensix-viz/test-import.mjs
```

Expected:
```
TensixViz: function
CardViz: function
SystemViz: function
ClusterViz: function
```

Delete the test file. Commit the package.json change in tt-vscode-toolkit:

```bash
cd ~/code/tt-vscode-toolkit
rm src/webview/tensix-viz/test-import.mjs
git add package.json package-lock.json
git commit -m "chore: add tensix-viz library as dependency"
```

---

## Final Verification Checklist

Before finishing, verify each of these in a browser using `examples/index.html`:

- [ ] BH chip canvas renders dark background with colored core grid (teal Tensix, dark DRAM, purple ETH)
- [ ] WH chip canvas renders 10×12 grid with correct core types
- [ ] All 5 animation modes animate continuously without freezing (`idle`, `inference`, `diffusion`, `agents`, `explore`)
- [ ] `CardViz` renders 2 chip canvases with ETH link divider
- [ ] `CardViz.transitionTo('chip', {index:0})` hides chip 1 and shows breadcrumb
- [ ] `SystemViz` renders 2 card wrappers with Samtec cable label for QB2
- [ ] `ClusterViz` renders 32-tile grid for Galaxy BH
- [ ] `ClusterViz` renders 128-tile grid (dot mode) for Galaxy SC
- [ ] All tests pass: `npm test` shows 100% green
- [ ] IIFE bundle loads without console errors from script tag
