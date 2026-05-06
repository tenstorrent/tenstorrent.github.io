TT-Forge
=======================================

TT-Forge is Tenstorrent's end-to-end compiler stack. 
It consists of frontends (TT-Torch, TT-XLA, TT-Forge-ONNX), middle and backend compilers (TT-MLIR), 
and a cookbook for LLM and other model fine-tuning and training experiments 
on Tenstorrent hardware (TT-Blacksmith).

Demos
--------

.. rst-class:: toctree-no-underline

* `Bringing Up Models on Tenstorrent Hardware with TT-Forge <https://docs.tenstorrent.com/tt-forge/model-bring-up-guide.html>`_

Compiler Stack
--------------

.. toctree::
   :maxdepth: 1

   forge-frontend-compiler/index
   forge-backend-compiler/index
   tools/index

Cookbook
--------

.. toctree::
   :maxdepth: 1

   TT-Blacksmith <https://docs.tenstorrent.com/tt-blacksmith/>

