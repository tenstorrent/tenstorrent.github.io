# curry Troubleshooting Common Hardware Issues

*<span style="color: purple;">Note: This content is still being drafted. Once finalized, the complete documentation will be available at docs.tenstorrent.com</span>*

*<span style="color: purple;">This page would like your suggestions for content and accuracy. Please add them to the [feedback form here](https://docs.google.com/spreadsheets/d/1y5mFBDAgewitmmoi2eWkuwDViIsMSsukkgnxH87Idc8/edit?usp=sharing). Thank you!</span>*

## Monitor Stays Black After Powering On
First, ensure that the Workstation is turned on. Confirm the power cable is securely connected, and is recieving power from a grounded outlet. Also ensure you have flipped the "I" switch in the back of the workstation upright into the "on" position, then pressed the power button on the front of the workstation. Lastly, confirm the HDMI cable is securely connected at both the monitor and the Workstation ports and is functioning normally.
If you have confirmed all cable connections, the power is on, and there is still no visual output on your connected monitor, check the back of the workstation. If all lights remain off **except the yellow DRAM light,** this means the memory is re-training. Do not off the Workstation. Please give the system up to 20 minutes to cycle. After this time, the connected monitor should prompt you to begin. If it does not, raise a support ticket with us and we'll help troubleshoot.

## Can I Connect to the BMC?
TT-QuietBox 2 does not have a BMC connection, and this connection is not needed for any of its functions. If there is something in particular you are looking for, please drop us a support request, and we will do our best to help.

## Can I Manually Install the full Tenstorrent Software Stack onto my TT-QuietBox 2?
Yes. Please visit the {doc}`Installing the Tenstorrent Software Stack guide <getting-started/README>`.

## I Opened Terminal, But Do Not See [tenstorrent.venv] Prompting Me
If your first opening of terminal do not show [tenstorrernt.venv] at the prompt, head to [Installing the Tenstorrent Software Stack](../../../getting-started/README.md) and follow steps 1 and 2 for running the tt-installer script. Once completed, your enviornment should automatically activate. Follow the steps on the [setup page](setup.md) to continue with TT-Studio.

## How Can I Reset My Workstation?
To do a hard reset...