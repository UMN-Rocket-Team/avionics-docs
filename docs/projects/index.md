---
layout: default
title: Projects
nav_order: 3
has_children: true
has_toc: false
permalink: /docs/projects/
---

# Projects

Everything the Avionics subteam has designed and built, along with the specs, test procedures, and
test results that go with it. Most of this was moved over from the old UMN GitHub wiki in September 2026.

## What we've built

| Project | What it is | Built for |
|:--|:--|:--|
| [Universal Flight Computer (UFC)]({{ '/docs/projects/ufc/' | relative_url }}) | Our main flight computer. A stack of swappable cards on a CAN backplane that logs sensor data and sends telemetry to the ground station. | Team rockets since 2019. UFC 3.5 is the IREC 2026 version. |
| [Pitot Tube System]({{ '/docs/projects/pitot/' | relative_url }}) | A pitot-static probe in the nose cone tip plus two boards that measure static pressure, total pressure, and angle of attack. | Flies with the UFC, or standalone on its own battery |
| [Battery Management System]({{ '/docs/projects/bms/' | relative_url }}) | Monitors, protects, balances, and charges the UFC battery pack. Reports battery data to the UFC over CAN. | IREC 2026 (UFC 3.5) |
| [GYRO]({{ '/docs/projects/gyro/' | relative_url }}) | A standalone single-board flight computer that runs roll control. | Midwest 2026 |
| [Payload Control Board]({{ '/docs/projects/payload-board/' | relative_url }}) | Drives the servo mechanism that crushes the simulated Mars regolith payload. | IREC 2026 |
| [Parts Reference]({{ '/docs/projects/parts-reference/' | relative_url }}) | Datasheets, addresses, and notes for parts that show up on several boards (STM32H7, BNO055, BMP390, NAND flash, GPS, radios). | Shared |

## How they fit together

The UFC is the hub. The Pitot Sensor Card and the BMS both talk to it over CAN through the UFC's
Interface Card, and the BMS lives inside the UFC's battery holder. The Pitot system also has its own
power card, so it can fly without the UFC.

GYRO and the Payload Control Board are separate single-board computers, but they reuse a lot of UFC
hardware: the same STM32H730 microcontroller, NAND flash, BNO055 IMU, and BMP390 barometer. GYRO's firmware
is also built on the UFC's.

## Where to start

**New to the team?** Read the [UFC overview]({{ '/docs/projects/ufc/' | relative_url }}) and its
[System Architecture]({{ '/docs/projects/ufc/architecture/' | relative_url }}) page first. Most of the other
projects reuse the UFC's parts and ideas, so the rest will make more sense once you've seen it. After that,
go to whatever project you've been put on.

**Looking something up?**

| Looking for | Go to |
|:--|:--|
| Launch-day checklist | [Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}) |
| Terminal commands | [Terminal]({{ '/docs/projects/ufc/firmware/terminal/' | relative_url }}) |
| CARD_ID / CARD_TYPE values, CAN message types | [CAN Protocol]({{ '/docs/projects/ufc/firmware/can-protocol/' | relative_url }}) |
| Sensor I2C addresses, interrupts, datasheets | [Parts Reference]({{ '/docs/projects/parts-reference/' | relative_url }}) |
| Test procedures and which ones are finished | [Testing & Validation]({{ '/docs/projects/ufc/testing/' | relative_url }}) |

## Acronyms and jargon

| Term | Meaning |
|:--|:--|
| SRAD / COTS | Student researched and developed (we designed it) / commercial off-the-shelf (we bought it) |
| IREC, SAC | Intercollegiate Rocket Engineering Competition, held at the Spaceport America Cup. Older docs say "SAC". |
| Midwest | The Midwest Rocket Competition that GYRO was built for |
| WINGS | Our ground station software. Receives telemetry and plots it. See [WINGS Ground Station]({{ '/docs/projects/wings/' | relative_url }}). |
| IMU | Inertial measurement unit: accelerometer and gyroscope, often with a magnetometer |
| CAN | Controller Area Network, the two-wire bus UFC cards use to talk to each other |
| SPI, I2C, UART | Common chip-to-chip serial buses. SPI uses a chip-select line per device, I2C uses two wires and device addresses, UART is point-to-point. |
| QSPI / QUADSPI | SPI with four data lines, used for the flash chips |
| PCIe | The edge-connector style on the backplane. We use the connectors, not the PCIe protocol. |
| HAL | ST's Hardware Abstraction Layer library for STM32s |
| STLINK | ST's programmer/debugger, which also carries the terminal UART |
| RFD, LoRa | Our two radio types: the RFD900 (902–928 MHz) and LoRa modules (433 MHz) |
| PPS | Pulse per second, a timing signal from the GPS |
| CDH, EPS | Command and data handling / electrical power subsystem, the requirement categories our boards fall under |
| MBSE | Model-based systems engineering, how the requirements were derived |
| ECODE | The UFC firmware's error code bitfield ([Error Codes]({{ '/docs/projects/ufc/firmware/error-codes/' | relative_url }})) |

## About the migrated pages

- **Images.** Most of the old wiki's images (schematics, PCB layers, photos, plots) are still hosted on the
  UMN Enterprise GitHub, which needs a UMN login. On this site they show up as dashed link cards instead of
  images. Click one while logged in to see the picture.
- **Links** to the UMN GitHub repos, Altium 365, and the team Google Drive need team access.
- **Purple boxes** look like this:

{: .check }
These mark places where the old wiki contradicted itself, was left half-written, or is probably out of date.
If you know the answer, fix the page and delete the box.

## Adding or updating a project

Keep these pages up to date as often as is practical. When a design drifts from what's written here, update the
page; the old wiki's rule was that the docs have to match the hardware, or the subteams drift apart too. Feedback
from newly trained members is the best way to find out which pages don't make sense.

1. Copy `docs/projects/project-template` into `docs/projects/`. Use `<name>.md` for a single page, or
   `<name>/index.md` if the project needs sub-pages.
2. Set `title`, `nav_order`, and a `permalink`, then remove `nav_exclude: true`.
3. Add a row to the table at the top of this page.

To replace an image placeholder, download the image, save it under `assets/images/projects/<project>/`, and
change the `src` in its `{% raw %}{% include figure.html ... %}{% endraw %}` tag to the new path. The include
works out the rest.
