---
myst:
  html_meta:
    product-name: TT-QuietBox, Wormhole
    technology-concepts: specifications, requirements, hardware
    document-type: Reference
---

# Specifications and Requirements

This document provides system administrators and engineers with detailed technical specifications for the TT-QuietBox™ Wormhole™ (TW-04001) workstation. It lists package contents, hardware components, physical dimensions, and operating requirements.

## **Package Contents**

The Tenstorrent TT-QuietBox Wormhole (TW-04001) system package includes the following items:

* Tenstorrent TT-QuietBox Wormhole System  
* C13 Power Cable, 1.8m/6ft.  
* 2x QSFP-DD 400GbE Cable, 0.6m/2ft.  
* VGA-to-HDMI Adapter

:::{warning}
The TT-QuietBox is shipped in a wooden crate with a total weight of approximately 134 lbs (61 kg). The system itself weighs approximately 80 lbs (36 kg). At least two people are required to move and uncrate the system safely.
:::

For assembly instructions, refer to the [Unboxing and Setting Up the TT-QuietBox Workstation Guide](./setup.md). If you encounter issues, refer to the [Troubleshooting Common Hardware Issues page](../common/support.md).

## **System Specifications**

| Specification | Details |
| ----- | ----- |
| CPU | [AMD EPYC™ 8124P](https://www.amd.com/en/products/cpu/amd-epyc-8124p) (16 Cores / 32 Threads, up to 3.0 GHz) |
| Motherboard | ASRock Rack [SIENAD8-2L2T](https://www.asrockrack.com/general/productdetail.asp?Model=SIENAD8-2L2T#Specifications)* |
| Memory | 512 GB (8x64 GB) DDR5-4800 ECC RDIMM (0 Slots Free) |
| Storage | 4 TB NVMe PCIe 4.0 x4 |
| Tenstorrent Processors | 4x Tenstorrent Wormhole™ n300 Tensix Processor |
| Included Cables | 4x [Warp 100 Bridge](../../../aibs/warp100.md)<br />2x QSFP-DD 400GbE Cable |
| Host Connectivity | 2x RJ45 10GBase-T via Intel® X710<br />2x RJ45 1GBase-T via Intel® I210<br />4x USB 3.1 Gen 1 (5 Gbps) Type-A (2x Front, 2x Rear)<br />1x VGA<br />1x IPMI | 2x RJ45 10GBase-T via Intel® X710<br />2x RJ45 1GBase-T via Intel® I210<br />4x USB 3.1 Gen 1 (5 Gbps) Type-A (2x Front, 2x Rear)<br />1x VGA<br />1x IPMI |
| Tensix Processor Connectivity | 8x QSFP-DD Active 200G (2 per card) |
| Power Supply | 1650W 80 PLUS Platinum |
| Operating System | None |
| System Dimensions | 10" x 21.5" x 20" (W x D x H) / 254mm x 546mm x 508mm |
| System Weight | 79.7 lbs / 36.2 kg |
| Shipped Dimensions | 18" x 33" x 27" (W x D x H) / 453mm x 839mm x 686mm |
| Shipped Weight | 132.7 lbs / 60.2 kg |

**Early prototypes of this system employed the TYAN Tomcat HX S8040 motherboard ([S8040GM4NE-2T](https://www.tyan.com/Motherboards_S8040_S8040GM4NE-2T)).*

## **Environment**
The TT-QuietBox system ships without an operating system installed. We recommend installing Ubuntu 22.04 (Jammy Jellyfish) to properly install the Tenstorrent Software Stack.

The TT-QuietBox Liquid-Cooled Desktop Workstation is designed to operate at up to 35°C/95°F external ambient temperatures.

## **Safety Warnings**

### **Electrical Safety**

:::{danger}
Failure to follow these electrical safety instructions may result in electric shock, fire, or damage to the equipment.
:::

* Connect the system to a dedicated AC power circuit with sufficient capacity to support the full power draw of the TT-QuietBox Blackhole™ workstation, including peak loads under heavy AI model execution.  
* Do not share the outlet with other high-power devices. Avoid using household surge strips, extension cords, or multi-outlet power taps; not all are rated for the sustained current of this system.  
* Use only the provided C13 power cable, and ensure it is plugged into a properly grounded outlet. Do not bypass or disable the grounding pin.  
* Verify that the circuit wiring and breaker rating meet or exceed the combined system requirements, including liquid-cooling support and all accelerator cards.  
* If the circuit becomes overloaded or if the breaker trips during power-up or operation, immediately disconnect and remove power. Then, have a qualified electrician inspect and verify the circuit’s capacity before resuming setup.  
* Never attempt to reset or bypass a tripped breaker without first confirming the circuit integrity; failure to do so may result in overheating, voltage drop, or irreversible damage.

### **Electrostatic Discharge Safety**

:::{admonition} Important
:class: warning
Before opening the TT-QuietBox Blackhole™ workstation or handling any internal components, you must discharge static electricity from your body to avoid damaging sensitive hardware. Electrostatic discharge can permanently damage Tensix cores, memory modules, or other components. Handle with care and always follow ESD-safe practices.
* Touch a grounded metal surface, such as a grounded rack, chassis, or power supply casing, before and during internal handling.  
* Ideally, wear an ESD wrist strap connected to a verified ground point.  
* Avoid working on carpeted floors or in low-humidity environments where static buildup is more likely.  
* Do not touch any processor, memory module, connector, or printed circuit board (PCB) circuitry unless absolutely necessary, and only after properly discharging.
:::
