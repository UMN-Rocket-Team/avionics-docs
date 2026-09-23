---
layout: default
title: System Tests
parent: Testing & Validation
grand_parent: Universal Flight Computer
nav_order: 3
permalink: /docs/projects/ufc/testing/system-tests/
---

# System Tests
{: .no_toc }

Tests of the whole UFC working together: flight simulations on the bench, long-duration runs, and flight-like
conditions (cars and carts). Everything here assumes the [hardware tests]({{ '/docs/projects/ufc/testing/hardware-tests/' | relative_url }}) have passed.
{: .fs-5 .fw-300 }

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Flight simulation

### Flight Simulation Day

**Goal:** make sure the UFC can do everything it needs to in flight.

**Prerequisites:**
- Cards: Power, Interface, Primary, Secondary, and optionally Pitot.
- The hardware tests have passed.

**Process:**
1. Make sure the SD card is formatted as **exFAT** before putting it in the Interface Card.
2. Make sure the RFD is connected to the computer and WINGS is set up.
3. Check that WINGS is getting live telemetry.
4. Plug the programmer into the **Interface Card** and check the terminal connection.
5. Run `RESET` and answer `y`. Check that it succeeds.
6. Run `LAUNCH`. Check that it succeeds.
7. Shake the UFC, then wait 5 minutes and check the sensor data.
8. Run `LAND`. Check that it succeeds.
9. Wait for the SD transfer to finish.
10. Take out the SD card and check on a computer that the data transferred and looks right.

**Pass if:**
- The data looks good.
- The UFC works the whole time.

### Flight Simulation Night

**Goal:** make sure the flash holds up over a long run.

