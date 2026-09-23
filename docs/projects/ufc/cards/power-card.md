---
layout: default
title: Power Card
parent: Cards
grand_parent: Universal Flight Computer
nav_order: 2
permalink: /docs/projects/ufc/cards/power-card/
---

# Power Card
{: .no_toc }

Takes power from the battery and turns it into clean 3.3 V and 5.0 V rails for every other card. No
microcontroller, so no firmware.
{: .fs-5 .fw-300 }

CARD_TYPE
: 1 (reserved, even though the card has no MCU)

Input
: 3S3P battery pack through an XT60 connector

Outputs
: 3.3 V and 5.0 V, on separate backplane rails

Max load
: Designed for 3 A, a bit less in practice because of losses in the linear regulators

Design files
: [Altium 365](https://rocket-team.365.altium.com/designs/56FD3515-F816-4AB6-BEC2-D690538ECDD1#design)
{: .facts }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## How it works

Regulation happens in two stages on each rail:

1. **Coarse (switching):** a TPSM53603 DC-DC converter steps the battery down to about 1.2 V above the final
   output, so roughly 4.5 V for the 3.3 V rail and 6.2 V for the 5 V rail. It's up to 95% efficient, which
   keeps heat down.
2. **Fine (linear):** a fixed-output MIC29310 linear regulator takes it the rest of the way and cleans up the
   switching noise. Output is within 1% of 3.3 V or 5.0 V. After more decoupling caps and one more fuse, it
   goes out onto the backplane.

**Protection.** There's no active current sensing on this version because there wasn't room on the card.
Overcurrent protection comes from a diode, several stages of fast-blow fuses, and the overcurrent protection
built into the regulators. There's also **undervoltage lockout**: a voltage divider on each switcher's
enable (EN) pin shuts the outputs off if the battery drops below about **6.5 V**.

**Indicators.** Each switching regulator's PowerGood output drives an LED (green and blue), so you can see at a
glance that both rails are up.

{% include figure.html src="https://media.github.umn.edu/user/22102/files/437d49a4-9643-40c8-9722-8c28a50fdae5" caption="Power Card diagram" %}

## Components

| Part | Part no. | Notes |
|:--|:--|:--|
| Coarse regulator (×2) | [TPSM53603RDAR](https://www.digikey.com/en/products/detail/texas-instruments/TPSM53603RDAR/11502236) | Switching DC-DC, output programmable from 1 to 7 V, up to 3 A |
| Fine 3.3 V regulator | [MIC29310-3.3WU](https://www.digikey.com/en/products/detail/microchip-technology/mic29310-3-3wu/1029133) | Fixed 3.3 V linear, up to 3 A, <1% tolerance |
| Fine 5.0 V regulator | [MIC29310-5.0WU](https://www.digikey.com/en/products/detail/microchip-technology/mic29310-5-0wu/1029139) | Fixed 5.0 V linear, up to 3 A, <1% tolerance |
| LEDs | [150060VS75000](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060VS75000/4489906) (green), [150060BS75000](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060BS75000/4489895) (blue) | Driven by the regulators' PowerGood pins |

**TPSM53603 notes.** The output voltage is set by a divider on the feedback (FB) pin. A second divider on the
enable (EN) pin gives the undervoltage lockout described above.

## Connectors and switches

- **Battery:** XT60 connector for the 3S3P pack.
- **Screw terminals:** a pair of terminal blocks next to the battery input for the screw switch that turns the
  UFC on before flight. If you're not using a switch, short the two terminals together.
- **CAN termination DIP switch:** connects a 120 Ω resistor across the CAN lines on the backplane. The Power
  Card is the one card that's always in the stack and likely to sit at one end of the chain, so it has the
  switch. More on the [Backplane]({{ '/docs/projects/ufc/cards/backplane/' | relative_url }}#can) page.

## Schematic

Full detail is in [Altium 365](https://rocket-team.365.altium.com/designs/56FD3515-F816-4AB6-BEC2-D690538ECDD1#design).

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/28217/806c137e-2bff-47f5-9aed-2f530d2d6bf5" caption="Power Card schematic" %}

## PCB

The Power Card's stack is different from the other cards. High-current power is routed on the top layer,
control signals (like the LED lines) on the first inner layer, and **every layer has a GND pour**.

| Layer | Pour | Routing | Image |
|:--|:--|:--|:--|
| Top | GND | Main power routing | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/28217/a668c902-d9d4-403e-a6f5-2f35e2090c85) |
| Mid 1 | GND | Signals | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/28217/7ef34a95-20ff-4572-ab1d-fbd0a2619acf) |
| Mid 2 | GND | None | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/28217/6fc4d1c3-2a2d-4a95-9939-0e3347a87ede) |
| Bottom | GND | Some power routing | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/28217/c4cbb308-3fb2-4573-ba3d-d8910dcad7ab) |

Renders: [3D view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/28217/a3e94221-cd36-403c-8b16-d2955c0cd06f) ·
[2D view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/28217/8257b4c0-9168-4e8a-a4f4-56cfc161e32a)
(image links need a UMN login)

## Firmware

None, since there's no microcontroller. Adding one (with a current sensor) is on the
[future work list]({{ '/docs/projects/ufc/design-history/' | relative_url }}#future-work).
