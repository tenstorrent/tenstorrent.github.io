---
myst:
  html_meta:
    product-name: TT-QuietBox Blackhole™, Blackhole™ Networked AI Processor, Tensix core  
    technology-concepts: PCIe, QSFP-DD, Installation, Setup, Electrostatic Discharge (ESD), Basic Input/Output System (BIOS)  
    document-type: Task-Based Guide (How-To)
---

```{raw} html
<style>
/* ===== QB2 setup page — readability + visual polish (scoped to this page) ===== */

/* Comfortable reading rhythm */
.rst-content p,
.rst-content li { line-height: 1.7; }
.rst-content li { margin-bottom: 0.35rem; }

/* Page title: subtle brand accent */
.rst-content h1 {
  border-bottom: 3px solid #6454a0;
  padding-bottom: 0.4rem;
}

/* Step headings: clear separation between sections */
.rst-content h2 {
  margin-top: 2.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid #ece9f3;
  font-weight: 700;
}

/* Figures: centered, softly framed */
.rst-content div.figure,
.rst-content figure {
  margin: 1.6rem auto;
  text-align: center;
}
.rst-content div.figure img,
.rst-content figure img {
  border: 1px solid #e7e4f0;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(38, 38, 46, 0.08);
}

/* Quieter horizontal rules */
.rst-content hr {
  border: 0;
  border-top: 1px solid #ece9f3;
  margin: 2rem 0;
}
</style>
```

```{figure} ./qb2-setup-hero2.jpg
:width: 65%
:target: ./qb2-setup-hero2.jpg
```

# Hardware and Software Setup

This guide shows users how to safely unbox, setup hardware, and install software on a TT-QuietBox<sup>™</sup> 2 (Blackhole<sup>®</sup>) workstation.

## Before You Begin

