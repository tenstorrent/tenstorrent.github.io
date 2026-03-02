---
myst:
  html_meta:
    product-name: TT-LoudBox Blackhole
    technology-concepts: Setup, Installation
    document-type: Task-Based Guide (How-To)
---

# Receiving, Unboxing, and Setup

*<span style="color: purple;">Note: This content is still being drafted. Once finalized, the complete documentation will be available at docs.tenstorrent.com</span>*

## Before You Begin

* The Server should be installed by a trained qualified professional in a Restricted Access Area. Professional installation ensures the Server operates safely and effectively while preventing property damage and personal injuries. The professional installer assumes all responsibility for compliance with local regulatory and safety requirements during installation.

* The Server should be installed in an area that is clean, dust-free and well-ventilated. Avoid areas where heat, electrical noise and electromagnetic fields are generated.
 
* Leave at least 25 inches of clearance in front of the rack, and at least 30 inches of clearance behind the rack. This will allow the doors to open completely in the event of servicing, and will ensure proper airflow.

### Safety Warnings

Please visit the safety warnings section on the specifications page for information about electrical and electrostatic discharge (ESD).

:::{admonition} Caution: Heavy Object
:class: warning
The Server weighs 45kg (99lbs). To avoid personal injury and Server damage, at least two people are required for unboxing. Use of a Server lift is recommended for rack installation
:::

:::{admonition} Caution: Hearing Damage Risk
:class: warning
The Server produces high volume levels, which can be dangerous to hearing over long periods. We strongly recommend using hearing protection when you are installing, servicing, or working near this Server.
:::

### Important Rack Considerations

* The provided rails will fit a rack between 26.5"and 36.4" deep.
* Ensure that the leveling jacks on the bottom of the rack are extended to the floor so that the full weight of the rack rests on them.
* This unit should be mounted at the bottom of the rack if it is the only unit in the rack.
When mounting this unit in a partially filled rack, load the rack from the bottom to the top with the heaviest component at the bottom of the rack.
* If the rack is provided with stabilizing devices, install the stabilizers before mounting or servicing the unit in the rack. 
* Ensure your rack’s stabilizing mechanism is in place or that the rack is bolted to to the floor. When sliding the Server in and out of the rack, failure to stabilize the rack can cause the rack to tip over.
* When not servicing, always keep the front door of the rack and all covers/panels on the servers closed to maintain proper cooling.

### Site Power Requirements and Recommendations

:::{admonition} Caution: Shock Hazard
:class: warning
This Server contains multiple power supply units (PSUs). Before any servicing, shut down the Server, disconnect all power supply cables, and allow the PSUs to fully drain.
:::

Before installing, ensure that the rack facility has four 20A/240V circuits which can be dedicated to the Server. The rack’s PDU (Power Distribution Unit) outlets should be rated for 10A contiguous load per PSU.

The Server’s four PSUs work in a 2+2 redundant configuration, and the expected power consumption of the Server at peak loads is 4kW. The PSUs automatically sense the input voltage between 200 V to 240 V, and operate at that voltage. Note that different input voltages will result in different maximum power output levels.

For maximum efficiency and redundancy, all four PSUs should be plugged in and powered on at the same time. Running the Server with less than four PSUs is possible but should only be considered a temporary condition. Failed power supplies should be replaced promptly. 

An amber light on the power supply indicates that the power supply is off. A green light indicates that the power supply is operating normally.


# Required Tools

The Tenstorrent TT-LoudBox™ (Blackhole™) system package includes:

* Tenstorrent TT-LoudBox™ (Blackhole™) Server
* 4x IEC-60320-C13 to C14 F-M Power Cables 
* 4U Rack-Mounting Kit
* 10x QSFP-DD Passive 800G cables (QDD-800G-PC005)

## Step 1: Unboxing the Server

:::{figure} bh-lb-unboxing-placeholder.png
:width: 60%
:::

* 1. Remove the clips from either side of the shipping box. There are four (4) clips in total, two on each side of the box. To remove, compress the clips and pull to release. 
* 2. Lift the top of the box off of the bottom. 
* 3. Remove the accessory bag from the box and save it for later.
* 4. Lift the LoudBox out of the box. 


:::{admonition} Important
:class: important
Do not pick up the server with the front handles. The handles should only be used to pull the system from a rack.
:::

## Step 2: Rack Mounting the Server

### 1. Identifying the Inner Rack Rails

This section details installation for the rack rails provided in the TT-LoudBox (Blackhole) package. There are a variety of rack units on the market, so the assembly procedure may differ slightly if you choose to use a different set of rails. Also refer to the installation instructions for your rack unit.

The chassis package includes one pair of rack rail assemblies in the rack mounting kit. Each assembly consists of an inner rail that secures to the chassis and an outer rail that is attached directly to the rack. The inner rails are etched with "L" (Left side) and "R" (Right side).

:::{figure} bh-lb-rail-id-placeholder.png
:width: 70%
:::


### 2. Installing the Inner Rails on the Chassis

1. Identify the left and right side inner rails. Place the correct inner rail on the side of the
chassis, aligning the hooks of the chassis with the inner rail holes. Make sure the rail faces "outward" so that it will fit with the rack's mounting bracket.
2. Slide the rail toward the front of the chassis to hook the inner rail onto the side of the chassis.
3. If desired, secure the rail with two flat head M4 x 4mm screws as illustrated.

:::{figure} bh-lb-rail-id-2-placeholder.png
:width: 50%
:::


### 3. Installing the Outer Rails Onto the Rack

* 1. Press upward on the locking tab at the rear end of the middle rail.
* 2. Push the middle rail back into the outer rail.
* 3. Hang the hooks on the front of the outer rail onto the square holes on the front of the rack.If desired, use screws to secure the outer rails to the rack.
* 4. Pull out the rear of the outer rail, adjusting the length until it just fits within the posts of the rack.
* 5. Hang the hooks of the rear section of the outer rail onto the square holes on the rear of the rack. Take care that the proper holes are used so the rails are level. If desired, use screws to secure the rear of the outer rail to the rear of the rack.
* 6. Repeat for the other outer rail.

:::{figure} bh-lb-outer-rails-placeholder.png
:width: 70%
:::

### 4. Sliding the Server into the Rack

* 1. Align the chassis rails (A) with the front of the rack rails (B).
* 2. lide the chassis rails into the rack rails, keeping the pressure even on both sides. You may have to depress the locking tabs while inserting. When the server has been pushed completely into the rack, the locking tabs should "click" into the locked position.
* 3. If screws are used, tighten the screws on the front and rear of the outer rails.
* 4. (Optional) Insert and tighten the thumbscrews that hold the front of the server to the rack.

:::{figure} bh-lb-slide-rack-placeholder.png
:width: 50%
:::
Note: The above is an illustrative example. Always install servers at the lowest open position in the rack to ensure stability.

## Step 2: Setting Up the Mesh Topology (Single Server)