# Introduction to PyBuda

PyBuda ™ is a compute framework used to develop, run, and analyze ML workloads on Tenstorrent hardware.

For a quick start, follow [First 5 Things](https://github.com/tenstorrent/tt-buda-demos/tree/main/first_5_steps) for **TT-Buda**.

## Table of Contents

* [Introduction to PyBuda]()
* [User Guide](user_guide.md)
  * [Framework Support](user_guide.md#framework-support)
  * [PyBuda Introduction](user_guide.md#pybuda-introduction)
  * [Saving and Loading Models](user_guide.md#saving-and-loading-models)
  * [Pybuda Automatic Mixed Precision](user_guide.md#pybuda-automatic-mixed-precision)
  * [Multiple Devices](user_guide.md#multiple-devices)
  * [Pybuda Multi-Model Support (Embedded Applications Only)](user_guide.md#pybuda-multi-model-support-embedded-applications-only)
  * [TT-SMI](user_guide.md#tt-smi)
  * [Examples of PyBuda use cases](user_guide.md#examples-of-pybuda-use-cases)
* [API Reference](api.md)
  * [Python Runtime API](api.md#module-pybuda)
  * [C++ Runtime API](api.md#c-runtime-api)
  * [Configuration and Placement](api.md#configuration-and-placement)
  * [Operations](api.md#operations)
  * [Module Types](api.md#module-types)
  * [Device Types](api.md#device-types)
  * [Miscellaneous](api.md#miscellaneous)
* [Terminology](terminology.md)
  * [Grayskull](terminology.md#grayskull)
  * [Wormhole](terminology.md#wormhole)
  * [Tensix](terminology.md#tensix)
  * [NOC](terminology.md#noc)
  * [L1](terminology.md#l1)
  * [FPU](terminology.md#fpu)
  * [SFPU](terminology.md#sfpu)
  * [Unpacker](terminology.md#unpacker)
  * [Packer](terminology.md#packer)
  * [Op](terminology.md#op)
  * [Epoch](terminology.md#epoch)
  * [Buffer](terminology.md#buffer)
  * [Pipe](terminology.md#pipe)
  * [Tile](terminology.md#tile)
  * [Streaming op](terminology.md#streaming-op)
  * [Blocking op](terminology.md#blocking-op)
  * [Block](terminology.md#block)
  * [TM op](terminology.md#tm-op)
  * [Unicast](terminology.md#unicast)
  * [Multicast](terminology.md#multicast)
  * [Gather](terminology.md#gather)
  * [HLK](terminology.md#hlk)
  * [LLK](terminology.md#llk)
  * [HLKC](terminology.md#hlkc)
* [Advanced User Guide](advanced_user_guide.md)
  * [Software Stack Overview](advanced_user_guide.md#software-stack-overview)
  * [Compiler Configuration](advanced_user_guide.md#compiler-configuration)
  * [Tools & Debug](advanced_user_guide.md#tools-debug)
  * [Comparison To GPU Programming Model](advanced_user_guide.md#comparison-to-gpu-programming-model)
* [Hardware Overview](hardware.md)
* [Data Formats and Math Fidelity](dataformats.md)
  * [Data Formats](dataformats.md#data-formats)
  * [Block Floating Point](dataformats.md#block-floating-point)
  * [Math Fidelity](dataformats.md#math-fidelity)
* [Buda Workload Overview](backend/op.md)
  * [Anatomy of a Buda op](backend/op.md#anatomy-of-a-buda-op)
* [Developer Reference](developer.md)
  * [Low Level Kernels](developer.md#low-level-kernels)

## Index

* [Index](genindex.md)
