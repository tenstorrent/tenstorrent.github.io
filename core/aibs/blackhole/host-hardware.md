---
myst:
  html_meta:
    product-name: Blackhole® p150a, Blackhole® p150b, Tenstorrent
    technology-concepts: PCIe, ATX, motherboard, CPU, QSFP-DD, Ubuntu, power supply, BIOS
    document-type: how-to
---

# Choosing Host Hardware for Blackhole® p150a and p150b Cards

This guide outlines requirements and recommendations for assembling a host system for any number of Blackhole® p150a and p150b PCIe cards. You will learn which motherboard characteristics cause fitment and bandwidth problems, how to budget PCIe lanes across one or more cards, what to verify in a case and power supply, and which driver issues to expect on Ubuntu.

This guide covers host system components only. For Blackhole® card specifications, see [Blackhole® PCIe Cards](index.md). For driver, firmware, and TT-Metalium™ setup once the system is built, see {doc}`Installing Tenstorrent Software </getting-started/README>`.

:::{warning}
Do not purchase a p150b for a desktop build. The p150a and p150b share identical specifications except for cooling solutions. The p150a uses an active cooler and is intended for conventional desktop systems. The p150b uses a passive heatsink and requires the high static pressure, forced air cooling of a rack-mounted server.
:::

## Motherboard

The motherboard is the most important component in the build and the one most often chosen incorrectly. Four independent characteristics matter, and a board can satisfy three of them and still be unusable. When reviewing a motherboard for compatibility, be sure to read the manufacturer's slot table and block diagram, rather than the product page summary.

### Platform

Only x64 systems are officially supported. Community groups have gotten cards to enumerate on ARM, but those are not Tenstorrent-led efforts and so we cannot guarantee successful results.

### PCIe Slot Configuration

Blackhole® cards need a PCI Express 5.0 x16 slot without bifurcation for optimal performance. However, many Gen 4.0 setups will work at reduced speed.

Many boards provide one Gen 5.0 x16 slot and populate the remaining slots at Gen 3.0 or lower. Some current boards still include a Gen 1.0 slot as a secondary position. Double check the PCI Express generation on your board, as any slots that are older than Gen 4.0 will not work with Blackhole® cards.

Boards advertising multiple Gen 5.0 slots frequently wire the extra slots as x4 or x8 electrically, even when the connector is physically x16. This means that the slot might look correct but be limited on its data transfer speeds.

Where a board shares lanes between a slot and an M.2 socket, populating that socket can narrow the slot. Check the lane-sharing notes in the board manual before choosing a storage layout.

Blackhole® cards are dual-slot width. On boards with slots spaced for single-slot cards, a Blackhole® card may not fit alongside others. Risers can solve this in some cases, but be advised they add complexity and can raise build cost substantially.

:::{important}
A physical x16 connector says nothing about the actual electrical width of the slot. Confirm the lane count of each slot individually in the configuration you intend to build.
:::

### BIOS Requirements

Confirm the board's BIOS exposes two settings before you buy:

* **PCIe AER Reporting Mechanism**, which must be set to `OS First` for TT-SMI to work correctly.
* **Per-slot PCIe generation control.** Some motherboards default PCIe operation to Auto and then fail to enumerate the card. Forcing the slot to `Gen 4.0` or `Gen 5.0` resolves this.

### Physical Slot Spacing and Bottom-Edge Headers

The p150a and p150b are dual-slot boards measuring 42mm x 270mm x 111mm. For the actively cooled p150a, leave the adjacent slot unoccupied for airflow. When possible, budget three slot positions per card in a multi-card layout.

On ATX boards, the USB, audio, and front-panel headers usually sit along the bottom edge. Board designers place the lowest PCIe slot to clear them for single-width cards only, so a dual-width card in the bottom slot will foul the headers or their cables. This is common across ATX boards, so plan not to use the bottom slot.

### PCIe Retention Clips

Retention clip design varies between boards, and the mechanical tolerances of the cards leave little margin. Depending on the board and card, the clip may be hard to engage or may hold the card under tension once seated. During installation:

1. Seat the card fully and confirm the clip engages without force.
2. Check that the card sits flat against the slot with no visible bow along its length.
3. Confirm the bracket screws thread without pulling the card out of alignment.

:::{warning}
A card held under tension may loosen over time, place sustained stress on the PCIe connector, and in extreme cases, break the slot. Do not run a system in which the card does not seat cleanly.
:::

### I/O Shrouds and Front Guards

Avoid boards with a shroud or armor plate that extends from the rear I/O area toward the PCIe slots. The small tab with the QR code on the front edge of the card can conflict with it. Many GPUs have the same tab and the same conflict, so this is not specific to Tenstorrent hardware, but it rules out some otherwise suitable boards. Manufacturer product photography is usually enough to spot it before purchasing.

## CPU and PCIe Lane Budget

The lanes available to your slots depend on the CPU as well as the motherboard.

* **One card:** A mainstream desktop CPU supplies enough lanes to run one card at x16 Gen 5.0.
* **Two or more cards at full width:** Specify a workstation or server platform (AMD Threadripper or EPYC, or Intel Xeon), which provides enough lanes to run each card at x16 without sharing bandwidth.

A card in a slot with reduced connectivity still works. A card at Gen 4.0 or at x8 in a lane-shared configuration still enumerates and runs workloads. Depending on the workload, host-to-device transfer may become the limiting factor and cap throughput. A full x16 Gen 5.0 link without bifurcation is optimal and worth specifying wherever possible. A reduced link is a working compromise and a known limit on performance.

## Case and Clearance

### Rear Clearance for QSFP-DD Cabling

