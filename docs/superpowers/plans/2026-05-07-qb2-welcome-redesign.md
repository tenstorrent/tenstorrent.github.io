# QB2 Welcome Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the QB2 welcome.md prose with an intent-first visual page featuring a live Blackhole chip widget that animates in response to use-case card clicks.

**Architecture:** A single `.. raw:: html` / `` {raw} html `` block in `welcome.md` contains all custom HTML, CSS, and interaction JS. The Canvas renderer (`tensix-viz.js`) is deployed as a Sphinx static asset so it caches separately from the page. Four `TensixViz` instances drive the chip grid — one per chip — with workload-specific looping animation scripts triggered by card clicks.

**Tech Stack:** MyST Markdown + Sphinx RTD theme, vanilla JS/CSS, `tensix-viz.js` (Canvas renderer, no build step, exports `window.TensixViz`)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `core/_static/js/tensix-viz.js` | **Create** (copy) | Canvas chip renderer — must not be modified |
| `core/conf.py` | **Modify** line 59 | Add `'tensix-viz.js'` to `html_js_files` |
| `core/systems/quietbox/quietbox-bh-2/welcome.md` | **Replace body** | All page content: CSS, chip widget, intent cards, reference table, note bar, init script |

**No other files change.** `index.rst`, `setup.md`, `specifications.md` are untouched.

### Sphinx static path mechanics

`html_static_path = ['../shared/_static', '_static/assets', '_static/js']` in `conf.py` tells Sphinx to copy everything under `core/_static/js/` into the build's `_static/` root (flattened, not `_static/js/`). So `core/_static/js/tensix-viz.js` is served at `_static/tensix-viz.js`. The `html_js_files` entry must be `'tensix-viz.js'` (no `js/` prefix).

### TensixViz API reference

```javascript
// Constructor — arch must be 'blackhole'
const viz = new TensixViz(canvasElement, { arch: 'blackhole', speed: 1.0 });

// Start looping animation
viz._loop = true;
viz.play(scriptArray);   // script is an array of step objects

// Stop and clear canvas
viz.reset();

// One-shot (no loop)
viz._loop = false;
viz.play(scriptArray);

// Script step types:
{ step: 'highlight', cores: [[col, row], ...], color: 'tensixActive', label: 'text', ms: 600 }
{ step: 'unhighlight', ms: 250 }     // no cores property = clear ALL highlights
{ step: 'transfer', from: [col,row], to: [col,row], ms: 800 }
{ step: 'heatmap', data: Float32Array2D, ms: 200 }
{ step: 'label', core: [col, row], text: 'string' }
{ step: 'clear' }
{ step: 'pause', ms: 500 }

// Named colors: 'tensixActive' (#4fd1c5), 'teal' (#4fd1c5), 'pink' (#EC96B8)
// Hex colors also work: '#9370db', '#f4c471', '#4fd1c5'
```

**Blackhole chip topology (17 cols × 12 rows, 0-indexed):**
- DRAM: row 0, row 11 (all cols)
- ETH: col 0, col 16 (rows 1–10)
- PCIe: col 8 (rows 1–10)
- Tensix: rows 1–10, cols 1–7 and 9–15 (140 cells, 120 active after harvest)

### Build command

```bash
cd /Users/tsingletary/code/tenstorrent.github.io/core && make html 2>&1 | tail -20
```

Expected output ends with `build succeeded` (warnings about external links are OK; errors are not).

---

## Task 1: Deploy tensix-viz.js and update conf.py

**Files:**
- Create: `core/_static/js/tensix-viz.js`
- Modify: `core/conf.py`

- [ ] **Step 1: Copy tensix-viz.js to the static asset directory**

```bash
cp ~/code/tt-vscode-toolkit/src/webview/tensix-viz/tensix-viz.js \
   /Users/tsingletary/code/tenstorrent.github.io/core/_static/js/tensix-viz.js
```

- [ ] **Step 2: Verify the file was copied correctly**

```bash
wc -l /Users/tsingletary/code/tenstorrent.github.io/core/_static/js/tensix-viz.js
```

Expected: `817` (or close — the source is 817 lines)

- [ ] **Step 3: Add tensix-viz.js to html_js_files in conf.py**

In `core/conf.py`, line 59 currently reads:

```python
html_js_files = ['custom.js', 'posthog.js']
```

Change it to:

```python
html_js_files = ['custom.js', 'posthog.js', 'tensix-viz.js']
```

- [ ] **Step 4: Run the Sphinx build to verify no errors**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io/core && make html 2>&1 | tail -20
```

Expected: `build succeeded`. If you see `tensix-viz.js: WARNING: ... duplicate`, that means conf.py already had it — remove the duplicate.

- [ ] **Step 5: Commit**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io
git add core/_static/js/tensix-viz.js core/conf.py
git commit -m "feat(qb2-welcome): add tensix-viz.js static asset and register in conf.py"
```

