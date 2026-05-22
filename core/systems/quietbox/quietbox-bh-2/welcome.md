---
myst:
  html_meta:
    product-name: TT-QuietBox Blackhole™, Blackhole™ AI Processor, Tensix core
    technology-concepts: local AI, inference, agent frameworks, video generation, Tensix architecture, RISC-V, tt-toplike, tt-local-generator, tt-vscode-toolkit
    document-type: Conceptual Guide (What's Next)
---

# Welcome to Your TT-QuietBox 2

```{raw} html

<script src="https://cdn.jsdelivr.net/gh/tsingletaryTT/tensix-viz@main/tensix-viz.js" crossorigin="anonymous"></script>

<style>
/* ============================================================
   QB2 Welcome page — scoped to .qb2-welcome
   Light-first defaults. Chip widget is always dark (hardware
   panel aesthetic). Dark-mode overrides at the bottom.
   ============================================================ */

/* Sphinx generates an h1 from the doc title for <title> and TOC;
   hide it here since the page renders its own custom heading */
#welcome-to-your-tt-quietbox-2 > h1 { display: none; }

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
  color: inherit;
}
.qb2-welcome .qb2-page-sub {
  margin: 0 0 16px 0;
  font-size: 1.05rem;
  color: #3a4d60;
}

/* ---------- CTA row ---------- */
.qb2-cta-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.qb2-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none !important;
  transition: background 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;
}
.qb2-cta-btn-primary {
  background: #007acc;
  color: #fff !important;
  border: 1.5px solid #007acc;
}
.qb2-cta-btn-primary:hover { background: #005fa3; border-color: #005fa3; }
.qb2-cta-btn-outline {
  background: transparent;
  color: #2a3a4a !important;
  border: 1.5px solid #d0d8e4;
}
.qb2-cta-btn-outline:hover { border-color: #6a8aaa; background: #f0f4f8; }

/* ---------- chip widget ---------- */
.qb2-chip-widget {
  background: #EEF4F8;
  border: 1px solid #B8D4E0;
  border-radius: 10px;
  padding: 18px 20px 14px;
  margin-bottom: 28px;
  position: relative;
  transition: border-color 0.4s ease;
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
  color: #4A6878;
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
  color: #4A6878;
  letter-spacing: 0.08em;
}
canvas.qb2-chip-canvas {
  display: block;
  border-radius: 3px;
  border: 1px solid #B8D4E0;
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
  background: #B8D4E0;
  max-width: 180px;
}
.qb2-samtec-label {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 9px;
  color: #4A6878;
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
  border-top: 1px solid #B8D4E0;
  width: 100%;
}
.qb2-chip-specs {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 10px;
  color: #4A6878;
  letter-spacing: 0.06em;
}
.qb2-chip-mode-label {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 10px;
  color: #4A6878;
  letter-spacing: 0.08em;
  transition: color 0.4s ease;
  min-width: 140px;
  text-align: right;
}
.qb2-chip-mode-label.mode-chat    { color: #0D9488; }
.qb2-chip-mode-label.mode-video   { color: #ec96b8; }
.qb2-chip-mode-label.mode-agents  { color: #9370db; }
.qb2-chip-mode-label.mode-hack    { color: #fb923c; }
.qb2-chip-mode-label.mode-explore { color: #f4c471; }

/* widget border highlight on active card */
.qb2-chip-widget.mode-chat    { border-color: #0D9488; }
.qb2-chip-widget.mode-video   { border-color: #ec96b8; }
.qb2-chip-widget.mode-agents  { border-color: #9370db; }
.qb2-chip-widget.mode-hack    { border-color: #fb923c; }
.qb2-chip-widget.mode-explore { border-color: #f4c471; }

/* ---------- intent cards ---------- */
.qb2-intent-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 28px;
}
/* Explore spans full width — it has more rows and gets the extra room */
.qb2-intent-card.card-explore {
  grid-column: 1 / -1;
}
@media (max-width: 640px) {
  .qb2-intent-grid { grid-template-columns: 1fr; }
  .qb2-intent-card.card-explore { grid-column: auto; }
}

.qb2-intent-card {
  background: #f5f7fa;
  border: 1.5px solid #d0d8e4;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
}
.qb2-intent-card:hover {
  border-color: #6a8aaa;
}

/* accent borders — active state */
.qb2-intent-card.active.card-chat    { border-color: #4fd1c5; box-shadow: 0 0 12px rgba(79,209,197,0.15); }
.qb2-intent-card.active.card-video   { border-color: #ec96b8; box-shadow: 0 0 12px rgba(236,150,184,0.15); }
.qb2-intent-card.active.card-agents  { border-color: #9370db; box-shadow: 0 0 12px rgba(147,112,219,0.15); }
.qb2-intent-card.active.card-hack    { border-color: #fb923c; box-shadow: 0 0 12px rgba(251,146,60,0.15); }
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
  color: #1e2a3a;
}
.qb2-intent-tagline {
  font-size: 0.8rem;
  color: #546070;
  margin: 0 0 10px 0;
}
.qb2-intent-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 6px 0;
}
.qb2-intent-row + .qb2-intent-row {
  border-top: 1px solid rgba(0,0,0,0.08);
}
.qb2-intent-label {
  font-size: 0.67rem;
  font-weight: 700;
  color: #8a9bb0;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.qb2-intent-val {
  font-size: 0.8rem;
  color: #2a3a4a;
  line-height: 1.4;
}
/* subtle deep links — inherit color, dotted underline that strengthens on hover */
.qb2-intent-val a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(0,0,0,0.22);
}
.qb2-intent-val a:hover {
  text-decoration-color: rgba(0,0,0,0.55);
}
.qb2-perf {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-size: 0.72rem;
  background: rgba(0,0,0,0.06);
  border-radius: 3px;
  padding: 1px 5px;
  color: #6a7888;
  white-space: nowrap;
}
.qb2-lesson-area {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(0,0,0,0.08);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.qb2-lesson-btn {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 5px;
  text-decoration: none !important;
  transition: opacity 0.2s ease;
}
.qb2-lesson-btn:hover { opacity: 0.8; }
/* Lesson button colors: darker accent shades for contrast on light card bg (#f5f7fa) */
.card-chat    .qb2-lesson-btn { background: rgba(79,209,197,0.15);  color: #0e7c74; }
.card-video   .qb2-lesson-btn { background: rgba(236,150,184,0.15); color: #b03468; }
.card-agents  .qb2-lesson-btn { background: rgba(147,112,219,0.15); color: #5a2dbb; }
.card-hack    .qb2-lesson-btn { background: rgba(251,146,60,0.15);  color: #7c2d12; }
.card-explore .qb2-lesson-btn { background: rgba(244,196,113,0.15); color: #876200; }

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
  border-bottom: 2px solid #d0d8e4;
  color: #6a7888;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.qb2-ref-table td {
  padding: 7px 10px;
  border-bottom: 1px solid #e8ecf0;
  color: #2a3a4a;
  vertical-align: top;
}
.qb2-ref-table td:first-child {
  font-family: "Ubuntu Mono", "Fira Mono", monospace;
  font-weight: 600;
  white-space: nowrap;
  color: #7a50c8;
}
.qb2-ref-table a { color: inherit; text-decoration: underline; }

/* ---------- note bar ---------- */
.qb2-note-bar {
  margin-top: 24px;
  padding: 12px 16px;
  background: #eef2f7;
  border-left: 3px solid #4a7a9b;
  border-radius: 0 6px 6px 0;
  font-size: 0.83rem;
  color: #546070;
}
.qb2-note-bar a { color: #2a6a9b; }

/* ---------- intro paragraph ---------- */
.qb2-welcome .qb2-intro {
  font-size: 0.95rem;
  color: #2a3a4a;
  line-height: 1.65;
  margin: 0 0 20px 0;
}
.qb2-welcome .qb2-intro a { color: #007acc; }
</style>

<div class="qb2-welcome">

  <!-- ===== PAGE HEADING ===== -->
  <h1 class="qb2-page-title">Welcome to Your TT-QuietBox 2</h1>
  <p class="qb2-page-sub">Four Blackhole chips &middot; 480 Tensix cores &middot; 128 GB GDDR6 &middot; no API keys required</p>

  <!-- ===== INTRO ===== -->
  <p class="qb2-intro">From open source models to local agents to custom kernels and infinite generative art. Welcome to your TT-QuietBox 2.</p>

  <!-- ===== CTA ROW ===== -->
  <div class="qb2-cta-row">
    <a class="qb2-cta-btn qb2-cta-btn-primary"
       href="https://github.com/tenstorrent/tt-studio"
       target="_blank" rel="noopener">
      &#128187; Open TT-Studio
    </a>
    <a class="qb2-cta-btn qb2-cta-btn-outline"
       href="https://marketplace.visualstudio.com/items?itemName=Tenstorrent.tt-vscode-toolkit"
       target="_blank" rel="noopener">
      &#9889; Install VS&thinsp;Code Toolkit
    </a>
    <a class="qb2-cta-btn qb2-cta-btn-outline"
       href="https://docs.tenstorrent.com/tt-vscode-toolkit">
      &#128218; Browse all lessons
    </a>
    <a class="qb2-cta-btn qb2-cta-btn-outline"
       href="setup.html">
      &#128203; Setup guide
    </a>
  </div>

  <!-- ===== CHIP WIDGET ===== -->
  <div class="qb2-chip-widget tv-light" id="qb2ChipWidget">
    <div class="qb2-chip-widget-inner">

      <!-- CARD 0 (top row) -->
      <div class="qb2-card-row">
        <span class="qb2-card-side-label">CARD 0</span>
        <div class="qb2-chip-pair">
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH&middot;0</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas0" width="248" height="168"></canvas>
          </div>
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH&middot;1</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas1" width="248" height="168"></canvas>
          </div>
        </div>
      </div>

      <!-- SAMTEC divider -->
      <div class="qb2-samtec-divider">
        <div class="qb2-samtec-line"></div>
        <span class="qb2-samtec-label">Samtec cable &middot; inter-card link</span>
        <div class="qb2-samtec-line"></div>
      </div>

      <!-- CARD 1 (bottom row) -->
      <div class="qb2-card-row">
        <span class="qb2-card-side-label">CARD 1</span>
        <div class="qb2-chip-pair">
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH&middot;2</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas2" width="248" height="168"></canvas>
          </div>
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH&middot;3</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas3" width="248" height="168"></canvas>
          </div>
        </div>
      </div>

      <!-- widget footer -->
      <div class="qb2-chip-footer">
        <span class="qb2-chip-specs">480 cores &middot; 128 GB GDDR6 &middot; 2 TB/s bandwidth</span>
        <span class="qb2-chip-mode-label" id="qb2ModeLabel">&#9679; idle</span>
      </div>

    </div>
  </div><!-- end chip widget -->

  <!-- ===== INTENT CARDS (2x2 grid) ===== -->
  <div class="qb2-intent-grid">

    <!-- CHAT -->
    <div class="qb2-intent-card card-chat" id="cardChat" onclick="qb2ActivateCard('chat')">
      <div class="qb2-intent-icon">&#128488;&#65039;</div>
      <p class="qb2-intent-title">Chat with AI</p>
      <p class="qb2-intent-tagline">Private LLM inference &mdash; 32B &amp; 70B scale</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Start here</span>
        <span class="qb2-intent-val"><a href="https://github.com/tenstorrent/tt-studio" target="_blank" rel="noopener">TT-Studio</a> &mdash; browser UI, one-click model deploy, pre-installed</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Models</span>
        <span class="qb2-intent-val">Llama-3.3-70B <span class="qb2-perf">~14s/response</span> &middot; Llama-3.1-8B <span class="qb2-perf">fast</span> &middot; <a href="https://developer.tenstorrent.com/" target="_blank" rel="noopener">full catalog ↗</a></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">API</span>
        <span class="qb2-intent-val"><a href="https://github.com/tenstorrent/tt-inference-server" target="_blank" rel="noopener">TT-Inference-Server</a> &mdash; OpenAI-compatible endpoint, pre-installed</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Monitor</span>
        <span class="qb2-intent-val"><a href="https://docs.tenstorrent.com/tt-toplike/" target="_blank" rel="noopener">TT-Toplike</a> &mdash; watch cores during inference</span>
      </div>
      <div class="qb2-lesson-area">
        <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/coding-assistant/">&#8594; Coding Assistant with Aider</a>
      </div>
    </div>

    <!-- VIDEO -->
    <div class="qb2-intent-card card-video" id="cardVideo" onclick="qb2ActivateCard('video')">
      <div class="qb2-intent-icon">&#127916;</div>
      <p class="qb2-intent-title">Generate Video &amp; Images</p>
      <p class="qb2-intent-tagline">Text-to-video, image-to-video, stills</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Start here</span>
        <span class="qb2-intent-val"><a href="https://github.com/tenstorrent/tt-studio" target="_blank" rel="noopener">TT-Studio</a> &mdash; deploy any model with one click, pre-installed</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Gallery</span>
        <span class="qb2-intent-val"><a href="https://docs.tenstorrent.com/tt-local-generator/" target="_blank" rel="noopener">TT-Local-Generator</a> &mdash; queue, gallery, TT-TV kiosk mode</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Video</span>
        <span class="qb2-intent-val">Wan 2.2-14B <span class="qb2-perf">~6 min/5-sec clip</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Image</span>
        <span class="qb2-intent-val">FLUX.1-dev <span class="qb2-perf">high-quality stills</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Prompts</span>
        <span class="qb2-intent-val">&#10024; Inspire me &mdash; prompt ideas from a small on-device model</span>
      </div>
      <div class="qb2-lesson-area">
        <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-video-generation/">&#8594; Video Generation on QB2</a>
      </div>
    </div>

    <!-- AGENTS -->
    <div class="qb2-intent-card card-agents" id="cardAgents" onclick="qb2ActivateCard('agents')">
      <div class="qb2-intent-icon">&#129302;</div>
      <p class="qb2-intent-title">Build AI Agents</p>
      <p class="qb2-intent-tagline">Tool calling, multi-agent, stateful pipelines</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Best model</span>
        <span class="qb2-intent-val">Llama-3.3-70B &mdash; best for agents</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Frameworks</span>
        <span class="qb2-intent-val">smolagents &middot; CrewAI &middot; OpenAI Agents SDK</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Demos</span>
        <span class="qb2-intent-val">Web research &middot; codebase nav &middot; multi-role pipelines &middot; stateful dungeon master</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Privacy</span>
        <span class="qb2-intent-val">Data never leaves the machine &mdash; architecture, not policy</span>
      </div>
      <div class="qb2-lesson-area">
        <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/">&#8594; Local AI Agents on QB2</a>
      </div>
    </div>

    <!-- HACK -->
    <div class="qb2-intent-card card-hack" id="cardHack" onclick="qb2ActivateCard('hack')">
      <div class="qb2-intent-icon">&#9889;</div>
      <p class="qb2-intent-title">Hack the Hardware</p>
      <p class="qb2-intent-tagline">There&rsquo;s a real computer in here &mdash; boot Linux, write kernels</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Boot</span>
        <span class="qb2-intent-val"><a href="https://github.com/tenstorrent/tt-bh-linux" target="_blank" rel="noopener">tt-bh-linux</a> &mdash; run Linux on 16 RISC-V cores inside the chip</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Demos</span>
        <span class="qb2-intent-val">Conway&rsquo;s Game of Life &middot; <a href="https://github.com/tsingletaryTT/tt-zork-and-more" target="_blank" rel="noopener">Zork on TT hardware</a></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Kernels</span>
        <span class="qb2-intent-val"><a href="https://github.com/tenstorrent/tt-lang" target="_blank" rel="noopener">tt-lang</a> &mdash; Python DSL for Tensix kernels &middot; <a href="https://github.com/tenstorrent/tt-metal" target="_blank" rel="noopener">TT-Metalium</a> &mdash; C++ dispatch</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Explore</span>
        <span class="qb2-intent-val"><a href="https://github.com/geohot/tt-tiny" target="_blank" rel="noopener">tt-tiny</a> &mdash; George Hotz&rsquo;s minimal bare-metal Python exploration</span>
      </div>
      <div class="qb2-lesson-area">
        <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cookbook-game-of-life/">&#8594; Cookbook: Game of Life</a>
        <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/tt-lang-intro/">&#8594; Intro to tt-lang</a>
      </div>
    </div>

    <!-- EXPLORE -->
    <div class="qb2-intent-card card-explore" id="cardExplore" onclick="qb2ActivateCard('explore')">
      <div class="qb2-intent-icon">&#128300;</div>
      <p class="qb2-intent-title">Explore the Architecture</p>
      <p class="qb2-intent-tagline">TT-Toplike, Particle Life, TT-Metalium</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Watch</span>
        <span class="qb2-intent-val"><a href="https://docs.tenstorrent.com/tt-toplike/" target="_blank" rel="noopener">TT-Toplike</a> &mdash; Starfield, Memory Castle, Memory Flow, Arcade</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Run</span>
        <span class="qb2-intent-val">Particle Life Simulator on 4&times; chips &mdash; emergent complexity</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Compile</span>
        <span class="qb2-intent-val"><a href="https://github.com/tenstorrent/tt-forge" target="_blank" rel="noopener">TT-Forge</a> &mdash; bring any PyTorch or ONNX model to the hardware, 100+ supported</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Program</span>
        <span class="qb2-intent-val"><a href="https://github.com/tenstorrent/tt-metal" target="_blank" rel="noopener">TT-Metalium</a> &mdash; C++ kernels on RISC-V cores in the 2D mesh</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Discover</span>
        <span class="qb2-intent-val"><a href="https://docs.tenstorrent.com/tt-awesome" target="_blank" rel="noopener">TT-Awesome</a> &mdash; community apps, demos, libraries, and write-ups</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Lessons</span>
        <span class="qb2-intent-val">CS Fundamentals series &middot; Particle Life walkthrough</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Train</span>
        <span class="qb2-intent-val"><a href="https://docs.tenstorrent.com/tt-blacksmith/" target="_blank" rel="noopener">TT-Blacksmith</a> &mdash; fine-tune or train from scratch on 4&times; Blackhole</span>
      </div>
      <div class="qb2-lesson-area">
        <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cs-fundamentals-01-computer/">&#8594; CS Fundamentals</a>
        <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cookbook-particle-life/">&#8594; Particle Life</a>
        <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/ct1-understanding-training/">&#8594; Custom Training</a>
      </div>
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
        <td>TT-SMI</td>
        <td>Hardware status and telemetry snapshot</td>
        <td>Pre-installed</td>
      </tr>
      <tr>
        <td><a href="https://github.com/tenstorrent/tt-studio">TT-Studio</a></td>
        <td>Web GUI for deploying and chatting with AI models &mdash; handles all setup automatically, deploy models in one click. Gated models (e.g. Llama) require a <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener">Hugging Face token</a>.</td>
        <td>Pre-installed &mdash; run <code>tt-studio</code></td>
      </tr>
      <tr>
        <td>TT-Inference-Server</td>
        <td>OpenAI-compatible model serving endpoint</td>
        <td>Pre-installed at <code>~/.local/lib/tt-inference-server</code></td>
      </tr>
      <tr>
        <td>TT-Toplike</td>
        <td>Real-time hardware visualization &mdash; power, temperature, core activity</td>
        <td><a href="https://docs.tenstorrent.com/tt-toplike">docs.tenstorrent.com/tt-toplike</a></td>
      </tr>
      <tr>
        <td>TT-Local-Generator</td>
        <td>Local video and image generation queue and gallery</td>
        <td><a href="https://docs.tenstorrent.com/tt-local-generator">docs.tenstorrent.com/tt-local-generator</a></td>
      </tr>
      <tr>
        <td>TT-VSCode-Toolkit</td>
        <td>Guided lessons and architecture walkthroughs, validated on QB2</td>
        <td><a href="https://docs.tenstorrent.com/tt-vscode-toolkit">docs.tenstorrent.com/tt-vscode-toolkit</a></td>
      </tr>
      <tr>
        <td><a href="https://docs.tenstorrent.com/tt-forge">TT-Forge</a></td>
        <td>MLIR compiler frontend &mdash; run PyTorch, ONNX, and JAX models on QB2 hardware, 100+ models supported</td>
        <td><a href="https://docs.tenstorrent.com/tt-forge">docs.tenstorrent.com/tt-forge</a></td>
      </tr>
      <tr>
        <td>TT-Metalium</td>
        <td>Low-level Tensix programming &mdash; C++ kernels on RISC-V cores</td>
        <td><a href="https://docs.tenstorrent.com">docs.tenstorrent.com</a></td>
      </tr>
      <tr>
        <td><a href="https://docs.tenstorrent.com/tt-blacksmith/">TT-Blacksmith</a></td>
        <td>Optimized training recipes &mdash; fine-tune and train models from scratch on QB2</td>
        <td><a href="https://docs.tenstorrent.com/tt-blacksmith/">docs.tenstorrent.com/tt-blacksmith</a></td>
      </tr>
    </tbody>
  </table>

  <!-- ===== NOTE BAR ===== -->
  <div class="qb2-note-bar">
    <strong>Hardware setup not finished?</strong> Start with the
    <a href="setup.html">setup guide</a> &mdash; unboxing, first login, verifying chips with tt-smi, and launching your first model.
    Need help? <a href="https://tenstorrent.com/support">Raise a support request.</a>
  </div>
  <div class="qb2-note-bar" style="margin-top:8px;opacity:.8">
    <strong>Want to try before you install?</strong>
    <a href="https://console.tenstorrent.com" target="_blank" rel="noopener">console.tenstorrent.com</a>
    &mdash; run LLM inference, image and video generation in-browser, backed by Tenstorrent hardware.
  </div>

</div><!-- end .qb2-welcome -->

<script>
(function() {
  'use strict';

  /* ------------------------------------------------------------------
     QB2 Welcome — TensixViz initialization + idle animation

     Waits for window.TensixViz (loaded via Sphinx html_js_files as
     tensix-viz.js) then initializes 4 Blackhole chip instances and
     starts the idle animation via the tensix-viz activate() API.
  ------------------------------------------------------------------ */

  var CHIP_IDS = ['qb2Canvas0', 'qb2Canvas1', 'qb2Canvas2', 'qb2Canvas3'];
  var vizInstances = [];
  var currentMode = 'idle';

  /* ----- init: poll for TensixViz then create instances ----- */
  function initViz() {
    if (typeof window.TensixViz === 'undefined') {
      setTimeout(initViz, 80);
      return;
    }
    CHIP_IDS.forEach(function(id, i) {
      var canvas = document.getElementById(id);
      if (!canvas) return;
      vizInstances[i] = new window.TensixViz(canvas, { arch: 'blackhole', speed: 1.0 });
    });
    vizInstances.forEach(function(viz) { if (viz) viz.activate('idle'); });
  }

  document.addEventListener('DOMContentLoaded', initViz);

  /* Expose shared state for the card click handler defined below */
  window._qb2Viz = {
    activate: function(mode) {
      vizInstances.forEach(function(viz, i) {
        if (!viz) return;
        try { viz.activate(mode); }
        catch (err) { console.error('[qb2] chip ' + i + ' activate("' + mode + '") failed:', err); }
      });
    },
    getMode: function() { return currentMode; },
    setMode: function(m) { currentMode = m; }
  };

})();
</script>

<script>
(function() {
  'use strict';

  /* ------------------------------------------------------------------
     QB2 Welcome — workload animation modes + card click handler

     Depends on window._qb2Viz set by the init script above.
     Uses the tensix-viz activate(mode) API — continuous RAF loops
     replace the previous hand-written step arrays.

     Mode mapping:
       chat    → 'inference'        teal column sweep (token generation)
       video   → 'diffusion'        pink expanding ring (denoising timestep)
       agents  → 'agents'           purple burst clusters (tool-call dispatch)
       hack    → 'kernel_dispatch'  orange rect grids lighting up across the mesh
       explore → 'explore'          gold sinusoidal field (Particle Life)
  ------------------------------------------------------------------ */

  /* tensix-viz activate() mode names for each intent card */
  var MODE_MAP = {
    chat:    'inference',
    video:   'diffusion',
    agents:  'agents',
    hack:    'kernel_dispatch',
    explore: 'explore'
  };

  /* UI labels and CSS class suffixes */
  var MODE_META = {
    chat:    { label: '\u25cf chat inference',  cls: 'mode-chat'    },
    video:   { label: '\u25cf video diffusion', cls: 'mode-video'   },
    agents:  { label: '\u25cf agent dispatch',  cls: 'mode-agents'  },
    hack:    { label: '\u25cf kernel dispatch',  cls: 'mode-hack'   },
    explore: { label: '\u25cf particle life',   cls: 'mode-explore' }
  };

  /* ----- card click handler ----- */
  window.qb2ActivateCard = function(mode) {
    var v = window._qb2Viz;
    if (!v) return;

    var widget    = document.getElementById('qb2ChipWidget');
    var modeLabel = document.getElementById('qb2ModeLabel');
    var cards     = document.querySelectorAll('.qb2-intent-card');

    /* clicking the active card toggles back to idle */
    if (v.getMode() === mode) {
      v.setMode('idle');
      widget.className    = 'qb2-chip-widget tv-light';
      modeLabel.className = 'qb2-chip-mode-label';
      modeLabel.textContent = '\u25cf idle';
      cards.forEach(function(c) { c.classList.remove('active'); });
      v.activate('idle');
      return;
    }

    /* activate the chosen workload mode */
    v.setMode(mode);
    var meta = MODE_META[mode];
    widget.className    = 'qb2-chip-widget tv-light ' + meta.cls;
    modeLabel.className = 'qb2-chip-mode-label ' + meta.cls;
    modeLabel.textContent = meta.label;

    cards.forEach(function(c) { c.classList.remove('active'); });
    var id = 'card' + mode.charAt(0).toUpperCase() + mode.slice(1);
    var activeCard = document.getElementById(id);
    if (activeCard) activeCard.classList.add('active');

    v.activate(MODE_MAP[mode]);
  };

})();
</script>
```
