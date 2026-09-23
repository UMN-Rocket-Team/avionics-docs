---
layout: default
title: Unit Tests
parent: Testing & Validation
grand_parent: Universal Flight Computer
nav_order: 2
permalink: /docs/projects/ufc/testing/unit-tests/
---

# Unit Tests
{: .no_toc }

Tests for one part of the UFC at a time: sensors, radios, storage, and the backplane. Most use the
[terminal]({{ '/docs/projects/ufc/firmware/terminal/' | relative_url }}) and WINGS.
{: .fs-5 .fw-300 }

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Sensors

### Sensor Calibration

Run the calibration procedure from each sensor's datasheet. No procedure written beyond that.

### Sensor Compare and Sensor Validation

The old wiki had these as two procedures that were almost identical, so they're merged here. The differences are
noted in the steps.

**Goal:** check that the sensors agree with each other across every axis and every card. "Compare" is about
comparing cards; "Validation" is about checking the sensors on one UFC.

**Prerequisites:**
- Every card has up-to-date firmware.
- UFC in its electronics state. For Compare, the Pitot card is optional; for Validation, leave it out.
- For Validation: RFD soldered on, since you'll be moving the UFC around.
- WINGS running and receiving packets.
- A magnet (the fridge one works).
- A tape measure.

**Process:**
1. Program every UFC card with flight code.
2. Turn the UFC off by unplugging the battery.
3. Run the WINGS / UFC startup procedure.
4. Connect the battery to the Power Card.
5. Check that WINGS is receiving sensor packets.
6. Line the UFC up with each axis, positive and negative (6 orientations). Hold each one for at least 5 seconds
   and write down the average acceleration seen on the BNO055 and the 16 g accelerometer. **For Compare**, take
   a photo of each orientation so the data can be matched up between cards.
7. Bring the magnet slowly toward the sensor card along one axis. Stop when the magnetometer readings visibly
   change, and measure the distance with the tape measure. Repeat for all 6 directions.
8. Power off the UFC, then WINGS.

**Pass if:**
- Magnetometer readings are consistent across every axis and card.
- Low-g acceleration is consistent across every axis and card.
- The gyro picked up the movement between orientations.

The old wiki said the Sensor Compare results were "located here under sensor comparison", but the link had
been lost.

### Per-sensor checks

Ideas for checking each sensor against a known reference. None of these have a written procedure yet.

