---
layout: default
title: Payload Control Board
parent: Projects
nav_order: 5
permalink: /docs/projects/payload-board/
---

# IREC 2026 Payload Control Board
{: .no_toc }

Runs the IREC 2026 payload: a motor-driven compressor that squeezes simulated Mars regolith into a solid puck after
landing. It also logs IMU and barometer data for post-flight analysis.
{: .fs-5 .fw-300 }

Built for
: IREC 2026

MCU
: STM32H730VBT6

Actuator
: A motor and lead screw, through a PPM-controlled ESC (2025–26 PDR)

Code
: Not recorded (see below)

Status
: Built for IREC 2026, with every requirement marked Met. A **new** payload board is being designed for 2026–27 (fall 2026 kickoff slides).
{: .facts }

{% include figure.html src="https://github.umn.edu/user-attachments/assets/b5993850-a64c-4330-97d1-27a096fa5c22" caption="IREC 2026 Payload Control Board" %}

{: .check }
> This page was the least finished one in the old wiki. It looks like it was started from a copy of the GYRO page,
> and several parts were never updated:
>
> - The **power electronics** table was all placeholders ("X").
> - The **current sensor** and **optical limit switches** mentioned in the purpose have no part numbers. (The PDR
>   board overview confirms there's a motor current meter and limit switch connections.)
> - The component table listed GYRO's **REEFS207 servo** as the actuator. The PDR says the payload uses a motor
>   through a PPM-controlled ESC. The servo row is kept below as the test stand-in.
> - There was a leftover **radio** row with no part number that matches GYRO's RFD900 entry. The purpose doesn't
>   mention a radio, and neither does the PDR.
> - The **firmware** links pointed at GYRO's firmware docs and the Midwest repo.
> - See also the flash chip note below.
>
> Fill these in from the schematic when you can.

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Purpose

The payload mission, from the 2025–26 PDR: a lightweight compressor that uses a lead screw and motor to turn powdered
Martian regolith simulant into a solid puck, to look at whether in-situ resource utilization (ISRU) on Mars is
feasible.

The board's main job is driving that compressor, on a 1 in³ sample, after the rocket lands. It has to work out when the
rocket has landed by itself, because the payload bay can't be connected to the UFC, so it can't use the UFC's state
detection. Along the way it:

- reads a BNO055 IMU (3-axis gyroscope, 3-axis accelerometer, and 3-axis magnetometer for absolute orientation) and a
  BMP390 barometer/thermometer,
- saves the data to on-board flash, and writes it to an SD card for post-flight analysis,
- drives the motor's ESC with a PPM signal and measures the motor's current,
- uses **optical limit switches** to stop the crushing mechanism going past its physical travel limits. They also
  back up the current sensor.

The PDR's board overview labels an STM32H7, SD card, flash, BNO055, BMP390, the motor current meter, the battery
connection, optical limit switch connections, screw switch terminals, and the ESC's PPM output.

{% include figure.html src="https://github.umn.edu/user-attachments/assets/c4e639fe-d2cf-4eda-a5c1-38d301de273f" caption="Payload Control Board diagram" %}

### State detection

The board has to run the compressor in the LANDED state and at no other time. The PDR describes it as combining the
barometer's rate of change (BMP390 at 200 Hz) with the IMU's acceleration (BNO055 at 125 Hz), so that one sensor
alone can't cause a false trigger. How it steps through the flight states isn't written down. Presumably it's based on
the UFC's ([UFC state detection]({{ '/docs/projects/ufc/firmware/' | relative_url }}#state-detection)), since the
verification plans below step through the same states.

Two things came up at the PDR that matter more for the payload than for the UFC:

- **Ejection charges.** The payload sits right next to them, so pressure spikes from the charges need filtering out.
- **Reaching LANDED another way.** If the state detection can only reach LANDED through the nominal sequence, a missed
  state means the payload never runs. If a backup route (like a timer) is added, the recovery team needs to know the
  payload might start moving when they pick up the rocket, so put it in the recovery CONOPS.
## Requirements

From the team's requirements sheet (`UMNRKT Requirements.xlsx`, "Payload System" tab), where every requirement is
marked **Met**. They were already marked Met at the December 2025 PDR, where two of them were different: the sample
size was "TBD in³", and PAYLD-1 was 125 °F ("IREC nosecones reach upwards of 125°F in the Texas summer heat"). It
was raised to 145 °F after the review, as with the other avionics boards. The full table with parent requirements is also in the
[IREC 2026 requirements spreadsheet](https://docs.google.com/spreadsheets/d/1ZM7sDWcCKupetqs2eV_MjmVUnbQAa9NKSMUKOIiYPZk/edit?gid=2020042343#gid=2020042343).

| ID | Requirement | Why | Verified by |
|:--|:--|:--|:--|
| PAYLD | Compact a 1 in³ sample of Mars regolith when the rocket lands | Can't connect the UFC to the payload bay, so the payload needs its own state detection | Demonstration |
| PAYLD-1 | Operate in a **145 °F** ambient temperature | MIL-STD-810H Table 501.7-I, "Induced Basic Hot A2" (85–145 °F) | Test |
| PAYLD-2 | Determine the current state of flight | Needed to start compacting on landing | Demonstration |
| PAYLD-2.1 | Determine the rocket's altitude | Sensor data needed for state detection | Inspection |
| PAYLD-2.2 | Determine roll rate and acceleration | Sensor data needed for state detection | Demonstration |
| PAYLD-3 | Compact the regolith on landing | The motor does the compacting; the safety measures stop it over-exerting and breaking | Demonstration |
| PAYLD-3.1 | Output a PPM signal that can drive an RC servo or motor controller | Lets the STM32 control the motor | Inspection |
| PAYLD-3.2 | Detect the ends of travel of the compressor | Stops the mechanism going past its physical limits, and backs up the current sensor | Demonstration |
| PAYLD-3.3 | Measure motor current to **5 mA** resolution | A rise in current means the sample is fully compacted, so the motor can stop before it over-exerts | Analysis |
| PAYLD-4 | Power everything for the whole mission | CDH needs power to track the flight state | Demonstration |
| PAYLD-4.1 | Power the CDH system for up to **4 hours** | Headroom for time on the pad | Demonstration |
| PAYLD-4.1.1 | Store at least **5 Wh** | 4 hours on the pad at 1.25 W, plus the motor at 1.5 W for 3 minutes | Analysis |

The rationale works out to 4 h × 1.25 W = 5.0 Wh on the pad plus 1.5 W × 0.05 h ≈ 0.08 Wh for the motor, about
5.1 Wh in total. That's slightly more than the 5 Wh the requirement asks for, so size the battery with margin
above both.

{% include figure.html src="https://github.umn.edu/user-attachments/assets/115daaa2-28f0-4c56-95a4-587f3c1224e0" caption="Payload system requirements table (image from the old wiki)" %}

### Verification plans

The preliminary verification plans from the 2026 verification matrix ("Payload" tab):

- **State detection (PAYLD-2):** simulate launch conditions. For the barometric check, lower the barometric velocity
  threshold below the maximum evacuation rate of the propellant-casting vacuum chamber, set the acceleration thresholds
  to zero, and pump the chamber down. For the accelerometer check, set the barometric velocity thresholds to zero, the
  median acceleration threshold time to 0.1 s, and the acceleration threshold to 2 g, then shake the board hard by hand.
- **Altitude (PAYLD-2.1):** take three pressure readings over PuTTY on the third floor of Akerman Hall and three in the
  basement. The basement readings should be between 98,286.82 and 98,429.80 Pa, and the difference between the two
  floors' averages should be within 5% of 50 Pa.
- **Roll rate and acceleration (PAYLD-2.2):** watch Accel X/Y/Z and Euler X/Y/Z in the terminal while moving the board
  by hand along and around each axis.
- **Compaction (PAYLD-3):** step the payload through its state detector from the terminal. On reaching "landed" it
  should start compacting, and stop when the limit switches trip or the actuator overcurrents.
- **Servo output (PAYLD-3.1):** with the Midwest servo on the PPM pins, run a test program sweeping the pulse from 1 ms
  to 2 ms and check the servo goes from 0° to 180°.
- **End of travel (PAYLD-3.2):** drive the armature to each end of travel and check the MCU reads the limits.
- **Current resolution (PAYLD-3.3):** check the current-sensing IC's configuration and work out its smallest step.
- **Mission power (PAYLD-4):** power on and enter the flight states from the terminal on the mission timeline (pad at
  T = 03:30:00, powered ascent 03:30:00, unpowered ascent 03:30:08, apogee/drogue 03:30:42, main 03:36:56, landed
  03:38:00).
- **Battery capacity (PAYLD-4.1.1):** the same discharge test as the [BMS]({{ '/docs/projects/bms/testing/' | relative_url }}#verification-plan):
  charge to 4.2 V per cell, rest 2 hours, discharge through a 20 Ω resistor with an inline power meter until a cell
  reaches 3.0 V. Pass if more than 5 Wh came out.
- **Temperature (PAYLD-1):** ramp the components from room temperature to 145 °F at less than 5 °F per minute to avoid
  thermal shock, then soak.

## Components

| Part | Part no. | Bus | Notes |
|:--|:--|:--|:--|
| Microcontroller | [STM32H730VBT6](https://www.digikey.com/en/products/detail/stmicroelectronics/STM32H730VBT6/13171210) | UART, I2C, CAN | Talks to its parts over UART7 and I2C3 |
| Flash | [W25N01GW](https://www.winbond.com/resource-files/w25n01gw%20revf%20082418.pdf) (see note) | QUADSPI | NAND |
| 9-axis IMU | [BNO055](https://cdn-shop.adafruit.com/datasheets/BST_BNO055_DS000_12.pdf) | I2C | Address 0x28, INT1 |
| Barometer/thermometer | [BMP390](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmp390-ds002.pdf) | I2C | Address 0x76, INT |
| Actuator | Motor and ESC (not recorded) | PPM | Drives the lead-screw compressor |
| Test servo | [REEFS207 (49Sub Micro Servo)](https://reefsrc.com/products/49sub-micro-servo-reefs207) | PPM | GYRO's servo. Listed in the old wiki; the verification plan uses "the Midwest servo" to check the PPM output. |
| LEDs | Red, green, blue, yellow (Würth 150060 series) | GPIO | |

The IMU and barometer are wired the same way as on the UFC Primary Card; see the
[Parts Reference]({{ '/docs/projects/parts-reference/' | relative_url }}).

{: .check }
> **Which flash chip?** The component table lists a **W25N01GW** (with a 64 MB capacity copied from the W25N512GV
> rows), but the description below it talks about the **W25N512GV** used on the UFC cards. Two things to check on the
> schematic:
>
> - The W25N01GW is a **1 Gbit (128 MB)** part, not 64 MB.
> - In Winbond's naming, the **GW** suffix is the **1.8 V** version (the 3 V part is W25N01**GV**). If the board runs
>   its flash from 3.3 V like the UFC, a W25N01GW would be the wrong part.

## Changes after the PDR

From the December 2025 PDR action items, all marked done:

- The upstream **fuse was far oversized**. It was resized to the right current rating.
- Finished the mechanical integration: payload mounting, battery, and motor mount CAD, and the PCB cutout size and
  location.
- Added silkscreen for the revision number, a box to write the serial number in, and a "QA PASSED" box for acceptance
  testing. There had been no way to track individual boards through testing.
- Labelled the connectors (text at least 45 mil tall) and added notch cutouts for the programmer connectors.

These came from the lead's PCB layout checklist, which is in
[Design Practices]({{ '/docs/tutorials/hardware/design-practices/' | relative_url }}#final-layout-checklist).

## Schematic

{% include figure.html src="https://github.umn.edu/user-attachments/assets/127151e6-aca5-4adb-b885-b0d61684289c" caption="Payload Control Board schematic" %}

## PCB

Same stack as the UFC data cards.

| Layer | Pour | Routing | Image |
|:--|:--|:--|:--|
| Top | GND | Signals | [view ↗](https://github.umn.edu/user-attachments/assets/62a598fd-fad4-40f3-957a-8031dccba63b) |
| Mid 1 | GND | None | [view ↗](https://github.umn.edu/user-attachments/assets/f9414368-c8c1-4c5c-8a4e-7ce5ded4d97b) |
| Mid 2 | 3.3 V | None | [view ↗](https://github.umn.edu/user-attachments/assets/894adaa7-e14b-4f8a-98e7-c837f8a5a485) |
| Bottom | GND | Signals | [view ↗](https://github.umn.edu/user-attachments/assets/4b7dadb1-dcc2-4896-8a04-c6b4cf696246) |

Renders: [3D view ↗](https://github.umn.edu/user-attachments/assets/885b3fad-8073-41a4-a821-53955a5c8713) ·
[2D view ↗](https://github.umn.edu/user-attachments/assets/b1f44691-7657-46b3-90da-c261c5094561)
(image links need a UMN login)

## Firmware

Not documented. The old page linked to [GYRO's firmware]({{ '/docs/projects/gyro/' | relative_url }}#gnc-and-firmware)
and the [`Avionics/Midwest`](https://github.umn.edu/Rocket-Team/Avionics/tree/main/Midwest) repo, which look like
leftovers from copying the GYRO page. If the payload firmware was built from the GYRO code, say so here; otherwise
link its real location.
