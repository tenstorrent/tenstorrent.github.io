---
myst:
  html_meta:
    product-name: Tenstorrent Galaxy Server, Wormhole Networked AI Processor
    technology-concepts: Installation, Power Supply, Topology, Networking
    document-type: Reference, Prerequisites
---

# Installation, Power, and Environmental Requirements

This reference documentation provides professional installers and IT administrators with the critical physical, power, environmental, and networking specifications required to successfully prepare for and deploy the Tenstorrent Galaxy™ Server.

## Physical Specifications and Packaging

### Packaging and Dimensions

The Tenstorrent Galaxy™ Server ships with the following dimensions and weight:

| Specification | Value |
| :--- | :--- |
| **Total Server Weight** | 119 kg (262 lbs) |
| **Chassis Dimensions (H x W x D)** | 447 mm x 266.7 mm x 884 mm |

The package contains the following items:

*   1x Server unit (TG-00002)
    *   4x Power supply cords (3m IEC320-C20 3P 250V UL)
*   1x Static Rail kit
    *   4x **M5x10 screws**
*   Tenstorrent Ethernet cables (TX-02001 rev 1 or rev 2)
*   User-specified power cables (determined at the time of purchase)

:::{important}
The Server contains a self-contained Class 1 Laser within the optical transceiver module. If replacement is necessary, use only a certified optical fiber transceiver Class 1 Laser product.
:::

:::{warning}
Use only Tenstorrent-recommended cables with this Server. Replacement cables must match the type and wire gauge of the original cables shipped with the Server. Use of unapproved or alternative cables may result in equipment damage, dangerous operating conditions, or non-compliant operation.
:::

### Installation Requirements

Installation must be performed by a trained, qualified professional within a restricted access area. The professional installer assumes full responsibility for complying with all local regulatory and safety requirements during deployment.

**Required Installation Equipment**

Ensure you have the following equipment available before beginning installation:

*   Standard pallet jack, skid steer, or pump truck
*   Server Lift (mandatory)
*   **Phillips head screwdriver**

Because the Server weighs 119 kg (262 lbs), use of a Server Lift is mandatory. Tenstorrent strongly recommends that installation procedures involve a minimum of two personnel to prevent personal injury and damage to the Server.

### Rack Specifications

The Tenstorrent Galaxy Server, utilizing the Wormhole™ Networked AI Processor, must be installed in an EIA-compliant 19" (482.6 mm) rack. If alternative racking solutions are required, contact your Tenstorrent representative prior to installation.

## Power and Environmental Requirements

### Power Requirements

The Server's internal AC/DC power supply is comprised of four 4000-watt, 80 Plus Titanium, hot-plug Power Supply Units (PSUs) operating in a 3+1 redundant configuration.

| Power Specification | Value |
| :--- | :--- |
| **Peak Power Consumption** | 12 kW |
| **PSU Redundancy** | 3+1 |
| **Power Cord Length** | 3 meters |

**Output Specifications per PSU**

*   **Main Output (V1):** 54 Vdc, regulated, >70 A
*   **Auxiliary Standby Output (Vsb):** 12 Vdc, 3 A

PSU cables must connect to grounded socket-outlets.

### Environmental Requirements

The following conditions are necessary for ideal Server operation:

| Environmental Specification | Operating Condition | Storage Condition |
| :--- | :--- | :--- |
| **Temperature (dry-bulb)** | 5°C to 35°C (41°F to 95°F) | -40°C to 70°C (-40°F to 158°F) |
| **Relative Humidity** | 20% to 85% | 10% to 95% |

**Thermal and Airflow Metrics**

Performance metrics are based on a typical strenuous workload at 35°C ambient temperature:

| Metric | Value |
| :--- | :--- |
| **Maximum Heat Output** | 34,633 BTU/hr |
| **Airflow Requirement** | 1229 CFM @ 80% fan PWM |

## Connectivity

### Network Topology

The Server supports both grid and torus network topologies for inter-chip communication:

*   ***Torus Topology***: This configuration uses internal and external cables to connect individual processing chips. Torusing is recommended for high-performance operations as it decreases latency by reducing the hop count between *Tensix cores*.

*   ***Grid Topology***: The default, cable-free configuration.

Both grid and torus topologies support expansion across multiple systems using specialized cabling techniques. Contact your Tenstorrent representative to discuss the optimal topology for your specific workload requirements.

### Ethernet Cabling and Limitations

The Server ships with a recommended cabling configuration, but users may customize the configuration as needed.

**Supported Maximum Cable Lengths**

| Cable Type | Maximum Length |
| :--- | :--- |
| **Direct Attach Copper (DAC)** | 2.5 meters |
| **Active Optical Cable (AOC)** | 30 meters |

For installations involving multiple Tenstorrent Galaxy Servers, Tenstorrent can provide multi-system cabling diagrams and examples. Contact your Tenstorrent representative for assistance with complex deployment planning.
