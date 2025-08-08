# Receiving, Unboxing, and Setup

This guide provides system administrators, hardware engineers, and users responsible for the initial setup of Tenstorrent hardware with step-by-step instructions. You will learn to safely unbox a TT-QuietBox Blackhole™ workstation, connect all required hardware components, and install the recommended operating system.

### **Metadata and Labels**

* **Product Names:** TT-QuietBox Blackhole™, Grayskull™ AI Processor, Wormhole™ Networked AI Processor, TT-Buda™, Tensix core  
* **Technology Concepts:** PCIe, QSFP-DD, Installation, Setup, Electrostatic Discharge (ESD), Unified Extensible Firmware Interface (UEFI)  
* **Document Type:** Task-Based Guide (How-To)

## **Before You Begin**

Before you begin, choose a clear, stable, and spacious area for the TT-QuietBox Blackhole™ workstation. The system ships in a palletized wooden crate. Ensure you have at least two people and enough room for them to maneuver comfortably and safely around the crate and system. Clear the area where you intend to use the TT-QuietBox Blackhole™ and ensure it has power, as specified in the electrical safety warning below. Also, confirm that all vents are clear of obstructions or other objects.

:::{warning}
The fully palletized and crated shipment weighs approximately 134 lbs (61 kg), and the workstation itself weighs approximately 80 lbs (36 kg). Unboxing and lifting require at least two people for safe maneuverability.

Do not proceed with unboxing or installation if you suspect shipping damage to the system. Contact Tenstorrent support at `support@tenstorrent.com` for assistance.
:::

### **Electrical Safety Warning**

:::{danger}
Failure to follow these electrical safety instructions may result in electric shock, fire, or damage to the equipment.
:::

* Connect the system to a dedicated AC power circuit with sufficient capacity to support the full power draw of the TT-QuietBox Blackhole™ workstation, including peak loads under heavy AI model execution.  
* Do not share the outlet with other high-power devices. Avoid using household surge strips, extension cords, or multi-outlet power taps; not all are rated for the sustained current of this system.  
* Use only the provided C13 power cable, and ensure it is plugged into a properly grounded outlet. Do not bypass or disable the grounding pin.  
* Verify that the circuit wiring and breaker rating meet or exceed the combined system requirements, including liquid-cooling support and all accelerator cards.  
* If the circuit becomes overloaded or if the breaker trips during power-up or operation, immediately disconnect and remove power. Then, have a qualified electrician inspect and verify the circuit’s capacity before resuming setup.  
* Never attempt to reset or bypass a tripped breaker without first confirming the circuit integrity; failure to do so may result in overheating, voltage drop, or irreversible damage.

### **ESD Safety Warning**

:::{admonition} Important
:class: warning
Before opening the TT-QuietBox Blackhole™ workstation or handling any internal components, you must discharge static electricity from your body to avoid damaging sensitive hardware. Electrostatic discharge can permanently damage Tensix cores, memory modules, or other components. Handle with care and always follow ESD-safe practices.
* Touch a grounded metal surface, such as a grounded rack, chassis, or power supply casing, before and during internal handling.  
* Ideally, wear an ESD wrist strap connected to a verified ground point.  
* Avoid working on carpeted floors or in low-humidity environments where static buildup is more likely.  
* Do not touch any processor, memory module, connector, or printed circuit board (PCB) circuitry unless absolutely necessary, and only after properly discharging.
:::


### **Required Tools**

For unboxing, you will need the following tools:

* Phillips head screwdriver  
* Scissors or a similar cutting tool

### **Operating System Installation Preparation**

