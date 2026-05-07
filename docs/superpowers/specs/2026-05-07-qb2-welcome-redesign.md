# QB2 Welcome Page Redesign — Design Spec

**Date:** 2026-05-07
**Branch:** `qb2/welcome-take-two`
**File under change:** `core/systems/quietbox/quietbox-bh-2/welcome.md`
**Static asset added:** `core/_static/js/tensix-viz.js` (copied from `~/code/tt-vscode-toolkit/src/webview/tensix-viz/tensix-viz.js`)

---

## Problem

The current `welcome.md` is a well-written prose document, but it makes the reader work to answer the practical question: *"I have a QB2 — what do I do first?"* Information about tools, models, and lessons is organized by section (monitoring, inference, agents, architecture) rather than by user intent. Someone who just wants to generate video has to scan the whole page.

## Goal

Transform the welcome page into an intent-first visual guide: "you want to do X → use this model → with this tool → follow this lesson." Make it feel alive with a live Blackhole chip widget. Preserve all the technical detail, just reorganize it around what the user is trying to accomplish.

---

## Design Decisions

### 1. Page structure — Intent-First Cards

Four always-expanded use-case tiles in a 2×2 grid, anchored by the chip widget at the top.

**Cards:**
| Card | Intent | Color accent |
|------|--------|--------------|
| 🗨️ Chat with AI | Private LLM inference at 32B/70B scale | Teal `#4fd1c5` |
| 🎬 Generate Video & Images | Text-to-video, image-to-video, stills | Pink `#ec96b8` |
| 🤖 Build AI Agents | Tool calling, multi-agent, stateful pipelines | Purple `#9370db` |
| 🔬 Explore the Architecture | tt-toplike, Particle Life, Metalium | Gold `#f4c471` |

Each card shows: best model(s) with performance numbers, deploy tool, API tool, monitoring tool, lesson link.

**What was considered and not chosen:**
- *Click-to-expand accordion* — adds a click cost to information that users need immediately. Welcome pages should surface, not gate.
- *Journey phases (Monitor → Run → Build → Go Deep)* — correct progression but wrong framing for a welcome page. Implies a sequence the user must follow rather than options they can jump to.
- *Tabbed explorer* — most interactive, least scroll, but hidden content is bad for a first-time page. Users don't know which tab is relevant yet.

### 2. Chip widget — combined treatment

All three visual elements combined into one widget:

- **2×2 physical layout** — four chips arranged exactly as they sit in the machine (2 per card, stacked vertically)
- **Real Blackhole 17×12 core grid** — each chip shows the actual topology: DRAM rows at top/bottom, ETH columns on edges, PCIe column at position 8, 120 Tensix cores filling the interior
- **Topology labels** — "CARD 0" / "CARD 1" labels on the side, "Samtec cable · inter-card link" divider between the card rows, spec strip at the bottom (480 cores · 128 GB DDR6 · 2 TB/s · bandwidth)
- **Live animation** — cores pulse at idle, mode changes on card click

Widget is always dark (`background: #0d1f2d`) regardless of page light/dark mode. It's a hardware panel — it should look like one.

### 3. Card interaction — always expanded + chip reacts

Cards are always fully expanded (no clicking required to read anything). Clicking a card triggers a workload-specific animation on the chip widget. The chip widget border and mode label also change color to match the card's accent.

**Animation modes per workload:**

| Card | Animation | Description |
|------|-----------|-------------|
| 🗨️ Chat | Teal inference wave | Left-to-right sweep across all 4 chips, simulating token generation across the chip mesh |
| 🎬 Video | Pink diffusion ripple | Expanding ring from chip centers, simulating the denoising timestep sweep in a diffusion model |
| 🤖 Agents | Purple burst clusters | Random activation patches that decay — simulating async tool-call dispatch and response |
| 🔬 Explore | Gold sinusoidal field | Phase-offset sine wave across the full core array, simulating the Particle Life physics field |

The idle mode shows a quiet random shimmer (max 35% heat) representing ARC management cores and DDR refresh.

### 4. Implementation — Approach 2 (tensix-viz.js in _static, rest inline)

**tensix-viz.js** is a standalone 817-line Canvas renderer already in tt-vscode-toolkit (`src/webview/tensix-viz/tensix-viz.js`). It requires no build step, exports `window.TensixViz`, and has a defined API for chip topology, theming, animation scripts, and mode changes. Copy it to:

```
core/_static/js/tensix-viz.js
```

`core/conf.py` already lists `'_static/js'` in `html_static_path` — Sphinx flattens this into the build's `_static/` root, so the file is served at `_static/tensix-viz.js`. Add to `html_js_files`:

```python
html_js_files = ['custom.js', 'posthog.js', 'tensix-viz.js']
```

The `welcome.md` page gets a single `.. raw:: html` block containing:
- CSS for the chip widget, intent cards, reference table (scoped with `.qb2-welcome` prefix to avoid leaking into RTD chrome)
- The chip widget HTML structure (4 canvas elements + topology labels)
- The intent cards HTML (4 cards, always expanded)
- The reference table HTML
- A `<script>` block (~120 lines) that initializes 4 `TensixViz` instances and wires card clicks to animation mode changes

**What was considered and not chosen:**
- *All inline* — would embed 817 lines of tensix-viz.js directly in the markdown. Unmaintainable.
- *Full static extraction* — CSS and interaction JS are page-specific. Splitting them into _static makes the page harder to iterate on with no real benefit at this scale.

