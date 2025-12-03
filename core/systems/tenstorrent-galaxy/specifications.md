---
myst:
  html_meta:
    product-name: TG-00002, Wormhole™ Networked AI Processor, Tensix core
    technology-concepts: AI Acceleration, HPC, Server Architecture, Networking
    document-type: Reference
---

# Technical Specifications

This reference provides system administrators and hardware planners with the detailed technical specifications for the TG-00002 system, including physical dimensions, component configuration, and connectivity options.

## System Specifications

The following table details the core specifications and physical characteristics of the TG-00002 system.

| Specification | Description |
| :--- | :--- |
| **Model Number** | TG-00002 |
| **Form Factor** | 6RU Rackmount (Air-cooled) |
| **Chassis Dimensions (W x H x D)** | 447 mm x 266.7 mm x 884.5 mm (17.60" x 10.75" x 34.8") |
| **Mainboard Form Factor (W x L)** | 147 mm x 485 mm |
| **Tray Form Factor (W x L)** | 431 mm x 600 mm (4 Trays total) |

## Processing and Memory

| Specification | Description |
| :--- | :--- |
| **AI Accelerator** | 32x Wormhole™ Networked AI Processors (8 processors per tray across 4 trays) |
| **AI Power Consumption** | 170W per Wormhole processor |
| **Host Processor** | AMD EPYC 9354P (32 cores) |
| **Host Processor Details** | Socket SP5/LGA 6096; up to 3.8 GHz clock speed; 280W TDP |
| **Host Memory** | 576 GB (6x 96 GB) DDR5-4800 ECC RDIMM (6 slots populated) |
| **Video** | ASPEED AST2600 with integrated 1 GB DDR4 video memory |
| **Maximum Display Resolution** | 1920x1200p @ 60 Hz (32 bpp) |

## Storage

The TG-00002 system supports both internal system storage and expandable, hot-plug storage options.

| Specification | Description |
| :--- | :--- |
| **Internal M.2 Storage** | 2x M.2 2280 NVMe PCIe 3.0/4.0 x4 Drive Slots |
| **M.2 Configuration** | Populated with 2x 960 GB M.2 2280 NVMe drives |
| **Expandable E1.S Bays** | 4x Hot-Plug E1.S 9.5 mm/15 mm PCIe 4.0 x4 SSD Drive Bays |
| **E1.S Configuration** | Populated with 4x 4 TB or 4x 8 TB E1.S drives |
| **BMC Storage** | 1x SD card slot with included 32 GB SD card |

## Connectivity

### Internal Connectivity

| Specification | Description |
| :--- | :--- |
| **Internal PCIe** | 4x trays utilize PCIe 4.0 (one x8 lane, seven x1 lanes per tray) |
| **Internal AI Networking** | 6x 400 Gbps QSFP-DD ports per tray |
| **Internal Sync/Data** | 8x 56G PAM4 links per tray |

### External Networking

| Specification | Description |
| :--- | :--- |
| **Management LAN** | 1x Dedicated 1 GbE BMC management LAN port |
| **High-Speed Networking** | 2x 100/50/40/25/10 GbE QSFP-DD ports via Broadcom N2100G |
| **Additional Network Slot** | 1x OCP 3.0 NIC slot |

## Input/Output (I/O)

### Front I/O

| Specification | Description |
| :--- | :--- |
| **User Interface** | 1x Power button/LED; 1x Reset button; 1x ID button/LED |
| **Status Indicators** | 1x System Status LED; 1x Tray Status LED |
| **USB Ports** | 2x USB 3.0 Type-A ports |
| **Other** | 1x Bezel connector |

### Rear I/O

| Specification | Description |
| :--- | :--- |
| **Video** | 1x DisplayPort 1.1a |
| **USB Ports** | 1x USB 3.0 Type-A port (from CPU) |
| **Management Port** | 1x Dedicated 1 GbE BMC LAN port |
| **Debug Port** | 1x COM port (USB Type-C) |
