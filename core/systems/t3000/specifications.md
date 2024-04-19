# Specifications and Requirements

## Package Contents

The Tenstorrent T3000 system package includes:

- Tenstorrent T3000 System
- C13 Power Cable, 1.8m/6ft.
- 4U Rack-Mounting Kit
- 2x QSFP-DD 400GbE Cable, 0.6m/2ft. (TW-02002 only)



## System Specifications

| Specification        | T3000 (TW-02001)                                             | T3000 (TW-02002)                                             |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **CPU**              | 2x Intel® Xeon® Silver 4309Y<br />(8C/16T ea., up to 2.8GHz, 105W, [Ark](https://ark.intel.com/content/www/us/en/ark/products/215275/intel-xeon-silver-4309y-processor-12m-cache-2-80-ghz.html)) | 2x Intel® Xeon® Silver 4309Y<br />(8C/16T ea., up to 2.8GHz, 105W, [Ark](https://ark.intel.com/content/www/us/en/ark/products/215275/intel-xeon-silver-4309y-processor-12m-cache-2-80-ghz.html)) |
| **Memory**           | 256GB (8x32GB)<br />DDR4-3200 ECC RDIMM<br />(12 Slots Free) | 256GB (8x32GB)<br />DDR4-3200 ECC RDIMM<br />(12 Slots Free) |
| **Storage**          | 3.8TB U.2 NVMe PCIe 4.0 x4                                   | 3.8TB U.2 NVMe PCIe 4.0 x4                                   |
| **Accelerators**     | 4x Tenstorrent n150 AI Graph Processor                       | 4x Tenstorrent n300 AI Graph Processor<br />4x Warp 100 Interconnects |
| **Cables**           | -                                                            | 2x QSFP-DD 400GbE Cable, 0.6m/2ft.                           |
| **Connectivity**     | 2x RJ45 10GBase-T via Intel® X550-AT<br />25x USB 3.1 Gen 1 (5GBps) Type-A (2x Front, 3x Rear)<br />1x USB 3.1 Gen 1 (5GBps) Type-C<br />1x COM<br />1x VGA<br />1x IPMI | 2x RJ45 10GBase-T via Intel® X550-AT<br />25x USB 3.1 Gen 1 (5GBps) Type-A (2x Front, 3x Rear)<br />1x USB 3.1 Gen 1 (5GBps) Type-C<br />1x COM<br />1x VGA<br />1x IPMI |
| **Power Supply**     | 1+1 Titanium Level PSUs<br />1200W: 100-127Vac<br />1800W-2090W: 200-240Vac<br />2200W: 220-240Vac | 1+1 Titanium Level PSUs<br />1200W: 100-127Vac<br />1800W-2090W: 200-240Vac<br />2200W: 220-240Vac* |
| **Base System**      | [SuperMicro SuperServer SYS-740GP-TNRT](https://www.supermicro.com/en/products/system/gpu/4u/sys-740gp-tnrt) | [SuperMicro SuperServer SYS-740GP-TNRT](https://www.supermicro.com/en/products/system/gpu/4u/sys-740gp-tnrt) |
| **Operating System** | None                                                         | None                                                         |

**200V input or higher input voltage required for TW-02002.*



## Operating System Requirements

The Tenstorrent T3000 system ships without an operating system installed. We recommend installing Ubuntu 20.04 (Focal Fossa) to properly use the Tenstorrent accelerators.



## 4U Rack-Mounting Instructions

The Tenstorrent T3000 ships assembled for desktop use. Instructions to rack-mount the T3000 using the included 4U rack-mounting kit are available in Chapter 2 of the Manual for the [SuperMicro SuperServer SYS-740GP-TNRT](https://www.supermicro.com/en/products/system/gpu/4u/sys-740gp-tnrt).