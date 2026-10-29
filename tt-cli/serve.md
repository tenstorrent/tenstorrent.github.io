---
myst:
  html_meta:
    product-name: tt (Tenstorrent CLI), tt-cli, TT-Inference-Server, TT-Studio
    technology-concepts: model serving, OpenAI-compatible API, vLLM, Docker
    document-type: reference
---

# Serving Models with `tt serve`

Serving a model gives you an OpenAI-compatible API endpoint running on your Tenstorrent hardware. `tt serve <model>` does it in one command for any model in `tt model list`, whether it is a large language model, a diffusion model, a speech model, or a vision model, directly or through TT-Studio's web interface.

## Preview with `--dry-run`

```bash
tt serve Qwen3.8-27B --dry-run
```

`tt serve <model> --dry-run` shows how the model would be served without starting anything: the backend, the device configuration `tt` detected, the container image, where the weights go, which Hugging Face login it found, and the port. Below the table it prints the exact command it would run. It is a quick way to confirm `tt` detected your hardware the way you expect.

## Serve

```bash
tt serve Qwen3.8-27B
```

`tt serve` picks the serving path from the model name: [TT-Inference-Server](https://github.com/tenstorrent/tt-inference-server) for catalog models, TT-Studio for the few only it carries, and [tt-model-manager](https://github.com/tenstorrent/tt-model-manager) for a community bundle id. For a catalog model it installs TT-Inference-Server on first use, pulls the model's container image, downloads the weights, opens the devices, loads the weights, and warms the model up. It shows those stages as a live checklist with their elapsed times and returns only once the endpoint actually answers requests. A first serve of Qwen3.8-27B on a TT-QuietBox 2 looks like this:

```
  ✓ host ready  tt-inference-server 0.25.0
  ✓ weights ready  Qwen/Qwen3.8-27B  6m 53s
  ✓ image ready  vllm-tt-metal-src-release-ubuntu-22.04-amd64:0.25.0  1m 37s
  ✓ container started  tt-inference-server-d02c18d2  3.8s
  ✓ engine started  vLLM 0.26.0  17.8s
  ✓ Tenstorrent device opened  4 chips · mesh (1, 4)  7.0s
  ✓ KV cache configured  1,051,104 tokens  3m 28s
  ✓ model warmed up  209s of warmup
  ✓ API server started  1.8s
  ✓ endpoint answering
✓ Phase 3/3 · Start  15m 26s
╭─ Qwen3.8-27B ready ────────────────────────────────────────────────────────╮
│                                                                            │
│  endpoint  http://127.0.0.1:20000/v1                                       │
│  models    curl http://127.0.0.1:20000/v1/models                           │
│  chat      tt launch                                                       │
│  Ready in 15m 26s · via tt-inference-server                                │
│  Logs · tt model logs Qwen3.8-27B --follow                                 │
│  Stop · tt model stop Qwen3.8-27B                                          │
╰────────────────────────────────────────────────────────────────────────────╯
```

The stages are the same for every model of a kind; the times are not. Most of a first serve is the download: here the container image (about 18 GB) and the weights (56 GB) took nine minutes, then the model was compiled and warmed up on the hardware. Everything downloaded and compiled is cached, so later serves of the same model are faster: about seven minutes for Qwen3.8-27B on a TT-QuietBox 2, most of it sizing the KV cache and warming up. `tt model pull <model>` downloads the weights ahead of time. A media model's checklist has fewer stages: it loads the model and starts answering, without a KV cache or warmup.

To watch the raw server log while you wait, run `tt model logs <model> --follow` in a second terminal. Pressing Ctrl-C in the `tt serve` terminal stops watching, not the server. `tt serve` waits up to an hour for the endpoint to answer, then stops watching and leaves the server running; set `TT_SERVE_READY_TIMEOUT` to a number of seconds to wait longer.

## Send a first request

The endpoint speaks the OpenAI API on port 20000, so any OpenAI-compatible client can use it: point the client at `http://localhost:20000/v1` with any value for the API key. For an LLM, `tt model curl` sends a chat completion without any JSON on your part:

```bash
tt model curl "In one sentence, what is Tenstorrent?" --max-tokens 2048
```

`tt model curl` asks the server which model it is serving, sends your prompt, and prints the server's JSON chat completion. Any option it does not recognize goes straight into the request body, which is how `--max-tokens` reaches the server. Qwen3.8-27B is a reasoning model: it thinks first, in a separate `reasoning` field of the reply, and then answers in `content`, and its default budget of 64 tokens is used up by the thinking, which is why the example raises it. Add `--print` to see the equivalent `curl` command instead of sending it.

Which route an application calls depends on the kind of model:

| Kind of model | Route |
| :--- | :--- |
| Large language and vision-language models | `/v1/chat/completions` |
| Speech recognition | `/v1/audio/transcriptions` |
| Text to speech | `/v1/audio/speech` |
| Image generation | `/v1/images/generations` |
| Video generation | `/v1/videos/generations`, polled at `/v1/videos/generations/<job_id>` |
| Embeddings | `/v1/embeddings` |

## Options

```bash
tt serve <model> --port 20001        # serve on a port other than 20000
tt serve <model> --device p150x4     # override the detected device configuration
tt serve <model> -- <server args>    # anything after -- is passed through to the server itself
tt serve <model> --studio            # serve through TT-Studio instead of directly
```

## Manage what is running

```bash
tt model ps              # what is being served, on which port, and whether it is healthy
tt model logs <model>    # the server's log (--follow to stream it)
tt model stop <model>    # stop the server; the weights stay cached
```

A model server that was stopped or crashed can leave the devices in a state the next server cannot use. The server log then ends with a `TT_THROW` message that asks you to reset the board. `tt device reset` resets every device; it asks for confirmation because it interrupts any running workload, and `tt device status` should show the devices back at their idle clock afterwards.

## Serve through TT-Studio

[TT-Studio](https://github.com/tenstorrent/tt-studio) is a web application that serves the same catalog and gives you a browser interface for each kind of model: chat with knowledge bases for language models, image and video generation for diffusion models, speech-to-text for recognition models, object detection for vision models, and a voice agent that chains them. Every model TT-Studio serves is also on an API endpoint on port 20000, so applications can use it at the same time as the browser does. TT-Studio requires Docker.

```bash
tt serve Qwen3.8-27B --studio
```

TT-Studio takes port 3000 and the devices for itself, so stop anything `tt serve` or `tt launch` started first. A model server that was stopped by `tt model stop` leaves the devices in a state TT-Studio cannot initialize, so reset them before you start:

```bash
tt launch stop openwebui
tt model stop Qwen3.8-27B
tt device reset
tt serve Qwen3.8-27B --studio
```

On first use `tt` fetches the latest TT-Studio release. TT-Studio asks you to accept its terms and offers to add a `tt-studio` shortcut to your shell. It then brings up its services and prints a `TT Studio is ready` box with its web UI at `http://localhost:3000`, serves the model, and prints a ready box with the model's endpoint and the **Models Deployed** page at `http://localhost:3000/models-deployed`, which lists every running model with its health, the chips it occupies, its log, and a control to delete it. With the images already downloaded this takes a few minutes. Without a model name, `tt serve --studio` lists everything TT-Studio can run on your system and asks which one you want.

`tt model stop <model>` stops a model that TT-Studio is serving, resets the chips it was using, and takes TT-Studio's services down with it, keeping its settings, downloaded weights, chat history, and knowledge bases for next time. With the `tt-studio` shortcut you can also manage TT-Studio directly:

```bash
tt-studio --stop-model <model>   # stop one model and keep TT-Studio running
tt-studio --status               # a live view of the running stack
tt-studio --logs                 # stream the logs of every TT-Studio service
tt-studio --stop                 # stop TT-Studio, keeping its data
```

## Troubleshooting

**`tt serve` stops before starting, asking for a Hugging Face token.** Catalog models require a Hugging Face login to download their weights. Run `tt model login`; see [Finding models](models.md#log-in-to-hugging-face).

**`tt serve` fails with "Access to model … is restricted", or the download stops with "requires approval".** The model is gated and your Hugging Face account has not been granted access yet, or the login on this machine is for a different account. Accept the license on the model's Hub page, wait for the owner to approve the request if the model requires that, check `tt model login`, and serve again. `tt model logs <model>` shows the server's own output for any failed start.

**A serve fails with "Try resetting the board".** Run `tt device reset` and serve again, as described above.

**`tt serve` says the model did not report ready within 60 minutes.** A cold start of a large model compiles for your hardware and can be slow. Check whether it is still making progress with `tt model logs <model> --follow`; `tt model ps` reports it `healthy` once it answers. If the log shows an error, stop the server with `tt model stop <model>`.

**TT-Studio does not start because port 3000 is in use.** TT-Studio needs port 3000 and does not move to another one. Stop whatever is using it first, for example `tt launch stop openwebui`.

**Running out of disk space.** `tt model rm <model>` removes a model's local artifacts and keeps its weights; add `--include-weights` to remove those too. The weights live under `~/.cache/huggingface`.
