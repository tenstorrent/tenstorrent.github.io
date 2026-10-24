---
myst:
  html_meta:
    product-name: TT-LoudBox Blackhole
    technology-concepts: Setup, Installation
    document-type: Task-Based Guide (How-To)
---

# Receiving, Unboxing, and Setup

*<span style="color: purple;">Note: This product is pre-launch and specifications are subject to change. This install guide would love your feedback! Please add it to the attached spreadsheet that came with this website package.</span>*

## Before You Begin

* The TT-LoudBox (Blackhole) should be installed by a trained, qualified professional in a Restricted Access Area. Professional installation ensures the Server operates safely and effectively while preventing property damage and personal injuries. The professional installer assumes all responsibility for compliance with local regulatory and safety requirements during installation.

* The TT-LoudBox (Blackhole) should be installed in an area that is clean, dust-free and well-ventilated. Avoid areas where heat, electrical noise and electromagnetic fields are generated.
 
* When rack-mounting, leave at least 25 inches of clearance in front of the rack and at least 30 inches of clearance behind the rack. This will allow the doors to open completely in the event of servicing and will ensure proper airflow.

### Safety Warnings

Before beginning setup, please review the [Installation Site Considerations](specifications.md#installation-site-considerations) and the [Electrostatic Discharge](specifications.md#electrostatic-discharge-safety) sections on the Specifications page. This is for your personal safety and the integrity of the server.

:::{admonition} Caution: Heavy Object
:class: warning
The Server weighs 45kg (99lbs). To avoid personal injury and Server damage, at least two people are required for unboxing. Use of a Server lift is recommended for rack installation.
:::

:::{admonition} Caution: Hearing Damage Risk
:class: warning
The Server produces high volume levels, which can be dangerous to your hearing over long periods. We strongly recommend using hearing protection when you are installing, servicing, or working near this Server.
:::

### Important Rack Considerations

* The provided rails will fit a rack between 26.5" and 36.4" deep.
* Ensure that the leveling jacks on the bottom of the rack are extended to the floor so that the full weight of the rack rests on them.
* If it is the only unit in the rack, the Server should be mounted at the bottom.
If the rack is partially filled, load the rack from the bottom to the top with the heaviest units at the bottom of the rack.
* If the rack has stabilizing devices, install the stabilizers before mounting or servicing the Server in the rack. 
* Ensure your rack’s stabilizing mechanism is in place or that the rack is bolted to the floor. When sliding the Server in and out of the rack, failure to stabilize the rack can cause the rack to tip over.
* When not servicing, always keep the front door of the rack and all covers/panels on the servers closed to maintain proper cooling.

### Site Power Requirements and Recommendations

:::{admonition} Caution: Shock Hazard
:class: warning
This Server contains multiple power supply units (PSUs). Before any servicing, shut down the Server, disconnect all power supply cables, and allow all PSUs to fully drain.
:::

Before installing, ensure that the rack facility has four 20A/240V circuits which can be dedicated to the Server. The rack’s PDU (Power Distribution Unit) outlets should be rated for 10A contiguous load per PSU.

The Server’s four PSUs work in a 2+2 redundant configuration, and the expected power consumption of the Server at peak loads is 4kW. The PSUs automatically sense the input voltage between 200 V to 240 V, and operate at that voltage. Note that different input voltages will result in different maximum power output levels.

For maximum efficiency and redundancy, all four PSUs should be plugged in and powered on at the same time. Running the Server with less than four PSUs is possible but should only be considered a temporary condition. Failed power supplies should be replaced promptly. 

An amber light on the Server's power supply indicates that the power supply is off. A green light indicates that the power supply is operating normally.


### Package Contents

The Tenstorrent TT-LoudBox (Blackhole) system package includes:

* Tenstorrent TT-LoudBox (Blackhole) Server
* 4x IEC-60320-C13 to C14 F-M Power Cables 
* 4U Rack-Mounting Kit
* 10x QSFP-DD Passive 800G cables (QDD-800G-PC005)

## Step 1: Unboxing the Server

1. Remove the clips from either side of the shipping box. There are four (4) clips in total, two on each side of the box. To remove, compress the clips and pull to release.

:::{figure} bh-lb-clip-removal.jpg
:width: 40%
:::

2. Lift the top of the box off of the bottom.

:::{figure} bh-lb-lift-top.jpg
:width: 40%
:::

3. Remove the rack rails and accessories and set aside. Then lift the styrofoam casing.

:::{figure} bh-lb-remove-railkit.jpg
:width: 40%
:::

:::{figure} bh-lb-accessories.jpg
:width: 40%
:::

:::{figure} bh-lb-remove-styrofoam.jpg
:width: 40%
:::

4. Lift and remove the inner cardboard sleeve.

:::{figure} bh-lb-remove-inner-sleeve.jpg
:width: 40%
:::

5. With at least two people, lift the TT-LoudBox out of the box. 

:::{figure} bh-lb-two-man-lift.jpg
:width: 40%
:::

:::{admonition} Important
:class: important
Do not pick up the server with the front handles. The handles should only be used to pull the system from a rack.
:::

## Step 2: Rack Mounting the Server

This section details installation for the rack rails that are provided in the TT-LoudBox (Blackhole) package. If you choose to use a different set of rails, the assembly procedure may differ slightly. Please also refer to the installation instructions for your rack unit.

The rail kit package contains a pair of inner rails that secure to the Server chassis and a pair of outer rails that attach directly to the rack. The inner rails are etched with "L" (left side) and "R" (right side).


### 1. Installing the Inner Rails onto the Chassis

1. Identify the left and right side inner rails. Place the left inner rail on the left side of the
chassis, aligning the hooks of the chassis with the inner rail holes. Repeat with the right side. Make sure the rail faces "outward" so that it will fit with the rack's mounting bracket.

:::{figure} bh-lb-inner-rails.jpg
:width: 40%
:::

2. If desired, secure the rail with two flat head M4 x 4mm screws as illustrated.


### 2. Installing the Outer Rails onto the Rack

1. Press upward on the locking tab at the rear end of the middle rail.
:::{figure} bh-lb-middle-rail-snap.jpg
:width: 40%
:::

2. Push the middle rail back into the outer rail.

:::{figure} bh-lb-middle-and-outer-rail.jpg
:width: 40%
:::

3. Hang the hooks on the front of the outer rail onto the square holes on the front of the rack. If desired, use screws to secure the outer rails to the rack.

:::{figure} bh-lb-securing-outer-rails2.jpg
:width: 40%
:::

4. Pull out the rear of the outer rail, adjusting the length until it just fits within the posts of the rack.

:::{figure} bh-lb-extending-rails.jpg
:width: 40%
:::

5. Hang the hooks of the rear section of the outer rail onto the square holes on the rear of the rack. Take care that the proper holes are used so the rails are level. If desired, use screws to secure the rear of the outer rail to the rear of the rack.

:::{figure} bh-lb-back-outer-rails.jpg
:width: 40%
:::

6. Repeat for the other outer rail.


### 3. Sliding the Server into the Rack

1. Align the chassis rails with the front of the rack rails. Match the inner rail "A" with outer rail "A" on one side. Repeat and match the "B" rails on the opposite side.

:::{figure} bh-lb-chassis-rails-2.jpg
:width: 40%
:::

2. With two people, slide the chassis rails into the rack rails, keeping the pressure even on both sides. You may have to depress the locking tabs while inserting. When the server has been pushed completely into the rack, the locking tabs should "click" into the locked position.

:::{figure} bh-lb-slide-chassis-into-rack.jpg
:width: 40%
:::

:::{figure} bh-lb-chassis-in-rack.jpg
:width: 40%
:::

3. If screws are used, tighten the screws on the front and rear of the outer rails.

Note: The above is an illustrative example. Always install servers at the lowest open position in the rack to ensure stability.

## Step 3: Setting Up the Mesh Topology (Single Server)

### 1. Connect QSFP-DD Cables

Note: for multi-server mesh configurations, please view our [Topology Configuration page](configurations.md).

The Server can be operated in either a grid (no cables) or mesh topology.
Meshing provides the benefit of decreased latency by decreasing the hop count between chips and is recommended for high performance operations. Tenstorrent recommends the following mesh as a baseline default for a single server.

:::{figure} bh-lb-2x4_Mesh.jpg
:width: 60%
:::

:::{figure} bh-lb-2x4-photo.jpg
:width: 60%
:::

Tenstorrent is in the process of validating additional mesh topologies for specific use cases. You may wish to install a custom mesh topology for your needs, however, please note we cannot guarantee performance or error-free operation on any user-generated topologies. For multi-server scale out guidance, please refer to our [Topology Configuration page](configurations.md).

### 2. Connect Networking, BMC and Power Cables

There are two options to connect the Server to the local network. For the fastest performance, a Mellanox 100G DAC cable can be plugged into the QSFP56 port in the rear of the Server, and then into your network. Alternatively, a standard Ethernet cable can be connected to the RJ45 port, adjacent to the BMC management port. 

Once you have connected your chosen networking cable, connect your Cat6 cable to the BMC port. Finally plug in the power cables provided in the package.

:::{figure} bh-lb-all-rear-cables.jpg
:width: 40%
:::

Once all cables are connected, power on the Server by pressing the ⏻ power button on the front control panel. 

:::{figure} bh-lb-power-on.jpg
:width: 40%
:::

Your hardware setup is complete. Please head to the [Operating System and Firmware Setup](OS-setup.md) page to continue.

## Need Additional Support?

If you encounter any issues, or have a question that isn’t covered in the documentation, please reach out at [support@tenstorrent.com](mailto:support@tenstorrent.com). Our team will review your request and provide assistance.

 