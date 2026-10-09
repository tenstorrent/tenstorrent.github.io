---
myst:
  html_meta:
    product-name: Blackhole® p150a, Blackhole® p150b, Tenstorrent
    technology-concepts: QSFP-DD, mesh, PCIe, cabling, topology
    document-type: how-to
---

# Multi-Card Topologies

The Blackhole® p150a and p150b each have four passive QSFP-DD 800G ports. Cabling those ports to other Blackhole® cards builds a mesh in which the cards exchange data directly, without going through the host's PCIe bus. This page covers Tenstorrent-validated 2-, 4-, and 8-card configurations, recommended cables, and how to check the result.

:::{note}
The p100a has no card-to-card ports and cannot join a mesh.
:::

:::{important}
The QSFP-DD ports connect only to other Blackhole®-based cards. They are not standard Ethernet ports and do not connect to switches or network adapters.
:::

## Validated Configurations

Do not treat every configuration as a fully populated mesh. A card has four ports, but the validated systems use only as many as their topology needs.

| Cards | Card Type                  | Topology    | External Cables        | Reference System                                                                 |
| ----- | -------------------------- | ----------- | ---------------------- | -------------------------------------------------------------------------------- |
| 2     | p150a                      | 2-card mesh | [See Two Cards](#two-cards) | Two-card desktop configuration                                                |
| 4     | Blackhole (p150 family)    | 4-card mesh | 8                      | [TT-QuietBox (Blackhole)](../../systems/quietbox/quietbox-bh/index.md#step-2-setting-up-the-hardware) |
| 8     | p150b                      | 2×4 mesh    | 10                     | [TT-LoudBox (Blackhole)](../../systems/loudbox-bh/setup.md#step-3-setting-up-the-mesh-topology-single-server) |

:::{note}
The p150a and p150b are the Blackhole® variants documented for multi-card operation. The p150a is intended for actively cooled desktop systems, and the p150b requires forced-air rack cooling. Mixing p150a and p150b cards in one mesh is not a documented configuration.
:::

## Before You Cable

1. Confirm every card enumerates before you add cables. With the host powered on and no card-to-card cables connected, run `lspci -d 1e52:` and check that you see one entry per card. This separates PCIe problems from cabling problems.
2. Power off the host before connecting or disconnecting cables. After cabling, power back on and confirm the cards still enumerate.
3. Check case or rack clearance. The connectors face out of the bracket. Leave room behind the slots to route cables without sharp bends. See [Choosing Host Hardware](host-hardware.md#rear-clearance-for-qsfp-dd-cabling) for more details on ensuring clearance for mesh cables.
4. Number the cards and ports using the convention below, and label your cables before routing them.

## Cables

For standard short-reach setups, use validated 0.5 m passive QSFP-DD 800G cables, available from the [Tenstorrent store](https://tenstorrent.com/hardware/cards). If you need more reach, these 1 m passive QSFP-DD 800G cables are recommended: [Amphenol SF-NJYYEK0001-001M](https://cablesondemand.com/qsfp-dd-direct-attach-cables-200g-400g-800g-dac-1/amphenol-sf-njyyek0001-001m-1m-3-3-800g-qsfp-dd-112g-cable-800-gigabit-ethernet-passive-direct-attach-qsfp-double-density-112g-cable-dual-entry-32-awg-qsfp-dd-112g-to-qsfp-dd-112g-sf-njyyek0001-001m) or [FS QDD-800G-PC01](https://www.fs.com/products/154259.html?attribute=36923&id=3720628).

:::{important}
Use only passive QSFP-DD cables.
:::

## Port and Card Numbering

On p150a and p150b systems, Port 1 is the top connector, furthest from the motherboard, and Port 4 is the bottom connector, closest to the motherboard. In a rackmount system, number the cards from left to right, starting with Card 1 (or Tray 1).

![](./images/bh_portspec.png)

*p150b pictured; the p150a has the same ports. Port 1 is the top connector.*

The diagrams on this page label cards C1, C2, and so on.

## Two Cards

A two-card mesh connects both cards directly to each other.

```text
   +--------+                       +--------+
   |   C1   |<=== cables: TBD ====> |   C2   |
   +--------+                       +--------+
```

| Cable | From         | To           |
| ----- | ------------ | ------------ |
| TBD   | C1 port TBD  | C2 port TBD  |

## Four Cards

For a system with four cards, best results can be achieved by using eight external QSFP-DD cables for the mesh. Connect the cables according to the topology diagram in the [TT-QuietBox (Blackhole) setup guide](../../systems/quietbox/quietbox-bh/index.md#step-2-setting-up-the-hardware). Each cable should click into place; do not force a connection.

Eight cables use 16 of the 16 ports on four cards: every port is cabled.

## Eight Cards

For a system with eight cards use a 2×4 mesh topology. The [single-server setup guide](../../systems/loudbox-bh/setup.md#step-3-setting-up-the-mesh-topology-single-server) specifies 10 passive QSFP-DD 800G 0.5 m cables and provides the 2×4 mesh topology diagram.

:::{note}
An eight-card system has 32 ports, but the validated LoudBox configuration uses 10 cables, not a fully populated 16-cable mesh. Follow the setup guide's diagram rather than cabling every port.
:::

An eight-card mesh requires p150b cards in a rack-mounted server with forced-air cooling. See {doc}`Choosing Host Hardware <host-hardware>`.

## Verify the Topology

For a single host, run the following command to ensure every card enumerates:

```bash
lspci -d 1e52:
```

You should see one `Tenstorrent Inc Blackhole` entry per card.

For multi-node or descriptor-backed topology validation, use [`run_cluster_validation`](https://docs.tenstorrent.com/cloud-native-support/hardware-validation.html) with the expected cabling and deployment descriptors. The tool can print physical connectivity, send traffic across the detected links, and report missing or unhealthy connections.

As a functional check, run a multi-card workload such as the Llama 3.1 8B demo in [TT-Transformers](https://github.com/tenstorrent/tt-metal/tree/main/models/tt_transformers).

## Troubleshooting

### A card is missing from `lspci`

This is a PCIe problem, not a cabling problem. See [FAQ and Troubleshooting](faq.md#my-card-is-not-enumerating).

### Cards enumerate but the multi-card demo fails or is slow

Power off, reseat each cable until it clicks, and compare your wiring with the diagram for your system. Two swapped cables can leave the mesh looking connected but routing incorrectly.

### A cable will not seat or is under tension

Case clearance is too small or the cable is too short. Do not force it. See [Choosing Host Hardware](host-hardware.md#rear-clearance-for-qsfp-dd-cabling).

## Related pages

* {doc}`Choosing Host Hardware <host-hardware>`
* [TT-Topology](https://github.com/tenstorrent/tt-topology)
* {doc}`TT-QuietBox (Blackhole) </systems/quietbox/quietbox-bh/index>`
* {doc}`TT-LoudBox (Blackhole) </systems/loudbox-bh/index>`
