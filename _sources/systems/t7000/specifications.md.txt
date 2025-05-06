# Specifications and Requirements

## Package Contents

The Tenstorrent T7000 system package includes:

- Tenstorrent T7000 System
- 8x QSFP-DD 400GbE Cable, 2ft/0.6m
- 4x QSFP-DD 400GbE Cable, 3ft/1m

## System Specifications

| Specification                     | T7000 (TW-03001)                                             |
| --------------------------------- | ------------------------------------------------------------ |
| **CPU**                           | 2x AMD EPYC™ Rome 7352 (24C/48T ea., up to 3.2 Ghz, 155W TDP, [AMD](https://www.amd.com/en/products/cpu/amd-epyc-7352)) |
| **Memory**                        | 1TB (32x32 GB) DDR4-3200 ECC RDIMM (No Slots Free)           |
| **Storage**                       | 2x1 TB U.2 NVMe PCIe 4.0 x4                                  |
| **Tensix Processors**             | 8x Tenstorrent Wormhole™ n150s Tensix Processor              |
| **Cables**                        | 8x QSFP-DD 400GbE Cable, 2ft/0.6m<br />4x QSFP-DD 400GbE Cable, 3ft/1m |
| **Host System Connectivity**      | 2x RJ45 1000Base-T via CPU<br />2x 100GbE QSFP56 via NVIDIA ConnectX-6 VPI<br />2x USB 3.0 (5 Gbps) Type-A<br />1x VGA |
| **Tensix Processor Connectivity** | 16x QSFP-DD Active 200G (8 per card)<br />*Connects to other Wormhole Tensix Processors only.* |
| **Power Supply**                  | 2+2 Titanium Level PSUs<br />1000W: 100-127Vac<br />1800W: 200-240Vac<br />2000W: 220-240Vac* |
| **Base System**                   | [SuperMicro A+ Server 4124GS-TNR+](https://www.supermicro.com/en/products/system/gpu/4u/as-4124gs-tnr+) |
| **Operating System**              | None                                                         |

**200V or higher input voltage required.*

## Operating System Requirements

The Tenstorrent T7000 system ships without an operating system installed. We recommend installing Ubuntu 22.04 (Jammy Jellyfish) to properly use the Tenstorrent Tensix Processors.

## Environment Specifications

Please visit the Tenstorrent Wormhole n150s and n300s [specification page](../../aibs/wormhole/specifications.md) for environment specifications for those cards.

Please visit the [SuperMicro A+ Server 4124GS-TNR](https://www.supermicro.com/en/Aplus/system/4U/4124/AS-4124GS-TNR.cfm) page for environment specifications for this system.

## Software Setup

Instructions on how to set up software on T7000 are available [here](https://docs.tenstorrent.com/getting-started/README.html).