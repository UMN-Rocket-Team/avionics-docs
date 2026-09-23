---
layout: default
title: UFC2 Integration Checklist
parent: Legacy (UFC2)
grand_parent: Universal Flight Computer
nav_order: 2
permalink: /docs/projects/ufc/legacy/integration/
---

# UFC2 Integration Checklist
{: .no_toc }

Pre-integration, integration, and post-flight readout for the UFC2: Power, Host, and Sensor cards, plus the
Teensy card that read the pitot tube.
{: .fs-5 .fw-300 }

{: .check }
This is the UFC2 procedure (it mentions SAC, the Host Card's DIP switches, and a Teensy Pitot card). For UFC 3.5,
use [Assembly]({{ '/docs/projects/ufc/assembly/' | relative_url }}) and
[Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}). It's kept here because parts of it
(battery charging, wiring checks, the post-flight order of operations) are still useful, and nobody has written
a UFC 3.5 version yet.

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Pre-integration

**Charge the batteries**
- [ ] Fully charge both batteries: blue charger, **"LiIo Charge 3A 3S"** mode, charge to 99%.
- [ ] Once charged, check each battery's voltage with a multimeter.

**Get a second setup for erasing the Host Card**
- [ ] Get the secondary backplane.
- [ ] Get the secondary battery.
- [ ] Attach the power cable to the Power Card's green terminal blocks. Make sure red and black are in the right
      places and that nothing can short from jammed or bent wires.
- [ ] Put the Power Card in slot 1 of the secondary backplane.

**Test power delivery**
- [ ] Connect the battery to the Power Card.
- [ ] Plug one of the old cards into the backplane and check it lights up correctly.
- [ ] Unplug the Power Card from the battery.

**Prepare the Host Card**
- [ ] Check every setting in the Host Card flight code.
- [ ] Program the Host Card with flight code.
- [ ] Erase the flash:
  1. Flip the **MODE** switch on the back of the Host Card to **On** (the side with the words).
  2. Connect the battery to the Power Card with the yellow XT connectors. If you're using the screw switch, close it.
  3. Check the UFC boots into readout mode: **two low beeps**.
  4. With it powered, flip the **ERASE** switch to **On**.
  5. Wait for the LEDs to confirm the erase:
     - All the Host Card LEDs blink rapidly for **7 seconds**. Flipping ERASE back off during the blinking cancels
       the erase.
     - All LEDs go off while it erases.
     - When it's done, the leftmost green LED comes on.
  6. Disconnect the battery at the XT connectors.
  7. Flip **ERASE** back to Off.
  8. Flip **MODE** back to Off.

**Prepare the Sensor Card**
- [ ] Check every setting in the Sensor Card flight code.
- [ ] Program the Sensor Card with flight code.

**Get the Teensy ready**
- [ ] Check the Teensy code.
- [ ] Program the Teensy with flight code.
- [ ] Format the 16 GB SD card as exFAT.
- [ ] Wipe the SD card.

**Clean up**
- [ ] Unplug the secondary battery from the Power Card.
- [ ] Take all the cards off the secondary backplane.

## Integration

- [ ] Check the battery is fully charged.
- [ ] Attach the power cable to the Power Card's green terminal blocks. Red and black in the right places, nothing
      that could short.

**Power Card**
- [ ] Attach the L-brackets to the bottom of the card, foam side up, with 4-40 × 3/8 screws. **Don't fully tighten
      them.** Leave the screws loose and not touching the foam.
- [ ] Put the Power Card in slot 1.
- [ ] Attach the L-brackets to the UFC structure with 4-40 × 1/2 screws.

**Test power delivery**
- [ ] Connect the battery to the Power Card.
- [ ] Plug one of the old cards into the backplane and check it lights up correctly.
- [ ] Unplug the Power Card from the battery.

**Host Card**
- [ ] Set all the Host Card's DIP switches to Off (the side without words).
- [ ] Attach the L-brackets, foam side up, screws loose and not touching the foam.
- [ ] Put the Host Card in the host slot.
- [ ] Attach the L-brackets to the structure.