### 5. Light/dark mode

The chip widget is always dark (hardcoded background, not inherited). This is correct — it represents hardware and should look like a terminal/diagnostic display in both contexts. In light mode it reads as a hardware panel on a bright desk, which is arguably a stronger visual.

Intent cards use CSS custom properties from the RTD theme where possible (`var(--color-background-20)`, `var(--color-foreground)`) with explicit fallbacks for the color-coded accents (teal/pink/purple/gold). The reference table uses the same approach.

---

## Content Mapping

### 🗨️ Chat with AI card

| Field | Content |
|-------|---------|
| Models | Qwen3-32B (~8s/response, COMPLETE on P300X2), Llama-3.3-70B (~14s/response, COMPLETE on P300X2), Llama-3.1-8B (fast, COMPLETE on P300X2) |
| Deploy | tt-studio — point-and-click model launcher, pre-installed |
| API | tt-inference-server — OpenAI-compatible endpoint, pre-installed |
| Monitor | tt-toplike — watch cores during inference |
| Lesson | [Local AI Agents on QB2](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/) |

### 🎬 Generate Video & Images card

| Field | Content |
|-------|---------|
| Video | Wan 2.2-14B (~6 min/5-sec clip, COMPLETE on P300X2), SkyReels-V2 (~28s, image-to-video) |
| Image | FLUX.1-dev (high-quality stills, COMPLETE on P300X2) |
| Tool | tt-local-generator — queue, gallery, TT-TV kiosk mode |
| Prompt gen | ✨ Inspire me — Qwen3-0.6B runs on host CPU, generates prompts on-device |
| Lesson | [Video Generation on QB2](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-video-generation/) |

### 🤖 Build AI Agents card

| Field | Content |
|-------|---------|
| Best model | Llama-3.3-70B (93% single tool-call success, 78% 3-step chain) |
| Also works | Qwen3-32B |
| Frameworks | smolagents, CrewAI, OpenAI Agents SDK |
| Demos | Web research, codebase navigation, multi-role pipelines, stateful dungeon master |
| Privacy note | Data never leaves the machine — architecture, not policy |
| Lesson | [Local AI Agents on QB2](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/) |

### 🔬 Explore the Architecture card

| Field | Content |
|-------|---------|
| Watch | tt-toplike — Starfield, Memory Castle, Memory Flow, Arcade modes |
| Run | Particle Life Simulator on 4× chips — multi-device, emergent complexity |
| Program | TT-Metalium — C++ kernels on RISC-V cores in the 2D mesh |
| Lessons | CS Fundamentals series (RISC-V, NoC, memory hierarchy), Particle Life walkthrough |
| Lesson links | [CS Fundamentals](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cs-fundamentals-01-computer/), [Particle Life](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cookbook-particle-life/) |

### Reference table (bottom of page)

Condensed from the existing "What's Here and What Comes Next" table. Columns: Tool | What it does | Where. Rows: tt-smi, tt-studio, tt-inference-server, tt-toplike, tt-local-generator, tt-vscode-toolkit, TT-Metalium.

### Removed from the new welcome.md

The following sections from the current welcome.md are removed. No new pages need to be created — this content already exists in the external docs that welcome.md links to. These are duplicates, not originals:

- Extended tt-toplike visualization mode descriptions (Starfield, Memory Castle detail) → lives in [docs.tenstorrent.com/tt-toplike](https://docs.tenstorrent.com/tt-toplike)
- Particle Life GIF and multi-device walkthrough prose → lives in the [Particle Life lesson](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cookbook-particle-life/)
- TT-Metalium/RISC-V deep-dive paragraphs → lives in [CS Fundamentals lessons](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cs-fundamentals-01-computer/)
- Agent framework success rate context paragraph → lives in the [Local Agents lesson](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/)

A brief "setup not done?" note bar remains at the bottom pointing to the setup guide and support page.

---

## File Changes

| File | Change |
|------|--------|
| `core/systems/quietbox/quietbox-bh-2/welcome.md` | Replace prose content with raw HTML block |
| `core/_static/js/tensix-viz.js` | New file — copied from tt-vscode-toolkit |
| `core/conf.py` | Add `tensix-viz.js` to `html_js_files` |

No changes to `index.rst`, `setup.md`, `specifications.md`, or other QB2 pages.

---

## Post-job: tt-vscode-toolkit chip visualizations

After this project ships, create a new branch off updated `main` in `~/code/tt-vscode-toolkit` to:

1. Weave the Blackhole chip visualizer into QB2-specific lessons (qb2-local-agents, qb2-video-generation) — chip widget showing the 4-chip physical layout
2. Weave the Wormhole chip visualizer (10×12 grid, different topology) into LLM intro and general hardware lessons
3. Add both chip variants to the site's widget playground with interactive scene selection
4. QB2-specific content additions as identified during this work

This is a separate implementation cycle with its own spec.

---

## Success Criteria

- The welcome page answers "what do I do first?" without requiring the user to read the whole page
- The chip widget animates continuously and responds to card clicks without freezing
- The page renders correctly in both light and dark RTD theme modes
- All lesson links resolve to validated QB2 content on docs.tenstorrent.com
- No existing pages (setup, specifications, support) are broken by the change
- tensix-viz.js loads without console errors in the Sphinx build output
