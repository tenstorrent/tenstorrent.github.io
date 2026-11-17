---
myst:
  html_meta:
    product-name: Wormhole™ AI Processor
    technology-concepts: PCIe, active cooling, passive cooling, GDDR6, ASIC, firmware
    document-type: FAQ and Troubleshooting
---

# FAQ and Troubleshooting
This document assists Tenstorrent users in resolving common issues encountered with Wormhole™ AI Processors. It provides solutions and directs users to appropriate support resources.

## **What PSU and Connector should I use to connect my Wormhole card?**

Tenstorrent Wormhole cards use 4+4-pin EPS12V power connectors and are designed for use with ATX 3.0 and 3.1-compliant Power Supply Units (PSUs) capable of supplying sufficient total power for the card and system configuration. Native PSU support via a 4+4-pin EPS12V connector is the recommended configuration.

## **My PSU doesn't have an EPS12V power connector available. What adapter should I get for my Wormhole card?**

If a native EPS12V connector is not available, the card may be powered using a PSU-manufacturer-approved adapter, including PCIe 6+2-pin to EPS12V adapters, provided the combined power delivery meets the card's total power requirements. Each input cable must be connected to a separate PSU output.

Many PSU manufacturers use proprietary power cable kits to prevent incorrect connections. 8-pin EPS12V and 8-pin PCIe power connectors are not interchangeable and must not be substituted for one another, as they use different grounding and pin assignments.

The Wormhole cards require 160W (n150)/300W (n300) of power to function. Ensure that the combination of PSU outputs meets this requirement, and that the total load on your PSU does not exceed the total PSU output power.

Do not use 12VHPWR cables, even with an adapter, for Wormhole cards. The 12VHPWR connector is physically incompatible and electrically unsafe for EPS12V devices. Only PSU-manufacturer-supplied or approved EPS12V cables or adapters should be used to avoid overheating, connector damage, or other hardware failure.

For safe operation, the EPS12V connector must be fully seated, and tight bends near the connector should be avoided.