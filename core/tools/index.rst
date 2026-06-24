Tools
=====

Hardware Monitoring
-------------------

.. list-table::
   :class: tt-index-cards
   :widths: 50 50

   * - `TT-SMI <https://github.com/tenstorrent/tt-smi>`_

       TT-SMI is a command-line tool for interacting with Tenstorrent devices, collecting telemetry, and displaying device and firmware information. Pre-installed with the Tenstorrent software stack.
     - `TT-Toplike <https://docs.tenstorrent.com/tt-toplike/>`_

       TT-Toplike is a real-time terminal hardware monitor for Tenstorrent silicon. It reads power, temperature, current, and ARC firmware health from the chips and drives visualizations directly from that telemetry: a live table, Starfield, Memory Castle, Memory Flow, and Arcade modes.

Model Serving & Inference
-------------------------

.. list-table::
   :class: tt-index-cards
   :widths: 50 50

   * - `TT-Inference-Server <https://github.com/tenstorrent/tt-inference-server>`_

       TT-Inference-Server is the primary way to deploy models for serving inference on Tenstorrent hardware. It manages Docker containers, model downloads, and serving configuration, and provides an OpenAI-compatible API endpoint. The repository is the canonical reference for which models are validated and supported on each hardware generation.
     - `vLLM <https://github.com/tenstorrent/vllm>`_

       Tenstorrent's vLLM fork is the high-throughput LLM serving engine used by TT-Inference-Server for production inference.

   * - `TT-Studio <https://github.com/tenstorrent/tt-studio>`_

       TT-Studio is a web interface that wraps TT-Inference-Server with a point-and-click model deployment flow. It is the fastest way for new users to deploy and interact with a model without using the command line.
     -

System Configuration
--------------------

.. list-table::
   :class: tt-index-cards
   :widths: 50 50

   * - `TT-Topology <https://github.com/tenstorrent/tt-topology>`_

       TT-Topology is a command-line utility for configuring Ethernet routing on multi-card systems. Required on TT-QuietBox™ and TT-LoudBox™ Wormhole-based systems before running networked inference.
     -

Analysis & Visualization
------------------------

.. list-table::
   :class: tt-index-cards
   :widths: 50 50

   * - `TT-NN Visualizer <https://firdovsimammedovk.github.io/tt-visualizer-sandbox/latest/>`_

       TT-NN Visualizer is an interactive tool for analyzing model execution on Tenstorrent hardware: graphs, memory plots, tensor and buffer views, operation flow diagrams, and multi-instance support via file or SSH report loading.
     - `Model-Explorer <https://github.com/tenstorrent/model-explorer>`_

       Model Explorer provides a hierarchical view of model graphs, organizing operations into nested layers that you can expand or collapse.

   * - `TT-NPE <https://docs.tenstorrent.com/tt-npe/>`_

       Used to validate compiled ops, simulate op execution at the tile or kernel level, and help debug hardware/compiler mismatches.
     -

Learning
--------

.. list-table::
   :class: tt-index-cards
   :widths: 50 50

   * - `TT-VSCode-Toolkit <https://docs.tenstorrent.com/tt-vscode-toolkit>`_

       TT-VSCode-Toolkit is a guided learning environment for Tenstorrent software development inside VS Code. It includes 40+ lessons covering inference, agents, video generation, kernel programming, and CS fundamentals, all validated on Tenstorrent hardware.
     -

Community
---------

.. list-table::
   :class: tt-index-cards
   :widths: 50 50

   * - `TT-Awesome <https://docs.tenstorrent.com/tt-awesome>`_

       TT-Awesome is a community-curated catalog of apps, demos, libraries, and experiments built for Tenstorrent hardware.
     -

.. note::
   No hardware yet? `console.tenstorrent.com <https://console.tenstorrent.com>`_ lets you run LLM inference and image and video generation in the browser, backed by Tenstorrent hardware.

.. important::
   For tools specific to individual components of the Tenstorrent software stack, see:

   * TT-Metalium tools: https://firdovsimammedovk.github.io/tt-metal-sandbox/tt-metalium/tools/index.html
   * TT-NN tools: https://firdovsimammedovk.github.io/tt-metal-sandbox/ttnn/tools/index.html