The p150a and p150b carry four QSFP-DD 800G ports on the card bracket. Clearance behind the expansion slots must be generous, not the minimum the ATX specification allows. A case built to minimum clearance may house the card but still leave too little room to route four QSFP-DD cables, or may put the card under tension to seat it. Several popular DIY cases, including some in Fractal Design's range, fall into this category.

See [Multi-Card Topologies](multi-card-topologies.md#cables) for cable lengths and how many cables each configuration uses.

:::{important}
If a case is already at the most restrictive clearance the specification allows, expect problems with a multi-card configuration. Shorter cables help with routing, but no cable length compensates for insufficient clearance at the connector itself.
:::

### Card Weight and Support

Blackhole® cards are considered heavy. Support them with one of the following:

* A horizontal case or bench orientation, which supports the card along its length.
* A support bracket or anti-sag brace in a conventional tower.

### Thermal Envelope

Confirm the case and its fans can deliver the card's environmental requirements:

| Specification               | Requirement               |
| --------------------------- | ------------------------- |
| Operating Temperature Range | 10°C/50°F - 35°C/95°F     |
| Air Flow                    | ≥30 CFM @ up to 35°C/95°F |

## Power Supply

An ATX 3.1 Certified power supply or better is required. Each card draws up to 300W through one 12+4-pin 12V-2x6 connector.

### Sizing

Tenstorrent publishes the supply class and per-card draw, but not a total wattage for a given card count. The table below is a practical starting point drawn from user builds, not a requirement:

| Configuration            | Card power      | Practical starting point                                              |
| ------------------------ | --------------- | --------------------------------------------------------------------- |
| One p150a or p150b       | 300W            | 800W ATX 3.1 Certified with a native 12V-2x6 connector                |
| Two or more cards        | 600W and above  | Size from total system load; 800W is unlikely to be sufficient       |

An 800W unit is generally adequate for one card. For two or more cards, size the supply from the total load: all cards at full draw, the CPU under load, storage, and headroom.

### Cables and Adapters

:::{warning}
Never use an ATX 3.0 or older Power Supply Unit (PSU).
:::

* If a native 12V-2x6 connector is unavailable, use only an adapter supplied or explicitly approved by the PSU manufacturer, and connect each input cable to a separate PSU output. See [FAQ and Troubleshooting](faq.md#my-psu-has-no-12v-2x6-connector-what-adapter-should-i-use).
* Older 12VHPWR cables are not recommended, even though they are physically compatible with the 12V-2x6 connector.

### Brands

User testing has found Thermaltake, be quiet!, and MSI power supplies to be stable in Blackhole® builds. This is not exhaustive and is not a validation list. Every brand has better and worse model years, and failure rates vary between production batches, so carefully evaluate the specific model and revision you intend to buy.

## Memory

The minimum requirement is 64 GB of system memory. In practice, the need varies with how you load models. Smaller configurations can run stably, but the model often has to be loaded in chunks instead of held in host memory, which complicates the loading path. Provisioning enough memory to hold your target model is a quality-of-life choice, not a functional requirement.

## Operating System and Motherboard Drivers

Tenstorrent recommends Ubuntu 22.04 or 24.04 for all Tenstorrent software.

Not every motherboard has complete driver support in a stock Ubuntu install. Some boards ship network controllers whose drivers are missing from stock Ubuntu, which leaves a new host without networking. Because the Tenstorrent installer needs an internet connection, resolve the following before installing any Tenstorrent software:

1. Download the driver package on a second machine with working networking.
2. Transfer it to the host on a USB stick.
3. Install it locally and confirm the interface comes up.

In many cases a firmware update is also required. The process is time-consuming, but users have not reported ongoing stability problems once the driver is installed.

This is a gap in motherboard and Ubuntu cross-support, not an issue with Tenstorrent hardware or software. Before beginning setup, search for your exact board model with your intended Ubuntu release and confirm the network controller is supported. If it is not, plan the offline driver install as part of the build.

## Host System Purchasing Checklist

| Component            | Verify before purchase                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| Card                 | p150a for a desktop chassis; p150b only for rack-mounted servers with forced air cooling                        |
| Motherboard: slots   | Electrical x16 Gen 5.0 in each slot you intend to use, in your final storage configuration                      |
| Motherboard: layout  | Bottom slot excluded; three slot positions per actively cooled card; no I/O shroud reaching the slots           |
| Motherboard: BIOS    | PCIe AER Reporting Mechanism settable to `OS First`; per-slot PCIe generation control                           |
| Motherboard: drivers | Network controller supported in your Ubuntu release, or an offline install planned                              |
| CPU                  | Mainstream desktop for one card; Threadripper, EPYC, or Xeon for two or more at full width                      |
| Case: clearance      | Measured clearance behind the bracket for four QSFP-DD cables per card                                          |
| Case: support        | Horizontal orientation or a support bracket                                                                     |
| Case: airflow        | ≥30 CFM at up to 35°C/95°F                                                                                      |
| Power supply         | ATX 3.1 Certified or better; native 12V-2x6. 800W is a practical starting point for one card; size from total load above that |
| Memory               | 64 GB minimum; enough to hold your target model if you want to avoid chunked loading                            |
| Cables (multi-card)  | QSFP-DD cables sized per [Multi-Card Topologies](multi-card-topologies.md#cables) |

## Related pages

* {doc}`Blackhole® PCIe Cards <index>`
* {doc}`Installing a Blackhole® Card <installation>`
* {doc}`Multi-Card Topologies <multi-card-topologies>`
* {doc}`Installing Tenstorrent Software </getting-started/README>`
