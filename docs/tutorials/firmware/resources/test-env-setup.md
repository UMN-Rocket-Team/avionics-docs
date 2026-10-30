---
layout: default
title: Testing Environment Setup
parent: Resources
has_children: false
nav_exclude: false
permalink: /docs/tutorials/firmware/resources/test-env-setup/
---

# Testing Environment Setup

Download and setup [CoolTerm](/docs/tutorials/firmware/resources/coolterm/) if not done already. Leave the CoolTerm window open. We're going to need this later.

Now we're going to setup the hardware.

## GYRO

### Gather your hardware

Before we start, make sure you have everything you need.

For general GYRO testing:
* GYRO board
* One 7.4V 2S LiPo battery
* Multimeter
* ST-LINK

If you're testing servos, you'll also need:
* Two servos (should already be connected to the board)
* A second 7.4V 2S LiPo battery

### Connect the ST-LINK
Put the ST-LINK on the pads that are labeled STLink1. Make sure the smiley face is facing up.

### Connect the additional hardware
Before connecting any batteries, make sure all additional hardware is connected.

If you're NOT testing servos, you can skip the servo setup and move on to connecting the battery.

If you're testing servos, make sure the servos are connected to PWM 1 and PWM 3 on the board.

{: .note }
Make sure the batteries are disconnected while connecting or changing hardware.

### Check your batteries

Before plugging anything into the board, check that your batteries are charged.

1. Turn your multimeter to DC voltage (V).
2. Connect the red probe to the battery's positive terminal (red wire).
3. Connect the black probe to the battery's negative terminal (black wire).
4. Check the voltage.

For this setup, the batteries should not be below 7.4V.

If a battery is below 7.4V, use the battery charger.

1. Connect both connects of the battery to the charger.
2. Make sure the charger is configured for a 2S LiPo battery with the correct charging mode and current.
3. Hold START to begin charging.
4. The charger will beep once charging is complete.

### Connect the batteries 

Before connecting your batteries, make sure the screw terminals are secure and the polarity is correct.

For general GYRO testing:
* Connect your battery to Battery 1.

For servo testing:
* Connect your first battery to Battery 1.
* Connect your second battery to Battery 2.

{: .note }
There should already be battery connectors attached to the board. If not, ask the Firmware lead to solder/get you one, or solder one yourself if you're comfortable doing so.

{: .important }
Double-check with the Firmware, Hardware, or Avionics lead if you're not sure which battery to use or where to plug it in. It's better to ask than to fry a $400 board.

Once Battery 1 is connected, the board should light up and emit a _pleasant_ sound.

If it does, congratulations! Your board has power.

#### Ummm... the board's not turning on
<details>
  <summary>Is your battery charged?</summary>
  <p>Use a multimeter to check the voltage. If it's too low, charge it.</p>
</details>

<details>
  <summary>Are the screw terminals screwed in?</summary>
  <p>Make sure the wires aren't loose.</p>
</details>

<details>
  <summary>Is your battery connected to the wrong terminal?</summary>
  <p>If you're not using the servos, double-check that you're connected to Battery 1, not Battery 2.</p>
</details>

{: .warning }
UNPLUG THE BATTERY BEFORE ADJUSTING ANY SCREW TERMINALS OR WIRES.
It's really easy for the PWR and GND wires to touch while making adjustments, and that's how you get magic smoke.

If everything looks correct and the board still won't turn on, ask the Firmware lead before trying anything else.

{: .note}
If you're GNC, you can skip the next section. If the board isn't showing output in CoolTerm or you need it programmed, ask the Firmware lead to program it for you. It's _much_ faster than setting up the IDE.

### Program the Board (Firmware Only)

Go to your IDE project.

Build the project in **Release** mode.

Click the run button.

{: .note}
Make sure ST-LINK is connected to your computer otherwise it'll give a error that says that "ST-LINK is not connected".

You'll know it's programming by the flashing of LEDs on the board, dashes on the IDE icon, or the sound coming from it.

Quickly go to your CoolTerm window and a message will pop up if everything is set up correctly.

{: .note}
If you're not seeing anything in CoolTerm, double-check that you have the [configuration settings](/docs/tutorials/firmware/resources/coolterm/#2-configuration-file) loaded into CoolTerm.
