---
myst:
  html_meta:
    product-name: tt (Tenstorrent CLI), tt-cli, TT-Studio, TT-Inference-Server, TT-QuietBox®, TT-LoudBox, Wormhole™ Networked AI Processor, Blackhole® Networked AI Processor, n150s, n150d, n300s, n300d, p100a, p150a, p150b, p300a
    technology-concepts: model serving, LLM, diffusion, image generation, video generation, speech recognition, text to speech, computer vision, embeddings, OpenAI-compatible API, Hugging Face
    document-type: how-to
---

# Serve Models

This page shows how to serve a model on your Tenstorrent system and start sending it requests. You have two surfaces to work from, and both draw on the same catalog of models that Tenstorrent validates on each hardware generation:

* **The `tt` CLI.** `tt serve <model>` gives you an OpenAI-compatible API endpoint in one command. This is the path for applications, scripts, agents, and anything else that talks to an API.
* **TT-Studio.** A web application that serves the same models and gives you a browser interface for them: chat, image and video generation, speech-to-text, object detection, and more. This is the path when you want to try a model from a browser, or hand it to people who do not use a terminal.

The flow is the same whatever kind of model you serve. The catalog is not limited to large language models: it includes diffusion models for image and video generation, speech and audio models, decision models, and tabular foundation models, and `tt serve` and TT-Studio treat each of them the same way. Under the hood, `tt serve` runs [TT-Inference-Server](https://github.com/tenstorrent/tt-inference-server) for the models in Tenstorrent's tested catalog, hands the few models only TT-Studio carries to TT-Studio, and runs community bundles published on the Hugging Face Hub through [tt-model-manager](https://github.com/tenstorrent/tt-model-manager). You do not need to clone or configure any of them yourself.

## **The Same Steps for Every Model**

Serving any model in the catalog takes the same five steps, and each is one command:

| Step | Command | What it does |
| :--- | :--- | :--- |
| 1. See what runs on your system | `tt model list` | Lists the models validated for the hardware it detects. `--type` narrows the list to one kind of model. |
| 2. Check what the model needs | `tt model info <model>` | Reports the disk and memory the model needs, which surfaces serve it, and how it is validated on your hardware. |
| 3. Serve it | `tt serve <model>`, or `tt serve <model> --studio` for TT-Studio | Downloads the weights and the container image on first use, opens the devices, loads the model, and starts the server. |
| 4. Send a request | `curl http://localhost:20000/v1/<route>` | Every server speaks the OpenAI API on port 20000. The route depends on the kind of model. |
| 5. Manage and stop | `tt model ps`, `tt model logs <model>`, `tt model stop <model>` | Shows what is running, streams its log, and stops the server. The weights stay cached. |

The commands do not change from one model to the next. What changes is what they report: the resources a model needs, the stages `tt serve` passes through while it loads, the route you call, and what comes back. The rest of this page walks the steps with `Wan2.2-T2V-A14B-Diffusers`, the Wan 2.2 text-to-video diffusion model, as the example, and says where another kind of model behaves differently. The example needs four chips, so it runs on a TT-QuietBox 2, a TT-LoudBox, or a Galaxy; on a single-chip board, follow the same steps with a model from your own list.

---

## **Before You Begin**

:::{admonition} Important
:class: warning
* This guide assumes you have completed [Installing Tenstorrent Software](./README.md): `tt update` has run, `tt device status` lists your devices, and Docker runs without `sudo`.
* You are logged in to Hugging Face with `tt model login`. Most models download their weights from the Hub, and the login is needed even for models that have no license gate.
* Disk space depends on the model. `tt model info <model>` reports the minimum for each one, from 15 GB for a speech or image model to 160 GB for a 70B-parameter LLM. Downloaded weights are cached under `~/.cache/huggingface` and shared by every path that serves the model.
:::

### **(Wormhole™ only)**

:::{admonition} If you are using a Wormhole TT-QuietBox® or TT-LoudBox™ you must complete the following step
:class: warning

For these systems you must configure a system-level mesh topology between the Wormhole™ Networked AI Processors. Run the following script to install `tt-topology` and configure the mesh.

```bash
TMP_DIR=$(mktemp -d); (trap 'echo "---"; echo "Cleaning up..."; if type deactivate &>/dev/null; then deactivate; fi; echo "Removing temporary directory: $TMP_DIR"; rm -rf "$TMP_DIR"; cd; echo "Cleanup complete."' EXIT; trap 'echo -e "\033[0;31m!!! ERROR: Failed to configure mesh topology\033[0m"' ERR; set -e; cd "$TMP_DIR"; echo "Working in temporary directory: $TMP_DIR"; echo "---"; echo "Creating Python virtual environment..."; python3 -m venv tt-topology-venv; source tt-topology-venv/bin/activate; echo "Virtual environment activated."; echo "---"; echo "Installing tt-topology from git..."; pip install --quiet git+https://github.com/tenstorrent/tt-topology.git; echo "tt-topology installed."; echo "---"; echo "Running tt-topology command. This may take a moment..."; tt-topology -l mesh; echo "---"; echo "Script finished successfully.";)
```
:::

---

## **Step 1: Choose a Model**

### **See what runs on your system**

`tt model list` shows every model that is validated for the hardware it detects, from two sources: the released catalog that Tenstorrent ships and tests, and community bundles that anyone has published for Tenstorrent hardware.

```bash
tt model list
```

Each row names the model, its `source` (`tt-inference-server` or `tt-studio` for the catalog, `HuggingFace` for a community bundle), the `engine` that runs it (`vLLM` for language models, `media` for image, video, audio, and embedding models, and `forge` for the vision and embedding models that run through TT-Forge), the smallest board or mesh each capability needs, and whether the weights are already on disk. Narrow the list to one kind of model with `--type`:

| Kind of model | `--type` | Examples in the catalog |
| :--- | :--- | :--- |
| Large language models | `llm` | `Qwen3.8-27B`, `Llama-3.3-70B-Instruct`, `gpt-oss-120b` |
| Vision-language models | `vlm` | `Qwen2.5-VL-7B-Instruct`, `Llama-3.2-11B-Vision-Instruct` |
| Image generation (diffusion) | `image` | `FLUX.1-schnell`, `FLUX.1-dev`, `stable-diffusion-xl-base-1.0` |
| Video generation (diffusion) | `video` | `Wan2.2-T2V-A14B-Diffusers`, `mochi-1-preview` |
| Speech recognition | `audio` | `whisper-large-v3`, `distil-large-v3` |
| Text to speech | `text_to_speech` | `speecht5_tts` |
| Vision classification and detection | `cnn` | `yolox_nano`, `resnet-50`, `segformer` |
| Embeddings | `embedding` | `bge-m3`, `Qwen3-Embedding-4B` |

The example model on this page is a video model. Listing that kind on a TT-QuietBox 2 gives a list of one:

```bash
tt model list --type video
```

```
 Models (tt catalog + community) for p300x2 (detected — `tt model list --all` for every
                                     device/bundle)
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━┓
┃ name                      ┃ source              ┃ engine ┃ serving profiles ┃ weights ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━┩
│ Wan2.2-T2V-A14B-Diffusers │ tt-inference-server │ media  │ p150x4, p300x2   │ —       │
└───────────────────────────┴─────────────────────┴────────┴──────────────────┴─────────┘
```

A model that is known not to work on your board is left out. `tt model list --all` shows every model on every device, and `--hw p150x4` shows the list for another configuration without touching the hardware. `--catalog` and `--community` show one source at a time.

### **Check what a model needs**

Before you commit to a download, inspect the model. `tt model info <model>` reports where the weights come from, which surfaces can serve the model, what it needs from the host, and how it is validated on each hardware configuration. For the example model:

```bash
tt model info Wan2.2-T2V-A14B-Diffusers
```

```
                                         Wan2.2-T2V-A14B-Diffusers
┌─────────────────────┬───────────────────────────────────────────────────────────────────────────────────┐
│ hf_repo             │ Wan-AI/Wan2.2-T2V-A14B-Diffusers                                                  │
│ type                │ video                                                                             │
│ engines             │ media                                                                             │
│ via                 │ inference-server, studio                                                          │
│ servable            │ yes — `tt serve Wan2.2-T2V-A14B-Diffusers` (`--studio` deploys it with TT-Studio) │
│ parameters          │ 14B                                                                               │
│ min disk            │ 60 GB                                                                             │
│ min ram             │ 32 GB                                                                             │
│ cached              │ no                                                                                │
│ on t3k              │ media — COMPLETE, max context 65536                                               │
│ on galaxy           │ media — COMPLETE, max context 65536                                               │
│ on p150x4           │ media — COMPLETE, max context 65536                                               │
│ on p150x8           │ media — COMPLETE, max context 65536                                               │
│ on p300x2           │ media — COMPLETE, max context 65536                                               │
│ on blackhole_galaxy │ media — COMPLETE, max context 65536                                               │
└─────────────────────┴───────────────────────────────────────────────────────────────────────────────────┘
```

### **Get access to gated models**

Some model owners gate their weights behind a license. Meta's Llama models, Google's Gemma models, and Black Forest Labs' FLUX.1 models all require you to accept their terms on the model's Hub page before you can download them, and the owner may take days to grant access. Qwen, Wan, and Whisper models are not gated.

To get access, open the `hf_repo` page that `tt model info` shows, accept the license, and make sure the account you accepted with is the one you used for `tt model login`. Until access is granted, serving a gated model stops at the download:

```
  ✓ host ready  tt-inference-server 0.25.0
  ✗ downloading weights  black-forest-labs/FLUX.1-schnell
╭──────────────────────────── error [TOOL_FAILED] ────────────────────────────╮
│ FLUX.1-schnell stopped before the server was ready.                        │
│ AssertionError: ⛔ Error during: … hf download black-forest-labs/FLUX.1-schnell │
╰────────────────────────────────────────────────────────────────────────────╯
```

The full log it names ends with `Error: Access denied. Model 'black-forest-labs/FLUX.1-schnell' requires approval.`

:::{tip}
`tt model pull <model>` downloads a model's weights ahead of time, so the serve itself is faster. It is also a quick way to confirm that your access to a gated model works.
:::

---

## **Step 2: Serve with the CLI**

### **Preview, then serve**

`tt serve <model> --dry-run` shows how the model would be served without starting anything: the serving path, the device configuration, the container image, where the weights go, and the port.

```bash
tt serve Wan2.2-T2V-A14B-Diffusers --dry-run
```

```
✓ Detecting device configuration  p300x2 (override with --device)
                            tt serve Wan2.2-T2V-A14B-Diffusers — dry run
┌──────────────────┬───────────────────────────────────────────────────────────────────────────────┐
│ backend          │ tt-inference-server                                                           │
│ device           │ p300x2                                                                        │
│ engines          │ media                                                                         │
│ status           │ COMPLETE                                                                      │
│ docker image     │ ghcr.io/tenstorrent/tt-media-inference-server:0.17.0-8c48a10                  │
│ weights cache    │ /home/ttuser/.cache/huggingface                                               │
│ HF token         │ from the Hugging Face login store                                             │
│ port             │ 20000  (server default)                                                       │
└──────────────────┴───────────────────────────────────────────────────────────────────────────────┘
```

`tt serve <model>` serves the model. On first use it fetches the weights and pulls the container image, then opens the devices, loads the model, and starts the server, showing each stage as a live checklist. It returns once the endpoint answers requests:

```bash
tt serve Wan2.2-T2V-A14B-Diffusers
```

```
  ✓ host ready  tt-inference-server 0.25.0
  ✓ weights ready  Wan-AI/Wan2.2-T2V-A14B-Diffusers  16m 58s
  ✓ image ready  tt-media-inference-server:0.17.0  2m 13s
  ✓ container started  tt-inference-server-2f018ce0  3.7s
  ✓ server started  4.5s
  ✓ Tenstorrent device opened  4 chips  4.3s
  ✓ model loaded  2/2  5m 52s
  ✓ endpoint answering
╭─ Wan2.2-T2V-A14B-Diffusers ready ──────────────────────────────────────────╮
│  endpoint  http://127.0.0.1:20000/v1                                       │
│  Logs · tt model logs Wan2.2-T2V-A14B-Diffusers --follow                   │
│  Stop · tt model stop Wan2.2-T2V-A14B-Diffusers                            │
╰────────────────────────────────────────────────────────────────────────────╯
```

### **Send a request**

The endpoint speaks the OpenAI API, so any OpenAI-compatible client can use it. Point the client at `http://localhost:20000/v1` with any value for the API key. Which route you call depends on the kind of model:

| Kind of model | Route | What you send |
| :--- | :--- | :--- |
| Large language and vision-language models | `/v1/chat/completions` | a list of `messages` |
| Speech recognition | `/v1/audio/transcriptions` | the audio file, base64-encoded, in `file` |
| Text to speech | `/v1/audio/speech` | the `text` to speak |
| Image generation | `/v1/images/generations` | a `prompt`, with optional `num_inference_steps`, `seed`, `width` and `height` |
| Video generation | `/v1/videos/generations` | a `prompt`; the reply is a job that you poll and then download |
| Embeddings | `/v1/embeddings` | the `input` text |

For an LLM, `tt model curl` sends a chat completion without any JSON on your part, and `--print` shows the equivalent `curl` command for your own scripts:

```bash
tt model curl "In one sentence, what is Tenstorrent?" --max-tokens 2048
```

For the other kinds of model, call the route directly. Video generation runs as a job: the request returns at once with the job's `id` and `status`, you poll the job until it is `completed`, and then you download the result.

```bash
# Submit the job; the reply includes its id and status
curl -s http://localhost:20000/v1/videos/generations \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A red fox trotting through fresh snow in a pine forest, soft morning light, camera tracking alongside"}'

# Poll until status is "completed", then download the clip
curl -s http://localhost:20000/v1/videos/generations/<job_id>
curl http://localhost:20000/v1/videos/generations/<job_id>/download --output fox.mp4
```

### **Manage what is running**

```bash
tt model ps              # what is being served, on which port, and whether it is healthy
tt model logs <model>    # the server's log (--follow to stream it)
tt model stop <model>    # stop the server; the weights stay cached
```

`tt serve` takes `--port` to serve on a port other than 20000, and `--device` to override the detected configuration. Anything it does not recognize after `--` is passed through to the server itself.

---

## **Step 3: Serve with TT-Studio**

[TT-Studio](https://github.com/tenstorrent/tt-studio) serves the same catalog through a web application. It deploys the model you choose and gives you a browser interface for it: chat with knowledge bases for language models, image and video generation for diffusion models, speech-to-text, object detection, and a voice agent. Every model it deploys is also served on an API endpoint, so applications can use it at the same time.

### **Start TT-Studio and deploy a model**

`tt serve <model> --studio` deploys a model with TT-Studio instead of directly. TT-Studio takes port 3000 and the devices for itself, so stop anything `tt serve` or `tt launch` started and reset the devices first:

```bash
tt model stop Wan2.2-T2V-A14B-Diffusers
tt device reset
tt serve Wan2.2-T2V-A14B-Diffusers --studio
```

On first use `tt` fetches the latest TT-Studio release, and TT-Studio asks you to accept its terms and offers a `tt-studio` shell shortcut. It then prints its web UI address and, once the model is deployed, the model's endpoint:

```
╭─ TT Studio is ready ───────────────────────────────────────────────────────╮
│  URL            ● http://localhost:3000                                    │
│  Hardware       QuietBox (QB2) · 4 device(s)                               │
╰────────────────────────────────────────────────────────────────────────────╯

╭─ Wan2.2-T2V-A14B-Diffusers is ready ───────────────────────────────────────╮
│  Chips      0, 1, 2, 3                                                     │
│  Endpoint   ● http://localhost:20000/v1/videos/generations                 │
│  Web UI     http://localhost:3000/models-deployed                          │
╰────────────────────────────────────────────────────────────────────────────╯
```

Without a model name, `tt serve --studio` lists everything TT-Studio can deploy on your system and asks which one you want.

### **Deploy from the browser instead**

Open `http://localhost:3000`, go to the models page, and pick a model from the list, which is filtered to what your hardware supports. The **Models Deployed** page lists every running model with its health, the chips it occupies, and its log.

### **Use the model**

The Models Deployed page links to the interface for the model's kind. The endpoint in the ready box serves API clients at the same time, and `tt model curl` and `tt launch` work against it exactly as they do against a model started by `tt serve`.

### **Stop**

`tt model stop <model>` stops a model that TT-Studio deployed and takes TT-Studio down with it; settings, weights, chat history, and knowledge bases are kept. The `tt-studio` shortcut manages TT-Studio directly:

```bash
tt-studio --stop-model <model>   # stop one model and keep TT-Studio running
tt-studio --stop                 # stop TT-Studio, keeping its data
```

---

## **Serve a Community Model**

Community bundles are models that anyone has packaged for Tenstorrent hardware and published on the Hugging Face Hub. `tt model list` includes the ones Tenstorrent has reviewed; `--include-unverified` shows the rest. They are served through the same commands, with the bundle's repository id in place of a catalog name:

```bash
tt model list --community                 # bundles that fit your hardware
tt model info <namespace>/<name>          # the bundle's manifest and a compatibility verdict
tt serve <namespace>/<name>               # served through tt-model-manager
```

`tt` checks that the bundle was built for your chip architecture and that your system has enough chips before it serves, and asks for confirmation before it serves a bundle that has not been verified. Tenstorrent does not test or maintain community bundles. If you have brought a model up on Tenstorrent hardware yourself, the [tt-model-manager documentation](https://github.com/tenstorrent/tt-cli/blob/main/docs/community-models.md) explains how to package and publish it so that anyone can serve it the same way.

---

## **Troubleshooting**

### The model I want is not in `tt model list`

The list is filtered to your detected hardware. `tt model list --all` shows every model on every device, and `tt model info <model>` says why one is left out for yours. A model that is validated on a smaller configuration than you have, such as a single-chip model on a TT-QuietBox 2, is listed and runs on part of the system.

### The serve stops at `downloading weights` with "requires approval"

The model is gated and your Hugging Face account has not been granted access to it yet. Accept the license on the model's Hub page, wait for the owner to approve the request if the model requires that, and serve again. Make sure `tt model login` is for the same account.

### `tt serve` fails with "Access to model … is restricted"

The model is gated and your account has not accepted its license yet, or the login on this machine is for a different account. Accept the license on the model's Hub page, check `tt model login`, and serve again. `tt model logs <model>` shows the server's own output for any failed start.

### A serve or a TT-Studio deploy fails with "Try resetting the board"

A model server that was stopped or crashed can leave the devices in a state the next server cannot use. Reset every device, confirming with `y` when asked, and serve again:

```bash
tt device reset
```

### `tt serve` says the model did not report ready within 60 minutes

`tt serve` waits up to an hour for the endpoint to answer, then stops watching and leaves the server running. A cold start of a large diffusion model compiles for your hardware and can be slow, so first check whether it is still making progress: `tt model logs <model> --follow` shows the server's output, and `tt model ps` reports it `healthy` once it answers. If the log shows an error instead, stop the server with `tt model stop <model>`. To wait longer next time, set `TT_SERVE_READY_TIMEOUT` to a number of seconds before you serve.

### TT-Studio does not start because port 3000 is in use

TT-Studio needs port 3000 and does not move to another one. Stop whatever is using it first, for example a web UI started with `tt launch`: `tt launch stop openwebui`.

### I am running out of disk space

`tt model rm <model>` removes a model's local artifacts and keeps its weights; add `--include-weights` to remove those too. The weights live under `~/.cache/huggingface`.

---

## **What to Do Next**

Now that your model is running:

* **Connect an application to it** with `tt launch`. [Open WebUI](https://github.com/open-webui/open-webui) and [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) give you a chat interface in the browser; OpenCode, Aider, pi, Qwen Code, and Hermes Agent turn a tool-calling LLM into a coding agent in your terminal. `tt launch list` shows which are available on your machine, and the [client launchers guide](https://github.com/tenstorrent/tt-cli/blob/main/docs/client-launchers.md) covers what each one needs and how to connect to a server on another machine.
* **Watch it in real time** — run `tt-toplike` in a second terminal window. [TT-Toplike](https://docs.tenstorrent.com/tt-toplike/) shows live core activity, power draw, and memory traffic on the chips while they serve requests.
* **Use it as a coding assistant** — the [Coding Assistant with Aider](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/coding-assistant/) lesson walks through pairing a local endpoint with Aider for on-device pair programming.
* **Build agents on top of it** — if you have a TT-QuietBox® 2, the [Local AI Agents on QuietBox 2](https://docs.tenstorrent.com/tt-vscode-toolkit/lessons/qb2-local-agents/) lesson covers tool-calling pipelines and multi-agent workflows against your local endpoint.
* **Generate images and video at scale** — if you have a TT-QuietBox® 2, [TT-Local-Generator](https://docs.tenstorrent.com/tt-local-generator/) runs alongside inference with its own queue and gallery.
* **Check supported models** — the [tt-inference-server repository](https://github.com/tenstorrent/tt-inference-server) is the authoritative source for which models are validated on each hardware generation, and the catalog `tt model list` shows is built from it.

---

## **Need Additional Support?**
If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.
