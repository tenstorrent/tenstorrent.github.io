# Starting Guide

Welcome to Tenstorrent! This guide will walk you through setting up your Tensix Processor(s) and installing necessary software.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Unboxing and Hardware Setup](#unboxing-and-hardware-setup)
3. [Software Installation](#software-installation)
4. [Support & FAQ](#support-faq)

---

## 1. Prerequisites

Before you begin, ensure you have the following:

- A **compatible host machine** with minimum hardware and OS requirements as specified by each product's minimum system requirements:
  - [Add-In Boards / Cards](https://docs.tenstorrent.com/aibs/index.html)
  - [Systems](https://docs.tenstorrent.com/systems/index.html)
- **Network access** to download software packages.
- **Administrator privileges** on the host machine.

**NOTE**: The recommended OS for all Tenstorrent software is **Ubuntu 22.04 LTS (Jammy Jellyfish)**. Each SDK may support newer distributions of Ubuntu; however, compatibility should be considered experimental at this time.

***NOTE:** Software support for Grayskull has been discontinued. The last supported versions of Tenstorrent's software for Grayskull are as follows:*

- ***TT-Firmware:** `fw_pack-80.15.0.0.fwbundle`*
- ***TT-KMD:** `ttkmd_1.31`*
- ***TT-Buda:** `v0.19.3`*
- ***TT-Metalium:** `v0.55`*

### TT-QuietBox BIOS Requirement

The BIOS for the host motherboard is configured at the factory with the setting for **PCIe AER Reporting Mechanism** set to **OS First**. Tenstorrent's TT-SMI software will fail if this setting is not configured properly. *You should not have to change this setting when first setting up your TT-QuietBox.*

If for whatever reason the BIOS needs to be updated or is reset, this setting must be configured again to ensure TT-SMI is able to function. It is located in the BIOS here:

`Chipset -> AMD CBS -> NBIO Common Options -> NBIO RAS Common Options -> PCIe AER Reporting Mechanism`

## 2. Unboxing and Hardware Setup

1. **Unpack the hardware** and check all components against the provided list.
2. **Install the hardware** following the hardware installation manual and safety guidelines by product:
   - [Add-In Boards / Cards](https://docs.tenstorrent.com/aibs/index.html)
   - [Systems](https://docs.tenstorrent.com/systems/index.html)
3. **Secure the hardware** in place, ensuring it is firmly seated and all connections are stable.

## 3. Software Installation
To interact with the Tensix Processor(s), you’ll need to install the system-level dependencies on your host machine.

Tenstorrent provides a bash script, [tt-installer](https://github.com/tenstorrent/tt-installer/), for fast and easy setup of our software stack. The installer supports Ubuntu, Fedora, and Debian. To use it, paste the following into your terminal:

```{code-block} bash
/bin/bash -c "$(curl -fsSL https://github.com/tenstorrent/tt-installer/releases/latest/download/install.sh)"
```

tt-installer configures necessary packages on your system and installs system-level tools as well as our development framework, TT-Metalium. By default, TT-Metalium is installed as a container using Podman. This containerized environment is appropriate for most users as explained [here](https://github.com/tenstorrent/tt-installer/wiki/Using-the-tt%E2%80%90metalium-container), but advanced users and developers may wish to install Metalium natively on the host system or use Docker instead of Podman. See [TT-NN / TT-Metalium Installation](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/installing.html#tt-nn-tt-metalium-installation) for manual installation instructions.

For more information about tt-installer, please see the [repository](https://github.com/tenstorrent/tt-installer).
If you would prefer to install the software stack manually, see [Manual Installation](https://docs.tenstorrent.com/getting-started/manual-software-install.html).

---

## First 5 things To Do
After tt-installer finishes successfully and you have restarted your system, you can proceed how you like. You may want to:

* [Deploy LLMs](../getting-started/vLLM-servers.md)
  * This is the recommended path users should take to deploy LLMs.
* [Run model demos](../getting-started/model-demos.md)
  * Explore pre-built demonstrations of popular models like Llama, Whisper, Stable Diffusion and ResNet.
  * This is a great way to see Tenstorrent's software in action without deep dives into model architecture.
* Use a high-level interface to build your own models or migrate from Torch: [Use TT-NN](https://docs.tenstorrent.com/tt-metal/latest/ttnn/ttnn/usage.html#basic-examples).
* Install TT-Metalium and write high-performance C++ kernels: Read the [installation guide](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/get_started/get_started.html#installation).
* Learn more about our unique architecture: Start by [reading this guide](https://github.com/tenstorrent/tt-metal/blob/main/METALIUM_GUIDE.md).

### TT-Buda (Deprecated)

Tenstorrent has discontinued development and support for the TT-Buda stack; these links are provided for reference and for developers still using Grayskull® cards.

- [TT-Buda GitHub Repo](https://github.com/tenstorrent/tt-buda)
- [First 5 Things](https://github.com/tenstorrent/tt-buda-demos/tree/main/first_5_steps) for **TT-Buda**

---

## Support & FAQ

For support, forums, and community, visit Tenstorrent's [Discord channel](https://discord.gg/tvhGzHQwaj).

For additional support, file any issues through our [Customer Success Platform](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) or you can contact us directly at [support@tenstorrent.com](mailto:support@tenstorrent.com).
