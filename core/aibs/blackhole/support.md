---
myst:
  html_meta:
    product-name: Blackhole™ AI Processor
    technology-concepts: PCIe, QSFP-DD, active cooling, passive cooling, GDDR6, ASIC, firmware
    document-type: FAQ and Troubleshooting
---

# FAQ and Troubleshooting
This document assists Tenstorrent users in resolving common issues encountered with Blackhole™ AI Processors. It provides solutions and directs users to appropriate support resources.

## **How do I choose between the Tenstorrent Blackhole™ p100a/p150a/p150b?**

- **p100a:** This card is the economical entry point in the Blackhole™ product stack and exists for users looking to evaluate Tenstorrent technology. It features 28 GB of GDDR6 and an **active cooling solution** that conforms to industry PCI specifications, and is intended for **single card operation** in **conventional desktop systems**.
- **p150a:** This card provides additional local memory (32 GB) compared to p100a and slightly higher compute density. It also features four passive 800 Gbps QSFP-DD ports used for networking with other Tenstorrent Blackhole™ p150a/p150b cards.  It features an **active cooling solution** that conforms to industry PCI specifications, and is intended for **single- or multi-card operation** in **conventional desktop systems**.
- **p150b:** This card features identical specifications to p150a, but features a **passive cooling solution** that conforms to industry PCI specifications, and is intended for **single- or multi-card operation** in **rack-mounted servers** with **existing high static pressure, forced air cooling**.

## **What PSU and Connector should I use to connect my Blackhole card?**

Tenstorrent Blackhole cards use a 12V-2x6 (12+4-pin) power connector and are designed for use with ATX 3.1-certified or newer Power Supply Units (PSUs). Native PSU support via a 12V-2x6 connector is the recommended configuration.

Never use an ATX 2.0 or older PSU.

## **My PSU doesn't have a 12V-2x6 (12+4-pin) power connector available. What adapter should I get for my Blackhole card?**

If a native 12V-2x6 connector is not available, Blackhole cards may be powered using a PSU-manufacturer-approved adapter that combines standard 8-pin PCIe and/or EPS 4+4-pin connectors, provided the combined power delivery meets the card's total power requirements and the PSU is ATX 3.1 certified or better. Each input cable must be connected to a separate PSU output.

The Blackhole cards require 300W of power to function. Ensure that the combination of PSU outputs meets this requirement, and that the total load on your PSU does not exceed the total PSU output power.

To ensure electrical compatibility and prevent hardware damage, only power cables and adapters supplied or explicitly approved by the PSU manufacturer should be used. Many PSU manufacturers key the connectors so that only their power connector works. The power connector must be fully seated, and tight bends near the connector should be avoided.

Use of older 12VHPWR cables is not recommended, even though they are physically compatible with the 12V-2x6 connector. The 12V-2x6 standard replaced 12VHPWR to reduce the risk of overheating (and melting) associated with improper connector seating.

## **Which QSFP cable(s) should I purchase for my Tenstorrent Blackhole™ cards?**

For standard short-reach setups, validated 0.5m QSFP cables are available directly on the Tenstorrent store [hardware cards page](https://tenstorrent.com/hardware/cards).

If you need 1m cables, we recommend either [Amphenol 1m (3.3 ft.) 800G Passive QSFP-DD (SF-NJYYEK0001-001M)](https://cablesondemand.com/qsfp-dd-direct-attach-cables-200g-400g-800g-dac-1/amphenol-sf-njyyek0001-001m-1m-3-3-800g-qsfp-dd-112g-cable-800-gigabit-ethernet-passive-direct-attach-qsfp-double-density-112g-cable-dual-entry-32-awg-qsfp-dd-112g-to-qsfp-dd-112g-sf-njyyek0001-001m) or [FS 1m (3 ft.) 800G Passive QSFP-DD (QDD-800G-PC01)](https://www.fs.com/products/154259.html?attribute=36923&id=3720628).

## **The idle power consumption of my Tenstorrent Blackhole™ card seems high**

Blackhole™ AI Processors typically consume approximately 120W at idle. When measuring power at the wall, you might observe a higher power draw because the power supply converts AC current from the wall to DC current within the system, resulting in some expected loss.

Tenstorrent is exploring methods to further optimize idle power consumption through firmware updates and in future products.

## **The temperatures reported by my Tenstorrent Blackhole™ card seem high**

The Blackhole AI Processor is designed to operate safely and continuously at temperatures up to 95°C, even if the ASIC temperature appears high. Existing cooling solutions maintain the Blackhole AI Processor chip, power circuitry, and memory ICs within safe operating specifications. The card automatically reduces clock speeds to prevent overheating.

Tenstorrent is exploring methods to further optimize default operation through firmware updates and in future products.


## **The fan noise of my Tenstorrent Blackhole™ p100a/p150a card is too quiet/too loud**

Tenstorrent has received varied feedback regarding fan noise levels. Some users express concern about the noise level of their p100a or p150a models, while others prefer to tolerate increased noise to achieve lower idle and operating temperatures.

Tenstorrent is evaluating the addition of end-user fan controls in a future update.

## **What do I do if my Tenstorrent Blackhole™ card is not enumerating?**

Blackhole™ PCIe cards are designed to operate using PCI Express Gen 5.0. However, Tenstorrent has observed instances where some motherboards set PCIe operation to *Auto* (often by default), which can prevent the card from enumerating. You can often resolve these issues by manually forcing PCIe operation to `Gen 4.0` or `Gen 5.0` in the **BIOS**.

:::{important}
Once you successfully enter an operating environment where the card has enumerated, ensure that you update to the latest firmware. Refer to the [Installing the Tenstorrent Software Stack guide.](../../getting-started/README.md)
:::

## **How can I demonstrate the networking ability of my Tenstorrent Blackhole™ cards? How can I test multiple cards together?**

Setting up the Llama 3.1 8B model demo (instructions [here](https://github.com/tenstorrent/tt-metal/tree/main/models/tt_transformers)) is a useful way to test that your networked Blackhole™ cards are functioning as intended.

---

## **Need Additional Support?**
If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.
