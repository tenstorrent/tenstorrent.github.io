# Starting Guide

Welcome to Tenstorrent! This guide will walk you through setting up your Tensix Processor(s) and installing necessary software.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Unboxing and Hardware Setup](#unboxing-and-hardware-setup)
3. [Software Installation](#software-installation)
4. [First 5 Things To Do](#first-5-things-to-do)
5. [Support & FAQ](#support-faq)

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

### **1\. Executing tt-installer**
Tenstorrent provides a bash script, [tt-installer](https://github.com/tenstorrent/tt-installer/), for fast and easy setup of our software stack. The installer supports Ubuntu, Fedora, and Debian. To use it, paste the following into your terminal:

```{code-block} bash
/bin/bash -c "$(curl -fsSL https://github.com/tenstorrent/tt-installer/releases/latest/download/install.sh)"
```

This script will prompt you to select which software you wish to install. The first thing you will see looks like:
```
   __                  __                             __
  / /____  ____  _____/ /_____  _____________  ____  / /_
 / __/ _ \/ __ \/ ___/ __/ __ \/ ___/ ___/ _ \/ __ \/ __/
/ /_/  __/ / / (__  ) /_/ /_/ / /  / /  /  __/ / / / /_
\__/\___/_/ /_/____/\__/\____/_/  /_/   \___/_/ /_/\__/

[INFO] Welcome to tenstorrent!
[INFO] This is tt-installer version 1.6.0
[INFO] Log is at /tmp/tenstorrent_install_l2ULbx/install.log
[INFO] Using software versions:
[INFO]   TT-KMD: 2.3.0
[INFO]   Firmware: 18.7.0
[INFO]   System Tools: 1.3.1
[INFO]   tt-smi: 3.0.27
[INFO]   tt-flash: 3.4.2
[INFO] This script will install drivers and tooling and properly configure your tenstorrent hardware.
OK to continue? [Y/n]
```
**Answer "Y" to continue.**

### **2\. Grant Root Privileges**
Next, the installation will start and ask you to grant the script sudo permissions:
```
[INFO] Starting installation
[INFO] Checking for sudo permissions... (may request password)
[sudo] password for <your-username>: 
```
:::{admonition} Required
:class: warning
**Using sudo is required so you must enter your user's password.**
:::

### **3\. Install TT-Metalium Slim Container**
tt-installer configures necessary packages on your system and installs system-level tools as well as our programming framework, TT-Metalium. By default, TT-Metalium is installed as a container using Podman. This containerized environment is appropriate for most users as explained [here](https://github.com/tenstorrent/tt-installer/wiki/Using-the-tt%E2%80%90metalium-container), but advanced users and developers may wish to install Metalium natively on the host system or use Docker instead of Podman. See [TT-NN / TT-Metalium Installation](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/installing.html#tt-nn-tt-metalium-installation) for manual installation instructions.

Next, you will be prompted whether to install the TT-Metalium slim container:
```
[INFO] Would you like to install the TT-Metalium slim container?
[INFO] This container is appropriate if you only need to use TT-NN
Install Metalium [Y/n] 
```

**Installing the TT-Metalium slim container is optional, you may answer "Y" or "N".**

### **4\. Install TT-Metalium Model Demos Container**
Next, you will be prompted whether to install the TT-Metalium Model Demos container:
```
[INFO] Would you like to install the TT-Metalium Model Demos container?
[INFO] This container is best for users who need more TT-Metalium functionality, such as running prebuilt models, but it's large (10GB)
Install Metalium Models [Y/n] 
```
:::{admonition} Optional
:class: note
This container possesses a full build of the [tt-metal](https://github.com/tenstorrent/tt-metal/tree/main) project, including model demo source code.
**If you want to run model demos answer "Y" to this question", otherwise, answer "N".**
:::

### **5\. Choose Python Package Installation Location**
Next, you will be asked to select how you would like to install Python packages. Our software is distributed in many forms, one of them being Python packages. We provide four installation options:
```
[INFO] How would you like to install Python packages?
1) active-venv: Use the active virtual environment
2) new-venv: [DEFAULT] Create a new Python virtual environment (venv) at /home/$USER/.tenstorrent-venv
3) system-python: Use the system pathing, available for multiple users. *** NOT RECOMMENDED UNLESS YOU ARE SURE ***
4) pipx: Use pipx for isolated package installation
Enter your choice (1-4) or press enter for default (new-venv): 
```
**If this is your first time running tt-installer, we recommend using the second, DEFAULT option.**

### **6\. Install System Software Dependencies**
Next, tt-installer will install:
* [TT-KMD](https://github.com/tenstorrent/tt-kmd), the Kernel-Mode Driver
* [TT-Flash](https://github.com/tenstorrent/tt-flash), the utility to flash firmware blobs to Tenstorrent devices
* [TT-Firmware](https://github.com/tenstorrent/tt-firmware), the on-device firmware
* [HugePages](https://github.com/tenstorrent/tt-system-tools), a system tool for improving memory performance
* [TT-SMI](https://github.com/tenstorrent/tt-smi), the System Management Interface

### **7\. Reboot System**
:::{admonition} Important
:class: warning
At the end of the installation process, you will be prompted to answer this question:
```
[INFO] Would you like to reboot now?
```
**You must answer "Y" if this is your first time running tt-installer on your system.**
:::

For more information about tt-installer, please see the [repository](https://github.com/tenstorrent/tt-installer).
If you would prefer to install the software stack manually, see [Manual Installation](https://docs.tenstorrent.com/getting-started/manual-software-install.html).


## 4. Verify System Software Installation
After rebooting your system, we will verify all system software dependencies were successfully installed and loaded. We will do so by utilizing the [tt-smi](https://github.com/tenstorrent/tt-smi) tool to enumerate all Tenstorrent devices.

First, activate the Python environment in which you installed the required Python packages. You performed this environment selection in [Step 5. Choose Python Package Installation Location](#choose-python-package-installation-location).
:::{note}
We assume you selected the DEFAULT option, and installed all Python packages under `/home/$USER/.tenstorrent-venv/bin/activate`. Execute this command to activate the Python virtual environment:
```bash
source ~/.tenstorrent-venv/bin/activate
```
:::

Next, execute this command to start tt-smi, then ensure the number of devices listed under the **"Device Information"** pane matches the number of Tenstorrent devices installed in your system:
```bash
tt-smi
```

Here is an example of what you should see for a system containing a single p150a device:
![](tt_smi_screenshot.png)

:::{danger}
If the number of listed devices does not match what you expect, please [contact support](#support-faq) and we will assist you.
:::

Congratulations, you have successfully installed Tenstorrent's system software!

---

## First 5 Things To Do
After tt-installer finishes successfully and you have restarted your system, you can proceed how you like. You may want to:

* [Run model demos](../getting-started/model-demos.md)
  * Explore pre-built demonstrations of popular models like Llama, Whisper, Stable Diffusion and ResNet.
  * This is a great way to see Tenstorrent's software in action without deep dives into model architecture.
* [Deploy LLMs](../getting-started/vLLM-servers.md)
  * This is the recommended path users should take to deploy LLMs.
* Use a high-level interface to build your own models or migrate from Torch: [Use TT-NN](https://docs.tenstorrent.com/tt-metal/latest/ttnn/ttnn/usage.html#basic-examples).
* Install TT-Metalium and write high-performance C++ kernels: Read the [installation guide](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/get_started/get_started.html#installation).
* Learn more about our unique architecture: Start by [reading this guide](https://github.com/tenstorrent/tt-metal/blob/main/METALIUM_GUIDE.md).

---

## Support & FAQ

For support, forums, and community, visit Tenstorrent's [Discord channel](https://discord.gg/tvhGzHQwaj).

For additional support, file any issues through our [Customer Success Platform](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) or you can contact us directly at [support@tenstorrent.com](mailto:support@tenstorrent.com).