**Teensy card**
- [ ] Wire the pitot cable to the Teensy card. The colour order depends on which cable you have:

  | Signal | Pitot cable 1 | Pitot cable 2 |
  |:--|:--|:--|
  | GND | Blue | Blue |
  | +3.3 V | Red | White |
  | RESET | Black | Red |
  | COPI | White | Black |
  | CIPO | Purple | Purple |
  | SCK | Yellow | Yellow |
  | CS | Orange | Orange |
  | +5 V | Green | Green |

- [ ] Connect the Teensy cable to the pitot tube PCB.
- [ ] Put the wiped SD card in the Teensy.
- [ ] Power the Teensy from USB, watch for a **flashing white** light, then remove power. A **red** light means it
      can't open the SD card; try another one.
- [ ] Disconnect the Teensy cable from the pitot tube.
- [ ] Check the SD card has data and that every value is above 600. If not, switch to pitot cable 2.
- [ ] Clear the SD card and format it as exFAT.
- [ ] Put the SD card back in the Teensy.
- [ ] Hot-glue the SD card in place. Get someone experienced to oversee this.
- [ ] Attach the L-brackets, foam side up, screws loose and not touching the foam.
- [ ] Put the Teensy card in slot 3, passing the cable through the side hole first.
- [ ] Attach the L-brackets to the structure.
- [ ] Zip-tie the Teensy cable to the back of the left metal rail, leaving some slack between the card and the zip tie.

**Sensor Card**
- [ ] Attach the L-brackets, foam side up, screws loose and not touching the foam.
- [ ] Put the Sensor Card in slot 4.
- [ ] Attach the L-brackets to the structure.

**Battery**
- [ ] Remove the four 1/8 in screws on the UFC top plate, and take the top plate off.
- [ ] Put the battery in the structure with its cable facing away from the backplane.
- [ ] Put the top plate back with the four 1/8 in screws, lined up with the key marks.

**Screw switch**
- [ ] Put the screw into the screw switch. Make sure the switch is off (screw not fully tightened).
- [ ] Attach the Y-tail to the screw switch and to the Power Card.
- [ ] Attach the battery to the Y-tail.

**Power-on check**
- [ ] Turn the screw switch on and check:
  - Every card signals it's in flight mode.
  - Every card's LEDs show it's running without errors.
  - The Teensy LED blinks white.
  - The Host Card buzzer beeps **three times** (normal startup).
- [ ] Turn the screw switch off.

## Post-flight readout

{: .important }
**Do not erase the data on the Host Card at SAC.**

- [ ] Unplug every XT connector between the battery and the Power Card.
- [ ] Cut the zip ties.
- [ ] Remove the hot glue from the sides of the cards.
- [ ] Unscrew all the card brackets.
- [ ] Take the Power Card off the backplane and put it back in the UFC box.
- [ ] Take the Host Card off the backplane.
- [ ] Set the Host Card switches:
  - **MODE** → On (word side)
  - **READ** → On (word side)
  - **ERASE** → **Off**
  - Fourth switch → Off
- [ ] On a second backplane, plug in the Host Card and two debug breakouts, in slots 1 and 4.
- [ ] With the programmer unplugged from the computer, connect 3.3 V and GND to debug breakout 1.
- [ ] Wire an FTDI serial cable to read pin DL#1:
  - Yellow FTDI wire (second from the outside, next to green) → DL#1 on debug breakout 4.
  - Black FTDI wire (ground, on the edge) → ground on debug breakout 4.
- [ ] Set up WINGS:
  1. Create a new flight.
  2. Go to the communication tab.
  3. Check the baud rate is **57600**.
  4. Click **addRfd**.
  5. In the **SerialPort 0 Device** dropdown, pick the first option.
- [ ] Connect the programmer to the computer to power the backplane. You should hear **two low tones**, and
      readout starts straight away.
  - No tones? Disconnect power and recheck the steps above.
  - Red light? ERASE is on. Disconnect power and flip ERASE to Off (number side).
- [ ] Check that the received packet count in WINGS is going up.
- [ ] Check that Host Card LED 1 is blinking.
- [ ] Wait until data stops arriving.

{: .check }
Two things in the original don't line up, and are copied as written. It connects 3.3 V and GND to debug breakout 1
but reads DL#1 from debug breakout 4. And for the switches, On is the word side and Off is the number side
everywhere except the Host Card erase steps, which say to flip back to "Off (word side)". Check against the
hardware if you ever need to run this.
