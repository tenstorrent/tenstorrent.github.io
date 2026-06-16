---
myst:
  html_meta:
    product-name: TT-QuietBox Blackhole™, Blackhole™ Networked AI Processor
    technology-concepts: Remote Desktop Protocol (RDP), GNOME Remote Desktop, FreeRDP, headless access, macOS
    document-type: Task-Based Guide (How-To)
---

# Remote Access to Your TT-QuietBox 2 from macOS

Follow this guide to get headless remote desktop access to your TT-QuietBox<sup>™</sup> 2 from macOS.

## One-Time TT-QuietBox 2 Setup

Log in to your TT-QuietBox 2, open a terminal, and run these commands to enable Ubuntu's remote desktop service:

```bash
sudo grdctl --system rdp enable
sudo grdctl --system rdp set-credentials '<rdp-user>' '<rdp-password>'
sudo systemctl enable --now gnome-remote-desktop.service
sudo ufw allow 3389/tcp
sudo grdctl --system status     # expect: RDP enabled, port 3389
```

You will see some warnings that are safe to ignore. Now get the local IP address of your TT-QuietBox 2 (usually `192.168.1.XXX`). You will need this when connecting via RDP:

```bash
hostname -I
```

:::{note}
Remote Desktop Protocol (RDP) credentials are arbitrary and separate from your `<ttuser>` login. By design, you authenticate twice (RDP credentials, then Ubuntu login).
:::

:::{admonition} Do not reuse a valuable password
:class: warning
The warning `Init TPM credentials failed ... using GKeyFile as fallback` is benign, but note that the credential is stored on disk under `/var/lib/gnome-remote-desktop/`, so **do not reuse a valuable password**.
:::

## One-Time macOS Setup

Install [FreeRDP](https://www.freerdp.com/), an open source remote desktop client, on your Mac. It can be installed directly from source or via Homebrew:

```bash
brew install freerdp
```

:::{admonition} Required on macOS 15+
:class: warning
Go to **System Settings → Privacy & Security → Local Network** and enable your terminal app. This can be stubborn, so it is a good idea to toggle it off/on and restart your terminal client. If the following steps still fail, you may need a reboot.
:::

## Connect

```bash
sdl-freerdp /v:<box-ip> /u:<rdp-user> /p:'<rdp-password>' /cert:tofu /dynamic-resolution
```

`/cert:tofu` trusts GNOME's self-signed certificate on first use. If everything worked correctly, you should see an Ubuntu login screen. If you get a blank screen, close **sdl-freerdp** and try again. If the problem persists, see the "Debugging" section below. Log in with your QuietBox credentials to begin the session, and quit the **sdl-freerdp** app to end it.

See the [FreeRDP manual](https://man.archlinux.org/man/extra/freerdp/sdl-freerdp3.1.en) for convenient flags and plugins. We often use this alias to begin a remote session with clipboard access and sound turned on:

```bash
alias qb2="sdl-freerdp /v:<box-ip> /u:<rdp-user> /p:'<rdp-password>' /cert:tofu /dynamic-resolution /sound +clipboard"
```

## Debugging

On your QuietBox (or via SSH), run the following to tail the RDP logs:

```bash
journalctl -u gnome-remote-desktop -f
```

New lines represent TCP requests reaching the box and should be debugged on the QuietBox. If no new lines are created upon login requests, that points to a network or macOS problem.
