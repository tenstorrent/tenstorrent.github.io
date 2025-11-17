---
myst:
  html_meta:
    product-name: tt-installer, TT-Metalium™
    technology-concepts: model-demos, container, Podman
    document-type: how-to
---

# Running Model Demos
This guide is for users who have installed the base Tenstorrent Software Stack. You'll learn how to download and enter the containerized environment for model demos, run a basic operation to verify the environment is working, and find more complex model examples.

This guide demonstrates how to run the tt-metalium model demos using the [tt-installer](https://github.com/tenstorrent/tt-installer) tool. The tt-installer can be used to download a [container for running the tt-metalium demos](https://github.com/tenstorrent/tt-installer?tab=readme-ov-file#using-tt-metalium). This container possesses a full build of the tt-metalium project, including the demo source code.

---

## **Before You Begin**

:::{important}
This guide assumes you have already installed the necessary system dependencies and drivers by following the [Installing the Tenstorrent Software Stack](./README.md) guide.
:::

---

## **Step 1: Download and Installing the Demos Container**

The model demos are packaged in a dedicated container. This keeps the demo environment and its specific dependencies separate from your system.

Run the following command to add the models container to your existing Tenstorrent software installation.

```bash
/bin/bash -c "$(curl -fsSL https://github.com/tenstorrent/tt-installer/releases/latest/download/install.sh)" -- --no-install-kmd --no-install-hugepages --no-install-metalium-container --install-metalium-models-container --no-install-tt-flash --no-install-tt-topology --update-firmware="off" --reboot-option="never" --mode-non-interactive
```

## **Step 2: Starting the Container**
To use the models container, execute this command to create an interactive shell with all configuration taken care of:
```bash
tt-metalium-models
```

:::{note}
This container is ephemeral so all changes made inside will be lost when the container is stopped
:::

## **Step 3: Run a simple program**

To confirm that the environment is configured correctly and can access the hardware, run the simple test program. This program performs an exponentiation and a matrix multiplication operation on the device:

```bash
# this should be run inside the container
python ttnn/ttnn/examples/usage/run_op_on_device.py
```

Successful execution will complete without errors, confirming your setup is correct.

## **Step 4: Explore More Model Demos**

This container includes demos for a wide variety of models. You can find instructions for each one in the [tt-metal GitHub repository.](https://github.com/tenstorrent/tt-metal/tree/main)

See [the tt-metal models page](https://github.com/tenstorrent/tt-metal/blob/main/models/README.md) for a full list and links to individual guides for models covering:
* Large Language Models (LLMs)
* Speech-To-Text
* Diffusion
* Image Classification
* Vision Transformers
* Object Detection
* Image Segmentation
* Natural Language Processors (NLPs)

## **Step 5: Exit the Container**
When you are finished, exit the interactive shell.

```bash
exit
```

---

## **Need Additional Support?**
If you encounter any issues, or have a question that isn't covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.
