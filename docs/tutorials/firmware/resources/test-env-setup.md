---
layout: default
title: Testing Environment Setup
parent: Resources
grand_parent: Firmware
has_children: false
nav_exclude: false
permalink: /docs/tutorials/firmware/resources/test-env-setup/
---

# Testing Environment Setup

This guide walks through setting up the hardware, programming the board, and testing firmware on GYRO. It's mainly intended for new Firmware members, but can also be used as a reference for anyone who needs a refresher.

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

{: .warning }
GYRO is a $400 board. Make sure you're following the safety instructions to avoid damaging the board.

Before starting, download and setup [CoolTerm]({{ '/docs/tutorials/firmware/resources/coolterm/' | relative_url }}) if you haven't already. Leave the CoolTerm window open since we'll need it later.

## Gather your hardware

Before we start, make sure you have everything you need.

For general GYRO testing:
* GYRO board
* One 7.4V 2S LiPo battery
* Multimeter
* ST-LINK

If you're testing servos, you'll also need:
* Two servos (should already be connected to the board)
* A second 7.4 V (2S) LiPo battery

If someone's using both batteries, you can also use the power supply to power the board (ask the Firmware lead for help doing this).

## Board Setup
Connect the ST-LINK on the pads that are labeled `STLink1` on the board, with the smiley face facing up.

<img width="3024" height="4032" alt="IMG_2378" src="https://github.com/user-attachments/assets/e044b0a3-126b-4ad7-9eef-dc253082ea84" />

### Battery and Switch Configuration

GYRO uses two 7.4 V (2S) LiPo batteries to power the board and its components. Each battery has a separate power connection:

<img width="3024" height="1553" alt="IMG_2314" src="https://github.com/user-attachments/assets/c1f17982-eba0-4c32-a1d0-5b4dcb11a0c1" />

- **Battery 1:** Powers the board and all components except the servos
- **Battery 2:** Powers the servos

Each battery also has a corresponding screw switch:

- **SW1:** Controls power from Battery 1
- **SW2:** Controls power from Battery 2

The screw switches allow you to control whether the board and its components receive power when the batteries are connected.

<img width="1448" height="1086" alt="Annotated Green PCB and Connectors" src="https://github.com/user-attachments/assets/e6434be3-201f-4a46-b096-be322f40aa86" />

**If you're NOT testing servos**, set up the board as follows:

- Battery 1 should have a battery connector attached
- SW1 should be connected and screwed in
- Battery 2 should remain disconnected

<img width="4032" height="3024" alt="IMG_2386" src="https://github.com/user-attachments/assets/a0951bd6-5b01-4261-9a63-4c83bee6102e" />

**If you ARE testing servos**, set up the board as follows:

- Both battery terminals should have battery connectors attached
- SW1 and SW2 should be connected and screwed in
- Servos should be connected to PWM1 and PWM3

<img width="4032" height="3024" alt="IMG_2385 2" src="https://github.com/user-attachments/assets/839952e1-a51e-4bfd-94f2-c9b5b6984693" />

There should already be battery connectors attached to the board. If not, ask the Firmware lead to solder/get you one, or solder one yourself if you're comfortable doing so.

{: .important }
Make sure the batteries are disconnected while connecting or changing hardware.

### Check your batteries

Before plugging anything into the board, check that your batteries are charged.

1. Set your multimeter to DC voltage (V).
2. Connect the red probe to the battery's positive terminal (red wire).
3. Connect the black probe to the battery's negative terminal (black wire).
4. Verify that the voltage is between **7.4 V and 8.4 V**.

The general guideline is 7.4 V - 8.4 V, but a little over or under that range is fine. If the battery is severely under 7.4 V, the board may not get enough power and repeatedly reset or restart. If this happens, you MUST charge the battery.

<img width="3024" height="4032" alt="IMG_2318" src="https://github.com/user-attachments/assets/356577f3-44a8-4d50-a08f-fdfd05dfaeb6" />

{: .warning }
If a 2S LiPo battery measures below 5.0 V, do NOT attempt to charge or use it. Let the Firmware or Avionics lead know so the battery can be inspected and handled safely.

#### Battery charging instructions

1. Connect both connectors of the battery to the charger
<img width="3024" height="4032" alt="IMG_2419" src="https://github.com/user-attachments/assets/21c636b9-3a84-4c25-8839-daf5923b11b8" />
2. Make sure the charger is configured for a 2S LiPo battery with the correct charging mode and current (correct settings shown in image below)
<img width="3024" height="3043" alt="IMG_2417" src="https://github.com/user-attachments/assets/c028cb20-ba95-4ba3-b840-ac89a1619596" />
- Press START once to change battery charging settings
  <img width="3024" height="3043" alt="IMG_2417" src="https://github.com/user-attachments/assets/19c7b7f9-829e-4a6f-8852-abae7fe3bfc8" />
3. Hold START to begin charging
4. The charger will beep once charging is complete

If you're unfamiliar with the charger or unsure about the correct settings, ask the Firmware or Avionics lead before proceeding.

{: .important }
Never leave LiPo batteries charging unattended!

### Connect the batteries 

Before connecting your batteries, make sure the screw terminals are secure and the polarity is correct.

For general GYRO testing:
* Connect your battery to Battery 1

For servo testing:
* Connect a battery to Battery 2 **first**
* Connect a battery to Battery 1

