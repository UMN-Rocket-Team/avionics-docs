---
layout: default
title: Legacy (UFC2)
parent: Universal Flight Computer
grand_parent: Projects
nav_order: 8
has_children: true
has_toc: false
permalink: /docs/projects/ufc/legacy/
---

# Legacy (UFC2)
{: .no_toc }

Docs for the 2023–24 UFC2. It's been replaced, but a lot of test procedures and some of the code still refer
to it, so the old docs are kept here.
{: .fs-5 .fw-300 }

{: .warning }
Nothing in this section describes how UFC 3.5 works. Use it to understand old procedures, old flight data, and
code that might still be hanging around.

## What was different

| | UFC2 (2023–24) | UFC 3.5 (now) |
|:--|:--|:--|
| Backplane | SPI, with the Host Card as controller (the "COB SPI") | CAN, every card an equal node |
| Cards | Host, Sensor, Radio, and a Teensy-based Pitot card | Power, Primary, Secondary, Interface |
| Storage | One flash chip and one SD card, both on the Host Card | Flash on every data card, SD card on the Interface Card |
| Host / storage MCU | [STM32H735ZGT6](https://www.st.com/resource/en/datasheet/stm32h735zg.pdf) | STM32H730VBT6 |
| Getting data off | Put the Host Card in readout mode with its DIP switches, then read it out through a debug board and FTDI cable into WINGS | SD card, `flash transfer`, or `readAllFlash.py` ([Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}#after-the-flight)) |

[Design History]({{ '/docs/projects/ufc/design-history/' | relative_url }}#2024-25-ufc3) explains why things
changed.

## Pages

| Page | What's on it |
|:--|:--|
| [UFC2 Firmware Reference]({{ '/docs/projects/ufc/legacy/firmware-reference/' | relative_url }}) | The node-based firmware architecture: nodes, node managers, flight and readout modes, packet routing and cleaning |
| [UFC2 Integration Checklist]({{ '/docs/projects/ufc/legacy/integration/' | relative_url }}) | Pre-integration, integration, and post-flight readout steps for the Host/Sensor/Teensy UFC |

The ECODE section of the old firmware reference still applies, so it moved to
[Error Codes]({{ '/docs/projects/ufc/firmware/error-codes/' | relative_url }}).
