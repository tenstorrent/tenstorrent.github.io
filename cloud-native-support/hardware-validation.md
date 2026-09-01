# Hardware Validation (Blackhole Galaxy)

Before a Blackhole Galaxy system is handed to a scheduler — Kubernetes or
otherwise — you want evidence that the hardware is sound: every chip
enumerates, memory has trained, Ethernet links come up, and the cabling
matches the plan. [tt-metal](https://github.com/tenstorrent/tt-metal) ships
the tooling for this at two levels:

- The **single-host health check** validates one Galaxy host in isolation:
  a telemetry snapshot, a reset-stability loop, and on-device Ethernet and
  DRAM tests, summarized in one JSON report.
- **Multi-host physical validation** validates an assembled cluster: live
  cabling discovery against the as-built descriptors, then multi-host
  dispatch and fabric tests run across all hosts over MPI.

On a Kubernetes cluster, validation is part of the **node lifecycle**. A host
is validated at bring-up, before the cloud-native stack claims it; a node
suspected bad is cordoned, drained, revalidated, and uncordoned on a pass.
Once nodes are in service, [Fabric Manager](https://docs.tenstorrent.com/tt-fabric-manager/)
takes over the *continuous* side of the same job — comparing the topology it
discovers live against the as-built record (see
[Factory System Descriptor](factory-system-descriptor.md)) — so the one-shot
tools below are for bring-up, hardware changes, and incident response rather
than steady-state monitoring.

| Situation | Run |
|---|---|
| A new Galaxy host arrives | Single-host health check, `light` tier |
| A host is about to enter service | Single-host health check, `deploy` tier |
| A multi-host cluster was assembled or recabled | Multi-host physical validation |
| A node in service is suspected bad | Cordon and drain it, then the single-host health check |
| Cabling drift on a running cluster | Fabric Manager, continuously — see the [FSD guide](factory-system-descriptor.md) |

## Single-host health check

The health check suite lives in tt-metal under
[`tools/scaleout/exabox/health_check_test_suite/`](https://github.com/tenstorrent/tt-metal/tree/main/tools/scaleout/exabox/health_check_test_suite).
It captures a `tt-smi` snapshot, decodes per-chip telemetry, runs a reset
loop, and invokes the on-device deployment tests. The result is a single JSON
report with per-check `PASS`/`WARN`/`FAIL`/`SKIP` status grouped by chip, and
an exit code of `1` on any `FAIL` (`0` on `PASS`/`WARN`).

```{important}
The health check **resets the devices** — `tt-smi -r` on every tier, plus
Galaxy-level resets on the higher tiers. Do not run it on a host with live
workloads. Use `--skip-reset --skip-tests` for a read-only snapshot check.
```

### Prerequisites

- A Blackhole Galaxy host with the kernel driver and firmware installed and
  `tt-smi` on the `PATH` (or pass `--tt-smi-path`).
- A tt-metal checkout with the test binaries built. The deployment-test
  binary is not in the default build target list:

  ```bash
  ./build_metal.sh --build-tests
  # or, after configure:
  ninja -C build_Release unit_tests_deployment
  ```

### Running it

```bash
export TT_METAL_HOME=/path/to/tt-metal
cd $TT_METAL_HOME

# Light tier: snapshot + one reset + Ethernet link-up test (~75 s)
./tools/scaleout/exabox/health_check_test_suite/run_diag.sh light

# Snapshot-only smoke check — no resets, no on-device tests
./tools/scaleout/exabox/health_check_test_suite/run_diag.sh light --skip-reset --skip-tests
```

The report is written to `./diag_report.json` by default, and per-test logs
to `./logs/<test>.log`.

Three tiers trade time for coverage:

| Tier | Resets | On-device tests | Duration | Use when |
|---|---|---|---|---|
| `light` | `tt-smi -r` × 1 | Ethernet link-up | ~75 s | Smoke check on every new unit |
| `medium` | `tt-smi -r`, Galaxy reset | Ethernet link-up + bandwidth, fast DRAM test | ~5 min | Pre-deployment validation |
| `deploy` | `tt-smi -r`, Galaxy reset × 2 | Ethernet link-up + bandwidth, full DRAM matrix | ~15 min | Final deploy gate |

The most useful flags:

| Flag | Purpose |
|---|---|
| `--tier {light,medium,deploy}` | Selects the reset cadence and test matrix (required) |
| `--skip-reset` / `--skip-tests` | Skip the reset loop / the on-device test phase |
| `--dry-run` | Print the intended commands; skip everything destructive |
| `--input-snapshot PATH` | Analyze a stored `tt-smi` snapshot instead of taking one |
| `--output PATH` | Report destination (default `./diag_report.json`) |
| `--tt-metal-path PATH` | tt-metal repo root (defaults to `$TT_METAL_HOME`) |
| `--tt-smi-path PATH` | Override the `tt-smi` binary |

### Running it as a Kubernetes Job

On a cluster managed by
[tt-operator](https://docs.tenstorrent.com/tt-operator/), the health check
can run as a Job instead of over SSH, using the same public image the
[Device Allocation](https://docs.tenstorrent.com/tt-dra-driver/) docs use for
workloads — `ghcr.io/tenstorrent/tt-metal/upstream-tests-bh` ships the
tt-metal tree with the test binaries built at `/home/user/tt-metal`.

Because the check resets the devices, take the node out of service first:

```bash
kubectl cordon <node>
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
```

Then run the Job pinned to that node. Nodes with Tenstorrent hardware carry
the `tenstorrent.com/device.present: "true"` label (published by
[Node Feature Discovery](https://docs.tenstorrent.com/tt-operator/latest/components/node-feature-discovery.html)),
but for a health check you target one node by name and tolerate the cordon:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: health-check
spec:
  backoffLimit: 0
  template:
    spec:
      restartPolicy: Never
      nodeName: <node>
      tolerations:
        - key: node.kubernetes.io/unschedulable
          operator: Exists
          effect: NoSchedule
      containers:
        - name: diag
          image: ghcr.io/tenstorrent/tt-metal/upstream-tests-bh:<tag>
          workingDir: /home/user/tt-metal
          command: ["/bin/bash", "-c"]
          args:
            - |
              ./tools/scaleout/exabox/health_check_test_suite/run_diag.sh light \
                --output /tmp/diag_report.json
              status=$?
              cat /tmp/diag_report.json
              exit $status
          env:
            - name: TT_METAL_HOME
              value: /home/user/tt-metal
          securityContext:
            privileged: true
          volumeMounts:
            - name: dev
              mountPath: /dev
      volumes:
        - name: dev
          hostPath:
            path: /dev
```

The Job's exit status follows the suite's (`0` on `PASS`/`WARN`, `1` on
`FAIL`), so `kubectl wait --for=condition=complete job/health-check` doubles
as the gate, and the report is in the pod log:

```bash
kubectl logs job/health-check | tail -1 | jq .
kubectl uncordon <node>   # on a pass
```

```{note}
The pod is privileged with `/dev` from the host because the reset loop
(`tt-smi -r`, Galaxy resets) needs raw device access, and on a drained node
there is nothing to protect the devices *from*. A
[DRA ResourceClaim](https://docs.tenstorrent.com/tt-dra-driver/) is the right
way for ordinary workloads to obtain devices, but claims are designed for
sharing a schedulable node — not for a diagnostic that resets every chip.
Verify that `tt-smi` is present in the image tag you use, or install it in a
derived image and point `--tt-smi-path` at it.
```

### What it checks

The snapshot phase evaluates check groups per chip; the test phase then runs
the selected on-device tests:

| Group | Verifies |
|---|---|
| Board | All chips report one known board revision. The detected revision sets the expected GDDR speed and PCIe generation for the checks below. |
| PCIe | All 32 chips enumerate; lane width matches position; host-facing chips trained to the revision's expected PCIe generation. |
| GDDR | DRAM status good on every chip; all 256 channels trained and BIST-passed; speed matches the revision. |
| Ethernet | Every enabled internal port reports a live link. |
| ASIC | Every tray reports its full set of ASICs; each chip's physical position matches what its firmware reports. |
| Firmware | Firmware versions are consistent across all chips (inconsistency is a `WARN`, not a `FAIL`). |

Two output states deserve a note:

- `WARN` means the host works but something is off-spec — the common example
  is a host-facing chip training down to PCIe Gen1. Worth investigating, but
  the exit code stays `0`.
- `SKIP` usually means the running `tt-smi` or firmware version does not
  expose the field a check needs (for example, live Ethernet status requires
  firmware bundle ≥ 19.9). A skipped check is a capability gap, not a pass.

For the check-by-check rules, the JSON report schema, and known issues, see
[HEALTH_CHECK.md](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/exabox/health_check_test_suite/HEALTH_CHECK.md)
in tt-metal — it is the authoritative reference for this suite.

## Multi-host physical validation

Once individual hosts are healthy, validate the assembled cluster. The
sequence below mirrors what Tenstorrent runs when qualifying a multi-host
Blackhole Galaxy system: confirm MPI wiring, check the physical cabling
against the as-built descriptors, exercise the runtime's own discovery, then
run multi-host dispatch and fabric traffic tests.

### Prerequisites

- **The same tt-metal build on every host, at the same path**, including the
  test binaries. A container image built from tt-metal is the usual way to
  guarantee this.
- **MPI across the hosts.** tt-metal's multi-host tests use OpenMPI (the
  ULFM-enabled build, for fault tolerance) with passwordless SSH between
  hosts. A hostfile lists one line per host:

  ```text
  host-1 slots=1
  host-2 slots=1
  host-3 slots=1
  host-4 slots=1
  ```

- **The cluster's cabling and deployment descriptors** at a common path on
  every host — the same descriptors the
  [Factory System Descriptor](factory-system-descriptor.md) is generated
  from. The convention is a shared `/data/scaleout_configs` directory.
- **Environment.** Export these on every host (with `mpirun`, forward them
  using `-x`):

  ```bash
  export TT_METAL_RUNTIME_ROOT=/path/to/tt-metal
  export LD_LIBRARY_PATH=$TT_METAL_RUNTIME_ROOT/build/lib
  export TT_METAL_CACHE=$HOME/.cache
  # Keep MPI off container and loopback interfaces:
  export OMPI_MCA_btl_tcp_if_exclude=docker0,lo
  ```

```{note}
The binary and test-config paths below are build-tree paths and move between
tt-metal versions. Verify them against the tt-metal version you are running
before scripting anything.
```

### 1. Confirm MPI reaches every host

```bash
mpirun --hostfile hostfile --pernode --tag-output hostname
```

Every host should print its hostname exactly once, each line prefixed with
the rank that produced it. Fix SSH or MPI problems before going further —
every later step launches the same way.

### 2. Validate cabling against the descriptors

`run_cluster_validation` performs live Ethernet discovery on every host and
compares what it finds against the cabling and deployment descriptors — the
plan the cluster was built to:

```bash
mpirun --hostfile hostfile --pernode --tag-output \
  -x LD_LIBRARY_PATH -x TT_METAL_RUNTIME_ROOT \
  $TT_METAL_RUNTIME_ROOT/build/tools/scaleout/run_cluster_validation \
    --cabling-descriptor-path /data/scaleout_configs/<your-cluster>/cabling_descriptor.textproto \
    --deployment-descriptor-path /data/scaleout_configs/<your-cluster>/deployment_descriptor.textproto \
    --num-iterations 5
```

Links that the descriptors expect but discovery cannot find are reported —
this is what makes a miscabled or dead link visible rather than silently
absent. `--cabling-descriptor-path` also accepts a directory of `.textproto`
files, which are merged.

Options worth knowing:

| Flag | Purpose |
|---|---|
| `--print-connectivity` | Print the discovered ASIC-to-ASIC connectivity |
| `--send-traffic` | Push traffic across detected links; `--num-iterations` sets how many rounds |
| `--hard-fail` | Treat warnings as failures |
| `--log-ethernet-metrics` | Log live Ethernet statistics |
| `link_reset` (subcommand) | Retrain one specific link by host, tray, ASIC location, and channel |

This is the same tool referenced in the FSD generation flow — see
[Factory System Descriptor](factory-system-descriptor.md) for how the
descriptors it reads are produced and maintained.

### 3. Exercise runtime discovery

Where step 2 checks the cables against the plan, this gtest checks that the
tt-metal runtime itself can discover the cluster — building the physical
system descriptor across all hosts:

```bash
mpirun --hostfile hostfile --pernode --tag-output \
  -x LD_LIBRARY_PATH -x TT_METAL_RUNTIME_ROOT \
  $TT_METAL_RUNTIME_ROOT/build/test/tt_metal/tt_fabric/test_physical_discovery
```

### 4. Run multi-host dispatch tests

The remaining stages launch with
[`tt-run`](https://github.com/tenstorrent/tt-metal/blob/main/ttnn/ttnn/distributed/README_ttrun.md),
tt-metal's MPI launcher, which maps MPI ranks onto the logical mesh via a
rank-bindings file. The simplest way to obtain rank bindings is tt-run's auto
allocation mode (`-m <mesh-graph-descriptor> --hosts host-1,host-2,...`),
which generates and caches them for you; the commands below pass a generated
or hand-maintained file explicitly.

```bash
tt-run --rank-binding rank_bindings.yaml \
  --mpi-args "--tag-output --host host-1,host-2,host-3,host-4" \
  $TT_METAL_RUNTIME_ROOT/build/test/tt_metal/unit_tests_dispatch \
  --gtest_filter="\
UnitMeshCQProgramFixture.TensixTestRandomizedProgram:\
UnitMeshRandomProgramFixture.TensixTestLargeProgramInBetweenFiveSmallPrograms:\
UnitMeshRandomProgramTraceFixture.TensixTestLargeProgramInBetweenFiveSmallProgramsTrace:\
UnitMeshRandomProgramTraceFixture.TensixTestSimpleProgramsTrace:\
UnitMeshCQTraceFixture.TensixEnqueueMultiProgramTraceBenchmark:\
UnitMeshCQTraceFixture.TensixEnqueueTwoProgramTrace:\
UnitMeshCQSingleCardBufferFixture.ShardedBufferLargeL1ReadWrites:\
UnitMeshCQSingleCardBufferFixture.ShardedBufferLargeDRAMReadWrites:\
UnitMeshCQSingleCardFixture.TensixTestSubDeviceAllocations:\
UnitMeshMultiCQMultiDeviceEventFixture.*:\
UnitMeshCQSingleCardFixture.TensixTestReadWriteMultipleCoresL1"
```

This filter set exercises program dispatch, trace capture and replay, and
sharded buffer reads and writes across the mesh — a representative dispatch
workload rather than the full (much longer) suite.

### 5. Run fabric traffic tests

Finally, push routed traffic through the fabric itself:

```bash
tt-run --rank-binding rank_bindings.yaml \
  --mpi-args "--tag-output --host host-1,host-2,host-3,host-4" \
  $TT_METAL_RUNTIME_ROOT/build/test/tt_metal/perf_microbenchmark/routing/test_tt_fabric \
    --test_config <path-to-fabric-test-config>.yaml
```

The `--test_config` YAML selects traffic patterns for a given topology; the
tt-metal tree ships configurations for its supported topologies (for a
four-host Blackhole Galaxy cluster, the short-running 2D-torus configuration
is the usual qualification choice). Pick the one matching your cluster's
topology from the tt-metal version you are running.

### Pass criteria

Every stage exits non-zero on failure, so the sequence is scriptable as a
simple chain. With `--tag-output`, each output line is prefixed by the rank
that produced it, which is what lets you attribute a failure to a host —
combined with the FSD, to a rack position.

### Running validation as a JobSet

On a Kubernetes cluster, the mpirun-over-SSH launch above has a native
equivalent:
[Multi-Node Scheduling](https://docs.tenstorrent.com/tt-operator/latest/components/multi-node.html)
pairs **JobSet** (one object that creates, co-schedules, and cleans up the
whole multi-node run) with the **kubepmix** webhook, which injects PMIx
wiring into pods labeled `kubepmix.dev/enabled: "true"`. Each pod then runs
one rank directly — there is no `mpirun` and no SSH; the injected PMIx
environment is what lets the ranks find each other.

```{important}
The Multi-Node Scheduling docs describe end-to-end co-scheduled runs as
**maturing**, and no upstream worked example exists yet. Treat this recipe as
a starting point to validate on a non-production cluster; the mpirun sequence
above is the proven path today.
```

The cabling-validation stage as a JobSet, one rank on each of four Galaxy
hosts, with the descriptors mounted the same way the
[FSD guide](factory-system-descriptor.md) delivers them to Fabric Manager:

```yaml
apiVersion: jobset.x-k8s.io/v1alpha2
kind: JobSet
metadata:
  name: cluster-validation
spec:
  replicatedJobs:
    - name: rank
      template:
        spec:
          completionMode: Indexed
          completions: 4        # one rank per host
          parallelism: 4
          backoffLimit: 0
          template:
            metadata:
              labels:
                kubepmix.dev/enabled: "true"   # opt in to PMIx injection
            spec:
              restartPolicy: Never
              nodeSelector:
                tenstorrent.com/device.present: "true"
              affinity:
                podAntiAffinity:               # spread ranks across hosts
                  requiredDuringSchedulingIgnoredDuringExecution:
                    - topologyKey: kubernetes.io/hostname
                      labelSelector:
                        matchLabels:
                          jobset.sigs.k8s.io/jobset-name: cluster-validation
              containers:
                - name: rank
                  image: ghcr.io/tenstorrent/tt-metal/upstream-tests-bh:<tag>
                  command:
                    - /home/user/tt-metal/build/tools/scaleout/run_cluster_validation
                    - --cabling-descriptor-path
                    - /scaleout_configs/<your-cluster>/cabling_descriptor.textproto
                    - --deployment-descriptor-path
                    - /scaleout_configs/<your-cluster>/deployment_descriptor.textproto
                    - --num-iterations
                    - "5"
                  env:
                    - name: TT_METAL_RUNTIME_ROOT
                      value: /home/user/tt-metal
                    - name: LD_LIBRARY_PATH
                      value: /home/user/tt-metal/build/lib
                  securityContext:
                    privileged: true
                  volumeMounts:
                    - name: dev
                      mountPath: /dev
                    - name: scaleout-configs
                      mountPath: /scaleout_configs
                      readOnly: true
              volumes:
                - name: dev
                  hostPath:
                    path: /dev
                - name: scaleout-configs
                  hostPath:
                    path: /data/scaleout_configs
```

```bash
kubectl apply -f cluster-validation.yaml
kubectl wait --for=condition=Completed jobset/cluster-validation --timeout=15m
kubectl logs -l jobset.sigs.k8s.io/jobset-name=cluster-validation --prefix
```

The same pattern fits the physical-discovery stage — swap the command for
`test_physical_discovery`. The pods are privileged with host `/dev` for the
same reason as the single-host Job: validation needs raw access to every
device on the node, so run it on drained nodes, not alongside workloads. The
`tt-run` stages (dispatch and fabric tests) additionally need per-rank mesh
bindings that `tt-run` normally computes; keep those on the mpirun path until
the JobSet flow matures.

## Going deeper

Single-host suite:

- [HEALTH_CHECK.md](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/exabox/health_check_test_suite/HEALTH_CHECK.md)
  — authoritative check-by-check reference, report schema, and known issues.

Multi-host tooling, all in tt-metal:

- [Scaleout tools overview](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/README.md)
  — the descriptors and how they relate.
- [Validation README](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/validation/README.md)
  — multi-node cluster setup, hostfiles, and rankfiles.
- [tt-run README](https://github.com/tenstorrent/tt-metal/blob/main/ttnn/ttnn/distributed/README_ttrun.md)
  — auto allocation mode, rank bindings, and MPI argument passing.
- [generate_rank_bindings README](https://github.com/tenstorrent/tt-metal/blob/main/tools/scaleout/README_generate_rank_bindings.md)
  — how rank bindings are produced.
- [Multi-host test README](https://github.com/tenstorrent/tt-metal/blob/main/tests/tt_metal/multihost/README.md)
  — the OpenMPI/ULFM setup the multi-host tests assume.

On Kubernetes:

- [Multi-Node Scheduling](https://docs.tenstorrent.com/tt-operator/latest/components/multi-node.html)
  — JobSet and kubepmix, and how to verify they are installed.
- [Device Allocation (tt-dra-driver)](https://docs.tenstorrent.com/tt-dra-driver/)
  — how ordinary workloads claim Tenstorrent devices.
- [Node Feature Discovery](https://docs.tenstorrent.com/tt-operator/latest/components/node-feature-discovery.html)
  — the `tenstorrent.com/*` node labels used to target nodes.
- [JobSet](https://github.com/kubernetes-sigs/jobset) — the upstream API the
  multi-node recipe uses.

On this site:

- [Factory System Descriptor (FSD)](factory-system-descriptor.md) — how the
  cabling and deployment descriptors become the as-built record, and how the
  Kubernetes stack consumes it.
