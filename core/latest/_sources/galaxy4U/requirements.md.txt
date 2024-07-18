# Hardware, Setup, and Site Requirements

Users will need to make the following provisions to support installing and running the Galaxy Wormhole 4U Server and Galaxy Wormhole Power Supply.

## Packaging and Weight

The Galaxy Wormhole 4U Server and accompanying Galaxy Wormhole Power Supply are heavy and highly integrated pieces of equipment.  **Two people are recommended, at minimum, for any manual installation.** 

The complete shipping package is designed to be lifted and moved using a standard pallet jack, skid steer, or pump truck. The Galaxy Wormhole 4U Server’s packaging and unboxing are optimized for the use of a Server Lift.

If for whatever reason a Server Lift cannot be employed in moving the Galaxy Wormhole 4U Server itself, robust lift handles are present on the front and back of the unit for secure lifting.

### Weight

Each **Galaxy Wormhole 4U Server** unit weighs **130 lbs. / 59 kg**.

The **Galaxy Wormhole Power Supply** weighs **70 lbs. / 32 kg**.

## Equipment

The following equipment is needed for installation:

- Server lift is **strongly** recommended for moving the Galaxy Wormhole 4U Server
- Pallet jack
- Torque wrench (capable of up to 6.2 Nm with T25 bit)
- Digital torque screwdriver (capable of up to 6 Nm)
- The following screwdriver bits:
  - T25 Torx
  - T30 Torx
  - M6
- Cage nut removal tool
- Cable ties or velcro for cable management

## Host PC

The Galaxy 4U Server requires a **Tenstorrent** **T7000** **4U Workstation** functioning as the host PC, with four (4) 100G DAC cables connecting the T7000 to the Galaxy Wormhole 4U Server.

The T7000 includes eight (8) Tenstorrent n150 AI Graph Processor add-in boards and these boards include the QSFP-DD ports required to connect to Galaxy Wormhole 4U Servers. Four (4) cards are required per Galaxy Wormhole 4U Server; a single T7000 can support up to two (2) Galaxy Wormhole 4U Servers.

## Rack Mounting

The rack length needs to be **19”** and the rack depth needs to be adjustable to **32"**.

For a single Galaxy Wormhole 4U Server, you will need **9U of contiguous rack space**, and the units will need to be arranged in this order:

<img src=".\images\stack_1galaxy.png" style="zoom:50%;" />

- Galaxy Wormhole 4U Server (4U)
- Galaxy Wormhole Power Supply (1U)
- T7000 4U Workstation (4U)

For dual Galaxy Wormhole 4U Servers, you will need **13U of contiguous rack space**, and the units will need to be arranged in this order:

<img src=".\images\stack_2galaxy.png" style="zoom:50%;" />

- Galaxy Wormhole 4U Server (4U)
- Galaxy Wormhole Power Supply (1U)
- Galaxy Wormhole 4U Server (4U)
- T7000 4U Workstation (4U)

## Power

### Site

The site must support **7.5kW per Galaxy Wormhole 4U Server** and **2kW for the T7000 4U Workstation** being used as the host PC.

### Power Distribution Units

Though the Galaxy Wormhole Power Supply shipped with the Galaxy Wormhole 4U Server(s) supports remote power control, there is no local control other than AC removal. A PDU is strongly recommended for deployment to enable power monitoring, power cycling, powering down for safe installation or repairs, and simplified cable management. Multiple PDUs may be required when installing multiple Galaxy Wormhole 4U Servers in a rack or if AC redundancy is required.

The Galaxy Wormhole 4U Server is paired with a Galaxy Wormhole Power Supply populated with six (6) Murata MWOCP68-3600-B-RM Power Supply Modules. 

For each Galaxy Wormhole Power Supply, your Power Distribution Unit will need:

- Support for 7.5kW (if using one Galaxy Wormhole 4U Server) or 15kW (if using two Galaxy Wormhole 4U Servers)
- Six (6) IEC C19 inputs
- Four (4) IEC C13 inputs (for T7000 host PC)

The T7000 host system has its own integrated 2+2 power supply; your PDU will need:

- Support for 2kW
- One (1) AC cable for 230V input, two (2) AC cables for 115V input

## Cooling and Elevation

The Galaxy Wormhole 4U Server is rated to operate under the following conditions:

- **Ambient Temperature:** 5°C – 25°C / 41°F – 77°F
- **Elevation:** -5 ft. – 10,000 ft. / 0 km – 3 km

## Cable Requirements 

### AC Power Cables

If replacing any AC power cables with locally sourced variants, ensure the ratings match the power cords provided by Tenstorrent.

### Networking

#### Inter-Galaxy Networking

Only **2 ft. / 0.6m QSFP-DD 400GbE** cables are supported for inter-Galaxy communication. Four (4) of these cables are included in the package.

#### Tenstorrent T7000 4U Workstation Host

The Tenstorrent T7000 4U Workstation used as a host includes an add-in card that provides two 200GbE QSFP-DD ports; cable type used is at the discretion of the network architect for the data center. Please refer to the web page of the card vendor for a list of supported cables and modules: http://www.mellanox.com/products/interconnect/cables-configurator.php.

#### RJ45 Management

CAT5 or better network cabling is required for the management interfaces on the Galaxy Wormhole 4U Server, Galaxy Wormhole Power Supply, and Tenstorrent T7000 4U Workstation. These interfaces run at a maximum of 1Gbps and can run over 100m using standard CAT5. The number and length of cables will vary depending on customer configuration.

The customer should plan for at least two (2) connections per Galaxy Wormhole 4U Server: one for the Galaxy Wormhole 4U Server itself and one for the Galaxy Wormhole Power Supply. In configurations with multiple Galaxy Wormhole 4U Servers, one cable is required per Galaxy Wormhole Power Supply, but each Galaxy Wormhole Power Supply can service two Galaxy Wormhole 4U Servers.

#### Customer Supplied Cables

The customer is responsible for the provision of all standard networking cables and network switches as these are highly installation dependent.

## Safety

External bus bars are used to connect and power the Galaxy Wormhole 4U Server(s). Care must be taken to ensure these bars are not powered during installation or service, and the included bus bar covers must be used while the Galaxy Wormhole 4U Server(s) and Galaxy Wormhole Power Supply are in operation.