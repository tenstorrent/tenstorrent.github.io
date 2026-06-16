# AGENTS.md — Operating Guide for the Tenstorrent Docs Universe

This file is the operating guide for AI agents (and the developers they assist) working
with Tenstorrent AI accelerators. It is the companion to
[/llms.txt](https://docs.tenstorrent.com/llms.txt), which is the link index/map. Read
`llms.txt` to find *where* a doc lives; read this file to know *how* to actually get a
developer running on Tenstorrent hardware and *which repo owns which doc path*.

Everything here is verified against the live `docs.tenstorrent.com` site as of 2026-06-12.
When a fact below (a path, env var, or version constraint) conflicts with a specific
project's own docs, trust the project's docs and treat this as orientation.

## How the docs universe is laid out

`docs.tenstorrent.com` is a single domain stitched together from many GitHub Pages sites:

- The **root** (`/`, `/getting-started/`, `/aibs/`, `/systems/`, `/forge/`, `/tools/`,
  `/support/`, `/bounty_terms.html`) is built from the
  [`tenstorrent/tenstorrent.github.io`](https://github.com/tenstorrent/tenstorrent.github.io)
  repo (the core Sphinx site).
- Each **software project** publishes its own Pages site, routed by the org's custom
  domain to `docs.tenstorrent.com/{repo}/`. See the routing map below.

### Doc-site routing map

| Path under docs.tenstorrent.com | Owning repo | What it covers |
|---|---|---|
| `/`, `/getting-started/`, `/aibs/`, `/systems/`, `/forge/`, `/tools/`, `/support/` | `tenstorrent.github.io` | Core: hardware, getting started, support |
| `/syseng/latest/` | `tenstorrent.github.io` | Software & utilities (syseng) |
| `/bounty_terms.html`, `/os-model-terms.html` | `tenstorrent.github.io` | Legal / program terms |
| `/tt-metal/latest/ttnn/` | `tt-metal` | TT-NN tensor-op library + Python API |
| `/tt-metal/latest/tt-metalium/` | `tt-metal` | TT-Metalium low-level kernel model |
| `/tt-forge/` | `tt-forge` | MLIR-based compiler umbrella |
| `/tt-mlir/` | `tt-mlir` | MLIR compiler infrastructure |
| `/tt-xla/` | `tt-xla` | JAX / PyTorch-XLA PJRT backend |
| `/tt-forge-onnx/` | `tt-forge-onnx` | ONNX graph compiler |
| `/tt-torch/` | `tt-torch` | PyTorch front-end (deprecated) |
| `/tt-lang/` | `tt-lang` | Tensix kernel DSL |
| `/tt-blacksmith/` | `tt-blacksmith` | Training / fine-tuning recipes |
| `/tt-studio/` | `tt-studio` | Web GUI for local model deployment |
| `/ttnn-visualizer/` | `ttnn-visualizer` | Model execution / memory visualizer |
| `/tt-toplike/` | `tt-toplike` | Real-time hardware monitor (TUI) |
| `/tt-CableGen/` | `tt-CableGen` | Scale-out cabling generator |
| `/tt-system-firmware/` | `tt-system-firmware` | System firmware docs |
| `/tt-vscode-toolkit/` | `tt-vscode-toolkit` | VS Code extension + lessons |
| `/riescue/`, `/riscv-coretp/` | `riescue`, `riscv-coretp` | RISC-V test framework / core test plan |
| `/tt-animatediff/`, `/tt-local-generator/` | (same names) | Generative-AI demos |
| `/tt-awesome/` | `tt-awesome` | Curated ecosystem list |
| `/tt-tm-assets/` | `tt-tm-assets` | Brand / trademark assets |

## Hardware families

Tenstorrent ships two current chip families:

- **Wormhole** — N150 (single chip), N300 (dual chip, Ethernet mesh), T3K (8-chip),
  Galaxy (32-chip server).
- **Blackhole®** — P100 (single chip), P150, P300c (single Blackhole chip; treat like
  P100), QuietBox 2 / QB2 (4× P300c exposed as 4 independent single-chip devices).

Grayskull is the first-generation family (legacy).

### Constraints every developer must know

- **`TT_METAL_ARCH_NAME`** must be `blackhole` for P-series, `wormhole_b0` for N-series
  (defaults to `wormhole_b0`).
- **`DispatchCoreAxis.ROW` crashes on Blackhole** — use
  `ttnn.DispatchCoreConfig(ttnn.DispatchCoreType.WORKER)`; TTNN auto-selects the axis.
- **Multi-device API**: use `ttnn.CreateDevices` / `ttnn.CloseDevices`. Opening/closing
  devices individually causes dispatch-core errors.
- **`hf` CLI, not `huggingface-cli`**: `hf auth login`, `hf auth whoami`, `hf download`.
- **QB2 ships without `~/tt-metal`**: pre-configured images have TTNN and vLLM
  pre-installed but no tt-metal source tree.
- **Recommended starter model**: Qwen3-0.6B — works on all hardware including N150, no
  license gate, reasoning-capable.

## Software stack

| Layer | Component | Description |
|---|---|---|
| Kernel | TT-Metalium | Low-level Tensix programming model: RISC-V kernels, data movement, compute engines |
| Tensor ops | TT-NN | High-level tensor library on Metalium; primary Python API for model development |
| Compiler | TT-Forge | MLIR-based compiler umbrella; `forge.compile()` targets TT hardware from PyTorch |
| Compiler | tt-mlir | MLIR infrastructure underpinning the Forge stack |
| Compiler | TT-XLA | JAX / PyTorch-XLA backend via the PJRT plugin |
| Compiler | TT-Forge-ONNX | ONNX graph compiler on the tt-mlir backend |
| Language | tt-lang | DSL for data-movement + compute concurrency on the Tensix grid |
| Inference | vLLM (TT fork) | OpenAI-compatible server with continuous batching |
| Inference | tt-inference-server | One-command Docker deployment wrapping vLLM |
| Training | tt-blacksmith | Training / fine-tuning recipes on the Forge stack |
| Install | tt-installer 2.0 | One-command full-stack install: drivers, firmware, containers, Python env |
| Monitoring | tt-smi / tt-toplike | Hardware monitoring CLI / TUI: temperature, utilization, memory, PCI status |

## Environment layout & gotchas

Developers frequently land out of order and hit a path or variable that doesn't exist
yet. This is the full picture.

### Python virtual environments

Three venvs exist on a standard tt-installer system — each isolated. Activate the right
one:

| Use case | Activate |
|---|---|
| TTNN, Direct API, tt-metal examples, custom training | `source ~/tt-metal/python_env/bin/activate` |
| vLLM serving | `source ~/tt-metal/build/python_env_vllm/bin/activate` |
| TT-Forge, TT-XLA, JAX | `source ~/tt-forge-venv/bin/activate` |

`~/tt-forge-venv` is a symlink to `/opt/venv-forge` on developer images. On QB2 and
container environments venvs may be pre-activated via `/etc/profile.d/tt-env-*.sh` — run
`which python3` before sourcing another venv. **Unset `TT_METAL_HOME` before activating
the forge venv — they conflict.**

### `TT_METAL_HOME`

Only needed for the Direct API / Generator API and custom training. Not needed for vLLM,
tt-inference-server, TT-Forge, or TT-XLA. QB2 pre-configured images have no tt-metal tree.

```
export TT_METAL_HOME=~/tt-metal
export PYTHONPATH=$TT_METAL_HOME/build_Release:$PYTHONPATH
export LD_LIBRARY_PATH=$TT_METAL_HOME/build/lib:$LD_LIBRARY_PATH
```

### Conventions

- **Scratch dir**: `~/tt-scratchpad/` (create with `mkdir -p ~/tt-scratchpad` outside the
  VS Code extension).
- **Model storage**: `~/models/<model-name>/` (created on first `hf download --local-dir`).
- **Ubuntu**: 22.04 LTS is most tested/recommended; 24.04 LTS supported (QB2 ships with
  it); 20.04 deprecated (Metalium cannot be installed). Docker image OS tags (e.g.
  `ubuntu-22.04-amd64`) refer to the image OS, not the host.

## Common developer paths

- **"Just received hardware, want to run inference"** → tt-installer → verify with tt-smi
  → download Qwen3-0.6B → run a [model demo](https://docs.tenstorrent.com/getting-started/model-demos.html).
- **"Want an OpenAI-compatible API endpoint"** → tt-inference-server (easiest) or the
  [vLLM servers guide](https://docs.tenstorrent.com/getting-started/vLLM-servers.html).
- **"Have a PyTorch model, want it on TT hardware"** → [TT-Forge](https://docs.tenstorrent.com/tt-forge/)
  (`forge.compile()`, no build) or [TT-XLA](https://docs.tenstorrent.com/tt-xla/) (JAX/XLA path).
- **"Want to write low-level kernels"** → [TT-Metalium getting started](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/get_started/get_started.html)
  → [tt-lang](https://docs.tenstorrent.com/tt-lang/getting-started.html).
- **"Want to fine-tune / train"** → [TT-Blacksmith](https://docs.tenstorrent.com/tt-blacksmith/src/getting-started.html).
- **"On a QuietBox 2"** → [QB2 setup](https://docs.tenstorrent.com/systems/quietbox/quietbox-bh-2/index.html)
  → vLLM serving (no tt-metal source on QB2 images).
- **"Want a guided, lesson-based path"** → [TT Developer Toolkit](https://docs.tenstorrent.com/tt-vscode-toolkit/).

## Key environment variables

| Variable | Values | Purpose |
|---|---|---|
| `TT_METAL_ARCH_NAME` | `blackhole`, `wormhole_b0` | Required for P-series; defaults to `wormhole_b0` |
| `TT_METAL_HOME` | path to tt-metal checkout | Required for Direct API; not for vLLM / Forge / XLA |
| `PYTHONPATH` | includes `$TT_METAL_HOME` | Required when using tt-metal Python APIs |
| `MESH_DEVICE` | device topology string | Used by vLLM for multi-chip routing |
| `HF_MODEL` | HuggingFace model ID | Required by some vLLM configs; auto-detected by start-vllm-server.py |

## Maintenance

This file and `llms.txt` live in `core/_extra/` and are copied verbatim to the site root
by Sphinx (`html_extra_path = ['_extra']` in `core/conf.py`). To regenerate: re-list the
org's public repos with `has_pages=true`, probe each `docs.tenstorrent.com/{repo}/` for a
live 200, and refresh the routing map and links above. Drop any repo whose Pages flag is
set but does not resolve under the domain (e.g. `tt-llk`).
