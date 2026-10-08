---
myst:
  html_meta:
    product-name: Blackhole® AI Processor, Blackhole® p100a, Blackhole® p150a, Blackhole® p150b, Tenstorrent
    technology-concepts: PCIe, ATX, QSFP-DD, firmware, TT-SMI, active cooling, passive cooling, power supply
    document-type: FAQ and Troubleshooting
---

# Blackhole® FAQ and Troubleshooting

## **Which card should I choose?**

See [Choosing a Card](index.md#choosing-a-card).

## **What Power Supply Unit (PSU) and connector should I use?**

Blackhole® cards use a 12V-2x6 (12+4-pin) connector and are designed for ATX 3.1 certified or newer power supplies. A native 12V-2x6 connector is recommended. **Never use an ATX 3.0 or older power supply.**

## **My PSU has no 12V-2x6 connector. What adapter should I use?**

Use only a cable or adapter supplied or explicitly approved by the PSU manufacturer. It may combine standard 8-pin PCIe and/or EPS 4+4-pin connectors, provided the combined delivery meets the card's 300W requirement and the PSU is ATX 3.1 certified or better. Connect each input cable to a separate PSU output, and make sure the total load stays within the PSU's rated output.

Many manufacturers key their connectors so that only their own cables work. Fully seat the connector and avoid tight bends near it. Older 12VHPWR cables are physically compatible but not recommended, as they have an increased risk of overheating from poor seating. The 12V-2x6 standard replaced them for this reason.

## **Which QSFP-DD cables should I buy?**

See <a href="multi-card-topologies.html">Multi-Card Topologies</a>.

## **My card is not enumerating**

Blackhole® cards are designed for PCIe Gen 5.0, but some motherboards default PCIe operation to Auto, which can prevent enumeration. In the BIOS, force the slot to `Gen 4.0` or `Gen 5.0`. Also check that the card is fully seated and that the power cable is connected.

Once the card enumerates, update to the latest firmware. See {doc}`Installing Tenstorrent Software </getting-started/README>`.

## **TT-SMI does not work correctly**

Check that PCIe AER Reporting Mechanism is set to `OS First` in the BIOS.

## **The idle power consumption seems high**

Blackhole® cards typically draw about 75W at idle. Wall measurements read higher because of AC-to-DC conversion loss in the power supply. Tenstorrent is exploring further idle power reductions through firmware updates.

## **The reported temperatures seem high**

The processor is designed to run continuously at up to 95°C, and the card reduces clock speeds automatically to prevent overheating. For p150b cards, confirm the server delivers at least 30 CFM at up to 35°C/95°F.

## **The fan noise is too quiet or too loud**

Feedback on p100a and p150a fan noise varies. Tenstorrent is evaluating end-user fan controls for a future update.

## **How can I test multiple cards together?**

Set up the Llama 3.1 8B demo from [TT-Transformers](https://github.com/tenstorrent/tt-metal/tree/main/models/tt_transformers). See also <a href="multi-card-topologies.html">Multi-Card Topologies</a>.

## **My new host has no network after installing Ubuntu**

Some motherboards need a network driver that stock Ubuntu lacks. See <a href="host-hardware.html">Choosing Host Hardware</a>.

## **Need additional support?**

Please [raise a support request](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1).
