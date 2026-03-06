---
myst:
  html_meta:
    product-name: TT-LoudBox Blackhole
    technology-concepts: Configuration, hardware
    document-type: Reference
---

# Topology Configurations for Multiple Servers

This page details multi-server mesh topology configuration options for the TT-LoudBox (Blackhole).

For full site requirements and setup instructions, refer to the [Setup Guide](./setup.md).

### Clarifications on Notation
For Blackhole P150 systems our convention is to enumerate our ports per card as shown below; top (furthest from motherboard) as “Port 1” and bottom (closest to motherboard) as “Port 4”. 

:::{figure} bh-lb-qsfp-key.png
:width: 60%
:::

When arranged in the Rack-Mounted box the left-most Card is referred to as “Board/Tray/Card” 1, numbered consecutively till 8 at the right.

## Two Servers (4x4 Mesh)

Cabling Guide — Table of Connections  
*Includes same single host connections as above with additions to connect them.*

| Source Hostname | Source Tray | Source Port | Destination Hostname | Destination Tray | Destination Port | Cable Type |
| --- | --- | --- | --- | --- | --- | --- |
| host_0 | 5 | 2 | host_1 | 1 | 1 | |
| host_0 | 6 | 2 | host_1 | 2 | 1 | |
| host_0 | 7 | 2 | host_1 | 3 | 1 | |
| host_0 | 8 | 2 | host_1 | 4 | 1 | |

:::{figure} bh-lb-4x4-topology.jpg
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

:::{figure} bh-lb-8x4-topology.jpg
:width: 40%
:::

## Software Descriptors

### Deployment Descriptor

The Deployment Descriptor defines deployment-specific characteristics of a multi-host system.
It includes node type and hostname specifications, which enable validation to ensure that the deployed or connected system matches the intended configuration.
In addition, the descriptor provides fields relevant to server and rack deployments, such as data center hall, aisle, rack, and shelf identifiers, supporting organized and traceable system management.

Save the below code-block as template deployment. Make sure to edit as necessary for your hostnames.

```text
# .textproto: Descriptors of deployment characteristics of system
#   host: fields to be updated whenever hostnames in deployment are updated
hosts {
  node_type: "P150_LB"
  host: "host_0"
}
hosts {
  node_type: "P150_LB"
  host: "host_1"
}
hosts {
  node_type: "P150_LB"
  host: "host_2"
}
hosts {
  node_type: "P150_LB"
  host: "host_3"
}
```

For additional advice or questions on custom configurations, please contact your Tenstorrent rep, or reach out to us at [support@tenstorrent.com](mailto:support@tenstorrent.com). We would be happy to help.