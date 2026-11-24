---
layout: default
title: BMS Dev Board Guidelines
parent: Resources
grand_parent: Firmware
has_children: false
nav_exclude: true
permalink: /docs/tutorials/firmware/resources/bms-guidelines/
---

# BMS Dev Board Guidelines

This is a guide for testing firmware on the Analog Devices [MAX17320X2EVKIT board](https://www.digikey.com/en/products/detail/analog-devices-inc-maxim-integrated/MAX17320X2EVKIT/12348923)

To use, connect the board to the battery using its balance port. For example, a 2S battery is connected like this: 
![[Battery 1.jpg]]

The position of jumpers J2 and J5 also matters depending on how many cells your battery has.
![[Jumpers 1.jpg]]

Below is a handy table for connection guides:

| Cells | Outer Black | Middle 1 | Middle 2 | Middle 3 | Outer Red |  J2  |  J5  |
| ----- | ----------- | -------- | -------- | -------- | --------- | ---- | ---- |
|  2S   |    BATTN    |    N/A   |  BATT2   |   N/A    |   BATTP   | 1-2  | 1-2  | 
|  3S   |    BATTN    |    N/A   |  BATT2   |  BATT3   |   BATTP   | 1-2  | OPEN |
|  4S   |    BATTN    |  BATT1   |  BATT2   |  BATT3   |   BATTP   | OPEN | OPEN |

Once you connect the battery, press the "S1 - PKWK" for the board to actually wake up. Now you're ready to read/write data off of it.

Connect SCL SDA and GND from your STM32 board/chip to the 3 corresponding connectors above the PKWK button. You can bend some jumpers to clamp them into there. I have just been using alligator clips because they feel more secure. 

Remember to do pull-up resistors for both lines. Flash the board with the firmware whenever that is finalized (insert link here). It should then initialize the board and output data through CoolTerm.

Analog Devices also have a Windows GUI app that communicates with the MAX17320 through the onboard USB-to-I2C adapter. This has basically all the settings and register data you could ever need, which is useful for checking whether your firmware is working correctly. It is available [here](https://www.analog.com/en/products/MAX17320.html) under Tools & Simulations as MAX17320 EV Kit Software. You just open up the app and connect your computer to the board using a micro USB cable. 

![[Pasted image 20261124170655.png]]

**NOTE**: Do **not** have this and the STM32 setup connected at the same time, as one of them would assume I2C master causing the other one to appear to not be working (either this or your code sucks idk).