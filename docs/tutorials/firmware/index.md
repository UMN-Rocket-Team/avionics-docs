---
layout: default
title: Firmware
parent: Tutorials
has_children: true
nav_order: 1
permalink: /docs/tutorials/firmware/
---

# Firmware Tutorials

<!--
  This page is BOTH a child of Tutorials (parent: Tutorials) AND a parent of its own
  tutorials (has_children: true). Just the Docs handles this three-level nesting fine —
  tutorial pages underneath just need parent: Firmware and grand_parent: Tutorials.
-->

Onboarding sequence for the Firmware subteam. Work through these roughly in order —
later tutorials assume you've completed the earlier ones.

## What you'll need

- Software / tools list (e.g. STM32CubeIDE, STMicro NUCLEO-L476RG board, Saleae, Logic 2)
- Any prerequisite knowledge

<!-- The tutorial list below this point is auto-generated from child pages. -->

## Challenges
- [Challenge 1 - LED on breadboard](#Challenge-1---LED-on-breadboard)
- [Challenge 2 - GPIO pins with STM32 using HAL](#Challenge-2---GPIO-pins-with-STM32-using-HAL)
- [Challenge 3 - SPI controller on STM32 using HAL](#Challenge-3---SPI-controller-on-STM32-using-HAL)
- [Challenge 4 - SPI communication with sensor breakout](#Challenge-4---SPI-communication-with-sensor-breakout)
- [Challenge 5 - Sensor Driver](#Challenge-5---Sensor-Driver)

In the Avionics subteam of the UMN Rocket Team, the main project that firmware works on is the Universal Flight Computer (UFC). If you are new to firmware and want to know more, keep in mind that your job will involve a lot of programming that is tightly associated with the hardware. For this reason, it is important to learn how to test and debug your code in the most efficient way. In general, we start small, by unit testing just a single component, be it a sensor or an LED, and we gradually expand to testing the entire system.

## Challenge 1 - LED on breadboard

In this first challenge we'll be setting up a simple circuit on a breadboard with a power source, LED, and resistor.

Here is a picture of the internal connections on the breadboard:

<img width="894" height="403" alt="Image" src="https://github.com/user-attachments/assets/bf8caf44-23c2-4d2c-9f82-d78965be56ad" />

As you can see, the pins aligned with the long red and blue lines are connected and usually used for power and ground, respectively. And the middle part is where you put the rest of your circuit.

#### Resistors

It's a pity that the Georg Ohm's parents left out the second e in his name, because he was one of the first electrical engineers. One of the things he said was that the voltage V across a resistor equals its resistance R times the current I that goes across it. Or $V = RI$, for short. 

Let's talk about this resistance R from the formula. Resistors are used to control how much current can go through a component given a certain voltage, so that they can function properly. If you connect an LED directly from ground to power, you will burn it. When using breadboards, we use resistors that look like this:

<img width="895" height="444" alt="Image" src="https://github.com/user-attachments/assets/c6f190c8-1224-4c52-aa3b-478728a87d41" />
[image source](https://morepcb.com/pcb-resistors)

As you can see, it has colored bands that indicate their value. Most of the resistors we have are 4-band<sup>[<a href = "https://en.wikipedia.org/wiki/Wikipedia:Citation_needed">citation needed</a>]</sup> so let's focus on those. Using the above image as a reference, let's imagine we want to get a 1500 Ohm(Ω) resistor. The first 2 digits are 1 and 5, so we will look for brown, then green bands. Since we want 1500, we must multiply 15 by 100, so the third band should be red. Finally, the last band is the error tolerance. If it is gold, for example, it means that the real resistance may be between 1500 ±5%, so somewhere between 1425 Ω and 1575 Ω.

### Lighting LED on a breadboard
An LED lights up when there is current going through it, so we need a source of power. Let's start by grabbing our development boards. We'll be using the STMicro NUCLEO-L476RG board, which have both 3.3V and 5V pins. There's actually more than one of each, but these ones are the ones that we'll be using.

<img width="704" height="814" alt="Image" src="https://github.com/user-attachments/assets/c2a5e142-ef8f-4be0-bfe5-bf1e30c00679" />

As you now know, LEDs cannot be connected directly to power, otherwise they will burn! So we will be using resistors. And yes, the resistance value will influence on how bright your LED will shine. If your LED is connected to a resistor that is too low, it will still burn, and if it is too high, you will barely see it lighting up. So what is the ideal value? Each color of LED has a different current limit, but it usually varies between 10 and 30 mA. Considering that we want to use the 3.3V power supply pin, if you do the math, resistors that have the multiplier band around the color brown should work. In this activity, let's use one that looks like this. Can you figure out what is its resistance?

<img width="894" height="670" alt="Image" src="https://github.com/user-attachments/assets/4c1a33ed-5168-43a6-95d8-344204a487c5" />

[image source](https://www.adafruit.com/product/2780)

<details> 
  <summary> Answer  </summary>
   If you answered 220 Ohms, that's correct.
</details>

Ok, now that we have all the materials we need, it's time to connect things together. Your circuit should look like this:

Top View | Side View | Circuit Diagram
:-------------------------:|:-------------------------:|:-------------------------:
<img width="441" height="630" alt="Image" src="https://github.com/user-attachments/assets/a5f0ef7a-13a1-4789-a1cf-9989d565a51a" /> | <img width="421" height="629" alt="Image" src="https://github.com/user-attachments/assets/c61575e5-61a9-4ef6-b3c9-0264789a4937" /> | <img width="489" height="652" alt="Image" src="https://github.com/user-attachments/assets/249c383e-4820-4d96-ae70-f7ae59abdfdf" />

Finally, connect the dev board to your computer and voilà! The LED is on!

#### Extras: aka "this LED is NOT on right now"
 - The most common reason is that the LED only works in one direction. Because it's a light emitting DIODE, the diode means that current can only go through it in one direction. So try switching it around! (Note: the resistor can be in either direction, since it is not a diode and has no polarity)
 - If it's still not ON, then check your connections. Remember the internal wiring on the breadboard. Make sure that a whole circuit is complete from POWER to LED to RESISTOR to GND, or from POWER to RESISTOR to LED to GND.
 - Another possible reason why you can't see it is that the resistor value is too high. That would mean that the LED is actually on but it's just really dim and hard to tell, so maybe try a resistance with lower value.
 - If after all of this it still isn't working, then it's MULTIMETER time. Use the multimeter to diagnose where the voltage difference stops existing. Maybe the STM board is broken and isn't outputting 3.3V like it's supposed to. Maybe the LED is burnt and so despite there being a voltage difference between the terminals of it, it can't turn on. The multimeter will tell you exactly where the problem is.
- Don't be afraid to ask for help!

Ok, now that you were able to turn the LED on, how about we control **when** to turn on and off? Let's attach a button or switch to our circuit! It should look like this:

Button Off | Button On | Circuit Diagram
:-------------------------:|:-------------------------:|:-------------------------:
<img width="399" height="566" alt="Image" src="https://github.com/user-attachments/assets/bc26bdef-394c-4aac-bacf-e5b3b81c714d" /> | <img width="377" height="574" alt="Image" src="https://github.com/user-attachments/assets/bb341d3b-3c9e-4830-a69e-220f49cdf5a7" /> | <img width="404" height="575" alt="Image" src="https://github.com/user-attachments/assets/d3f7b48f-a4d8-4e86-ad50-f04da9fe19ee" />

## Challenge 2 - GPIO pins with STM32 using HAL
This challenge assumes that you have a working LED breadboard from Challenge 1.

Now that you learned how to build a circuit in which you push a button to turn an LED on and off, how about we step up a bit? What if we control when to turn on and off using **code**? We'll first have to identify and utilise the GPIO pins on the STM.

#### GPIO Pins
GPIO stands for "General Purpose Input/Output". It just means that the pin doesn't have some specific purpose.

The GPIO pins on the STM are identified by their **PORT** (letter) and **PIN** (number). The PORT refers to a bank of (i think up to 16) pins. So an example is like pin A11, which is port A and pin 11.

Here's a picture labelling all of the pins on the NUCLEO-L476RG board because I guess STM didn't feel the need to put the labels on the board itself, we also have a physical wood board with this same picture:

<img width="655" height="528" alt="Image" src="https://github.com/user-attachments/assets/adf9152b-04bf-4e7f-8b84-b1d836f955b9" />
[image source](https://acassis.wordpress.com/2017/11/04/programming-the-nucleo-l476rg-with-openocd/)

So whatever pin you decide to use, note down the LETTER and the NUMBER, like for example the top left blue pin is labelled PC10, disregard the P, it's just C10.

### Now let's set up an STM project
In order to put programs on the NUCLEO board, we have to do it through [STM's IDE](https://www.st.com/en/development-tools/stm32cubeide.html#st-get-software). I hope you like eclipse and 1999 GUI styling. It's called STM32CubeIDE, and yet I have not encountered a single cube in the entire program.

All of my screenshots are in dark theme, which you can enable by doing Window >> Preferences >> Appearance. And Enable theming and switch it to Dark theme.

To create a project for the NUCLEO board, go to File >> New >> STM32 Project.\
After like 20 seconds, it'll pop up this wizard:\
Click the Board Selector

<img width="871" height="657" alt="Image" src="https://github.com/user-attachments/assets/4f60a5c1-a468-4006-95f7-fe7d349afdcb" />

Then type NUCLEO-L476RG into the Commercial Part Number

<img width="872" height="661" alt="Image" src="https://github.com/user-attachments/assets/39f34f6b-591a-47eb-90b6-b322a173eb5e" />

Make sure to click on the NUCLEO-L476RG to select it. Then the "Next >" button will become available.

<img width="873" height="658" alt="Image" src="https://github.com/user-attachments/assets/25e2e9a4-103e-4b28-98a5-2860ef147700" />

Give the project a name, and make sure to select C++ as targeted language. That's the language used in the UFC codebase, so we might as well use it here too.

<img width="467" height="515" alt="Image" src="https://github.com/user-attachments/assets/af339cb5-87cf-4d79-805b-31850be073d7" />

It might ask if you want to initialise all peripherals in default mode, and sure. I don't even know what that means but I just click yes.

Then it's going to pop up the ioc configuration.

<img width="869" height="605" alt="Image" src="https://github.com/user-attachments/assets/add000e3-b92c-4699-b6f5-67fc0437fbe1" />

We can go ahead and go to Connectivity >> USART2 and disable it (we won't be needing it for this project)

<img width="870" height="607" alt="Image" src="https://github.com/user-attachments/assets/a66ffcfe-b4d5-4a98-afb7-2e407f6ea7c4" />

Hey while we're here though, we can take a look at some of the pin allocations. So remember when I said that all the pins that started with P were good for GPIO. Well it looks like that was once again a lie! This diagram shows us that some of the pins are allocated for certain tasks.

<img width="566" height="544" alt="Image" src="https://github.com/user-attachments/assets/b88af155-50b4-4d63-a6d5-540b5ad56607" />

We can choose to deallocate some of these pins. For example, all the ones labelled in <span style="color:Yellow;">yellow 🟨</span> have their functionality already disabled. So we are safe to deallocate them. To do so, click on the pin and double click the thing that it is selected to.

<img width="568" height="545" alt="Image" src="https://github.com/user-attachments/assets/f551dc12-de3b-47a2-899c-ccfbf4c8e833" />

Some of the pins are <span style="color:Green;">green 🟩</span> though. That means they are actively being used. PC13 is used to detect when the blue user button is being pressed (something we'll use later in the code). PA5 is bound to the internal LED (on the board a little below the RESET button). PC14 and PC15 are used for an external clock which is a literal crystal that just happens to vibrate at exactly 32Khz (plz fact check idk anything about the crystal and i can't even verify if it exists on the boards we use). And finally PA13 and PA14 are used for Serial Wire debugging. This is used for the debugger in STM, and we want to eventually use that so we should keep these pins allocated. Make sure not to connect the LED to any pins that are already being used. So you can't use PC13, PC14, PC15, PA5, PA13, or PA14. Luckily there are still dozens to choose from.

Then click CTRL+S to save. It'll ask you if you want to generate code. And we do! It might make you login for this.

The file we'll be editing is the main.c file.

<img width="896" height="947" alt="Image" src="https://github.com/user-attachments/assets/71fe089d-6ae1-4b4b-a402-009accd1f64b" />

Yikes! That allman swirly brace, and that 2 space indent. It's fine, what we're looking at is the main() function of the entire program. When the NUCLEO board is programmed, this function will run every time you supply power to the board (and right after you program it). So to restart a program, you can simply unplug and plug in the board. The NUCLEO boards also have a RESET button, it's the black button on the right labelled RESET. Pressing this button will also run the main() function.

It looks like the main() function does four things:
- initialises the HAL
- initialises the system clock
- initialises GPIO pins
- enters a loop that never ends

What do these things mean?
- The HAL is the "Hardware Abstraction Layer" (no relation to its 9000 counterpart, don't worry). It makes things easier (usually) than manually setting register values or pin states. We'll be making use of a lot of HAL functions in these examples, and we also use them regularly in the UFC codebase, so it's worth getting to know your way around HAL.
- The system clock is used to keep track of time on the microcontroller, as well as to determine how fast instructions can execute. It can be configured via the ioc file, (this should be discussed in greater detail)

<img width="1356" height="917" alt="Image" src="https://github.com/user-attachments/assets/4942a31a-e6bf-4097-a8f1-d9f3d45cb66b" />

Here we can see that everything is 80MHz, so basically the clock on this microcontroller runs at 80MHz. Most PCs these days are 2.4GHz or more, so slightly more than our little computer here.
- The GPIO pins are what we're going to be using. Let's take a closer look at the GPIO initialisation code.

<img width="494" height="580" alt="Image" src="https://github.com/user-attachments/assets/f7dea6d1-15a6-49c2-b34c-9cd3b40688fa" />

Here it is (btw, if your Project Explorer ever goes away just double click one of the files like main.c at the top and it will come back).

So here we can see that we've enabled two clocks, GPIOC and GPIOA. We're also writing RESET to the LD2 pin. That's pin PA5, the internal LED. How did I know that? You can hold CTRL and click on LD2_Pin to see its definition.

<img width="312" height="559" alt="Image" src="https://github.com/user-attachments/assets/7611e214-2e0d-434f-8446-ac63d33d1e5f" />

LD2_GPIO_Port is set to GPIOA, and LD2_Pin is set to GPIO_PIN_5. That means A5 (specifically PA5, but the P is dropped in the code).\
Here we can also see the B1_Pin and port are bounded to PC13, that's the blue user button on the board. We'll see these pins both be set up in MX_GPIO_Init.

Now it's time to set up our LED pin (not to be confused with the internal LED pin). We'll need to initialise whichever pin we are connecting to the LED.\
I'll do my code example with PC10, that's the top left pin on the board (not including the top top of the board. That part can actually snap off as it is just a programmer, but please DO NOT SNAP IT OFF we need it).

So I want to set up PC10 just like they do with PA5.

<img width="441" height="498" alt="Image" src="https://github.com/user-attachments/assets/804a9019-c3ed-468c-87fd-8dd0d052cf78" />

So here I've put my Pin as GPIO_PIN_10, and the port as GPIOC. But what do all of these other fields mean?
- The Mode field refers to one of the many GPIO_mode options. There's stuff like Input, Output, Open Drain, Analog, Alternate Function. Yeah, I don't know what half of those mean either, but it doesn't matter. All we want is OUTPUT_PP, this means output push/pull. Because we want this pin to be an OUTPUT (from the controller) and able to both PUSH (push voltage & current through the pin) and PULL (drain voltage & current from the pin). So basically it can act as a POWER or GND pin, and we can set it however we like within the code! How neat is that!
- The Pull field refers to the default state of the pin. This really only applies when the controller starts up (I think), because once the pin is set (either HIGH or LOW), it will stay that way until it is set again.
- The Speed field refers to the "slew rate" of the pin. Basically, going from 3.3V to 0V doesn't happen instantly (although it is very fast). The slew rate is exactly how fast, well it's not very exact since the possible values are LOW, MEDIUM, HIGH, and VERY_HIGH. We don't need nanosecond precision for our LED so we'll keep it at LOW.

Lastly, we have to make sure that the clock is enabled. At the top of the MX_GPIO_Init function the clocks for GPIOC and GPIOA are enabled. But if you chose a pin from GPIOB, GPIOD, or GPIOH, it won't work unless those clocks are also enabled.

<img width="420" height="546" alt="Image" src="https://github.com/user-attachments/assets/d55e3c3d-87f8-4659-89cc-d32299a0c76e" />

Alright so we've successfully initialised our LED pin. Now how do we actually turn it on and off?

Let's go back to the main function and start editing that infinite loop.

We already saw the MX_GPIO_Init function do a write to the LED pin with HAL_GPIO_WritePin, so let's just use that for our LED.

<img width="392" height="140" alt="Image" src="https://github.com/user-attachments/assets/f5f35c61-7bf1-486a-9816-b86528446b75" />

So it's port C, pin 10, and we want it to SET the pin, which means to bring it HIGH.\
I want to run this program to ensure that it works before we bind the LED to the blue user button.

To run the program, click the green button in the top row. Make sure to save the main.c file first!

<img width="872" height="46" alt="Image" src="https://github.com/user-attachments/assets/fda33880-fbbd-4435-bbb5-2b119913fce4" />

Yeah I kind of hate these buttons and wish I could get rid of most of them, and you probably can I just don't know how.

Anyway, a window will pop up for configuration properties. I don't think we have to change anything here so we can just click OK

<img width="813" height="675" alt="Image" src="https://github.com/user-attachments/assets/234970d0-f0b2-4fa9-a56c-2de10f8f52d7" />

It might take a second to compile the program, there should be information on the status in the Console at the bottom. If you don't see a console go to Window >> Show View >> Console. But once it's done compiling and uploading, the LED should turn on!

<img width="404" height="575" alt="Image" src="https://github.com/user-attachments/assets/7fc97662-4fba-481a-9f65-1fcab20ad9fd" />
<img width="511" height="305" alt="Image" src="https://github.com/user-attachments/assets/a8aadd8e-b0c0-4d40-9bbe-8de2031094ce" />

#### Ayo this LED is NOT on
- Ensure that the program compiled and uploaded itself to the STM. The console will tell you if something went wrong.
- Make sure that you initialised and activated the right pin. Consult the chart and check the code and the pin to make sure they match
- Make sure your pin isn't used by anything else. You can check the ioc file to see if something else is allocated to the pin you chose
- Make sure your circuit still works by plugging the wire into the 3.3V pin instead of the GPIO one. If it turns on then it still works, otherwise the breadboard may be set up incorrectly.
- Don't be afraid to ask for help!

If the LED did turn on then you're good! You just coded an LED to turn on. We're literally computer engineering right now! But let's take this just one step further. I want to be able to control the LED using the blue user button on the NUCLEO board. For this we have to READ the state of the PC13 pin in order to determine the state of our LED pin.

Reading a pin's state works very similarly to writing. Instead of calling HAL_GPIO_WritePin, we call HAL_GPIO_ReadPin, and it will return either a GPIO_PIN_SET or GPIO_PIN_RESET.

So, in our infinite loop, we can read the value of pin C13, and use that to write SET or RESET to our LED pin.

<img width="440" height="164" alt="Image" src="https://github.com/user-attachments/assets/d116bc06-dd4b-488d-b66d-f21905784058" />

Now if we run this... hey the LED is turned on and i'm not pushing the button, and when I push the button it turns off.

STM decided to reverse the user button -> C13 wire. Instead of being SET when you are pushing the button, it gets RESET when the button is held down. So we have to switch the branches in our if statement.

<img width="437" height="164" alt="Image" src="https://github.com/user-attachments/assets/78073b93-3763-4f29-b85c-30216d9028c9" />

Button Off | Button On
:-------------------------:|:-------------------------:
<img width="386" height="556" alt="Image" src="https://github.com/user-attachments/assets/e1d90993-ff22-4c3f-8b8b-6c4cfc10c722" /> | <img width="380" height="559" alt="Image" src="https://github.com/user-attachments/assets/c28069fb-f8db-445a-bd1b-bb2334ee1c50" />

And voilà! The LED is controlled by the user button!

## Challenge 3 - SPI controller on STM32 using HAL
This is a continuation of the previous GPIO challenge. It's recommended you do everything in order as the challenges increase in complexity.

We're going to implement the SPI communication protocol on the STM32 NUCLEO board, but the natural first question is, what is SPI?

SPI stands for Serial Peripheral Interface, and unfortunately it is far from the only holder of this title. There's also USB, I²C, RS-232, RS-422, CAN, UART, USART, and many more. These are all different serial communication protocols, and some of them we use in the UFC codebase. SPI is used frequently on cards to communicate with sensors, flash memory, and the SD card. So it's an important one to learn.

SPI uses four principle wires to operate, these are:
- CS - Chip select
- CLK - the clock line
- COPI - Data from the controller to the peripheral (sometimes called MOSI)
- CIPO - Data from the peripheral to the controller (sometimes called MISO)

[Here](https://www.circuitbasics.com/basics-of-the-spi-communication-protocol/) is a website with a better explanation of SPI than I could write.

The basic idea is that the clock line pulses up and down very fast as the data is sent through one of the data wires. The data is synced to the clock, the peripheral looks for data on the COPI line and sends data via the CIPO line, likewise the controller looks for data on the CIPO line and sends data via the COPI line. The chip select is used if you have multiple peripherals connected to the same SPI bus. In that case, you would have as many chip select wires as you have peripheral devices, and they would share the CLK, COPI, and CIPO lines. We still need one chip select even if we just have one peripheral though, because that will determine when the peripheral "starts listening" to the other lines. In general the number of chip selects is equal to the number of peripherals you have connected to a given SPI bus.

We need to enable SPI on our project. Lets go back to our ioc file. It's near the bottom of the Project Explorer if you closed it.

<img width="871" height="624" alt="Image" src="https://github.com/user-attachments/assets/5dd6f6b9-ef8b-4aed-837e-ba35b69e411e" />

But oh no, what's this? There are THREE different SPIs? Don't worry, the number just refers to the pins that will be used. Lets just go with SPI2 (I originally thought SPI2 was used for the devboard last year but it turns out we used SPI3, so the COB SPI labels on the wood board will not be particularly helpful, sorry about that). Select "Full-Duplex Master"

<img width="869" height="604" alt="Image" src="https://github.com/user-attachments/assets/01b797c8-2501-43f9-8b86-ae505e666670" />

What does full duplex master mean? Full duplex means that both devices connected can send data to each other at the same time. Master refers to the Master->Slave relationship of SPI. Though we call it Controller->Peripheral these days, you still may see the terms Master and Slave for the two devices. We set up the NUCLEO board as the controller of the SPI communication.

Let's look at what pins were allocated for SPI2.

<img width="616" height="593" alt="Image" src="https://github.com/user-attachments/assets/b75c64d0-f881-440b-8772-721a0e4882d9" />

Here we can see that:
- PB10 became the SPI2_SCK, that's the clock
- PC2 became MISO, that's the CIPO, controller in peripheral out
- PC3 became MOSI, that's COPI, controller out peripheral in

But where's the Chip Select pin? STM didn't allocate it for us, so we'll have to do it ourselves. We can't do it here though, if you click on a pin you'll see there's no option for SPI2_CS, or anything of that sort. Instead we'll be setting up our Chip Select pin as a normal GPIO pin and manually pulling it down and pushing it back up before and after we do the SPI operation.

I think we're good to save now. We can generate the code. Btw if you ever want to apply code generation at any time use this button

<img width="871" height="46" alt="Image" src="https://github.com/user-attachments/assets/6226161b-f4a6-4006-8d6c-82b3123e7b1b" />

We'll notice some new variables and functions in our project... But before we address them, I want to address something else

<img width="452" height="519" alt="Image" src="https://github.com/user-attachments/assets/ed25e38c-a351-46ba-8fea-d77c571750b1" />

Generating the code got rid of my extra clock enables. Sure it added GPIOB enable, but my D and H were removed. That's because I didn't put them inside the
```
/* USER CODE BEGIN */
/* USER CODE END */
```
tags. Any code that you put outside of those comments will get removed after code generation, so make sure to patch up stuff that may have been removed. Luckily, in the UFC codebase we never use code generation, so you won't be having this problem regularly.

<img width="453" height="547" alt="Image" src="https://github.com/user-attachments/assets/ec1e2391-9b82-4111-9a72-59709ec59e87" />

Now let's address the new SPI functions. Somewhere in your code you'll find this function

<img width="443" height="512" alt="Image" src="https://github.com/user-attachments/assets/f9ad44a1-8819-4418-b64d-6fc212228761" />

It's the start of an initialisation of SPI, but it is incomplete. We'll have to initialise the pins ourselves (actually some pins are initialised in the msp file, but I am chosing to ignore msp files and functions because I have yet to find a compelling argument for their existence). But I want to go into what some of these settings do first. You can control click any of the fields or values to see what other options exist for them, that's generally a good way to understand what their function is.
- The Instance is what protocol your using. It's SPI2 because we picked SPI2 on the ioc.
- The Mode is one of MASTER or SLAVE, controller or peripheral. Because we want our board to be the SPI controller, it is set to SPI_MODE_MASTER
- The direction has to do with the two data lines. We want dedicated COPI and CIPO lines, so we set it to SPI_DIRECTION_2LINES. Other forms exist that use a single data line for both COPI and CIPO, or do other funky stuff.
- The DataSize is how many bits of data are sent at a time. It's set to 4BIT right now, but I think it will be more natural to change it to 8BIT, then we can count our reps in bytes instead of in half-bytes.

   <img width="430" height="504" alt="Image" src="https://github.com/user-attachments/assets/7a9b2d6c-8c6b-42f2-8367-2844fedf967b" />

- The CLKPolarity refers to the default state of the clock. If set to LOW, then the clock line is LOW when nothing is happening, if it's HIGH then the clock will be HIGH when it's not doing anything
- The CLKPhase determines whether bits are read on the rising or falling edge of the clock. The clock is a line that will go up and down rapidly, while the data lines will go up and down synced with the clock. But you can choose to sync on the rising (first) edge of the clock, or the falling (second) edge. They are not labelled RISING and FALLING though, because if you have your CLKPolarity set to HIGH, then they would have to be reversed, with 1EDGE referring to FALLING and 2EDGE with RISING. But for now, 1EDGE means on the RISING edge, and that's generally what we want.
- NSS is I'm not exactly sure. [Here](https://stackoverflow.com/questions/35780290/how-can-i-use-hardware-nss-spi-on-stm32f4) is a link to a stack overflow post about it. Apparently it's another kind of "enable" signal for SPI, and it can be implemented in software (SOFT) or as a pin in hardware (HARD_OUTPUT for controller or HARD_INPUT for peripheral)
- BaudRatePrescaler refers to the frequency of the CLK pin. It will always be a power of two quotient of the speed of the clock on the chip, which we saw earlier was 80MHz. So right now the prescaler is set to SPI_BAUDRATEPRESCALER_2, meaning that the frequency of the SPI_CLK line will be 40MHz, or 1 cycle every 25 nanoseconds. The rule is that the SPI clock's frequency will be the main clock / BaudRatePrescaler.
- FirstBit refers to the "endianness" of the communication. Whenever SPI is used to transmit or receive data, the data is in binary form, and encoded into a wire being either UP or DOWN. Take the sequence 01011001 for example. That's an 8-bit sequence that gets encoded as \_|‾|\_|‾‾|\_\_|‾ it goes 0 (low) then 1 (high) back to 0 (low) then 1 for 2 cycles, and then 0 for 2 cycles before back to 1. That's an example of MSB, or big endian, since the Most Significant Bit is sent FIRST (we assume it's being read left to right). The other option is to encode the same string of bits like this ‾|\_\_|‾‾|\_|‾|\_ so it's just reversed. A good way to think about it is in MSB mode, the sender is positioned to the RIGHT of the receiver, and is giving them data one at a time like this:

   [] <- [01011001]\
   [0] <- [1011001]\
   [01] <- [011001]\
   [010] <- [11001]\
   [0101] <- [1001]\
   [01011] <- [001]\
   [010110] <- [01]\
   [0101100] <- [1]\
   [01011001] <- []

   And there you go! Most Significant Bit. Here's the diagram for LSB:

   [01011001] -> []\
   [0101100] -> [1]\
   [010110] -> [01]\
   [01011] -> [001]\
   [0101] -> [1001]\
   [010] -> [11001]\
   [01] -> [011001]\
   [0] -> [1011001]\
   [] -> [01011001]\
   That's LSB.
- TIMode refers to idfk
- CRCCalculation, that's like error detection or something
- CRCPolynomial? What is this a lesson in error correcting curves? Galois died in a GUN DUEL at age 20 I literally outlived him what do you mean I have to learn about finite fields of prime powers.
- NSSPMode is something more to do with the NSS thing that I don't understand

TLDR: We didn't change anything except the DataSize is now 8bit instead of 4. Now we have to actually do the pin initialisations.

The pins get initialised in much the same way as we did for the GPIO. Only now, instead of GPIO_MODE_OUTPUT_PP, we need to tell HAL that we want these pins used for specific SPI purposes. Let's start with the CLK, that's pin B10.

<img width="356" height="170" alt="Image" src="https://github.com/user-attachments/assets/4bdcf663-8fda-483f-aa3f-2db8363e1f19" />

But what to set the Mode to? For this we'll have to consult, [The Datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf#page=88). Get used to the look of it, because you'll be seeing many more like it doing firmware. I've linked you straight to page 88 of the datasheet for the STM32L476xx series. There's only one in this series which is the STM32L476RG, which is what we're using. But what's this table on page 88. This is the Alternate Functions table. It tells you which pins support which "alternate functions". What that means is that only certain pins can be SPI clocks, and only certain pins can be COPI and CIPO. This table will tell you which pins can do what. Thing is, we already know what pins we're using. It's PB10, PC2, PC3, and some other GPIO pin for the Chip Select. But we are still going to use the table here to tell us exactly what Mode these pins allow. The Mode field itself only accepts values of GPIO_MODE, as can be seen in the struct declaration (CTRL+Click the .Mode)

<img width="742" height="258" alt="Image" src="https://github.com/user-attachments/assets/4829b6b3-9322-4fa1-ad3d-26551050bca7" />

But there's something else here that we've never seen before. A field called Alternate. That's the one we want. We can set the Mode to GPIO_MODE_AF_PP, this means we want to use this pin for an Alternate Function (AF) and we want it to be push/pull, like our LED pin. Then we can set the GPIO_InitStruct.Alternate field:

<img width="367" height="150" alt="Image" src="https://github.com/user-attachments/assets/34826bda-edf8-4a59-af97-05fada67065b" />

So let's look at the datasheet for PB10:

<img width="870" height="593" alt="Image" src="https://github.com/user-attachments/assets/f5409ee9-f5d1-43ba-a0e5-062f6cc6b3ce" />

We can see under AF5 it is registered as SPI2_CLK, exactly what we need. So we set the Alternate field to GPIO_AF5_SPI2. It will know to make it a clock because this pin cannot support COPI or CIPO.

<img width="362" height="151" alt="Image" src="https://github.com/user-attachments/assets/dc66a8b2-1648-4a79-a003-37e11f3ecb52" />

Addendum: The speed. This is a clock going at presumably 40MHz, which is pretty fast for a line to go up and down. Are we sure we shouldn't bump up the speed to at least a GPIO_SPEED_FREQ_MEDIUM? [Here](https://community.st.com/t5/stm32-mcus-products/i-would-like-to-know-about-the-4-gpio-speed-settings-on-the/td-p/56124) is a post with a table displaying the speed (in MHz and in ns) guarenteed by the different speed settings. Now granted, this is for a different chip, but the table is a bit startling. It indicates that even on speed 10 (10 equates to GPIO_SPEED_FREQ_HIGH), if the voltage difference is too high, it might not be able to keep up with 40MHz. Only speed 11 (GPIO_SPEED_FREQ_VERY_HIGH) is able to keep guarentee that it will be able to do it. Instead of making the frequency extremely high, my solution is just to increase the BaudRatePrescaler to slow down that SPI clock. This will make it much easier to see on the logic analyzer later, and we'll be able to keep our speed at GPIO_SPEED_FREQ_LOW. I'll set the BaudRatePrescaler to SPI_BAUDRATEPRESCALER_256 to really slow this clock down. Remember that the SPI clock frequency is the main clock frequency / BaudRatePrescaler. So, by setting it to 256, that should make the SPI clock run at 80/256, or 0.3125MHz, 312.5KHz. Easily within the range of every voltage difference of GPIO_SPEED_FREQ_LOW.

<img width="451" height="269" alt="Image" src="https://github.com/user-attachments/assets/b7112593-8c24-4a29-ba15-c5ff10880d5e" />

And that's the clock set up. We can repeat similar steps for the COPI and CIPO pins, they'll all be using GPIO_AF5_SPI2 as well.

<img width="377" height="364" alt="Image" src="https://github.com/user-attachments/assets/fa31d325-043a-49b0-819a-5864a4a9c6fc" />

Okay now let's pick our Chip Select pin. It can be any GPIO enabled pin, but for historical reasons I will choose PA11, as that's one used in development when we only had these devboards last year. We're going to set this one up as a normal GPIO pin, because HAL SPI does not have internal support for chip selects, we will manually be toggling them off and on. I'm choosing A11 for this.

<img width="382" height="444" alt="Image" src="https://github.com/user-attachments/assets/c2e083fb-140e-4565-b9de-6cf555cd0f42" />

We're almost done, there's just one last thing to do. Remember how we had to enable the clocks for the GPIO pins to work? Well SPI has its own clock within the microcontroller, so if we want anything to happen we have to enable that too.

<img width="464" height="556" alt="Image" src="https://github.com/user-attachments/assets/9884cd6d-01a1-42ca-a69f-7384ccc78077" />

And that's all the initialisation! Make sure that the project builds by clicking the "build" button.

<img width="871" height="51" alt="Image" src="https://github.com/user-attachments/assets/987cb638-7bc6-4ee7-b393-3f623bfdf5fa" />

Fix any compile errors, don't be afraid to ask for help!

Alright now let's try actually sending a byte of data over SPI. We're not actually going to be sending it to a peripheral device, but rather, we're going to capture the output using a very fancy oscilloscope called a logic analyzer.

<img width="1836" height="1744" alt="Image" src="https://github.com/user-attachments/assets/73ca6641-b19d-4643-ba06-b95da6101d80" />


Setting up the Saleae can be a little bit tricky, and there's more [software](https://www.saleae.com/pages/downloads) we have to get. This software 
is a lot more modern and pleasant to use than STM's IDE though, so that's a plus.

After getting the software and opening it, you'll be greeted by this screen:

<img width="871" height="579" alt="Image" src="https://github.com/user-attachments/assets/1d7336c6-8fd2-4f57-95ff-a3295df3189e" />

The Saleae uses a micro USB to USB-A cable. When you plug it in to your computer with the Saleae software running, it should show a green light after around 10 seconds.

<img width="1836" height="2143" alt="Image" src="https://github.com/user-attachments/assets/0937fdaf-d79d-437b-b7a9-e239c0d1c214" />

And the software should update too:

<img width="870" height="584" alt="Image" src="https://github.com/user-attachments/assets/b89ce282-b76b-495b-a2a6-ba14256a58ee" />

By clicking on Devices on the right sidebar, we can see and reconfigure the Saleae's probes:

<img width="872" height="577" alt="Image" src="https://github.com/user-attachments/assets/4261f030-53ad-4758-afd1-17383acc1ea2" />

Here we can see that it has configured probes 0 and 1 to be both digital and analog. But before we reconfigure them, we should actually plug the probes into the saleae.

<img width="1836" height="1884" alt="Image" src="https://github.com/user-attachments/assets/6f7af104-2827-4e27-80cf-3cb94c126760" />

Now it may seem obvious where this goes, but it's important to get this part right. The saleae probes have only one orientation that it will work in. Specifically, this one I have with the yellow, green, blue, and purple probes MUST go into slots 4, 5, 6, and 7 of the saleae. Additionally the black GND (ground) wires must be at the BOTTOM, like this:

<img width="927" height="948" alt="Image" src="https://github.com/user-attachments/assets/f1413816-2542-4f88-b785-3840f2763952" />

These number labels are on the back of the saleae:

<img width="1836" height="2660" alt="Image" src="https://github.com/user-attachments/assets/43fc867d-fe2e-46a2-9f12-62665142581c" />

There is another set of probes that are black, brown, red, and orange. Those would go in slots 0, 1, 2, and 3. Here's what the saleae looks like with all its probes attached:

<img width="1836" height="1820" alt="Image" src="https://github.com/user-attachments/assets/fd245ce8-1876-456a-aade-4410fd48ced8" />

We will only need four of these for SPI though, because SPI only uses four wires.\
Now we can configure the Saleae software. I'm going to turn on the 4, 5, 6, and 7 probes as DIGITAL.

<img width="869" height="584" alt="Image" src="https://github.com/user-attachments/assets/a016e5f0-c06d-4cdb-9bc5-e2d4a6354769" />

I'm also going to set the MS/s to 20. This is Megasamples per second, how often the saleae polls the pin it is connected to. 50 is very fast and not necessary. Additionally, sometimes the saleae is unable to keep up if the rate is too high and just stops recording. So we'll set it to 20 to avoid that issue.

<img width="873" height="585" alt="Image" src="https://github.com/user-attachments/assets/8d169ef4-56d0-4d27-82a6-b7558e6df0fd" />

I want to rename these channels as well to reflect what we'll be using them for.

<img width="872" height="580" alt="Image" src="https://github.com/user-attachments/assets/ff35d741-d05b-4b2d-874c-ffe5a5092d62" />

Then we can set the trigger settings: Enable Trigger on the right and set the Pattern and Channel to CLK:

<img width="874" height="580" alt="Image" src="https://github.com/user-attachments/assets/4612b945-191b-4c87-9bc2-d69e4c5c262c" />

The trigger setting tells the Saleae when to start recording. Basically when it notices the CLK line change it will start recording and stop after 1 second (configurable by "Capture duration after trigger"). I chose the CLK line because the CS line will go up when the STM starts up, and that would trigger the recording when we don't want it to.

The last thing we can do with the Saleae is set up an analyzer. The analyzer tab is right below the Devices one on the right sidebar.

<img width="872" height="585" alt="Image" src="https://github.com/user-attachments/assets/ea4b40db-f388-4afd-83e9-3d0df578b3e8" />

Click on the plus to make a new analyzer. We want the SPI analyzer.

<img width="871" height="580" alt="Image" src="https://github.com/user-attachments/assets/1ddb1ac6-eb19-454d-a030-71d50b98c168" />

Then a window will pop up allowing you to configure the settings. The only things we want to change is the channels for each line. Set the accordingly

<img width="873" height="587" alt="Image" src="https://github.com/user-attachments/assets/4d8d4191-bd2d-4bc1-a522-91d31e980a9f" />

Now we can record whenenver by hitting the blue play button:

<img width="870" height="578" alt="Image" src="https://github.com/user-attachments/assets/d089ecfc-8e1b-4fc2-b9e9-b410f17b39bd" />

We still have to connect the physical probes to the correct pins on the STM. Remember what pins were used for which purposes:
- PA11: Chip select (chosen by me), yellow saleae wire
- PB10: Clock (SPI2), green saleae wire
- PC3: COPI (SPI2), blue saleae wire
- PC2: CIPO (SPI2), purple saleae wire

So now we just have to find those pins and connect the appropriate saleae wires to them.

<img width="1836" height="1911" alt="Image" src="https://github.com/user-attachments/assets/6257a742-2e70-4e65-98dc-193f94d8a998" />

And we need to find a GND pin to connect the Saleae GND to. I chose this one:

<img width="1836" height="2026" alt="Image" src="https://github.com/user-attachments/assets/8b3db3a5-0520-4239-bb14-6d706ce8a40a" />

Our saleae setup is complete!

#### Now how do we do a SPI communication?
In the SPI protocol, the chip select is held LOW to activate the peripheral. Then the clock moves rapidly while data is transferred on either the CIPO or COPI lines.

In the code, that involves manually setting the chip select pin LOW and then calling HAL_SPI_Transmit() with a pointer to our data.

Before we set the chip select pin LOW though, it needs to be HIGH. So before the while() loop I will add this line of code:

<img width="412" height="255" alt="Image" src="https://github.com/user-attachments/assets/688a348c-d09b-41ed-a3dd-1b89bee6b54d" />

And then we can transmit with SPI in the while loop:

<img width="464" height="267" alt="Image" src="https://github.com/user-attachments/assets/85f2c602-97f0-4cf2-a5fb-57b2a16fb14c" />

So what's happening here?\
First, I'm making an array of four bytes.\
Then I'm setting the chip select LOW.\
Then I'm calling the magic function, let's take a look at this more (ctrl + click it!)

<img width="785" height="340" alt="Image" src="https://github.com/user-attachments/assets/914bde71-3639-4270-87da-ddf4737efa7b" />

We are going to go into how it works, because it's a little bit out of the scope of this tutorial and not necessary to know how to use it.\
Instead we're focused on what arguments it requires and what they do.

The first argument is SPI_HandleTypeDef *hspi. This is a pointer to the thing that we set up in the MX_SPI2_Init() function. So I pass in the address of hspi2 that we set up all the settings for. It is declared as a global variable at the top of the main.c file.

The second argument is a pointer to the data you want to send over SPI. So that array of four bytes is my data so I passed in that.

The third argument is the number of bytes long the data is. Because this is C, arrays are just pointers and don't have a length, you need to tell the function how long the array is so it knows when it has ended.

The last argument is a timeout in milliseconds. It dictates how long the SPI transaction can last. If the timeout expires before all of the data is finished being sent then the function will abort and cut off the rest of the data. Typically it does not take very long to send data over SPI, so putting it at 100ms will ensure that there is enough time.

After the Transmit function I put the chip select back to HIGH and wait 1 millisecond before doing another SPI transmission.

Now lets run the code and see if the SPI data can be seen on the saleae.

The sequence of events is:
- Program the STM board
- Start recording on the saleae (blue play button)
- Wait 1 second

<img width="874" height="579" alt="Image" src="https://github.com/user-attachments/assets/0c22d965-7830-42cd-8ca8-a7f4b26de1b1" />

You should see something like this. If you don't, then there could be a myriad of reasons why. Here are a few.
- Check your Saleae connections and ensure they are connected to the same pins that you set up in your code.
- Make sure the saleae's probes are set up in the correct place
- Make sure the Saleae has a ground connection
- Make sure the HAL_SPI_Transmit() function is within the while(1) loop in your code.
- Don't be afraid to ask for help!

Let's zoom in on this capture (scroll wheel):

<img width="870" height="582" alt="Image" src="https://github.com/user-attachments/assets/b71d24f7-807f-473f-bd2f-610902e27f97" />

At this zoom level, we can see one of these transmissions taking place every 2ms. But we only put a delay for 1ms, what gives?\
Ctrl+Clicking on the HAL_Delay() function will give us the answer.

<img width="362" height="225" alt="Image" src="https://github.com/user-attachments/assets/5d2140bf-9a18-4df8-abb8-9c8cfc89ca34" />

The function is putting extra time on our delay "to guaranty minimum wait". I don't even know what this is, why they spelled guarantee like that, or what the purpose of this is. I'm going to comment it out.

<img width="350" height="225" alt="Image" src="https://github.com/user-attachments/assets/58698b9e-932a-49f8-b74e-aecb8389f1b1" />

Now we can reprogram the STM and rerun the saleae

<img width="871" height="580" alt="Image" src="https://github.com/user-attachments/assets/31334533-0cbd-42e7-99c3-5f9d20494561" />

That looks better. Finally we can zoom in on one of these transmissions and verify that the correct data was being sent.

<img width="872" height="582" alt="Image" src="https://github.com/user-attachments/assets/a4ac06aa-af9e-4e33-acc8-96d5e06b1daa" />

0xA71021C5

#### Some notes on SPI
We're only seeing the COPI line broadcasting data. The CIPO line is for a peripheral response, and we have not connected a peripheral to the STM. So we're essentially just screaming 0xA71021C5 into the void with no one to hear it (except the saleae). In the next tutorial we are going to hook these SPI lines up to a peripheral device and start having two way communication.

## Challenge 4 - SPI communication with sensor breakout

For this challenge we will be focusing on the [Low G Accelerometer](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf) used on the sensor card of the UFC. This sensor has a SPI interface that we will make use of to obtain the acceleration data as well as to change settings. I've linked you to the full 67 page [datasheet](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf) for this sensor, but along the tutorial I'll be highlighting the important parts that we'll need to know for this challenge.

Okay! The first thing to do is set up the hardware. You'll need a breakout for the sensor like this:

<img width="426" height="708" alt="Image" src="https://github.com/user-attachments/assets/a6db45b2-20f4-4cb8-beda-c642278671db" />



<img width="245" height="266" alt="Image" src="https://github.com/user-attachments/assets/b3cc520a-2b5c-40f7-9d90-8af703cc8bfa" />

There are a lot of pin connections here, but we only have to worry about six of them.

7 - GND (ground, black)\
6 - 3.3v (power, red)\
5 - SPI_COPI (SDI, serial data in, blue)\
4 - SPI_CIPO (SDO, serial data out, purple)\
3 - SPI_SCK (clock, green)\
2 - SPI_CS (chip select, yellow)

We'll need to connect these wires to the corresponding ones on the STM32.

<img width="405" height="564" alt="Image" src="https://github.com/user-attachments/assets/3f83684a-26e2-46cb-9fbd-218e5da519bb" />
<img width="869" height="708" alt="Image" src="https://github.com/user-attachments/assets/08f2cb21-8575-4ffe-9c12-51962b93173f" />

I'm also going to connect some header pins so that we can use the saleae on this circuit.

<img width="390" height="486" alt="Image" src="https://github.com/user-attachments/assets/b00b2b01-b420-40b7-9078-7bd0c53411a0" />

Now let's turn on the STM and make sure that all the connections are wired properly.

<img width="355" height="475" alt="Image" src="https://github.com/user-attachments/assets/36ef6af6-7522-44cd-86cd-f07a81e8a8aa" />

Upon turning the STM on, you should notice the green light on the breakout board turn on. If not, check your power and ground connections.\
If you start a saleae capture, you should also see the same 0xA71021C5 being sent over the wire.

<img width="870" height="420" alt="Image" src="https://github.com/user-attachments/assets/691881b1-b05d-480c-9ff4-bac91a6358a5" />

But now there's something new on the CIPO line. It's not anything useful because 0xA71021C5 is not a command that the sensor understands, but we can construct a request over SPI to get the sensor to respond in a way that we want.

Here's a segment from page 30 of the LIS2DW12 [datasheet](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf#page=30). It details how to do a register read over SPI.

<img width="757" height="458" alt="Image" src="https://github.com/user-attachments/assets/719810b8-3def-45a6-8a90-4ec8513b3436" />

And here on page 33 we can find the register address table.

<img width="661" height="831" alt="Image" src="https://github.com/user-attachments/assets/e0903420-46e9-45dc-bf87-0ae58bf09cd4" />

Lets start out by reading the WHO_AM_I register (0x0F). If we go to page 35 we can see more information

<img width="648" height="147" alt="Image" src="https://github.com/user-attachments/assets/bee07c0d-cedb-4e70-989a-82e2931a4e8d" />

This register is supposed to have a value of 0x44.

So let's set up a framework for sending and receiving one byte of data over SPI. We'll change our code from the last tutorial to support both sending and receiving.

<img width="474" height="264" alt="Image" src="https://github.com/user-attachments/assets/19c3fdec-7776-412d-879b-868af051da13" />

Here I have a 1 byte spiInput buffer as well as a 1 byte spiOutput buffer. We'll be sending the spiInput to the sensor using the HAL_SPI_Transmit function and then receiving the response through the HAL_SPI_Receive function. Now we just have to figure out what to send to get the value of the WHO_AM_I register.

Recall on page 30 the steps for reading using SPI. We have to SET the MSB (most significant bit) and fill the remaining 7 bits with the address of the register we want to read. So since we're trying to read address 0x0F, we need to send 0x0F augmented with the most significant bit set.

It helps to write the address in binary. 0x0F translates to 0b00001111, so in order to set the MSB, we just have to change it to 0b10001111. That translates back to 0x8F in hex.

So let's set our spiInput to 0x8F.

<img width="471" height="268" alt="Image" src="https://github.com/user-attachments/assets/2d9b2210-54ee-49be-b331-3fb0518c4361" />

Now let's run the code and check the saleae to see the results.

<img width="870" height="418" alt="Image" src="https://github.com/user-attachments/assets/56089442-883a-4c0e-81e8-99374179b128" />

Now this is a promising result, but there is something strange happening. We are sending 0x8F and receiving 0x44 like we should, but it also looks like we are SENDING 0x44 during the period when we receive it. It's also a little strange that the both the COPI and CIPO lines are held high the whole time that we are not sending it anything. Let's investigate these mysteries.

To understand why we are sending a 0x44 while we receive it, it helps to look into the code of the HAL_SPI_Receive function.

<img width="791" height="337" alt="Image" src="https://github.com/user-attachments/assets/39c7cba3-2336-4600-93e1-2208a0e7de05" />

Here we can find the answer. The HAL_SPI_Receive actually just calls HAL_SPI_TransmitReceive with the receive buffer as the transmit buffer. That means that whatever happens to be in spiOutput when we call HAL_SPI_Receive is sent over the COPI line while we do the receive. We don't need to be sending anything so we can just set that to zero.

<img width="478" height="266" alt="Image" src="https://github.com/user-attachments/assets/434d483e-f40d-4ebf-be69-1704af900867" />

Now if we run the code again we see zero during the receive period.

<img width="870" height="415" alt="Image" src="https://github.com/user-attachments/assets/e606221d-f416-410c-87ee-75ebafadeddb" />

So that mystery has been solved. But why are both data lines high during the idle period? To be fair, this doesn't really matter because the state of the COPI and CIPO lines are not relevant unless the chip select is down and the clock is moving, but it is at least nice to understand what is causing them to idle high.

The answer to the CIPO line can be found on page 4 of the LIS2DW12 datasheet:

<img width="577" height="445" alt="Image" src="https://github.com/user-attachments/assets/bc40b262-f32b-4cac-9c3b-099a94fafcf5" />

The SDO line (CIPO) is set to be pulled up, meaning it idles high. So that's nice to know. But what about the COPI line? That one is controlled by the STM32, so the answer lies there.

And to be honest with you, I could not find it. I looked around and googled around but I can't find a satisfying answer for why the COPI line goes back to being high after receiving. I guess that's just a mystery that will remain unsolved.

But we accomplished what we wanted to, we successfully read the WHO_AM_I register from the sensor! But before we consider the challenge complete, I want to extend some of the functionality of our code. Right now we've hardcoded the register read to be the WHO_AM_I register, but what if instead we created a function that could read arbitrary registers from the sensor.

<img width="597" height="560" alt="Image" src="https://github.com/user-attachments/assets/5bf3d931-ae02-42a7-8e24-9f7fe70b6405" />

Here I've started defining a function that can read any register from the sensor.

<img width="592" height="185" alt="Image" src="https://github.com/user-attachments/assets/38cb6f88-cc02-4826-9c5d-2ad6e76ce8e0" />

Most of this code is just copied from what we had in the main loop. But the key difference is that instead of hardcoding the spiInput to 0x8F, we take the register address and OR it with 0x80. This will ensure that the MSB is SET (since 0x80 decomposes to 0b10000000, and the OR function will SET the 1s but not RESET to 0s).

Now we can replace our main loop with a call to this function:

<img width="476" height="227" alt="Image" src="https://github.com/user-attachments/assets/03d2a34f-e0e1-46bb-88d0-afe08f362b14" />

Now to verify that this is working, I'm going to use the debugger functionality of the STM IDE. This debugger is extremely useful for figuring out what code is doing and finding where something is going wrong. Let's edit the debug configurations:

<img width="215" height="127" alt="Image" src="https://github.com/user-attachments/assets/1793149d-0a23-42d6-a72f-49ba988650f9" />

Here we're going to make separate debug and release configurations. The advantage of this is that the debug configuration is good for running the code in debug mode, it compiles the code in a way that the debugger can understand and step through. The release configuration will compile the code for speed. It will make the code run faster but at the cost of the ability to debug it. We have a configuration GPIOTest Debug.

<img width="872" height="549" alt="Image" src="https://github.com/user-attachments/assets/866d9b1a-8c90-4e14-b48e-fdbabe1ec46d" />

But let's edit this, we want the Build Configuration to be "Debug", and we also want to Enable auto build.

<img width="869" height="546" alt="Image" src="https://github.com/user-attachments/assets/2ca42579-a007-4801-81ce-49f4e4132a5a" />

remember to hit Apply!

Now let's make a Release configuration:

<img width="872" height="548" alt="Image" src="https://github.com/user-attachments/assets/caebc217-4118-41b3-aeed-8ff4a830d275" />

This one will use the Release build configuration

<img width="872" height="549" alt="Image" src="https://github.com/user-attachments/assets/46ff6687-5b86-4f42-9a9d-baf1c0c266b4" />

It's also important to set the C/C++ Application as Release/GPIOTest.elf

Okay, time to debug!

<img width="216" height="126" alt="Image" src="https://github.com/user-attachments/assets/adeacf25-7555-4119-a944-451b8837f5a8" />

When you debug, the startup sequence will take a while, but eventually it will drop you at the beginning of the main() function.

<img width="646" height="556" alt="Image" src="https://github.com/user-attachments/assets/28614bfa-f760-4e5d-822f-8ea43490fc26" />

There are a panel of buttons at the top that allow you to move through the code.

<img width="192" height="32" alt="Image" src="https://github.com/user-attachments/assets/c53e5a9e-806e-469b-8f75-0b6bfdb65066" />

<img width="243" height="57" alt="Image" src="https://github.com/user-attachments/assets/660e2e3d-f7f1-4719-9e78-386232d64db0" />

The "Step Over" button will go to the next line\
"Step Into" will go into a function call\
"Resume" will advance to the next breakpoint.

To create a breakpoint, double click to the left of a line number. Let's put one on the function call.

<img width="494" height="227" alt="Image" src="https://github.com/user-attachments/assets/bb0bc945-2116-4201-876d-6871e0023438" />

Then let's hit "Resume"

<img width="872" height="576" alt="Image" src="https://github.com/user-attachments/assets/0cb7eb59-9c49-4ec1-be4a-1813401b84de" />

Right now we are just about to execute the readRegister function. The "Variables" tab in the debugger is showing whoami as 0x0 (I changed it to hex by right clicking it and selecting Number Format -> Hex). If you don't see the "Variables" tab you can enable it with Window -> Show View -> Variables.

Now we can hit "Step Over".

<img width="873" height="584" alt="Image" src="https://github.com/user-attachments/assets/a821f823-430f-4062-9827-d1abcf6918e7" />

We can see the whoami variable has updated to 0x44. So that means that it worked!

## Challenge 5 - Sensor Driver

The sensor driver is the ultimate goal of these challenges. Drivers like these are used all across the UFC for communicating with a myriad of different peripheral devices.

Drivers make use of [classes in C++](https://www.w3schools.com/cpp/cpp_classes.asp). A class encapsulates the functionality of a driver into a package that can be easily used by other parts of the code. It's good when doing high-level design to always think about what the express purpose of your code is. In the case of a sensor driver there is a very clear purpose: Get the data from the sensor. The sensor produces data, we want to extract that data, and the driver is what we use to do it.

So let's start by creating the class. We'll do it in a new file.

<img width="845" height="640" alt="Image" src="https://github.com/user-attachments/assets/d406b0f8-b3e7-4143-94df-8763367cc91b" />

We're going to create what's called a "Header file". This is a C/C++ convention that declares classes and functions.

<img width="507" height="411" alt="Image" src="https://github.com/user-attachments/assets/08a9afbc-70db-4298-a5b5-19dd0e568f89" />

The UFC codebase generally uses a separate file to declare each class, and the name of the file is the name of the class declared within. So for this file we'll call it Sensor_Driver.h and put a class called Sensor_Driver in it.

At the top of the file, we put #includes to other files that we'll be using. In this case we need the "stm32l4xx_hal.h" file, which is where those HAL_SPI functions come from.

<img width="555" height="279" alt="Image" src="https://github.com/user-attachments/assets/1113149e-8be3-4e41-be72-381119234d50" />

The STM IDE also automatically generates this include guard, this #ifndef statement at the top ensures that this file can't be #included twice in a file.

The next thing that we generally do is put a bunch of macros for addresses we use in the class. I've gathered the relevant ones from page 33 of the [datasheet](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf)

<img width="558" height="551" alt="Image" src="https://github.com/user-attachments/assets/7cb6af06-32b3-426e-a713-43d54448eb1c" />

Now we can define our class. I'm actually going to use a "struct" instead of a class, but they do the same thing in C++. The reason I use a struct is because everything in a struct is public, whereas everything in a class is private. I like things to be public so that I can access all the fields (class variables) and methods (class functions) from anywhere else in the code.

<img width="557" height="611" alt="Image" src="https://github.com/user-attachments/assets/df8694cf-b978-4fb6-98d3-5ebca0b29971" />

The header file is a place to map out the skeleton of the class, not to actually write the code for it. This is because in order for the binary to be linked correctly after being compiled, there can only exist one instance of the code to avoid namespace collisions. But the #ifndef guard was supposed to already take care of that! Well it only works for #including the file multiple times **within one file**. So when the compiler goes to compile ALL of the source files, if you have a #include "Sensor_Driver.h" in multiple source files then the include guard won't work as you expect. The linker will get mad at you for multiple definitions. This is a little bit annoying but we have to deal with it, so headers are reserved for _declarations_ not definitions.

With that said, we now need to determine what kinds of fields and methods to declare in this class. This is subject to the designer of the class, but given our ultimate goal (reading data from the sensor), I would say we don't actually need any fields. The only thing that we _really need_ is a single function that "gets the data from the sensor". But there are multiple steps to that process. The first two functions I'll declare will be almost universal to all classes in the UFC, these are the init and deinit functions for the class.

<img width="547" height="640" alt="Image" src="https://github.com/user-attachments/assets/9cceb70c-9362-462a-8f09-fa6d14c30c91" />

The init and deinit functions are for doing the business that's done in the MX_SPI2_Init function (and Deinit, if it existed) in the main.c file. We move that code to the relevant class to keep things organised. Now we can define what I call the _interface_ methods.

<img width="436" height="122" alt="Image" src="https://github.com/user-attachments/assets/6a5c8ffd-3981-437a-8db8-9abb2494b378" />

There is just the one readAccel function. This function just reads the acceleration value from the sensors and outputs the data into three floats (passed in). I also specify that the output will be in m/s^2.

But in order to just "get the data from the sensor", we have a number of steps we'll go through. That's where the third category of methods come in, the _internal_ methods.

<img width="458" height="212" alt="Image" src="https://github.com/user-attachments/assets/7ea2adeb-15ca-41aa-b5c1-8fb41a6be556" />

These internal methods outline the steps for getting the data from the sensor. We need to read the raw data, which requires reading from registers on the sensor. Then convert the raw uint16 data into m/s^2. The writeRegister will be used in the init() function to configure the sensor with certain parameters.

The last thing I like to do is includes a global instance of the driver, so that any file that #includes this sensor driver will have access to one. Because there isn't really a need to make multiple drivers.

<img width="445" height="605" alt="Image" src="https://github.com/user-attachments/assets/07b346e1-abd7-4a0f-96c2-9a43075a95f4" />

In order to prevent this instance of the class from being defined multiple times, we define it as "extern", which _declares_ it rather than instantiates/defines it. We'll create the real instance in the source file, which we can finally start!

<img width="551" height="545" alt="Image" src="https://github.com/user-attachments/assets/7a3a28c6-2129-4457-8668-9f6d2de2e72e" />

So I've created Sensor_Driver.cpp and filled it with definitions of all those methods we declared in the header. Now we just need to put in the code, and luckily, we have already written some of it!

We can repurpose this MX_SPI2_Init function from main.c to be our driver's init function. So I'll just copy and paste it in.

<img width="464" height="614" alt="Image" src="https://github.com/user-attachments/assets/7cc01e01-83be-4f79-a5f7-27fba74fae03" />

Ahh, I've just realised. The hspi2 which was previous defined as a global at the top of the main.c file is not accessible to our source file here. So I suppose there is a reason to have a field in this class. We can go back to the header and define it.

<img width="452" height="284" alt="Image" src="https://github.com/user-attachments/assets/5e4105c6-ba0c-4431-a7e2-7202450ce620" />

<img width="500" height="354" alt="Image" src="https://github.com/user-attachments/assets/0af7246b-5710-4004-9b96-9716b14d60fb" />

The other thing we don't have access to is this Error_Handler() function, which runs if the HAL_SPI_Init function fails. In the real UFC codebase, we have a UFC_ECODE type (UFC Error Code) that is used to indicate failures like this, but since this driver is in a separate project, I'll just remove the check for now.

<img width="448" height="271" alt="Image" src="https://github.com/user-attachments/assets/d2b1bb3a-4fe3-4056-9f8b-8fa016642fab" />

There are also a few other things we want to do in the initialisation sequence that have to do with the sensor itself. This is where it really helps to comb through the datasheet. Luckily someone else has already done that work for us, but when it comes to making new drivers this is something that you'll just have to figure out. We'll be changing the values of CTRL registers on the sensor, specifically CTRL2, CTRL1, CTRL3, and CTRL6. The relevant page numbers on the datasheet are 38, 36, 39, and 42.

<img width="874" height="245" alt="Image" src="https://github.com/user-attachments/assets/ff7a26a8-5571-421f-bc0b-f832536b5ba9" />

Yeah this code is a little complex. But for the most part it is just a series of writeRegister commands to enable different settings on the sensor. There is that loop section, which keeps track of the "boot process" status. We enable the "boot bit" in CTRL2 (the most significant bit) and wait for the boot process to be complete (which is indicated by the boot bit being set back to 0). So that's what the loop does. We also have a maximum read attempts of 10000 to avoid getting into an endless loop. It's important to have timeout cases for any looping code, because we never want to get stuck in an endless loop as it will essentially crash the entire flight computer. I'd encourage you to read more about these configuration settings in the datasheet of the sensor.

The deinit function is much simpler. We just disable the SPI2 clock, deinit SPI, and deinitialise all the pins with HAL_GPIO_DeInit.

<img width="232" height="85" alt="Image" src="https://github.com/user-attachments/assets/2e5022c7-7345-4a31-b6c5-8ea19c5e8172" />

I think next we'll focus on the read and write register functions. We have already written a readRegister function in the main.c file, so we just have to port it over and modify it slightly.

<img width="548" height="145" alt="Image" src="https://github.com/user-attachments/assets/ceec72ed-47fe-4d81-ba07-109eefa2f38e" />

The reason we don't simply return the output is because in the real codebase we return a UFC_ECODE, so I leave it as void in this example to better match that.

Then, the write register sequence is very similar. Page 31 of the datasheet says that the MSB must be a zero, which it already will always be in the case of a valid register address.

<img width="543" height="101" alt="Image" src="https://github.com/user-attachments/assets/57a501a1-c8fc-476b-8420-7e0f5eaf03d7" />

Remember to do two Transmits!

Now we can write the readRawAccel function. This function will read the registers that actually contain the acceleration data. These are specified on pages 44 and 45 of the datasheet.

<img width="915" height="213" alt="Image" src="https://github.com/user-attachments/assets/9d03bd0f-2bc1-4301-b29d-45a36550327d" />

This function also gets slightly involved. The two main reasons are that the there are six associated registers comprising 16-bit values for each acceleration axis, and that there's a DRDY flag (data ready) that is triggered when the data is ready to read. So the first thing we do is pull the status register until that flag is RESET, then we read the data from the six registers.

In order to complete the conversion function, we once again look to the datasheet. Page 6 specifies the conversion values under the "Sensitivity" section. This conversion factor only gets us to mg (milli-gs) though, so in order to convert to m/s^2 we have to do a little bit of extra math.

<img width="916" height="47" alt="Image" src="https://github.com/user-attachments/assets/a876e9e3-c6eb-4295-99bd-20339298fa15" />

Since this function has no error case, it returns the converted value directly.

We're finally ready to throw everything together to create our readAccel function - the one that actually matters. The readAccel function will be the primary function used by other code from this driver, and now we have all the pieces we need to construct it.

<img width="389" height="133" alt="Image" src="https://github.com/user-attachments/assets/fcf774bb-860b-4c60-8c22-b0a56684ac56" />

There we go! We should make sure this builds. For some reason the compiler is getting mad at my readRegister function spiInput[1] = {regAddress | 0x80} so I altered it slightly.

<img width="562" height="161" alt="Image" src="https://github.com/user-attachments/assets/b15d9907-9309-4e1f-b90b-0723c795d911" />

idk why it got upset though. We should probably also tie this in to the main file and function.

<img width="418" height="613" alt="Image" src="https://github.com/user-attachments/assets/626847ea-e0d5-4e3b-89dd-39c547484576" />

We gotta rename the main.c to main.cpp for it to work, because we just made a C++ class.

Then I've just removed the readRegister function from before as well as the MX_SPI2_Init function. And I've rewritten the main function to this:

<img width="516" height="590" alt="Image" src="https://github.com/user-attachments/assets/21d6719c-2a0b-4ad2-8c64-0d68ff8c49e6" />

Actually it makes sense to move this HAL_GPIO_WritePin(GPIOA, GPIO_PIN_11, GPIO_PIN_SET) call to inside the Sensor_Driver::init() function. So I will also do that.

<img width="684" height="647" alt="Image" src="https://github.com/user-attachments/assets/9b390e8c-e0bb-409d-8bab-c535ef78ca74" />

Now we can actually try running this to see if it works.

I've run the debugger once again and put a breakpoint on the readAccel function:

<img width="915" height="474" alt="Image" src="https://github.com/user-attachments/assets/0289efcc-351b-4ed4-bc57-5ce44d67f257" />

And a simple way to test the functionality is just by using the "Resume" button and shaking the sensor in real time while you do this. The result of the "accel" variable in the variables tab should be changing. And if you don't move the sensor, the values should be at or around zero. It's not the best method of testing, but without the interface tools of the UFC codebase we are limited in what tools we have.

Another way of doing tests is by using the saleae to see if the spi lines are acting correctly.

<img width="746" height="482" alt="Image" src="https://github.com/user-attachments/assets/acb63dbb-b365-46df-b714-c9807b284634" />

<img width="917" height="476" alt="Image" src="https://github.com/user-attachments/assets/890b9a17-7064-4760-bdf6-400ddff5ad5b" />