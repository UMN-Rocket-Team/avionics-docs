---
layout: default
title: Cards
parent: Universal Flight Computer
grand_parent: Projects
nav_order: 2
has_children: true
has_toc: false
permalink: /docs/projects/ufc/cards/
---

# Cards
{: .no_toc }

Every UFC card is built from the same template. This page covers what they all share, and each card's
page covers what's different about it.
{: .fs-5 .fw-300 }

| Page | CARD_TYPE | What it does |
|:--|:--|:--|
| [Backplane]({{ '/docs/projects/ufc/cards/backplane/' | relative_url }}) | — | Routes power and CAN between the four card slots |
| [Power Card]({{ '/docs/projects/ufc/cards/power-card/' | relative_url }}) | 1 | Battery in, clean 3.3 V and 5 V out. No microcontroller. |
| [Primary Card]({{ '/docs/projects/ufc/cards/primary-card/' | relative_url }}) | 4 | IMU, barometer/thermometer, GPS, primary radio |
| [Secondary Card]({{ '/docs/projects/ufc/cards/secondary-card/' | relative_url }}) | 8 | Backup gyro, accelerometers, magnetometer, barometer, LoRa radio |
| [Interface Card]({{ '/docs/projects/ufc/cards/interface-card/' | relative_url }}) | 2 | SD card storage, CAN connectors for external systems, mode switches, buzzer |

CARD_TYPE is the number each card uses to identify itself on the CAN bus. The full table, including the
Pitot card, is on the [CAN Protocol]({{ '/docs/projects/ufc/firmware/can-protocol/' | relative_url }}#card_type-values) page.

Each card page is laid out the same way: purpose, components, wiring notes, schematic, PCB layers, and
firmware.

## Card template

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/22969/fbc128fd-17e3-4630-93e8-7c0e24885517" caption="UFC card template, showing the PCIe edge connector, mounting tabs, programmer pads, and debug pads" %}

Size
: 2.50 in wide × 2.55 in tall, including the PCIe edge connector

Diagonal
: 3.57 in, so a card fits inside a 4 in body tube

Mounting
: Two tabs on the edge opposite the PCIe connector, bolted to the structure with L-brackets

Layers
: 4: top signal, GND, power, bottom signal. Both signal layers have a ground pour.

Parts placement
: Top side only. Putting parts on the bottom makes PCB assembly a lot more expensive, so the bottom is left empty or gets a few large through-hole parts.
{: .facts }

The layer stack varies a bit from card to card (the Power Card is the most different), so check the table
on each card's page.

## Microcontroller

Every card except the Power Card uses an **STM32H730VBT6**: 100 pins, 550 MHz, 128 KB of flash, 6 SPI /
5 I2C / 5 UART. The datasheet, reference manual, errata, and HAL docs are all linked from the
[Parts Reference]({{ '/docs/projects/parts-reference/' | relative_url }}#stm32h730vbt6).

The [pin allocation spreadsheet](https://docs.google.com/spreadsheets/d/1c7ZB62Nly-gnfADdhTH96M57njbn2Hou3k6CWnDpNqs/edit?usp=sharing)
is the source of truth for pin assignments on every card. If a schematic or a page here disagrees with it,
trust the spreadsheet (and fix the other thing).

## Programming and debugging

**Programmer.** Cards are programmed through the programmer pads (top right of the template diagram) with
an [STLINK-V3MINIE](https://estore.st.com/en/stlink-v3minie-cpn.html), which connects through a 10-pin
[board-to-board connector](https://www.digikey.com/en/products/detail/kyocera-avx/009159010061916/4009962).
The programmer also carries a UART, which is how you reach the card's
[terminal]({{ '/docs/projects/ufc/firmware/terminal/' | relative_url }}).

**Debug pads.** The lines between the microcontroller and the card's main parts (sensors, radios) are
brought out to debug pads, using the same 10-pin connector. The **Debugger board** plugs into these and breaks
each line out to header pins, so you can clip on the Saleae logic analyzer and watch the traffic.

## LEDs

Every card with a microcontroller has four LEDs on GPIO pins (red, green, blue, and yellow) for status and
debugging. The Power Card only has green and blue, driven by its regulators' PowerGood outputs.
