# Software Setup

Once the e75/e150 card is installed, you'll need to follow these steps in this order to update the firmware and install the necessary utilities to get the most from your Grayskull™ card. 



## Install Driver

### Prerequisite

You must have DKMS (Dynamic Kernel Module Support) installed. In your Ubuntu terminal, enter the following command:

```
apt install dkms
```

While other Linux distributions should work with our boards, Ubuntu 20.04 is currently the only version supporting both our TT-Buda and TT-Metalium frameworks.

### Installation

Please visit the following page to determine which version of TT-KMD is required for your intended use.

Once you have determined that, install the driver (**<u>TT-KMD</u>**) by entering the following series of commands in the terminal. This example assumes you are installing TT-KMD version 1.26, but please update the code as needed for different versions:

```
git clone https://github.com/tenstorrent/tt-kmd.git
cd tt-kmd
git checkout -b ttkmd-1.26 ttkmd-1.26
sudo dkms add .
sudo dkms install tenstorrent/1.26
sudo modprobe tenstorrent
```



## Install TT-Flash

To install **<u>TT-Flash</u>**, the utility used to update firmware, enter this command in the terminal:

```
pip install git+https://github.com/tenstorrent/tt-flash.git
```

If there are any issues installing TT-Flash, documentation can be found **<u>here</u>**.



## Update Firmware

Please visit the following page to determine which firmware version is required for the version of TT-Buda or TT-Metalium you want to use with your board.

Once you have determined that, enter the following series of commands in the terminal in order to update the firmware for your e75/e150 card. This example shows the instructions to install the ```fw_pack-80.8.0.0.fwbundle``` firmware, please update the command according to the firmware you intend to use:

```
wget https://github.com/tenstorrent/tt-firmware/raw/main/fw_pack-80.8.0.0.fwbundle
tt-flash --fw-tar fw_pack-80.8.0.0.fwbundle
```

If this process worked, reboot the system and go to the next section. 

If running this last command results in an error that says the firmware is too old, enter the following command:

```
tt-flash --fw-tar fw_pack-80.8.0.0.fwbundle --force
```

Then reboot the system.



## Install Software Management Interface (TT-SMI)

Install the Tenstorrent Software Management Interface (**<u>TT-SMI</u>**) by entering this command in the terminal:

```
pip install git+https://github.com/tenstorrent/tt-smi
```

## 

## Run Software Management Interface (TT-SMI)

Run the TT-SMI tool by entering the command in the terminal:

```
tt-smi
```

If the tool runs without error, you're ready to get started! 

## 

## First 5 Things to Do

Now that your Grayskull™ e75/e150 AI graph processor is installed and up and running, there are two SDKs you can work with to familiarize yourself with the hardware and associated utilities and software. Each SDK lists five tasks to start with.

- [First 5 Things](https://github.com/tenstorrent/tt-buda-demos?tab=readme-ov-file#first-5-things-to-do) for **TT-Buda**, our high level SDK
- [First 5 Things](https://github.com/tenstorrent-metal/tt-metal/blob/main/INSTALLING.md) for **TT-Metalium**, our open source, low level SDK
