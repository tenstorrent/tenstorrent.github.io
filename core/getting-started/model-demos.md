# Model Demos
This page demonstrates how to run the tt-metalium model demos using the [tt-installer](https://github.com/tenstorrent/tt-installer) tool. The tt-installer can be used to [download a container for running the tt-metalium demos](https://github.com/tenstorrent/tt-installer?tab=readme-ov-file#using-tt-metalium). This container possesses a full build of the tt-metalium project, including the demo source code.

**NOTE: this page assumes you have already used tt-installer to install the system dependencies as shown in the [starting guide](https://docs.tenstorrent.com/getting-started/README.html)**

## Downloading and installing the tt-metalium models container
Execute the following command to download and install the tt-metalium models container:
```bash
/bin/bash -c "$(curl -fsSL https://github.com/tenstorrent/tt-installer/releases/latest/download/install.sh)" --no-install-kmd --no-install-hugepages --no-install-metalium-container --install-metalium-models-container --no-install-tt-flash --no-install-tt-topology --update-firmware="off" --reboot-option="never" --mode-non-interactive
```

## Starting the container and running a simple program
To use the models container, execute this command to create an interactive shell with all configuration taken care of:
```bash
tt-metalium-models
```
**NOTE: this container is ephemeral so all changes made inside will be lost when the container is stopped**

Run the following simple program to perform a simple exponentiation + matrix multiplication operation:
```bash
# this should be run inside the container
python ttnn/ttnn/examples/usage/run_op_on_device.py
```

## Run more model demos
The full list of model demos to run can be found in the [tt-metal GitHub repository](https://github.com/tenstorrent/tt-metal/tree/main). Scroll down that page to find the table of model demos for the following model types:
* LLMs
* Speech-To-Text
* Diffusion
* Image Classification
* Vision Transformers
* Object Detection
* Segmentation
* NLPs

Clicking on each model's name will navigate to the demo page which contains all instructions for running that demo.

## Exiting the container
To exit the container, simply run this command:
```bash
exit
```
