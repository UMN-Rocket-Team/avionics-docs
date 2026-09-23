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
| Pressure sensors (×6) | [BPS130-HA100P-1SG](https://www.digikey.com/en/products/detail/bourns-inc/BPS130-HA100P-1SG/10130322) ([datasheet](https://www.bourns.com/docs/product-datasheets/bps130.pdf)) | Analog | Up to 100 psi (689.48 kPa). 5 V supply, 0.5–4.5 V output. |
| ADCs | [ADS1115IDGST](https://www.digikey.com/en/products/detail/texas-instruments/ADS1115IDGST/2123284) ([datasheet](https://www.ti.com/lit/ds/symlink/ads1115.pdf)) | I2C (I2C5) | 16-bit, 5 V operating range. Configured for ±6.144 V, ~110 samples/s measured. |
| Flash | Not listed in the old wiki | | Stores recorded data. Presumably the same W25N512GV as the UFC cards, since it uses the same UFC_Core flash driver. |

## Analog front end

The pressure sensors run on 5 V and put out **0.5–4.5 V** across their range, but the STM32's ADC inputs can only
take 3.3 V. So each sensor output goes through a **precision voltage divider with a 2/3 ratio** before the ADC, which
maps it to about 0.33–3.0 V. The resistors are **0.1% tolerance** to keep the divider from adding much uncertainty
to the measurement. The microcontroller reads the six sensors on ADC channels 1–6.

The expected peak on the center port is about 63–64 psi, so in flight the sensors only use about two thirds of their
range. Reviewers at the 2024–25 PDR suggested an instrumentation amplifier and an error budget
([Pitot design review feedback]({{ '/docs/projects/pitot/' | relative_url }}#design-review-feedback)).

{: .check }
> **Which ADC?** The sources split into two camps.
>
> **The STM32's built-in ADC, through the divider:**
> - the old card description (ADC channels 1–6);
> - the `Pitot Sensor Block Diagram` drawio (resistive divider network into the ADC, IMU on I2C);
> - the 2024–25 PDR answer (0.5–4.5 V "scaled down to 3.3 V" for a 16-bit ADC);
> - the 2025–26 PDR slide ("Onboard STM32 16 bit ADC", circuitry "identical to 2024").
>
> **External ADS1115s on I2C:**
> - the component table and the firmware test list;
> - the `UFC-2024 Pin Allocations` sheet, which gives the Pitot card an "I2C5 (ADC)" bus on PC11/PC10;
> - the firmware's sensor settings notes (around the end of 2024), which configure the ADS1115 for **±6.144 V** and
>   measured about **110 samples/s**. The datasheet allows 860 samples/s; the notes say the I2C bus is the limit.
>
> The design documents describe the internal ADC and the firmware documents describe the ADS1115, so the board may
> have both footprints, or the firmware may have moved to the ADS1115 after the design reviews were written. Check the
> schematic and `Firmware/Pitot_Card`. The April 2025 overnight test also found the firmware reading the wrong ADC
> channels ([Pitot Test Results]({{ '/docs/projects/pitot/test-results/' | relative_url }})).

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
