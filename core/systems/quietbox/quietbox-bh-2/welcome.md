---
myst:
  html_meta:
    product-name: TT-QuietBox Blackhole™, Blackhole™ AI Processor, Tensix core
    technology-concepts: local AI, inference, agent frameworks, video generation, Tensix architecture, RISC-V, tt-toplike, tt-local-generator, tt-vscode-toolkit
    document-type: Conceptual Guide (What's Next)
---

```{raw} html

<style>
/* ============================================================
   QB2 Welcome page — scoped to .qb2-welcome
   Light-first defaults. Chip widget is always dark (hardware
   panel aesthetic). Dark-mode overrides at the bottom.
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
  background: #0d1f2d;
  border: 1px solid #1e3a50;
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

/* ---------- intent grid (2x2) ---------- */
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
  gap: 6px;
  margin-bottom: 5px;
  align-items: baseline;
  flex-wrap: wrap;
}
.qb2-intent-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #6a7888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 52px;
  flex-shrink: 0;
}
.qb2-intent-val {
  font-size: 0.8rem;
  color: #2a3a4a;
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
/* Lesson button colors: darker accent shades for contrast on light card bg (#f5f7fa) */
.card-chat    .qb2-lesson-btn { background: rgba(79,209,197,0.15);  color: #0e7c74; }
.card-video   .qb2-lesson-btn { background: rgba(236,150,184,0.15); color: #b03468; }
.card-agents  .qb2-lesson-btn { background: rgba(147,112,219,0.15); color: #5a2dbb; }
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
</style>

<div class="qb2-welcome">

  <!-- ===== PAGE HEADING ===== -->
  <h1 class="qb2-page-title">Welcome to Your TT-QuietBox 2</h1>
  <p class="qb2-page-sub">Four Blackhole chips &middot; 480 Tensix cores &middot; 128 GB DDR6 &middot; no API keys required</p>

  <!-- ===== CTA ROW ===== -->
  <div class="qb2-cta-row">
    <a class="qb2-cta-btn qb2-cta-btn-primary"
       href="https://marketplace.visualstudio.com/items?itemName=Tenstorrent.tt-vscode-toolkit"
       target="_blank" rel="noopener">
      &#9889; Install VS&thinsp;Code Toolkit
    </a>
    <a class="qb2-cta-btn qb2-cta-btn-outline"
       href="https://docs.tenstorrent.com/tt-vscode-toolkit">
      &#128218; Browse all lessons
    </a>
    <a class="qb2-cta-btn qb2-cta-btn-outline"
       href="/systems/quietbox/quietbox-bh-2/setup">
      &#128203; Setup guide
    </a>
  </div>

  <!-- ===== CHIP WIDGET ===== -->
  <div class="qb2-chip-widget" id="qb2ChipWidget">
    <div class="qb2-chip-widget-inner">

      <!-- CARD 0 (top row) -->
      <div class="qb2-card-row">
        <span class="qb2-card-side-label">CARD 0</span>
        <div class="qb2-chip-pair">
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH&middot;0</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas0" width="238" height="108"></canvas>
          </div>
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH&middot;1</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas1" width="238" height="108"></canvas>
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
            <canvas class="qb2-chip-canvas" id="qb2Canvas2" width="238" height="108"></canvas>
          </div>
          <div class="qb2-chip-wrap">
            <span class="qb2-chip-label">BH&middot;3</span>
            <canvas class="qb2-chip-canvas" id="qb2Canvas3" width="238" height="108"></canvas>
          </div>
        </div>
      </div>

      <!-- widget footer -->
      <div class="qb2-chip-footer">
        <span class="qb2-chip-specs">480 cores &middot; 128 GB DDR6 &middot; 2 TB/s bandwidth</span>
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
        <span class="qb2-intent-val">tt-studio &mdash; point-and-click launcher, pre-installed</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">API</span>
        <span class="qb2-intent-val">tt-inference-server &mdash; OpenAI-compatible endpoint, pre-installed</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Monitor</span>
        <span class="qb2-intent-val">tt-toplike &mdash; watch cores during inference</span>
      </div>
      <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/">&#8594; Local AI Agents on QB2</a>
    </div>

    <!-- VIDEO -->
    <div class="qb2-intent-card card-video" id="cardVideo" onclick="qb2ActivateCard('video')">
      <div class="qb2-intent-icon">&#127916;</div>
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
        <span class="qb2-intent-val">tt-local-generator &mdash; queue, gallery, TT-TV kiosk mode</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Prompts</span>
        <span class="qb2-intent-val">&#10024; Inspire me &mdash; Qwen3-0.6B on host CPU, fully on-device</span>
      </div>
      <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-video-generation/">&#8594; Video Generation on QB2</a>
    </div>

    <!-- AGENTS -->
    <div class="qb2-intent-card card-agents" id="cardAgents" onclick="qb2ActivateCard('agents')">
      <div class="qb2-intent-icon">&#129302;</div>
      <p class="qb2-intent-title">Build AI Agents</p>
      <p class="qb2-intent-tagline">Tool calling, multi-agent, stateful pipelines</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Best model</span>
        <span class="qb2-intent-val">Llama-3.3-70B <span class="qb2-perf">93% tool-call &middot; 78% 3-step</span></span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Also works</span>
        <span class="qb2-intent-val">Qwen3-32B</span>
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
      <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/">&#8594; Local AI Agents on QB2</a>
    </div>

    <!-- EXPLORE -->
    <div class="qb2-intent-card card-explore" id="cardExplore" onclick="qb2ActivateCard('explore')">
      <div class="qb2-intent-icon">&#128300;</div>
      <p class="qb2-intent-title">Explore the Architecture</p>
      <p class="qb2-intent-tagline">tt-toplike, Particle Life, TT-Metalium</p>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Watch</span>
        <span class="qb2-intent-val">tt-toplike &mdash; Starfield, Memory Castle, Memory Flow, Arcade</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Run</span>
        <span class="qb2-intent-val">Particle Life Simulator on 4&times; chips &mdash; emergent complexity</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Program</span>
        <span class="qb2-intent-val">TT-Metalium &mdash; C++ kernels on RISC-V cores in the 2D mesh</span>
      </div>
      <div class="qb2-intent-row">
        <span class="qb2-intent-label">Lessons</span>
        <span class="qb2-intent-val">CS Fundamentals series &middot; Particle Life walkthrough</span>
      </div>
      <a class="qb2-lesson-btn" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cs-fundamentals-01-computer/">&#8594; CS Fundamentals</a>
      <a class="qb2-lesson-btn" style="margin-left:6px;" href="https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/cookbook-particle-life/">&#8594; Particle Life</a>
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
        <td>Model deployment web UI &mdash; point and click to launch any supported model</td>
        <td>Pre-installed via <code>tt-studio</code></td>
      </tr>
      <tr>
        <td>tt-inference-server</td>
        <td>OpenAI-compatible model serving endpoint</td>
        <td>Pre-installed at <code>~/.local/lib/tt-inference-server</code></td>
      </tr>
      <tr>
        <td>tt-toplike</td>
        <td>Real-time hardware visualization &mdash; power, temperature, core activity</td>
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
        <td>Low-level Tensix programming &mdash; C++ kernels on RISC-V cores</td>
        <td><a href="https://docs.tenstorrent.com">docs.tenstorrent.com</a></td>
      </tr>
    </tbody>
  </table>

  <!-- ===== NOTE BAR ===== -->
  <div class="qb2-note-bar">
    <strong>Hardware setup not finished?</strong> Start with the
    <a href="/systems/quietbox/quietbox-bh-2/setup">setup guide</a> &mdash; unboxing, first login, verifying chips with tt-smi, and launching your first model.
    Need help? <a href="https://tenstorrent.com/support">Raise a support request.</a>
  </div>

</div><!-- end .qb2-welcome -->

<script>
(function() {
  'use strict';

  /* ------------------------------------------------------------------
     QB2 Welcome — TensixViz initialization + idle animation

     Waits for window.TensixViz (loaded via Sphinx html_js_files as
     tensix-viz.js) then initializes 4 Blackhole chip instances and
     starts the idle looping animation.

     Workload scripts and card click handler are added in the next
     block (qb2ActivateCard), which is defined further down.
  ------------------------------------------------------------------ */

  var CHIP_IDS = ['qb2Canvas0', 'qb2Canvas1', 'qb2Canvas2', 'qb2Canvas3'];
  var vizInstances = [];
  var currentMode = 'idle';

  /* ----- idle script: quiet random shimmer ----- */
  /* Highlights small scattered groups of Tensix cores on a slow cycle.
     Blackhole Tensix cores occupy rows 1-10, cols 1-7 and 9-15.
     Max heat kept low (~20-25% of cores) to simulate ARC + DDR idle. */
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

  /* ----- init: poll for TensixViz then create instances ----- */
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
    playAllViz(idleScript, true);
  }

  /* ----- helper: play script on all 4 chips simultaneously ----- */
  function playAllViz(script, loop) {
    vizInstances.forEach(function(viz) {
      if (!viz) return;
      viz.reset();
      viz._loop = !!loop;
      viz.play(script);
    });
  }

  document.addEventListener('DOMContentLoaded', initViz);

  /* Expose shared state for the card click handler defined below */
  window._qb2Viz = {
    playAll: playAllViz,
    idleScript: idleScript,
    getMode: function() { return currentMode; },
    setMode: function(m) { currentMode = m; }
  };

})();
</script>

<script>
(function() {
  'use strict';

  /* ------------------------------------------------------------------
     QB2 Welcome — workload animation scripts + card click handler

     Depends on window._qb2Viz set by the init script above.
     Each workload script loops via viz._loop = true.

     Animation design:
       chat    — teal column sweep L→R (token generation)
       video   — pink expanding ring from center (diffusion denoising)
       agents  — purple burst clusters (async tool-call dispatch)
       explore — gold sinusoidal wave (Particle Life physics field)

     Blackhole Tensix grid: rows 1-10, cols 1-7 and 9-15 (col 8 = PCIe).
  ------------------------------------------------------------------ */

  /* ----- CHAT: inference wave — column sweep left to right ----- */
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
    /* Center at col 7, row 5 (left half avoids PCIe at col 8) */
    var cx = 7, cy = 5;
    var cols = [1,2,3,4,5,6,7,9,10,11,12,13,14,15];
    for (var r = 1; r <= 7; r++) {
      var ring = [];
      for (var row = 1; row <= 10; row++) {
        for (var ci = 0; ci < cols.length; ci++) {
          var col = cols[ci];
          var dist = Math.round(Math.sqrt(
            Math.pow(col - cx, 2) + Math.pow(row - cy, 2)
          ));
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

  /* ----- mode configuration ----- */
  var CARD_MODES = {
    chat:    { script: chatScript,    label: '\u25cf chat inference',  cls: 'mode-chat' },
    video:   { script: videoScript,   label: '\u25cf video diffusion', cls: 'mode-video' },
    agents:  { script: agentsScript,  label: '\u25cf agent dispatch',  cls: 'mode-agents' },
    explore: { script: exploreScript, label: '\u25cf particle life',   cls: 'mode-explore' }
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
      widget.className    = 'qb2-chip-widget';
      modeLabel.className = 'qb2-chip-mode-label';
      modeLabel.textContent = '\u25cf idle';
      cards.forEach(function(c) { c.classList.remove('active'); });
      v.playAll(v.idleScript, true);
      return;
    }

    /* activate the chosen workload mode */
    v.setMode(mode);
    var cfg = CARD_MODES[mode];
    widget.className    = 'qb2-chip-widget ' + cfg.cls;
    modeLabel.className = 'qb2-chip-mode-label ' + cfg.cls;
    modeLabel.textContent = cfg.label;

    cards.forEach(function(c) { c.classList.remove('active'); });
    var id = 'card' + mode.charAt(0).toUpperCase() + mode.slice(1);
    var activeCard = document.getElementById(id);
    if (activeCard) activeCard.classList.add('active');

    v.playAll(cfg.script, true);
  };

})();
</script>
```
