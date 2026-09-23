---
layout: default
title: Timings & Budgets
parent: Firmware
grand_parent: Universal Flight Computer
nav_order: 5
permalink: /docs/projects/ufc/firmware/timings/
---

# Timings & Budgets
{: .no_toc }

Measured and calculated numbers for the UFC firmware: bus speeds, loop rates, how fast each card fills its flash,
how long data transfers take, and how much radio bandwidth telemetry needs.
{: .fs-5 .fw-300 }

{: .check }
> These come from the firmware subteam's `UFC timings.xlsx` in the team Drive (05-Firmware SST). It's undated but
> describes the UFC3 cards (Primary, Secondary, Interface, Pitot), so it's most likely from 2024–25. A few values are
> marked "should change" in the sheet, and some don't match the April 2025
> [test results]({{ '/docs/projects/ufc/testing/results/' | relative_url }}): the sheet predicts the Primary Card
> fills its flash in 104 minutes, while the overnight test recorded 125 minutes of data, and it gives ~45 minutes for a
> CAN transfer to SD, while the test took 34. Treat these as ballpark figures and re-measure after firmware changes.

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Bus speeds and loop rates

| What | Value | Status in the sheet |
|:--|--:|:--|
| CAN (backplane) | 988 kHz | Final |
| I2C, Primary Card | 1000 kHz | "Decrease if issues arise" |
| I2C, Pitot Card | 1000 kHz | Final |
| SPI, Secondary Card sensors | 10 MHz | Final |
| SPI, SD card | 50 MHz | Final |
| Quad SPI, flash chip | 6.25 MHz | Should change |
| **Main loop, Primary Card** | **100 Hz** | Final |
| **Main loop, Secondary Card** | **300 Hz** | Final |
| **Main loop, Pitot Card** | **240 Hz** | Final |

{: .note }
The CAN speed here (988 kHz) is the measured value; the [Backplane]({{ '/docs/projects/ufc/cards/backplane/' | relative_url }})
page's 1 Mbit/s is the nominal rate. The old wiki also says the GPS I2C bus runs at 400 kHz, which doesn't match the
1000 kHz Primary Card I2C figure here (and the pin allocation sheet puts the GPS on a UART; see the
[Primary Card]({{ '/docs/projects/ufc/cards/primary-card/' | relative_url }}#wiring-notes)).

## Storage

| What | Value |
|:--|--:|
| Erase the full flash | 1 s |
| Flash write speed, measured | ~605 kB/s |
| Flash write speed, used for the buffer estimates below | ~228 kB/s |
| SD card write speed, measured | ~74.5 kB/s |
| Copy a full 64 MB flash to SD, on the same card | 4 min 39 s |
| Copy a full 64 MB flash to SD **over CAN** (Interface Card pulling another card's flash) | 44 min 36 s |
| Fill the flash at the theoretical maximum rate | 1 min 51 s |
| Wait on the SD card after landing | 2 s |

### How fast each card fills its flash

| Card | Data generated | Made up of | Flash fill time |
|:--|--:|:--|--:|
| Primary | 10,800 B/s | 200 altimeter (24 B) + 100 BNO (52 B) + 10 GPS (80 B) packets per second | 103.6 min |
| Secondary | 24,000 B/s | 300 sensor (64 B) + 200 altimeter (24 B) packets per second | 46.6 min |
| Pitot | 9,840 B/s | 116 pitot (40 B) + 100 BNO (52 B) packets per second | 113.7 min |
| Interface | 1,220 B/s | 10 altimeter + 5 BNO + 5 GPS + 5 sensor packets per second | 15.3 h |

So if you start recording by hand with `RECORD` ([Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}#recording)),
do it close to launch: the Secondary Card fills its flash in under an hour.

### Circular buffer sizes

The pre-launch [circular buffer]({{ '/docs/projects/ufc/firmware/flash-driver/' | relative_url }}#the-circular-buffer)
holds about 10 seconds of data on each card.

| Card | Buffer size | Time to write it to flash |
|:--|--:|--:|
| Primary | 108,000 B | 0.47 s |
| Secondary | 240,000 B | 1.3 s |
| Pitot | 98,400 B | 0.43 s |

## Radio

**RFD throughput** (500 BNO packets):

| UFC state | Time | 
|:--|--:|
| Idle | 11.5 s |
| Flying | 11.7 s |
| Uploading (flash transfer running) | 18.3 s |

So telemetry runs at about **0.65× speed** while a flash upload is happening. Idle throughput was about 5000 packets
per minute.

### Telemetry bandwidth

The sheet's telemetry calculator sends six packet types at 20 Hz:

| Packet | Contents | Data | Sent (with overhead) |
|:--|:--|--:|--:|
| Sensor | Low-g and high-g accel, magnetometer, gyro (X/Y/Z each) | 48 B | 68 B |
| BNO | Accel, gyro, Euler heading/roll/pitch | 36 B | 56 B |
| Altimeter | Temperature, pressure | 8 B | 28 B |
| GPS | Time, lat/lon, heights, fix type, satellites, accuracies, pDOP, NED velocity | 96 B | 116 B |
| Pitot center | Center port, static port | 8 B | 28 B |
| Pitot radial | Up, down, left, right ports | 16 B | 36 B |

Together that's **332 bytes per cycle, about 64 kbps**. For comparison:

- The 2026 ground station requirement is to handle **64 kbps** ([WINGS]({{ '/docs/projects/wings/' | relative_url }}#requirements)).
- The 2026 433 MHz radio trade study says IREC 2025 flew at **60 kbps**, and that "around 102 kbps would be ideal".
- A 2026 version of the same calculator for GYRO (BNO, altimeter, and GPS packets only) comes to about 51 kbps.

## Sensor settings

The configured range and output data rate for each sensor are listed on the card pages:
[Primary Card]({{ '/docs/projects/ufc/cards/primary-card/' | relative_url }}#sensor-settings),
[Secondary Card]({{ '/docs/projects/ufc/cards/secondary-card/' | relative_url }}#sensor-settings), and
[Pitot Sensor Card]({{ '/docs/projects/pitot/sensor-card/' | relative_url }}#analog-front-end).
