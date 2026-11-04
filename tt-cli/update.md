---
myst:
  html_meta:
    product-name: tt (Tenstorrent CLI), tt-cli, tt-installer, TT-KMD, TT-SMI, TT-Flash
    technology-concepts: software installation, driver, firmware, HugePages, Docker
    document-type: reference
---

# Updating the Stack with `tt update`

Tenstorrent's system software stack consists of several components that are regularly tested together to ensure stability: device firmware, the kernel-mode driver (TT-KMD), HugePages configuration, TT-SMI, TT-Flash, and a container runtime for serving models. `tt update` brings your system up to the latest stable, tested combination of those components in one command. On a fresh machine it installs everything. On a machine that already has Tenstorrent software it changes only what is out of date, so you can rerun it at any time to get back to a known-good state.

## Preview the plan

To see what would change without changing anything, run the update with `--dry-run`:

```bash
tt update --dry-run
```

The plan lists each component, the version installed, the tested version, and the action `tt update` would take. The CLI labels the tested versions `golden` in its output. On a fresh machine every component is new:

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

The `kind` column says how a component is managed: `uv-tool` components are Python tools installed into their own environments, `git-venv` components are checked out from GitHub into their own virtual environments, and the `system-stack` row is everything tt-installer manages as root. Components marked `optional` are fetched automatically the first time a command needs them, so `tt update` leaves them alone unless you pass `--include-lazy`.

## Run the update

```bash
tt update
```

`tt update` works in three phases:

1. **Checks.** It fetches the manifest of tested versions and verifies its checksum.
2. **Tools.** It installs TT-SMI, TT-Flash, and the model manager into isolated environments under `~/.local/share/tenstorrent/`, where they cannot conflict with each other or with your own Python environment.
3. **System.** It downloads the matching [tt-installer](https://github.com/tenstorrent/tt-installer) release and runs it non-interactively. This phase asks for your `sudo` password and installs the base packages, the Tenstorrent package repositories, TT-KMD, HugePages, firmware, and Docker if no container runtime is present. It also installs a `tt-metalium` command that opens the TT-Metalium™ development container.

:::{admonition} Required
:class: warning
**Using sudo is required, so you must enter your user's password when prompted.**

`tt update` also asks you to confirm before it flashes firmware, because flashing resets the devices. On a fresh machine it cannot read the current firmware yet, so the prompt is `Continue with tt update? [y/N]` with a warning that continuing may flash and reset your devices. Stop any running model workloads first, then answer **y**. On a machine that already has the driver, the prompt only appears when the firmware is older than the tested version.
:::

On a TT-QuietBox 2 with a fast connection the whole update takes a few minutes. It ends with a summary like `Update complete: 3 tool(s) updated, 2 optional (--include-lazy), system stack converged.`

## After the update

**Bring `tt` itself up to date.** The installer that `tt update` runs also installs the `tt` release that was tested with that set of components, which can be older than the one you had. Run `tt self update` to return to the latest release. Over time, keep both halves current: `tt update` for the system stack and tools, `tt self update` for `tt`.

**Reboot after the first install.** `tt update` never reboots your machine for you. If this is the first time the driver was installed on this machine, or HugePages configuration changed, reboot before continuing:

```bash
sudo reboot
```

If `tt update` installed Docker, it also adds your user to the `docker` group. That takes effect when you log in again, which the reboot takes care of. `tt` talks to Docker as your user, never through `sudo`; `docker run hello-world` confirms the membership is active.

**Check the hardware.** `tt device status` should list every Tenstorrent device in the machine with the driver version in its title. If it reports no devices, see the [troubleshooting section](https://docs.tenstorrent.com/getting-started/README.html#troubleshooting) of the install guide.

## Running tt-installer yourself

`tt update` runs tt-installer for you with the tested versions. If you prefer to drive [tt-installer](https://github.com/tenstorrent/tt-installer) interactively and choose each of its options, you can run it directly:

```bash
/bin/bash -c "$(curl -fsSL https://tenstorrent.ai/install.sh)"
```

For installing and configuring each component by hand, refer to the [manual software installation guide](https://docs.tenstorrent.com/getting-started/manual-software-install.html).
