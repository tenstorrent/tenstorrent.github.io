Tools
=====

* `tt-smi <https://github.com/tenstorrent/tt-smi>`_

The Tenstorrent System Management Interface (TT-SMI) is a command-line tool that provides a simple way to interact with Tenstorrent devices, collect telemetry, and display device and firmware information.

* `ttnn-visualizer <https://github.com/tenstorrent/ttnn-visualizer>`_

TTNN-Visualizer is an interactive tool for visualizing and analyzing model execution on Tenstorrent hardware, providing detailed insights through graphs, memory plots, tensor and buffer views, operation flow diagrams, and multi-instance support via file or SSH report loading. Check out getting started guide: `Getting Started <https://github.com/tenstorrent/ttnn-visualizer/blob/main/docs/getting-started.md>`_ and our tutorial: :doc:`TTNN-Visualizer Tutorial <../ttnn/tutorials/2025_dx_rework/ttnn_visualizer>`.

* `vllm <https://github.com/tenstorrent/vllm>`_

Tenstorrent vLLM is a high-throughput and memory-efficient inference and serving engine for LLMs on Tenstorrent hardware.

* `tt-topology <https://github.com/tenstorrent/tt-topology>`_

Tenstorrent Topology (TT-Topology) is a command line utility used to flash multiple NB cards on a system to use specific eth routing configurations.

* `model-explorer <https://github.com/tenstorrent/model-explorer>`_

Model Explorer is an intuitive, hierarchical view of model graphs, organizing operations into nested layers that users can easily expand or collapse.

.. important::
   For tools specific to individual components of the Tenstorrent software stack—such as TT-Metalium or TT-NN—please refer to their dedicated tool sections in the documentation:
   
   * TT-Metalium Tools: https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/tools/index.html
   * TT-NN Tools: https://docs.tenstorrent.com/tt-metal/latest/ttnn/tools/index.html