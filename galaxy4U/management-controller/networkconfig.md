# Galaxy 4u - Galaxy Management Controller - Networking Configuration

## Networking

The Galaxy Management Controller is only accessible via the 1000BaseT port on the back of the Galaxy 4u system.  This can be seen at position 5 of the following diagram
![Galaxy 4U back panel layout](https://2261852768-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FYH0NkcMJgtVy0Po3TGtY%2Fuploads%2FIp4NwrmYutY4t4Bfeq8U%2FIO_Diagram_Back.png?alt=media&token=325055f1-6ef6-4a60-9d74-7d8718609655)

This port is only used to provide telemetry data about the Galaxy 4u system itself, allow for firmware updates of the AI chips on the system, as well as basic power control and port configuration of the Galaxy 4u chassis.

### How it works under the hood

The Galaxy Management Controller runs a Linux based operating system, and uses NetworkManager to provide it's network configuration.  This comprises two main configuration profiles that are shipped out of the box:
- **dhcp**<br/>
This is the primary configuration, and will run first.  This will attempt to acquire a DHCP address from a local DHCP server for IPv4, and if present, will perform appropriate [SLAAC](https://www.rfc-editor.org/rfc/rfc4862) configuration for IPv6 addresses.  This will try up to 3 times to acquire a DHCP address with a timeout of 10 seconds on each try before falling back to the static profile.
  - During DHCP the system will also, temporarily, assign the static IP address of `192.168.201.6/24` as a secondary IP address.  Should DHCP be successful it is removed from the interface and the system will only have the DHCP provided IP address.
    - IP: `192.168.201.6`
    - Subnet: `255.255.255.0` or a `/24`
    - Default Route: none
    - DNS: empty
    - DNS Search: empty
- **static**<br/>
Should DHCP be unsuccessful the system will fall through to a static IP configuration of:
  - IP: `192.168.201.6`
  - Subnet: `255.255.255.0` or a `/24`
  - Default Route: `192.168.201.1`
  - DNS: `192.168.201.1`
  - DNS Search: empty

### Changing the IP configuration
#### ***WARNING***

There is **NO** acess to the Galaxy Management Controller outside of the network port, if the network is incorrectly set the only means of recovery involves removing the BMC from the bottom of the Galaxy 4u chassis and modifying the onboard emmc disk in an appropriate carrier board.  It is **HIGHLY** recommended to use DHCP and/or IPv6 addresses with the Galaxy Management Controller and not modify the network configuration unless the new network settings are well understood, and tested on systems that can be more easily recovered.

#### Cockpit (preferred/recommended method)

[Cockpit](https://cockpit-project.org/) has an in built network configuration utility, this will end up editing the currently running the network configuration.  Detailed documentation about settings for Cockpit network configuration can be found here:
- [Managing systems using the RHEL 7 web console > Chapter 4. Managing networking in the web console](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/managing_systems_using_the_rhel_7_web_console/managing-networking-in-the-web-console_system-management-using-the-rhel-7-web-console)
- [Managing systems using the RHEL 9 web console > Chapter 11. Configuring VLANs in the web console](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/managing_systems_using_the_rhel_9_web_console/configuring-vlans-in-the-web-console_system-management-using-the-rhel-9-web-console)
- [General Cockpit Documentation](https://cockpit-project.org/documentation.html)

**One thing to specifically note:** this is the safest way to set networking information, as Cockpit will set the new information and then re-test connectivity.  If it's unsuccessful for some reason it will revert and ask the user to confirm if they are **SURE** that's what they want to do as the configuration is expected to cause loss of connectivity.

**Note:** Cockpit's web interface uses the Galaxy Management Controller's local users to authenticate against, so this should end up as the same username and password that is either noted in [Security callouts](security-callouts.md) or that's been subsequently added to the system.

#### SSH

SSHing to the Galaxy Management Controller is doable, ssh default tos running on port 22, and has two users by default.  Please see the [Security callouts](security-callouts.md) for more details on the users, and ssh on the system.

##### nmcli

Once logged into the machine directly via ssh the network configurations can be manipulated via the `nmcli` command.  The manual page for `nmcli` can be found [here](https://www.networkmanager.dev/docs/api/latest/nmcli.html) and a number of `nmcli` examples can be found [here](https://www.networkmanager.dev/docs/api/latest/nmcli-examples.html).  The intention here is to cover the most likely situation, which would be setting a static IPv4 address for the system.

NetworkManager scripts work on 'profiles' or 'connections' and can be viewed via `nmcli con`
> <pre><span style="color:aqua">root@tt-galaxy-4u:</span>~# nmcli con
> NAME    UUID                                  TYPE      DEVICE
> <span style="color:green">dhcp    0ed1913e-73c7-4c45-b6be-2b5af8a15c54  ethernet  eth0</span>
> static  0ed1913e-73c7-4c45-b6be-2b5af8a15c55  ethernet  --
> <span style="color:aqua">root@tt-galaxy-4u:</span>~#</pre>

It can be seen above that the `dhcp` is the currently active profile by noting that it's both green and that `eth0` is assigned to it.

###### Setting a Static IP

<span style="color: red">**WARNING:**</span> Manually editing the network configuration this way has no fallback, and may render the Galaxy Management Controller unreachable, which would make resetting the Galaxy, or individual 4ucm nodes impossible, as well as causing an inability to do firmware upgrades to the Galaxy Management Controller or the AI cores themselves.  This is reversible, but only by fully removing the Galaxy Management Controller from the Galaxy chassis through the bottom of the system, and placing the Galaxy Management Controller into a separate adapter to be able to gain access either to the serial console or the emmc directly on the system.

><pre>nmcli \
>  con \
>  add \
>  type ethernet \
>  ifname eth0 \
>  con-name <span style="color:red">yournamehere</span> \
>  connection.autoconnect-priority 10 \
>  ipv4.addresses <span style="color:red">"[IP ADDR]/22"</span> \
>  ipv4.gateway <span style="color:red">"10.250.0.1"</span> \
>  ipv4.dns <span style="color:red">"10.250.20.50 10.220.20.50"</span> \
>  ipv4.dns-search <span style="color:red">"local.example.com"</span> \
>  ipv4.method manual
></pre>

That's a long command so lets break this down some:
* `nmcli con add`: This is basically 'add a connection'
* `type ethernet`: Since `nmcli` can handle a variety of network types need to define this as *'normal'* ethernet
* `ifname eth0`: set this against `eth0` or the appropriate network interface.
* `con-name yournamehere`: this sets the connection/profile name for what you are editing, please change the *'yournamehere'* to a name you would prefer
* `connection.autoconnect-priority 10`: this sets the connection priority higher than `dhcp` and `static` so it will run first.  Noting that if this is a static configuration it won't have a good condition to fall back from as static should be inherently successful.
* `ipv4.addresses`: this is the IPv4 address and netmask you want for the connection
* `ipv4.gateway`: IPv4 gateway address if you need/want to route beyond the local subnet
* `ipv4.dns`: set the IP address(es) of the DNS you want to use
* `ipv4.dns-search`: What local search domain you want DNS to use
* `ipv4.method manual`: This switches the configuration type to manual, meaning that it shouldn't perform a DHCP request/etc
* ``:

One thing to note is that the above static configuration has no fallback, so if it fails it's just stuck.  You may want to consider using DHCP with no failure timeout, and setting static IP addresses as additional IPv4 address instead (this can be seen in the `dhcp` config we use by default, only it has a failure timeout)
```ini
[connection]
id=dhcp
uuid=0ed1913e-73c7-4c45-b6be-2b5af8a15c54
type=ethernet
autoconnect-priority=1
autoconnect-retries=2
interface-name=eth0
timestamp=1699379068

[ethernet]

[ipv4]
address1=192.168.201.6/24
dhcp-timeout=10
may-fail=false
method=auto

[ipv6]
addr-gen-mode=stable-privacy
method=auto
```
