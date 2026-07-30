# Factory System Descriptor (FSD)

The Factory System Descriptor (FSD) is a file that records a multi-host
Tenstorrent system **as it was physically built**: which hosts make up the
system, where each host sits in the datacenter, which boards occupy which tray of
each host, and how those boards are cabled to each other.

Fabric Manager reads the FSD to learn what the system is *supposed* to look like.
Without it, Fabric Manager still reports the topology it discovers at runtime, but
it cannot tell you whether that matches the machine you bought.

This page covers what the FSD contains, how it is produced, and how it reaches
Fabric Manager in a Kubernetes deployment. If you are running a single-node or
non-scaleout system, you do not need an FSD.

## What an FSD contains

An FSD is a Protocol Buffers text file (`.textproto`) with three parts:

| Part | Records |
|---|---|
| `hosts` | Each host: hostname, motherboard, and physical location — `hall`, `aisle`, `rack`, `shelf_u`. Optionally an `instance_path`. |
| `board_types` | Which board type (for example `N300`) occupies which `tray_id` of which host. |
| `eth_connections` | Every Ethernet link as a pair of endpoints. An endpoint is a host, a tray, an ASIC location, and a channel. |

Abbreviated, an FSD reads like this:

```text
hosts {
  hostname: "host-01"
  hall: "hall-1"
  aisle: "A"
  rack: 1
  shelf_u: 32
}

board_types {
  board_locations {
    host_id: 1
    tray_id: 1
    board_type: "N300"
  }
}

eth_connections {
  connection {
    endpoint_a { host_id: 1  tray_id: 2  chan_id: 6 }
    endpoint_b { host_id: 8  tray_id: 2  chan_id: 6 }
  }
}
```

