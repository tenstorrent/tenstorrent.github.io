# Cloud-Native Support

Run Tenstorrent accelerators on Kubernetes. `tt-operator` is the umbrella Helm
chart that installs and coordinates the components below. Each component
maintains and publishes its own documentation; follow a link to get started.

```{toctree}
:hidden:

TT-Operator <https://docs.tenstorrent.com/tt-operator/>
Node Feature Discovery <https://docs.tenstorrent.com/tt-operator/components/node-feature-discovery.html>
Driver Manager <https://docs.tenstorrent.com/tt-k8s-driver-manager/>
Firmware <https://docs.tenstorrent.com/tt-k8s-driver-manager/firmware.html>
Telemetry <https://docs.tenstorrent.com/tt-telemetry/>
Fabric Manager (beta) <https://docs.tenstorrent.com/tt-fabric-manager/>
Device Allocation (beta) <https://docs.tenstorrent.com/tt-dra-driver/>
Multi-Node Scheduling (beta) <https://docs.tenstorrent.com/tt-operator/components/multi-node.html>
```

## Get started

- **[TT-Operator](https://docs.tenstorrent.com/tt-operator/)** — the umbrella
  Helm chart. Install, configure, and operate Tenstorrent devices on Kubernetes.

## Components

- **[Node Feature Discovery](https://docs.tenstorrent.com/tt-operator/components/node-feature-discovery.html)**
  — labels nodes that have Tenstorrent devices.
- **[Driver Manager](https://docs.tenstorrent.com/tt-k8s-driver-manager/)** —
  installs, upgrades, and scopes the kernel-mode driver (`tt-kmd`) via policy.
- **[Firmware](https://docs.tenstorrent.com/tt-k8s-driver-manager/firmware.html)**
  — flashes device firmware via a policy resource.
- **[Telemetry](https://docs.tenstorrent.com/tt-telemetry/)** — exposes a
  Prometheus `/metrics` endpoint for Tenstorrent devices.

## Beta

```{attention}
The components below are installed by default and usable for evaluation. Some
capabilities are still maturing and may change.
```

- **[Fabric Manager](https://docs.tenstorrent.com/tt-fabric-manager/)** —
  resolves fabric topology across devices and hosts.
- **[Device Allocation](https://docs.tenstorrent.com/tt-dra-driver/)** —
  publishes devices as schedulable resources (Dynamic Resource Allocation).
- **[Multi-Node Scheduling](https://docs.tenstorrent.com/tt-operator/components/multi-node.html)**
  — JobSet and PMIx wiring for multi-node jobs.
