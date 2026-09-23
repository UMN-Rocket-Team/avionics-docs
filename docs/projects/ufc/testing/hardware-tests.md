---
layout: default
title: Hardware Tests
parent: Testing & Validation
grand_parent: Universal Flight Computer
nav_order: 1
permalink: /docs/projects/ufc/testing/hardware-tests/
---

# Hardware Tests
{: .no_toc }

Tests for the physical side of the UFC: solder joints, voltages, current and power draw, and battery life.
Roughly in the order you'd run them on new boards.
{: .fs-5 .fw-300 }

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Solder Integrity

**Goal:** make sure every component on a card is soldered correctly, with no bridges between pins.

**Prerequisites:** the card is fully soldered.

**Process:**
1. Check that every pad on the PCB is properly connected to its component.
2. Use a multimeter to check every pin on the card for bridges.

**Pass if:**
- Every pad is properly connected to its component.
- The multimeter finds no bridges on any pin.

## Battery Voltage Supply

**Goal:** make sure the batteries give the expected voltage when fully charged.

**Prerequisites:** batteries fully charged.

**Process:**
1. Check each battery with a multimeter.

**Pass if:** every battery gives the expected voltage.

## Battery Storage

**Goal:** make sure a battery doesn't lose charge overnight.

**Prerequisites:** battery fully charged.

**Process:**
1. Measure the charge of the freshly charged battery.
2. Leave it overnight.
3. Measure the charge again.

**Pass if:** the charge hasn't changed.

## Voltage Level Lite

**Goal:** make sure the backplane lines have the right voltages.

**Prerequisites:** Power Card plugged into the backplane.

**Process:**
1. Connect the battery to the Power Card to power the backplane.
2. Measure the backplane lines: 3.3 V, 5 V, and GND.

**Pass if:** every backplane line has the expected voltage.

## Voltage Level

**Goal:** make sure the backplane lines have the right voltages with the whole UFC assembled.

**Prerequisites:** UFC fully assembled, with every card, radio, and antenna connected.

**Process:**
1. Connect the battery to the Power Card to power the UFC.
2. Measure every backplane line: 3.3 V, 5 V, and GND.

**Pass if:** every backplane line has the expected voltage with the full UFC powered.

## Current Draw

**Goal:** measure how much current each card draws.

**Prerequisites:**
- Power Card plugged into the backplane and connected to the battery.
- The voltage level tests have passed.
- A **test card**: a small board that sits between the backplane and a UFC card, breaking the power lines out to
  two header pins so a multimeter can go in series. This has to be designed and made first.

**Process:**
1. Put the test card between the backplane and a UFC card, and measure that card's current draw with a multimeter.
2. Repeat for every card, recording each one's draw. Try different combinations of the other cards plugged
   directly into the backplane.

**Pass if:** not written yet.

## Power Draw

**Goal:** measure the peak power draw of the full UFC and estimate battery life from it.

**Prerequisites:** every card used for flight installed in the backplane and running.

**Process:**
1. Install every card in the backplane.
2. Upload test code to the radio card that simulates maximum power use.
3. Set a benchtop power supply to 12 V.
4. Connect the power supply to the Power Card in place of the UFC battery.
5. Note the power draw shown on the supply.

To turn that into an estimate, use the battery's rated capacity.

**Pass if:** the full UFC is estimated to run for **at least six hours**.

{: .check }
"Radio card" is a UFC2 card. On UFC 3.5 the main radio is on the [Primary Card]({{ '/docs/projects/ufc/cards/primary-card/' | relative_url }}).

## Battery Life Lite

**Goal:** measure how long the battery runs the Power Card plus one data card. Run it with both batteries and
both data cards (four runs).

**Prerequisites:**
- Battery fully charged.
- UFC in its electronics state (not in the structure).
- WINGS running and receiving packets from the UFC.

**Process:**
1. Program every UFC card except the host with flight code.
2. Make sure the wires going into the Power Card are clean, tidy, and can't short.
3. Run the WINGS / UFC startup procedure.
4. Write down the start time.
5. Put up signs telling people not to touch the test, on the avionics bench and on the power strip for the laptop.
6. Keep checking that WINGS is still receiving data. If it isn't, stop the test, write down the time, and check
   the battery charge by plugging it back into the charger.
7. When the UFC's lights go off, close WINGS to stop collecting data.
8. Open `wings_logs` in the user's app data folder. The test length is the difference between the first and last
   timestamps.

**Pass if:**
- The electronics run as long as in the other battery tests.
- WINGS gets packets at a steady rate.
- No card stops working during the test.

{: .check }
Written for UFC2 ("every card except the host"). UFC 3.5 has no Host Card.

## Battery Life

**Goal:** measure how long the battery runs the whole UFC. Run it with both batteries.

**Prerequisites:**
- Battery fully charged.
- UFC in its electronics state.
- WINGS running and receiving packets from the UFC.

**Process:**
1. Program every UFC card with flight code. Make sure the sensor, pitot, and radio cards are enabled on the host
   (`host_card_settings.h`) and in the right backplane slots.
   - Tip: boot the host card into readout mode and erase its flash before running this. Then you can check the
     flash output at the end too, which is sick!
2. Make sure the wires going into the Power Card are clean, tidy, and can't short.
3. Run the WINGS / UFC startup procedure.

**Pass if:**
- The electronics run for **8+ hours**.
- WINGS gets packets at a steady rate.
- No card stops working during the test.

{: .check }
The written steps stop after startup; follow steps 4–8 of [Battery Life Lite](#battery-life-lite). Also written
for UFC2 (host, sensor, and radio cards). Note that this test's 8-hour pass condition is stricter than
[Power Draw](#power-draw)'s 6 hours.

## Debug Pin Test

**Goal:** check sensor hardware independently of our firmware.

**Idea:** connect a Teensy or Arduino to each card's debug interface and run the demo sketches from the Arduino
IDE for each sensor that has one.

No procedure written yet.
