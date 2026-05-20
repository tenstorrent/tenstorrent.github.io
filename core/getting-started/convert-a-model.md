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

From the repository root, run the demo:

```bash
export PYTHONPATH=.
python demos/tt-xla/cnn/resnet_demo.py
```

If everything is configured correctly, the model predicts the contents of a sample image and prints a label with a confidence score. You can browse the full set of bundled conversions in [`demos/tt-xla`](https://github.com/tenstorrent/tt-forge/tree/main/demos/tt-xla) (CNN and NLP models for both PyTorch and JAX).

## Step 4: Convert Your Own Model

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

## Step 5: Validate Correctness

After a model compiles and runs, confirm the device output matches a CPU reference. The standard metric is the Pearson Correlation Coefficient (PCC); for `bfloat16` you should expect a PCC above `0.99`.

```python
from scipy.stats import pearsonr

# Reference output on CPU.
model_cpu = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.bfloat16)
model_cpu.eval()
with torch.no_grad():
    cpu_output = model_cpu(inputs["input_ids"]).logits

# Output on the Tenstorrent device.
with torch.no_grad():
    tt_output = compiled_model(input_ids).logits.cpu()

pcc, _ = pearsonr(
    cpu_output.flatten().float().numpy(),
    tt_output.flatten().float().numpy(),
)
print(f"PCC: {pcc}")  # Expect > 0.99 for bfloat16
```

If the PCC is lower than expected, or compilation fails on an unsupported op, the [Model Bring-Up Guide](https://github.com/tenstorrent/tt-forge/blob/main/docs/src/model-bring-up-guide.md) has a debugging playbook covering common errors (unsupported ops, tile-alignment, out-of-memory) and their fixes.

---

## **Next Steps**

Your model now runs on Tenstorrent hardware. From here you can:

* **Optimize it.** Once a model runs correctly, the next goal is performance. See [Optimizing a Converted Model](./optimize-a-converted-model.md) to fuse hot op-sequences into custom kernels with TT-Lang.
* **Go deeper on bring-up.** The [Model Bring-Up Guide](https://github.com/tenstorrent/tt-forge/blob/main/docs/src/model-bring-up-guide.md) covers compiler optimization levels, runtime tracing, multi-chip tensor parallelism, and a full Hugging Face porting playbook.
* **Understand the stack.** Read [Understanding the Tenstorrent Software Stack](./tt-software-stack.md) to see where TT-Forge sits relative to TT-NN and TT-Metalium.

---

## **Need Additional Support?**

If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) You can also file an issue on the [TT-Forge Issues](https://github.com/tenstorrent/tt-forge/issues) page. Our team will review your request and provide assistance.
