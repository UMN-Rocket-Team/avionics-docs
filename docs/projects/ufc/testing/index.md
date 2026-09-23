---
layout: default
title: Testing & Validation
parent: Universal Flight Computer
grand_parent: Projects
nav_order: 6
has_children: true
has_toc: false
permalink: /docs/projects/ufc/testing/
---

# Testing & Validation
{: .no_toc }

How we check that the UFC works and will survive a flight: what kinds of tests there are, how to write them
up, and the full list of tests along with which ones actually have a written procedure.
{: .fs-5 .fw-300 }

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Kinds of test

| Kind | What it checks | Page |
|:--|:--|:--|
| **Hardware tests** | The physical side: solder joints, voltages, current and power draw, battery life | [Hardware Tests]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}) |
| **Unit tests** | One part of the system on its own, usually with firmware: sensor calibration and data, radios, storage | [Unit Tests]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}) |
| **System tests** | Whether the pieces work together without breaking each other: flight simulations, flight-like conditions | [System Tests]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}) |

Results from the tests we have write-ups for are on [Test Results]({{ '/docs/projects/ufc/testing/results/' | relative_url }}).

{: .check }
Many procedures were written for **UFC2** (Host, Sensor, and Radio cards, a Teensy-based Pitot card, readout
mode set with switches) and haven't been updated for UFC 3.5. They're kept as written, with a note on each one.
Read [Legacy (UFC2)]({{ '/docs/projects/ufc/legacy/' | relative_url }}) if the card names don't make sense, and
update the procedure when you next run it.

A lot of procedures also say "run the WINGS / UFC startup procedure". That was never written down as its own
procedure. The closest thing is [Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}):
connect to the terminal, check the cards, and set up WINGS.

## Writing up a test

Every test procedure should have:

