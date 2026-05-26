---
myst:
  html_meta:
    product-name: TT-Forge™, TT-XLA, TT-Forge-ONNX, TT-MLIR, TT-Metalium™
    technology-concepts: model compilation, PyTorch, JAX, ONNX, torch.compile, PJRT, bfloat16, PCC
    document-type: how-to
---

# Converting a Model

This guide is for developers who want to take their own model — written in PyTorch, JAX, or ONNX — and run it on Tenstorrent hardware. You will learn how [TT-Forge™](https://github.com/tenstorrent/tt-forge) fits together, how to install a frontend, how to run a ready-made conversion to confirm your setup works, and how to convert and validate your own model.

TT-Forge is Tenstorrent's graph-compiler stack. You hand it a model from a standard framework, and it lowers that model through a common intermediate representation ([TT-MLIR](https://github.com/tenstorrent/tt-mlir)) down to [TT-Metalium™](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/index.html), which dispatches the work to your Wormhole™ or Blackhole™ card. You do not rewrite the model — you compile it.

---

## **Before You Begin**

:::{admonition} Important
:class: warning
* This guide assumes you have already installed the base software stack by following [Installing the Tenstorrent Software Stack](./README.md), and that `tt-smi` lists your device correctly.
* If you would rather run pre-built model demonstrations than convert your own model, start with [Running Model Demos](./model-demos.md) instead.
:::

### **Requirements**

* Ubuntu 24.04
* Python 3.12
* A working Tenstorrent device (verify with `tt-smi`)
* At least 10 GB of free disk space for the virtual environment and the cloned repository (downloaded model weights are additional)

### **Choose a Frontend**

TT-Forge exposes two frontends. Pick the one that matches the framework your model is written in:

| Frontend | Use it for | Multi-chip | Source |
| :---- | :---- | :---- | :---- |
| **TT-XLA** | PyTorch, JAX, TensorFlow (via a PJRT plugin) | Yes | [tt-xla](https://github.com/tenstorrent/tt-xla) |
| **TT-Forge-ONNX** | ONNX, PaddlePaddle, TensorFlow (TVM-based) | No (single-chip) | [tt-forge-onnx](https://github.com/tenstorrent/tt-forge-onnx) |

:::{note}
TT-XLA is the recommended path for all new PyTorch and JAX work, and it is the frontend used throughout this guide. Use TT-Forge-ONNX when your model is already exported to ONNX or PaddlePaddle. (TT-Forge-ONNX is only available through Docker or a source build.)
:::

---

## Step 1: Install the TT-XLA Frontend

TT-XLA ships as a PJRT plugin that bundles the TT-MLIR compiler and the TT-Metalium runtime. Create an isolated Python environment, then install the plugin:

```bash
python3 -m venv tt-forge-venv
source tt-forge-venv/bin/activate
pip install pjrt-plugin-tt --extra-index-url https://pypi.eng.aws.tenstorrent.com/
```

:::{note}
For Docker and build-from-source installation options, see the [TT-XLA getting started guide](https://docs.tenstorrent.com/tt-xla/getting_started.html).
:::

## Step 2: Verify the Device Is Visible

Confirm that the frontend can see your hardware before you compile anything:

```bash
python -c "import jax; print(jax.devices('tt'))"
```

You should see your device listed, for example:

```
[TTDevice(id=0, arch=Wormhole_b0)]
```

:::{admonition} Important
:class: danger
If no device is listed, do not continue. Re-check your installation with `tt-smi` and revisit [Installing the Tenstorrent Software Stack](./README.md), or [contact support](#need-additional-support).
:::

## Step 3: Run a Ready-Made Conversion

Before converting your own model, run one of the bundled demos end-to-end. This confirms the whole toolchain — frontend, compiler, and runtime — is wired up correctly. The [`resnet_demo.py`](https://github.com/tenstorrent/tt-forge/blob/main/demos/tt-xla/cnn/resnet_demo.py) script converts a ResNet image classifier and runs inference on device.

Clone the TT-Forge repository and fetch its submodules:

```bash
git clone https://github.com/tenstorrent/tt-forge.git
cd tt-forge
git submodule update --init --recursive
```

The ResNet demo loads its model through `torchvision` and `timm`, postprocesses results with `transformers`, and loads sample images with `datasets` — none of which are pulled in by `pjrt-plugin-tt`. Install them with `--no-deps` so pip does not replace the `torch` build that TT-XLA was compiled against, then install the lightweight transitive dependencies they actually need at runtime:

```bash
pip install --no-deps torchvision transformers==4.57.1 datasets timm tabulate
pip install huggingface_hub 'tokenizers>=0.22,<=0.23.0' safetensors regex \
            pyyaml pyarrow dill multiprocess xxhash
```

:::{admonition} If you see an `_XLAC` undefined-symbol ImportError
:class: warning
If running the demo (or any conversion) fails with `ImportError: .../_XLAC.cpython-312-x86_64-linux-gnu.so: undefined symbol: _ZNR5torch7Library4_def...`, one of the packages above has upgraded `torch` to a build whose C++ ABI no longer matches the `torch_xla` shipped in `pjrt-plugin-tt`. Reinstall the matching versions:

```bash
pip install --force-reinstall --no-deps pjrt-plugin-tt --extra-index-url https://pypi.eng.aws.tenstorrent.com/
```

Then reinstall the demo packages with `--no-deps` as shown above.
:::

From the repository root, run the demo:

```bash
export PYTHONPATH=.
python demos/tt-xla/cnn/resnet_demo.py
```

If everything is configured correctly, the script compiles and runs six ResNet variants (ResNet-18/34/50/101/152 plus a TIMM ResNet-50) end-to-end on device, then exits 0. The script prints extensive compiler and runtime logs followed by a `============` separator per variant; the final separator marks the end of the last variant. (The demo runs `output_postprocess` on the result but does not print the predicted class — passing the postprocess step is itself the correctness signal.) You can browse the full set of bundled conversions in [`demos/tt-xla`](https://github.com/tenstorrent/tt-forge/tree/main/demos/tt-xla) (CNN and NLP models for both PyTorch and JAX).

## Step 4: Choose an Optimization Level

By default the compiler runs with `optimization_level: "0"` — no optimizer passes, all tensors in DRAM. That keeps compile time short, which is what you want while you are still verifying that a model compiles and produces correct output. Once it does, raising the level trades longer compile time for faster runtime.

Set the level once, before the first forward pass:

```python
import torch_xla

torch_xla.set_custom_compile_options({
    "optimization_level": "2",  # "0", "1", or "2"
})
```

`torch.compile(model, backend="tt", options={...})` accepts the same dict if you would rather pass it inline with the compile call.

| Level | What it does                                          | Compile time | Runtime  |
| :---- | :---------------------------------------------------- | :----------- | :------- |
| `"0"` | No optimizer passes; all tensors in DRAM              | Fastest      | Slowest  |
| `"1"` | Const-eval, conv weight preprocessing, op fusion      | Moderate     | Good     |
| `"2"` | Level 1 plus aggressive SRAM placement                | Slowest      | **Best** |

:::{admonition} Recommended workflow
:class: note
Bring the model up at level `"0"` so failures are easy to diagnose, then jump to level `"2"` for performance. If level `"2"` fails with an `Insufficient L1` / OOM error, drop back to level `"1"` or reduce batch size — see the [Model Bring-Up Guide](https://github.com/tenstorrent/tt-forge/blob/main/docs/src/model-bring-up-guide.md) for the full list of compile options and their failure modes.
:::

## Step 5: Convert Your Own Model

Converting an arbitrary PyTorch model comes down to four changes: select the TT runtime, cast the model to `bfloat16`, compile it with the `tt` backend, and move the inputs to the device. The example below converts any [Hugging Face](https://huggingface.co) causal-LM, but the same pattern applies to your own `nn.Module`.

```python
import torch
import torch_xla.core.xla_model as xm
import torch_xla.runtime as xr
from transformers import AutoModelForCausalLM, AutoTokenizer

# 1. Point the XLA runtime at the Tenstorrent device.
xr.set_device_type("TT")
device = xm.xla_device()

# 2. Load any model and cast it to bfloat16 (the recommended default precision).
model_id = "meta-llama/Llama-3.2-1B"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.bfloat16)
model.eval()

# 3. Compile for Tenstorrent. This is the conversion step — the graph is lowered
#    through TT-MLIR to TT-Metalium on the first forward pass.
compiled_model = torch.compile(model, backend="tt")

# 4. Move inputs to the device and run inference.
inputs = tokenizer("The capital of France is", return_tensors="pt")
input_ids = inputs["input_ids"].to(device)

with torch.no_grad():
    outputs = compiled_model(input_ids)
    next_token = outputs.logits[:, -1, :].argmax(dim=-1)
    print(tokenizer.decode(next_token[0]))
```

:::{admonition} Compilation is lazy and cached
:class: note
`torch.compile(model, backend="tt")` does not compile immediately. The graph is compiled on the **first** forward pass and cached, so the first iteration is always slow (full compilation, weight transfer, and kernel compilation). Warm up with a few iterations before measuring anything.
:::

:::{admonition} Always cast to bfloat16
:class: warning
Hugging Face models default to `float32`. Casting to `bfloat16` before compilation halves memory use with minimal accuracy loss and is expected by most of the compiler's optimized paths.
:::

Once the model runs, the next questions are usually *is the output numerically correct?* and *what do I do if compilation fails on an unsupported op?* Both are covered in the [Model Bring-Up Guide](https://github.com/tenstorrent/tt-forge/blob/main/docs/src/model-bring-up-guide.md) — it walks through validating outputs against a CPU reference (Pearson Correlation Coefficient, expected thresholds for `bfloat16`/`bfloat8`) and has a debugging playbook for unsupported ops, tile alignment, and out-of-memory failures.

## Step 6: Generate TT-NN Code (Optional)

TT-XLA can lower the same compiled graph to standalone source code that calls the [TT-NN](https://docs.tenstorrent.com/tt-metal/latest/ttnn/index.html) API directly — either Python or C++. Reach for this when you want to:

* **Read what the compiler decided.** The generated Python is a direct, human-readable transcript of the TT-NN calls the runtime would otherwise issue. It is the best way to see what TT-XLA actually compiled your model into.
* **Ship without the toolchain.** The generated C++ only depends on the TT-NN library — no Python, no XLA, no PJRT plugin at runtime.
* **Separate compile from execute.** Compile once on a workstation, run elsewhere from the emitted artifact.

If you only want to run the model from Python on a device you control, you can skip this step — codegen is not needed.

| Backend         | Language    | Standalone               | Use it for                                  |
| :-------------- | :---------- | :----------------------- | :------------------------------------------ |
| `codegen_py`    | Python      | No (needs TT-XLA build)  | Inspecting compiler output, scripting       |
| `codegen_cpp`   | C++         | Yes (only needs TT-NN)   | Production deployment, C++ integration      |

Enable codegen by setting the `backend` and an `export_path` before the first forward pass:

```python
import torch_xla

torch_xla.set_custom_compile_options({
    "backend": "codegen_py",                # or "codegen_cpp" for C++
    "export_path": "codegen_output",        # created if missing
    # "compiler_options": {"optimization_level": "2"},  # carried over from Step 4
})
```

By default the compiler also exports the real model weights and inputs into `<export_path>/tensors/` so the generated code runs against the same data your PyTorch model saw. Set `"export_tensors": False` if you want the generated code to use placeholder `ttnn.ones` instead — useful for sharing the output without shipping the weights.

Re-run the conversion script from Step 5 with the option above in place. Code generation happens during the first forward pass — the same place ordinary compilation happens — and the source files are written to `<export_path>/`:

```
codegen_output/
├── irs/              # VHLO, StableHLO, TTIR, TTNN IRs (one .mlir per stage)
├── main.py           # Generated TT-NN Python (or main.cpp/main.h for codegen_cpp)
├── run               # Execution script (Python backend only)
└── tensors/          # Serialized model weights and inputs (if export_tensors is True)
```

`main.py` is where the interesting reading happens — every `ttnn.matmul`, `ttnn.add`, layout conversion, and shard placement the compiler chose is spelled out as a regular TT-NN call. The `irs/` directory shows the same graph at four levels of lowering:

| File             | What it represents                                              |
| :--------------- | :-------------------------------------------------------------- |
| `vhlo*.mlir`     | Framework-level IR right after PyTorch/JAX import               |
| `shlo*.mlir`     | StableHLO — framework-independent tensor operations             |
| `ttir*.mlir`     | TT Intermediate Representation — hardware-agnostic tensor IR    |
| `ttnn*.mlir`     | TTNN dialect — the backend-specific IR the codegen reads from   |

For `codegen_py`, run the bundled `./run` script from inside the export directory to execute `main.py` on device against the exported tensors. For `codegen_cpp`, compile `main.cpp` against the TT-NN library and link it into your application — the generated headers and source contain everything needed to reconstruct the graph and invoke it.

:::{note}
The JAX path is the same shape — pass the dict via `jax.jit(forward, compiler_options={...})`. See the [TT-XLA Code Generation Guide](https://docs.tenstorrent.com/tt-xla/getting_started_codegen.html) for the JAX example and advanced serialization options.
:::

---

## **Next Steps**

Your model now runs on Tenstorrent hardware. From here you can:

* **Optimize it.** Once a model runs correctly, the next goal is performance. See [Optimize a Kernel](./optimize-a-converted-model.md) to fuse hot op-sequences into custom kernels with TT-Lang.
* **Go deeper on bring-up.** The [Model Bring-Up Guide](https://github.com/tenstorrent/tt-forge/blob/main/docs/src/model-bring-up-guide.md) covers runtime tracing, bfloat8 conversion, multi-chip tensor parallelism, and a full Hugging Face porting playbook.
* **Understand the stack.** Read [Understanding the Tenstorrent Software Stack](./tt-software-stack.md) to see where TT-Forge sits relative to TT-NN and TT-Metalium.

---

## **Need Additional Support?**

If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) You can also file an issue on the [TT-Forge Issues](https://github.com/tenstorrent/tt-forge/issues) page. Our team will review your request and provide assistance.
