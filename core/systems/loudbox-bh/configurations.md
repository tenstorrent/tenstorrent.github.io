---
myst:
  html_meta:
    product-name: TT-LoudBox Blackhole
    technology-concepts: Configuration, hardware
    document-type: Reference
---

# Topology Configurations for Multiple Servers

*<span style="color: purple;">Note: This product is pre-launch and specifications are subject to change. This install guide would love your feedback! Please add it to the attached spreadsheet that came with this website package.</span>*

This page details multi-server mesh topology configuration options for the TT-LoudBox (Blackhole). Please note that multi-server scale out is in development. As Tenstorrent validates additional topologies, we will update this page.

For full site requirements and setup instructions, refer to the [Setup Guide](./setup.md).

### Clarifications on Notation
For Blackhole P150 systems our convention is to enumerate our ports per card as shown below; top (furthest from motherboard) as “Port 1” and bottom (closest to motherboard) as “Port 4”. 

:::{figure} bh-lb-qsfp-key.png
:width: 60%
:::

When arranged in the rackmounted box, the left-most card is referred to as “Board/Tray/Card” 1, then heading right, each card is numbered consecutively until card 8.

## Two Servers (4x4 Mesh)

Cabling Guide — Table of Connections  
*Includes same single host connections as above with additions to connect them.*

| Source Hostname | Source Tray | Source Port | Destination Hostname | Destination Tray | Destination Port | Cable Type |
| --- | --- | --- | --- | --- | --- | --- |
| host_0 | 5 | 2 | host_1 | 1 | 1 | |
| host_0 | 6 | 2 | host_1 | 2 | 1 | |
| host_0 | 7 | 2 | host_1 | 3 | 1 | |
| host_0 | 8 | 2 | host_1 | 4 | 1 | |

:::{figure} bh-lb-4x4_Mesh.jpg
:width: 60%
:::

## Four Servers (8x4 Mesh)

*Includes 2 2x host connections as above with additions to connect between them.*

| Source Hostname | Source Tray | Source Port | Destination Hostname | Destination Tray | Destination Port | Cable Type |
| --- | --- | --- | --- | --- | --- | --- |
| host_0 | 4 | 3 | host_2 | 1 | 4 | |
| host_0 | 8 | 3 | host_2 | 5 | 4 | |
| host_1 | 4 | 3 | host_3 | 1 | 4 | |
| host_1 | 8 | 3 | host_3 | 5 | 4 | |

:::{figure} bh-lb-8x4_Mesh.jpg
:width: 40%
:::

## Validate Multi-Server Configuration

Once you have finished connecting the cables across your Servers, validate your connections using the [TT-Metal Multi-Node-Cluster Validation Tool](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/validation/README.md).

For additional advice or questions on custom configurations, please contact your Tenstorrent rep, or reach out to us at [support@tenstorrent.com](mailto:support@tenstorrent.com). We would be happy to help.