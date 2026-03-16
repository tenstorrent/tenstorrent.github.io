---
myst:
  html_meta:
    product-name: TT-LoudBox Blackhole
    technology-concepts: specifications, requirements, hardware
    document-type: Reference
---

# Specifications and Site Requirements

This document provides detailed technical specifications for the Tenstorrent TT-LoudBox™ (Blackhole™) Air-Cooled 4U Server.

For rack-mounting, setup, and cabling instructions, refer to the [Setup Guide](./setup.md).

:::{admonition} Important Safety Note
:class: Important
This is a Class A product designed for use in a commercial environment.  In a domestic environment, this product may cause radio interference, in which case the user may be required to take adequate measures.
 
Changes or modifications to this Server that are not expressly approved by Tenstorrent may void the user's authority to operate it. Tenstorrent cannot accept responsibility for any failure to satisfy any Safety, EMC or regulatory requirements that result from non-approved modification of the product, including the fitting of non-Tenstorrent recommended cards, cables, or any other hardware or software modification that may affect compliance. To avoid damage and personal injury, only use Tenstorrent approved hardware with this device. 
 
The Server contains a Class 1 Laser within the optical transceiver module. The laser is self-contained. If a replacement is required, only use a certified optical fiber transceiver Class 1 Laser product.

Do not use the TT-LoudBox (Blackhole) in a way that it was not designed to be used.
:::

## System Specifications

| Specification | Details |
| --- | --- |
| Form Factor and Size | 4U Rackmount; 17.2 x 7 x 29 in. / 441 x 179 x 736 mm (WxHxD). Weight: 45kg (99lbs) |
| CPU | 2x AMD Epyc 9124 |
| Memory | 768 GB (24x32 GB) DDR5 ECC RDIMM |
| Expansion Slots | Nine PCIe 5.0 x16 FHFL slots |
| Storage | 2 x 3.8 TB PCIe 4 NVMe |
| Tensix Processors | 8x Tenstorrent Blackhole™ p150b Tensix Processors |
| Cables | 4x IEC-60320-C13 to C14 F-M power cables (provided)<br>10x QSFP-DD Passive 800G 0.5m for processor mesh (provided)<br>1x Mellanox 100G DAC for networking — optional (not provided)<br>1x Cat 6 for the BMC — optional (not provided)<br>1x RJ45 Standard Ethernet — optional (not provided) |
| Host System Connectivity Ports | 2x RJ45 10GbE LAN<br>1x RJ45 1GbE Dedicated BMC/IPMI<br>2x QSFP56 100GbE (NIC)<br>2x USB Type A<br>1x COM<br>1x VGA |
| Tensix Processor Connectivity | 32x QSFP-DD Passive 800G (4x per Blackhole™ p150b card). Connects to other Blackhole Tensix Processors only. |
| Power Supply | 2+2 2000W Titanium Power Supply Units (PSUs). Expected peak consumption of 4kW. |
| Base System | SuperMicro GPU A+ Server AS-4125GS-TNRT |
| Operating System | None installed; see instructions for installing Ubuntu 22.04 (Jammy Jellyfish) |

### Control Panel Key
There are two buttons located on the front of the chassis: a power on/off button and a reset button. In addition there are six LEDs. The locations of these buttons and LEDs on the control panel are described below. 

:::{figure} bh-lb-control-panel-placeholder.png
:width: 30%
:::

| Number | Feature | Description |
| --- | --- | --- |
| 1 | Power Button | The main power switch applies or removes primary power from the power supply to the server but maintains standby power. |
| 2 | Reset Button | Reboots the system. |
| 3 | Power LED | Solid green light indicates power is on. |
| 4 | HDD LED | Solid amber light during boot up. When flashing, IDE channel activity (SAS2/SATA drive activity) is occurring. |
| 5 | NIC1 LED | When flashing, indicates network activity on GLAN2. |
| 6 | NIC2 LED | When flashing, indicates network activity on GLAN1. |
| 7 | Universal Information ID | * Steady Red: An overheat condition has occurred (may be caused by cable congestion).<br>* Blinking red (1 Hz): Fan failure.<br>* Blinking red (0.25 Hz): PSU failure.<br>* Solid blue: Local UID has been activated (to locate the server in a rack environment).<br>* Blinking blue (300 msec): Remote UID has been activated — use to activate the server from a remote location. |
| 8 | Power Fail LED | Indicates a power supply module has failed. |

### Environment Specifications
* Operating Temperature: 10º to 35º C (50º to 95º F)
* Non-Operating Temperature: -40º to 60º C (-40º to 140º F)
* Operating Relative Humidity: 8% to 90% (non-condensing)
* Non-Operating Relative Humidity: 5 to 95% (non-condensing)

## Installation Site Considerations

:::{admonition} Danger
:class: danger
Failure to follow these safety instructions may result in electric shock, fire, or damage to the equipment.
:::

* Install this server in a Restricted Access Location, such as a dedicated equipment room or service closet. Do not install this server in a residential home.
* Expected peak consumption of the TT-LoudBox Blackhole server is 4 kW. Connect the system to a dedicated power circuit with sufficient capacity to support the full power draw. 
* A reliable ground must be maintained at all times. A permanent ground cable is required. Ensure it is Green-Yellow in color, at least 14AWG and fixed with
a washer. The rack itself should also be grounded. Particular attention should be given to power supply connections other than the direct connections to the branch circuit (i.e. the use of power strips, etc.).
* Use only Tenstorrent approved cables with this system. Using alternative cables not approved by Tenstorrent may result in device damage or dangerous operating conditions
* If the circuit becomes overloaded or if the breaker trips during power-up or operation, immediately disconnect and remove power. Then, have a qualified electrician inspect and verify the circuit’s capacity before resuming setup.
* Never attempt to reset or bypass a tripped breaker without first confirming the circuit integrity; failure to do so may result in overheating, voltage drop, or irreversible damage.
* This Server is not suitable for use with visual display workplace devices according to §2 of the German Ordinance for Work with Visual Display Units.

### Electrostatic Discharge Safety

:::{admonition} Important
:class: caution
Before opening the server or handling any internal components, you must discharge static electricity from your body to avoid damaging sensitive hardware. Electrostatic discharge can permanently damage Tensix cores, memory modules, or other components. Handle with care and always follow ESD-safe practices.

* Touch a grounded metal surface, such as a grounded rack, chassis, or power supply casing, before and during internal handling.
* Ideally, wear an ESD wrist strap connected to a verified ground point.
Avoid working on carpeted floors or in low-humidity environments where static buildup is more likely.
* Do not touch any processor, memory module, connector, or printed circuit board (PCB) circuitry unless absolutely necessary, and only after properly discharging.

:::