| Sensor | Check |
|:--|:--|
| Accelerometer | Log data while driving around, and compare against a phone. Save both to CSV. If possible, test without the backplane to keep things simple. See also [Moving Car]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#moving-car). |
| Gyroscope | Rotate the PCB 90° about each axis by hand, then check afterwards that the readings show about 90°. Repeat with faster or slower rotations if needed. |
| Magnetometer | Put a magnet at different positions and orientations around the sensor, and check the readings match the field you'd expect. |
| Thermometer | Check readings in a temperature-controlled room, outside on a cold day, and in a fridge, against a thermometer or weather app. |
| Barometer | See [Barometer](#barometer). |
| GPS | Check GPS readings at a few known locations outside the lab. |

Two more comparison ideas from the old summary:

- **Same card type:** with two of the same card (e.g. two Primary Cards), average every sensor's readings while
  sitting still and compare.
- **Different card types:** compare the redundant sensors across the Primary and Secondary cards (e.g.
  magnetometer data from the LIS3MDL and from the BNO055's magnetometer).

### Barometer

**Goal:** check the barometers read pressure correctly. Uses the pressure (vacuum) chamber that the Propulsion
subteam has.

**Prerequisites:**
- Battery fully charged.
- UFC in its structure, or electronics plus Pitot tube.
- **Check that this test won't damage the pressure sensors.**

**Process:**
1. Clear the flash chip.
2. Program the UFC with flight code, and make sure WINGS is receiving data.
3. Put the UFC in the vacuum chamber.

**Pass if:**
- The UFC works for the whole run.
- The UFC's pressure data is what you'd expect.

{: .check }
The process stops at "put it in the chamber". There's no pressure profile to run or reference to compare against.

### Pitot Sensor Validation

**Prerequisites:**
- Every card has up-to-date firmware.
- RFD soldered on (you'll be moving the UFC around).
- UFC in its electronics state.
- A working Teensy and pitot sensor.
- An SD card.
- A toy rocket air launcher, or anything else that blows.

**Process:**
1. Program every UFC card with flight code.
2. Turn the UFC off.
3. Run the WINGS / UFC startup procedure.
4. Connect the battery to the Power Card.
5. Check that WINGS is receiving GPS and sensor packets.

{: .check }
Unfinished: no goal, no steps for actually blowing air at the probe, and no pass conditions. It also uses the
UFC2 Teensy-based Pitot setup. The newer Pitot card has its own
[test results]({{ '/docs/projects/pitot/test-results/' | relative_url }}), including a channel check.

## Radios

### Live Telemetry (RFD)

Records preliminary data rates over the RFD. No procedure, but there are
[results](https://docs.google.com/document/d/11GymLUKvXmXMS4zCnyCEnG1GcsUuXTLaRW7-jmY-IOM/edit?usp=sharing).

### RFD Range

**Goal:** find how far away the RFD keeps a lock.

**Prerequisites:**
- Battery fully charged.
- UFC in its electronics state.
- A laptop that can run WINGS.
- Access to somewhere high up on campus.
- Daylight.

**Process:**
1. Split into two groups: a base station team and a car team.
2. Each group picks one person whose job is to stay in touch with the other group (call, messages, whatever works).
3. The base station team takes WINGS and the radio kit to the high-up spot. (The procedure was written around
   Moos Tower.)
4. The car team takes the UFC gear in the car. The UFC operator sits in the front passenger seat, which has the
   least in the way of the signal.
5. Seatbelts on.
6. Drive to Union St SE, in front of Akerman Hall, and park.
7. Point the UFC's RFD antenna upward.
8. Set the WINGS RFD antennas 90° from each other and normal to the car, as well as you can.
9. Run the WINGS / UFC startup procedure.
10. If you get a connection, carry on. If not, stop the test and rethink.
11. Drive to points further and further away and try to get a radio lock at each one.
12. For each attempt, log the location, time to lock, and estimated car speed (0 if parked).
13. If a connection fails, retry at the same spot (get out of the car if you can). Log how long you gave the radio
    and anything that might be in the way.
14. After 3 failed attempts (or 15 minutes at the same spot), move to a different location.
15. If two locations in a row fail, end the test and head back to the lab, or move on to the next test.

**Pass if:** you get a radio lock at **2+ miles**.

Results of the first run are [here](https://docs.google.com/document/d/1KIliTi7cUKt0AWNoyBWyQ72a_R0jiVnkQ9Tx4aqhLfM/edit?usp=sharing).

### LoRa Range

Same idea as [RFD Range](#rfd-range), with the LoRa. No procedure written yet.

Another idea from the old summary, for either radio: fly one on a weather balloon, connected to a Teensy or
Arduino sending data from something that measures distance or altitude, and see how high it stays locked to WINGS.

### GPS Lock

**Goal:** check the GPS gets a lock reliably, including with the nose cone lying on its side.

**Prerequisites:** the UFC is integrated.

**Process:**
1. Follow the preflight procedures (in the technical report).
2. Take the UFC outside and turn it on.
3. Time how long it takes to get a lock with the nose cone in different orientations. Do several runs and make
   sure it can reliably get a lock with the nose cone on its side and the patch antenna facing up.

Once the rocket is ready, repeat the test in a simulated flight configuration.

**Pass if:**
- Lock times are consistent.
- The UFC works the whole time.
- The GPS gets a lock with the nose cone on its side, antenna facing the sky.
- The GPS gets a lock with the nose cone pointing down.

### Antenna Configuration

**Idea:** assemble the UFC in its structure, and set up a radio station (laptop with RFD and LoRa) far away but in
line of sight, like across a big field. Hold the UFC vertical and try different antenna setups to find the best
spot for all three antennas. No procedure written yet.

## Storage

### Flash Chip

**Goal:** check the flash records data correctly, with no gaps.

**Prerequisites:**
- Flash reset.
- Host and radio cards.

**Process:**
1. Reset the flash.
2. Start the host and radio cards in flight mode.
3. Run the UFC for exactly 10 minutes, then power it off.
4. Power the host on in readout mode and start the data readout while WINGS is running.

**Pass if:**
- The GPS `time_sec` field shows ten spikes (it resets every 60 seconds).
- There are no large gaps in any packet type.

The old summary also suggests: store data from three different sensors on the same card until the flash is full,
then check that it really stopped and that the data is correct.

{: .check }
Written for UFC2 (host and radio cards, readout mode). On UFC 3.5, erasing is `RESET` and readout goes through the
SD card ([Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }})). See also the
[overnight flash test results]({{ '/docs/projects/ufc/testing/results/' | relative_url }}).

### SD Card

**Idea:** repeat the flash test with the SD card. Also trigger an SD card backup by command, which pulls the flash
contents from every card on the network onto the SD card. No procedure written yet.

## Backplane

### CAN Interface

Two ideas, no procedure written yet:

- Assemble the UFC in flight configuration. Flash every card with code that sends 1000 packets at the fastest
  rate it can. Have one card receive them all and count them. Afterwards, check the count is what you expected.
- Use a Python script to send commands to every card in a loop from one access point. Count hits (command ran and
  a response came back) and misses (command timed out).

## Firmware unit test targets

The old firmware test page listed a unit test for each of these parts but didn't have procedures for any of them.

| Part | Card | Datasheet |
|:--|:--|:--|
| W25N512GV NAND flash | All cards | [datasheet](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf) |
| SD card | Interface | |
| BNO055 IMU | Primary | [datasheet](https://cdn-shop.adafruit.com/datasheets/BST_BNO055_DS000_12.pdf) |
| MAX-M10S GPS | Primary | [datasheet](https://content.u-blox.com/sites/default/files/MAX-M10S_DataSheet_UBX-20035208.pdf) |
| BMP390 barometer | Primary | [datasheet](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmp390-ds002.pdf) |
| RFD900UX2 radio | Primary | [datasheet](https://files.rfdesign.com.au/Files/documents/RFD900ux%20DataSheet%20v1.2.pdf) |
| LIS2DW12 low-g accelerometer | Secondary | [datasheet](https://www.st.com/resource/en/datasheet/lis2dw12.pdf) |
| H3LIS200DL high-g accelerometer | Secondary | [datasheet](https://www.st.com/resource/en/datasheet/h3lis200dl.pdf) |
| LIS3MDL magnetometer | Secondary | [datasheet](https://www.st.com/resource/en/datasheet/lis3mdl.pdf) |
| I3G4250D gyroscope | Secondary | [datasheet](https://www.st.com/resource/en/datasheet/i3g4250d.pdf) |
| BMP390 barometer | Secondary | [datasheet](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmp390-ds002.pdf) |
| RN2483 LoRa radio | Secondary | [datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/RN2483-Low-Power-Long-Range-LoRa-Technology-Transceiver-Module-DS50002346F.pdf) |
| BNO055 IMU | Pitot | [datasheet](https://cdn-shop.adafruit.com/datasheets/BST_BNO055_DS000_12.pdf) |
| ADS1115 ADC | Pitot | [datasheet](https://www.ti.com/lit/ds/symlink/ads1115.pdf) |
| BPS130 pressure sensors (with the ADS1115) | Pitot | [datasheet](https://www.bourns.com/docs/product-datasheets/bps130.pdf) |
