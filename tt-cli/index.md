---
myst:
  html_meta:
    product-name: tt (Tenstorrent CLI), tt-cli
    technology-concepts: command-line interface, software installation, model serving, telemetry
    document-type: reference
---

# Tenstorrent CLI

`tt` is the Tenstorrent command-line interface and the primary interface for operating your Tenstorrent hardware. It installs and updates the system software as one tested set, checks the devices in your machine, tells you which models they can run, serves those models as OpenAI-compatible endpoints, and connects applications to them.

[Installing Tenstorrent Software](https://docs.tenstorrent.com/getting-started/README.html) walks through a first install with `tt` and keeps to the commands a new system needs. These pages go deeper into each command group for when you want to know how it works or what else it can do. If you want to develop against Tenstorrent's open-source repositories rather than operate hardware, start with [TT-Metalium™](https://docs.tenstorrent.com/tt-metal/latest/tt-metalium/), [TT-NN™](https://docs.tenstorrent.com/tt-metal/latest/ttnn/), or [TT-Forge™](https://docs.tenstorrent.com/tt-forge/).

The source is in the [tt-cli](https://github.com/tenstorrent/tt-cli) repository on GitHub.

## Installing `tt`

`tt` is a Python application. It needs Python 3.10 or newer with the `venv` module, plus `git` and `curl`, and it must live in its own isolated Python environment so that it can update itself safely. Tenstorrent recommends [uv](https://docs.astral.sh/uv/) for that environment; follow the setup instructions at [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/) to install it. Then:

```bash
uv tool install tenstorrent
uv tool update-shell
```

Open a new terminal or source your shell configuration file (`source ~/.bashrc` for `bash`), then confirm `tt` runs with `tt --version`. If you already use [pipx](https://pipx.pypa.io/), `pipx install tenstorrent` works too. Other ways to install, including from a checkout of the repository, are in the [developer notes](https://github.com/tenstorrent/tt-cli/blob/main/docs/DEVELOPERS.md#other-ways-to-install-tt-cli).

Ubuntu 22.04 LTS and 24.04 LTS are the supported platforms. Other Linux distributions are untested. macOS and Windows are not supported, because there is no driver for them.

## Command groups

Run `tt` on its own to see the command groups. The ones you will use most:

| Group | What it does | More |
| :--- | :--- | :--- |
| `tt update` | Installs and updates the system software stack: driver, firmware, HugePages, TT-SMI, TT-Flash, and a container runtime. | [Updating the stack](update.md) |
| `tt device` | Shows the devices in the machine with live telemetry (`status`), their firmware and board details (`info`), and resets them (`reset`). | [Installing Tenstorrent Software](https://docs.tenstorrent.com/getting-started/README.html#step-3-verify-your-hardware) |
| `tt smi` | Hands the terminal to the interactive TT-SMI interface. Press **Q** to leave it. | |
| `tt model` | Lists the models validated for your hardware, inspects one, logs in to Hugging Face, and manages what is running. | [Finding models](models.md) |
| `tt serve` | Serves a model as an OpenAI-compatible endpoint, directly or through TT-Studio. | [Serving models](serve.md) |
| `tt launch` | Connects a web UI or a terminal coding agent to a running endpoint. | [Connecting apps](launch.md) |
| `tt config` | Reads and writes `tt`'s own settings, such as telemetry and the update check. | [Telemetry](#telemetry) |
| `tt report` | Collects a support bundle or opens a prefilled GitHub issue. | [Getting help](#getting-help) |
| `tt self` | Updates `tt` itself. | [Keeping tt up to date](#keeping-tt-up-to-date) |

Every command accepts `--help`. Most also accept `--json` for machine-readable output and `--offline` to run without any network access.

`tt serve` runs [TT-Inference-Server](https://github.com/tenstorrent/tt-inference-server) for you. To run that server directly, with its own deployment script and a vLLM endpoint you configure yourself, see [Deploy LLMs](deploy-llms.md).

## Keeping `tt` up to date

```bash
tt self update
```

`tt self update` upgrades `tt` to the newest release on PyPI and prints `tt upgraded: 1.0.1 → 1.2.0` when it had something to do, or `tt 1.2.0 is the newest release.` when you are already current. `tt` also looks up its newest release about once a day and prints a notice when one is available. That lookup carries only `tt`'s own version; `tt config set update.check false`, `TT_NO_UPDATE_CHECK=1`, or `--offline` turns it off.

The system software and `tt` are updated separately: `tt update` brings the system stack and the Tenstorrent tools to the latest tested set, and `tt self update` brings `tt` itself to the latest release. The installer that `tt update` runs also installs the `tt` release that was tested with that set, which can be older than the one you have, so run `tt self update` after `tt update` if the two disagree. See [Updating the stack](update.md).

## Telemetry

The first time you run `tt` at a real terminal it asks once whether to share anonymous usage telemetry:

```
Enable anonymous usage telemetry? [y/n]
```

Please consider saying yes. Telemetry tells Tenstorrent which commands people use, how long they take, and which ones fail, and that is what guides what gets fixed and built next. It is strictly opt-in: nothing is collected, stored, or sent unless you say yes, and saying no means you are never asked again. The question is never asked in scripts, pipelines, CI, or under `--json`, `--quiet`, or `--offline`; non-interactive installs simply stay opted out.

If you opt in, `tt` records one event per command: the command path such as `tt device status`, the names of the options you set (never their values), an argument value only when it is on a known list the CLI holds such as catalog model names, the exit-code category and how long the command took, coarse host facts such as OS type, CPU architecture, and Python version, and a random per-install id. It never collects free-form argument values, file paths, config values, environment variable values, hostnames, usernames, error messages, stack traces, IP addresses, or location.

You can see exactly what would be sent before you decide. Set `TT_TELEMETRY_LOG_FILE` on any command and read the file, which works without opting in and uploads nothing:

```bash
TT_TELEMETRY_LOG_FILE=/tmp/tt-events.jsonl tt device status
```

Change your answer at any time:

```bash
tt config set telemetry.enabled true    # opt in
tt config set telemetry.enabled false   # opt out, and delete anything not yet uploaded
```

Setting the cross-tool `DO_NOT_TRACK` environment variable also opts out. The [telemetry policy](https://github.com/tenstorrent/tt-cli/blob/main/TELEMETRY.md) lists every property an event can carry and every switch that controls it.

## Getting help

```bash
tt report bundle   # a redacted support bundle, attached to a prefilled email to Tenstorrent support
tt report issue    # a prefilled GitHub issue on the tt-cli repository
```

`tt report bundle` collects your environment details, a TT-SMI snapshot, and recent logs, with paths and identifiers redacted. `tt report issue` opens a GitHub issue with the environment details already filled in. For anything the documentation does not cover, [raise a support request](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1).

```{toctree}
:maxdepth: 1
:hidden:

update
models
serve
launch
deploy-llms
```
