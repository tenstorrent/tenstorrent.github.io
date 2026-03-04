---
myst:
  html_meta:
    product-name: TT-LoudBox Blackhole
    technology-concepts: Configuration, hardware
    document-type: Reference
---

# Topology Configurations for Multiple Servers

This page details multi-server mesh topology configuration options for the TT-LoudBox (Blackhole).

For full site requirements and setup instructions, refer to the [Setup Guide](./setup.md).

### Clarifications on Notation
For Blackhole P150 systems our convention is to enumerate our ports per card as shown below; top (furthest from motherboard) as “Port 1” and bottom (closest to motherboard) as “Port 4”. 

:::{figure} bh-lb-qsfp-key.png
:width: 60%
:::

When arranged in the Rack-Mounted box the left-most Card is referred to as “Board/Tray/Card” 1, numbered consecutively till 8 at the right.

## Two Servers (4x4 Mesh)

Cabling Guide — Table of Connections  
*Includes same single host connections as above with additions to connect them.*

| Source Hostname | Source Tray | Source Port | Destination Hostname | Destination Tray | Destination Port | Cable Type |
| --- | --- | --- | --- | --- | --- | --- |
| host_0 | 5 | 2 | host_1 | 1 | 1 | |
| host_0 | 6 | 2 | host_1 | 2 | 1 | |
| host_0 | 7 | 2 | host_1 | 3 | 1 | |
| host_0 | 8 | 2 | host_1 | 4 | 1 | |

:::{figure} bh-lb-4x4-topology.jpg
:width: 60%
:::

## Four Servers (8x4 Mesh)

*Includes 2 2x host connections as above with additions to connect between them.*

| Source Hostname | Source Tray | Source Port | Destination Hostname | Destination Tray | Destination Port | Cable Type |
| --- | --- | --- | --- | --- | --- | --- |
| host_0 | 4 | 3 | host_2 | 1 | 4 | |
| host_0 | 8 | 3 | host_2 | 5 | 4 | |
| host_1 | 4 | 3 | host_3 | 1 | 4 | |
| host_1 | 8 | 3 | host_3 | 5 | 4 | |

:::{figure} bh-lb-8x4-topology.jpg
:width: 40%
:::

## Software Descriptors

### Deployment Descriptor

The Deployment Descriptor defines deployment-specific characteristics of a multi-host system.
It includes node type and hostname specifications, which enable validation to ensure that the deployed or connected system matches the intended configuration.
In addition, the descriptor provides fields relevant to server and rack deployments, such as data center hall, aisle, rack, and shelf identifiers, supporting organized and traceable system management.

Save the below code-block as template deployment. Make sure to edit as necessary for your hostnames.

```text
# .textproto: Descriptors of deployment characteristics of system
#   host: fields to be updated whenever hostnames in deployment are updated
hosts {
  node_type: "P150_LB"
  host: "host_0"
}
hosts {
  node_type: "P150_LB"
  host: "host_1"
}
hosts {
  node_type: "P150_LB"
  host: "host_2"
}
hosts {
  node_type: "P150_LB"
  host: "host_3"
}
```

### Factory System Descriptor (FSD)

The Factory System Descriptor (FSD) defines the complete expected connectivity of a system.
It extends beyond external cabling to include on-board ASIC interconnects and in-box connections, providing a comprehensive view of the system’s intended topology.
The FSD serves as a reference model against which actual cabling and hardware configurations can be validated during deployment or maintenance.

To generate the FSD: 

```bash
# After pulling tt-metal repo (follow instructions from repo), in the repo run below commands from root of repo
./build_metal.sh

# Below command consumes Cabling Descriptor and Deployment Descriptor specified above and outputs:
#	- FSD (Factory System Descriptor): A Descriptor that enumerates full expected connectivity of system
#	- Cabling Guide: A CSV file that lists out the ethernet cabling list of connections in table format
#	- Both will be located at: ./out/scaleout/_
./build/tools/scaleout/run_cabling_generator -c cabling.textproto -d deployment.textproto
```

## Setting up Multi-Node Communication and Validating Cluster State

As part of the Scale-Out software suite, Tenstorrent provides tools to validate cluster setup and physical cabling.

The Cluster Validation Tool performs the following steps:

* Discovery: Identifies all chips and Ethernet links in the multi-node setup.
* State Comparison: Compares the discovered state against the expected state defined in the Factory System Descriptor (FSD).
* Traffic Verification: Sends point-to-point traffic over all discovered Ethernet links to verify cable and port health.

Note: To run multi-node cluster validation, both hosts must be able to communicate via SSH. Control traffic between hosts is sent over the data-center network, which relies on SSH connectivity.

To enable this Cross-Host communication:

```bash
# Log on to both hosts and generate ssh keys
ssh-keygen

# Exchange SSH Keys Between all hosts
# On host 0
ssh-copy-id username@hostname1
# On host 1
ssh-copy-id username@hostname0
...

# Verify that passwordless ssh works (should not need a password to ssh from each host to its peer)

# On host 0
ssh hostname1
# On host 1
ssh hostname0
...

# Clone (follow instructions from repo) and build the TT-Metal source code. Please note that the repo installed must be built on both hosts. This can either be done through a shared filesystem or by synchronizing your build state.
./build_metal.sh --build-tests

# Create a hostfile for MPI (distributed process launcher to use)
# A host file includes the hostnames/IP Addresses you want the distributed process to target and looks something like this

hostname0 slots=1
hostname1 slots=1
...

# Verify that MPI works as expected by running the command below from one of the hosts in the cluster. You should see both hostnames printed
mpirun --hostfile path/to/hostfile hostname

# If the mpirun command hangs, this is likely either due to networking constraints between the hosts. For debug, execute mpirun in verbose mode or try binding all traffic to a specific port.
```

Once TT-Metal is built and a distributed process can be launched on both hosts, the cluster validation workload can be executed.

For this, we use `tt-run`, a distributed process launcher built on top of MPI.
`tt-run` requires a *rank binding file, which is specific to the cluster topology. 

For the topology described in this document, the corresponding file is already included in the TT-Metal repository.

```bash
# Build your Python Environment inside the TT-Metal repo (this needs to be done once)
./create_venv.sh
# Activate your Python Environment
source python_env/bin/activate

# Ensure that tt-run is installed
tt-run --help
# Ensure that the cluster validation tool is built
./build/tools/scaleout/run_cluster_validation --help

# Run Cluster Validation on the Dual Host Cluster using tt-run (notice that the rank binding file is located at tests/tt_metal/distributed/config/dual_t3k_rank_bindings.yaml)

tt-run --rank-binding "tests/tt_metal/distributed/config/dual_t3k_rank_bindings.yaml" --mpi-args "--hostfile path/to/hostfile --any-additional-mpi-args " ./build/tools/scaleout/run_cluster_validation --factory-descriptor-path path/to/factory-system-descriptor --send-traffic

# If the cluster is healthy, the output shown below will be logged
| info     |     Distributed | ✓ All Detected Links are healthy.

# If not, potentially missing connections or unhealthy Ethernet Links will be reported
```