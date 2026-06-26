TT-Forge™
=======================================

TT-Forge™ is Tenstorrent's end-to-end compiler stack.
It consists of frontends (TT-XLA, TT-Forge-ONNX), a middle and backend compiler (TT-MLIR),
and a cookbook for model fine-tuning and training experiments on Tenstorrent hardware (TT-Blacksmith).

Supported models are tracked in the `tt-forge-models <https://github.com/tenstorrent/tt-forge-models>`_
repository, which is the authoritative source for model validation status across hardware generations.

Demos
--------

.. rst-class:: toctree-no-underline

* `Bringing Up Models on Tenstorrent Hardware with TT-Forge <https://docs.tenstorrent.com/tt-forge/model-bring-up-guide.html>`_

Compiler Stack
--------------

.. toctree::
   :maxdepth: 1

   TT-XLA <https://docs.tenstorrent.com/tt-xla/>
   TT-Forge-ONNX <https://docs.tenstorrent.com/tt-forge-onnx/>
   TT-Blacksmith <https://firdovsimammedovk.github.io/tt-blacksmith-sandbox/>

