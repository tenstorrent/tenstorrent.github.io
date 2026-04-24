# FAQ and Troubleshooting 

*<span style="color: purple;">Note: This product is pre-launch and documentation is subject to change.</span>*

## Can I Manually Install the Full Tenstorrent Software Stack Onto my TT-QuietBox 2?
Yes. Please visit the [Installing the Tenstorrent Software Stack guide](../../../getting-started/README.html).

## Can I Turn Off the Start Up Welcome Animation?
When the system boots up, you'll see a welcome animation. If you would like to disable this, in a Terminal, run:

```bash
/home/ttuser/scripts/disable-demo-mode.sh
```

## Why Does My Monitor Stay Black After Powering On?
First, ensure all cables are functioning and connected:
1. Confirm the power cable is securely connected to the back of the Workstation, and is recieving power from a grounded outlet. 
2. Ensure you have flipped the "I" switch in the back of the Workstation upright into the "on" position, then pressed the power button on the front of the workstation. 
3. Confirm the HDMI cable is securely connected at both the monitor and the Workstation ports and is functioning normally.

If you have confirmed the above, and your system has been turned off for a long period (several weeks) and there is still no visual output on your connected monitor:

4. Check the back of the Workstation. 
5. If all lights are off **except the yellow DRAM light,** this means the memory is re-training. 
6. Do not turn off the Workstation. Please give the system up to 20 minutes to cycle. 
7. After this time, the connected monitor should prompt you to begin. If it does not, raise a support ticket with us and we'll help troubleshoot.