Host entries can also carry an `instance_path`: the chain of enclosures from the
root of the system down to that host, so hosts inside the same enclosure share a
path prefix. Fabric Manager uses it to recognise repeating hardware units — see
[Deriving topology shapes](#deriving-topology-shapes).

The schema is defined in tt-metal, which is authoritative for field names and
numbering. See [Going deeper](#going-deeper).

## What it is for

Fabric Manager works with two descriptions of the same hardware:

- The **Physical System Descriptor (PSD)** is discovered live. A Fabric Manager
  agent runs on every Tenstorrent node, enumerates the local devices and links,
  and reports them to the controller.
- The **Factory System Descriptor (FSD)** is the as-built record, read from a
  file. It describes the system as it was assembled and cabled.

Having both is the point. The PSD tells you what the cluster *is*; the FSD tells
you what it *should* be. Fabric Manager serves each of them, and a combined view,
through its topology API.

Supplying an FSD gets you:

- **Physical location for every host.** Hall, aisle, rack, and shelf cannot be
  read from the hardware. Only the FSD carries them, so only the FSD lets you turn
  a failing device into a rack elevation an engineer can walk to.
- **Expected cabling.** Because the FSD records the links the system was built
  with, a link that is missing at runtime is distinguishable from a link that was
  never meant to exist. This is what makes miscabling and dead links detectable
  rather than merely invisible.
- **Correct metric attribution.** Telemetry uses FSD-derived topology to attribute
  Ethernet metrics to the right tray, chip, and link. Without it, every Ethernet
  channel is monitored indiscriminately and redundant links can produce misleading
  link-failure metrics.
- **Topology shapes.** Named, addressable hardware units derived from host
  instance paths.

Without an FSD, Fabric Manager starts normally and serves discovered topology.
FSD-backed queries return a "not configured" error, and physical location data is
unavailable.

## FSD, MGD, and PGD

Several descriptors appear together in Fabric Manager configuration and are easy
to confuse. They describe different things and arrive by different routes.

| | Describes | Produced by | Consumed by |
|---|---|---|---|
| **FSD**<br>Factory System Descriptor | The system as physically built: hosts, their rack location, boards per tray, and the Ethernet cabling between them. | Generated from the cluster's cabling and deployment descriptors when the system is built or recabled. | The Fabric Manager controller, read from a configured path. Telemetry, for metric attribution. |
| **MGD**<br>Mesh Graph Descriptor | A *logical* mesh a workload wants: architecture, device dimensions, host dimensions, channel count. Refers to no real hardware. | The workload or the orchestrator submitting it. Generated from a cabling descriptor, or hand-written. | The Fabric Manager placement solver, passed in with each placement request rather than read from a file. |
| **PGD**<br>Physical Grouping Descriptor | The hierarchy of physical resources — meshes, pods, superpods, clusters — declared as allowed carve-outs over the flat PSD graph, without naming explicit ASIC IDs. | The cluster administrator, per hardware design. Tray orientation differs between board layouts. | The Fabric Manager placement solver, read from a configured path. |
| **PSD**<br>Physical System Descriptor | The flat graph of all ASICs and links actually present, discovered at runtime. | The Fabric Manager agents, from live device enumeration. | The Fabric Manager controller. |

The short version: the **FSD** is the inventory of what was built, the **PSD** is
what is actually there now, the **PGD** says which subsets of it are legal meshes,
and the **MGD** is the shape a job is asking for. Fabric Manager uses the first
three to satisfy the fourth.

```{mermaid}
flowchart LR
    FSD[FSD file<br/>as-built system] --> CTL[Fabric Manager<br/>controller]
    PGD[PGD file<br/>allowed groupings] --> CTL
    AG[Agents on each node<br/>live discovery] -->|PSD| CTL
    MGD[MGD<br/>requested mesh shape] -->|per request| CTL
    CTL -->|placement| WL[Workload]
    FSD --> TEL[Telemetry]
```

### Deriving topology shapes

When hosts carry an `instance_path`, Fabric Manager can group them into named
topology shapes. You supply a regular expression that matches one complete path
segment; every host whose path passes through a matching segment belongs to the
same instance of that shape:

```yaml
tt-fabric-manager:
  controller:
    supportedTopologyShapes:
      - canonical_name: 2x4
        aliases: [quad, 8-chip]
        instance_path_segment_pattern: '^example_node_[0-9]+$'
```

This is how a large system is reported as a set of addressable units rather than
one flat list of hosts.

```{note}
`supportedTopologyShapes` is not present in the Fabric Manager version that
tt-operator currently pins, so this setting has no effect on a default install.
Check the [Fabric Manager documentation](https://docs.tenstorrent.com/tt-fabric-manager/)
for the version you are running.
```

## How an FSD is generated

An FSD is **generated, not discovered**. No tool builds one by inspecting live
hardware, and you should not hand-edit one — it is a derived artifact. Two of its
three parts could not be discovered anyway: rack location and intended cabling are
facts about how the system was installed, not about the silicon.

The FSD is computed from two hand-maintained inputs:

| Input | Describes |
|---|---|
| **Cabling descriptor** | The logical topology — which port connects to which — described hierarchically so repeated wiring is expressed once. |
| **Deployment descriptor** | The physical placement of each host: hall, aisle, rack, shelf, and node type. Host order is significant. |

Both are usually derived from a **cutsheet**: the CSV cabling instruction sheet a
technician works from, one row per cable. You typically start from a standard
cutsheet for a supported topology and substitute your own hostnames and locations.

The generation flow is:

1. **Author or adapt the cutsheet** for your deployment.
2. **Produce the cabling and deployment descriptors.** The
   [tt-CableGen](https://github.com/tenstorrent/tt-CableGen) web tool imports a
   cutsheet and exports both descriptors, and can visualize the topology. It is
   self-hostable via its bundled Docker Compose setup.
3. **Generate the FSD** with `run_cabling_generator` from tt-metal, which takes
   the cabling and deployment descriptors and emits the FSD plus a cabling guide
   CSV. Point `--cabling` at a directory to merge several cabling files in one
   pass.
4. **Validate against the real hardware** with `run_cluster_validation`. It
   performs live discovery across the hosts and reports connections that the FSD
   expects but discovery did not find. This is the check *against* the FSD, not a
   source for it.
5. **Store and deliver.** Keep the descriptors in version control with schema
   validation, and deliver them to a stable path on every node.

Both tools are part of tt-metal and require a tt-metal build. See
[Going deeper](#going-deeper) for the source paths and their own documentation.

```{important}
For Tenstorrent-supplied clusters, the FSD is produced and maintained by
Tenstorrent as part of cluster integration and delivered with the cluster. If you
are bringing up a new cluster, obtain its FSD through your Tenstorrent support
contact rather than generating one yourself. The tooling above is public and
documents the process, but it is intended for whoever owns the physical build
record.
```

## How the cloud-native stack consumes it

Fabric Manager takes the FSD as a **file on a read-only volume**, never as
descriptor content embedded in a ConfigMap. Real FSDs for large systems exceed
1 MiB, which is past the Kubernetes ConfigMap size limit, so a volume is the only
workable source.

Two things have to line up:

1. A volume providing the descriptors, mounted read-only at the fixed in-pod path
   `/scaleout_configs`.
2. `controller.factorySystemDescriptorSearchPath`, naming the FSD *within* that
   mount. The controller's ConfigMap carries only this path — the pointer, not the
   descriptor bytes.

```{important}
`factorySystemDescriptorSearchPath` must be the **in-pod** path under
`/scaleout_configs`, not the host directory you mounted from. Setting the host
path is the most common misconfiguration and produces a "path not found" error.
```

Despite its name, the setting accepts either a single `.textproto` file or a
directory that is searched recursively. **Prefer naming a single file.** Files in
a directory that do not parse as an FSD are skipped silently, so a directory
holding other descriptors yields a confusing partial result instead of an error.

### Supplying the volume

Choose one of two sources.

**A host directory.** The chart default is `/data/scaleout_configs`. Place the
descriptors on each node and point the chart at the directory:

```yaml
tt-fabric-manager:
  enabled: true
  scaleoutConfigsHostPath: /data/scaleout_configs
  controller:
    factorySystemDescriptorSearchPath: /scaleout_configs/my-cluster/factory_system_descriptor.textproto
```

**An OCI image.** Package the descriptors into a container image and let
Kubernetes mount its filesystem directly. This keeps them versioned and pulled
like any other artifact, with nothing to stage on the nodes:

```yaml
tt-fabric-manager:
  enabled: true
  imagePullSecrets:
    - name: my-registry-pull-secret
  scaleoutConfigsImage: registry.example.com/my-org/my-cluster-config:v1.0.0
  controller:
    factorySystemDescriptorSearchPath: /scaleout_configs/my-cluster/factory_system_descriptor.textproto
```

Setting `scaleoutConfigsImage` overrides `scaleoutConfigsHostPath`. Image pulls
reuse the pod's `imagePullSecrets`, so a private registry needs that secret to
exist in the install namespace.

```{note}
The OCI image source uses the Kubernetes `image` volume type, available from
Kubernetes 1.33. On earlier versions use a host directory.
```

Both settings are optional and unset by default, so Fabric Manager installs and
runs without an FSD.

```{note}
The Physical Grouping Descriptor is configured separately via
`controller.physicalGroupingDescriptorPath`. It defaults to a descriptor shipped
inside the Fabric Manager image and is not read from your `/scaleout_configs`
mount, so do not conflate the two paths.
```

### Telemetry

Telemetry needs the same topology and takes it one of two ways. Pick exactly one —
the chart fails the render if both are configured.

**From Fabric Manager over gRPC.** Preferred, because there is one copy of the
FSD in the cluster:

```yaml
tt-telemetry:
  enabled: true
  config:
    fabric_manager_address: tt-fabric-manager-controller.tt-operator.svc.cluster.local:50052
```

**From local files**, using `systemDescriptors` with either `scaleoutConfigsDir`
or `scaleoutConfigsImage`, mirroring the Fabric Manager options above.

```{note}
Telemetry re-reads the FSD periodically and restarts itself when the content
changes, so that it picks up the new topology. Restarts after an FSD update are
expected. A stale or unreachable `fabric_manager_address` is worse than none at
all — leave it unset if Fabric Manager is disabled.
```

### Verify

Confirm the descriptors are visible inside the controller pod and that the
configured path resolves to something that exists:

```bash
kubectl -n tt-operator get configmap tt-fabric-manager-controller -o yaml

kubectl -n tt-operator exec deploy/tt-fabric-manager-controller -- \
  ls -R /scaleout_configs
```

The controller starts and serves discovered topology even when the path is wrong,
so check the path explicitly rather than relying on pod readiness. See
[Troubleshooting](https://docs.tenstorrent.com/tt-operator/latest/troubleshooting.html).

## Going deeper

The descriptor schemas and the generation tooling live in
[tt-metal](https://github.com/tenstorrent/tt-metal).

Schemas:

- [`factory_system_descriptor.proto`](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/factory_system_descriptor/schemas/factory_system_descriptor.proto)
  — the FSD.
- [`mesh_graph_descriptor.proto`](https://github.com/tenstorrent/tt-metal/blob/main/tt_metal/fabric/protobuf/mesh_graph_descriptor.proto)
  — the MGD.
- [`physical_grouping_descriptor.proto`](https://github.com/tenstorrent/tt-metal/blob/main/tt_metal/fabric/protobuf/physical_grouping_descriptor.proto)
  — the PGD, with a
  [written guide](https://github.com/tenstorrent/tt-metal/blob/main/tt_metal/fabric/PHYSICAL_GROUPING_DESCRIPTOR_README.md).
- [`physical_system_descriptor.proto`](https://github.com/tenstorrent/tt-metal/blob/main/tt_metal/fabric/protobuf/physical_system_descriptor.proto)
  — the PSD.
- [`cluster_config.proto`](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/cabling_descriptor/schemas/cluster_config.proto)
  and
  [`deployment.proto`](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/deployment_descriptor/schemas/deployment.proto)
  — the cabling and deployment descriptors an FSD is generated from.

Tooling:

- [Scaleout tools overview](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/README.md)
  — the descriptors and how they relate.
- [`run_cabling_generator`](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/src/run_cabling_generator.cpp)
  — generates an FSD and a cabling guide.
- [`run_cluster_validation`](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/validation/run_cluster_validation.cpp)
  — checks live hardware against an FSD.
- [tt-CableGen](https://github.com/tenstorrent/tt-CableGen) — visual cabling
  editor that imports cutsheets and exports descriptors.

Fabric Manager itself:

- [Fabric Manager documentation](https://docs.tenstorrent.com/tt-fabric-manager/)
- [Fabric Manager architecture](https://docs.tenstorrent.com/tt-fabric-manager/latest/architecture.html)
- [Fabric Manager API overview](https://docs.tenstorrent.com/tt-fabric-manager/latest/api-overview.html)

In the TT-Operator docs:

- [Configuration reference](https://docs.tenstorrent.com/tt-operator/latest/configuration.html)
  for the full set of Helm values.
- [Components](https://docs.tenstorrent.com/tt-operator/latest/components/index.html)
  for how Fabric Manager relates to the rest of the stack.
