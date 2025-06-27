# Support and Troubleshooting



## Software Setup Support

For software setup, visit our [software setup](https://docs.tenstorrent.com/getting-started/README.html) page.



## Tenstorrent Support

For additional support, you can visit the Tenstorrent [Discord](https://discord.gg/tvhGzHQwaj) server or contact [support@tenstorrent.com](mailto:support@tenstorrent.com) with questions.



## FAQs and Troubleshooting

### How do I choose between the Tenstorrent Blackhole™ p100a/p150a/p150b?

- **p100a:** This card is the economical entry point in the Blackhole™ product stack and exists for users looking to evaluate Tenstorrent technology. It features 28 GB of GDDR6 and an **active cooling solution** that conforms to industry PCI specifications, and is intended for **single card operation** in **conventional desktop systems**.
- **p150a:** This card provides additional local memory (32 GB) compared to p100a and slightly higher compute density. It also features four passive 800 Gbps QSFP-DD ports used for networking with other Tenstorrent Blackhole™ p150a/p150b cards.  It features an **active cooling solution** that conforms to industry PCI specifications, and is intended for **single- or multi-card operation** in **conventional desktop systems**.
- **p150b:** This card features identical specifications to p150a, but features a **passive cooling solution** that conforms to industry PCI specifications, and is intended for **single- or multi-card operation** in **rack-mounted servers** with **existing high static pressure, forced air cooling**.

### Which QSFP cable(s) should I purchase for my Tenstorrent Blackhole™ cards?

We plan to offer internally validated QSFP cables for sale in the future, but in the meantime, the following models have been validated for use with your Blackhole™ cards:

- [Amphenol 0.5m (1.6 ft.) 800G Passive QSFP-DD (SF-NJYYER0006-000.5M)](https://cablesondemand.com/amphenol-sf-njyyer0006-000-5m-0-5m-1-6-800g-qsfp-dd-112g-cable-800-gigabit-ethernet-passive-direct-attach-qsfp-double-density-112g-cable-dual-entry-32-awg-qsfp-dd-112g-to-qsfp-dd-112g-sf-njyyer0006-000-5m)
- [Amphenol 1m (3.3 ft.) 800G Passive QSFP-DD (SF-NJYYEK0001-001M)](https://cablesondemand.com/qsfp-dd-direct-attach-cables-200g-400g-800g-dac-1/amphenol-sf-njyyek0001-001m-1m-3-3-800g-qsfp-dd-112g-cable-800-gigabit-ethernet-passive-direct-attach-qsfp-double-density-112g-cable-dual-entry-32-awg-qsfp-dd-112g-to-qsfp-dd-112g-sf-njyyek0001-001m)
- [FS 0.5m (2 ft.) 800G Passive QSFP-DD (QDD-800G-PC005)](https://www.fs.com/products/154258.html?attribute=36925&id=3871095)
- [FS 1m (3 ft.) 800G Passive QSFP-DD (QDD-800G-PC01)](https://www.fs.com/products/154259.html?attribute=36923&id=3720628)

### The idle power consumption of my Tenstorrent Blackhole™ card seems high.

It is normal to see Tenstorrent Blackhole™ cards idle at power consumption around 120W. You may see a higher draw if you measure power at the wall, as some loss is expected when your power supply converts AC current from the wall to DC current in your system.

We are exploring ways to further optimize idle power in firmware and future products.

### The temperatures reported by my Tenstorrent Blackhole™ card seem high.

The temperature of the ASIC may be alarming, but Blackhole™ is designed to safely, continuously operate at temperatures up to 95°C. The existing cooling solutions are designed to keep the Blackhole chip, power circuitry, and memory ICs operating within a safe specification, and the card will automatically reduce clock speeds as necessary to prevent overheating.

We are exploring ways to further optimize default operation in firmware and future products.

### The fan noise of my Tenstorrent Blackhole™ p100a/p150a card is too quiet/too loud.

We have received feedback in both directions: some users are concerned about the noise level of their p100a/p150a, while others would rather sacrifice noise to lower idle and operating temperatures.

We are evaluating adding end user fan controls in a future update.

### What do I do if my Tenstorrent Blackhole™ card is not enumerating?

Blackhole™ cards are designed to operate under PCI Express Gen 5.0, but we have seen instances where some motherboards set PCIe operation to "Auto" (usually by default) and the card does not enumerate. These issues are often resolved by manually forcing PCIe operation to Gen 4.0 or Gen 5.0 in BIOS.

Once you are able to enter an operating environment where the card has successfully enumerated, be sure to update to the latest firmware (instructions available on our [setup](https://docs.tenstorrent.com/getting-started/README.html) page).

### How can I demonstrate the networking ability of my Tenstorrent Blackhole™ cards? How can I test multiple cards together?

Setting up the Llama 3.1 8B model demo (instructions [here](https://github.com/tenstorrent/tt-metal/tree/main/models/tt_transformers)) is a useful way to test that your networked Blackhole™ cards are functioning as intended.