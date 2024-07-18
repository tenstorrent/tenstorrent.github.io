# Active Cooling Kit

## Compatibility

The Active Cooling Kit (TX-01001) is compatible with the following Tenstorrent Tensix Processor cards:

- Grayskull™ e150 (TC-01002)
- Wormhole™ n150s with Passive Cooler (TC-02001)
- Wormhole™ n300s with Passive Cooler (TC-02003)

## Installation

If your Grayskull™ e150, Wormhole™ n150s, or Wormhole™ n300s Tensix Processor card requires active cooling in your system (for example, in a desktop workstation), follow these steps to install the Active Cooling Kit.

### Step 1. Attach the Duct

Attach the provided **duct** to the card via three (3) **M3 screws**.

![](./grayskull/images/gs_ack1.png)

### Step 2. Insert Blower Fan

Insert the **blower fan** into the **duct**.

![](./grayskull/images/gs_ack2.png)

### Step 3. Fasten the Blower Fan

Fasten the **blower fan** to the **duct plate** through the top of the fan with two (2) **M4 screws**.

![](./grayskull/images/gs_ack3.png)

### Step 4. Connect Fan Power

The blower fan includes a **passthrough 6-pin PCIe harness**. Connection will depend on the card.

#### Grayskull™ e150

The **male end** connects to the **6-pin PCIe plug** on the **e150 card**, and the **female end** connects to a **6-pin PCIe cable** from the **power supply**.

![](./grayskull/images/gs_e150_kit_power.png)

#### Wormhole™ n150s and n300s (Passive Cooled)

Connect a **PCIe 6-pin plug** into the **6-pin female end** of the harness. *(NOTE: You will **not** use the male end of the harness.)*