| Field | What goes in it |
|:--|:--|
| **Name** | Matching the name in the [test list](#all-tests) |
| **Goal** | One line on what the test is for |
| **Prerequisites** | The state the UFC needs to be in and the equipment you need |
| **Process** | Step by step, including every action and detail |
| **Pass conditions** | The list of conditions that decide whether it passed |

Every set of results should have:

| Field | What goes in it |
|:--|:--|
| **Test name** | Same as the procedure |
| **Date** | When it was run |
| **Responsible** | Who ran it |
| **Board version** | Hardware version, so different designs of the same board can be told apart |
| **Board identifier** | The board's name or ID, to tell apart boards of the same version |
| **Pass conditions** | Copied from the procedure, with the ones that passed checked off |
| **Results** | What happened, with enough detail that someone reading it later understands it without you there |

## Where results live

Validation results change every year, so each year gets its own document:

- [2023–24 validation results](https://docs.google.com/document/d/1iXIz7-mZOIwXpJe-VVB2doyHs4mxYYTppuxdIjCa-J8/edit?tab=t.0)
- 2024–25 validation results

{: .check }
The old wiki had an entry for the 2024–25 results document, but the link was empty. There's no entry at all for
2025–26.

The WINGS data files from each test are in the team Google Drive, under
**05-Avionics › 03-Avionics IREC › UFC Data**.

## All tests

<span class="tag tag-ok">Written</span> has a full procedure.
<span class="tag tag-partial">Partial</span> has a procedure with gaps (usually missing pass conditions or steps).
<span class="tag tag-none">Summary only</span> has just a one-line description of what the test should do.

### Hardware

| Test | Checks | Procedure |
|:--|:--|:--|
| [Solder Integrity]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#solder-integrity) | Every pad connected, no bridges | <span class="tag tag-ok">Written</span> |
| [Battery Voltage Supply]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#battery-voltage-supply) | Full batteries give the expected voltage | <span class="tag tag-ok">Written</span> |
| [Battery Storage]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#battery-storage) | Battery holds charge overnight | <span class="tag tag-ok">Written</span> |
| [Voltage Level Lite]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#voltage-level-lite) | Backplane rails correct with just the Power Card | <span class="tag tag-ok">Written</span> |
| [Voltage Level]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#voltage-level) | Backplane rails correct with the full UFC | <span class="tag tag-ok">Written</span> |
| [Current Draw]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#current-draw) | Current draw of each card | <span class="tag tag-partial">Partial</span> |
| [Power Draw]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#power-draw) | Peak draw of the full UFC, and estimated battery life | <span class="tag tag-ok">Written</span> |
| [Battery Life Lite]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#battery-life-lite) | Run time on one data card | <span class="tag tag-ok">Written</span> |
| [Battery Life]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#battery-life) | Run time of the full UFC | <span class="tag tag-partial">Partial</span> |
| [Debug Pin Test]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}#debug-pin-test) | Sensors work when driven from a Teensy/Arduino | <span class="tag tag-none">Summary only</span> |

### Sensors, radios, storage

| Test | Checks | Procedure |
|:--|:--|:--|
| [Sensor Calibration]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#sensor-calibration) | Each sensor's datasheet calibration | <span class="tag tag-none">Summary only</span> |
| [Sensor Compare / Validation]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#sensor-compare-and-sensor-validation) | Sensors agree across axes and cards | <span class="tag tag-ok">Written</span> |
| [Per-sensor checks]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#per-sensor-checks) | Accelerometer, gyro, magnetometer, thermometer, GPS against a known reference | <span class="tag tag-none">Summary only</span> |
| [Barometer]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#barometer) | Pressure readings in a vacuum chamber | <span class="tag tag-partial">Partial</span> |
| [Pitot Sensor Validation]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#pitot-sensor-validation) | Pitot pressure sensors respond | <span class="tag tag-partial">Partial</span> |
| [Live Telemetry (RFD)]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#live-telemetry-rfd) | Data rates over the RFD | Results only |
| [RFD Range]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#rfd-range) | Radio lock at increasing distance (pass: 2+ miles) | <span class="tag tag-ok">Written</span> |
| [LoRa Range]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#lora-range) | Same as RFD Range, with the LoRa | <span class="tag tag-none">Summary only</span> |
| [GPS Lock]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#gps-lock) | Time to lock at different nose cone orientations | <span class="tag tag-ok">Written</span> |
| [Antenna Configuration]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#antenna-configuration) | Best antenna placement | <span class="tag tag-none">Summary only</span> |
| [Flash Chip]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#flash-chip) | Flash records correctly with no gaps | <span class="tag tag-ok">Written</span> |
| [SD Card]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#sd-card) | SD card records correctly; manual backup works | <span class="tag tag-none">Summary only</span> |
| [CAN Interface]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#can-interface) | No lost packets or commands between cards | <span class="tag tag-none">Summary only</span> |

### System

| Test | Checks | Procedure |
|:--|:--|:--|
| [Flight Simulation Day]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#flight-simulation-day) | Full flight sequence end to end | <span class="tag tag-ok">Written</span> |
| [Flight Simulation Night]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#flight-simulation-night) | Same, left running overnight | <span class="tag tag-ok">Written</span> |
| [Overnight Flash Test]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#overnight-flash-test) | Flash fills correctly and stops when full | Results only |
| [System Integrity]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#system-integrity) | Recovers from a power cut mid-run | <span class="tag tag-none">Summary only</span> |
| [State Detection]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#state-detection) | Every card detects takeoff, apogee, and landing on a real flight | <span class="tag tag-none">Summary only</span> |
| [Moving Car]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#moving-car) | Data matches a phone or COTS computer under real accelerations | <span class="tag tag-ok">Written</span> |
| [Moving Cart]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#moving-cart) | Same, on a hand-pushed cart | <span class="tag tag-ok">Written</span> |
| [Hot Car]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#hot-car) | Sensors and battery hold up in heat | <span class="tag tag-none">Summary only</span> |
| [Test rocket and IREC]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#test-rocket-and-irec) | Everything, for real | — |
