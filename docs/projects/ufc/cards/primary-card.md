---
layout: default
title: Primary Card
parent: Cards
grand_parent: Universal Flight Computer
nav_order: 3
permalink: /docs/projects/ufc/cards/primary-card/
---

# Primary Card
{: .no_toc }

The main sensor and telemetry card: a 9-axis IMU, a barometer/thermometer, the UFC's only GPS, and the
primary radio. It logs everything to its own flash and sends live telemetry to the ground.
{: .fs-5 .fw-300 }

CARD_TYPE
: 4 (also the default CARD_ID)

MCU
: STM32H730VBT6, talking to its parts over UART7 and I2C3, and to the backplane over CAN

Flash
: W25N512GV, 64 MB NAND over QUADSPI

Radio
: See the box below

Firmware
: [`Firmware/Primary_Card`](https://github.umn.edu/Rocket-Team/UFC-2024/tree/main/Firmware/Primary_Card)
{: .facts }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Purpose

The Primary Card collects and stores sensor data, sends telemetry to the ground station, and does light
processing like converting raw readings into real units. All data is saved to the on-board flash as well as
being sent over the radio. Recording to flash starts when the card's state detection sees a launch (see
[Flash Driver]({{ '/docs/projects/ufc/firmware/flash-driver/' | relative_url }})).

Sensors:

- **IMU (BNO055)**: 3-axis gyroscope, 3-axis accelerometer, and a 3-axis magnetometer for absolute orientation
- **Barometer/thermometer (BMP390)**
- **GPS (MAX-M10S)**: low power, used for recovery

{: .check }
> The old wiki disagrees on which radio this card carries. The Primary Card spec lists an
> **E22-400T22S LoRa** (433 MHz) as the primary radio. But the firmware architecture page, the firmware test
> list, the April 2025 overnight test, and the flight operations guide all use an **RFD900** (902–928 MHz) on
> this card, and the E22's own paragraph talks about a fuse added because of "issues with the RFD last year".
>
> Check the current schematic before relying on either. Both are listed below.

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/22969/029bdf46-1aab-40f9-b5d1-d48c4171fadb" caption="Primary Card diagram" %}

## Components

| Part | Part no. | Bus | Notes |
|:--|:--|:--|:--|
| Microcontroller | [STM32H730VBT6](https://www.digikey.com/en/products/detail/stmicroelectronics/STM32H730VBT6/13171210) | UART, I2C, CAN | 100 pin, 550 MHz, 128 KB flash |
| Flash | [W25N512GV](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf) | QUADSPI | 64 MB NAND |
| 9-axis IMU | [BNO055](https://cdn-shop.adafruit.com/datasheets/BST_BNO055_DS000_12.pdf) | I2C | Fused orientation output (quaternion) |
| Barometer/thermometer | [BMP390](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmp390-ds002.pdf) | I2C | 30–125 kPa, −40–85 °C, up to 200 Hz |
| GPS | [MAX-M10S-00B](https://www.digikey.com/en/products/detail/u-blox/MAX-M10S-00B/15712906) | I2C | Up to 20 Hz updates |
| Radio (per card spec) | [E22-400T22S](https://use.365.altium.com/librarycomponentsapi/api/v1/References/1A5364BB-2399-40E0-B04A-82A08AA792DD) | UART, RTS/CTS | LoRa, 410–493 MHz (default 433.125 MHz), 22 dBm max, ~5 km |
| Radio (per firmware docs) | [RFD900UX2](https://files.rfdesign.com.au/Files/documents/RFD900ux%20DataSheet%20v1.2.pdf) | UART | 902–928 MHz FHSS |
| LEDs | [Red](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060RS75000/4489901), [green](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060VS75000/4489906), [blue](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060BS75000/4489895), yellow (150060YS75000) | GPIO | Würth 150060 series |

Specs, datasheets, and general notes for the shared parts (MCU, flash, BNO055, BMP390, GPS, radios) are on
the [Parts Reference]({{ '/docs/projects/parts-reference/' | relative_url }}).

## Wiring notes

| Part | Bus details | Interrupts | Other |
|:--|:--|:--|:--|
| BNO055 | I2C, address **0x28** (COM3 low) | INT1 | |
| BMP390 | I2C, address **0x76** (SDO low) | INT | CSB tied to power to select I2C, SDO grounded |
| MAX-M10S | I2C at 400 kHz, timing register value `0x00B03BCD` | GPS_INT | TVS diode for ESD and an RLC filter on the RF input |
| Radio | UART with RTS/CTS | | 1100 mA resettable fuse and a 0 Ω jumper on its 5 V input (below) |
| Flash | QUADSPI | | Same flash circuit as every other UFC card |

**Why the radio fuse.** An RFD damaged an STM32 the year before this card was designed, so its 5 V input now
goes through a 1100 mA resettable fuse (with a 0 Ω jumper). The RFD peaks at about 1 A, so 1100 mA leaves some
headroom before it trips by accident.

## Schematic

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/13d98a14-0b2e-451a-9d61-111a128b8852" caption="Primary Card schematic" %}

## PCB

| Layer | Pour | Routing | Image |
|:--|:--|:--|:--|
| Top | GND | Signals | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/de783217-8c1c-4cdd-ae2d-811584a523ee) |
| Mid 1 | GND | None | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/273ef8d2-03f1-4232-a7a9-d73d11cc5acf) |
| Mid 2 | 3.3 V | Minimal | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/7c68ff19-0356-471d-b69e-21dd262cf66f) |
| Bottom | GND | Signals | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/7e6c38ee-a170-471e-ab79-af9cbdc3d9b0) |

Renders: [3D view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/cb3f3594-fbdb-485d-a6cd-e56a284e67ff) ·
[2D view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/23053/d7a3ba9c-d74c-4365-b252-491b4e48ca39)
(image links need a UMN login)

## Firmware

Card-specific drivers, on top of the shared [UFC_Core]({{ '/docs/projects/ufc/firmware/' | relative_url }}) library:

- [`BNO055_Driver.h`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Firmware/Primary_Card/Primary_Card/BNO055_Driver.h): 9-axis IMU
- [`BMP390_Driver.h`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Firmware/Primary_Card/Primary_Card/BMP390_Driver.h): barometer/thermometer
- [`GPS_Driver.h`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Firmware/Primary_Card/Primary_Card/GPS_Driver.h): MAX-M10S GPS
- [`RFD_Driver.h`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Firmware/Primary_Card/Primary_Card/RFD_Driver.h): RFD900UX2 radio
