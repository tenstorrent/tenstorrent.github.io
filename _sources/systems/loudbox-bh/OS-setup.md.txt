---
myst:
  html_meta:
    product-name: TT-LoudBox Blackhole
    technology-concepts: Software, Setup, Installation
    document-type: Task-Based Guide (How-To)
---

# Installing the Operating System and Firmware

*<span style="color: purple;">Note: This product is pre-launch and specifications are subject to change. This install guide would love your feedback! Please add it to the attached spreadsheet that came with this website package.</span>*

This document provides first-time operating system and firmware setup for the Tenstorrent TT-LoudBox™ (Blackhole™) Air-Cooled 4U Server.

:::{admonition} Important
:class: important
Ensure your TT-LoudBox (Blackhole) is successfully rack-mounted and powered on before beginning. If not, please head to the [Hardware Setup Guide](./setup.md) first.
:::

## Step 1: Installing the Operating System

TT-LoudBox ships without an operating system (OS) installed. We recommend installing Ubuntu 22.04 (Jammy Jellyfish), or your preferred OS. Instructions for installing Ubuntu can be found [here](https://ubuntu.com/tutorials/install-ubuntu-server#1-overview).

If you choose to install Ubuntu 22.04, here is how to get started:

When the Ubuntu login prompt appears, enter the following default credentials:

Username: ttuser  
Password: ttuser

### Optional: Accessing the Base Management Controller (BMC) 

The MAC address and password for the BMC can be found on a small slide-out tray, at the bottom of the system. The label will look like this:

:::{figure} bh-lb-bmc-tab.jpg
:width: 50%
:::

To access the BMC:
1. Ensure the Server is powered on, and the BMC cable is connected to the network port and BMC Ethernet slot.
2. Once the system is fully booted, the BMC’s IP address will appear on the screen.
3. Note the IP address and use that to log in to the BMC at `https://<bmc-ip-address>` (replace the placeholder with the address shown on the system).
4. When prompted, enter the default BMC credentials:
   - Username: ADMIN
   - Password: [printed on the slide-out tab in the image above]

## Step 2: Check for Firmware Update

TT-LoudBox (Blackhole) may need to update firmware before first use. To do this, run `tt-installer`, located at our [tt-installer GitHub repository](https://github.com/tenstorrent/tt-installer/).

If a specific firmware version is needed, use the `tt-flash` utility with your specific firmware version path. This is documented on our [tt-flash GitHub repository](https://github.com/tenstorrent/tt-flash).

## Step 3: Verifying System Recognition of Blackhole p150b Accelerators

In a terminal, execute these commands to download the latest list of PCI device IDs and list the recognized devices:

```
sudo update-pciids
lspci -d 1e52:
```

You should see output that lists eight recognized accelerators:

```
01:00.0 Processing accelerators: Tenstorrent Inc Blackhole
25:00.0 Processing accelerators: Tenstorrent Inc Blackhole
41:00.0 Processing accelerators: Tenstorrent Inc Blackhole
61:00.0 Processing accelerators: Tenstorrent Inc Blackhole
81:00.0 Processing accelerators: Tenstorrent Inc Blackhole
a1:00.0 Processing accelerators: Tenstorrent Inc Blackhole
c1:00.0 Processing accelerators: Tenstorrent Inc Blackhole
e1:00.0 Processing accelerators: Tenstorrent Inc Blackhole
```

:::{admonition} Important
:class: important
If you don’t see all eight accelerators listed, please raise a support request. Our team will provide assistance.
:::

## Step 4: Installing the Tenstorrent Software Stack

After completing the operating system installation and firmware update, proceed with [Installing the Tenstorrent Software Stack](https://docs.tenstorrent.com/getting-started/README.html).

## Need Additional Support?

If you encounter any issues, or have a question that isn’t covered in the documentation, please reach out at [support@tenstorrent.com](mailto:support@tenstorrent.com). Our team will review your request and provide assistance.
