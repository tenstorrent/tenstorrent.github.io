# FAQ and Troubleshooting 

## Hardware and Software Details

### What Software Can I Run Out of the Box on My TT-QuietBox 2?
TT-QuietBox 2 ships with Ubuntu 24.04 and has the Tenstorrent open source software stack preinstalled. You can run models right away through TT-Studio, our simple web interface, or perform more custom model deployments through the TT-Inference Server, TT-Metalium, and TT-Forge SDKs.

You still have full access to Ubuntu, so you can install your own development tools, libraries, and workflows on top, if you prefer more customization.

### What Models Can the TT-QuietBox 2 Run Out of the Box?
The full list of supported and validated models is available on the [Tenstorrent Developer Hub](https://tenstorrent.com/developers). In the models catalog, filter by “TT-QuietBox 2” to see all currently supported models for this system.

Don’t see your model supported? Submit a support ticket to chat with us. We may be able to help you bring your model up using the Tenstorrent software stack or point you to ongoing work.

### What Are the Specifications of the TT-QuietBox 2?
TT-QuietBox 2 is a liquid-cooled desktop workstation built around the Blackhole® ASIC, with integrated CPU, memory, storage, and networking suitable for AI development workloads.

For full details (processor configuration, memory, storage, power requirements, dimensions, etc.), see the [Specifications page of the TT-QuietBox 2 documentation](./specifications.md).

### Where Can I Set Up a TT-QuietBox 2?

TT-QuietBox 2 is designed to operate in a typical office, lab, or home-office environment, and plug into a standard outlet. It fits well on or under a desk. Wherever you decide to set up your workstation, ensure there is 10in / 25cm of clearance to allow for sufficient airflow, which is drawn in from the bottom and the sides. Avoid stacking papers or binders against your TT-QuietBox 2, or placing any items on top of the tower, as this is where the fan exhausts the system heat. 

For detailed information on power draw and circuit breaker requirements, see the [Specifications page of the TT-QuietBox 2 documentation](./specifications.md).

### Does My TT-QuietBox 2 Require Maintenance?
Yes. Like any liquid-cooled desktop workstation, TT-QuietBox 2 will require periodic coolant top-ups. Under typical development workloads, you can expect to do this approximately every year. Exact intervals depend on usage, environment, and duty cycle.

Maintenance procedures and recommended coolant/service guidelines will be documented in the TT-QuietBox 2 hardware documentation.

### How Loud Is the TT-QuietBox 2?

TT-QuietBox 2 is liquid-cooled and engineered to run quietly enough for office or home-office use. Actual noise levels depend on workload and ambient conditions, but the system is intended to be comfortable to use at a desk compared to traditional air-cooled workstations. Our lab tests measured 39.8 dBA sound pressure under maximum operating load (for reference, a typical front-load washing machine operates between 40-50 dBA).

### What Kind of Power Outlet Do I Need? How Much Power Does It Draw?

For detailed power specifications (input voltage, frequency, typical and maximum power draw), refer to the [Specifications page](./specifications.md) and ensure your outlet and circuit meet or exceed those requirements.

### Do I Need Internet Access to Use TT-QuietBox 2?

This is not strictly required for basic local development, once everything is installed. However, for general use and working with public models, we do recommend Ethernet-connected internet when downloading large updates, models or model weights. WiFi is also available, although downloads will be slower.

### How Can I Provide Feedback or Ask Questions?
If you’d like to get in touch with Tenstorrent, fill out our [contact us form](https://tenstorrent.com/contact) and we’ll route you to the right expert. 

If you need direct assistance with a product or want to chat about your setup, email support@tenstorrent.com. 

## Ordering and Shipping

### What’s the Warranty Included With TT-QuietBox 2?
Tenstorrent warrants that, upon delivery, the Product will be free from material defects in materials and workmanship for 3 years. More details listed in the [limited warranty](https://tenstorrent.com/terms/limited-warranty). 

### What is the Return Policy?
You may return a Product purchased directly on the Site within fourteen (14) days of receiving it. More details listed in the online terms of sale. To initiate a return, reach out to us at support@tenstorrent.com.

### Where Do You Ship To?
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

### Why Can’t You Ship to My Country?

TT-QuietBox 2 shipments must comply with U.S. export control and trade compliance laws, as well as local import regulations and safety certifications in the destination country.

If your country is not on the “where we can ship” list, it may be due to:

Export control restrictions or sanctions.
Local certification or regulatory requirements that are still in progress.

[Reach out to our sales team](https://tenstorrent.com/contact) to discuss your specific situation and any upcoming certification plans.

## Technical Support and Troubleshooting: 

### Can I Turn Off the Start Up Welcome Animation?
When the system boots up, you'll see a welcome animation. If you would like to disable this, in a Terminal, run:

```bash
/home/ttuser/scripts/tt-disable-demo-mode.sh
```

### Why Does My Monitor Stay Black After Powering On?
First, ensure all cables are functioning and connected:
1. Confirm the power cable is securely connected to the back of the workstation, and is receiving power from a grounded outlet. 
2. Ensure you have flipped the "I" switch in the back of the workstation upright into the "on" position, then pressed the power button on the front of the workstation. 
3. Confirm the HDMI cable is securely connected at both the monitor and the workstation ports and is functioning normally.

If you have confirmed the above, and your system has been turned off for a long period (several weeks) and there is still no visual output on your connected monitor:

4. Check the back of the workstation. 
5. If all lights are off **except the yellow DRAM light,** this means the memory is re-training. 
6. Do not turn off the workstation. Please give the system up to 20 minutes to cycle. 
7. After this time, the connected monitor should prompt you to begin. If it does not, raise a support ticket with us and we'll help troubleshoot.


(qb2-add-new-user)=
### How Do I Add a New User to My TT-QuietBox 2?
You can add additional users to your TT-QuietBox 2 and install the necessary Tenstorrent software for each one. Follow these steps:

1. Create the new user from **Ubuntu Settings > Users > Add New User**.
2. Ensure the new user is given **Administrator** privileges.
3. Log out, then log back in as the new user.
4. Open a Terminal window by pressing Ctrl+Alt+T and run the following commands, which will install the Tenstorrent software and trigger a system reboot.

```bash
sudo usermod -aG docker $USER
newgrp docker

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
5. Upon reboot, log in with the new user, open a Terminal window, and run these commands:

```bash
cd ~/.local/lib/tt-studio
git checkout tt_qb2_launch_branch
git pull
```
6. If you'd like to use the pre-downloaded Qwen3-32B model with this new user, copy the model files to their home directory:

```bash
mkdir -p ~/data/tt-cache
sudo cp -r /home/ttuser/data/tt-cache/volume_id_tt_transformers-Qwen3-32B-vqb2_launch /home/$USER/data/tt-cache/volume_id_tt_transformers-Qwen3-32B-vqb2_launch
sudo chown -R $USER:$USER /home/$USER/data/tt-cache/volume_id_tt_transformers-Qwen3-32B-vqb2_launch/
sudo chmod -R o+rwX /home/$USER/data/tt-cache/volume_id_tt_transformers-Qwen3-32B-vqb2_launch
```
7. Continue the software setup in the TT-QuietBox 2 setup guide at [Step 8: Get Access to Model Weights](./setup.md#step-8-get-access-to-model-weights).

### What Should I Do If Docker Crashes on My TT-QuietBox 2?
Sometimes there are issues with the system-level Docker installation and the Tenstorrent software stack that are most easily solved by uninstalling and reinstalling Docker. While Docker comes pre-installed on your TT-QuietBox 2, you may run into a situation where Docker crashes unexpectedly when running TT-Studio or other applications. The quickest fix is to follow the instructions on the Docker website to [uninstall and reinstall the latest Docker Engine](https://docs.docker.com/engine/install/ubuntu/).

### My Question Wasn’t Answered Here, Where Can I Reach Out?
For general questions, pre-sales inquiries, or to talk with our team, use the [contact us form](https://tenstorrent.com/contact) on the Tenstorrent website, and we’ll route you to the right expert.

For product-specific support, troubleshooting, returns, or warranty questions, email support@tenstorrent.com and our support team will follow up.
