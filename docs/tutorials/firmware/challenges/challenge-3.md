---
layout: default
title: "Challenge 3: SPI Controller on STM32 using HAL"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-3/
---

# Challenge 3: SPI Controller on STM32 using HAL
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

We need to enable SPI on our project. Lets go back to our ioc file. It's near the bottom of the Project Explorer if you closed it.

![Challenge3-1](/assets/images/firmware/challenge3-1.png)

But oh no, what's this? There are THREE different SPIs? Don't worry, the number just refers to the pins that will be used. Lets just go with SPI2 (I originally thought SPI2 was used for the devboard last year but it turns out we used SPI3, so the COB SPI labels on the wood board will not be particularly helpful, sorry about that). Select "Full-Duplex Master"

![Challenge3-2](/assets/images/firmware/challenge3-2.png)

What does full duplex master mean? Full duplex means that both devices connected can send data to each other at the same time. Master refers to the Master->Slave relationship of SPI. Though we call it Controller->Peripheral these days, you still may see the terms Master and Slave for the two devices. We set up the NUCLEO board as the controller of the SPI communication.

Let's look at what pins were allocated for SPI2.

![Challenge3-3](/assets/images/firmware/challenge3-3.png)

Here we can see that:
- PB10 became the SPI2_SCK, that's the clock
- PC2 became MISO, that's the CIPO, controller in peripheral out
- PC3 became MOSI, that's COPI, controller out peripheral in

But where's the Chip Select pin? STM didn't allocate it for us, so we'll have to do it ourselves. We can't do it here though, if you click on a pin you'll see there's no option for SPI2_CS, or anything of that sort. Instead we'll be setting up our Chip Select pin as a normal GPIO pin and manually pulling it down and pushing it back up before and after we do the SPI operation.

I think we're good to save now. We can generate the code. Btw if you ever want to apply code generation at any time use this button

![Challenge3-4](/assets/images/firmware/challenge3-4.png)

We'll notice some new variables and functions in our project... But before we address them, I want to address something else

![Challenge3-5](/assets/images/firmware/challenge3-5.png)

Generating the code got rid of my extra clock enables. Sure it added GPIOB enable, but my D and H were removed. That's because I didn't put them inside the
```
/* USER CODE BEGIN */
/* USER CODE END */
```
tags. Any code that you put outside of those comments will get removed after code generation, so make sure to patch up stuff that may have been removed. Luckily, in the UFC codebase we never use code generation, so you won't be having this problem regularly.

![Challenge3-6](/assets/images/firmware/challenge3-6.png)

Now let's address the new SPI functions. Somewhere in your code you'll find this function

![Challenge3-7](/assets/images/firmware/challenge3-7.png)

It's the start of an initialisation of SPI, but it is incomplete. We'll have to initialise the pins ourselves (actually some pins are initialised in the msp file, but I am chosing to ignore msp files and functions because I have yet to find a compelling argument for their existence). But I want to go into what some of these settings do first. You can control click any of the fields or values to see what other options exist for them, that's generally a good way to understand what their function is.
- The Instance is what protocol your using. It's SPI2 because we picked SPI2 on the ioc.
- The Mode is one of MASTER or SLAVE, controller or peripheral. Because we want our board to be the SPI controller, it is set to SPI_MODE_MASTER
- The direction has to do with the two data lines. We want dedicated COPI and CIPO lines, so we set it to SPI_DIRECTION_2LINES. Other forms exist that use a single data line for both COPI and CIPO, or do other funky stuff.
- The DataSize is how many bits of data are sent at a time. It's set to 4BIT right now, but I think it will be more natural to change it to 8BIT, then we can count our reps in bytes instead of in half-bytes.

   ![Challenge3-8](/assets/images/firmware/challenge3-8.png)

