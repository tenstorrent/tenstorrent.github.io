# TT-BUDA Installation

## Overview

The TT-BUDA software stack can compile models from several different frameworks and execute them in many different ways on Tenstorrent hardware.

This user guide is intended to help you setup your system with the appropriate device drivers, firmware, system dependencies, and compiler / runtime software.

**Note on terminology:**

While TT-BUDA is the official Tenstorrent AI/ML compiler stack, PyBUDA is the Python interface for TT-BUDA. TT-BUDA is the core technology; however, PyBUDA allows users to access and utilize TT-BUDA’s features directly from Python. This includes directly importing model architectures and weights from PyTorch, TensorFlow, ONNX, and TFLite.

## Prerequisites

### OS Compatibility

Presently, Tenstorrent software is only supported on the **Ubuntu 20.04 LTS (Focal Fossa)** operating system.

## Download

To access the PyBUDA software and associated files, please navigate to [https://github.com/tenstorrent/tt-buda](https://github.com/tenstorrent/tt-buda).

To install a release, please go to [https://github.com/tenstorrent/tt-buda/releases](https://github.com/tenstorrent/tt-buda/releases). Once you have identified the release version you would like to install, you can download the individual files by clicking on their name.

## Install

PyBUDA releases can be installed using two methods: [Python virtualenv](#python-environment-installation) or [Docker](#docker-container-installation). PyBUDA can be installed from source following the Python virtualenv method.

### Python Environment Installation

It is strongly recommended to use virtual environments for each project utilizing PyBUDA and Python dependencies. Creating a new virtual environment with PyBUDA and libraries is very easy.

Prerequisites (detailed sections below) for python envirnment installation are listed here:

> * [Setup HugePages (below)](#setup-hugepages)
> * [PCI Driver Installation (below)](#pci-driver-installation)
> * [Device Firmware Update (below)](#device-firmware-update)
> * [Backend Compiler Dependencies (below)](#backend-compiler-dependencies)
> * [Additional PyBUDA Compile Dependencies (below)](#additional-pybuda-compile-dependencies)
> * [Tenstorrent Software Package (below)](#tenstorrent-software-package).

To install a PyBUDA release, follow these steps:

* Step 1. Navigate to [https://github.com/tenstorrent/tt-buda/releases](https://github.com/tenstorrent/tt-buda/releases) and download the latest release pybuda and tvm wheel files
* Step 2. Create your Python environment in desired directory

```bash
python3 -m venv env
```

* Step 3. Activate environment

```bash
source env/bin/activate
```

* Step 4. Pip install PyBuda and TVM

If you have downloaded the latest release wheel files, you can install them directly with pip.

```bash
pip install pybuda-<version>.whl tvm-<version>.whl
```

To compile PyBUDA from source, follow these steps:

* Step 1. Clone PyBUDA from [https://github.com/tenstorrent/tt-buda/](https://github.com/tenstorrent/tt-buda/)
* Step 2. Update submodules

```bash
cd tt-buda
git submodule update --init --recursive
```

* Step 3. Compile. PyBUDA’s make system will automatically create the needed venv

```bash
make
source  build/python_env/bin/activate
```

### Docker Container Installation

Alternatively, PyBUDA and its dependencies are provided as Docker images which can run in separate containers.

Prerequisites (detailed sections below) for docker installation are listed here:

> * [PCI Driver Installation (below)](#pci-driver-installation)
> * [Device Firmware Update (below)](#device-firmware-update)
* Step 1. Setup a personal access token (classic)

Create a personal access token from: [https://github.com/settings/tokens](https://github.com/settings/tokens).
Give the token the permissions to read packages from the container registry `read:packages`.

* Step 2. Login to Docker Registry

```bash
GITHUB_TOKEN=<your token>
echo $GITHUB_TOKEN | sudo docker login ghcr.io -u <your github username> --password-stdin
```

* Step 3. Pull the image

```bash
sudo docker pull ghcr.io/tenstorrent/tt-buda/<TAG>
```

* Step 4. Run the container

```bash
sudo docker run --rm -ti --shm-size=4g --device /dev/tenstorrent -v /dev/hugepages-1G:/dev/hugepages-1G -v `pwd`/:/home/ ghcr.io/tenstorrent/tt-buda/<TAG> bash
```

* Step 5. Change root directory

```bash
cd home/
```

## Installation Prerequisites

### Setup HugePages

```bash
NUM_DEVICES=$(lspci -d 1e52: | wc -l)
sudo sed -i "s/^GRUB_CMDLINE_LINUX_DEFAULT=.*$/GRUB_CMDLINE_LINUX_DEFAULT=\"hugepagesz=1G hugepages=${NUM_DEVICES} nr_hugepages=${NUM_DEVICES} iommu=pt\"/g" /etc/default/grub
sudo update-grub
sudo sed -i "/\s\/dev\/hugepages-1G\s/d" /etc/fstab; echo "hugetlbfs /dev/hugepages-1G hugetlbfs pagesize=1G,rw,mode=777 0 0" | sudo tee -a /etc/fstab
sudo reboot
```

### PCI Driver Installation

Please navigate to [https://github.com/tenstorrent/tt-kmd](https://github.com/tenstorrent/tt-kmd) and follow the readme to install the kernel mode PCI driver.

### Device Firmware Update

Please navigate to [https://github.com/tenstorrent/tt-flash](https://github.com/tenstorrent/tt-flash) and [https://github.com/tenstorrent/tt-firmware-gs](https://github.com/tenstorrent/tt-firmware-gs) to download a utility for flashing device firmwares and the firmware itself.  Follow respective readmes for setup and installation.

### Backend Compiler Dependencies

Instructions to install the Tenstorrent backend compiler dependencies on a fresh install of Ubuntu Server.

You may need to append each `apt-get` command with `sudo` if you do not have root permissions.

```bash
apt-get update -y && apt-get upgrade -y --no-install-recommends
apt-get install -y software-properties-common
apt-get install -y python3.8-venv libboost-all-dev libgoogle-glog-dev libgl1-mesa-glx ruby
apt-get install -y build-essential clang-6.0 libhdf5-serial-dev libzmq3-dev
```

### Additional PyBUDA Compile Dependencies

#### OS Level Dependencies

Additional dependencies to compile PyBUDA from source after running [Backend Compiler Dependencies](#backend-compiler-dependencies)

You may need to append each `apt-get` command with `sudo` if you do not have root permissions.

```bash
apt-get install -y libyaml-cpp-dev python3-pip sudo git git-lfs
apt-get install -y wget cmake cmake-data
pip3 install pyyaml
```

#### Package Level Dependencies

In addition, if you intend to utilize `torchvision` for your model development, we strongly recommend installing it using a specific method that ensures optimal compatibility with PyBUDA. This method involves building and installing torchvision from its source code, which allows for the necessary dependencies and configurations to be correctly set up.

To do this, you should use the following commands:

```bash
export TORCH_VISION_INSTALL=1
make torchvision
```

The `export TORCH_VISION_INSTALL=1` command sets an environment variable that our Makefile script uses to determine whether to install `torchvision`. By setting this variable to 1, you’re instructing the script to proceed with the `torchvision` installation.

The `make torchvision` command then triggers the build and installation process. This process includes cloning the `torchvision` repository, checking out the desired version, and building `torchvision` using its `setup.py` script.

By following these steps, `torchvision` will be installed in a way that ensures it works effectively with PyBUDA.

#### NOTE
The `TORCH_VISION_INSTALL` flag is not limited to the `make torchvision` command. It can also be used with the standard `make build` command. When this flag is set to 1, the build process will include the installation of `torchvision`, regardless of the specific `make` command used. This allows for flexibility in your build process, enabling you to include or exclude the `torchvision` installation as needed.

#### NOTE
For your convenience, the `torchvision` wheel file is already included in the PyBUDA release bundle. This means that if you’re using the release bundle, you won’t need to build `torchvision` from source unless you want to use a different version or need to modify the source code. Simply install the provided wheel file using pip to add `torchvision` to your Python environment.

Here’s an example of how you can install the `torchvision` wheel file:

```bash
pip install /path/to/your/wheel/file/torchvision*.whl
```

Replace `/path/to/your/wheel/file/torchvision*.whl` with the actual path to the `torchvision` wheel file in the PyBUDA release bundle.

#### NOTE
To run the existing unit tests of PyBUDA components, e.g. after compiling it from source, you need to install the following packages.

```bash
apt-get install -y wget libgtest-dev libgmock-dev
```

### TT-SMI

Please navigate to [https://github.com/tenstorrent/tt-smi](https://github.com/tenstorrent/tt-smi) to get Tenstorrent’s System Management Interface tool. A command line utility to interact with all Tenstorrent devices on host.

### Tenstorrent Software Package

Acquire pybuda and associated software from the aforementioned [Download](#download) section.

Relevant files:

```bash
pybuda-<version>.whl   <- Latest PyBUDA Release
tvm-<version>.whl      <- Latest TVM Release
```

## Smoke Test

With your Python environment with PyBUDA install activated, run the following Python script:

```python
import pybuda
import torch


# Sample PyTorch module
class PyTorchTestModule(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.weights1 = torch.nn.Parameter(torch.rand(32, 32), requires_grad=True)
        self.weights2 = torch.nn.Parameter(torch.rand(32, 32), requires_grad=True)
    def forward(self, act1, act2):
        m1 = torch.matmul(act1, self.weights1)
        m2 = torch.matmul(act2, self.weights2)
        return m1 + m2, m1


def test_module_direct_pytorch():
    input1 = torch.rand(4, 32, 32)
    input2 = torch.rand(4, 32, 32)
    # Run single inference pass on a PyTorch module, using a wrapper to convert to PyBUDA first
    output = pybuda.PyTorchModule("direct_pt", PyTorchTestModule()).run(input1, input2)
    print(output)


if __name__ == "__main__":
    test_module_direct_pytorch()
```
