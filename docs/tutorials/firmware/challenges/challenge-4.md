---
layout: default
title: "Challenge 4: SPI Controller on STM32 using HAL"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-4/
---

# Challenge 4: SPI Controller on STM32 using HAL
This is a continuation of the previous GPIO challenge. It's recommended you do everything in order as the challenges increase in complexity.

#### What you'll need

- Software: STM32CubeIDE, Logic 2 (Saleae)
- Hardware: STM32L4, Saleae

We're going to implement the SPI communication protocol on the STM32 NUCLEO board, but the natural first question is, what is SPI?

SPI stands for Serial Peripheral Interface, and unfortunately it is far from the only holder of this title. There's also USB, I²C, RS-232, RS-422, CAN, UART, USART, and many more. These are all different serial communication protocols, and some of them we use in the UFC codebase. SPI is used frequently on cards to communicate with sensors, flash memory, and the SD card. So it's an important one to learn.

SPI uses four principle wires to operate, these are:
- CS - Chip select
- CLK - the clock line
- COPI - Data from the controller to the peripheral (sometimes called MOSI)
- CIPO - Data from the peripheral to the controller (sometimes called MISO)

[Here](https://www.circuitbasics.com/basics-of-the-spi-communication-protocol/) is a website with a better explanation of SPI than I could write.

The basic idea is that the clock line pulses up and down very fast as the data is sent through one of the data wires. The data is synced to the clock, the peripheral looks for data on the COPI line and sends data via the CIPO line, likewise the controller looks for data on the CIPO line and sends data via the COPI line. The chip select is used if you have multiple peripherals connected to the same SPI bus. In that case, you would have as many chip select wires as you have peripheral devices, and they would share the CLK, COPI, and CIPO lines. We still need one chip select even if we just have one peripheral though, because that will determine when the peripheral "starts listening" to the other lines. In general the number of chip selects is equal to the number of peripherals you have connected to a given SPI bus.

We need to enable SPI on our project. Lets go back to our .ioc file. It's in CubeMX if you closed it.

<img width="1267" height="702" alt="Screenshot 2026-10-05 at 1 48 35 AM" src="https://github.com/user-attachments/assets/f9252a66-5d72-4a49-ab00-3e532d6c9bc5" />

But oh no, what's this? There are THREE different SPIs? Don't worry, the number just refers to the pins that will be used. Lets just go with SPI2 (I originally thought SPI2 was used for the devboard last year but it turns out we used SPI3, so the COB SPI labels on the wood board will not be particularly helpful, sorry about that). Select "Full-Duplex Master".

<img width="1512" height="949" alt="Screenshot 2026-10-05 at 1 49 32 AM" src="https://github.com/user-attachments/assets/a061850b-7706-4dba-b68e-76543d1ef46f" />

What does full duplex master mean? Full duplex means that both devices connected can send data to each other at the same time. Master refers to the Master->Slave relationship of SPI. Though we call it Controller->Peripheral these days, you still may see the terms Master and Slave for the two devices. We set up the NUCLEO board as the controller of the SPI communication.

Wait a minute. Why are the SPI pins green? They are <span style="color: green;">green 🟩</span> because they are actively being used.

Let's look at what pins were allocated for SPI2.

<img width="580" height="533" alt="Screenshot 2026-10-05 at 1 50 19 AM" src="https://github.com/user-attachments/assets/92a2695f-466f-471c-8827-33dca0b31622" />

Here we can see that:
- PB10 became the SPI2_SCK, that's the clock
- PC2 became MISO, that's the CIPO, controller in peripheral out
- PC3 became MOSI, that's COPI, controller out peripheral in

But where's the Chip Select pin? STM didn't allocate it for us, so we'll have to do it ourselves. We can't do it here though, if you click on a pin you'll see there's no option for SPI2_CS, or anything of that sort. Instead we'll be setting up our Chip Select pin as a normal GPIO pin and manually pulling it down and pushing it back up before and after we do the SPI operation.

I think we're good to save now. We can generate the code in CubeMX. Btw if you ever want to apply code generation at any time use this button

<img width="1511" height="948" alt="Screenshot 2026-10-05 at 1 52 32 AM" src="https://github.com/user-attachments/assets/2bf57931-ecef-41e0-a78a-485cca3e1bcf" />

We'll notice some new variables and functions in our project... But before we address them, I want to address something else

<img width="852" height="819" alt="Screenshot 2026-10-05 at 2 36 02 AM" src="https://github.com/user-attachments/assets/b9a33f1c-bffb-49f4-bd48-c0f263ec6097" />

Generating the code got rid of my extra GPIOD clock enable. That's because I didn't put them inside the
```
/* USER CODE BEGIN */
/* USER CODE END */
```
tags. Any code that you put outside of those comments will get removed after code generation, so make sure to patch up stuff that may have been removed. Luckily, in the UFC codebase we never use code generation, so you won't be having this problem regularly.

<img width="839" height="819" alt="Screenshot 2026-10-05 at 2 37 00 AM" src="https://github.com/user-attachments/assets/6d991543-7329-41c6-905f-8c7e717179b0" />

Now let's address the new SPI functions. Somewhere in your code you'll find this function

<img width="472" height="481" alt="Screenshot 2026-10-05 at 2 11 15 AM" src="https://github.com/user-attachments/assets/9707d67a-254a-41f0-a2aa-c4c063b6f94c" />

It's the start of an initialization of SPI, but it is incomplete. We'll have to initialize the pins ourselves (actually some pins are initialized in the msp file, but I am chosing to ignore msp files and functions because I have yet to find a compelling argument for their existence). But I want to go into what some of these settings do first. You can control click any of the fields or values to see what other options exist for them, that's generally a good way to understand what their function is.
- The Instance is what protocol your using. It's SPI2 because we picked SPI2 on the ioc.
- The Mode is one of MASTER or SLAVE, controller or peripheral. Because we want our board to be the SPI controller, it is set to SPI_MODE_MASTER
- The direction has to do with the two data lines. We want dedicated COPI and CIPO lines, so we set it to SPI_DIRECTION_2LINES. Other forms exist that use a single data line for both COPI and CIPO, or do other funky stuff.
- The DataSize is how many bits of data are sent at a time. It's set to 4BIT right now, but I think it will be more natural to change it to 8BIT, then we can count our reps in bytes instead of in half-bytes.

   <img width="788" height="819" alt="Screenshot 2026-10-05 at 2 35 03 AM" src="https://github.com/user-attachments/assets/f684f61f-e6af-4f30-9bda-fca059a17ad7" />

- The CLKPolarity refers to the default state of the clock. If set to LOW, then the clock line is LOW when nothing is happening, if it's HIGH then the clock will be HIGH when it's not doing anything
- The CLKPhase determines whether bits are read on the rising or falling edge of the clock. The clock is a line that will go up and down rapidly, while the data lines will go up and down synced with the clock. But you can choose to sync on the rising (first) edge of the clock, or the falling (second) edge. They are not labelled RISING and FALLING though, because if you have your CLKPolarity set to HIGH, then they would have to be reversed, with 1EDGE referring to FALLING and 2EDGE with RISING. But for now, 1EDGE means on the RISING edge, and that's generally what we want.
- NSS is I'm not exactly sure. [Here](https://stackoverflow.com/questions/35780290/how-can-i-use-hardware-nss-spi-on-stm32f4) is a link to a stack overflow post about it. Apparently it's another kind of "enable" signal for SPI, and it can be implemented in software (SOFT) or as a pin in hardware (HARD_OUTPUT for controller or HARD_INPUT for peripheral)
- BaudRatePrescaler refers to the frequency of the CLK pin. It will always be a power of two quotient of the speed of the clock on the chip, which we saw earlier was 80MHz. So right now the prescaler is set to SPI_BAUDRATEPRESCALER_2, meaning that the frequency of the SPI_CLK line will be 40MHz, or 1 cycle every 25 nanoseconds. The rule is that the SPI clock's frequency will be the main clock / BaudRatePrescaler.
- FirstBit refers to the "endianness" of the communication. Whenever SPI is used to transmit or receive data, the data is in binary form, and encoded into a wire being either UP or DOWN. Take the sequence 01011001 for example. That's an 8-bit sequence that gets encoded as `_|‾|_|‾‾|__|‾` it goes 0 (low) then 1 (high) back to 0 (low) then 1 for 2 cycles,  0 for 2 cycles before back to 1. That's an example of MSB, or big endian, since the Most Significant Bit is sent FIRST (we assume it's being read left to right). The other option is to encode the same string of bits like this `‾|__|‾‾|_|‾|_` so it's just reversed. A good way to think about it is in MSB mode, the sender is positioned to the RIGHT of the receiver, and is giving them data one at a time like this:

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

TLDR: We didn't change anything except the DataSize is now 8bit instead of 4. Now we have to actually do the pin initializations.

The pins get initialized in much the same way as we did for the GPIO. Only now, instead of GPIO_MODE_OUTPUT_PP, we need to tell HAL that we want these pins used for specific SPI purposes. Let's start with the CLK, that's pin B10.

<img width="376" height="157" alt="Screenshot 2026-10-05 at 2 24 06 AM" src="https://github.com/user-attachments/assets/37b72531-8a53-44d7-98e8-3bbfe335b0f6" />

But what to set the Mode to? For this we'll have to consult, [The Datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf#page=88). Get used to the look of it, because you'll be seeing many more like it doing firmware. I've linked you straight to page 88 of the datasheet for the STM32L476xx series. There's only one in this series which is the STM32L476RG, which is what we're using. But what's this table on page 88. This is the Alternate Functions table. It tells you which pins support which "alternate functions". What that means is that only certain pins can be SPI clocks, and only certain pins can be COPI and CIPO. This table will tell you which pins can do what. Thing is, we already know what pins we're using. It's PB10, PC2, PC3, and some other GPIO pin for the Chip Select. But we are still going to use the table here to tell us exactly what Mode these pins allow. The Mode field itself only accepts values of GPIO_MODE, as can be seen in the struct declaration (CTRL+Click the .Mode)

<img width="972" height="335" alt="Screenshot 2026-09-28 at 10 30 40 PM" src="https://github.com/user-attachments/assets/11c45423-4f14-4739-a2f0-64db204f2854" />

But there's something else here that we've never seen before. A field called Alternate. That's the one we want. We can set the Mode to GPIO_MODE_AF_PP, this means we want to use this pin for an Alternate Function (AF) and we want it to be push/pull, like our LED pin. Then we can set the GPIO_InitStruct.Alternate field:

<img width="378" height="171" alt="Screenshot 2026-10-05 at 2 25 16 AM" src="https://github.com/user-attachments/assets/16da0bb6-df0e-490f-a7fb-9c0ef9498051" />

So let's look at the datasheet for PB10:

<img width="948" height="647" alt="Screenshot 2026-09-28 at 10 31 33 PM" src="https://github.com/user-attachments/assets/4632ff23-ef36-48eb-be7f-f89e8d3d550a" />

We can see under AF5 it is registered as SPI2_CLK, exactly what we need. So we set the Alternate field to GPIO_AF5_SPI2. It will know to make it a clock because this pin cannot support COPI or CIPO.

<img width="375" height="169" alt="Screenshot 2026-10-05 at 2 25 56 AM" src="https://github.com/user-attachments/assets/30573b08-4c67-4a6b-9ee7-f357871a6e31" />

Addendum: The speed. This is a clock going at presumably 40MHz, which is pretty fast for a line to go up and down. Are we sure we shouldn't bump up the speed to at least a GPIO_SPEED_FREQ_MEDIUM? [Here](https://community.st.com/t5/stm32-mcus-products/i-would-like-to-know-about-the-4-gpio-speed-settings-on-the/td-p/56124) is a post with a table displaying the speed (in MHz and in ns) guarenteed by the different speed settings. Now granted, this is for a different chip, but the table is a bit startling. It indicates that even on speed 10 (10 equates to GPIO_SPEED_FREQ_HIGH), if the voltage difference is too high, it might not be able to keep up with 40MHz. Only speed 11 (GPIO_SPEED_FREQ_VERY_HIGH) is able to keep guarentee that it will be able to do it. Instead of making the frequency extremely high, my solution is just to increase the BaudRatePrescaler to slow down that SPI clock. This will make it much easier to see on the logic analyzer later, and we'll be able to keep our speed at GPIO_SPEED_FREQ_LOW. I'll set the BaudRatePrescaler to SPI_BAUDRATEPRESCALER_256 to really slow this clock down. Remember that the SPI clock frequency is the main clock frequency / BaudRatePrescaler. So, by setting it to 256, that should make the SPI clock run at 80/256, or 0.3125MHz, 312.5KHz. Easily within the range of every voltage difference of GPIO_SPEED_FREQ_LOW.

<img width="477" height="253" alt="Screenshot 2026-10-05 at 2 17 43 AM" src="https://github.com/user-attachments/assets/81ab9b7b-616f-43d0-a003-3c3742a6e329" />

And that's the clock set up. We can repeat similar steps for the COPI and CIPO pins, they'll all be using GPIO_AF5_SPI2 as well.

<img width="383" height="369" alt="Screenshot 2026-10-05 at 2 28 15 AM" src="https://github.com/user-attachments/assets/686689b3-01f3-4815-b0a6-91dfa7c5dfd2" />

Okay now let's pick our Chip Select pin. It can be any GPIO enabled pin, but for historical reasons I will choose PA11, as that's one used in development when we only had these devboards last year. We're going to set this one up as a normal GPIO pin, because HAL SPI does not have internal support for chip selects, we will manually be toggling them off and on. I'm choosing A11 for this.

<img width="383" height="440" alt="Screenshot 2026-10-05 at 2 30 09 AM" src="https://github.com/user-attachments/assets/88b2df9a-c1ef-4b44-98b1-3e354efe75d4" />

We're almost done, there's just one last thing to do. Remember how we had to enable the clocks for the GPIO pins to work? Well SPI has its own clock within the microcontroller, so if we want anything to happen we have to enable that too.

<img width="468" height="408" alt="Screenshot 2026-10-05 at 2 30 50 AM" src="https://github.com/user-attachments/assets/8433bb1d-1b15-4532-be56-fffbb7c906f9" />

And that's all the initialization! Make sure that the project builds by clicking the "build" button.

<img width="891" height="26" alt="Screenshot 2026-10-05 at 2 32 06 AM" src="https://github.com/user-attachments/assets/1aa3415f-3a3f-4c5e-baf4-5f4cdcac137d" />

Fix any compile errors, don't be afraid to ask for help!

Alright now let's try actually sending a byte of data over SPI. We're not actually going to be sending it to a peripheral device, but rather, we're going to capture the output using a very fancy oscilloscope called a logic analyzer.

<img width="698" height="657" alt="Screenshot 2026-09-28 at 10 35 41 PM" src="https://github.com/user-attachments/assets/a64453fa-5dd1-40a6-9571-4c951516725a" />

Setting up the Saleae can be a little bit tricky, and there's more [software](https://www.Saleae.com/pages/downloads) we have to get. This software 
is a lot more modern and pleasant to use than STM's IDE though, so that's a plus.

After getting the software and opening it, you'll be greeted by this screen:

<img width="934" height="627" alt="Screenshot 2026-09-28 at 10 36 28 PM" src="https://github.com/user-attachments/assets/24c368fd-0a7c-4f77-9b0d-8a301e632ce9" />

The Saleae uses a micro USB to USB-A cable. When you plug it in to your computer with the Saleae software running, it should show a green light after around 10 seconds.

<img width="568" height="655" alt="Screenshot 2026-09-28 at 10 37 42 PM" src="https://github.com/user-attachments/assets/860faace-b86d-4b28-a7f0-dabe15e605d3" />

And the software should update too:

<img width="1024" height="687" alt="Screenshot 2026-09-28 at 10 38 47 PM" src="https://github.com/user-attachments/assets/dc180431-294a-49e0-b13e-0ebf4f2f0f75" />

By clicking on Devices on the right sidebar, we can see and reconfigure the Saleae's probes:

<img width="1025" height="682" alt="Screenshot 2026-09-28 at 10 39 10 PM" src="https://github.com/user-attachments/assets/20729387-a385-4eee-b1bf-62a3f0bb19cd" />

Here we can see that it has configured probes 0 and 1 to be both digital and analog. But before we reconfigure them, we should actually plug the probes into the Saleae.

<img width="608" height="623" alt="Screenshot 2026-09-28 at 10 39 35 PM" src="https://github.com/user-attachments/assets/c8ee439f-e9c5-4251-be3e-e6a2067d0ecb" />

Now it may seem obvious where this goes, but it's important to get this part right. The Saleae probes have only one orientation that it will work in. Specifically, this one I have with the yellow, green, blue, and purple probes MUST go into slots 4, 5, 6, and 7 of the Saleae. Additionally the black GND (ground) wires must be at the BOTTOM, like this:

<img width="597" height="521" alt="Screenshot 2026-09-28 at 10 39 57 PM" src="https://github.com/user-attachments/assets/c709d156-42cb-4470-90a8-7e8830e1427e" />

These number labels are on the back of the Saleae:

<img width="611" height="656" alt="Screenshot 2026-09-28 at 10 40 21 PM" src="https://github.com/user-attachments/assets/c8386784-d624-49e0-a571-e15553476eee" />

There is another set of probes that are black, brown, red, and orange. Those would go in slots 0, 1, 2, and 3. Here's what the Saleae looks like with all its probes attached:

<img width="608" height="447" alt="Screenshot 2026-09-28 at 10 40 40 PM" src="https://github.com/user-attachments/assets/013de83a-5748-4679-af66-f4bf03c358f8" />

We will only need four of these for SPI though, because SPI only uses four wires.\
Now we can configure the Saleae software. I'm going to turn on the 4, 5, 6, and 7 probes as DIGITAL.

<img width="977" height="655" alt="Screenshot 2026-09-28 at 10 41 20 PM" src="https://github.com/user-attachments/assets/a0a8a427-b538-476e-ba45-1b20e531a878" />

I'm also going to set the MS/s to 20. This is Megasamples per second, how often the Saleae polls the pin it is connected to. 50 is very fast and not necessary. Additionally, sometimes the Saleae is unable to keep up if the rate is too high and just stops recording. So we'll set it to 20 to avoid that issue.

<img width="979" height="657" alt="Screenshot 2026-09-28 at 10 41 42 PM" src="https://github.com/user-attachments/assets/b5633c47-d6f6-4513-b6cc-25a77405c5d9" />

I want to rename these channels as well to reflect what we'll be using them for.

<img width="979" height="655" alt="Screenshot 2026-09-28 at 10 42 08 PM" src="https://github.com/user-attachments/assets/7483143e-f3f1-4ace-8e4a-36abb911f8ca" />

Then we can set the trigger settings: Enable Trigger on the right and set the Pattern and Channel to CLK:

<img width="979" height="656" alt="Screenshot 2026-09-28 at 10 42 33 PM" src="https://github.com/user-attachments/assets/56e99876-df14-48e2-9e0c-2adb2d184898" />

The trigger setting tells the Saleae when to start recording. Basically when it notices the CLK line change it will start recording and stop after 1 second (configurable by "Capture duration after trigger"). I chose the CLK line because the CS line will go up when the STM starts up, and that would trigger the recording when we don't want it to.

The last thing we can do with the Saleae is set up an analyzer. The analyzer tab is right below the Devices one on the right sidebar.

<img width="978" height="658" alt="Screenshot 2026-09-28 at 10 43 03 PM" src="https://github.com/user-attachments/assets/651c93f4-2480-4cae-95b8-bef145d631ee" />

Click on the plus to make a new analyzer. We want the SPI analyzer.

<img width="977" height="655" alt="Screenshot 2026-09-28 at 10 43 24 PM" src="https://github.com/user-attachments/assets/93a29edb-8a98-4326-af5c-220fe0a0b374" />

Then a window will pop up allowing you to configure the settings. The only things we want to change is the channels for each line. Set the accordingly

<img width="978" height="655" alt="Screenshot 2026-09-28 at 10 43 51 PM" src="https://github.com/user-attachments/assets/d215dfc2-d96e-441c-9611-bc56043fa93e" />

Now we can record whenever by hitting the blue play button:

<img width="977" height="656" alt="Screenshot 2026-09-28 at 10 44 23 PM" src="https://github.com/user-attachments/assets/16239f30-80c2-46e1-a1b1-b65646e509e1" />

We still have to connect the physical probes to the correct pins on the STM. Remember what pins were used for which purposes:
- PA11: Chip select (chosen by me), yellow Saleae wire
- PB10: Clock (SPI2), green Saleae wire
- PC3: COPI (SPI2), blue Saleae wire
- PC2: CIPO (SPI2), purple Saleae wire

So now we just have to find those pins and connect the appropriate Saleae wires to them.

<img width="610" height="637" alt="Screenshot 2026-09-28 at 10 45 02 PM" src="https://github.com/user-attachments/assets/1484e150-7d4e-4574-8448-2558992b75f1" />

And we need to find a GND pin to connect the Saleae GND to. I chose this one:

<img width="607" height="674" alt="Screenshot 2026-09-28 at 10 45 21 PM" src="https://github.com/user-attachments/assets/211a26f1-2254-4586-b5c5-458083457924" />

Our Saleae setup is complete!

#### Now how do we do a SPI communication?
In the SPI protocol, the chip select is held LOW to activate the peripheral. Then the clock moves rapidly while data is transferred on either the CIPO or COPI lines.

In the code, that involves manually setting the chip select pin LOW and then calling HAL_SPI_Transmit() with a pointer to our data.

Before we set the chip select pin LOW though, it needs to be HIGH. So before the while() loop I will add this line of code:

<img width="732" height="321" alt="Screenshot 2026-10-05 at 2 41 45 AM" src="https://github.com/user-attachments/assets/2724466c-f618-4da6-897a-6b167bf1a4ff" />

And then we can transmit with SPI in the while loop:

<img width="512" height="253" alt="Screenshot 2026-10-05 at 2 48 10 AM" src="https://github.com/user-attachments/assets/fa7da4b6-97d0-4ad3-ab2f-af327d553d3f" />

So what's happening here?\
First, I'm making an array of four bytes.\
Then I'm setting the chip select LOW.\
Then I'm calling the magic function, let's take a look at this more (ctrl + click it!)

<img width="874" height="297" alt="Screenshot 2026-10-05 at 2 49 58 AM" src="https://github.com/user-attachments/assets/db73f2c4-6d2b-4eaf-a428-f7cf9e7622b7" />

We are going to go into how it works, because it's a little bit out of the scope of this tutorial and not necessary to know how to use it.\
Instead we're focused on what arguments it requires and what they do.

The first argument is SPI_HandleTypeDef *hspi. This is a pointer to the thing that we set up in the MX_SPI2_Init() function. So I pass in the address of hspi2 that we set up all the settings for. It is declared as a global variable at the top of the main.c file.

The second argument is a pointer to the data you want to send over SPI. So that array of four bytes is my data so I passed in that.

The third argument is the number of bytes long the data is. Because this is C, arrays are just pointers and don't have a length, you need to tell the function how long the array is so it knows when it has ended.

The last argument is a timeout in milliseconds. It dictates how long the SPI transaction can last. If the timeout expires before all of the data is finished being sent then the function will abort and cut off the rest of the data. Typically it does not take very long to send data over SPI, so putting it at 100ms will ensure that there is enough time.

After the Transmit function I put the chip select back to HIGH and wait 1 millisecond before doing another SPI transmission.

Now lets run the code and see if the SPI data can be seen on the Saleae.

The sequence of events is:
- Program the STM board
- Start recording on the Saleae (blue play button)
- Wait 1 second

<img width="1030" height="690" alt="Screenshot 2026-09-28 at 10 47 12 PM" src="https://github.com/user-attachments/assets/b0a48c45-1fb2-4c04-8bd6-5be3eddba786" />

You should see something like this. If you don't, then there could be a myriad of reasons why. Here are a few.
- Check your Saleae connections and ensure they are connected to the same pins that you set up in your code.
- Make sure the Saleae's probes are set up in the correct place
- Make sure the Saleae has a ground connection
- Make sure the HAL_SPI_Transmit() function is within the while(1) loop in your code.
- Don't be afraid to ask for help!

Let's zoom in on this capture (scroll wheel):

<img width="1028" height="689" alt="Screenshot 2026-09-28 at 10 47 38 PM" src="https://github.com/user-attachments/assets/d8d6d84f-7ee2-4af1-9b43-4705e484b836" />

At this zoom level, we can see one of these transmissions taking place every 2ms. But we only put a delay for 1ms, what gives?\
Ctrl+Clicking on the HAL_Delay() function will give us the answer.

<img width="552" height="343" alt="Screenshot 2026-09-28 at 10 48 05 PM" src="https://github.com/user-attachments/assets/94fc5f06-4e8c-4685-b7d6-c82b6cd1915e" />

The function is putting extra time on our delay "to guaranty minimum wait". I don't even know what this is, why they spelled guarantee like that, or what the purpose of this is. I'm going to comment it out.

<img width="538" height="344" alt="Screenshot 2026-09-28 at 10 48 25 PM" src="https://github.com/user-attachments/assets/0881b8af-3aea-4403-8f13-92cc663a6781" />

Now we can reprogram the STM and rerun the Saleae

<img width="992" height="661" alt="Screenshot 2026-09-28 at 10 48 53 PM" src="https://github.com/user-attachments/assets/a37f8c11-94f9-44a2-974c-99e9e6f2d301" />

That looks better. Finally we can zoom in on one of these transmissions and verify that the correct data was being sent.

<img width="990" height="665" alt="Screenshot 2026-09-28 at 10 49 18 PM" src="https://github.com/user-attachments/assets/232aed04-dea6-431a-bd47-ae94f43c330f" />

**0xA71021C5**

#### Some notes on SPI
We're only seeing the COPI line broadcasting data. The CIPO line is for a peripheral response, and we have not connected a peripheral to the STM. So we're essentially just screaming 0xA71021C5 into the void with no one to hear it (except the Saleae). In the next tutorial we are going to hook these SPI lines up to a peripheral device and start having two way communication.

<hr>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-3/" class="btn btn-outline">&#10094; Previous: Challenge 3</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-5/" class="btn btn-primary">Next: Challenge 5 &#10095;</a>
</div>
