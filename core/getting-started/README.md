---
myst:
  html_meta:
    product-name: tt (Tenstorrent CLI), tt-cli, tt-installer, TT-SMI, TT-Inference-Server, TT-Studio
    technology-concepts: software installation, golden versions, driver, firmware, model serving, OpenAI-compatible API, Docker
    document-type: how-to
---

# Getting Started with Tenstorrent Software

This guide takes you from a fresh Tenstorrent system to a model generating tokens. You will install the Tenstorrent CLI, `tt`, use it to update your system to the most recent tested set of Tenstorrent software, confirm your hardware is visible, see which models your hardware can run, and serve a model.

`tt` is the single entry point to the Tenstorrent software stack. All layers of the stack can be accessed via the CLI. When you are ready to go deeper, for example to write kernels with TT-Metalium™, run models with TT-NN™, or deploy through a web interface with TT-Studio, `tt` is where you branch off into those projects.

## **Before You Begin**

:::{note}
Setting up your new TT-QuietBox® 2? Follow the [Setup Guide](../systems/quietbox/quietbox-bh-2/setup.md).
:::

Before you begin, ensure your host machine meets the following prerequisites:

* The host machine has an internet connection. The CLI downloads packages from PyPI and GitHub, the Tenstorrent package repositories, and model weights from the Hugging Face Hub.
* The host machine has a supported operating system installed (see below).
* You have administrator (`sudo`) privileges on the host machine. The driver, firmware tooling, and HugePages configuration are installed as root.
* The system is physically unboxed and set up according to your product's installation manual and safety guidelines.

### **Supported Operating Systems**

Tenstorrent recommends Ubuntu LTS for all Tenstorrent software.

| Operating system | Status |
|---|---|
| Ubuntu 22.04 LTS, Ubuntu 24.04 LTS | Supported |
| Debian 13, Fedora 42, Fedora 43 | Supported, with less testing than Ubuntu |
| Other Debian and RPM based distributions | Untested and considered experimental |
| macOS, Windows, WSL | Not supported. There is no driver, so nothing hardware-related works |

### **BIOS Requirements**

The BIOS for your host motherboard should configure the PCIe AER Reporting Mechanism to be set to `OS First`. Tenstorrent's TT-SMI software requires this setting to function properly.

:::{important}
If you are using a TT-QuietBox, you do not have to worry about setting this option. It is set to `OS First` by default.

If you update or reset your BIOS for any reason, you must reconfigure the PCIe AER Reporting Mechanism setting to `OS First` to ensure TT-SMI functions correctly. This setting is typically located in the **Motherboard Information** section of your BIOS.
:::

### **Install the CLI Dependencies**

The `tt` CLI is a Python application. It needs Python 3.10 or newer with the `venv` module, plus `git` and `curl`. Install them with your system package manager.

On Ubuntu or Debian:

```bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip git curl ca-certificates
```

On Fedora:

```bash
sudo dnf install -y python3 python3-pip git curl
```

