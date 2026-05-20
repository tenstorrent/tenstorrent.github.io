---
myst:
  html_meta:
    product-name: TT-Lang, TT-NN™, TT-Metalium™
    technology-concepts: kernel fusion, custom operations, dataflow buffers, functional simulator, DRAM, L1 SRAM, Tensix
    document-type: how-to
---

# Optimizing a Converted Model

This guide is for developers who already have a model running on Tenstorrent hardware and want to make it faster. You will learn how to use [TT-Lang](https://github.com/tenstorrent/tt-lang) to replace a slow sequence of operations with a single fused custom kernel, validate it without hardware using the functional simulator, run it on device, and drop it back into a [TT-NN](https://docs.tenstorrent.com/tt-metal/latest/ttnn/index.html) graph.

TT-Lang is a Python-based domain-specific language for writing custom operations. It sits between TT-NN's ready-made high-level operations and [TT-Metalium™](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/index.html)'s low-level hardware control. Its primary purpose is **kernel fusion for model deployment**: when a model spends most of its time shuttling intermediate tensors between operations, you can fuse those operations into one kernel that reads its inputs once, computes in fast on-chip memory, and writes the result once.

---

## **Before You Begin**

:::{admonition} Important
:class: warning
* This guide assumes you have a model running on device — see [Converting a Model](./convert-a-model.md) if you do not yet.
* It also assumes basic familiarity with TT-NN, since TT-Lang operations are designed to slot into a TT-NN graph.
:::

### **When to Reach for TT-Lang**

Not every model needs custom kernels. Convert your model first, profile it, and reach for TT-Lang when you find a hot path where:

* Several elementwise or small operations run back-to-back, each writing an intermediate result to DRAM.
* An operation pattern is not expressible efficiently in TT-NN.

Each TT-NN operation reads its inputs from DRAM and writes its output back to DRAM. **Fusing a chain of operations into one TT-Lang kernel removes those intermediate round-trips** — the data stays in fast L1 SRAM between steps. That is where the speedup comes from.

### **A Concrete Optimization Target**

Throughout this guide we use the example shipped with TT-Lang: computing `y = (a * b + c) * d` on 2048×2048 `bfloat16` tensors. The inner expression `a * b + c` is the fusion target. We will replace it with a single custom operation while leaving the outer `* d` to TT-NN.

---

## Step 1: Install TT-Lang

Create an isolated Python environment with Python 3.11 or later (3.12 recommended):

```bash
python3 -m venv --prompt ttlang ttlang-venv
source ttlang-venv/bin/activate
```

On a Linux machine with Tenstorrent hardware, install the full package (compiler + hardware support), then run the setup helper:

```bash
pip install tt-lang
tt-lang-setup        # installs the matching sfpi runtime and copies bundled tutorials
```

:::{admonition} No hardware yet? Use the simulator package
:class: note
On Linux or macOS without a Tenstorrent device, install the simulator-only package instead. It lets you validate kernel logic on CPU before you ever touch hardware:

```bash
pip install tt-lang-sim
tt-lang-setup        # copies bundled tutorials to ./tutorials/
```
:::

`tt-lang-setup` is idempotent and copies the bundled tutorials (`elementwise`, `matmul`, `broadcast`) into `./tutorials/`.

## Step 2: Understand the Baseline

The starting point ([`step_0_ttnn_base.py`](https://github.com/tenstorrent/tt-lang/blob/main/examples/elementwise-tutorial/step_0_ttnn_base.py)) expresses the whole computation in TT-NN, with no custom operation:

```python
# Three separate TT-NN ops: multiply, add, multiply.
# Each reads from and writes an intermediate tensor back to DRAM.
y = ttnn.multiply(ttnn.add(ttnn.multiply(a, b), c), d)
```

This dispatches three operations, and the intermediate results of `a * b` and `a * b + c` make extra trips through DRAM. That DRAM traffic is exactly what fusion eliminates.

## Step 3: Read the Fused Kernel

A TT-Lang operation is a Python function decorated with `@ttl.operation()`. Inside it run **kernel functions** that execute concurrently: data-movement kernels (`@ttl.datamovement()`) move tiles between DRAM and L1, and a compute kernel (`@ttl.compute()`) does the arithmetic. They pass tiles to each other through **dataflow buffers** (DFBs) allocated in L1.

Here is the heart of the single-tile fused version ([`step_1_single_node_single_tile_block.py`](https://github.com/tenstorrent/tt-lang/blob/main/examples/elementwise-tutorial/step_1_single_node_single_tile_block.py)). Tenstorrent hardware operates on 32×32 tiles, so the operation walks the tensor one tile at a time:

```python
import ttl

TILE_SIZE = 32

@ttl.operation(grid=(1, 1))  # run on a single Tensix core
def __tutorial_operation(a, b, c, y):
    rows = a.shape[0] // TILE_SIZE
    cols = a.shape[1] // TILE_SIZE

    # Dataflow buffers live in L1. block_count=2 double-buffers so the reader
    # can fill the next tile while compute works on the current one.
    a_dfb = ttl.make_dataflow_buffer_like(a, shape=(1, 1), block_count=2)
    b_dfb = ttl.make_dataflow_buffer_like(b, shape=(1, 1), block_count=2)
    c_dfb = ttl.make_dataflow_buffer_like(c, shape=(1, 1), block_count=2)
    y_dfb = ttl.make_dataflow_buffer_like(y, shape=(1, 1), block_count=2)

    @ttl.compute()
    def tutorial_compute():
        for _ in range(rows):
            for _ in range(cols):
                with (
                    a_dfb.wait() as a_blk,    # block until a filled tile arrives
                    b_dfb.wait() as b_blk,
                    c_dfb.wait() as c_blk,
                    y_dfb.reserve() as y_blk, # block until an output slot is free
                ):
                    # The fused expression — computed in L1, no DRAM round-trips.
                    y_blk.store(a_blk * b_blk + c_blk)

    @ttl.datamovement()
    def tutorial_read():
        for row in range(rows):
            for col in range(cols):
                with (
                    a_dfb.reserve() as a_blk,
                    b_dfb.reserve() as b_blk,
                    c_dfb.reserve() as c_blk,
                ):
                    # a[row, col] indexes a tile in TILE coordinates, not elements.
                    tx_a = ttl.copy(a[row, col], a_blk)
                    tx_b = ttl.copy(b[row, col], b_blk)
                    tx_c = ttl.copy(c[row, col], c_blk)
                    tx_a.wait(); tx_b.wait(); tx_c.wait()

    @ttl.datamovement()
    def tutorial_write():
        for row in range(rows):
            for col in range(cols):
                with y_dfb.wait() as y_blk:
                    tx = ttl.copy(y_blk, y[row, col])
                    tx.wait()
```

The three `a * b`, `+ c`, and the read/write fuse into one pass: each input tile is read from DRAM once, the result is computed in L1, and the output tile is written back once.

## Step 4: Validate in the Simulator

Before running on hardware, validate the kernel logic with the functional simulator. It executes the operation as pure Python on CPU — no compilation, no device required — so you can catch bugs early and use any Python debugger:

```bash
ttlang-sim tutorials/elementwise/step_1_single_node_single_tile_block.py
```

The script checks its own result against the TT-NN baseline with `torch.allclose`, so a clean run means the fused kernel is numerically correct.

:::{note}
The simulator typically supports more language features than the compiler at any given moment. See the [functionality matrix](https://github.com/tenstorrent/tt-lang/blob/main/docs/sphinx/specs/TTLangSpecification.md) for current coverage.
:::

## Step 5: Run on Hardware

Once the logic is validated, run the same script with `python` (instead of `ttlang-sim`) to compile the operation and execute it on your Tenstorrent device:

```bash
python tutorials/elementwise/step_1_single_node_single_tile_block.py
```

A successful run prints the computed tensor and the expected tensor and passes its built-in `allclose` check.

## Step 6: Scale Across Cores

The single-tile version uses one Tensix core and synchronizes once per tile. The bundled tutorial continues with steps that scale the same operation up — and these are the techniques that turn a correct kernel into a fast one:

* **Step 2 — multi-tile blocks:** group tiles into larger blocks so each transfer and compute iteration covers a patch of tiles, amortizing synchronization overhead.
* **Step 3 — multi-node grid:** parallelize across a fixed grid of cores (e.g. `grid=(4, 4)`), with each core handling a region of the tensor.
* **Step 4 — auto grid:** use `grid="auto"` to let the compiler pick the largest grid that fits, with bounds-checking for tensors that do not divide evenly.

Work through them in order in the [elementwise tutorial](https://github.com/tenstorrent/tt-lang/tree/main/examples/elementwise-tutorial). For a fused matmul (`relu(a @ b + c)`) that scales to multiple devices, see the [matmul tutorial](https://github.com/tenstorrent/tt-lang/tree/main/examples/matmul-tutorial).

## Step 7: Integrate Into Your TT-NN Graph

The payoff: a TT-Lang operation is a drop-in replacement inside a TT-NN graph. Wrap the custom operation in a normal Python function that allocates the output tensor, then call it exactly where the TT-NN op sequence used to be:

```python
def tutorial_operation(a, b, c):
    y = from_torch(torch.zeros((a.shape[0], a.shape[1]), dtype=torch.bfloat16))
    __tutorial_operation(a, b, c, y)
    return y

# Before: y = ttnn.multiply(ttnn.add(ttnn.multiply(a, b), c), d)
# After:  the inner a * b + c is fused; only the outer * d stays in TT-NN.
y = ttnn.multiply(tutorial_operation(a, b, c), d)
```

Everything around the fused operation remains ordinary TT-NN, so you can optimize one hot path at a time without rewriting the rest of the model.

---

## **Next Steps**

* Take the [Tour of TT-Lang](https://github.com/tenstorrent/tt-lang/blob/main/docs/sphinx/tour/index.md) for a guided introduction to operations, kernels, and dataflow buffers.
* Read the [TT-Lang programming guide](https://github.com/tenstorrent/tt-lang/blob/main/docs/sphinx/programming-guide.md) for compiler options, print debugging, and line-by-line performance profiling.
* Review the [TT-Lang Specification](https://github.com/tenstorrent/tt-lang/blob/main/docs/sphinx/specs/TTLangSpecification.md) for the full language reference.

---

## **Need Additional Support?**

If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) You can also file an issue on the [TT-Lang Issues](https://github.com/tenstorrent/tt-lang/issues) page. Our team will review your request and provide assistance.
