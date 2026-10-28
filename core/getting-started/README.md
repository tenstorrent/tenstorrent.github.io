---
myst:
  html_meta:
    product-name: tt (Tenstorrent CLI), tt-cli, tt-installer, TT-SMI, TT-Inference-Server, TT-Studio
    technology-concepts: software installation, driver, firmware, model serving, OpenAI-compatible API, Docker
    document-type: how-to
---

# Installing Tenstorrent Software

This guide takes you from a fresh Tenstorrent system to a model generating tokens. You will install the Tenstorrent CLI, `tt`, use it to update your system to the latest stable Tenstorrent software, confirm your hardware is visible, see which models your hardware can run, and serve a model.

`tt` is the primary interface for operating your Tenstorrent hardware. If you want to develop against Tenstorrent's open-source repositories instead, start with [TT-Metalium™](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/), [TT-NN™](https://docs.tenstorrent.com/tt-metal/latest/ttnn/), or {doc}`TT-Forge™ <../forge/index>`.

## **Before You Begin**

:::{note}
Setting up your new TT-QuietBox® 2? Follow the [Setup Guide](../systems/quietbox/quietbox-bh-2/setup.md).
:::

Before you begin, ensure your host machine meets the following prerequisites:

* The host machine has an internet connection. `tt` downloads packages from PyPI and GitHub, the Tenstorrent package repositories, and model weights from the Hugging Face Hub.
* The host machine has a supported operating system installed (see below).
* You have administrator (`sudo`) privileges on the host machine. The driver, firmware tooling, and HugePages configuration are installed as root.
* The system is physically unboxed and set up according to your product's installation manual and safety guidelines.

### **Supported Operating Systems**

Tenstorrent recommends Ubuntu LTS for all Tenstorrent software.

| Operating system | Status |
|---|---|
| Ubuntu 22.04 LTS, Ubuntu 24.04 LTS | Supported |
| Other Linux distributions | Untested and considered experimental |
| macOS, Windows, WSL | Not supported. There is no driver, so nothing hardware-related works |

### **BIOS Requirements**

The BIOS for your host motherboard should configure the PCIe AER Reporting Mechanism to be set to `OS First`. Tenstorrent's TT-SMI software requires this setting to function properly.

:::{important}
If you are using a TT-QuietBox, you do not have to worry about setting this option. It is set to `OS First` by default.

If you update or reset your BIOS for any reason, you must reconfigure the PCIe AER Reporting Mechanism setting to `OS First` to ensure TT-SMI functions correctly. This setting is typically located in the **Motherboard Information** section of your BIOS.
:::

### **Install the Tenstorrent CLI Dependencies**

The Tenstorrent CLI, `tt`, is a Python application. It needs Python 3.10 or newer with the `venv` module, plus `git` and `curl`. Install them with your system package manager. On Ubuntu:

```bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip git curl ca-certificates
```