- The CLKPolarity refers to the default state of the clock. If set to LOW, then the clock line is LOW when nothing is happening, if it's HIGH then the clock will be HIGH when it's not doing anything
- The CLKPhase determines whether bits are read on the rising or falling edge of the clock. The clock is a line that will go up and down rapidly, while the data lines will go up and down synced with the clock. But you can choose to sync on the rising (first) edge of the clock, or the falling (second) edge. They are not labelled RISING and FALLING though, because if you have your CLKPolarity set to HIGH, then they would have to be reversed, with 1EDGE referring to FALLING and 2EDGE with RISING. But for now, 1EDGE means on the RISING edge, and that's generally what we want.
- NSS is I'm not exactly sure. [Here](https://stackoverflow.com/questions/35780290/how-can-i-use-hardware-nss-spi-on-stm32f4) is a link to a stack overflow post about it. Apparently it's another kind of "enable" signal for SPI, and it can be implemented in software (SOFT) or as a pin in hardware (HARD_OUTPUT for controller or HARD_INPUT for peripheral)
- BaudRatePrescaler refers to the frequency of the CLK pin. It will always be a power of two quotient of the speed of the clock on the chip, which we saw earlier was 80MHz. So right now the prescaler is set to SPI_BAUDRATEPRESCALER_2, meaning that the frequency of the SPI_CLK line will be 40MHz, or 1 cycle every 25 nanoseconds. The rule is that the SPI clock's frequency will be the main clock / BaudRatePrescaler.
- FirstBit refers to the "endianness" of the communication. Whenever SPI is used to transmit or receive data, the data is in binary form, and encoded into a wire being either UP or DOWN. Take the sequence 01011001 for example. That's an 8-bit sequence that gets encoded as `_|‾|_|‾‾|__|‾` it goes 0 (low) then 1 (high) back to 0 (low) then 1 for 2 cycles, and then 0 for 2 cycles before back to 1. That's an example of MSB, or big endian, since the Most Significant Bit is sent FIRST (we assume it's being read left to right). The other option is to encode the same string of bits like this `‾|__|‾‾|_|‾|_` so it's just reversed. A good way to think about it is in MSB mode, the sender is positioned to the RIGHT of the receiver, and is giving them data one at a time like this:

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

![Challenge3-9](/assets/images/firmware/challenge3-9.png)

But what to set the Mode to? For this we'll have to consult, [The Datasheet](https://www.st.com/resource/en/datasheet/stm32l476rg.pdf#page=88). Get used to the look of it, because you'll be seeing many more like it doing firmware. I've linked you straight to page 88 of the datasheet for the STM32L476xx series. There's only one in this series which is the STM32L476RG, which is what we're using. But what's this table on page 88. This is the Alternate Functions table. It tells you which pins support which "alternate functions". What that means is that only certain pins can be SPI clocks, and only certain pins can be COPI and CIPO. This table will tell you which pins can do what. Thing is, we already know what pins we're using. It's PB10, PC2, PC3, and some other GPIO pin for the Chip Select. But we are still going to use the table here to tell us exactly what Mode these pins allow. The Mode field itself only accepts values of GPIO_MODE, as can be seen in the struct declaration (CTRL+Click the .Mode)

![Challenge3-10](/assets/images/firmware/challenge3-10.png)

But there's something else here that we've never seen before. A field called Alternate. That's the one we want. We can set the Mode to GPIO_MODE_AF_PP, this means we want to use this pin for an Alternate Function (AF) and we want it to be push/pull, like our LED pin. Then we can set the GPIO_InitStruct.Alternate field:

![Challenge3-11](/assets/images/firmware/challenge3-11.png)

So let's look at the datasheet for PB10:

![Challenge3-12](/assets/images/firmware/challenge3-12.png)

We can see under AF5 it is registered as SPI2_CLK, exactly what we need. So we set the Alternate field to GPIO_AF5_SPI2. It will know to make it a clock because this pin cannot support COPI or CIPO.

![Challenge3-13](/assets/images/firmware/challenge3-13.png)

Addendum: The speed. This is a clock going at presumably 40MHz, which is pretty fast for a line to go up and down. Are we sure we shouldn't bump up the speed to at least a GPIO_SPEED_FREQ_MEDIUM? [Here](https://community.st.com/t5/stm32-mcus-products/i-would-like-to-know-about-the-4-gpio-speed-settings-on-the/td-p/56124) is a post with a table displaying the speed (in MHz and in ns) guarenteed by the different speed settings. Now granted, this is for a different chip, but the table is a bit startling. It indicates that even on speed 10 (10 equates to GPIO_SPEED_FREQ_HIGH), if the voltage difference is too high, it might not be able to keep up with 40MHz. Only speed 11 (GPIO_SPEED_FREQ_VERY_HIGH) is able to keep guarentee that it will be able to do it. Instead of making the frequency extremely high, my solution is just to increase the BaudRatePrescaler to slow down that SPI clock. This will make it much easier to see on the logic analyzer later, and we'll be able to keep our speed at GPIO_SPEED_FREQ_LOW. I'll set the BaudRatePrescaler to SPI_BAUDRATEPRESCALER_256 to really slow this clock down. Remember that the SPI clock frequency is the main clock frequency / BaudRatePrescaler. So, by setting it to 256, that should make the SPI clock run at 80/256, or 0.3125MHz, 312.5KHz. Easily within the range of every voltage difference of GPIO_SPEED_FREQ_LOW.

![Challenge3-14](/assets/images/firmware/challenge3-14.png)

And that's the clock set up. We can repeat similar steps for the COPI and CIPO pins, they'll all be using GPIO_AF5_SPI2 as well.

![Challenge3-15](/assets/images/firmware/challenge3-15.png)

Okay now let's pick our Chip Select pin. It can be any GPIO enabled pin, but for historical reasons I will choose PA11, as that's one used in development when we only had these devboards last year. We're going to set this one up as a normal GPIO pin, because HAL SPI does not have internal support for chip selects, we will manually be toggling them off and on. I'm choosing A11 for this.

![Challenge3-16](/assets/images/firmware/challenge3-16.png)

We're almost done, there's just one last thing to do. Remember how we had to enable the clocks for the GPIO pins to work? Well SPI has its own clock within the microcontroller, so if we want anything to happen we have to enable that too.

![Challenge3-17](/assets/images/firmware/challenge3-17.png)
And that's all the initialisation! Make sure that the project builds by clicking the "build" button.

![Challenge3-18](/assets/images/firmware/challenge3-18.png)

Fix any compile errors, don't be afraid to ask for help!

Alright now let's try actually sending a byte of data over SPI. We're not actually going to be sending it to a peripheral device, but rather, we're going to capture the output using a very fancy oscilloscope called a logic analyzer.

![Challenge3-19](/assets/images/firmware/challenge3-19.png)


Setting up the Saleae can be a little bit tricky, and there's more [software](https://www.saleae.com/pages/downloads) we have to get. This software 
is a lot more modern and pleasant to use than STM's IDE though, so that's a plus.

After getting the software and opening it, you'll be greeted by this screen:

![Challenge3-20](/assets/images/firmware/challenge3-20.png)

The Saleae uses a micro USB to USB-A cable. When you plug it in to your computer with the Saleae software running, it should show a green light after around 10 seconds.

![Challenge3-21](/assets/images/firmware/challenge3-21.png)

And the software should update too:

![Challenge3-22](/assets/images/firmware/challenge3-22.png)

By clicking on Devices on the right sidebar, we can see and reconfigure the Saleae's probes:

![Challenge3-23](/assets/images/firmware/challenge3-23.png)

Here we can see that it has configured probes 0 and 1 to be both digital and analog. But before we reconfigure them, we should actually plug the probes into the saleae.

![Challenge3-24](/assets/images/firmware/challenge3-24.png)

Now it may seem obvious where this goes, but it's important to get this part right. The saleae probes have only one orientation that it will work in. Specifically, this one I have with the yellow, green, blue, and purple probes MUST go into slots 4, 5, 6, and 7 of the saleae. Additionally the black GND (ground) wires must be at the BOTTOM, like this:

![Challenge3-25](/assets/images/firmware/challenge3-25.png)

These number labels are on the back of the saleae:

![Challenge3-26](/assets/images/firmware/challenge3-26.png)

There is another set of probes that are black, brown, red, and orange. Those would go in slots 0, 1, 2, and 3. Here's what the saleae looks like with all its probes attached:

![Challenge3-27](/assets/images/firmware/challenge3-27.png)

We will only need four of these for SPI though, because SPI only uses four wires.\
Now we can configure the Saleae software. I'm going to turn on the 4, 5, 6, and 7 probes as DIGITAL.

![Challenge3-28](/assets/images/firmware/challenge3-28.png)

I'm also going to set the MS/s to 20. This is Megasamples per second, how often the saleae polls the pin it is connected to. 50 is very fast and not necessary. Additionally, sometimes the saleae is unable to keep up if the rate is too high and just stops recording. So we'll set it to 20 to avoid that issue.

![Challenge3-29](/assets/images/firmware/challenge3-29.png)

I want to rename these channels as well to reflect what we'll be using them for.

![Challenge3-30](/assets/images/firmware/challenge3-30.png)


Then we can set the trigger settings: Enable Trigger on the right and set the Pattern and Channel to CLK:

![Challenge3-31](/assets/images/firmware/challenge3-31.png)


The trigger setting tells the Saleae when to start recording. Basically when it notices the CLK line change it will start recording and stop after 1 second (configurable by "Capture duration after trigger"). I chose the CLK line because the CS line will go up when the STM starts up, and that would trigger the recording when we don't want it to.

The last thing we can do with the Saleae is set up an analyzer. The analyzer tab is right below the Devices one on the right sidebar.

![Challenge3-32](/assets/images/firmware/challenge3-32.png)

Click on the plus to make a new analyzer. We want the SPI analyzer.

![Challenge3-33](/assets/images/firmware/challenge3-33.png)

Then a window will pop up allowing you to configure the settings. The only things we want to change is the channels for each line. Set the accordingly

![Challenge3-34](/assets/images/firmware/challenge3-34.png)

Now we can record whenenver by hitting the blue play button:

![Challenge3-35](/assets/images/firmware/challenge3-35.png)

We still have to connect the physical probes to the correct pins on the STM. Remember what pins were used for which purposes:
- PA11: Chip select (chosen by me), yellow saleae wire
- PB10: Clock (SPI2), green saleae wire
- PC3: COPI (SPI2), blue saleae wire
- PC2: CIPO (SPI2), purple saleae wire

So now we just have to find those pins and connect the appropriate saleae wires to them.

![Challenge3-36](/assets/images/firmware/challenge3-36.png)

And we need to find a GND pin to connect the Saleae GND to. I chose this one:

![Challenge3-37](/assets/images/firmware/challenge3-37.png)

Our saleae setup is complete!

#### Now how do we do a SPI communication?
In the SPI protocol, the chip select is held LOW to activate the peripheral. Then the clock moves rapidly while data is transferred on either the CIPO or COPI lines.

In the code, that involves manually setting the chip select pin LOW and then calling HAL_SPI_Transmit() with a pointer to our data.

Before we set the chip select pin LOW though, it needs to be HIGH. So before the while() loop I will add this line of code:

![Challenge3-38](/assets/images/firmware/challenge3-38.png)

And then we can transmit with SPI in the while loop:

![Challenge3-39](/assets/images/firmware/challenge3-39.png)

So what's happening here?\
First, I'm making an array of four bytes.\
Then I'm setting the chip select LOW.\
Then I'm calling the magic function, let's take a look at this more (ctrl + click it!)

![Challenge3-40](/assets/images/firmware/challenge3-40.png)

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

![Challenge3-41](/assets/images/firmware/challenge3-41.png)

You should see something like this. If you don't, then there could be a myriad of reasons why. Here are a few.
- Check your Saleae connections and ensure they are connected to the same pins that you set up in your code.
- Make sure the saleae's probes are set up in the correct place
- Make sure the Saleae has a ground connection
- Make sure the HAL_SPI_Transmit() function is within the while(1) loop in your code.
- Don't be afraid to ask for help!

Let's zoom in on this capture (scroll wheel):

![Challenge3-42](/assets/images/firmware/challenge3-42.png)

At this zoom level, we can see one of these transmissions taking place every 2ms. But we only put a delay for 1ms, what gives?\
Ctrl+Clicking on the HAL_Delay() function will give us the answer.

![Challenge3-43](/assets/images/firmware/challenge3-43.png)

The function is putting extra time on our delay "to guaranty minimum wait". I don't even know what this is, why they spelled guarantee like that, or what the purpose of this is. I'm going to comment it out.

![Challenge3-44](/assets/images/firmware/challenge3-44.png)

Now we can reprogram the STM and rerun the saleae

![Challenge3-45](/assets/images/firmware/challenge3-45.png)

That looks better. Finally we can zoom in on one of these transmissions and verify that the correct data was being sent.

![Challenge3-46](/assets/images/firmware/challenge3-46.png)

**0xA71021C5**

#### Some notes on SPI
We're only seeing the COPI line broadcasting data. The CIPO line is for a peripheral response, and we have not connected a peripheral to the STM. So we're essentially just screaming 0xA71021C5 into the void with no one to hear it (except the saleae). In the next tutorial we are going to hook these SPI lines up to a peripheral device and start having two way communication.

<hr>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-2/" class="btn btn-outline">&#10094; Previous: Challenge 2</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-4/" class="btn btn-primary">Next: Challenge 4 &#10095;</a>
</div>