# Software Setup

Once the T7000 is up and running with an operating system installed, you’ll need to follow these steps in this order to install the necessary utilities.



## Install Driver

### Prerequisite

You must have DKMS (Dynamic Kernel Mode Support) installed. In the terminal, enter the command appropriate to your Linux distro.

| Linux Distro           | Command                                        |
| ---------------------- | ---------------------------------------------- |
| Debian, Ubuntu         | `apt install dkms`                             |
| Fedora                 | `dnf install dkms`                             |
| Enterprise Linux Based | `dnf install epel-release && dnf install dkms` |

### Installation

Install the driver (**<u>TT-KMD</u>**) by entering this series of commands in the terminal:

```
git clone https://github.com/tenstorrent/tt-kmd.git
cd tt-kmd
git checkout -b ttkmd-1.26 ttkmd-1.26
sudo dkms add .
sudo dkms install tenstorrent/1.26
sudo modprobe tenstorrent
```



## Install Software Management Interface (TT-SMI)

Install the Tenstorrent Software Management Interface (**<u>TT-SMI</u>**) by entering this command in the terminal:

```
pip install git+https://github.com/tenstorrent/tt-smi
```



## Run Software Management Interface (TT-SMI)

Run the TT-SMI tool by entering the command in the terminal:

```
tt-smi
```

If the tool runs without error, the system is ready.