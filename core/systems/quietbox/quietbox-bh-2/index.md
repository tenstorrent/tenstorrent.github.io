---
myst:
  html_meta:
    product-name: TT-QuietBox Blackhole™, Blackhole™ Networked AI Processor, Tensix core, TT-QuietBox, Blackhole
    technology-concepts: PCIe, QSFP-DD, Installation, Setup, Specifications, Electrostatic Discharge (ESD), Basic Input/Output System (BIOS), requirements, hardware
    document-type: Product Guide
---

# TT-QuietBox 2 (Blackhole)

```{figure} qb2-setup-hero.jpg
:width: 45%
:align: left
:alt: TT-QuietBox 2
```

```{raw} html
<div class="tt-float-clear" aria-hidden="true"></div>
```

This page covers everything for the TT-QuietBox™ 2 (Blackhole®) workstation: how
to unbox and set it up, its full hardware specifications, and answers to common
questions. Use the page navigation on the right to jump between sections.

## Hardware and Software Setup

```{figure} ./qb2-setup-hero2.jpg
:width: 65%
:target: ./qb2-setup-hero2.jpg
```

*<span style="color: purple;">Note: This product is pre-launch and documentation is subject to change.</span>*

This guide shows users how to safely unbox, setup hardware, and install software on a TT-QuietBox<sup>™</sup> 2 (Blackhole<sup>®</sup>) workstation.

### Before You Begin

