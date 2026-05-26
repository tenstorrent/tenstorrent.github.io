# FAQ and Troubleshooting 

*<span style="color: purple;">Note: This product is pre-launch and documentation is subject to change.</span>*

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


### My Question Wasn’t Answered Here, Where Can I Reach Out?
For general questions, pre-sales inquiries, or to talk with our team, use the [contact us form](https://tenstorrent.com/contact) on the Tenstorrent website, and we’ll route you to the right expert.

For product-specific support, troubleshooting, returns, or warranty questions, email support@tenstorrent.com and our support team will follow up.
