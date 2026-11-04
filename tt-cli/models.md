---
myst:
  html_meta:
    product-name: tt (Tenstorrent CLI), tt-cli, TT-Inference-Server, TT-Studio
    technology-concepts: model catalog, Hugging Face, gated models, community models
    document-type: reference
---

# Finding Models with `tt model`

`tt` knows your hardware, so it can tell you which models are validated to run on it. `tt model` lists those models, inspects one before you download anything, logs you in to Hugging Face, and manages the models that are being served.

## List the models for your hardware

```bash
tt model list
```

The list is filtered to the device configuration `tt` detected. The rows below are an example only, trimmed from a TT-QuietBox 2 listing, which `tt` detects as a `p300x2` configuration, to show the different ways a model can appear:

```
  Models (tt catalog + community) for p300x2 (detected — `tt model list --all` for every
                                      device/bundle)
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┳━━━━━━━━━┓
┃ name                       ┃ source              ┃ engine ┃ serving profiles ┃ weights ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━╇━━━━━━━━━┩
│ FLUX.1-dev                 │ tt-inference-server │ media  │ p300, p300x2     │ —       │
│ Llama-3.3-70B-Instruct     │ tt-inference-server │ vLLM   │ p150x4, p300x2   │ —       │
│ Qwen3-32B                  │ tt-inference-server │ vLLM   │ p150x4, p300x2   │ —       │
│ Qwen3.5-9B                 │ tt-studio           │ vLLM   │ p150             │ —       │
│ Qwen3.8-27B                │ tt-inference-server │ vLLM   │ p150x4, p300x2   │ —       │
│ tt-hous/qwen3.8-flash-next │ HuggingFace         │ vLLM   │ p300x2           │ —       │
│ whisper-large-v3           │ tt-inference-server │ media  │ p150             │ —       │
└────────────────────────────┴─────────────────────┴────────┴──────────────────┴─────────┘
```

The columns tell you:

* **source**: where the model comes from. `tt-inference-server` and `tt-studio` rows are the **released catalog**, the models Tenstorrent ships and tests. `HuggingFace` rows are **community bundles** that anyone can publish to the Hugging Face Hub with the Tenstorrent model manager. Community bundles are not tested or maintained by Tenstorrent, and are served by their full `namespace/name` id. `local` marks a bundle already installed on this machine.
* **engine**: how the model is served. `vLLM` models expose an OpenAI-compatible chat API, `media` models expose image, video, or speech endpoints, and `forge` models run through the TT-Forge™ compiler.
* **serving profiles**: the board or mesh configurations the model has a serving configuration for. Your detected configuration is always among them.
* **weights**: whether the model's weights are already downloaded on this machine, and how much space they take.

Ways to narrow or widen the list:

```bash
tt model list --catalog               # only the released catalog
tt model list --community             # only community bundles
tt model list --include-unverified    # community bundles Tenstorrent has not reviewed, too
tt model list --type llm              # only one kind of model (llm, vlm, image, video, audio, text_to_speech, cnn, embedding)
tt model list --hw p150x4             # the list for another configuration, without touching the hardware
tt model list --all                   # every model on every device, not just this machine's
```

A model that is known not to work on your board is left out. A model validated on a smaller configuration than you have, such as a single-chip model on a four-chip system, is listed and runs on part of the system.

## Inspect a model before you download it

```bash
tt model info Qwen3.8-27B
```

`tt model info` is the place to check before you serve a model. It reports the model's Hugging Face repository, the minimum disk space and host RAM it needs, whether its weights are already cached, the serving paths it supports, and its validation status on each board:

* `COMPLETE` models are fully validated.
* `FUNCTIONAL` models run and produce correct output but may not yet reach target performance.
* `EXPERIMENTAL` models are early and have not been through the full test suite.

A configuration that is missing from the list is one the model is not validated on. The `via` row lists the surfaces that can serve the model: most catalog models offer both `inference-server`, the path `tt serve` takes by default, and `studio`. A few are carried only by TT-Studio, and `tt serve` sends those to it automatically.

## Log in to Hugging Face

Catalog models download their weights from the [Hugging Face Hub](https://huggingface.co), so serving needs a Hugging Face account and login, even for freely available models. Some models are also gated: you must visit the model's page on the Hub and accept its license before you can download it, and the owner may take days to grant access. Meta's Llama, Google's Gemma, and Black Forest Labs' FLUX.1 models are gated; Qwen, Wan, and Whisper models are not. The `hf_repo` line in `tt model info` names the page to visit.

```bash
tt model login
```

`tt model login` offers two ways to log in. **Log in with your browser** shows a URL and a short code: open the URL on any device, enter the code, and approve the request. **Paste an access token** takes a read token you create at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). Either way, the login is saved in Hugging Face's own token store, so it is also picked up by any other Hugging Face tooling you use, and `tt serve --dry-run` reports it as `HF token: from the Hugging Face login store`.

## Download ahead of time

```bash
tt model pull Qwen3.8-27B
```

`tt model pull` downloads a model's weights without serving it, so the first serve is faster. It is also a quick way to confirm that your access to a gated model works. Weights are cached under `~/.cache/huggingface` and shared by every path that serves the model, including TT-Studio.

## Community bundles

Community bundles are models that anyone has packaged for Tenstorrent hardware and published on the Hugging Face Hub. To find bundles for a specific model, search the Hub:

```bash
tt model search gpt-oss
```

Bundles are served through the same commands as catalog models, with the bundle's repository id in place of a catalog name:

```bash
tt model info <namespace>/<name>    # the bundle's manifest and a compatibility verdict
tt serve <namespace>/<name>         # served through the Tenstorrent model manager
```

`tt` checks that the bundle was built for your chip architecture and that your system has enough chips before it serves, and asks for confirmation before it serves a bundle that has not been verified. Tenstorrent does not test or maintain community bundles. The [community models guide](https://github.com/tenstorrent/tt-cli/blob/main/docs/community-models.md) explains how bundles are packaged, published, and pulled, and how to publish one of your own.

## Manage what is running and what is on disk

```bash
tt model ps                    # what is being served, on which port, and whether it is healthy
tt model logs <model>          # the server's log (--follow to stream it)
tt model stop <model>          # stop the server; the weights stay cached
tt model rm <model>            # remove a model's local artifacts, keeping its weights
tt model rm <model> --include-weights   # remove the weights too
```

`tt model curl` sends a chat completion to a running LLM server; see [Serving models](serve.md#send-a-first-request).