If you're unsure which battery to use, where to connect it, or whether the battery connectors have the correct polarity, ask the Firmware lead before proceeding.

{: .important }
Always connect and disconnect batteries using the **battery connectors**, NOT the screw terminals on the board!

<table style="width: 100%; table-layout: fixed;">
  <tr>
    <th style="width: 50%;">Without Servos</th>
    <th style="width: 50%;">With Servos</th>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/54ac4fc0-06af-4933-94ef-a5d6cf59e134" style="width: 100%; height: auto;">
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/bb6f2598-46f7-40aa-94ff-8d54c56cba78" style="width: 100%; height: auto;">
    </td>
  </tr>
</table>

Once Battery 1 is connected and SW1 is enabled, the board should light up and emit a *pleasant* sound.

If it does, congratulations! Your board has power.

#### Ummm... the board's not turning on

If the board doesn't power on, check the following:

1. **Battery voltage:** Is the battery sufficiently charged?
2. **Battery connection:** Is the battery connected to Battery 1 rather than Battery 2?
3. **Screw switches:** Is SW1 properly connected and screwed in?
4. **Connections:** Are the battery connectors secure and correctly oriented?

{: .warning }
UNPLUG THE BATTERY BEFORE ADJUSTING ANY SCREW TERMINALS OR WIRES!
It's easy to accidentally short power and ground while adjusting connections, which can permanently damage the board or battery.

If everything looks correct and the board still doesn't turn on, ask the Firmware lead before trying anything else.

## Programming the Board

1. Select the GYRO project in STM32CubeIDE's Project Explorer

<img width="1512" height="948" alt="Screenshot 2026-11-12 at 6 49 51 PM" src="https://github.com/user-attachments/assets/e3081c3f-652c-43b6-a6c5-fa64a6205665" />

2. Right click the Build icon and select the correct build configuration (**Release** for normal testing or **Debug** for debugging)

<img width="1512" height="950" alt="Screenshot 2026-11-12 at 6 52 22 PM" src="https://github.com/user-attachments/assets/6de9a182-5fd0-481f-a519-3ae8b01ea46a" />

3. Build the project

<img width="1512" height="950" alt="Screenshot 2026-11-12 at 6 54 01 PM" src="https://github.com/user-attachments/assets/41e0add1-a7dc-4685-94c6-bdf2254c454d" />

4. Make sure the build completes without any errors (warnings are fine)

<img width="1511" height="950" alt="Screenshot 2026-11-12 at 6 55 13 PM" src="https://github.com/user-attachments/assets/1cc1693e-b5da-4c35-b272-fe04b694d81b" />

5. Click **Run** to program the board

<img width="1512" height="948" alt="Screenshot 2026-11-12 at 6 55 52 PM" src="https://github.com/user-attachments/assets/263d8a86-40da-44e7-8790-75e7664b170a" />

{: .note }
Make sure you're working on the correct branch and that your project contains the changes you want to test.

### Troubleshooting ST-LINK Errors

If STM32CubeIDE cannot connect to GYRO, check the error message.

#### No ST-LINK Detected

This usually means STM32CubeIDE cannot detect the ST-LINK.

1. Make sure the ST-LINK is connected to your computer
2. Try unplugging and reconnecting the ST-LINK
3. Check that your computer recognizes the ST-LINK

#### No Target Detected

This usually means the ST-LINK is detected but cannot communicate with the microcontroller.

1. Make sure Battery 1 is connected and SW1 is screwed in
2. Check that the ST-LINK is properly connected to `STLink1`
3. Verify that your project is configured for the correct microcontroller

{: .note }
If the error persists, ask the Firmware lead before changing any hardware connections.

## Verify Startup

Once programming is complete, the board should begin its startup sequence.

Depending on the firmware configuration, you may notice:

- LEDs flashing on the board during startup
- A _pleasant_ startup sound from the buzzer
- Both servos performing a calibration sweep if Battery 2 is connected
- Driver initialization messages appearing in CoolTerm

<div class="video-container">
  <video controls playsinline preload="metadata" style="width: 500px; max-width: 100%; height: auto;">
    <source src="{{ '/assets/videos/gyro-startup.mp4' | relative_url }}" type="video/mp4">
    Your browser does not support embedded video. You can <a href="{{ '/assets/videos/gyro-startup.mp4' | relative_url }}">open the video directly</a>.
  </video>
</div>

### Verify Driver Initialization

1. Verify that output from GYRO appears in CoolTerm
2. Check that all required drivers initialized successfully

{: .note}
If you're not seeing anything in CoolTerm, double-check that CoolTerm is connected and you have the [configuration settings](/docs/tutorials/firmware/resources/coolterm/#2-configuration-file) loaded into CoolTerm.

<img width="510" height="372" alt="Screenshot 2026-10-13 at 6 35 06 PM" src="https://github.com/user-attachments/assets/daa6ffed-c86c-4262-aa71-f63f23fa0e95" />

If any drivers fail to initialize, report the issue to the Firmware lead.

{: .note }
As of 11/12/26, `SDDriver` does not initialize successfully on GYRO Board 2. This is a known issue.

### Start Testing

The testing environment is now ready!

Type `help` into CoolTerm to view the available commands.

## After Testing

1. Disconnect the batteries using their **connectors**, NOT the screw terminals
2. Disconnect the ST-LINK
3. Put all equipment back where it belongs
4. Report any unexpected hardware or firmware behavior to the Firmware lead
