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

Before you begin:
* Choose a clear, stable, and spacious area for the TT-QuietBox 2, where it will not need to be moved regularly. 
* The system weighs 20 kg (44.2 lbs) – ensure you can comfortably lift this weight, or ask another person for assistance before getting started. 
* Clear the area where you intend to use the Workstation and ensure to use a dedicated 15A circuit and outlet.
* Confirm that all top vents are clear of obstructions or other objects.

Do not proceed with unboxing or installation if you suspect shipping damage to the system. Contact Tenstorrent support by [raising a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.

### Safety Warnings

:::{admonition} Caution: Heavy
:class: caution
The TT-QuietBox 2 shipping container weighs approximately 50 lbs (22.6 kg). At least two people are recommended to unbox and install the system safely.
:::

:::{admonition} Caution: Hot Surfaces
:class: caution
The interior of the workstation can become extremely hot when running. Do not touch any interior components of the workstation before turning the power off, letting the Power Supply Unit (PSU) fully drain, and allowing interior components to cool.
:::

### **Required Tools**

The Tenstorrent TT-QuietBox 2 (Blackhole) (TW-04003) package includes the following items:

* 1x TT-QuietBox 2 (Blackhole) Workstation
* 1x Power Supply Cord (C19 to NEMA 5-15P)
* 1x AnkerWork S500 speakerphone and dongle (first 100 units)

For setup, you will also need your own:
* Keyboard
* Mouse
* HDMI cable + monitor

Note: Only use certified HDMI cables with the TT-QuietBox 2. Using non-certified HDMI cables may result in device damage, or non-compliant video operation.

---

## **Step 1: Unboxing the Workstation**

*<span style="color: purple;">Note: Photography is expected by March 2026.</span>*

Please take a moment to review the {ref}`electric safety warnings <safety-warnings>` before unboxing your TT-QuietBox 2 Workstation. Then, follow these steps:

1. **Grab the box.** Position the crate in your prepared unboxing area, ensuring ample space to work around it.  
```{figure} ./placeholder-box-opening.png
:width: 40%
```
2. **Remove the white side clips near the bottom of the packaging.** Squeeze the tabs on the clip and pull to release.
```{figure} ./placeholder-removing-side-clips.png
:width: 40%
```
3. **Lift exterior and internal cardboard sleeves, remove styrofoam, and accessories box.**
```{figure} ./placeholder-removing-accessories.png
:width: 40%
```
4. **Lift the TT-QuietBox 2 out of the package using the handles.** 
```{figure} ./placeholder-lifting-unit-out-of-box.png
:width: 40%
```

5. **Inspect the system.** Inspect the workstation to ensure all components are properly mounted and secured. The system ships with sufficient liquid coolant for long-term operation; adding or purchasing coolant is not necessary.
```{figure} ./placeholder-side-workstation.png
:width: 40%
```

---

## **Step 2: Setting Up the Hardware**

Follow these steps to set up the hardware for your TT-QuietBox Blackhole™ workstation:

1. **Connect the power cable.** Connect the provided C19 power cable to the workstation and then to a dedicated power outlet. See the Electrical Safety section for the full list of power requirements. 
```{figure} ./placeholder-connecting-power.png
:width: 40%
```
2. **Connect peripherals.** Connect the HDMI monitor, keyboard, and mouse using the HDMI and USB ports on the back of the Workstation. If you prefer Ethernet to WiFi for faster downloading of models, connect your Ethernet cable to the RJ45 port. If you'd like sound, connect the included third-party speakerphone to the USB-A port.

```{figure} ./placeholder-peripheral-connections.png
:width: 40%
```

3. **Power on the Workstation.** On the back of the workstation, flip the switch on the PSU to the "I" position.  

```{figure} ./draft-bh-qb2-rear-PSU.png
:alt: QuietBox BH-2 rear PSU switch
:width: 30%
```
On the front of the workstation, press the power button to turn the system on. 

```{figure} ./placeholder-power-button-closeup.png
:width: 30%
```

---

## **Step 3. First-Time Log In**

*Note: There is welcome animation that plays on each bootup of TT-QuietBox 2. If you would like to disable this animation, in a Terminal, run:* `/home/ttuser/scripts/disable-demo-mode.sh`

Once your system is booted up, when the login prompt appears:

Enter the default password: **ttuser**

## **Step 4. Change Default Password**

After logging in, open a Terminal window by pressing CNTRL+ ALT +T and follow these steps to change your password from the public default: 

1. Run command: `passwd`
2. Enter current password: **ttuser**
3. Enter new password of your choosing and hit enter to confirm the change.

## **Step 5. **Confirm/Setup Internet Connection**
TT-QuietBox 2 can be connected to the itnernet via WiFi or Ethernet cable. For faster model downloads, we recommend a direct Ethernet connection.

If you have not done so already during hardware setup, connect your Ethernet cable to the standard RJ45 port on the back of the Workstation. Then, verify your internet connection by clicking on the status icons in the upper right corner of the screen. Confirm the internet connection reads "Wired."

If you would prefer to set up a WiFi connection, on your monitor, click on the status icons in the top right corner of the screen. Then, click on "Wi-Fi" (it may say "not connected" or "off). Select your WiFi network from the drop down list, enter the password, and click "Connect."

## **Step 6. Update the Ubuntu Operating System**

TT-Quietbox 2 comes pre-installed with the Ubuntu operating system (24.04.3 LTS). 

Upon logging in, Software Updater may offer a prompt that new software has been issued since the latest release. If this prompt appears, click "Install Now" to download the latest Ubuntu updates.

We recommend ensuring you are running the latest version of Ubuntu. To do this, open a Terminal window by pressing CNTRL+ ALT +T, then run:

```bash
sudo apt update && sudo apt upgrade -y
```

Wait for any downloads to complete, then proceed to the next step.

---
## **Step 7: Verify System Recognition of Blackhole Cards**

TT-SMI is a simple command line utility that displays devices, device telemetry and other system information. To verify all cards are up and running in your TT-QuietBox, do the following steps:

1. Open a new Terminal window by pressing CNTRL+ ALT +T. You should see a text prompt that reads: `(.tenstorrent-venv) ttuser@tt-quietbox:-$`

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

## **Step 8: Open TT-Studio**

TT-Studio is Tenstorrent's simple web interface for running AI models, and comes pre-installed on your TT-QuietBox 2.

1. Ensure you have the latest version of TT-Studio from the open source Tenstorret GitHub repository. To do this, open a Terminal window by pressing CNTRL+ ALT +T and run the following command:

```bash
cd ~/.local/lib/tt-studio
git pull
```
2. Once the latest version has been confirmed or downloaded, run this command in Terminal to open TT-Studio:

```bash
tt-studio
```

Your Terminal window will show a "Welcome to TT-Studio" message. See screenshot below for reference.

```{figure} ./qb2-screenshot-first-time-tt-studio.png
:width: 80%
```

**Step 9: Launch Your First Model**

At the bottom of the Terminal screen, you will be prompted to enter a Hugging Face User access token (aka "HF_TOKEN").

Hugging Face is a free, open source community for collaborating on AI models and applications. Hugging Face access tokens are the unique security keys that allow weights from AI models hosted on Hugging Face to be downloaded to your machine. Read more about how user access tokens work in the [Hugging Face documentation](https://huggingface.co/docs/hub/en/security-tokens#how-to-manage-user-access-tokens).

 TT-Studio supports the following common models at first boot-up, all hosted on Hugging Face:

| Type | Model |
| --- | --- |
| Video Gen | Wan 2.2 |
| Text to Image | Flux |
| Language Models | GPT-OSS 120B, Llama 3.1 70B, Qwen3-32B, Llama 3.1 8B |

To get started with your first Hugging Face model on your TT-QuietBox 2, follow these steps:

1. Create or Login to your Hugging Face account. Open a new browswer window and navigate to [huggingface.co](https://huggingface.co).

2. Visit the Hugging Face model page of your choice and hit Request Access in the upper right corner. Depending on your choice of model, you may be prompted to sign a community license agreement; proceed if you agree.

4. Once approved, create your access token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

5. Paste your Hugging Face token into the Terminal window and run the command. Wait until your access if confirmed. If the system asks, “Do you want to install dependencies using Docker?” enter “Y” for “yes.” Installing dependencies may take about 3 minutes.

```{figure} ./qb2-screenshot-install-docker.png
:width: 80%
```

```{figure} ./qb2-screenshot-launching-ttstudio.png
:width: 80%
```

6. TT-Studio runs on top of TT-Inference Server which requires sudo privileges to set up. Enter your password when prompted (this is the same password you use to login).

```{figure} ./qb2-screenshot-sudo-pw.png
:width: 80%
```
7. TT-Studio web app will now launch in your default web browser. 

The below screenshots use Llama 3.370B as an example. Click on the model of your choice from the dropdown menu and press "NEXT." 

```{figure} ./qb2-screenshot-select-model.png
:width: 80%
```

When prompted on the next screen, proceed by hitting "DEPLOY." The model weights will start downloading automatically. 


```{figure} ./qb2-screenshot-deploy-model.png
:width: 80%
```

First it will say "creating container" (screenshot) 

Model download can take anywhere from 3 to a few hours, depending on the model you’ve selected and the speed of your internet connection (WiFi connections will be slower than direct Ethernet. The screen will show "model unavailable" until download is finished. (see screenshot)

```{figure} ./screencap-tt-studio-deploy-model.png
:width: 80%
```

## **Other Methods of Running Models**
After your system is set up, feel free to explore other methods of running models on other layers of Testorrent's software stack. You may want to:
- Run models directly from Terminal using [TT-Inference-Server](https://github.com/tenstorrent/tt-inference-server), the fastest way to deploy and test models for serving inference on Tenstorrent hardware.
- Run [model demos](https://docs.tenstorrent.com/getting-started/model-demos.html) using TT-Metalium.

---

## **Need Additional Support?**

If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.