---

## Task 2: Replace welcome.md with scaffold + CSS + chip widget HTML

This task replaces the body of `welcome.md` (everything after the frontmatter) with the new page structure. The JS initialization comes in Task 3. At the end of this task the page renders the chip widget as empty canvases (black rectangles) — that is correct, JS hasn't run yet.

**Files:**
- Modify: `core/systems/quietbox/quietbox-bh-2/welcome.md`

- [ ] **Step 1: Replace welcome.md content with the following**

Keep the frontmatter block (lines 1–7) exactly as-is. Replace everything from line 8 onward with:

```markdown
```{raw} html

<style>
/* ============================================================
   QB2 Welcome page — scoped to .qb2-welcome
   Uses CSS custom properties from RTD theme where possible.
   Chip widget is always dark (hardware panel aesthetic).
   ============================================================ */

/* ---------- layout container ---------- */
.qb2-welcome {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  max-width: 960px;
  margin: 0 auto;
}

/* ---------- page heading ---------- */
.qb2-welcome h1.qb2-page-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: var(--color-foreground, #e0e0e0);
}
.qb2-welcome .qb2-page-sub {
  margin: 0 0 24px 0;
  font-size: 0.95rem;
  color: var(--color-foreground-muted, #9aa0aa);
}

/* ---------- chip widget ---------- */
.qb2-chip-widget {
  background: #0d1f2d;
  border: 1px solid #1e3a50;
  border-radius: 10px;
  padding: 18px 20px 14px;
  margin-bottom: 28px;
  position: relative;
}
.qb2-chip-widget-inner {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
}

/* card rows */
.qb2-card-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: center;
}
.qb2-card-side-label {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 10px;
  color: #4a7a9b;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  letter-spacing: 0.1em;
  white-space: nowrap;
  width: 14px;
}
.qb2-chip-pair {
  display: flex;
  gap: 6px;
  flex: 0 0 auto;
}
.qb2-chip-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.qb2-chip-label {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 9px;
  color: #4a7a9b;
  letter-spacing: 0.08em;
}
canvas.qb2-chip-canvas {
  display: block;
  border-radius: 3px;
  border: 1px solid #1e3a50;
}

