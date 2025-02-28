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

**NOTE**: The recommended OS for all Tenstorrent software is **Ubuntu 20.04 LTS (Focal Fossa)**. Each SDK may support newer distributions of Ubuntu; however, compatibility should be considered experimental at this time.

***NOTE:** Software support for Grayskull has been discontinued. The last supported versions of Tenstorrent's software for Grayskull are as follows:*

- ***TT-Firmware:** `fw_pack-80.14.0.0.fwbundle`*
- ***TT-KMD:** `ttkmd_1.31`*
- ***TT-Buda:** `v0.19.3`*
- ***TT-Metalium:** `v0.55`*

## 2. Unboxing and Hardware Setup

1. **Unpack the hardware** and check all components against the provided list.
2. **Install the hardware** following the hardware installation manual and safety guidelines by product:
   - [Add-In Boards / Cards](https://docs.tenstorrent.com/aibs/index.html)
   - [Systems](https://docs.tenstorrent.com/systems/index.html)
3. **Secure the hardware** in place, ensuring it is firmly seated and all connections are stable.

## 3. Software Installation

To interact with the Tensix Processor(s), you’ll need to install the system-level dependencies on your host machine.

**Important!**

This Starting Guide will reference each software utility where the latest version is available. However, each SDK will have its own compatibility matrix associated with each release. It is strongly recommended to consult each SDK's release compatibility matrix to ensure you are installing the correct versions of the system software packages.

### Step 1: Install Software Dependencies

Install git, wget, pip, and DKMS (Dynamic Kernel Module Support) by running the following command in your terminal according to your Linux distribution:

| Linux Distro           | Installation Command                                                                      |
|------------------------|-------------------------------------------------------------------------------------------|
| Debian, Ubuntu         | `sudo apt update && sudo apt install -y wget git python3-pip dkms cargo`                        |
| Fedora                 | `sudo dnf check-update && sudo dnf install -y wget git python3-pip dkms cargo`                  |
| Enterprise Linux based | `sudo dnf install -y epel-release && sudo dnf check-update && sudo dnf install -y wget git python3-pip dkms cargo` |

**\*NOTE**: Installation on non-Ubuntu distributions should be considered experimental at this time.\*

### Step 2: Install the Kernel-Mode Driver (TT-KMD)

Install the driver (**[TT-KMD](https://github.com/tenstorrent/tt-kmd)**) by running these commands in the terminal:

```{code-block} bash
:substitutions:
git clone https://github.com/tenstorrent/tt-kmd.git
cd tt-kmd
sudo dkms add .
sudo dkms install tenstorrent/{{ver_kmd}}
sudo modprobe tenstorrent
```

### Step 3: Device Firmware Update (TT-Flash / TT-Firmware)

The [**TT-Firmware**](https://github.com/tenstorrent/tt-firmware) file needs to be installed using the [TT-Flash](https://github.com/tenstorrent/tt-flash) utility.

#### Install TT-Flash

To install **[TT-Flash](https://github.com/tenstorrent/tt-flash)**, run this command in the terminal:

```{code-block} bash
pip install git+https://github.com/tenstorrent/tt-flash.git
```

**\*NOTE:** If you are not using a Python virtual environment (venv), you may see an error `externally-managed-environment` when installing via `pip`. To resolve this, [create and/or activate a venv](https://docs.python.org/3/tutorial/venv.html) or use a tool like pipx.\*

#### Update Device Firmware

To update Tenstorrent device firmware using TT-Flash, run these commands in the terminal:

```{code-block} bash
:substitutions:
wget https://github.com/tenstorrent/tt-firmware/raw/main/fw_pack-{{ver_fw}}.fwbundle
tt-flash --fw-tar fw_pack-{{ver_fw}}.fwbundle
```

If this process worked, reboot the system and go to the next section.

If running that command results in an error that says the firmware is too old, enter the following command:

```{code-block} bash
:substitutions:
tt-flash --fw-tar fw_pack-{{ver_fw}}.fwbundle --force
```

Then reboot the system.

### Step 4: Set Up HugePages

HugePages lets your system allocate dedicated memory to accelerate communication with Tenstorrent devices. Set up HugePages by running these commands in the terminal:

```{code-block} bash
:substitutions:
# Install `.deb`
wget https://github.com/tenstorrent/tt-system-tools/releases/download/upstream%2F1.1/tenstorrent-tools_{{ver_sys_tools}}.deb
sudo dpkg -i tenstorrent-tools_{{ver_sys_tools}}.deb

# Start Services
sudo systemctl enable --now tenstorrent-hugepages.service
sudo systemctl enable --now 'dev-hugepages\x2d1G.mount'

# System Reboot
sudo reboot
```

**\*NOTE:** This is a temporary solution for configuring hugepages. If the above fails, please check the latest available release from [TT-System-Tools](https://github.com/tenstorrent/tt-system-tools.git).\*

### Step 5: (Optional) Multi-Card Configuration (TT-Topology)
**NOTE:** TT-LoudBox and TT-QuietBox ship with their topology already configured. Use this application *only if you have modified or are trying to modify the topology of your Wormhole-based TT-LoudBox or TT-QuietBox*. If you are not doing so, *skip this step*. TT-Topology is provided as-is.

If you are running on a multi-card Wormhole system such as TT-LoudBox or TT-QuietBox, install the Tenstorrent Topology utility (**[TT-Topology**](https://github.com/tenstorrent/tt-topology)) and configure a mesh topology by running these commands in the terminal:

```
pip install git+https://github.com/tenstorrent/tt-topology
tt-topology -l mesh
```

### Step 6: Install the System Management Interface (TT-SMI)
Install the Tenstorrent Software Management Interface (**[TT-SMI](https://github.com/tenstorrent/tt-smi)**) by entering this command in the terminal:

```
pip install git+https://github.com/tenstorrent/tt-smi
```

### Step 7: Verify System Configuration and Test TT-SMI

Once your hardware and system software are installed, verify that your system has been configured properly by running the `tt-smi` utility.

You should see an interface like this one:

![tt-smi](/images/tt_smi.png)

Within TT-SMI, you can see device information, telemetry, and firmware. If TT-SMI runs without errors, congratulations! You're ready to use your Tenstorrent device. Take note of any host compatibility warnings.

## Installation

Tenstorrent provides three open-source SDKs for developing on Tensix Processors:

- [TT-Buda](https://github.com/tenstorrent/tt-buda) to run existing models
- [TT-Metalium/TT-NN](https://github.com/tenstorrent/tt-metal) to build your own kernels and models
- [TT-Forge/TT-MLIR](https://github.com/tenstorrent/tt-forge-fe) to create, compile, and optimize graph operations

Each SDK will have its own system dependency requirements and installation process.

To help you get started, check out these _First 5 Things_ guides - which include installation steps - for TT-Buda and TT-Metalium.

- [First 5 Things](https://github.com/tenstorrent/tt-buda-demos/tree/main/first_5_steps) for **TT-Buda**
- [First 5 Things](https://docs.tenstorrent.com/ttnn/latest/ttnn/get_started.html) for **TT-Metalium/TT-NN**

## Support & FAQ

For support, forums, and community, visit Tenstorrent's [Discord channel](https://discord.gg/tvhGzHQwaj).

For additional support, file any issues through our [Customer Success Platform](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) or you can contact us directly at [support@tenstorrent.com](mailto:support@tenstorrent.com).
