# Specifications, Requirements, and Setup

## Package Contents

The Tenstorrent TT-QuietBox Liquid-Cooled Desktop Workstation system package includes:

- Tenstorrent TT-QuietBox Liquid-Cooled Desktop Workstation
- C13 Power Cable, 1.8m/6ft.
- 2x QSFP-DD 400GbE Cable, 0.6m/2ft.
- Remote Control for RGB Lighting

**WARNING:** TT-QuietBox is shipped in a wooden crate weighing a total of 131 lbs. / 59.4 kg. The system itself weighs 96 lbs. / 43.5 kg. We strongly recommend at least two people for moving and uncrating the system.

## System Specifications

| Specification                         | TT-QuietBox (TW-04001)                                       |
| ------------------------------------- | ------------------------------------------------------------ |
| **CPU**                               | AMD EPYC™ 8124P<br />(16C/32T, up to 3GHz, 125W, [AMD](https://www.amd.com/en/products/cpu/amd-epyc-8124p)) |
| **Motherboard**                       | ASRock Rack [SIENAD8-2L2T](https://www.asrockrack.com/general/productdetail.asp?Model=SIENAD8-2L2T#Specifications)* |
| **Memory**                            | 512GB (8x64GB)<br />DDR5-4800 ECC RDIMM<br />(0 Slots Free)  |
| **Storage**                           | 3.8TB U.2 NVMe PCIe 4.0 x4                                   |
| **Tensix Processors**                 | 4x Tenstorrent Wormhole™ n300 Tensix Processor               |
| **Cables**                            | 4x [Warp 100 Bridge](../../aibs/warp100.md)<br />2x QSFP-DD 400GbE |
| **Connectivity**                      | 2x RJ45 10GBase-T via Intel® X710<br /><br />2x RJ45 1GBase-T via Intel® I210<br />4x USB 3.1 Gen 1 (5GBps) Type-A (2x Front, 2x Rear)<br />1x VGA<br />1x IPMI |
| **Power Supply**                      | 1650W 80 PLUS Gold                                           |
| **Operating System**                  | None                                                         |
| **Dimensions (System)<br />(WxDxH)**  | 10" x 21.5" x 20" (96 lbs.)<br />254mm x 546mm x 508mm (43.5 kg) |
| **Dimensions (Shipped)<br />(WxDxH)** | 18" x 33" x 27" (131 lbs.)<br />453mm x 839mm x 686mm (59.4 kg) |

**Early prototypes employed the TYAN Tomcat HX S8040 MB ([S8040GM4NE-2T](https://www.tyan.com/Motherboards_S8040_S8040GM4NE-2T)).*

## Operating System Requirements

The TT-QuietBox system ships without an operating system installed. We recommend installing Ubuntu 20.04 (Focal Fossa) to properly use the Tenstorrent n300 Tensix Processors.

## QSFP-DD Connections and System Topology

The Tenstorrent TT-QuietBox includes four Wormhole™ n300 Tensix Processors and internal Warp 100 bridges and external QSFP-DD cables that enable the Tensix Processor mesh.

![](../../aibs/wormhole/images/wh_portspec.png)

The TT-QuietBox ships with the Warp 100 bridges connected, but the two QSFP-DD cables will need to be connected by the user. This diagram displays the system topology and how the cards are enumerated, along with where the Warp 100 bridges are connected and where the included QSFP-DD cables need to be connected. 

![](qb_topology.png)

One QSFP-DD cable will need to be connected to **Port 1** on the cards in **Slots 1 and 4**.

One QSFP-DD cable will need to be connected to **Port 2** on the cards in **Slots 3 and 2**.

## Environment Specifications

The TT-QuietBox Liquid-Cooled Desktop Workstation is designed to operate at up to 35°C/95°F external ambient temperatures.

## Lighting Control

The TT-QuietBox uses a Bitspower RF Remote Controller Hub to control the lighting and the remote is included with the system. For details on how to operate it, please review the Bitspower documentation [here](BPTA-RFCHUB_IG_V3.pdf).

## TT-QuietBox BIOS Requirement

The BIOS for the host motherboard is configured at the factory with the setting for **PCIe AER Reporting Mechanism** set to **OS First**. Tenstorrent's TT-SMI software will fail if this setting is not configured properly. *You should not have to change this setting when first setting up your TT-QuietBox.*

If for whatever reason the BIOS needs to be updated or is reset, this setting must be configured again to ensure TT-SMI is able to function. It is located in the BIOS here:

`Chipset -> AMD CBS -> NBIO Common Options -> NBIO RAS Common Options -> PCIe AER Reporting Mechanism`

## Software Setup

Instructions on how to set up software on TT-QuietBox are available [here](https://docs.tenstorrent.com/getting-started/README.html).