Choose a suitable location for your System:
* Choose a stable area for the TT-QuietBox 2 where it will not need to be moved regularly. To ensure proper airflow intake, allow for 10 inches (25 cm) of clearance around the body of the workstation. Also avoid placing items on top of the workstation, as this can block the heat exhaust.
* The Power Supply Unit (PSU) on the TT-QuietBox 2 is rated to draw up to 1600W of power and has demonstrated drawing 1200W of power running image generation models. A standard 15A circuit can handle up to 1800W. When choosing the location of your TT-QuietBox 2, be mindful of the other electronics which may draw power from the same circuit. We recommend putting the TT-QuietBox 2 on a dedicated circuit, if not you may trip a breaker.
* Review the {ref}`safety warnings <safety-warnings>`.
* Inspect your package for signs of damage. Do not proceed with unboxing or installation if you suspect shipping damage to the system. Contact Tenstorrent support by [raising a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.


#### Required Tools
Ensure you have everything you need to get started.

The Tenstorrent TT-QuietBox 2 (Blackhole) (TW-04003) package includes the following items:

* 1x TT-QuietBox 2 (Blackhole) workstation
* 1x Power Supply Cord (C19 to NEMA 5-15P)
* 1x AnkerWork S500 speakerphone 

For setup, you will also need your own:
* Keyboard
* Mouse
* HDMI cable + monitor

Note: Only use certified HDMI cables with the TT-QuietBox 2. Using non-certified HDMI cables may result in device damage, or non-compliant video operation.

---

### Step 1: Unbox the Workstation


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

3. Lift box lid, remove accessories box and styrofoam, then remove internal cardboard case and plastic sleeve.
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

### Step 2: Set Up the Hardware

```{figure} ./qb2-rear-view.jpg
:width: 60%
```

1. **Connect the power cable.** Connect the provided C19 power cable to the workstation and then to a dedicated power outlet. See the Electrical Safety section for the full list of power requirements. 

2. **Connect peripherals.** Connect the HDMI monitor, keyboard, and mouse to the back of the workstation. (Please note: video is not supported through the USB-C port). For internet connections, we recommend Ethernet over WiFi for faster downloading of models. If you prefer Ethernet, connect your Ethernet cable to the RJ45 port. 

For sound and interaction with future text-to-speech (TTS) and speech-to-text (STT) AI models, there are a few options. You may either connect the provided speakerphone to the USB-C port or connect your own audio device to the audio jack. 

3. **Power on the workstation.** On the back of the workstation, flip the switch on the PSU to the "I" position.  

4. **On the front of the workstation, press the power button to turn the system on.**

```{figure} ./qb2-power-button.jpg
:width: 40%
```

---

### Step 3. First-Time Log In

Once your system is booted up, the login prompt will appear.

Enter the default password: **ttuser**

### Step 4. Change Default Password

After logging in, open a Terminal window by pressing Ctrl+Alt+T and follow these steps to change your password from the public default: 

1. Run command: `passwd`
2. Enter current password: **ttuser**
3. Enter new password of your choosing and hit enter to confirm the change.

### Step 5. Setup and Confirm Internet Connection
TT-QuietBox 2 can be connected to the internet via WiFi or Ethernet cable. For faster model downloads, we recommend a direct Ethernet connection.

If you have not done so already during hardware setup, connect your Ethernet cable to the standard RJ45 port on the back of the workstation. Then, verify your internet connection by clicking on the status icons in the upper right corner of the screen. Confirm the internet connection reads "Wired."

If you would prefer to set up a WiFi connection, on your monitor, click on the status icons in the top right corner of the screen. Then, click on "Wi-Fi" (it may say "not connected" or "off"). Select your WiFi network from the drop-down list, enter the password, and click "Connect."

### Step 6. Update Ubuntu Operating System

TT-QuietBox 2 comes pre-installed with the Ubuntu operating system (24.04.3 LTS). 

**Step 1:** Upon logging in, a Ubuntu Software Updater may offer a prompt that new software has been issued since the latest release. If this prompt appears, click "Install Now" to download the latest Ubuntu updates.

**Step 2:** To ensure you have the latest system package updates, open a Terminal window by pressing Ctrl+Alt+T and run:

```bash
sudo apt update && sudo apt upgrade -y
```

Wait for any downloads to complete, then proceed to the next step.

---
### Step 7: Verify System Recognition of Blackhole Cards

To verify all cards are up and running in your TT-QuietBox, launch TT-SMI. This is Tenstorrent's simple command line utility that displays devices, device telemetry and other system information. 

1. In the terminal your shell prompt should read: `(.tenstorrent-venv) ttuser@tt-quietbox:~$`

2. Run command `tt-smi` 

3. Under the “Device Information” pane, you should see an output which lists four recognized accelerators. See the screenshot below for reference.

```{figure} ./screencap-tt-smi-qb2.jpg
:width: 80%
```

:::{admonition} Important
:class: caution
If `.tenstorrent-venv` is not active, or you don’t see all four accelerators listed in the Device Information pane of TT-SMI, please [visit the troubleshooting section.](#faq-and-troubleshooting)
:::

4. Once all cards have been verified, close TT-SMI by pressing Q on your keyboard.

---

### Step 8: Get Access to Model Weights

TT-QuietBox 2 comes pre-installed with TT-Studio, Tenstorrent's simple web interface for running AI models.

For the most up-to-date list of models supported by TT-QuietBox 2, check the [Developer Hub](https://tenstorrent.com/developers).

To deploy a model in TT-Studio, first download the model weights from Hugging Face. 

<em>Note: for <strong>Qwen3-32B</strong>, the model weights come pre-downloaded onto your TT-QuietBox 2. However you will still require an access token from Hugging Face to use the model.</em>

Hugging Face is a free, open source community for collaborating on AI models and applications. Hugging Face access tokens are the unique security keys that allow weights from AI models to be downloaded to your machine. Read more about how user access tokens work in the [Hugging Face documentation](https://huggingface.co/docs/hub/en/security-tokens#how-to-manage-user-access-tokens).

To get access to model weights on Hugging Face, follow these steps:

1. Open a new browser window and navigate to [huggingface.co](https://huggingface.co).
2. Create or log in to your Hugging Face account.
3. Create your access token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). Copy the access token as it is only displayed once and will be needed in the next step.
4. On the Hugging Face website, visit the model page of your choice. Depending on your choice of model you may need to click **Request Access** in the upper right corner or you may be prompted to scroll through and sign a community license agreement.


### Step 9: Launch TT-Studio

1. Ensure you have the latest version of TT-Studio from the open source Tenstorrent GitHub repository. To do this, open a Terminal window by pressing Ctrl+Alt+T and run the following command:

```bash
cd ~/.local/lib/tt-studio
git pull
```
2. When the process is complete, run this command in Terminal to open TT-Studio:

```bash
tt-studio
```

Your Terminal window will show a "Welcome to TT-Studio" message. See screenshot below for reference.

```{figure} ./qb2-screenshot-open-tt-studio.jpg
:width: 80%
```

### Step 10: Launch Your First Model

At the bottom of the Terminal screen, you will be prompted to enter a Hugging Face User Access Token (aka "HF_TOKEN").

1. Paste this Hugging Face token into the Terminal window and run the command.

2. If the system asks, “Do you want to install dependencies using Docker?” enter “Y” for “yes.” Installing dependencies may take about 3 minutes.

```{figure} ./qb2-screenshot-install-docker.jpg
:width: 80%
```

3. When prompted, enter your sudo password (this is the same password you use to log in to your workstation). TT-Studio runs on top of TT-Inference Server which requires sudo privileges to set up.

```{figure} ./qb2-screenshot-sudo-pw.jpg
:width: 80%
```
4. The TT-Studio web app will now launch in your default web browser. Click on the model of your choice from the drop-down menu and press "NEXT." 

```{figure} ./qb2-screenshot-select-model2.png
:width: 80%
```

5. When prompted on the next screen, proceed by hitting "DEPLOY." The model weights will start downloading automatically. 

Downloading a model can take anywhere from a few minutes to a few hours, depending on the model you’ve selected and the speed of your internet connection. WiFi connections will be slower than direct Ethernet. TT-Studio will show the status of "model unavailable" until model download is finished. 

### Other Methods of Running Models
After your TT-QuietBox 2 is set up, feel free to explore other methods of running models on other layers of Tenstorrent's software stack. You may want to:
- Run models directly from Terminal using [TT-Inference-Server](https://github.com/tenstorrent/tt-inference-server), the fastest way to deploy and test models for serving inference on Tenstorrent hardware.

---

### Need Additional Support?

If you encounter any issues, or have a question that isn't covered in this guide, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.

## Specifications

```{figure} ./qb2-specs-hero.jpg
:width: 65%
```

*<span style="color: purple;">Note: This product is pre-launch and documentation is subject to change.</span>*

This document provides detailed technical specifications for the TT-QuietBox<sup>™</sup> 2 (Blackhole<sup>®</sup>) workstation. It lists package contents, hardware components, physical dimensions, and operating requirements.

### **Package Contents**

The Tenstorrent TT-QuietBox 2 (Blackhole) system package includes the following items:

* 1x TT-QuietBox 2 (Blackhole) workstation
* 1x Power Supply Cord (C19 to NEMA 5-15P)
* 1x AnkerWork S500 Speakerphone

### **System Specifications**

| Specification | Details |
| ----- | ----- |
| Model | TW-04003 |
| Operating System | Ubuntu 24.04.3 LTS |
| CPU | Ryzen 7 9700X 65W Granite Ridge 3.8GHz |
| Motherboard | ASRock B850M-C, mATX |
| Memory | 256 GB (4x64 GB) DDR5-5600 UDIMM, CL46 (4 slots, 0 free) |
| Storage | 4TB (WDS400T4B0E-00BKY0)<br /> 1x Blazing M.2 (PCIe Gen5x4) with WD Blue SN5000 NVMe SSD<br /> 1x Hyper M.2 (PCIe Gen4x4)<br /> 1x M.2 (PCIe Gen3x2 & SATA3) |
| Tenstorrent Processors | 2x Liquid-Cooled Blackhole™ cards, each equipped with:<br /><ul class="tt-spec-cell-list"><li>2x Blackhole ASICs</li><li>240 Tensix Cores</li><li>64 GB of GDDR6 Memory @ 16 GT/sec (1024 GB/sec memory bandwidth)</li><li>600W of board power</li></ul> |
| External I/O Ports | 1x HDMI Port<br />1x USB 3.2 Gen 2 Type-A Port<br />1x USB 3.2 Gen 2 Type-C Port (non-video)<br />2x USB 3.2 Gen 1 Ports<br />4x USB 2.0 Ports<br />1 x BIOS Flashback Button<br />HD Audio Jacks: Line in / Front Speaker / Microphone |
| Connectivity | 1 x RJ45 LAN Port<br /><ul class="tt-spec-cell-list"><li>Gigabit LAN 10/100/1000 Mb/s Base T</li><li>Realtek 8111H</li></ul><br />2x WiFi Antenna<br /><ul class="tt-spec-cell-list"><li>802.11ax WiFi 6 Module</li><li>Supports IEEE 802.11a/b/g/n/ax</li><li>Supports Dual-Band (2.4/5 GHz)</li><li>Supports Bluetooth 5.3</li></ul> |
| Power Supply | 1600W Cooler Master V Platinum 1600 V2 |
| Sound Pressure | 38 dBA (under max operating load) |
| System Dimensions | Height: 15.6” (39.5 cm) Width: 9.1” (23.1 cm) Depth: 17.8” (45.2 cm) (including handles and feet) |
| System Weight | 20 kg (44 lbs) +/- 1.5 lbs   |
| Shipping Box Dimensions | Height: 20.7” (52.5 cm) Width: 14.4” (36.7 cm) Depth: 25.0” (63.5 cm) |
| Shipping Box Weight | 23.2 kg (52 lbs)  |

### **Supported Models**
For the most up-to-date list of models supported by TT-QuietBox 2, check the [Developer Hub](https://tenstorrent.com/developers).

### **Power and Operating Conditions**

| Topic | Specification |
| --- | --- |
| Peak Power Consumption | 1.5kW |
| Operating Temperature | 50°F to 95°F (10°C to 35°C) |
| Operating Relative Humidity | 10% to 90% (non-condensing) |
| Non-Operating Temperature | -4°F to 140°F (-20°C to 60°C) |
| Non-Operating Relative Humidity |  5% to 95% (non-condensing) |

The Power Supply Unit (PSU) on the TT-QuietBox 2 is rated to draw up to 1600W of power and has demonstrated drawing 1200W of power running image generation models. A standard 15A circuit can handle up to 1800W. When choosing the location of your TT-QuietBox 2, be mindful of the other electronics which may draw power from the same circuit. We recommend putting the TT-QuietBox 2 on a dedicated circuit, if not you may trip a breaker.

### **System Overview**

```{figure} ./qb2-system-iso-view.jpg
:width: 65%
```

| No | Item | Description |
| --- | --- | --- |
| 1 | Handle | Used to aid in lifting the workstation |
| 2 | Glass Panel | Showcases internal Accelerator cards |
| 3 | Thumbscrew | Enables toolless access to the interior |
| 4 | Power and Reset Buttons | Powers the workstation on/off and resets the workstation |

### **System Rear View**

```{figure} ./qb2-rear-view.jpg
:width: 65%
```

| Number | Item |
| --- | --- |
| 1 | 1x HDMI Port |
| 2 | 1 x BIOS Flashback Button |
| 3 | 1x USB 3.2 Gen 2 Type-A Port |
| 4 | 4x USB 2.0 Type-A Ports |
| 5 | Power Cable Port |
| 6 | On/Off Power Supply Unit Switch |
| 7 | 1x USB 3.2 Gen 2 Type-C Port (non-video) |
| 8 | 2x USB 3.2 Gen 1 Type-A Ports |
| 9 | 1x RJ45 **TBD GbE** LAN Port |
| 10 | 2x WiFi Antenna |
| 11 | HD Audio Jacks: Line in / Front Speaker / Microphone  |

### **Internal Topology**

The TT-QuietBox 2 is enabled by two Tenstorrent Blackhole cards, which are connected internally with a Samtec ARP6 series High Performance cable. The below topology is pre-installed by Tenstorrent, and is here for your reference.

```{figure} ./qb2-topology.jpg
:width: 65%
```

(safety-warnings)=
### **Important Safety Warnings**

#### **Electrical Safety** 

:::{danger}
Failure to follow these electrical safety instructions may result in electric shock, fire, or damage to the workstation.

* Ensure you are connecting the power to an AC power circuit with sufficient capacity to support 15A. Failure to connect to dedicated 15A breaker may result in tripping the breaker, or dangerous operating conditions.
* Do not share the outlet with other high-power devices. Avoid using household surge strips, extension cords, or multi-outlet power taps; not all are rated for the sustained current of this system.  
* Use only the provided C19 power cable, and ensure it is plugged into a properly grounded outlet. Do not bypass or disable the grounding pin.  Using a non-Tenstorrent approved power cable may result in dangerous operating conditions.
* If the circuit becomes overloaded or if the breaker trips during power-up or operation, immediately disconnect and remove power. Then, have a qualified electrician inspect and verify the circuit’s capacity before resuming setup.  
* Never attempt to reset or bypass a tripped breaker without first confirming the circuit integrity; failure to do so may result in overheating, voltage drop, or irreversible damage.
:::

#### **Electrostatic Discharge Safety**

:::{admonition} Important
:class: warning
Before opening the TT-QuietBox 2 Blackhole workstation or handling any internal components, you must discharge static electricity from your body to avoid damaging sensitive hardware. Electrostatic discharge can permanently damage Tensix cores, memory modules, or other components. Handle with care and always follow ESD-safe practices.
* Touch a grounded metal surface, such as a grounded rack, chassis, or power supply casing, before and during internal handling.  
* Ideally, wear an ESD wrist strap connected to a verified ground point.  
* Avoid working on carpeted floors or in low-humidity environments where static buildup is more likely.  
* Do not touch any processor, memory module, connector, or printed circuit board (PCB) circuitry unless absolutely necessary, and only after properly discharging.
:::

### **Other Notices to Users**

* This equipment has been tested and found to comply with the limits for a Class B digital device, pursuant to part 15 of the FCC Rules. These limits are designed to provide reasonable protection against harmful interference in a residential installation.
* This equipment generates, uses and can radiate radio frequency energy and, if not installed and used in accordance with the instructions, may cause harmful interference to radio communications. However, there is no guarantee that interference will not occur in a particular installation.
* Changes or modifications to this workstation which are not expressly approved by Tenstorrent may void the user's authority to operate it. Tenstorrent cannot accept responsibility for any failure to satisfy any Safety, EMC or regulatory requirements that result from non-approved modification of the product, including the fitting of non-Tenstorrent cards, cables, or any other hardware or software modification which may affect compliance. To avoid damage and personal injury, only use Tenstorrent approved hardware with this device. 
* Do not use the TT-QuietBox 2 in a way that it was not designed to be used.

## FAQ and Troubleshooting 

*<span style="color: purple;">Note: This product is pre-launch and documentation is subject to change.</span>*

### Hardware and Software Details

#### What Software Can I Run Out of the Box on My TT-QuietBox 2?
TT-QuietBox 2 ships with Ubuntu 24.04 and has the Tenstorrent open source software stack preinstalled. You can run models right away through TT-Studio, our simple web interface, or perform more custom model deployments through the TT-Inference Server, TT-Metalium, and TT-Forge SDKs.

You still have full access to Ubuntu, so you can install your own development tools, libraries, and workflows on top, if you prefer more customization.

#### What Models Can the TT-QuietBox 2 Run Out of the Box?
The full list of supported and validated models is available on the [Tenstorrent Developer Hub](https://tenstorrent.com/developers). In the models catalog, filter by “TT-QuietBox 2” to see all currently supported models for this system.

Don’t see your model supported? Submit a support ticket to chat with us. We may be able to help you bring your model up using the Tenstorrent software stack or point you to ongoing work.

#### What Are the Specifications of the TT-QuietBox 2?
TT-QuietBox 2 is a liquid-cooled desktop workstation built around the Blackhole® ASIC, with integrated CPU, memory, storage, and networking suitable for AI development workloads.

For full details (processor configuration, memory, storage, power requirements, dimensions, etc.), see the [Specifications section](#specifications) of this page.

#### Where Can I Set Up a TT-QuietBox 2?

TT-QuietBox 2 is designed to operate in a typical office, lab, or home-office environment, and plug into a standard outlet. It fits well on or under a desk. Wherever you decide to set up your workstation, ensure there is 10in / 25cm of clearance to allow for sufficient airflow, which is drawn in from the bottom and the sides. Avoid stacking papers or binders against your TT-QuietBox 2, or placing any items on top of the tower, as this is where the fan exhausts the system heat. 

For detailed information on power draw and circuit breaker requirements, see the [Specifications section](#specifications) of this page.

#### Does My TT-QuietBox 2 Require Maintenance?
Yes. Like any liquid-cooled desktop workstation, TT-QuietBox 2 will require periodic coolant top-ups. Under typical development workloads, you can expect to do this approximately every year. Exact intervals depend on usage, environment, and duty cycle.

Maintenance procedures and recommended coolant/service guidelines will be documented in the TT-QuietBox 2 hardware documentation.

#### How Loud Is the TT-QuietBox 2?

TT-QuietBox 2 is liquid-cooled and engineered to run quietly enough for office or home-office use. Actual noise levels depend on workload and ambient conditions, but the system is intended to be comfortable to use at a desk compared to traditional air-cooled workstations. Our lab tests measured 39.8 dBA sound pressure under maximum operating load (for reference, a typical front-load washing machine operates between 40-50 dBA).

#### What Kind of Power Outlet Do I Need? How Much Power Does It Draw?

For detailed power specifications (input voltage, frequency, typical and maximum power draw), refer to the [Specifications section](#specifications) and ensure your outlet and circuit meet or exceed those requirements.

#### Do I Need Internet Access to Use TT-QuietBox 2?

This is not strictly required for basic local development, once everything is installed. However, for general use and working with public models, we do recommend Ethernet-connected internet when downloading large updates, models or model weights. WiFi is also available, although downloads will be slower.

#### How Can I Provide Feedback or Ask Questions?
If you’d like to get in touch with Tenstorrent, fill out our [contact us form](https://tenstorrent.com/contact) and we’ll route you to the right expert. 

If you need direct assistance with a product or want to chat about your setup, email support@tenstorrent.com. 

### Ordering and Shipping

#### What’s the Warranty Included With TT-QuietBox 2?
Tenstorrent warrants that, upon delivery, the Product will be free from material defects in materials and workmanship for 3 years. More details listed in the [limited warranty](https://tenstorrent.com/terms/limited-warranty). 

#### What is the Return Policy?
You may return a Product purchased directly on the Site within fourteen (14) days of receiving it. More details listed in the online terms of sale. To initiate a return, reach out to us at support@tenstorrent.com.

#### Where Do You Ship To?
We ship TT-QuietBox 2 (Blackhole) to countries where we are certified and permitted under local import and export regulations.

**Where we can ship:**

- **6-8 week lead time**
  - **NA:** USA, Canada
  - **APAC:** Japan
- **10-12 week lead time**
  - **EMEA:** EU, UK, Switzerland, Iceland, Norway
  - **APAC:** Australia, New Zealand

**Countries in progress:**

We are working towards certifications in the following countries. Contact sales for more information.

- **EMEA:** Serbia, Ethiopia, Saudi Arabia, Qatar, UAE, Turkey, Cyprus
- **APAC:** India, Singapore, Korea, Taiwan

**Where we cannot ship:**

We are not able to ship Blackhole products to the following countries due to U.S. export regulations:

- Afghanistan, Belarus, Burma, Central African Republic, China, Cuba, Democratic Republic of Congo, Eritrea, Haiti, Hong Kong, Iran, Iraq, Lebanon, Libya, Macau, Nicaragua, North Korea, Russia, Somalia, South Sudan, Sudan, Syria, Venezuela, Zimbabwe.

#### Why Can’t You Ship to My Country?

TT-QuietBox 2 shipments must comply with U.S. export control and trade compliance laws, as well as local import regulations and safety certifications in the destination country.

If your country is not on the “where we can ship” list, it may be due to:

Export control restrictions or sanctions.
Local certification or regulatory requirements that are still in progress.

[Reach out to our sales team](https://tenstorrent.com/contact) to discuss your specific situation and any upcoming certification plans.

### Technical Support and Troubleshooting: 

#### Can I Turn Off the Start Up Welcome Animation?
When the system boots up, you'll see a welcome animation. If you would like to disable this, in a Terminal, run:

```bash
/home/ttuser/scripts/tt-disable-demo-mode.sh
```

#### Why Does My Monitor Stay Black After Powering On?
First, ensure all cables are functioning and connected:
1. Confirm the power cable is securely connected to the back of the workstation, and is receiving power from a grounded outlet. 
2. Ensure you have flipped the "I" switch in the back of the workstation upright into the "on" position, then pressed the power button on the front of the workstation. 
3. Confirm the HDMI cable is securely connected at both the monitor and the workstation ports and is functioning normally.

If you have confirmed the above, and your system has been turned off for a long period (several weeks) and there is still no visual output on your connected monitor:

4. Check the back of the workstation. 
5. If all lights are off **except the yellow DRAM light,** this means the memory is re-training. 
6. Do not turn off the workstation. Please give the system up to 20 minutes to cycle. 
7. After this time, the connected monitor should prompt you to begin. If it does not, raise a support ticket with us and we'll help troubleshoot.


#### My Question Wasn’t Answered Here, Where Can I Reach Out?
For general questions, pre-sales inquiries, or to talk with our team, use the [contact us form](https://tenstorrent.com/contact) on the Tenstorrent website, and we’ll route you to the right expert.

For product-specific support, troubleshooting, returns, or warranty questions, email support@tenstorrent.com and our support team will follow up.

## Related pages

* {doc}`Software Setup </getting-started/README>` — install the Tenstorrent software stack.
</content>
</invoke>
