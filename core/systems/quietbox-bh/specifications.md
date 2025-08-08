# Specifications and Requirements

## Package Contents

The Tenstorrent TT-QuietBox™ Liquid-Cooled Desktop Workstation system package includes:

| TT-QuietBox™ Wormhole (TW-04001)                             | TT-QuietBox™ Blackhole (TW-04002)                            |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Tenstorrent TT-QuietBox Wormhole System<br />C13 Power Cable, 1.8m/6ft.<br />2x QSFP-DD 400GbE Cable, 0.6m/2ft.<br />VGA-to-HDMI Adapter | Tenstorrent TT-QuietBox Blackhole System<br />C13 Power Cable, 1.8m/6ft.<br />8x QSFP-DD 800GbE Cable, 0.6m/2ft.<br />VGA-to-HDMI Adapter |

**WARNING:** TT-QuietBox is shipped in a wooden crate weighing a total of approximately 134 lbs. / 61 kg. The system itself weighs approximately 80 lbs. / 36 kg. We strongly recommend at least two people for moving and uncrating the system. **Instructions to unbox and set up your TT-QuietBox** are available [here](./setup.md).

If you have any issues with your TT-QuietBox, please visit the TT-QuietBox [support](./support.md) page.

## System Specifications

| Specification                         | TT-QuietBox Wormhole (TW-04001)                              | TT-QuietBox Blackhole (TW-04002)                             |
| ------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **CPU**                               | AMD EPYC™ 8124P<br />(16C/32T, up to 3 GHz, 125W, [AMD](https://www.amd.com/en/products/cpu/amd-epyc-8124p)) | AMD EPYC™ 8124P<br />(16C/32T, up to 3 GHz, 125W, [AMD](https://www.amd.com/en/products/cpu/amd-epyc-8124p)) |
| **Motherboard**                       | ASRock Rack [SIENAD8-2L2T](https://www.asrockrack.com/general/productdetail.asp?Model=SIENAD8-2L2T#Specifications)* | ASRock Rack [SIENAD8-2L2T](https://www.asrockrack.com/general/productdetail.asp?Model=SIENAD8-2L2T#Specifications)* |
| **Memory**                            | 512 GB (8x64 GB)<br />DDR5-4800 ECC RDIMM<br />(0 Slots Free) | 256 GB (8x32 GB)<br />DDR5-4800 ECC RDIMM<br />(0 Slots Free) |
| **Storage**                           | 4 TB NVMe PCIe 4.0 x4                                        | 4 TB NVMe PCIe 4.0 x4                                        |
| **Tensix Processors**                 | 4x Tenstorrent Wormhole™ n300 Tensix Processor               | 4x Tenstorrent Blackhole™ p150c Tensix Processor             |
| **Cables**                            | 4x [Warp 100 Bridge](../../aibs/warp100.md)<br />2x QSFP-DD 400GbE Cable | 8x QSFP-DD 800GbE Cable                                      |
| **Host System<br />Connectivity**     | 2x RJ45 10GBase-T via Intel® X710<br />2x RJ45 1GBase-T via Intel® I210<br />4x USB 3.1 Gen 1 (5 Gbps) Type-A (2x Front, 2x Rear)<br />1x VGA<br />1x IPMI | 2x RJ45 10GBase-T via Intel® X710<br />2x RJ45 1GBase-T via Intel® I210<br />4x USB 3.1 Gen 1 (5 Gbps) Type-A (2x Front, 2x Rear)<br />1x VGA<br />1x IPMI |
| **Tensix Processor Connectivity**     | 8x QSFP-DD Active 200G (2 per card)                          | 16x QSFP-DD Passive 800G (4 per card)                        |
| **Power Supply**                      | 1650W 80 PLUS Gold                                           | 1650W 80 PLUS Platinum                                       |
| **Operating System**                  | None                                                         | None                                                         |
| **Dimensions (System)<br />(WxDxH)**  | 10" x 21.5" x 20" (79.7 lbs.)<br />254mm x 546mm x 508mm (36.2 kg) | 10" x 21.5" x 20" (79.2 lbs.)<br />254mm x 546mm x 508mm (35.9 kg) |
| **Dimensions (Shipped)<br />(WxDxH)** | 18" x 33" x 27" (132.7 lbs.)<br />453mm x 839mm x 686mm (60.2 kg) | 18" x 33" x 27" (133.7 lbs.)<br />453mm x 839mm x 686mm (60.6 kg) |

**Early prototypes employed the TYAN Tomcat HX S8040 MB ([S8040GM4NE-2T](https://www.tyan.com/Motherboards_S8040_S8040GM4NE-2T)).*

## Operating System Requirements

The TT-QuietBox system ships without an operating system installed. We recommend installing Ubuntu 22.04 (Jammy Jellyfish) to properly use the Tenstorrent Tensix Processors.

## Environment Specifications

The TT-QuietBox Liquid-Cooled Desktop Workstation is designed to operate at up to 35°C/95°F external ambient temperatures.
