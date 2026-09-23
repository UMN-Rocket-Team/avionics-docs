---
layout: default
title: Pitot Power Card
parent: Pitot Tube System
nav_order: 2
permalink: /docs/projects/pitot/power-card/
---

# Pitot Power Card
{: .no_toc }

A slimmed-down version of the UFC [Power Card]({{ '/docs/projects/ufc/cards/power-card/' | relative_url }}) that
lets the Pitot system run without the UFC. Its 5 V rail is linear-only, to keep switching noise away from the
analog pressure sensors. No microcontroller, so no firmware.
{: .fs-5 .fw-300 }

Input
: 2S2P pack of 18650 cells

Outputs
: 3.3 V and 5.0 V to the Pitot Sensor Card, through header pins

Max load
: Parts rated for 3 A. The sensor card should only draw a fraction of that.

Design files
: [Altium 365](https://rocket-team.365.altium.com/designs/5FBC1828-4A1E-4CE2-8279-A0DCFE4D6DDE#design)
{: .facts }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/2b38087c-fcb9-4cf6-9381-b642ca16a73a" caption="Pitot Power Card diagram" %}

## How it works

**3.3 V rail: switching, then linear.** Same idea as the UFC Power Card. A TPSM53603 switching converter steps the
battery down to about 4.5 V (about 1.2 V above the output) at up to 95% efficiency, which cuts heat. A linear
regulator then takes it down to 3.3 V and cleans up the switching noise.

**5 V rail: linear only.** The analog pressure sensors run off the 5 V rail and are sensitive to noise, so this rail
skips the switching stage entirely. That keeps the switcher's oscillations out of the pressure data, at the cost of a
little efficiency.

**Low-noise regulators.** Because it needs a quiet supply, the linear regulators were changed from the UFC Power
Card's parts to ones with higher power supply ripple rejection (PSRR) and lower output ripple.

**Protection.** Like the UFC Power Card: no active current sensing. Overcurrent protection is a diode, several stages
of fast-blow fuses, and the regulators' built-in protection.

## Components

| Part | Part no. | Notes |
|:--|:--|:--|
| Coarse regulator (3.3 V rail) | [TPSM53603RDAR](https://www.digikey.com/en/products/detail/texas-instruments/TPSM53603RDAR/11502236) | Switching, output programmable 1–7 V, up to 3 A |
| Fine 3.3 V regulator | LM350T/NOPB (see below) | Adjustable linear, high PSRR, low ripple |
| 5.0 V regulator | [LM350T/NOPB](https://www.digikey.com/en/products/detail/texas-instruments/LM350T-NOPB/8901) | Adjustable linear, high PSRR, low ripple |
| LEDs | [150060VS75000](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060VS75000/4489906) (green), [150060BS75000](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060BS75000/4489895) (blue) | |

{: .check }
The old table lists the fine 3.3 V regulator as an LM350T, but its link pointed to the MIC29310-3.3 used on the UFC
Power Card. The text says the linear regulators were changed for lower-noise parts, which suggests LM350T is right,
but check the schematic.

## Connectors

- **To the sensor card:** header pins carrying 3.3 V and 5 V.
- **To the UFC:** an extra connector for when the Pitot system doesn't need to run on its own. It routes power and
  CAN from the UFC through to the Pitot Sensor Card.
- **Arming switch:** a pair of screw terminals next to the battery input for a magnetic arming switch (we use a
  [Featherweight magnetic switch](https://www.featherweightaltimeters.com/store/p4/Magnetic_Switch.html)). If you're
  not using one, short the two terminals together.

## Schematic

Full detail is in [Altium 365](https://rocket-team.365.altium.com/designs/5FBC1828-4A1E-4CE2-8279-A0DCFE4D6DDE#design).

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/fc560775-4232-4295-914e-df1076b830d7" caption="Pitot Power Card schematic" %}

## PCB

| Layer | Image |
|:--|:--|
| Top | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/32ab1146-eb49-4f11-beb6-7fb2a86e7673) |
| GND | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/ff396e93-9ea7-403e-8137-c82f6a58833b) |
| 3.3 V | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/80a0d6c4-30ac-4b52-8c38-73b95c7f5198) |
| Bottom | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/ac8aee6a-c909-4e5e-8ed3-c2e5709cd9cd) |

Renders: [3D view 1 ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/4bac368c-51dc-4b4f-ac36-eca29cb4bccb) ·
[3D view 2 ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/04252330-6b78-4fe9-9bd3-6475c2250acd)
(image links need a UMN login)