The TT-QuietBox Blackhole™ workstation ships without a pre-installed operating system (OS). Tenstorrent recommends preparing a bootable Universal Serial Bus (USB) flash drive with an installer for Ubuntu 22.04 LTS (Jammy Jellyfish) to ensure compatibility with the Tenstorrent software stack. Refer to the [official Ubuntu tutorial on creating a bootable USB drive](https://ubuntu.com/tutorials/create-a-usb-stick-on-ubuntu#1-overview) for guidance.

For OS installation, you will need:

* USB flash drive with an installer for Ubuntu 22.04 LTS (Jammy Jellyfish)  
* Keyboard  
* Mouse  
* Monitor

---

## **Step 1: Unboxing the Workstation**

Follow these steps to unbox your TT-QuietBox Blackhole™ workstation:

1. **Position the crate.** Position the crate in your prepared unboxing area, ensuring ample space for two people to work around it.  
2. **Remove plastic wrap.** Remove the outer plastic wrap and cut the two lifting straps looped around the crate.  
3. **Open the crate.** Use a **Phillips head screwdriver** to remove the six screws from the top panel of the crate. Lift off the top panel.  
4. **Remove the system from the crate.** Remove the protective styrofoam from inside the crate. Use the two lifting straps to vertically lift the inner cardboard box out of the wooden crate. Do not tilt the box sideways during this process.  
5. **Open the cardboard box.** Cut the two lifting straps off the cardboard box and open the top flaps.  
6. **Unpack accessories.** Remove the documentation and the accessory bag from the box and set them aside.  
7. **Remove the workstation from the cardboard box.** Reach into the short sides of the box, secure your hands under the supportive styrofoam, and lift the TT-QuietBox Blackhole™ workstation out of the box. Place it in your workspace.  
8. **Remove additional packing material.** Remove any remaining packaging from the exterior of the TT-QuietBox Blackhole™ workstation.  
9. **Inspect the system.** Inspect the workstation to ensure all components are properly mounted and secured. The system ships with sufficient liquid coolant for long-term operation; adding or purchasing coolant is not necessary.

---

## **Step 2: Setting Up the Hardware**

Follow these steps to set up the hardware for your TT-QuietBox Blackhole™ workstation:

1. **Connect the power cable.** Connect the provided C13 power cable to the workstation and then to a dedicated power outlet.  
2. **Connect QSFP-DD cables.** The included Quad Small Form-factor Pluggable Double Density (QSFP-DD) cables enable high-speed interconnectivity between the Tenstorrent Tensix cores. Your system includes four Blackhole™ processors and eight external QSFP-DD cables to create the processor mesh. Connect the eight cables according to the system topology diagram below. Ensure each cable is aligned correctly and clicks into place; do not force the connections.  
3. **Connect to the network.** For host system network access, connect a standard Ethernet cable (Cat 6 or better, user-provided) to an RJ45 LAN port on the rear panel. The **LAN1** and **LAN2** ports are 10GbE, while **LAN3** and **LAN4**are 1GbE.  
4. **Connect peripherals.** Connect your monitor, keyboard, and mouse (user-provided). A VGA-to-HDMI adapter is included for monitors that require an HDMI connection.  
5. **Power on the system.** Locate the main power supply switch on the rear of the workstation and set it to the **ON**position. Press the system power button on the front panel.

:::{note}
The system's initial hardware initialization during its first Power-On-Self-Test (POST) may require several minutes before displaying the BIOS screen.
:::

---

## **Step 3: Installing the Operating System**

To install Ubuntu 22.04 LTS, plug your prepared bootable USB drive into an available USB Type-A port. During the Power-On-Self-Test (POST), press a key to enter the boot menu or the system's setup utility.

:::{note}
The TT-QuietBox Blackhole™ workstation uses an ASRock Rack SIENAD8-2L2T motherboard. The full user manual is available for download from the [ASRock Rack product page](https://www.asrockrack.com/general/productdetail.asp?Model=SIENAD8-2L2T).
:::

### **Option 1: Using the Boot Menu**

1. Power on or restart the system.  
2. Press the `F11` key during POST to enter the boot menu.  
3. Select your USB flash drive from the list.  
4. Follow the on-screen Ubuntu installation prompts.

### **Option 2: Adjusting the Boot Order in UEFI**

1. Power on or restart the system.  
2. Press the `F2` or `Delete` key during POST to enter the Unified Extensible Firmware Interface (UEFI) setup utility.  
3. Navigate to the **Boot** section.  
4. Set your USB flash drive as the primary boot device.  
5. Select **Save Changes and Exit**; the system will restart and boot from your USB drive.  
6. Follow the on-screen Ubuntu installation prompts.

# HOLD FOR BEN’S SCRIPT AND COPY

---

## **Step 4: Installing the Tenstorrent Software Stack**

After completing the operating system installation, proceed with [Installing the Tenstorrent Software Stack](../../getting-started/README.md).

---

# REMOVE THIS AND BELOW ONCE ALL IMAGES ARE PORTED

## **Need Additional Support?**

If you encounter any issues, or have a question that isn't covered in the documentation, please [submit a ticket.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance. THIS NEEDS LINK TO FAQ.


**NOTE:** Prior to unboxing your Tenstorrent TT-QuietBox™ Liquid-Cooled Desktop Workstation package, choose a clear, stable, and spacious area. The fully palletized, crated system is approximately 134 lbs. (61 kg) and the TT-QuietBox system itself is approximately 80 lbs. (36 kg). Ensure you have at least two people and enough room for them to maneuver comfortable around the crate and system.

## Receiving

The TT-QuietBox system ships in a palletized wooden crate.

Verify the contents of your shipment. Contents include:

| TT-QuietBox™ Wormhole (TW-04001)                             | TT-QuietBox™ Blackhole (TW-04002)                            |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Tenstorrent TT-QuietBox Wormhole System<br />C13 Power Cable, 1.8m/6ft.<br />2x QSFP-DD 400GbE Cable, 0.6m/2ft.<br />VGA-to-HDMI Adapter | Tenstorrent TT-QuietBox Blackhole System<br />C13 Power Cable, 1.8m/6ft.<br />8x QSFP-DD 800GbE Cable, 0.6m/2ft.<br />VGA-to-HDMI Adapter |

For unboxing, you will need:

- Phillips head screwdriver
- Scissors or similar cutting tool

Do **not** proceed with unboxing or installation if critical components are missing or you suspect shipping damage to the system itself. Please reach out to [support@tenstorrent.com](mailto:support@tenstorrent.com) for help.

The TT-QuietBox system ships without an operating system installed. Tenstorrent recommends preparing a bootable USB flash drive with an installer for Ubuntu 22.04 LTS (Jammy Jellyfish) to ensure proper performance and compatibility with the Tenstorrent software stack; instructions are available on the Ubuntu website on how to create a bootable drive in Windows [here](https://ubuntu.com/tutorials/create-a-usb-stick-on-windows#1-overview).

## Unboxing

### 1. Position the Crate

Ensure the crate is correctly positioned in your prepared unboxing area with ample maneuvering space for two people.

![](qb_setup_1.jpg)

### 2. Remove Plastic Wrap

Remove the plastic wrap and cut the two lifting straps looped around the crate.

![](qb_setup_2.jpg)

### 3. Open the Crate

Remove six (6) screws from the top of the crate using a Phillips head screwdriver. Once the screws have been removed, lift the top off of the crate.

![](qb_setup_3.jpg)

### 4. Remove Boxed System from Crate

Remove the protective Styrofoam from the crate. 

Using the two lifting straps looped around the cardboard box, lift the cardboard box vertically out of the wooden crate. **Do not tilt the cardboard box sideways during this process.**

![](qb_setup_4.jpg)

### 5. Open the Cardboard Box

Cut the two lifting straps off of the cardboard box.

Open the top flaps of the cardboard box.

![](qb_setup_5.jpg)

### 6. Unpack Accessories

Remove documentation and the accessory bag from the box and set them aside.

![](qb_setup_6.jpg)

### 7. Remove the TT-QuietBox from the Cardboard Box

Lift the TT-QuietBox out together by reaching into the short sides of the box, securing your hands just underneath the supportive Styrofoam, and lifting the system out of the box.

Set the TT-QuietBox down in your workspace.

![](qb_setup_7.jpg)

### 8. Remove Additional Packing Material

Remove any additional packaging from outside of the TT-QuietBox.

![](qb_setup_8.jpg)

### 9. Inspect System

Inspect the TT-QuietBox to ensure everything is properly mounted and secured. Note that the system ships with sufficient liquid coolant for long term operation. There is no need to purchase and/or top up liquid coolant.

## Setting Up Hardware

### 1. Connect Power Cable

Connect the provided C13 power cable to the TT-QuietBox and then to a dedicated outlet.

![](qb_setup_power.jpg)

### 2. Connect QSFP-DD Cables

QSFP-DD cables are included with your TT-QuietBox to enable the high-speed interconnectivity between the Tenstorrent Tensix Processors. Follow the instructions for your TT-QuietBox model below for connecting the QSFP-DD cables; ensure the cables are aligned correctly and "click" into place. Do **not** force connections.

#### Blackhole™ p150c Version (TW-04002)

The Tenstorrent TT-QuietBox Blackhole (TW-04002) includes four Blackhole™ p150c Tensix Processors and eight (8) external QSFP-DD cables that enable the Tensix Processor mesh.

Customers will need to manually connect the QSFP-DD cables included. These diagrams display the system topology and where the included QSFP-DD cables need to be connected. 

![](qb_bh_topology.png)

#### Wormhole™ n300 Version (TW-04001)

The Tenstorrent TT-QuietBox Wormhole (TW-04001) includes four Wormhole™ n300 Tensix Processors, internal Warp 100 bridges, and two (2) external QSFP-DD cables that enable the Tensix Processor mesh.

![](https://docs.tenstorrent.com/_images/wh_portspec.png)

The TT-QuietBox ships with the Warp 100 bridges connected, but the QSFP-DD cables will need to be connected by the customer. This diagram displays the system topology and how the cards are enumerated, along with where the Warp 100 bridges are connected and where the included QSFP-DD cables need to be connected. 

![](qb_topology.png)

One QSFP-DD cable will need to be connected to **Port 1** on the cards in **Slots 1 and 4**.

One QSFP-DD cable will need to be connected to **Port 2** on the cards in **Slots 3 and 2**.

### 3. Connect to Network

For host system internet/network access, connect a standard Ethernet cable (Cat 6 or better, user-provided) to an RJ45 LAN port on the rear panel; LAN3 and LAN4 are 1G, while LAN1 and LAN2 are 10G. Connect the other end to  your network switch, router, or wall jack.

![](qb_lan.png)

### 4. Connect Other Accessories

Connect your monitor, keyboard, and mouse (user-provided). The VGA-to-HDMI adapter is included for monitors that require HDMI input from the TT-QuietBox's VGA source.

### 5. Power On

Locate the main power supply switch on the rear of the TT-QuietBox and switch it to the ON position.

Press the system power button on the front panel.

The system will power on. You should see activity on your connected monitor.

**NOTE:** The system's initial hardware initialization before OS installation may take several minutes. You will eventually see a BIOS screen.

### 6. Install Operating System

The TT-QuietBox system ships without an operating system installed. Tenstorrent recommends preparing a bootable USB flash drive with an installer for Ubuntu 22.04 LTS (Jammy Jellyfish) to ensure proper performance and compatibility with the Tenstorrent software stack. 

**NOTE:** TT-QuietBox uses an ASRock Rack SIENAD8-2L2T motherboard; the manual for that motherboard is available [here](https://www.asrockrack.com/general/productdetail.asp?Model=SIENAD8-2L2T#Manual).

To install Ubuntu 22.04 LTS (Jammy Jellyfish) from a USB flash drive, first plug in the drive to an available USB Type-A port.

You can either enter the system's BIOS/UEFI setup to adjust the boot order or enter a boot menu during Power-On-Self-Test (POST):

#### Option 1: Adjust Boot Order

- Power on or restart the system
- Press the `F2` or `Delete` key during Power-On-Self-Test (POST) to enter UEFI
- Navigate to the `Boot` section
- Set your USB flash drive as the primary boot device
- Select `Save Changes and Exit`; the system will restart and should now boot from your USB flash drive
- Follow the on-screen Ubuntu installation prompts

#### Option 2: Use Boot Menu

- Power on or restart the system
- Press the `F11` key during Power-On-Self-Test (POST)
- Select your USB flash drive
- Follow the on-screen Ubuntu installation prompts

## Installing Tenstorrent Software

Once the operating system is installed and functional, you can install Tenstorrent software by following the instructions [here](https://docs.tenstorrent.com/getting-started/README.html).

## Additional Support/Troubleshooting

Frequently asked questions (FAQs) and troubleshooting steps are available [here](./support.md).

If you encounter any other issues, please reach out to [support@tenstorrent.com](mailto:support@tenstorrent.com).