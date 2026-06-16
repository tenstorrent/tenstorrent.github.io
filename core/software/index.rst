Overview
=======================================

Tenstorrent's software stack takes models from popular frameworks all the way
down to Tensix cores. Most users start at the top with the TT-Forge compiler;
the lower layers are available when you need finer control.

.. raw:: html

   <div class="tt-doc-card-grid">
     <a class="tt-doc-card" href="../forge/index.html">
       <span class="tt-doc-card-text">
         <span class="tt-doc-card-title">TT-Forge&trade;</span>
         <span class="tt-doc-card-desc">End-to-end MLIR compiler. Compile models from PyTorch, JAX, and ONNX — the recommended entry point.</span>
       </span>
     </a>
     <a class="tt-doc-card" href="https://firdovsimammedovk.github.io/tt-metal-sandbox/ttnn/" target="_blank" rel="noopener">
       <span class="tt-doc-card-img"><img src="../_static/home/tt-nn.png" alt="TT-NN" /></span>
       <span class="tt-doc-card-text">
         <span class="tt-doc-card-title">TT-NN&trade;</span>
         <span class="tt-doc-card-desc">High-level Python API of pre-optimized neural-network operations.</span>
       </span>
     </a>
     <a class="tt-doc-card" href="https://firdovsimammedovk.github.io/tt-lang-sandbox/" target="_blank" rel="noopener">
       <span class="tt-doc-card-img"><img src="../_static/home/tt-lang.png" alt="TT-Lang" /></span>
       <span class="tt-doc-card-text">
         <span class="tt-doc-card-title">TT-Lang&trade;</span>
         <span class="tt-doc-card-desc">Python DSL for authoring fused custom operations.</span>
       </span>
     </a>
     <a class="tt-doc-card" href="https://docs.tenstorrent.com/tt-mlir/" target="_blank" rel="noopener">
       <span class="tt-doc-card-img"><img src="../_static/home/tt-mlir.png" alt="TT-MLIR" /></span>
       <span class="tt-doc-card-text">
         <span class="tt-doc-card-title">TT-MLIR&trade;</span>
         <span class="tt-doc-card-desc">MLIR-based backend compiler infrastructure that lowers models onto Tenstorrent hardware.</span>
       </span>
     </a>
     <a class="tt-doc-card" href="https://firdovsimammedovk.github.io/tt-metal-sandbox/tt-metalium/" target="_blank" rel="noopener">
       <span class="tt-doc-card-img"><img src="../_static/home/tt-metalium.png" alt="TT-Metalium" /></span>
       <span class="tt-doc-card-text">
         <span class="tt-doc-card-title">TT-Metalium&trade;</span>
         <span class="tt-doc-card-desc">Low-level C++ SDK for writing custom kernels on Tensix cores.</span>
       </span>
     </a>
   </div>

Choosing your entry point
-------------------------

- **Compile a model** from PyTorch, JAX, or ONNX → **TT-Forge** (recommended start).
- **Build networks in Python** from pre-optimized ops → **TT-NN**.
- **Author custom fused operations** → **TT-Lang**.
- **Write kernels directly on Tensix cores** → **TT-Metalium**.
- **Work on compiler internals or custom backends** → **TT-MLIR**.