Choose a suitable location for your System:
* Choose a stable area for the TT-QuietBox 2 where it will not need to be moved regularly. To ensure proper airflow intake, allow for 10 inches (25 cm) of clearance around the body of the workstation. Also avoid placing items on top of the workstation, as this can block the heat exhaust.
* The Power Supply Unit (PSU) on the TT-QuietBox 2 is rated to draw up to 1600W of power and has demonstrated drawing 1200W of power running image generation models. A standard 15A circuit can handle up to 1800W. When choosing the location of your TT-QuietBox 2, be mindful of the other electronics which may draw power from the same circuit. We recommend putting the TT-QuietBox 2 on a dedicated circuit, if not you may trip a breaker.
* Review the {ref}`safety warnings <safety-warnings>`.
* Inspect your package for signs of damage. Do not proceed with unboxing or installation if you suspect shipping damage to the system. Contact Tenstorrent support by [raising a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.


### Required Tools
Ensure you have everything you need to get started.

The Tenstorrent TT-QuietBox 2 (Blackhole) (TW-04003) package includes the following items:

* 1x TT-QuietBox 2 (Blackhole) workstation
* 1x Power Supply Cord (C19 to NEMA 5-15P)
* 1x AnkerWork S500 speakerphone (included for some early customers to develop with text-to-speech (TTS) and speech-to-text (STT) AI models)

For setup, you will also need your own:
* Keyboard
* Mouse
* HDMI cable + monitor

Note: Only use certified HDMI cables with the TT-QuietBox 2. Using non-certified HDMI cables may result in device damage, or non-compliant video operation.

---

## Step 1: Unbox the Workstation


1. Position the box in your prepared unboxing area, ensuring ample space to work around it.  
```{figure} ./qb2-unboxing-box.jpg
:width: 40%
```
2. Remove the white side clips near the bottom of the packaging. Squeeze the tabs on the clip and pull to release.
```{figure} ./qb2-unboxing-clips.jpg
:width: 40%
```

```{figure} ./qb2-unboxing-clip-release.jpg
:width: 40%
```

3. Lift box lid, remove accessories box and styrofoam, then remove internal cardboard case.
```{figure} ./qb2-unboxing-lift-sleeve.jpg
:width: 40%
```

```{figure} ./qb2-unboxing-remove-accessories.jpg
:width: 40%
```
```{figure} ./qb2-unboxing-lift-inner-box.jpg
:width: 40%
```

4. Lift the TT-QuietBox 2 out of the package using the handles.

```{figure} ./qb2-unboxing-lift-workstation.jpg
:width: 40%
```

5. Remove protective wrapping on all sides. 

```{figure} ./qb2-remove-plastic-front.jpg
:width: 40%
```

```{figure} ./qb2-remove-plastic-side.jpg
:width: 40%
```
---

## Step 2: Set Up the Hardware

```{figure} ./qb2-rear-view.jpg
:width: 60%
```

1. **Connect the power cable.** Connect the provided C19 power cable to the workstation and then to a dedicated power outlet. See the Electrical Safety section for the full list of power requirements. 

2. **Connect peripherals.** Connect the HDMI monitor, keyboard, and mouse to the back of the workstation. (Please note: video is not supported through the USB-C port). For internet connections, we recommend Ethernet over WiFi for faster downloading of models. If you prefer Ethernet, connect your Ethernet cable to the RJ45 port. 

3. **Power on the workstation.** On the back of the workstation, flip the switch on the PSU to the "I" position.  

4. **On the front of the workstation, press the power button to turn the system on.**

```{figure} ./qb2-power-button.jpg
:width: 40%
```

---

## Step 3. First-Time Log In

Once your system is booted up, the login prompt will appear.

Enter the default password: **ttuser**

## Step 4. Change Default Password

After logging in, open a Terminal window by pressing Ctrl+Alt+T and follow these steps to change your password from the public default: 

1. Run command: `passwd`
2. Enter current password: **ttuser**
3. Enter new password of your choosing and hit enter to confirm the change.

## Step 5. Setup and Confirm Internet Connection
TT-QuietBox 2 can be connected to the internet via WiFi or Ethernet cable. For faster model downloads, we recommend a direct Ethernet connection.

If you have not done so already during hardware setup, connect your Ethernet cable to the standard RJ45 port on the back of the workstation. Then, verify your internet connection by clicking on the status icons in the upper right corner of the screen. Confirm the internet connection reads "Wired."

If you would prefer to set up a WiFi connection, on your monitor, click on the status icons in the top right corner of the screen. Then, click on "Wi-Fi" (it may say "not connected" or "off"). Select your WiFi network from the drop-down list, enter the password, and click "Connect."

## Step 6. Update System Software

TT-QuietBox 2 comes pre-installed with the Ubuntu operating system (24.04.3 LTS). 

**Step 1:** Upon logging in, a Ubuntu Software Updater may offer a prompt that new software has been issued since the latest release. If this prompt appears, click "Install Now" to download the latest Ubuntu updates.

**Step 2:** To ensure you have the latest system package updates, open a Terminal window by pressing Ctrl+Alt+T and run:

```bash
sudo apt update && sudo apt upgrade -y
```

**Step 3:** Install the latest Tenstorrent firmware and system software, which will then trigger a system reboot:

```bash
curl -fsSL https://github.com/tenstorrent/tt-installer/releases/latest/download/install.sh -O

chmod +x install.sh

./install.sh \
  --kmd-version=2.8.0 \
  --smi-version=5.2.0 \
  --flash-version=3.8.0 \
  --fw-version=19.10.0 \
  --metalium-image-tag=v0.72.0 \
  --mode-non-interactive \
  --install-container-runtime=no
```

Log in with `ttuser` and proceed to the next step.

---
## Step 7: Verify System Recognition of Blackhole Cards

To verify all cards are up and running in your TT-QuietBox, launch TT-SMI. This is Tenstorrent's simple command line utility that displays devices, device telemetry and other system information. 

1. In the terminal your shell prompt should read: `(.tenstorrent-venv) ttuser@tt-quietbox:~$`

2. Run command `tt-smi` 

3. Under the “Device Information” pane, you should see an output which lists four recognized accelerators. See the screenshot below for reference.

```{figure} ./screencap-tt-smi-qb2.jpg
:width: 80%
```

:::{admonition} Important
:class: caution
If `.tenstorrent-venv` is not active, or you don’t see all four accelerators listed in the Device Information pane of TT-SMI, please [visit the troubleshooting page.](./support-bh-2.md)
:::

4. Once all cards have been verified, close TT-SMI by pressing Q on your keyboard.

:::{note}
Setting up your TT-QuietBox 2 for more than one person? {ref}`Follow these steps to set up another user on your TT-QuietBox 2 <qb2-add-new-user>`.
:::

---

## Step 8: Get Access to Model Weights

TT-QuietBox 2 comes pre-installed with [TT Studio](https://docs.tenstorrent.com/tt-studio/), Tenstorrent's simple web interface for running AI models.

For the most up-to-date list of models supported by TT-QuietBox 2, check the [Developer Hub](https://tenstorrent.com/developers).

TT Studio uses the Hugging Face API to manage open-source AI model weights and configuration files. Hugging Face is a free, open source community for collaborating on AI models and applications. Hugging Face access tokens are the unique security keys that allow weights from AI models to be downloaded to your machine. Read more about how user access tokens work in the [Hugging Face documentation](https://huggingface.co/docs/hub/en/security-tokens#how-to-manage-user-access-tokens).

To get access to model weights on Hugging Face, follow these steps:

1. Open a new browser window and navigate to [huggingface.co](https://huggingface.co).
2. Create or log in to your Hugging Face account.
3. Create your access token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). **Copy and securely store the access token** as it is only displayed once and will be needed in the next step.
4. Some of the models in TT Studio ([Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) and [Llama-3.3-70B-Instruct](https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct)) require access to be granted by the model developer via the Hugging Face website. For these models, click **Request Access** and read and sign any required community license agreements. 

## Step 9: Launch TT Studio

1. Open a terminal window and pull the latest from the TT Studio github repo:

```bash
cd ~/.local/lib/tt-studio
git pull
```
2. When the process is complete, run this command in Terminal to open TT Studio:

```bash
tt-studio
```

3. When prompted, paste in your HuggingFace access token from the previous step.
4. Choose to install dependencies with Docker by entering "Y". It may take a few minutes to build the docker containers. When prompted, enter your sudo password (this is the same password you use to log in to your workstation). Administrative access is required to set up TT Inference Server, the engine which runs AI models on Tenstorrent hardware.
5. The TT Studio web app will now launch in your default web browser.

```{figure} ./qb2-screenshot-deployment-mode.png
:width: 80%
```

6. To get a model running as quickly as possible, select "Single / Multi Model Deployments" and then choose "Qwen3-32B" from the Select Model dropdown. Click "next" and "Deploy".
7. Once the model is ready, click "Chat" or "API" to interact with the model in realtime. 

:::{note}
Downloading other models can take anywhere from a few minutes to a few hours, depending on the model you’ve selected and the speed of your internet connection. WiFi connections will be slower than direct Ethernet.
:::

## What to do next?

```{raw} html
<style>
.qb2-next { max-width: 100%; margin: 8px 0 4px; }

/* hero banner */
.qb2-next-hero {
  background: linear-gradient(120deg, #6454a0 0%, #8a6fd6 58%, #b58ad6 100%);
  border-radius: 12px;
  padding: 24px 28px;
  color: #fff;
  margin-bottom: 22px;
  box-shadow: 0 8px 24px rgba(100, 84, 160, 0.28);
}
.qb2-next-hero h3 { color: #fff !important; margin: 0 0 8px; font-size: 1.4rem; font-weight: 700; display: block; overflow-x: visible; }
.qb2-next-hero p  { color: rgba(255,255,255,0.93); margin: 0 0 16px; font-size: 0.98rem; line-height: 1.55; }
.qb2-next-btn {
  display: inline-block; background: #fff; color: #6454a0 !important;
  font-weight: 700; padding: 7px 16px; font-size: 0.9rem; border-radius: 8px;
  text-decoration: none !important; transition: transform .15s ease, box-shadow .15s ease;
}
.qb2-next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.22); }
</style>

<div class="qb2-next">

  <div class="qb2-next-hero">
    <h3>&#128640; Your TT-QuietBox 2 is ready. Now the fun begins.</h3>
    <p>Four Blackhole&trade; chips, 480 Tensix cores, and 128&nbsp;GB of memory are sitting on your desk, with no token quotas or rate limits. We've packed in a boatload of content to put it to work. Start with the welcome guide for hands-on, interactive lessons across the whole Tenstorrent ecosystem.</p>
    <a class="qb2-next-btn" href="welcome.html">Open the welcome guide &rarr;</a>
  </div>

</div>
```

---

## Need Additional Support?

If you encounter any issues, or have a question that isn't covered in this guide, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.

