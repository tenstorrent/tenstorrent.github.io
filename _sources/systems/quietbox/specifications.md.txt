# Specifications, Requirements, and Setup

## Package Contents

The Tenstorrent TT-QuietBox Liquid-Cooled Desktop Workstation system package includes:

- Tenstorrent TT-QuietBox Liquid-Cooled Desktop Workstation
- C13 Power Cable, 1.8m/6ft.
- 2x QSFP-DD 400GbE Cable, 0.6m/2ft.
- Remote Control for RGB Lighting

## System Specifications

| Specification         | TT-QuietBox (TW-04001)                                       |
| --------------------- | ------------------------------------------------------------ |
| **CPU**               | AMD EPYC™ 8124P<br />(16C/32T, up to 3GHz, 125W, [AMD](https://www.amd.com/en/products/cpu/amd-epyc-8124p)) |
| **Motherboard**       | TYAN Tomcat HX S8040 MB ([S8040GM4NE-2T](https://www.tyan.com/Motherboards_S8040_S8040GM4NE-2T)) |
| **Memory**            | 512GB (8x64GB)<br />DDR5-4800 ECC RDIMM<br />(0 Slots Free)  |
| **Storage**           | 3.8TB U.2 NVMe PCIe 4.0 x4                                   |
| **Tensix Processors** | 4x Tenstorrent Wormhole™ n300 Tensix Processor               |
| **Cables**            | 4x [Warp 100 Bridge](../../aibs/warp100.md)<br />2x QSFP-DD 400GbE |
| **Connectivity**      | 2x RJ45 10GBase-T via Intel® X710<br /><br />2x RJ45 1GBase-T via Intel® I210<br />4x USB 3.1 Gen 1 (5GBps) Type-A (2x Front, 2x Rear)<br />1x COM<br />1x VGA<br />1x IPMI |
| **Power Supply**      | 1650W 80 PLUS Gold                                           |
| **Operating System**  | None                                                         |

## Operating System Requirements

The TT-QuietBox system ships without an operating system installed. We recommend installing Ubuntu 20.04 (Focal Fossa) to properly use the Tenstorrent n300 Tensix Processors.

## QSFP-DD Connections and System Topology

The Tenstorrent TT-QuietBox includes four Wormhole™ n300 Tensix Processors and internal Warp 100 bridges and external QSFP-DD cables that enable the Tensix Processor mesh.

![](../../aibs/wormhole/images/wh_portspec.png)

The TT-QuietBox ships with the Warp 100 bridges connected, but the two QSFP-DD cables will need to be connected. This diagram displays the system topology and how the cards are enumerated, along with where the Warp 100 bridges are connected and where the included QSFP-DD cables need to be connected. 

![](qb_topology.png)

One QSFP-DD cable will need to be connected to **Port 1** on the cards in **Slots 1 and 4**.

One QSFP-DD cable will need to be connected to **Port 2** on the cards in **Slots 3 and 2**.

## Environment Specifications

The TT-QuietBox Liquid-Cooled Desktop Workstation is designed to operate at up to 35°C/95°F external ambient temperatures.

## Lighting Control

The TT-QuietBox uses a Bitspower RF Remote Controller Hub to control the lighting and the remote is included with the system. For details on how to operate it, please review the Bitspower documentation [here](BPTA-RFCHUB_IG_V3.pdf).

## Software Setup

Instructions on how to set up software on TT-QuietBox are available [here](https://docs.tenstorrent.com/quickstart.html).