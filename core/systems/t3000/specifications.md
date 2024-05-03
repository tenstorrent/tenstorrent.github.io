# Specifications, Requirements, and Setup

## Package Contents

The Tenstorrent LoudBox (T3000) system package includes:

- Tenstorrent LoudBox (T3000) System
- C13 Power Cable, 1.8m/6ft.
- 4U Rack-Mounting Kit
- 2x QSFP-DD 400GbE Cable, 0.6m/2ft. (TW-02002 only)



## System Specifications

| Specification           | T3000 (TW-02001)                                             | T3000 (TW-02002)                                             |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **CPU**                 | 2x Intel® Xeon® Silver 4309Y<br />(8C/16T ea., up to 2.8GHz, 105W, [Ark](https://ark.intel.com/content/www/us/en/ark/products/215275/intel-xeon-silver-4309y-processor-12m-cache-2-80-ghz.html)) | 2x Intel® Xeon® Silver 4309Y<br />(8C/16T ea., up to 2.8GHz, 105W, [Ark](https://ark.intel.com/content/www/us/en/ark/products/215275/intel-xeon-silver-4309y-processor-12m-cache-2-80-ghz.html)) |
| **Memory**              | 256GB (8x32GB)<br />DDR4-3200 ECC RDIMM<br />(12 Slots Free) | 256GB (8x32GB)<br />DDR4-3200 ECC RDIMM<br />(12 Slots Free) |
| **Storage**             | 3.8TB U.2 NVMe PCIe 4.0 x4                                   | 3.8TB U.2 NVMe PCIe 4.0 x4                                   |
| **AI Graph Processors** | 4x Tenstorrent Wormhole™ n150 AI Graph Processor             | 4x Tenstorrent Wormhole™ n300 AI Graph Processor<br />4x Warp 100 Interconnects |
| **Cables**              | -                                                            | 2x QSFP-DD 400GbE Cable, 0.6m/2ft.                           |
| **Connectivity**        | 2x RJ45 10GBase-T via Intel® X550-AT<br />25x USB 3.1 Gen 1 (5GBps) Type-A (2x Front, 3x Rear)<br />1x USB 3.1 Gen 1 (5GBps) Type-C<br />1x COM<br />1x VGA<br />1x IPMI | 2x RJ45 10GBase-T via Intel® X550-AT<br />25x USB 3.1 Gen 1 (5GBps) Type-A (2x Front, 3x Rear)<br />1x USB 3.1 Gen 1 (5GBps) Type-C<br />1x COM<br />1x VGA<br />1x IPMI |
| **Power Supply**        | 1+1 Titanium Level PSUs<br />1200W: 100-127Vac<br />1800W-2090W: 200-240Vac<br />2200W: 220-240Vac | 1+1 Titanium Level PSUs<br />1200W: 100-127Vac<br />1800W-2090W: 200-240Vac<br />2200W: 220-240Vac* |
| **Base System**         | [SuperMicro SuperServer SYS-740GP-TNRT](https://www.supermicro.com/en/products/system/gpu/4u/sys-740gp-tnrt) | [SuperMicro SuperServer SYS-740GP-TNRT](https://www.supermicro.com/en/products/system/gpu/4u/sys-740gp-tnrt) |
| **Operating System**    | None                                                         | None                                                         |

**200V input or higher input voltage required for TW-02002.*



## Operating System Requirements

The Tenstorrent LoudBox (T3000) system ships without an operating system installed. We recommend installing Ubuntu 20.04 (Focal Fossa) to properly use the Tenstorrent graph processors.



## 4U Rack-Mounting Instructions

The Tenstorrent LoudBox (T3000) ships assembled for desktop use. Instructions to rack-mount the system using the included 4U rack-mounting kit are available in Chapter 2 of the Manual for the [SuperMicro SuperServer SYS-740GP-TNRT](https://www.supermicro.com/en/products/system/gpu/4u/sys-740gp-tnrt).



## QSFP-DD Connections and System Topology (TW-02002)

The Tenstorrent LoudBox (T3000) configuration in TW-02002 includes four Wormhole™ n300 AI Graph Processors and internal Warp 100 bridges and external QSFP-DD cables that enable the AI Graph Processor mesh.

<img src="../../aibs/wormhole/images/wh_portspec.png" style="zoom:50%;" />

The LoudBox ships with the Warp 100 bridges connected, but the two QSFP-DD cables will need to be connected. This diagram displays the system topology and how the cards are enumerated, along with where the Warp 100 bridges are connected and where the included QSFP-DD cables need to be connected. 

<img src="loudbox_topology.png" style="zoom:50%;" />

One QSFP-DD cable will need to be connected to **Port 1** on the cards in **Slots 1 and 4**.

One QSFP-DD cable will need to be connected to **Port 2** on the cards in **Slots 3 and 2**.