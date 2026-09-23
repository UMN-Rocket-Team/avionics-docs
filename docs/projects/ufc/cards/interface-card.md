---
layout: default
title: Interface Card
parent: Cards
grand_parent: Universal Flight Computer
nav_order: 5
permalink: /docs/projects/ufc/cards/interface-card/
---

# Interface Card
{: .no_toc }

The UFC's connection to everything outside the stack. It gathers the other cards' data onto a micro SD card
and has CAN connectors for external systems like the Pitot probe and the BMS.
{: .fs-5 .fw-300 }

CARD_TYPE
: 2

MCU
: STM32H730VBT6: SPI2 for the SD card, GPIO for the switches and buzzer, CAN to the backplane

Storage
: 64 GB micro SD card, plus a W25N512GV flash chip

External connectors
: Molex CLIK-Mate headers carrying CAN, 3.3 V, 5 V, and GND
{: .facts }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Purpose

- **Mass storage.** It pulls each card's flash over CAN and writes it to the SD card, during or after the
  flight. Files are saved per card (see [Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}#after-the-flight)).
- **External systems.** Its CAN headers connect the UFC to boards that can't plug into the backplane because
  of where they sit in the rocket: the [Pitot Sensor Card]({{ '/docs/projects/pitot/sensor-card/' | relative_url }}),
  the [BMS]({{ '/docs/projects/bms/' | relative_url }}), and future systems like air brakes.
- **User controls.** Mode-select DIP switches and a buzzer.

The architecture also gives this card the job of running GNC algorithms on the collected data. The old wiki
doesn't say whether any have been implemented.

This card took over the storage role of UFC2's Host Card when the backplane switched from SPI to CAN
([Design History]({{ '/docs/projects/ufc/design-history/' | relative_url }}#2024-25-ufc3)).

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/22969/c50ad117-1435-4b29-8d09-80843e010366" caption="Interface Card diagram" %}

## Components

| Part | Part no. | Bus | Notes |
|:--|:--|:--|:--|
| Microcontroller | [STM32H730VBT6](https://www.digikey.com/en/products/detail/stmicroelectronics/STM32H730VBT6/13171210) | SPI, CAN | 100 pin, 550 MHz, 128 KB flash |
| Flash | [W25N512GV](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf) | QUADSPI (OCTOSPI in quad mode) | 64 MB NAND |
| SD card slot | [MEM2075-00-140-01-A](https://www.digikey.com/en/products/detail/gct/MEM2075-00-140-01-A/9859614) | SPI | Micro SD, with card-detect pin |
| DIP switch | [CHS-04TA](https://www.digikey.com/en/products/detail/nidec-components-corporation/CHS-04TA/948318) | GPIO | 4 positions, recessed |
| Buzzer | [PS1440P02BT](https://www.digikey.com/en/products/detail/tdk-corporation/PS1440P02BT/2236828) | GPIO/PWM | Piezo |
| CAN headers | Molex CLIK-Mate | CAN | CAN pair plus 3.3 V, 5 V, GND |
| LEDs | Red, green, blue, yellow (Würth 150060 series) | GPIO | |

### Flash

The same 512 Mbit chip as the other cards, wired the same way as on the Primary Card. On the STM32 it's on the
OCTOSPI peripheral running in quad mode. Right now it doesn't have a set job: this card has no sensors, and the
data cards log to their own flash. It's there so an external system without its own storage could log through
this card.

{: .check }
The April 2025 overnight flash test noted "Flash on interface card still does not work"
([Test Results]({{ '/docs/projects/ufc/testing/results/' | relative_url }}#overnight-flash-test-1)). Nothing
in the old wiki says whether that was fixed.

### SD card

Uses plain SPI, so it's slower than the flash. The slot takes any micro SD card, and its card-detect pin is
routed to a GPIO. Format the card as **exFAT** before flight.

### Mode-select switches

The DIP switches let you change flight modes by hand. Each switch is pulled to ground through a 10 kΩ
resistor, so every switch reads 0 by default.

{: .check }
The old wiki doesn't say what each switch position does on UFC 3.5. (UFC2's Host Card had MODE, READ, and
ERASE switches, described in the [legacy integration checklist]({{ '/docs/projects/ufc/legacy/integration/' | relative_url }}).
Don't assume UFC 3.5 works the same way.)

### Buzzer

A piezo buzzer that tells you the UFC is working after integration. It's driven by a PWM signal through a
common-emitter amplifier, which makes it much louder and takes less current from the STM32's GPIO pin.

### CAN headers

Molex CLIK-Mate headers, chosen because they've been reliable for us. They carry the CAN differential pair
(length-matched to avoid skew between the two lines) plus 3.3 V, 5 V, and ground, so a connected board like
the Pitot Sensor Card can be powered from the UFC.

## Schematic

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/1d1363e7-6891-4025-99b2-db5224cf99b7" caption="Interface Card schematic" %}

## PCB

| Layer | Pour | Routing | Image |
|:--|:--|:--|:--|
| Top | GND | Signals | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/fd8bba1b-42a8-48ac-9b78-cbd2b9da4e9d) |
| Mid 1 | GND | None | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/eb8d708f-8df9-4880-8091-2cd8dde73ab6) |
| Mid 2 | 3.3 V | None | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/01c5f990-8a6f-49c6-ae5e-8569f3140098) |
| Bottom | GND | Signals | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/50eb3ac8-f729-4c5b-a9d0-6ce6b1b5faa4) |

Renders: [3D view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/b5bb28c1-55d1-4598-9166-64708895f4d1) ·
[2D view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/2ba41bc3-10e6-4837-8bd9-a1832c1f50fd)
(image links need a UMN login)

## Firmware

The old wiki's firmware section for this card was empty. What we know from elsewhere:

- The SD card transfer is done with the `flash transfer {card_id}` terminal command (see [Terminal]({{ '/docs/projects/ufc/firmware/terminal/' | relative_url }}#commands)).
- The SD card driver uses FatFS. When the [STM32CubeIDE Setup]({{ '/docs/projects/ufc/firmware/ide-setup/' | relative_url }})
  guide was written, the SD card was on UFC2's Host Card, so that was the only project that needed the FatFS
  source folder. On UFC 3.5 it should be this card's project instead.
