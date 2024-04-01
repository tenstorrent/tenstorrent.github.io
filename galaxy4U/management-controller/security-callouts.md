# Security Callouts

The Galaxy Management Controller is a Linux based system, and as such has a number of things that need to be noted from a security perspective that during a deployment needs to be taken into account and/or mitigated.

## System Users

There are two system users pre-set on the system as it ships, `root` and `msc`.  `root` is the standard super user account you would expect to find on a Linux system.  `msc` is a normal user style account, but it is not needed and if it's not intended to be used would be suggested to be removed.

### Default Usernames and passwords
#### root

Typical super user account, it is <span style="color:red">**HIGHLY**</span> recommended that the password for this account is changed, this can be done either by SSHing to the system and changing it, or by way of Cockpit and changing it there.

* **username:** `root`
* **password:** `mscldk`

#### msc

Typical non-privleged user account.  If it's not intended to be used it is **recommended** that the user be removed, and this can be done via the `root` account from ssh

* **username:** `msc`
* **password:** `mscldk`

## Open / used network ports
Dump of ports from the running system that are externally facing:
```
# netstat -anp | grep -v "^unix"
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      331/nginx: master p 
tcp6       0      0 :::22                   :::*                    LISTEN      1/init              
tcp6       0      0 :::9090                 :::*                    LISTEN      1/init              
tcp6       0      0 :::80                   :::*                    LISTEN      331/nginx: master p 
udp        0      0 0.0.0.0:36834           0.0.0.0:*                           320/avahi-daemon: r 
udp        0      0 0.0.0.0:5353            0.0.0.0:*                           320/avahi-daemon: r 
udp6       0      0 :::5353                 :::*                                320/avahi-daemon: r 
udp6       0      0 :::49923                :::*                                320/avahi-daemon: r 
raw6       0      0 :::58                   :::*                    7           308/NetworkManager
```
> **Note:** The above list is filtered to only show externally present ports

What the ports are, what they are doing, what they go to, why

| Protocol | Port(s) | What     | Description |
|----------|---------|----------|-------------|
| tcp      |     80  | HTTP     | Used by the system's Nginx browser to provide BMCLite |
| tcp      |     22  | ssh      | OpenSSH by way of a systemd socket listener |
| tcp      |   9090  | cockpit  | This is the standard port used by [Cockpit](https://cockpit-project.org/) |
|     udp  |   5355  | avahi| multicast dns (mDNS)
|     udp  | <varies>| avahi| Unicast DNS queries from Avahi
|   raw    |     58  | DHCP | This is a Listening port for DHCP

## Firewall

For a variety of reasons, the system does not have it's own independent firewall.  Services have been explicitly paired down to a bare minimum so that open ports are only open if they are actively being used.

## Mender Update system

We are making use of [Mender](https://mender.io) as the basis of our update system this provides two obvious channels for updates:

* Over-the-air
* Locally by way of `ssh`

These are more detailed in [Firmware Update](firmware_updates.md#mender) section.

### Collected Telemetry

Assuming the system successfully connects to [Mender](https://mender.io) certain telemetry is transmitted to Mender for the management of the device, this may include:
* device_type
* version of software running on the Galaxy Management Controller
  * Linux Kernel version
* Rough country and ity location based on external up addres
* External IP address used to connect to Mender
* Hostname assigned to the machine
* IPv4 and IPv6 addresses assigned to the Galaxy Management Controller
* Network MAC address for system identification

We do not have Mender's troubleshooting, or monitoring, capabilities enabled.

## Factory Resetting the system, what it does

The Galaxy Management Controller makes use of an overlay filesystem along with Mender's OTA update system.  This means that transitory data, like non-default configurations, end up being stored in `/data/upperdir`.  Should a *'Factory Reset'* need to happen using `ssh` to connect to the Galaxy Management Controller and running this command as `root` will take the system back to what the latest update is running as defaults:

```
rm -rfv /data/upperdir && reboot
```