`tt` must live in its own isolated Python environment so that it can safely update itself later. Tenstorrent recommends [uv](https://docs.astral.sh/uv/) to manage that environment. Follow the setup instructions at [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/) to install `uv`, then open a new terminal or source your shell configuration file (`source ~/.bashrc` for `bash`) so that `uv` is on your `PATH`.

:::{note}
If you already use [pipx](https://pipx.pypa.io/), it works too. Install `tt` with `pipx install tenstorrent` in the next step instead of the `uv` command. Other installation options are described in the [tt-cli developer notes](https://github.com/tenstorrent/tt-cli/blob/main/docs/DEVELOPERS.md#other-ways-to-install-tt-cli).
:::

---

## **Step 1: Install the Tenstorrent CLI**

Install `tt` as a `uv` tool and make sure it is on your `PATH`:

```bash
uv tool install tenstorrent
uv tool update-shell
```

Open a new terminal or source your shell configuration file again, then confirm `tt` runs:

```bash
tt --version
```

The first time you run `tt` in a terminal it asks once whether you want to share anonymous usage telemetry. Please consider saying yes. Telemetry tells Tenstorrent which commands people use, how long they take, and which ones fail, and that is what guides what gets fixed and built next. It is strictly opt-in and records no prompts, file paths, hostnames, usernames, or IP addresses. You can see exactly what would be sent before you decide: set `TT_TELEMETRY_LOG_FILE=/tmp/tt-events.jsonl` on any command and read the file, which works without opting in and uploads nothing. You can change your answer at any time with `tt config set telemetry.enabled true` or `false`. The [telemetry policy](https://github.com/tenstorrent/tt-cli/blob/main/TELEMETRY.md) lists everything that is collected.

Run `tt` to see the command groups. The ones used in this guide are `update`, `device`, `model`, `serve`, and `launch`.

---

## **Step 2: Install the Software Stack with `tt update`**

Tenstorrent's system software stack consists of several components that are regularly tested together to ensure stability: device firmware, the kernel-mode driver (TT-KMD), HugePages configuration, TT-SMI, TT-Flash, and a container runtime for serving models. `tt update` brings your system up to the latest stable, tested combination of those components in one command. On a fresh machine it installs everything. On a machine that already has Tenstorrent software it changes only what is out of date, so you can rerun it at any time.

```bash
tt update
```

`tt update` installs the Tenstorrent tools into isolated environments under `~/.local/share/tenstorrent/`, where they cannot conflict with your own Python environment, then runs the matching [tt-installer](https://github.com/tenstorrent/tt-installer) release non-interactively to install the driver, firmware, HugePages configuration, and Docker if no container runtime is present.

:::{admonition} Required
:class: warning
**Using sudo is required, so you must enter your user's password when prompted.**

`tt update` also asks you to confirm before it flashes firmware, because flashing resets the devices. Stop any running model workloads first, then answer **y**.
:::

On a TT-QuietBox 2 with a fast connection the whole update takes a few minutes.

### **Bring `tt` itself up to date**

The installer that `tt update` runs also installs the `tt` release that was tested with that set of components, which can be older than the one you installed in Step 1. This page documents the latest release, so before you move on, put `tt` back on it:

```bash
tt self update
```

Keep both halves current over time: `tt update` for the system software and tools, and `tt self update` for `tt` itself. `tt` checks for a newer release once a day and prints a notice when one is available.

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

`tt` knows your hardware, so it can tell you which models are validated to run on it:

```bash
tt model list
```

The list is filtered to the device configuration `tt` detected. Rows whose `source` is `tt-inference-server` or `tt-studio` are the catalog of models that Tenstorrent ships and tests. Rows whose source is `HuggingFace` are community bundles that anyone can publish to the Hugging Face Hub; Tenstorrent does not test or maintain them. `tt model list --type llm` narrows the list to large language models.

Before you serve a model, check what it needs:

```bash
tt model info <model>
```

`tt model info` reports the disk space and host memory the model needs and its validation status on each board: `COMPLETE` models are fully validated, `FUNCTIONAL` models run and produce correct output but may not yet reach target performance, and `EXPERIMENTAL` models are early.

### **Log In to Hugging Face**

Catalog models download their weights from the [Hugging Face Hub](https://huggingface.co), so serving needs a Hugging Face account and login, even for freely available models. Some models are also gated, which means you must visit the model's page on the Hub and accept its license before you can download it. Meta's Llama and Google's Gemma models are gated; Qwen models are not.

1. Create a Hugging Face account at [huggingface.co/join](https://huggingface.co/join) if you do not have one.
2. For a gated model, open its page on the Hub and accept the license agreement. Approval can take a few minutes. The model's `hf_repo` line in `tt model info` tells you which page that is.
3. Log in from your machine so that `tt` can download on your behalf:

```bash
tt model login
```

`tt model login` offers two ways to log in: with your browser, by opening a URL and entering a short code, or by pasting a read token you create at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). The login is saved in Hugging Face's own token store, so any other Hugging Face tooling you use picks it up too.

---

## **Step 5: Serve a Model**

Serving a model gives you an OpenAI-compatible API endpoint running on your Tenstorrent hardware. This guide uses `Qwen3.8-27B`, which is fully validated on the TT-QuietBox 2 and other four-chip Blackhole systems, and needs no license agreement on the Hub. On other hardware pick an LLM from your own `tt model list`, for example `Qwen3-32B` on a Wormhole TT-LoudBox or `Qwen3-8B` on a single n150 or n300.

```bash
tt serve Qwen3.8-27B
```

`tt serve` installs TT-Inference-Server on first use, pulls the model's container image, downloads the weights, opens the devices, loads the model, and warms it up, showing each stage as a live checklist. It returns once the endpoint actually answers requests:

```
╭─ Qwen3.8-27B ready ────────────────────────────────────────────────────────╮
│                                                                            │
│  endpoint  http://127.0.0.1:20000/v1                                       │
│  models    curl http://127.0.0.1:20000/v1/models                           │
│  chat      tt launch                                                       │
│  Logs · tt model logs Qwen3.8-27B --follow                                 │
│  Stop · tt model stop Qwen3.8-27B                                          │
╰────────────────────────────────────────────────────────────────────────────╯
```

:::{note}
The first serve of a model takes a while: the container image (about 18 GB) and the weights (56 GB for Qwen3.8-27B) are downloaded, then the model is compiled and warmed up on your hardware. On a TT-QuietBox 2 a first serve of Qwen3.8-27B takes about 15 minutes; everything it downloads and compiles is cached, so later serves take about seven. `tt model pull Qwen3.8-27B` downloads the weights ahead of time.

To watch the raw server log while you wait, run `tt model logs Qwen3.8-27B --follow` in a second terminal. Pressing Ctrl-C in the `tt serve` terminal stops watching, not the server.
:::

When the ready box appears, the model is being served on port 20000. Send it a first request:

```bash
tt model curl "In one sentence, what is Tenstorrent?" --max-tokens 2048
```

`tt model curl` sends your prompt to the running server as a chat completion and prints the reply. Qwen3.8-27B is a reasoning model: it thinks first, in a separate `reasoning` field, and its default budget of 64 tokens is used up by the thinking, which is why the example raises it with `--max-tokens`. Add `--print` to see the equivalent `curl` command instead of sending it. The endpoint speaks the OpenAI chat completions API, so any OpenAI-compatible client can use it: point the client at `http://localhost:20000/v1` with any value for the API key.

A few commands to manage what is running:

```bash
tt model ps                # what is being served, on which port, and whether it is healthy
tt model logs Qwen3.8-27B  # the server's log
tt model stop Qwen3.8-27B  # stop the server
```

---

## **Step 6: Connect an App with `tt launch`**

An API endpoint is the foundation. `tt launch` connects a ready-made application to it, so you can start using the model right away. There are two kinds of client: web UIs such as [Open WebUI](https://github.com/open-webui/open-webui) and [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm), which `tt` pulls and runs for you in a container, and terminal coding agents such as OpenCode, Aider, pi, Qwen Code, and Hermes Agent, which you install yourself and `tt` configures to reach your model. `tt launch list` shows which are available on your machine.

With the model from Step 5 still being served, launch a chat interface in your browser:

```bash
tt launch openwebui
```

`tt` asks you to confirm before it pulls the image, starts the container, and ends with `tt-open-webui is ready at http://localhost:3000`. Open that URL in your browser. No sign-in is needed: pick the model and start chatting with it running on your Tenstorrent hardware.

When you are done:

```bash
tt launch stop openwebui   # stop the web UI; its data is kept
tt model stop Qwen3.8-27B  # stop the model server
```

The full list of clients, what each one needs installed, and the options for connecting to a server on another machine are in the [client launchers guide](https://github.com/tenstorrent/tt-cli/blob/main/docs/client-launchers.md).

### **Prefer a point-and-click experience? Use TT-Studio**

[TT-Studio](https://github.com/tenstorrent/tt-studio) is a web application that deploys models and gives you a browser interface for them in one place. Start it with `tt serve <model> --studio`. TT-Studio takes the devices and port 3000 for itself, so stop the web UI and the model server from the steps above first, and reset the devices:

```bash
tt launch stop openwebui
tt model stop Qwen3.8-27B
tt device reset
tt serve Qwen3.8-27B --studio
```

On first use `tt` fetches the latest TT-Studio release and asks you to accept its terms. When it is ready, TT-Studio's web UI is at `http://localhost:3000` and the model's endpoint is on port 20000, as before. `tt model stop Qwen3.8-27B` stops the model and takes TT-Studio down with it, keeping its settings and downloaded weights for next time. TT-Studio requires Docker.

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

The model is gated and your Hugging Face account has not accepted its license yet, or the login on this machine is for a different account. Accept the license on the model's Hub page, check `tt model login`, and serve again. `tt model logs <model>` shows the server's own output for any failed start.

### A serve fails with "Try resetting the board"

A model server that was stopped or crashed can leave the devices in a state the next server cannot use. The server log then ends with a `TT_THROW` message that asks you to reset the board. Reset every device and serve again:

```bash
tt device reset
```

`tt device reset` asks for confirmation because it interrupts any running workload. `tt device status` should show the devices back at their idle clock afterwards.

### `tt launch` says port 3000 is already in use

Another service holds port 3000, for example TT-Studio or a development server of your own. `tt launch` prints the exact commands to recreate the web UI container on another port.

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

You now have the full stack installed and a model serving from the CLI. From here, pick the part of the stack that matches what you want to build:

* **Deploy LLMs in production** with [TT-Inference-Server](./vLLM-servers.md), the serving engine behind `tt serve`. The [tt-inference-server repository](https://github.com/tenstorrent/tt-inference-server) is the authoritative source for which models are validated on your hardware.
* **Monitor your hardware** with `tt smi` for a status snapshot, or [TT-Toplike](https://docs.tenstorrent.com/tt-toplike/) for a live view of power, temperature, and core activity while a model serves requests.
* **Use a web interface** with [TT-Studio](https://github.com/tenstorrent/tt-studio), started through `tt serve <model> --studio`.
* **Understand the software stack**, including how TT-Forge™, TT-NN™, and TT-Metalium™ relate to each other, in the [software stack overview](./tt-software-stack.md).
* **Compile your own PyTorch, JAX, or ONNX models** with {doc}`TT-Forge™ <../forge/index>`.
* **Run and build models in Python** with [TT-NN™](https://docs.tenstorrent.com/tt-metal/latest/ttnn/), or **write custom kernels** with [TT-Metalium™](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/). `tt update` also installed a `tt-metalium` command that opens a shell inside the TT-Metalium container, with your home directory mounted and TT-NN ready to import; the image, about 4.5 GB, is pulled the first time you run it. Start with the [Metalium guide](https://github.com/tenstorrent/tt-metal/blob/main/METALIUM_GUIDE.md) to learn about the architecture.
* **Learn by building** with the hands-on lessons in the [TT VS Code Toolkit](https://docs.tenstorrent.com/tt-vscode-toolkit/).

---

## **Need Additional Support?**
If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.
