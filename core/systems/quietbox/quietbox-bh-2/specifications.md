---
myst:
  html_meta:
    product-name: TT-QuietBox, Blackhole
    technology-concepts: specifications, requirements, hardware
    document-type: Reference
---

```{figure} ./qb2-specs-hero.jpg
:width: 65%
```

# Specifications

This document provides detailed technical specifications for the TT-QuietBox<sup>®</sup> 2 (Blackhole<sup>®</sup>) workstation. It lists package contents, hardware components, physical dimensions, and operating requirements.

## **Package Contents**

The Tenstorrent TT-QuietBox 2 (Blackhole) system package includes the following items:

* 1x TT-QuietBox 2 (Blackhole) workstation
* 1x Power Supply Cord (C19 to country-specific wall outlet)
* 1x eMeet Luna Plus speakerphone

## **TT-QuietBox 2 System Specifications**

| Specification | Details |
| ----- | ----- |
| Model | TW-04003 |
| Operating System | Ubuntu 24.04 |
| CPU | Ryzen 7 9700X 65W Granite Ridge 3.8GHz |
| Motherboard | ASRock B850M-C, mATX |
| Memory | 256 GB (4x64 GB) DDR5-5600 UDIMM, CL46 (4 slots, 0 free) |
| Storage | 4TB - WD Blue SN5000 NVMe™ SSD<br />Hyper M.2 (PCIe Gen4x4)<br />WDS400T4B0E-00BKY0 |
| Tenstorrent Processors | 2x Blackhole p300c cards (4 Blackhole chips) |
| Rear I/O Panel | 1x HDMI Port<br />1x USB 3.2 Gen 2 Type-A Port<br />1x USB 3.2 Gen 2 Type-C Port (non-video)<br />2x USB 3.2 Gen 1 Ports<br />4x USB 2.0 Ports<br />1 x BIOS Flashback Button<br />HD Audio Jacks: Line in / Front Speaker / Microphone |
| Network Controller | Gigabit LAN 10/100/1000 Mb/s Base T<br />Realtek 8111H |
| Wireless LAN | 802.11ax WiFi 6 Module<br />Supports IEEE 802.11a/b/g/n/ax<br />Supports Dual-Band (2.4/5 GHz)<br />Supports Bluetooth 5.3 |
| Power Supply | 1600W Cooler Master V Platinum 1600 V2 |
| Idle Power | 750W |
| Sound Pressure | 38 dBA (under max operating load) |
| System Dimensions | Height: 15.6” (39.5 cm) Width: 9.1” (23.1 cm) Depth: 17.8” (45.2 cm) (including handles and feet) |
| System Weight | 20 kg (44 lbs) +/- 1.5 lbs   |
| Shipping Box Dimensions | Height: 20.7” (52.5 cm) Width: 14.4” (36.7 cm) Depth: 25.0” (63.5 cm) |
| Shipping Box Weight | 23.2 kg (52 lbs)  |

## **Blackhole p300 Card Specifications**

