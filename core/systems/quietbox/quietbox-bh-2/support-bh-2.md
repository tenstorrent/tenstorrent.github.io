# Troubleshooting Common Hardware Issues

*<span style="color: purple;">Note: This content is still being drafted. Once finalized, the complete documentation will be available at docs.tenstorrent.com</span>*

*<span style="color: purple;">This page would like your suggestions for content and accuracy. Please add them to the [feedback form here](https://docs.google.com/spreadsheets/d/1y5mFBDAgewitmmoi2eWkuwDViIsMSsukkgnxH87Idc8/edit?usp=sharing). Thank you!</span>*

## Monitor Stays Black After Powering On
First, ensure all cables are functioning and connected:
1. Confirm the power cable is securely connected to the back of the Workstation, and is recieving power from a grounded outlet. 
2. Ensure you have flipped the "I" switch in the back of the Workstation upright into the "on" position, then pressed the power button on the front of the workstation. 
3. Confirm the HDMI cable is securely connected at both the monitor and the Workstation ports and is functioning normally.

If you have confirmed the above, and there is still no visual output on your connected monitor:

4. Check the back of the Workstation. 
5. If all lights are off **except the yellow DRAM light,** this means the memory is re-training. 
6. Do not turn off the Workstation. Please give the system up to 20 minutes to cycle. 
7. After this time, the connected monitor should prompt you to begin. If it does not, raise a support ticket with us and we'll help troubleshoot.

## Can I Manually Install the Full Tenstorrent Software Stack Onto my TT-QuietBox 2?
Yes. Please visit the [Installing the Tenstorrent Software Stack guide](../../../getting-started/README.html).

## I Opened Terminal, But Do Not See `tenstorrent.venv`
If your first opening of terminal does not show `tenstorrernt.venv` at the prompt, head to [Installing the Tenstorrent Software Stack](../../../getting-started/README.html) and follow steps 1 and 2 for running the tt-installer script. Once completed, your enviornment should automatically activate. Follow the steps on the [setup page](setup.html) to continue with TT-Studio.