The CLI must live in its own isolated Python environment so that it can safely update itself later. Tenstorrent recommends [uv](https://docs.astral.sh/uv/) to manage that environment. Install it with:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Then open a new terminal, or run `source ~/.bashrc`, so that `uv` is on your `PATH`.

:::{note}
If you already use [pipx](https://pipx.pypa.io/), it works too. Install the CLI with `pipx install tenstorrent` in the next step instead of the `uv` command. Other installation options are described in the [tt-cli developer notes](https://github.com/tenstorrent/tt-cli/blob/main/docs/DEVELOPERS.md#other-ways-to-install-tt-cli).
:::

---

## **Step 1: Install the Tenstorrent CLI**

Install the CLI as a `uv` tool and make sure it is on your `PATH`:

```bash
uv tool install tenstorrent
uv tool update-shell
```

Open a new terminal, then confirm the CLI runs:

```bash
tt --version
```

The first time you run a `tt` command in a terminal it asks once whether you want to share anonymous usage telemetry. Telemetry is opt-in. Nothing is collected unless you say yes, and you can change your answer at any time with `tt config set telemetry.enabled true` or `false`. See the [telemetry policy](https://github.com/tenstorrent/tt-cli/blob/main/TELEMETRY.md) for exactly what is collected.

Run `tt --help` to see the command groups. The ones used in this guide are `update`, `device`, `model`, `serve`, and `launch`.

:::{note}
`tt` is beta software and is evolving quickly. If you hit a problem, `tt report issue` opens a prefilled GitHub issue with your environment details already collected.
:::

---

## **Step 2: Install the Software Stack with `tt update`**

Tenstorrent publishes a tested set of component versions, called the **golden** versions, that are validated to work together: the kernel-mode driver (TT-KMD), device firmware, HugePages configuration, TT-SMI, TT-Flash, and a container runtime for serving models. `tt update` brings your system onto that set in one command. On a fresh machine it installs everything. On a machine that already has Tenstorrent software it changes only what differs from golden, so you can rerun it any time to get back to a known-good state.

To see what would change without changing anything, preview it first:

```bash
tt update --dry-run
```

The plan lists each component, the version installed, the golden version, and the action `tt update` would take:

```
✓ Fetching golden versions (v3.0.0)  v3.0.0
                       Update plan (goldens: golden.json v3.0.0)
┏━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┓
┃ component           ┃ kind     ┃ installed ┃ golden                     ┃ action   ┃
┡━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━┩
│ tt-flash            │ uv-tool  │ —         │ 4.0.0                      │ install  │
│ tt-inference-server │ git-venv │ —         │ v0.25.0                    │ optional │
│ tt-model            │ uv-tool  │ —         │ a7aa9cefdd3086b091b…       │ install  │
│ tt-smi              │ uv-tool  │ —         │ 6.6.0                      │ install  │
│ tt-studio           │ git-venv │ —         │ v2.12.0                    │ optional │
│ system-stack        │ system   │ —         │ hugepages 1.4.1, kmd       │ converge │
│                     │          │           │ 2.11.0, sfpi 7.71.0,       │          │
│                     │          │           │ firmware 19.15.0 (via      │          │
│                     │          │           │ install.sh 3.6.2)          │          │
└─────────────────────┴──────────┴───────────┴────────────────────────────┴──────────┘
```

Components marked `optional` are fetched automatically the first time a command needs them, so `tt update` leaves them alone unless you pass `--include-lazy`.

Now run the update:

```bash
tt update
```

`tt update` works in three phases:

1. **Checks.** It fetches the golden version manifest and verifies its checksum.
2. **Tools.** It installs TT-SMI, TT-Flash, and the model manager into isolated environments under `~/.local/share/tenstorrent/`, where they cannot conflict with each other or with your own Python environment.
3. **System.** It downloads the matching [tt-installer](https://github.com/tenstorrent/tt-installer) release and runs it non-interactively. This phase asks for your `sudo` password and installs the base packages, the Tenstorrent package repositories, TT-KMD, HugePages, firmware, and Docker if no container runtime is present. It also installs a `tt-metalium` command that opens the TT-Metalium™ development container, for when you want to go deeper later.

:::{admonition} Required
:class: warning
**Using sudo is required, so you must enter your user's password when prompted.**

`tt update` also asks you to confirm before it flashes firmware, because flashing resets the devices. On a fresh machine it cannot read the current firmware yet, so the prompt is `Continue with tt update? [y/N]` with a warning that continuing may flash and reset your devices. Stop any running model workloads first, then answer **y**. On a machine that already has the driver, the prompt only appears when the firmware is older than golden.
:::

On a TT-QuietBox 2 with a fast connection the whole update takes a few minutes. It ends with a summary like `Update complete: 3 tool(s) updated, 2 optional (--include-lazy), system stack converged.`

### **Bring the CLI itself up to date**

The installer that `tt update` runs also installs the `tt` release that was validated with the golden set, which can be older than the one you installed in Step 1. This page documents the latest release, so before you move on, put the CLI back on it:

```bash
tt self update
```

It prints `tt upgraded: 1.0.1 → 1.2.0` when it had something to do, or `tt 1.2.0 is the newest release.` when you are already current. Keep both halves current over time: `tt update` converges the system stack and tools onto the latest golden set, and `tt self update` upgrades the CLI. `tt` also checks for a newer release once a day and prints a notice when one is available.

### **Reboot after the first install**

`tt update` never reboots your machine for you. If this is the first time the driver was installed on this machine, or HugePages configuration changed, **reboot now** before continuing:

```bash
sudo reboot
```

If `tt update` installed Docker, it also adds your user to the `docker` group. That takes effect when you log in again, which the reboot takes care of.

---

## **Step 3: Verify Your Hardware**

After rebooting, confirm the driver is loaded and that every Tenstorrent device in your system is visible:

```bash
tt device status
```

You should see one row per device, with the board type, PCIe bus address, and live telemetry. Here is an example from a TT-QuietBox 2 with four Blackhole p300 cards:

```
                Tenstorrent devices (driver: TT-KMD 2.11.0)
┏━━━┳━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━┓
┃ # ┃ Board ┃ Bus ID       ┃ Temp    ┃ Power  ┃ AIClk     ┃ Voltage ┃ DRAM ┃
┡━━━╇━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━┩
│ 0 │ p300c │ 0000:01:00.0 │ 43.9 °C │ 31.0 W │ 800.0 MHz │ 0.71 V  │ True │
│ 1 │ p300c │ 0000:02:00.0 │ 44.4 °C │ 17.0 W │ 800.0 MHz │ 0.71 V  │ True │
│ 2 │ p300c │ 0000:03:00.0 │ 43.6 °C │ 16.0 W │ 800.0 MHz │ 0.72 V  │ True │
│ 3 │ p300c │ 0000:04:00.0 │ 45.1 °C │ 16.0 W │ 800.0 MHz │ 0.72 V  │ True │
└───┴───────┴──────────────┴─────────┴────────┴───────────┴─────────┴──────┘
```

The number of rows should match the number of Tenstorrent devices installed in your system. For more detail on a device, such as its firmware versions and board ID, run `tt device info`. For a live, interactive view, run `tt smi`, which hands your terminal to the TT-SMI interface. Press **Q** to leave it.

Here is an example of the TT-SMI interface for a system containing a single p150a device:

![](tt_smi_screenshot.png)

:::{admonition} Important
:class: danger
If the number of listed devices does not match what you expect, see [Troubleshooting](#troubleshooting) below. If the problem persists, [contact support](#need-additional-support) and we will assist you.
:::

Congratulations, your system software is installed and your hardware is ready to use.

---

## **Step 4: See Which Models You Can Run**

`tt` knows your hardware, so it can tell you which models are validated to run on it. List them:

```bash
tt model list
```

The list is filtered to the device configuration `tt` detected. Here is a trimmed example for a TT-QuietBox 2, which `tt` detects as a `p300x2` configuration:

```
  Models (tt catalog + community) for p300x2 (detected — `tt model list --all` for every device/bundle)
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┓
┃ name                      ┃ source              ┃ engine        ┃ serving profiles                  ┃ weights   ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━┩
│ anirud/devstral-small-2-24b-instruct-2512 │ HuggingFace │ vLLM │ p150x4, p300, p300x2             │ —         │
│ FLUX.1-dev                │ tt-inference-server │ media         │ p300, p300x2                      │ —         │
│ Llama-3.3-70B-Instruct    │ tt-inference-server │ vLLM          │ p150x4, p300x2                    │ —         │
│ Qwen3-32B                 │ tt-inference-server │ vLLM          │ p150x4, p300x2                    │ —         │
│ Qwen3.5-9B                │ tt-studio           │ vLLM          │ p150                              │ —         │
│ Qwen3.8-27B               │ tt-inference-server │ vLLM          │ p150x4, p300x2                    │ —         │
│ whisper-large-v3          │ tt-inference-server │ media         │ p150                              │ —         │
└───────────────────────────┴─────────────────────┴───────────────┴───────────────────────────────────┴───────────┘
source: tt-inference-server/tt-studio catalog vs. HuggingFace/local community.
```

The columns tell you:

* **source**: where the model comes from. `tt-inference-server` and `tt-studio` rows are the **released catalog**, the models Tenstorrent ships and tests. `HuggingFace` rows are **community bundles** that anyone can publish to the Hugging Face Hub with the Tenstorrent model manager. Community bundles are not tested or maintained by Tenstorrent, and are served by their full `namespace/name` id. `local` marks a bundle already installed on this machine.
* **engine**: how the model is served. `vLLM` models expose an OpenAI-compatible chat API, `media` models expose image, video, or speech endpoints, and `forge` models run through the TT-Forge™ compiler.
* **serving profiles**: the board or mesh configurations the model has a serving configuration for. Your detected configuration is always among them.
* **weights**: whether the model's weights are already downloaded on this machine, and how much space they take.

Useful ways to narrow the list, and to learn more about one model:

```bash
tt model list --catalog               # only the released catalog
tt model list --type llm              # only large language models
tt model list --all                   # every model on every device, not just this machine's
tt model info Qwen3.8-27B             # requirements, validation status per board, and how to serve it
```

`tt model info` is the place to check before you serve a model. It reports the minimum disk space and host RAM the model needs, the serving paths it supports, and its validation status on each board: `COMPLETE` models are fully validated, `FUNCTIONAL` models run and produce correct output but may not yet reach target performance, and `EXPERIMENTAL` models are early.

:::{tip}
To find community bundles for a specific model, search the Hub with `tt model search <query>`, for example `tt model search gpt-oss`. The [community models guide](https://github.com/tenstorrent/tt-cli/blob/main/docs/community-models.md) explains how bundles are packaged, published, and pulled.
:::

### **Log In to Hugging Face**

Catalog models download their weights from the [Hugging Face Hub](https://huggingface.co), so serving needs a Hugging Face account and login, even for freely available models. Some models are also gated, which means you must visit the model's page on the Hub and accept its license before you can download it. Meta's Llama and Google's Gemma models are gated; Qwen models are not.

1. Create a Hugging Face account at [huggingface.co/join](https://huggingface.co/join) if you do not have one.
2. For a gated model, open its page on the Hub and accept the license agreement. Approval can take a few minutes. The model's `hf_repo` line in `tt model info` tells you which page that is.
3. Log in from your machine so that `tt` can download on your behalf:

```bash
tt model login
```

`tt model login` offers two ways to log in. **Log in with your browser** shows a URL and a short code: open the URL on any device, enter the code, and approve the request. **Paste an access token** takes a read token you create at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). Either way, the login is saved in Hugging Face's own token store, so it is also picked up by any other Hugging Face tooling you use, and `tt serve --dry-run` reports it as `HF token: from the Hugging Face login store`.

---

## **Step 5: Serve a Model**

Serving a model gives you an OpenAI-compatible API endpoint running on your Tenstorrent hardware. Pick an LLM from your `tt model list` output. This guide uses `Qwen3.8-27B`, which is fully validated on the TT-QuietBox 2 and other four-chip Blackhole systems, and needs no license agreement on the Hub. On other hardware pick an LLM from your own list, for example `Qwen3-32B` on a Wormhole TT-LoudBox or `Qwen3-8B` on a single n150 or n300. Check what the model needs first:

```bash
tt model info Qwen3.8-27B
```

Qwen3.8-27B needs 74 GB of free disk space and 67.5 GB of host memory, and `tt model info` reports it as `COMPLETE` on the p300x2 configuration of a TT-QuietBox 2. Serve it:

```bash
tt serve Qwen3.8-27B
```

`tt serve` picks the right serving path for the model, installs TT-Inference-Server on first use, pulls the model's container image, downloads the weights, opens the device, loads the weights, and warms the model up. It shows those stages as a live checklist and returns only once the endpoint actually answers requests:

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

:::{note}
The first serve of a model takes a while: the container image (about 18 GB) and the weights (56 GB for Qwen3.8-27B) are downloaded, then the model is compiled and warmed up on your hardware. The run above is a first serve on a TT-QuietBox 2 and took 15 minutes, 7 of them downloading weights. Everything it downloaded and compiled is cached, so later serves of the same model are faster: about seven minutes for Qwen3.8-27B on a TT-QuietBox 2, most of it sizing the KV cache and warming up. `tt model pull Qwen3.8-27B` downloads the weights ahead of time.

To watch the raw server log while you wait, run `tt model logs Qwen3.8-27B --follow` in a second terminal. Pressing Ctrl-C in the `tt serve` terminal stops watching, not the server.
:::

When the ready box appears, the model is being served on port 20000. Send it a first request:

```bash
tt model curl "In one sentence, what is Tenstorrent?" --max-tokens 2048
```

`tt model curl` asks the server which model it is serving, sends your prompt, and prints the server's JSON chat completion. Qwen3.8-27B is a reasoning model: it thinks first, in a separate `reasoning` field of the reply, and then answers in `content`. Its default budget of 64 tokens is used up by the thinking, which is why the example raises it with `--max-tokens`; any option `tt model curl` does not recognize goes straight into the request body. The one-sentence answer arrives in a few seconds. An open question such as "What can you tell me about Tenstorrent?" takes a couple of minutes, because the model reasons at length before it writes. Add `--print` to see the equivalent `curl` command instead of sending it. The endpoint speaks the OpenAI chat completions API, so any OpenAI-compatible client can use it: point the client at `http://localhost:20000/v1` with any value for the API key. Use `--port` on `tt serve` to choose a different port.

A few commands to manage what is running:

```bash
tt model ps              # what is being served, on which port, and whether it is healthy
tt model logs Qwen3.8-27B  # the server's log
tt model stop Qwen3.8-27B  # stop the server
```

:::{tip}
`tt serve <model> --dry-run` shows the backend, device configuration, container image, and port that would be used without starting anything. It is a quick way to confirm `tt` detected your hardware the way you expect.
:::

---

## **Step 6: Connect an App with `tt launch`**

An API endpoint is the foundation. `tt launch` connects a ready-made application to it, so you can start using the model right away. See which clients are available on your machine:

```bash
tt launch list
```

```
                                        tt launch
┏━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ client      ┃ kind        ┃ model          ┃ status         ┃ configures                           ┃
┡━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ opencode    │ terminal    │ tool calling   │ needs opencode │ ~/.config/opencode/opencode.json     │
│ pi          │ terminal    │ tool calling   │ needs pi       │ ~/.pi/agent/models.json              │
│ aider       │ terminal    │ tool calling   │ needs aider    │ environment (this run only)          │
│ qwencode    │ terminal    │ tool calling   │ needs qwen     │ command-line arguments (this run only) │
│ hermes      │ terminal    │ tool calling   │ needs hermes   │ environment (this run only)          │
│ openwebui   │ web service │ any chat model │ ready          │ container tt-open-webui              │
│ anythingllm │ web service │ any chat model │ ready          │ container tt-anythingllm             │
└─────────────┴─────────────┴────────────────┴────────────────┴──────────────────────────────────────┘
```

There are two kinds of client:

* **Web UIs** such as [Open WebUI](https://github.com/open-webui/open-webui) and [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm). `tt` pulls and runs these for you in a container, after asking once. They show as `ready` as soon as Docker is available.
* **Terminal coding agents** such as OpenCode, Aider, pi, Qwen Code, and Hermes Agent. You install the agent yourself, and `tt` writes the small configuration it needs to reach your model. These need a model that supports tool calling, which `tt` checks for you.

With the model from Step 5 still being served, launch a chat interface in your browser:

```bash
tt launch openwebui
```

`tt` asks the server which model it is serving, then asks you to confirm before it pulls the image: `Pull ghcr.io/open-webui/open-webui:main (a few GB) and run it as tt-open-webui on port 3000. Continue? [y/N]`. It starts the container, prints a summary of what it connected, and ends with `tt-open-webui is ready at http://localhost:3000`. Open that URL in your browser. No sign-in is needed: pick the model and start chatting with it running on your Tenstorrent hardware.

When you are done:

```bash
tt launch stop openwebui   # stop the web UI; its data is kept
tt model stop Qwen3.8-27B  # stop the model server
```

The full list of clients, what each one needs installed, and the options for connecting to a server on another machine are in the [client launchers guide](https://github.com/tenstorrent/tt-cli/blob/main/docs/client-launchers.md).

### **Prefer a point-and-click experience? Use TT-Studio**

[TT-Studio](https://github.com/tenstorrent/tt-studio) is a web application that deploys models and gives you a browser interface for them in one place. It is a serving path rather than a `tt launch` client, so you start it with `tt serve`. TT-Studio takes the devices and port 3000 for itself, so stop the web UI and the model server from the steps above first, and reset the devices, because a model server that was stopped by `tt model stop` leaves them in a state TT-Studio's deploy cannot initialize:

```bash
tt launch stop openwebui
tt model stop Qwen3.8-27B
tt device reset
tt serve Qwen3.8-27B --studio
```

On first use `tt` fetches the latest TT-Studio release. TT-Studio asks you to accept its terms and offers to add a `tt-studio` shortcut to your shell, which you can decline. It then brings up its services and prints a `TT Studio is ready` box with its web UI at `http://localhost:3000`, deploys the model, and prints a `Qwen3.8-27B is ready` box with the endpoint, again on port 20000, and the page that manages the deployment, `http://localhost:3000/models-deployed`. With the images already downloaded this takes a few minutes. TT-Studio requires Docker.

Stopping works as before. `tt model stop Qwen3.8-27B` stops the model through TT-Studio, resets the devices, and takes TT-Studio's services down with it, keeping its settings, downloaded weights, and chat history for next time.

---

## **Troubleshooting**

### `tt device status` reports no devices

If `tt device status` exits with a message that the driver may not be installed or no card is seated:

1. If you have not rebooted since `tt update` installed the driver, reboot now.
2. Run `lspci -d 1e52` to check whether the card has enumerated on the PCIe bus. If it returns nothing, the host cannot see the card at all.
3. For Blackhole PCIe products such as p100 and p150, verify the card is being supplied power by checking that the fan spins and the green power LED illuminates when the system boots. If the light is on, try resetting the card with `tt device reset`.
4. Confirm the BIOS setting described in [BIOS Requirements](#bios-requirements).

### `tt serve` stops before starting, asking for a Hugging Face token

Catalog models require a Hugging Face login to download their weights. Run `tt model login` as described in [Step 4](#log-in-to-hugging-face).

### `tt serve` fails with "Access to model … is restricted"

The model is gated and your Hugging Face account has not accepted its license yet, or the login on this machine is for a different account. Accept the license on the model's Hub page, check `tt model login`, and serve again. If the error persists at the `starting the engine` step after both, serve a model that is not gated, such as `Qwen3.8-27B`. `tt model logs <model>` shows the server's own output for any failed start.

### A serve fails with "Try resetting the board"

A model server that was stopped or crashed can leave the devices in a state the next server cannot use. The server log then ends with a `TT_THROW` message that asks you to reset the board. Reset every device and serve again:

```bash
tt device reset
```

`tt device reset` asks for confirmation because it interrupts any running workload. `tt device status` should show the devices back at their idle clock afterwards.

### `tt launch` says port 3000 is already in use

Another service holds port 3000, for example TT-Studio or a development server of your own. The web UI container keeps the port it was created with, so `tt launch` prints the exact commands to recreate it on another port: `docker rm tt-open-webui && tt launch openwebui --web-port 3001`. The container's chat history lives in a separate volume and survives the recreate.

### Docker commands are refused with a permission error

`tt` talks to Docker as your user, never through `sudo`. If `tt update` just installed Docker, log out and back in (or reboot) so that your membership in the `docker` group takes effect. You can check with `docker run hello-world`.

### Getting help

`tt report bundle` collects a redacted support bundle with your environment details, a TT-SMI snapshot, and recent logs, and opens a prefilled email to Tenstorrent support with it attached. `tt report issue` opens a prefilled GitHub issue on the tt-cli repository.

---

## **Alternative Installation Methods**

`tt update` is the recommended way to install the system software, and it runs tt-installer for you with the tested versions. If you prefer to drive [tt-installer](https://github.com/tenstorrent/tt-installer) interactively yourself and choose each of its options, you can run it directly:

```bash
/bin/bash -c "$(curl -fsSL https://tenstorrent.ai/install.sh)"
```

For advanced users or developers who prefer to install and configure each component by hand, refer to the [manual software installation guide](./manual-software-install.md).

---

## **Where to Go Next**

You now have the full stack installed and a model serving from the CLI. From here, branch off into the part of the stack that matches what you want to build:

* **Deploy LLMs in production** with [TT-Inference-Server](./vLLM-servers.md), the serving engine behind `tt serve`. The [tt-inference-server repository](https://github.com/tenstorrent/tt-inference-server) is the authoritative source for which models are validated on your hardware.
* **Monitor your hardware** with `tt smi` for a status snapshot, or [TT-Toplike](https://docs.tenstorrent.com/tt-toplike/) for a live view of power, temperature, and core activity while a model serves requests.
* **Use a web interface** with [TT-Studio](https://github.com/tenstorrent/tt-studio), started through `tt serve <model> --studio`.
* **Understand the software stack**, including how TT-Forge™, TT-NN™, and TT-Metalium™ relate to each other, in the [software stack overview](./tt-software-stack.md).
* **Compile your own PyTorch, JAX, or ONNX models** with {doc}`TT-Forge™ <../forge/index>`.
* **Run and build models in Python** with [TT-NN™](https://docs.tenstorrent.com/tt-metal/latest/ttnn/), or **write custom kernels** with [TT-Metalium™](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/). `tt update` already installed a `tt-metalium` command that opens a shell inside the TT-Metalium container, with your home directory mounted and TT-NN ready to import; the image, about 4.5 GB, is pulled the first time you run it. Start with the [Metalium guide](https://github.com/tenstorrent/tt-metal/blob/main/METALIUM_GUIDE.md) to learn about the architecture.
* **Learn by building** with the hands-on lessons in the [TT VS Code Toolkit](https://docs.tenstorrent.com/tt-vscode-toolkit/).

---

## **Need Additional Support?**
If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.