The TT-QuietBox 2 is powered by two p300c cards, for a total of four Blackhole chips. The table below describes the combined specifications of the two cards for your reference. Please note the p300c card is not sold separately outside of the TT-QuietBox 2. If you are interested in a Blackhole card to add to your existing system, check out our [available cards](https://www.tenstorrent.com/cards).

| Specification             | Two p300c Cards (inside TT-QuietBox 2)                             |
| ------------------------- | -------------------------------------------------- |
| Part Number               | 2x TC-03007                                        |
| Tensix Cores              | 240 + 240                                              |
| AI Clock                  | 1.35 GHz                                           |
| SRAM                      | 360 + 360 MB (1.5 MB per Tensix core)                   |
| Memory                    | 128GB GDDR6                                      |
| Memory Speed              | 16 GT/sec                                          |
| Memory Bandwidth          |  1024 GB/sec chip to chip                                    |
| TBP (Total Board Power)   | 600W + 600W                                                 |
| Cooling                   | Liquid                                             |
| Dimensions (WxDxH)        | 21.66mm x 307mm x 112.65mm (each card)   |

## **Internal Topology**

The workstation's two p300c cards are connected internally with a Samtec ARP6 series High Performance cable. The below topology is pre-installed inside the QuietBox 2 by Tenstorrent and is outlined here for your reference.

```{figure} ./qb2-topology.jpg
:width: 65%
```

## **Supported Models**
For the most up-to-date list of models supported by TT-QuietBox 2, check the [Developer Hub](https://tenstorrent.com/developers).

## **Power and Operating Conditions**

| Topic | Specification |
| --- | --- |
| Peak Power Consumption | 1500W |
| Operating Temperature | 50°F to 95°F (10°C to 35°C) |
| Operating Relative Humidity | 10% to 90% (non-condensing) |
| Non-Operating Temperature | -4°F to 140°F (-20°C to 60°C) |
| Non-Operating Relative Humidity |  5% to 95% (non-condensing) |

The TT-QuietBox 2 draws up to 1,300W at peak load. To prevent overloading the power circuit or tripping your electrical panel, avoid sharing the circuit with other high-power devices, or connect it to a dedicated circuit.
This is especially relevant to users in 120V countries, such as the USA, Canada, and Japan.


## **System Overview**

```{figure} ./qb2-system-iso-view.jpg
:width: 65%
```

| No | Item | Description |
| --- | --- | --- |
| 1 | Handle | Used to aid in lifting the workstation |
| 2 | Acrylic Panel | Showcases internal Accelerator cards |
| 3 | Thumbscrew | Enables toolless access to the interior* |
| 4 | Power Button | Powers the workstation on/off |
| 5 | Reset Button | Resets the workstation |

*This workstation is designed for adult use only. Ensure the TT-QuietBox 2 is located where children cannot access or tamper with it. Keep the workstation secure when not in use.

## **System Rear View**

```{figure} ./qb2-rear-view.jpg
:width: 65%
```

| Number | Item |
| --- | --- |
| 1 | 1x HDMI Port |
| 2 | 1 x BIOS Flashback Button |
| 3 | 1x USB 3.2 Gen 2 Type-A Port |
| 4 | 4x USB 2.0 Type-A Ports |
| 5 | Power Cable Port |
| 6 | On/Off Power Supply Unit Switch |
| 7 | 1x USB 3.2 Gen 2 Type-C Port (non-video) |
| 8 | 2x USB 3.2 Gen 1 Type-A Ports |
| 9 | 1x RJ45 Gigabit LAN Port (10/100/1000 Mbps, Realtek 8111H) |
| 10 | 2x WiFi Antenna |
| 11 | HD Audio Jacks: Line in / Front Speaker / Microphone  |

(safety-warnings)=
## **Important Safety Warnings**

:::{admonition} Caution: Hot Surface
:class: caution
The interior of the workstation can become extremely hot when running. Do not touch any interior components of the workstation without turning the power off, letting the PSU fully drain, and allowing interior components to cool.
:::

### **Electrical Safety** 

:::{danger}
Failure to follow these electrical safety instructions may result in electric shock, fire, or damage to the workstation.

* Do not share the workstation's electrical outlet with other high-power devices. Do not use household surge strips, extension cords, or multi-outlet power taps.
* Use only the provided C19 power cable provided, and ensure it is plugged into a properly grounded outlet. Do not bypass the grounding pin. Using a non-Tenstorrent approved power cable may result in equipment damage, electric shock, or fire hazard.
* If the circuit becomes overloaded and if the breaker trips, immediately disconnect and remove the power cord. Tenstorrent recommends a qualified electrician inspect and verify the circuit’s capacity before resuming setup.  
* Never attempt to reset or bypass a tripped breaker without first confirming the circuit integrity; failure to do so may result in overheating, voltage drop, or irreversible damage.
:::

### **Electrostatic Discharge Safety**

:::{admonition} Important
:class: warning
Electrostatic discharge (ESD) can permanently damage Tensix cores, memory modules, or other components. Handle with care and always follow ESD-safe practices. Before opening the TT-QuietBox 2  workstation or handling the internal components, you must discharge static electricity to avoid damaging ESD sensitive hardware. 
* Touch an exposed metal surface, such as a grounded rack, chassis, or power supply casing, before and during internal handling.  
* Ideally, wear an ESD wrist strap connected to a verified ground point.  
* Avoid working on carpeted floors or in low-humidity environments where static buildup is more likely.  
* Do not touch any processor, memory module, connector, or printed circuit board (PCB) circuitry unless absolutely necessary, and only after properly discharging.
:::

## **Other Notices to Users**

* This equipment has been tested and found to comply with the limits for a Class B digital device, pursuant to part 15 of the FCC Rules. These limits are designed to provide reasonable protection against harmful interference in a residential installation.
* This equipment generates, uses and can radiate radio frequency energy and, if not installed and used in accordance with the instructions, may cause harmful interference to radio communications. However, there is no guarantee that interference will not occur in a particular installation.
* Changes or modifications to this workstation which are not expressly approved by Tenstorrent may void the user's authority to operate it. Tenstorrent cannot accept responsibility for any failure to satisfy any Safety, EMC or regulatory requirements that result from non-approved modification of the product, including the fitting of non-Tenstorrent cards, cables, or any other hardware or software modification which may affect compliance. To avoid damage and personal injury, only use Tenstorrent approved components with this device. 
* Do not use the TT-QuietBox 2 in a way that it was not designed to be used.