**Prerequisites:** [Flight Simulation Day](#flight-simulation-day) has passed.

**Process:** the same as Flight Simulation Day, except at step 7 **leave the UFC running overnight** instead of
shaking it and waiting 5 minutes.

**Pass if:**
- The data looks good.
- The UFC works the whole time.

The old summary also describes a **Flight Simulation Lite** (follow the preflight procedure, run the UFC for 20
minutes, check the data) and a full **Flight Simulation** (the same for 4 hours). Day and Night are the versions
with written procedures.

### Overnight Flash Test

Runs the UFC overnight to test the [flash chip](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf)
and the [flash driver]({{ '/docs/projects/ufc/firmware/flash-driver/' | relative_url }}): the flash should record
correctly and stop when it's full. There's no written procedure, but there are two sets of
[results]({{ '/docs/projects/ufc/testing/results/' | relative_url }}) from April 2025 that show how it was run.

### System Integrity

**Idea:** run the integrated UFC on its battery for 3 minutes, then suddenly disconnect and reconnect the battery.
It should come back up and carry on normally: check that it's in flight configuration, read the flag that says
whether the rocket has already launched, and decide from that whether to start reading and saving sensor data to
flash. No procedure written yet.

### State Detection

**Idea:** fly the UFC on a test rocket with a packet on every card that reports the state it thinks the rocket is
in. Check that every card detected takeoff, apogee, and landing at the right time. No procedure written yet.

## Flight conditions

### Moving Car

**Goal:** check the UFC's data against a second measurement under real, messy accelerations.

**Prerequisites:**
- Battery fully charged.
- UFC in its electronics state.
- A phone app that records acceleration and gyro data (Physics Toolbox worked well when this was written), or a
  COTS flight computer.

**Roles:** driver, UFC operator, WINGS operator, and if you have a fourth person, a note-taker.

**Before getting in the car:**
1. Clear the flash chip.
2. Program the UFC with flight code.
3. Unplug the battery from the UFC.
4. Open the phone app and work out which way its X, Y, and Z axes point.
5. Turn off auto-sleep on the phone.

**In the car:**

{: start="6" }
6. Seatbelts.
7. If you're doing this alongside the [RFD range test]({{ '/docs/projects/ufc/testing/unit-tests/' | relative_url }}#rfd-range),
   the UFC operator should sit in the back to protect the UFC. (If you can get a baby seat for the UFC, do it.)
8. If the UFC is in its electronics state, position it with the backplane flat like a plate and the cards parallel
   to the car's main direction of acceleration.
9. Make sure the phone has plenty of free storage.
10. Start the phone's accelerometer app and put the phone under the backplane, screen facing away from it. Line it
    up with one edge of the UFC as closely as you can, so they share the same frame of reference.
11. Drive somewhere you can do funny things with a car.
12. Run the WINGS / UFC startup procedure.
13. The driver makes as much acceleration as they think is safe, in as many directions as possible.
14. The note-taker (if there is one) logs every manoeuvre the driver does in a Google Doc in the team drive.
15. After the manoeuvres, compare the WINGS data with the phone's. If they're way off, think about redoing the
    driving part.

**After the test:**

{: start="16" }
16. Save the WINGS live data to a CSV.
17. Offload the flash chip onto WINGS using jumper wires and a breakout board.
18. Put both CSVs (phone and WINGS) in the team Google Drive.
19. Compare the two data sets to find gaps and failures in the UFC's accelerometer data.

**Pass if:**
- The UFC works for the whole drive.
- The UFC data matches the phone or COTS data.

{: .check }
Step 17 (offloading over jumper wires and a breakout board) is the UFC2 readout method. On UFC 3.5, use the SD card
or `readAllFlash.py` ([After the flight]({{ '/docs/projects/ufc/operations/' | relative_url }}#after-the-flight)).

### Moving Cart

**Goal:** same as Moving Car, but on a hand-pushed cart, which can take sharper starts, stops, and crashes.

**Prerequisites:**
- Battery fully charged.
- UFC in its electronics state.
- A COTS flight computer.

**Setup:**
1. Put the power, sensor, radio, and host cards into the UFC structure. **Don't screw the cards in yet.**
2. Program every card with flight code, replug the UFC, and check that every card runs through its flight mode
   startup.
3. Screw in all the cards.
4. Find a battery with more than 50% charge (check on the charger).
5. Attach the radio antenna and sandwich the battery in.
6. Attach the COTS flight computer and its battery to the frame.
7. Set WINGS up to listen for packets on the RFD: plug in the radio, then connect WINGS to it.
8. Set up the COTS ground station (or just use WINGS if it's an Altus Metrum).
9. Power up both flight computers as close to the same moment as you can.
10. Shake the structure along each axis, and write down which UFC axis matches which axis on the COTS computer.
11. Turn off both systems.
12. Unscrew the host card.
13. Clear the flash chip on the host card.
14. Check that the host card is back in flight mode by looking at the switch. Don't power the UFC again to check.
15. Screw the host card back in.
16. Zip-tie the UFC structure to the cart.

**Test:**

{: start="17" }
17. Redo steps 7–9.
18. Violently push and stop the cart in the Akerman hallway for about 5 minutes, to get as wide a range of g-forces
    as possible.
19. Unplug the UFC once you're happy with the data.

**After the test:**

{: start="20" }
20. Save the WINGS logs folder to the drive.
21. Take out the host card and put it on a different backplane.
22. Attach the debugger to the backplane.
23. Connect an FTDI cable to the debugger with jumper wires, for ground and RX.
24. Put the host card in readout mode.
25. Double-check that it's in readout mode.
26. Open a new WINGS window and connect to the serial port as if it were an RFD.
27. Power the host card through a Power Card and battery.
28. If the host card doesn't look like it's in readout mode, unplug it.
29. When the host card's lights stop blinking, copy the WINGS logs folder and save it to the drive.

**Pass if:**
- The UFC's flash can be read.
- The UFC data matches the COTS data.

{: .check }
Written for UFC2: power, sensor, radio, and host cards, with readout mode on the host card. The setup and readout
steps need rewriting for UFC 3.5 (see [Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }})).

### Hot Car

**Idea:** run the UFC in flight configuration inside a stationary, dark-painted car. It should get hot enough in
there to check that sensor values and battery life stay as expected for the whole run. No procedure written yet.

## Test rocket and IREC

| Test | What it tests |
|:--|:--|
| Test rocket | Every UFC feature under real-world conditions |
| IREC | Yes. |
