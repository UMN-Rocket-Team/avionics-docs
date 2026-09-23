---
layout: default
title: Pitot Sensor Card
parent: Pitot Tube System
nav_order: 1
permalink: /docs/projects/pitot/sensor-card/
---

# Pitot Sensor Card
{: .no_toc }

Reads the six analog pressure sensors behind the pitot probe and logs them to flash. Built like a UFC data card:
same microcontroller, flash, status LEDs, and programmer and debug pins.
{: .fs-5 .fw-300 }

CARD_TYPE
: 16

MCU
: STM32H730VBT6: ADC for the pressure sensors, I2C3 for the IMU, CAN to the UFC

Power
: Header pins from the [Pitot Power Card]({{ '/docs/projects/pitot/power-card/' | relative_url }}), or the UFC's Interface Card through a Molex CLIK-Mate cable

Design files
: [Altium 365](https://rocket-team.365.altium.com/designs/15B57D25-D263-41EE-B587-C1C7CC8AD29D)

Firmware
: [`Firmware/Pitot_Card`](https://github.umn.edu/Rocket-Team/UFC-2024/tree/main/Firmware/Pitot_Card)
{: .facts }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/22969/f429c83e-04b3-448f-aea7-338d1077cf9d" caption="Pitot Sensor Card diagram" %}

## Components

| Part | Part no. | Bus | Notes |
|:--|:--|:--|:--|
| Microcontroller | [STM32H730VBT6](https://www.digikey.com/en/products/detail/stmicroelectronics/STM32H730VBT6/13171210) | I2C, CAN | 550 MHz |
| 9-axis IMU | [BNO055](https://cdn-shop.adafruit.com/datasheets/BST_BNO055_DS000_12.pdf) | I2C | Wired the same as on the Primary Card, address 0x28 |
| Pressure sensors (×6) | [BPS130-HA100P-1SG](https://www.digikey.com/en/products/detail/bourns-inc/BPS130-HA100P-1SG/10130322) ([datasheet](https://www.bourns.com/docs/product-datasheets/bps130.pdf)) | Analog | Up to 100 psi (689.48 kPa), 5 V output |
| ADCs | [ADS1115IDGST](https://www.digikey.com/en/products/detail/texas-instruments/ADS1115IDGST/2123284) | I2C | 16-bit, 5 V operating range |
| Flash | Not listed in the old wiki | | Stores recorded data. Presumably the same W25N512GV as the UFC cards, since it uses the same UFC_Core flash driver. |

## Analog front end

The pressure sensors put out up to 5 V, but the STM32's ADC inputs can only take 3.3 V. So each sensor output goes
through a **precision voltage divider with a 2/3 ratio** before the ADC. The resistors are **0.1% tolerance** to keep
the divider from adding much uncertainty to the measurement. The microcontroller reads the six sensors on ADC
channels 1–6.

{: .check }
> Which ADC is used isn't clear:
>
> - The card description says conversions happen in the **STM32's built-in ADC**, on channels 1–6.
> - The component table lists **ADS1115** external 16-bit ADCs on I2C, and the firmware test list has unit tests
>   for the ADS1115s.
>
> Also, 5 V × 2/3 = 3.33 V, a hair over a 3.3 V ADC reference. Pressure sensors like this usually top out below
> their supply voltage, but check the BPS130's output range in its datasheet. The April 2025 overnight test also
> found the firmware reading the wrong ADC channels
> ([Pitot Test Results]({{ '/docs/projects/pitot/test-results/' | relative_url }})).

## IMU

The BNO055 is wired the same way as on the UFC Primary Card, set up for I2C at address **0x28**, on I2C3. The
Pitot card uses it to detect launch. In the April 2025 overnight test the BNO appeared to "calibrate" itself when
the probe was moved around, which is worth knowing before flight
([details]({{ '/docs/projects/pitot/test-results/' | relative_url }}#overnight-flash-test)).

## Schematic

Full detail is in [Altium 365](https://rocket-team.365.altium.com/designs/15B57D25-D263-41EE-B587-C1C7CC8AD29D).

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/3036bb8e-6da4-4e84-9bd3-60d14b02af7f" caption="Pitot Sensor Card schematic" %}

## PCB

| Layer | Image |
|:--|:--|
| Top | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/29656a9f-88cf-402b-9893-ec59c91df0e8) |
| GND | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/a54ae2be-7b68-4266-aaaf-d07ed05694d8) |
| 3.3 V | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/a1e8324a-3448-441c-a332-e9c460757cd6) |
| Bottom | [view ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/6d7c9bf8-deea-4f8c-9417-28d7ec9808d9) |

Renders: [3D view 1 ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/e32b51ae-185a-461f-a856-3482d866441d) ·
[3D view 2 ↗](https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/07ccf4b0-5b3c-42b6-b7ec-8cb1a97cf5f5)
(image links need a UMN login)

## Firmware

The Pitot firmware is in [`Firmware/Pitot_Card`](https://github.umn.edu/Rocket-Team/UFC-2024/tree/main/Firmware/Pitot_Card)
and uses the shared [UFC_Core]({{ '/docs/projects/ufc/firmware/' | relative_url }}) library. It produces the
`BNO_PKT`, `ALT_PKT`, `PITOT_CENTER_PKT` (24 bytes), and `PITOT_RADIAL_PKT` (32 bytes)
[packets]({{ '/docs/projects/ufc/firmware/packets/' | relative_url }}).