/* samtec divider */
.qb2-samtec-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  padding: 8px 0;
}
.qb2-samtec-line {
  flex: 1;
  height: 1px;
  background: #1e3a50;
  max-width: 180px;
}
.qb2-samtec-label {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 9px;
  color: #4a7a9b;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

/* widget footer */
.qb2-chip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #1e3a50;
  width: 100%;
}
.qb2-chip-specs {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 10px;
  color: #4a7a9b;
  letter-spacing: 0.06em;
}
.qb2-chip-mode-label {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 10px;
  color: #4a7a9b;
  letter-spacing: 0.08em;
  transition: color 0.4s ease;
  min-width: 140px;
  text-align: right;
}
.qb2-chip-mode-label.mode-chat    { color: #4fd1c5; }
.qb2-chip-mode-label.mode-video   { color: #ec96b8; }
.qb2-chip-mode-label.mode-agents  { color: #9370db; }
.qb2-chip-mode-label.mode-explore { color: #f4c471; }

/* widget border highlight on active card */
.qb2-chip-widget.mode-chat    { border-color: #4fd1c5; }
.qb2-chip-widget.mode-video   { border-color: #ec96b8; }
.qb2-chip-widget.mode-agents  { border-color: #9370db; }
.qb2-chip-widget.mode-explore { border-color: #f4c471; }

/* ---------- intent grid (2×2) ---------- */
.qb2-intent-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 28px;
}
@media (max-width: 640px) {
  .qb2-intent-grid { grid-template-columns: 1fr; }
}

.qb2-intent-card {
  background: var(--color-background-secondary, #1a2535);
  border: 1.5px solid var(--color-border, #2a3a4a);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
}
.qb2-intent-card:hover {
  border-color: #4a7a9b;
}

/* accent borders — active state */
.qb2-intent-card.active.card-chat    { border-color: #4fd1c5; box-shadow: 0 0 12px rgba(79,209,197,0.15); }
.qb2-intent-card.active.card-video   { border-color: #ec96b8; box-shadow: 0 0 12px rgba(236,150,184,0.15); }
.qb2-intent-card.active.card-agents  { border-color: #9370db; box-shadow: 0 0 12px rgba(147,112,219,0.15); }
.qb2-intent-card.active.card-explore { border-color: #f4c471; box-shadow: 0 0 12px rgba(244,196,113,0.15); }

.qb2-intent-icon {
  font-size: 1.6rem;
  line-height: 1;
  margin-bottom: 8px;
}
.qb2-intent-title {
  font-size: 1.0rem;
  font-weight: 700;
  margin: 0 0 2px 0;
  color: var(--color-foreground, #e0e0e0);
}
.qb2-intent-tagline {
  font-size: 0.8rem;
  color: var(--color-foreground-muted, #8a9aaa);
  margin: 0 0 10px 0;
}
.qb2-intent-row {
  display: flex;
  gap: 6px;
  margin-bottom: 5px;
  align-items: baseline;
  flex-wrap: wrap;
}
.qb2-intent-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-foreground-muted, #8a9aaa);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 52px;
  flex-shrink: 0;
}
.qb2-intent-val {
  font-size: 0.8rem;
  color: var(--color-foreground, #ccd0d6);
}
.qb2-perf {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 0.72rem;
  background: rgba(255,255,255,0.07);
  border-radius: 3px;
  padding: 1px 5px;
  color: #9aa8b4;
  white-space: nowrap;
}
.qb2-lesson-btn {
  display: inline-block;
  margin-top: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 5px;
  text-decoration: none !important;
  transition: opacity 0.2s ease;
}
.qb2-lesson-btn:hover { opacity: 0.8; }
.card-chat    .qb2-lesson-btn { background: rgba(79,209,197,0.15);  color: #4fd1c5; }
.card-video   .qb2-lesson-btn { background: rgba(236,150,184,0.15); color: #ec96b8; }
.card-agents  .qb2-lesson-btn { background: rgba(147,112,219,0.15); color: #9370db; }
.card-explore .qb2-lesson-btn { background: rgba(244,196,113,0.15); color: #f4c471; }

/* ---------- light mode overrides ---------- */
@media (prefers-color-scheme: light) {
  .qb2-intent-card {
    background: #f5f7fa;
    border-color: #d0d8e4;
  }
  .qb2-intent-card:hover { border-color: #6a8aaa; }
  .qb2-intent-title  { color: #1a2535; }
  .qb2-intent-tagline { color: #546070; }
  .qb2-intent-val    { color: #2a3545; }
  .qb2-intent-label  { color: #6a7888; }
  .qb2-perf {
    background: rgba(0,0,0,0.06);
    color: #6a7888;
  }
}

/* RTD light theme class override (RTD uses .wy-body-for-nav class) */
body.light .qb2-intent-card,
html[data-theme="light"] .qb2-intent-card {
  background: #f5f7fa;
  border-color: #d0d8e4;
}
html[data-theme="light"] .qb2-intent-title  { color: #1a2535; }
html[data-theme="light"] .qb2-intent-tagline { color: #546070; }
html[data-theme="light"] .qb2-intent-val    { color: #2a3545; }
html[data-theme="light"] .qb2-intent-label  { color: #6a7888; }

/* ---------- reference table ---------- */
.qb2-ref-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin-bottom: 20px;
}
.qb2-ref-table th {
  text-align: left;
  padding: 6px 10px;
  border-bottom: 2px solid var(--color-border, #2a3a4a);
  color: var(--color-foreground-muted, #8a9aaa);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.qb2-ref-table td {
  padding: 7px 10px;
  border-bottom: 1px solid var(--color-border, #2a3a4a);
  color: var(--color-foreground, #ccd0d6);
  vertical-align: top;
}
.qb2-ref-table td:first-child {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-weight: 600;
  white-space: nowrap;
  color: var(--color-brand-primary, #9370db);
}
.qb2-ref-table a { color: inherit; text-decoration: underline; }

/* ---------- note bar ---------- */
.qb2-note-bar {
  margin-top: 24px;
  padding: 12px 16px;
  background: var(--color-background-secondary, #1a2535);
  border-left: 3px solid #4a7a9b;
  border-radius: 0 6px 6px 0;
  font-size: 0.83rem;
  color: var(--color-foreground-muted, #8a9aaa);
}
.qb2-note-bar a { color: #7ab4d4; }

@media (prefers-color-scheme: light) {
  .qb2-note-bar { background: #eef2f7; }
}
html[data-theme="light"] .qb2-note-bar { background: #eef2f7; }
</style>

<div class="qb2-welcome">

  <!-- ===== PAGE HEADING ===== -->
  <h1 class="qb2-page-title">Welcome to Your TT-QuietBox 2</h1>
  <p class="qb2-page-sub">Four Blackhole chips · 480 Tensix cores · 128 GB DDR6 · no API keys required</p>

  <!-- ===== CHIP WIDGET ===== -->
  <div class="qb2-chip-widget" id="qb2ChipWidget">
    <div class="qb2-chip-widget-inner">

      <!-- CARD 1 (top row) -->
      <div class="qb2-card-row">
        <span class="qb2-card-side-label">CARD 0</span>
        <div class="qb2-chip-pair">
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH·0</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas0" width="238" height="108"></canvas>
          </div>
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH·1</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas1" width="238" height="108"></canvas>
          </div>
        </div>
      </div>

      <!-- SAMTEC divider -->
      <div class="qb2-samtec-divider">
        <div class="qb2-samtec-line"></div>
        <span class="qb2-samtec-label">Samtec cable · inter-card link</span>
        <div class="qb2-samtec-line"></div>
      </div>

      <!-- CARD 2 (bottom row) -->
      <div class="qb2-card-row">
        <span class="qb2-card-side-label">CARD 1</span>
        <div class="qb2-chip-pair">
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH·2</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas2" width="238" height="108"></canvas>
          </div>
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH·3</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas3" width="238" height="108"></canvas>
          </div>
        </div>
      </div>

      <!-- footer -->
      <div class="qb2-chip-footer">
        <span class="qb2-chip-specs">480 cores · 128 GB DDR6 · 2 TB/s bandwidth</span>
        <span class="qb2-chip-mode-label" id="qb2ModeLabel">● idle</span>
      </div>

    </div>
  </div><!-- end chip widget -->

  <!-- ===== INTENT CARDS (2×2 grid) ===== -->
  <div class="qb2-intent-grid">

    <!-- CHAT -->
    <div class="qb2-intent-card card-chat" id="cardChat" onclick="qb2ActivateCard('chat')">
      <div class="qb2-intent-icon">🗨️</div>
      <p class="qb2-intent-title">Chat with AI</p>
      <p class="qb2-intent-tagline">Private LLM inference — 32B &amp; 70B scale</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Models</span>
        <span class="qb2-intent-val">Qwen3-32B <span class="qb2-perf">~8s/response</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label"></span>
        <span class="qb2-intent-val">Llama-3.3-70B <span class="qb2-perf">~14s/response</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label"></span>
        <span class="qb2-intent-val">Llama-3.1-8B <span class="qb2-perf">fast</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Deploy</span>
        <span class="qb2-intent-val">tt-studio — point-and-click launcher, pre-installed</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">API</span>
        <span class="qb2-intent-val">tt-inference-server — OpenAI-compatible endpoint, pre-installed</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Monitor</span>
        <span class="qb2-intent-val">tt-toplike — watch cores during inference</span>
      </div>
      <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/">→ Local AI Agents on QB2</a>
    </div>

    <!-- VIDEO -->
    <div class="qb2-intent-card card-video" id="cardVideo" onclick="qb2ActivateCard('video')">
      <div class="qb2-intent-icon">🎬</div>
      <p class="qb2-intent-title">Generate Video &amp; Images</p>
      <p class="qb2-intent-tagline">Text-to-video, image-to-video, stills</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Video</span>
        <span class="qb2-intent-val">Wan 2.2-14B <span class="qb2-perf">~6 min/5-sec clip</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label"></span>
        <span class="qb2-intent-val">SkyReels-V2 <span class="qb2-perf">~28s, image-to-video</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Image</span>
        <span class="qb2-intent-val">FLUX.1-dev <span class="qb2-perf">high-quality stills</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Tool</span>
        <span class="qb2-intent-val">tt-local-generator — queue, gallery, TT-TV kiosk mode</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Prompts</span>
        <span class="qb2-intent-val">✨ Inspire me — Qwen3-0.6B on host CPU, fully on-device</span>
      </div>
      <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-video-generation/">→ Video Generation on QB2</a>
    </div>

    <!-- AGENTS -->
    <div class="qb2-intent-card card-agents" id="cardAgents" onclick="qb2ActivateCard('agents')">
      <div class="qb2-intent-icon">🤖</div>
      <p class="qb2-intent-title">Build AI Agents</p>
      <p class="qb2-intent-tagline">Tool calling, multi-agent, stateful pipelines</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Best model</span>
        <span class="qb2-intent-val">Llama-3.3-70B <span class="qb2-perf">93% tool-call · 78% 3-step</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Also works</span>
        <span class="qb2-intent-val">Qwen3-32B</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Frameworks</span>
        <span class="qb2-intent-val">smolagents · CrewAI · OpenAI Agents SDK</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Demos</span>
        <span class="qb2-intent-val">Web research · codebase nav · multi-role pipelines · stateful dungeon master</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Privacy</span>
        <span class="qb2-intent-val">Data never leaves the machine — architecture, not policy</span>
      </div>
      <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/">→ Local AI Agents on QB2</a>
    </div>

    <!-- EXPLORE -->
    <div class="qb2-intent-card card-explore" id="cardExplore" onclick="qb2ActivateCard('explore')">
      <div class="qb2-intent-icon">🔬</div>
      <p class="qb2-intent-title">Explore the Architecture</p>
      <p class="qb2-intent-tagline">tt-toplike, Particle Life, TT-Metalium</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Watch</span>
        <span class="qb2-intent-val">tt-toplike — Starfield, Memory Castle, Memory Flow, Arcade</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Run</span>
        <span class="qb2-intent-val">Particle Life Simulator on 4× chips — emergent complexity</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Program</span>
        <span class="qb2-intent-val">TT-Metalium — C++ kernels on RISC-V cores in the 2D mesh</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Lessons</span>
        <span class="qb2-intent-val">CS Fundamentals series · Particle Life walkthrough</span>
      </div>
      <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cs-fundamentals-01-computer/">→ CS Fundamentals</a>
      <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cookbook-particle-life/" style="margin-left:6px;">→ Particle Life</a>
    </div>

  </div><!-- end intent grid -->

  <!-- ===== REFERENCE TABLE ===== -->
  <table class="qb2-ref-table">
    <thead>
      <tr>
        <th>Tool</th>
        <th>What it does</th>
        <th>Where</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>tt-smi</td>
        <td>Hardware status and telemetry snapshot</td>
        <td>Pre-installed</td>
      </tr>
      <tr>
        <td>tt-studio</td>
        <td>Model deployment web UI — point and click to launch any supported model</td>
        <td>Pre-installed via <code>tt-studio</code></td>
      </tr>
      <tr>
        <td>tt-inference-server</td>
        <td>OpenAI-compatible model serving endpoint</td>
        <td>Pre-installed at <code>~/.local/lib/tt-inference-server</code></td>
      </tr>
      <tr>
        <td>tt-toplike</td>
        <td>Real-time hardware visualization — power, temperature, core activity</td>
        <td><a href="https://docs.tenstorrent.com/tt-toplike">docs.tenstorrent.com/tt-toplike</a></td>
      </tr>
      <tr>
        <td>tt-local-generator</td>
        <td>Local video and image generation queue and gallery</td>
        <td><a href="https://docs.tenstorrent.com/tt-local-generator">docs.tenstorrent.com/tt-local-generator</a></td>
      </tr>
      <tr>
        <td>tt-vscode-toolkit</td>
        <td>Guided lessons and architecture walkthroughs, validated on QB2</td>
        <td><a href="https://docs.tenstorrent.com/tt-vscode-toolkit">docs.tenstorrent.com/tt-vscode-toolkit</a></td>
      </tr>
      <tr>
        <td>TT-Metalium</td>
        <td>Low-level Tensix programming — C++ kernels on RISC-V cores</td>
        <td><a href="https://docs.tenstorrent.com">docs.tenstorrent.com</a></td>
      </tr>
    </tbody>
  </table>

  <!-- ===== NOTE BAR ===== -->
  <div class="qb2-note-bar">
    <strong>Hardware setup not finished?</strong> Start with the
    <a href="/systems/quietbox/quietbox-bh-2/setup">setup guide</a> — unboxing, first login, verifying chips with tt-smi, and launching your first model.
    Need help? <a href="https://tenstorrent.com/support">Raise a support request.</a>
  </div>

</div><!-- end .qb2-welcome -->
```

- [ ] **Step 2: Run the build to verify the HTML renders without errors**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io/core && make html 2>&1 | grep -E "(ERROR|WARNING|error|warning)" | grep -v "external" | head -20
```

Expected: no output (or only external link warnings which are benign). If you see `ERROR`, check the raw HTML block for unclosed tags or mismatched backtick fences.

- [ ] **Step 3: Open the built page to confirm structure renders**

Open in browser:
```
file:///Users/tsingletary/code/tenstorrent.github.io/core/_build/html/systems/quietbox/quietbox-bh-2/welcome.html
```

Expected: page title visible, dark chip widget area (black rectangles — no animation yet), 4 cards in 2×2 grid, reference table, note bar at bottom.

- [ ] **Step 4: Commit**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io
git add core/systems/quietbox/quietbox-bh-2/welcome.md
git commit -m "feat(qb2-welcome): replace prose with intent-first HTML scaffold — CSS, chip widget HTML, cards, table"
```

---

## Task 3: Add TensixViz initialization and idle animation

This task adds the `<script>` block that initializes the 4 `TensixViz` instances and starts the idle looping animation. At the end of this task the chip widget animates continuously in idle mode (quiet random shimmer).

**Files:**
- Modify: `core/systems/quietbox/quietbox-bh-2/welcome.md`

- [ ] **Step 1: Add the script block immediately before the closing `` ``` `` of the raw block**

In `welcome.md`, find the closing of the raw block (the line that is just `` ``` `` after `</div><!-- end .qb2-welcome -->`). Insert the following script block between that `</div>` and the closing fence:

```html
<script>
(function() {
  'use strict';

  /* ------------------------------------------------------------------
     TensixViz initialization
     Waits for the TensixViz global to be available, then initializes
     4 Blackhole chip instances and starts the idle animation.
  ------------------------------------------------------------------ */

  var CHIP_IDS = ['qb2Canvas0', 'qb2Canvas1', 'qb2Canvas2', 'qb2Canvas3'];
  var vizInstances = [];   // TensixViz instances, one per canvas
  var currentMode = 'idle';

  /* ----- idle script: random shimmer at low heat ----- */
  /* Blackhole tensix cores: rows 1-10, cols 1-7 and 9-15 */
  var TENSIX_COLS = [1,2,3,4,5,6,7,9,10,11,12,13,14,15];

  var idleScript = [
    { step: 'highlight', cores: [[2,2],[5,4],[9,7],[13,3],[3,8],[7,5],[11,2],[14,9]], color: '#4fd1c5', label: '', ms: 700 },
    { step: 'pause', ms: 500 },
    { step: 'unhighlight', ms: 350 },
    { step: 'pause', ms: 350 },
    { step: 'highlight', cores: [[4,3],[10,6],[2,9],[14,2],[7,7],[12,4],[1,5],[6,8]], color: '#4a7a9b', label: '', ms: 700 },
    { step: 'pause', ms: 500 },
    { step: 'unhighlight', ms: 350 },
    { step: 'pause', ms: 300 },
    { step: 'highlight', cores: [[3,1],[6,3],[11,5],[15,8],[2,7],[9,2],[13,9],[4,6]], color: '#4fd1c5', label: '', ms: 700 },
    { step: 'pause', ms: 500 },
    { step: 'unhighlight', ms: 350 },
    { step: 'pause', ms: 400 }
  ];

  /* ----- initialise when DOM + TensixViz are ready ----- */
  function initViz() {
    if (typeof window.TensixViz === 'undefined') {
      setTimeout(initViz, 80);
      return;
    }
    CHIP_IDS.forEach(function(id, i) {
      var canvas = document.getElementById(id);
      if (!canvas) return;
      var viz = new window.TensixViz(canvas, { arch: 'blackhole', speed: 1.0 });
      vizInstances[i] = viz;
    });
    playAllViz(idleScript, true /* loop */);
  }

  /* ----- helper: play script on all 4 chips ----- */
  function playAllViz(script, loop) {
    vizInstances.forEach(function(viz) {
      if (!viz) return;
      viz.reset();
      viz._loop = !!loop;
      viz.play(script);
    });
  }

  document.addEventListener('DOMContentLoaded', initViz);

  /* expose for card click handlers (added in Task 5) */
  window._qb2Viz = {
    instances: vizInstances,
    playAll: playAllViz,
    idleScript: idleScript,
    setMode: function(mode) { currentMode = mode; }
  };

})();
</script>
```

- [ ] **Step 2: Rebuild and verify idle animation runs**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io/core && make html 2>&1 | grep -E "^(build|ERROR)" | head -5
```

Open in browser:
```
file:///Users/tsingletary/code/tenstorrent.github.io/core/_build/html/systems/quietbox/quietbox-bh-2/welcome.html
```

Expected: 4 canvas elements show the Blackhole 17×12 topology (DRAM rows top/bottom, ETH cols on edges, PCIe at col 8 visible) and cores slowly shimmer teal and blue on a ~1.5s cycle. Open browser console — should have zero errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io
git add core/systems/quietbox/quietbox-bh-2/welcome.md
git commit -m "feat(qb2-welcome): add TensixViz init and idle animation on all 4 chips"
```

---

## Task 4: Add workload animation scripts and card click handlers

This task adds the four workload scripts (chat, video, agents, explore) and the `qb2ActivateCard` function that the cards' `onclick` attributes already call. At the end of this task clicking any card changes the animation and the widget border/mode label.

**Files:**
- Modify: `core/systems/quietbox/quietbox-bh-2/welcome.md`

- [ ] **Step 1: Add workload scripts and card handler inside the existing `<script>` block**

Locate the line `window._qb2Viz = {` inside the `<script>` block from Task 3. Insert the following **before** that line (i.e., still inside the IIFE):

```javascript
  /* ================================================================
     WORKLOAD ANIMATION SCRIPTS
     Each script loops continuously via viz._loop = true.
     Pattern: unhighlight (clear all) → highlight new cores → pause.
     Colors: chat=teal, video=pink, agents=purple, explore=gold.
  ================================================================ */

  /* ----- CHAT: inference wave — column sweep L→R ----- */
  var chatScript = (function() {
    var steps = [];
    var cols = [1,2,3,4,5,6,7,9,10,11,12,13,14,15];
    for (var i = 0; i < cols.length; i++) {
      var col = cols[i];
      var cores = [];
      for (var row = 1; row <= 10; row++) cores.push([col, row]);
      steps.push({ step: 'unhighlight', ms: 0 });
      steps.push({ step: 'highlight', cores: cores, color: '#4fd1c5', label: i === 0 ? 'inference' : '', ms: 220 });
      steps.push({ step: 'pause', ms: 60 });
    }
    steps.push({ step: 'clear' });
    steps.push({ step: 'pause', ms: 500 });
    return steps;
  })();

  /* ----- VIDEO: diffusion ripple — expanding ring from center ----- */
  var videoScript = (function() {
    var steps = [];
    /* Center: col 7, row 5 (left half of chip, avoids PCIe at col 8) */
    var cx = 7, cy = 5;
    var cols = [1,2,3,4,5,6,7,9,10,11,12,13,14,15];
    for (var r = 1; r <= 7; r++) {
      var ring = [];
      for (var row = 1; row <= 10; row++) {
        for (var ci = 0; ci < cols.length; ci++) {
          var col = cols[ci];
          var dist = Math.round(Math.sqrt(Math.pow(col - cx, 2) + Math.pow(row - cy, 2)));
          if (dist === r) ring.push([col, row]);
        }
      }
      if (ring.length > 0) {
        steps.push({ step: 'unhighlight', ms: 0 });
        steps.push({ step: 'highlight', cores: ring, color: '#ec96b8', label: r === 1 ? 'diffusion step' : '', ms: 280 });
        steps.push({ step: 'pause', ms: 80 });
      }
    }
    steps.push({ step: 'clear' });
    steps.push({ step: 'pause', ms: 500 });
    return steps;
  })();

  /* ----- AGENTS: burst clusters — async tool-call dispatch ----- */
  var agentsScript = (function() {
    var clusters = [
      [[1,2],[2,2],[1,3],[2,3]],
      [[5,6],[6,6],[5,7],[6,7]],
      [[11,3],[12,3],[11,4]],
      [[14,7],[13,7],[14,8],[13,8]],
      [[3,9],[4,9],[3,10],[4,10]],
      [[9,1],[10,1],[9,2]],
      [[7,5],[6,5],[7,4]]
    ];
    var steps = [];
    for (var i = 0; i < clusters.length; i++) {
      steps.push({
        step: 'highlight',
        cores: clusters[i],
        color: '#9370db',
        label: i === 0 ? 'tool dispatch' : '',
        ms: 280
      });
      steps.push({ step: 'pause', ms: 220 });
    }
    steps.push({ step: 'unhighlight', ms: 400 });
    steps.push({ step: 'pause', ms: 400 });
    return steps;
  })();

  /* ----- EXPLORE: sinusoidal field — Particle Life physics ----- */
  var exploreScript = (function() {
    var steps = [];
    var cols = [1,2,3,4,5,6,7,9,10,11,12,13,14,15];
    for (var phase = 0; phase < 5; phase++) {
      var cores = [];
      for (var ci = 0; ci < cols.length; ci++) {
        var col = cols[ci];
        for (var row = 1; row <= 10; row++) {
          if (Math.sin(col * 0.75 + phase * 1.1 + row * 0.45) > 0.25) {
            cores.push([col, row]);
          }
        }
      }
      if (cores.length > 0) {
        steps.push({ step: 'unhighlight', ms: 0 });
        steps.push({ step: 'highlight', cores: cores, color: '#f4c471', label: phase === 0 ? 'particle life' : '', ms: 320 });
        steps.push({ step: 'pause', ms: 120 });
      }
    }
    steps.push({ step: 'clear' });
    steps.push({ step: 'pause', ms: 400 });
    return steps;
  })();

  /* ================================================================
     CARD CLICK HANDLER
     Updates widget border, mode label, and plays the workload script.
     Calling the same card again resets to idle.
  ================================================================ */
  var CARD_MODES = {
    chat:    { script: chatScript,    label: '● chat inference',  cls: 'mode-chat' },
    video:   { script: videoScript,   label: '● video diffusion', cls: 'mode-video' },
    agents:  { script: agentsScript,  label: '● agent dispatch',  cls: 'mode-agents' },
    explore: { script: exploreScript, label: '● particle life',   cls: 'mode-explore' }
  };

  window.qb2ActivateCard = function(mode) {
    var widget = document.getElementById('qb2ChipWidget');
    var modeLabel = document.getElementById('qb2ModeLabel');
    var cards = document.querySelectorAll('.qb2-intent-card');

    /* toggle back to idle if clicking the active card */
    if (currentMode === mode) {
      currentMode = 'idle';
      widget.className = 'qb2-chip-widget';
      modeLabel.className = 'qb2-chip-mode-label';
      modeLabel.textContent = '● idle';
      cards.forEach(function(c) { c.classList.remove('active'); });
      playAllViz(idleScript, true);
      return;
    }

    /* activate new mode */
    currentMode = mode;
    var cfg = CARD_MODES[mode];
    widget.className = 'qb2-chip-widget mode-' + mode;
    modeLabel.className = 'qb2-chip-mode-label ' + cfg.cls;
    modeLabel.textContent = cfg.label;

    /* update card active states */
    cards.forEach(function(c) { c.classList.remove('active'); });
    var activeCard = document.getElementById('card' + mode.charAt(0).toUpperCase() + mode.slice(1));
    if (activeCard) activeCard.classList.add('active');

    playAllViz(cfg.script, true);
  };
```

- [ ] **Step 2: Rebuild and verify card click interaction**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io/core && make html 2>&1 | grep -E "^(build|ERROR)" | head -5
```

Open in browser and test:
1. Page loads → all 4 chips show idle shimmer (teal/blue dots)
2. Click "🗨️ Chat with AI" → chips sweep teal columns L→R, widget border turns teal, mode label shows "● chat inference"
3. Click "🎬 Generate Video & Images" → pink ripple rings expand from center
4. Click "🤖 Build AI Agents" → purple cluster bursts appear
5. Click "🔬 Explore the Architecture" → gold sinusoidal wave passes through grid
6. Click the same card again → returns to idle shimmer
7. Browser console: zero errors

- [ ] **Step 3: Commit**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io
git add core/systems/quietbox/quietbox-bh-2/welcome.md
git commit -m "feat(qb2-welcome): add workload animation scripts and card-click chip interaction"
```

---

## Task 5: Final review — light mode, links, and cleanup

Verify the page is correct in both dark and light RTD theme, all lesson links resolve, and no old welcome.md prose was accidentally left behind.

**Files:**
- Read: `core/systems/quietbox/quietbox-bh-2/welcome.md` (verify)

- [ ] **Step 1: Verify the complete welcome.md structure**

The file should start with the frontmatter (lines 1–7 unchanged):
```markdown
---
myst:
  html_meta:
    product-name: TT-QuietBox Blackhole™, Blackhole™ AI Processor, Tensix core
    technology-concepts: local AI, inference, agent frameworks, video generation, Tensix architecture, RISC-V, tt-toplike, tt-local-generator, tt-vscode-toolkit
    document-type: Conceptual Guide (What's Next)
---
```

Then a single `` ```{raw} html `` block containing CSS, chip widget HTML, intent cards HTML, reference table HTML, note bar HTML, and the `<script>` block. There should be **no** prose from the old welcome.md remaining (no headings like `## What Your Hardware Is`, `## Run Models Easily`, `## Run Open Source Agent Frameworks`, etc.)

- [ ] **Step 2: Check all external lesson links resolve**

```bash
curl -s -o /dev/null -w "%{http_code}" "https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/" && echo
curl -s -o /dev/null -w "%{http_code}" "https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-video-generation/" && echo
curl -s -o /dev/null -w "%{http_code}" "https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cs-fundamentals-01-computer/" && echo
curl -s -o /dev/null -w "%{http_code}" "https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cookbook-particle-life/" && echo
```

Expected: all return `200`. If any return `404` the URL is wrong — update it in the card HTML.

- [ ] **Step 3: Test in light mode**

To test the RTD light theme, append `?theme=light` to the file URL or use the RTD theme switcher. Verify:
- Intent cards have light gray background (not dark), readable text
- Chip widget stays dark (it has hardcoded `background: #0d1f2d`)
- Note bar has light background
- Table text is readable

- [ ] **Step 4: Run a final clean build and check for errors or regressions**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io/core && make clean && make html 2>&1 | tail -10
```

Expected: `build succeeded`. Check that `setup.md`, `specifications.md`, `support.md` in the same directory still render correctly (no accidental changes).

```bash
ls -la /Users/tsingletary/code/tenstorrent.github.io/core/_build/html/systems/quietbox/quietbox-bh-2/
```

Expected: `welcome.html`, `setup.html`, `specifications.html`, `support.html` all present.

- [ ] **Step 5: Commit final state**

```bash
cd /Users/tsingletary/code/tenstorrent.github.io
git add core/systems/quietbox/quietbox-bh-2/welcome.md
git status
git commit -m "feat(qb2-welcome): final review — light mode, link check, clean build verified"
```

---

## Quick reference: full script block structure

The `<script>` block in `welcome.md` after all tasks are complete has this shape:

```
(function() {
  'use strict';

  var CHIP_IDS = [...];
  var vizInstances = [];
  var currentMode = 'idle';
  var TENSIX_COLS = [...];
  var idleScript = [...];       ← from Task 3

  var chatScript = (...);       ← from Task 4
  var videoScript = (...);      ← from Task 4
  var agentsScript = (...);     ← from Task 4
  var exploreScript = (...);    ← from Task 4

  var CARD_MODES = {...};       ← from Task 4
  window.qb2ActivateCard = function(mode) {...};  ← from Task 4

  function initViz() {...}
  function playAllViz(script, loop) {...}
  document.addEventListener('DOMContentLoaded', initViz);

  window._qb2Viz = {...};
})();
```

**Order matters:** `chatScript`, `videoScript`, `agentsScript`, `exploreScript`, and `CARD_MODES` must be defined before `window.qb2ActivateCard`. The `initViz` and `playAllViz` helpers use `idleScript` and `vizInstances` which are in the outer scope, so they must be defined after those declarations. The structure above is correct.
