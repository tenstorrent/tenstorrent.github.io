TT-Forge™ Frontend Compiler
=======================================
TT-Forge offers three different frontend compilers, making it easy to work with a model from almost any framework. These compilers take a high-level model and convert it into Tenstorrent's internal graph IR.

.. rst-class:: tt-index-cards

.. list-table::
   :widths: 50 50
   :class: tt-index-cards

   * - `TT-Torch <https://docs.tenstorrent.com/tt-torch/>`_

       For models using PyTorch

     - `TT-XLA <https://docs.tenstorrent.com/tt-xla/>`_

       For models using something from the XLA ecosystem like JAX or TensorFlow

   * - `TT-Forge-ONNX <https://docs.tenstorrent.com/tt-forge-onnx/>`_

       A general-purpose compiler that's framework-agnostic and able to support multiple input formats (ONNX, TorchScript, custom graph format)

     -

.. toctree::
   :hidden:
   :maxdepth: 2

    TT-Torch <https://docs.tenstorrent.com/tt-torch/>
    TT-Forge-ONNX <https://docs.tenstorrent.com/tt-forge-onnx/>
    TT-XLA <https://docs.tenstorrent.com/tt-xla/>
