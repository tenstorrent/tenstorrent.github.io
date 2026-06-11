# Specifications and Requirements

## Package Contents

The Tenstorrent T1000 Desktop Workstation system package includes:

- Tenstorrent T1000 Desktop Workstation system
- C13 Power Cable, 1.8m/6ft.

## System Specifications

| Specification                     | T1000 (TW-01001)                                             |
| --------------------------------- | ------------------------------------------------------------ |
| **CPU**                           | Intel® Xeon® Silver 4316<br />(20C/40T, up to 3.4 GHz, 150W, [Ark](https://ark.intel.com/content/www/us/en/ark/products/215270/intel-xeon-silver-4316-processor-30m-cache-2-30-ghz.html)) |
| **Memory**                        | 32 GB (4x8 GB) DDR4-3200 ECC RDIMM (0 Slots Free)            |
| **Storage**                       | 960 GB M.2 22110 NVMe PCIe 4.0 x4                            |
| **Tensix Processor**              | Tenstorrent Wormhole™ n150s Tensix Processor                 |
| **Host System Connectivity**      | 2x RJ45 10GBase-T, 4x USB 2.0, 5x USB 3.2 Gen 1, 1x VGA, 2x COM |
| **Tensix Processor Connectivity** | 2x QSFP-DD Active 200G<br />*Connects to other Wormhole Tensix Processors only.* |
| **Power Supply**                  | 1U 800W Gold Level                                           |
| **Base System**                   | [SuperMicro SuperServer SYS-E403-12P-FN2T](https://www.supermicro.com/en/products/system/IoT/Box_PC/SYS-E403-12P-FN2T) |
| **Operating System**              | None                                                         |

**NOTE:** The MAC address and password for the BMC (baseboard management controller) can be found on labels on both the system chassis and the motherboard. The label will look like this:

![](../bmclabel.png)

## Operating System Requirements

The Tenstorrent T1000 system ships without an operating system installed. We recommend installing Ubuntu 22.04 (Jammy Jellyfish) to properly use the n150s Tensix Processor.

## Environment Specifications

Please visit the Tenstorrent Wormhole n150s and n300s [specification page](../../aibs/wormhole/specifications.md) for environment specifications for those cards.

Please visit the [SuperMicro SuperServer SYS-E403-12P-FN2T](https://www.supermicro.com/en/products/system/IoT/Box_PC/SYS-E403-12P-FN2T) page for environment specifications for this system.

## Software Setup

Instructions on how to set up software on T1000 are available [here](https://docs.tenstorrent.com/getting-started/README.html).