---
myst:
  html_meta:
    product-name: TT-QuietBox Blackhole™, Blackhole™ Networked AI Processor, Tensix core  
    technology-concepts: PCIe, QSFP-DD, Installation, Setup, Electrostatic Discharge (ESD), Basic Input/Output System (BIOS)  
    document-type: Task-Based Guide (How-To)
---

# Receiving, Unboxing, and Setup

*<span style="color: purple;">Note: This content is still being drafted. Once finalized, the complete documentation will be available at docs.tenstorrent.com</span>*

This section guides users through how to safely unbox, setup hardware, and install software on a TT-QuietBox 2 (Blackhole) Workstation.

## **Before You Begin**

Choose a suitable location for your System:
* Choose a stable area for the TT-QuietBox 2 where it will not need to be moved regularly, and none of the vents will be blocked.
* Choose a location for your Quietbox that supports the power draw of the Quietbox. The PSU on the Quietbox 2 is rated to draw up to 1600W of power. A standard 15A circuit can handle up to 1800W. Be mindful when choosing the location of your Quietbox of the other electronics which may draw power from the same circuit. We recommend putting the Quietbox on a dedicated circuit, if not you may trip a breaker.
* Review the {ref}`safety warnings <safety-warnings>`.
* Inspect your package for signs of damage. Do not proceed with unboxing or installation if you suspect shipping damage to the system. Contact Tenstorrent support by [raising a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.


### **Required Tools**
Ensure you have everything you need to get started.

The Tenstorrent TT-QuietBox 2 (Blackhole) (TW-04003) package includes the following items:

* 1x TT-QuietBox 2 (Blackhole) Workstation
* 1x Power Supply Cord (C19 to NEMA 5-15P)
* 1x AnkerWork S500 speakerphone 

For setup, you will also need your own:
* Keyboard
* Mouse
* HDMI cable + monitor

Note: Only use certified HDMI cables with the TT-QuietBox 2. Using non-certified HDMI cables may result in device damage, or non-compliant video operation.

---

## **Step 1: Unboxing the Workstation**


1. **Grab the box.** Position the box in your prepared unboxing area, ensuring ample space to work around it.  
```{figure} ./qb2-unboxing-box.jpg
:width: 40%
```
2. **Remove the white side clips near the bottom of the packaging.** Squeeze the tabs on the clip and pull to release.
```{figure} ./qb2-unboxing-clips.jpg
:width: 40%
```

```{figure} ./qb2-unboxing-clip-release.jpg
:width: 40%
```

3. **Lift box lid, remove accessories box and styrofoam, then remove internal cardboard case and plastic sleeve.**
```{figure} ./qb2-unboxing-lift-sleeve.jpg
:width: 40%
```

```{figure} ./qb2-unboxing-remove-accessories.jpg
:width: 40%
```
```{figure} ./qb2-unboxing-lift-inner-box.jpg
:width: 40%
```

```{figure} ./qb2-unboxing-lift-plastic-sleeve.jpg
:width: 40%
```

4. **Lift the TT-QuietBox 2 out of the package using the handles.** 

```{figure} ./qb2-unboxing-lift-workstation.jpg
:width: 40%
```

5. **Remove protective wrapping on all sides.** 

```{figure} ./qb2-remove-plastic-front.jpg
:width: 40%
```

```{figure} ./qb2-remove-plastic-side.jpg
:width: 40%
```
---

## **Step 2: Setting Up the Hardware**

Follow these steps to set up the hardware for your TT-QuietBox Blackhole™ workstation:

<span style="color: purple; font-weight: bold;">The section below may change based on pending imagery. </span>

1. **Connect the power cable.** Connect the provided C19 power cable to the workstation and then to a dedicated power outlet. See the Electrical Safety section for the full list of power requirements. 

2. **Connect peripherals.** Connect the HDMI monitor, keyboard, and mouse using the HDMI and USB ports on the back of the Workstation. We recommend Ethernet over WiFi for faster downloading of models. If you choose to use ethernet connect your Ethernet cable to the RJ45 port. If you'd like sound, connect the included third-party speakerphone to the USB-A port.


3. **Power on the Workstation.** On the back of the workstation, flip the switch on the PSU to the "I" position.  

```{figure} ./draft-bh-qb2-rear-PSU.png
:alt: QuietBox BH-2 rear PSU switch
:width: 30%
```
4. **On the front of the workstation, press the power button to turn the system on.**

---

## **Step 3. First-Time Log In**

When the system boots you'll see a welcome animation. If you would like to disable this animation for subsequent boot ups, in a Terminal, run:

```bash
/home/ttuser/scripts/disable-demo-mode.sh
```

Once your system is booted up, the login prompt will appear.

Enter the default password: **ttuser**

## **Step 4. Change Default Password**

After logging in, open a Terminal window by pressing Ctrl+Alt+T and follow these steps to change your password from the public default: 

1. Run command: `passwd`
2. Enter current password: **ttuser**
3. Enter new password of your choosing and hit enter to confirm the change.

## **Step 5. Setup and Confirm Internet Connection**
TT-QuietBox 2 can be connected to the internet via WiFi or Ethernet cable. For faster model downloads, we recommend a direct Ethernet connection.

If you have not done so already during hardware setup, connect your Ethernet cable to the standard RJ45 port on the back of the Workstation. Then, verify your internet connection by clicking on the status icons in the upper right corner of the screen. Confirm the internet connection reads "Wired."

If you would prefer to set up a WiFi connection, on your monitor, click on the status icons in the top right corner of the screen. Then, click on "Wi-Fi" (it may say "not connected" or "off"). Select your WiFi network from the drop-down list, enter the password, and click "Connect."

## **Step 6. Update the Ubuntu Operating System**

TT-QuietBox 2 comes pre-installed with the Ubuntu operating system (24.04.3 LTS). 

Upon logging in, a Ubuntu Software Updater may offer a prompt that new software has been issued since the latest release. If this prompt appears, click "Install Now" to download the latest Ubuntu updates.

We recommend ensuring you are running the latest version of Ubuntu. To do this, open a Terminal window by pressing Ctrl+Alt+T, then run:

```bash
sudo apt update && sudo apt upgrade -y
```

Wait for any downloads to complete, then proceed to the next step.

---
## **Step 7: Verify System Recognition of Blackhole Cards**

To verify all cards are up and running in your TT-QuietBox, launch TT-SMI. This is Tenstorrent's simple command line utility that displays devices, device telemetry and other system information. 

1. In the terminal your shell prompt should read: `(.tenstorrent-venv) ttuser@tt-quietbox:~$`

2. Run command `tt-smi` 

3. Under the “Device Information” pane, you should see an output which lists four recognized accelerators. See the screenshot below for reference.

```{figure} ./screencap-tt-smi-qb2.png
:width: 80%
```

:::{admonition} Important
:class: caution
If `.tenstorrent-venv` is not active, or you don’t see all four accelerators listed in the Device Information pane of TT-SMI, please [visit the troubleshooting page.](./support-bh-2.md)
:::

Once all cards have been verified, close TT-SMI by pressing Q on your keyboard.

---

## **Step 8: Get Access to Model Weights**

To deploy a model, you'll need to get permission to download the model weights in TT-Studio. 

TT-Studio supports the following common models on Quietbox 2:

| Type | Model |
| --- | --- |
| Video Gen | Wan 2.2 |
| Text to Image | Flux |
| Language Models | GPT-OSS 120B, Llama 3.1 70B, Qwen3-32B, Llama 3.1 8B |

Hugging Face is a free, open source community for collaborating on AI models and applications. Hugging Face access tokens are the unique security keys that allow weights from AI models hosted on Hugging Face to be downloaded to your machine. Read more about how user access tokens work in the [Hugging Face documentation](https://huggingface.co/docs/hub/en/security-tokens#how-to-manage-user-access-tokens).

To get access to model weights, follow these steps:

1. Open a new browser window and navigate to [huggingface.co](https://huggingface.co).
2. Create or log in to your Hugging Face account.
3. On the Hugging Face website, visit the model page of your choice. Depending on your choice of model you may need to click **Request Access** in the upper right corner or you may be prompted to scroll through and sign a community license agreement.
4. Once approved, create your access token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). Copy the access token.

## **Step 9: Launch TT-Studio**

TT-Studio is Tenstorrent's simple web interface for running AI models.

1. Ensure you have the latest version of TT-Studio from the open source Tenstorrent GitHub repository. To do this, open a Terminal window by pressing Ctrl+Alt+T and run the following command:

```bash
cd ~/.local/lib/tt-studio
git pull
```
2. When the following process is complete, run this command in Terminal to open TT-Studio:

```bash
tt-studio
```

Your Terminal window will show a "Welcome to TT-Studio" message. See screenshot below for reference.

```{figure} ./qb2-screenshot-first-time-tt-studio.png
:width: 80%
```

## **Step 10: Launch Your First Model**

At the bottom of the Terminal screen, you will be prompted to enter a Hugging Face User Access Token (aka "HF_TOKEN").

1. Paste this Hugging Face token into the Terminal window and run the command.

2. If the system asks, “Do you want to install dependencies using Docker?” enter “Y” for “yes.” Installing dependencies may take about 3 minutes.

```{figure} ./qb2-screenshot-install-docker.png
:width: 80%
```

```{figure} ./qb2-screenshot-launching-ttstudio.png
:width: 80%
```

3. When prompted, enter your sudo password (this is the same password you use to log in). TT-Studio runs on top of TT-Inference Server which requires sudo privileges to set up.

```{figure} ./qb2-screenshot-sudo-pw.png
:width: 80%
```
4. The TT-Studio web app will now launch in your default web browser. Click on the model of your choice from the drop-down menu and press "NEXT." The screenshots below use Llama 3.3 70B as an example. 

```{figure} ./qb2-screenshot-select-model.png
:width: 80%
```

5. When prompted on the next screen, proceed by hitting "DEPLOY." The model weights will start downloading automatically. 


```{figure} ./qb2-screenshot-deploy-model.png
:width: 80%
```

Downloading a model can take anywhere from a few minutes to a few hours, depending on the model you’ve selected and the speed of your internet connection. WiFi connections will be slower than direct Ethernet. TT-Studio will show the status of "model unavailable" until model download is finished. 

```{figure} ./qb2-screenshot-deploying.png
:width: 80%
```

```{figure} ./qb2-screenshot-creating-container.png
:width: 80%
```

## **Other Methods of Running Models**
After your TT-QuietBox 2 is set up, feel free to explore other methods of running models on other layers of Tenstorrent's software stack. You may want to:
- Run models directly from Terminal using [TT-Inference-Server](https://github.com/tenstorrent/tt-inference-server), the fastest way to deploy and test models for serving inference on Tenstorrent hardware.
- Run [model demos](https://docs.tenstorrent.com/getting-started/model-demos.html) using TT-Metalium.

---

## **Need Additional Support?**

If you encounter any issues, or have a question that isn't covered in this guide, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.

