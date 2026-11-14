---
myst:
  html_meta:
    robots: noindex, nofollow
    product-name: TT-QuietBox 2, Blackhole
    document-type: how-to
---

# Top Fan Replacement Instructions

```{raw} html
<style>
/* Center figure captions under the image on this page only. */
.rst-content figure:has(.fru-figure) {
  text-align: center;
}
.rst-content figure:has(.fru-figure) > a {
  display: block;
}
.rst-content figure:has(.fru-figure) img {
  display: block;
  margin: 0 auto;
}
.rst-content figure:has(.fru-figure) figcaption,
.rst-content figure:has(.fru-figure) figcaption p {
  text-align: center;
}
</style>
```

Revision 1.0, August 31, 2026

## Purpose

This procedure explains how to replace a top fan in a TT-QuietBox 2 (Blackhole) workstation. Use it only when Tenstorrent Support recommends a fan replacement.

Fan failure may be indicated by any of these signs:

* The system sounds louder than expected.
* The fan rattles.
* No hot air is being expelled from the top of the workstation.
* The fans are visibly not spinning.
* The system repeatedly shuts down due to overheating.

:::{warning}
To avoid damage to the workstation and personal injury, use only Tenstorrent-approved hardware with this workstation. Modifications that are not expressly approved by Tenstorrent may void the user's authority to operate it. Tenstorrent cannot accept responsibility for failure to satisfy any safety, EMC, or regulatory requirements that result from a non-approved modification of the server, including the use of non-Tenstorrent-recommended hardware.
:::

:::{figure} ./images/qb2-fru-chassis-exterior.png
:alt: TT-QuietBox 2 chassis exterior view
:width: 60%
:class: fru-figure

Figure 1: TT-QuietBox 2 chassis exterior view.
:::

## Before You Begin

:::{warning}
Failure to unplug the workstation before any repairs could result in electric shock or damage to the system. Do not proceed until the power cable is disconnected and the power supply is fully drained.
:::

1. Turn off the workstation and unplug AC power.
2. Allow 30 seconds for the power supply to drain.
3. Use only the Tenstorrent-provided replacement fan approved for this service.
4. Keep a secure place for screws, such as a magnetic pad or a cup, so that they don't get lost or fall inside the TT-QuietBox 2.

### You Will Need

* 2× replacement fans (Tenstorrent PN 33-00005-1)
* 1× Torx T10 screwdriver
* 1× Phillips PH2 screwdriver

:::{figure} ./images/qb2-fru-fan-exploded-view.jpg
:alt: TT-QuietBox 2 chassis exploded view showing the top cover, top fans, and side panel
:width: 60%
:class: fru-figure

Figure 2: TT-QuietBox 2 chassis exploded view.
:::

## Procedure

1. Confirm the workstation is disconnected from its power source.
2. Remove the workstation's clear side panel by loosening the four (4) thumbscrews (see Figure 2).
3. Loosen the five (5) Torx screws in the top panel (see Figure 2) to remove the top cover of the workstation. This exposes the top fan area.
4. Disconnect each fan's cable from the system connection point. Note the routing and orientation of each cable for reassembly.
5. Remove each top fan from its mounting location by removing the four (4) Phillips head screws (see Figure 2). Carefully take the fan out of the chassis.
6. Unpack the replacement fan and remove its rubber feet.
7. Place the replacement top fan in the same location and orientation as the removed fan. If the cable or extension cable does not comfortably reach the motherboard connection point, rotate the fan 90 degrees and try again.

:::{warning}
Ensure the replacement fan is installed with the blade assembly facing upwards, in the same orientation as the removed fan. Contact Tenstorrent Support if the fan cable does not reach the connection point in any orientation.
:::

8. When the fan is in the correct position, reinstall the four (4) Phillips head screws to secure the fan.
9. Reconnect the fan cable or extension cable. Confirm that the cable is routed cleanly, without interference from the cover or surrounding hardware.
10. Reinstall the top cover or fan access panel with the five (5) Torx screws.
11. Plug in the AC power and turn the system back on.

## Post-Replacement Success Checks

After the replacement, confirm the following before returning the system to normal use:

* The system powers on normally.
* Both top fans run smoothly, with no rattling or abnormal noise.
* Warm air exhausts from the top of the chassis under load.

## Contact Tenstorrent Support

Contact Tenstorrent Support if:

* One fan still sounds wrong, airflow still seems weak, or either fan is not spinning after the swap.
* The system continues to have thermal or fan-related overheating faults after replacement.

[Raise a support request](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1).

## Related pages

* {doc}`TT-QuietBox 2 Field Replaceable Units <index>`
