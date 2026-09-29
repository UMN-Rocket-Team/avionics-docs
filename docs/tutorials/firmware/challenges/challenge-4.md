---
layout: default
title: "Challenge 4: SPI Communication with Sensor Breakout"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-4/
---

# Challenge 4: SPI Communication with Sensor Breakout

For this challenge we will be focusing on the [Low G Accelerometer](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf) used on the sensor card of the UFC. This sensor has a SPI interface that we will make use of to obtain the acceleration data as well as to change settings. I've linked you to the full 67 page [datasheet](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf) for this sensor, but along the tutorial I'll be highlighting the important parts that we'll need to know for this challenge.

#### What you'll need

- Software: STM32CubeIDE, Logic 2 (Saleae)
- Hardware: STM32L4, Saleae, Low G Accelerometer

Okay! The first thing to do is set up the hardware. You'll need a breakout for the sensor like this:

![Challenge4-1](/assets/images/firmware/challenge4-1.png)

There are a lot of pin connections here, but we only have to worry about six of them.

![Challenge4-2](/assets/images/firmware/challenge4-2.png)

| Breakout pin | Signal | Color |
|---|---|---|
| 7 | GND | Black |
| 6 | 3.3 V | Red |
| 5 | COPI / SDI | Blue |
| 4 | CIPO / SDO | Purple |
| 3 | SCK | Green |
| 2 | CS | Yellow |

We'll need to connect these wires to the corresponding ones on the STM32.

![Challenge4-3](/assets/images/firmware/challenge4-3.png)

I'm also going to connect some header pins so that we can use the saleae on this circuit.

![Challenge4-4](/assets/images/firmware/challenge4-4.png)

Now let's turn on the STM and make sure that all the connections are wired properly.

![Challenge4-5](/assets/images/firmware/challenge4-5.png)

Upon turning the STM on, you should notice the green light on the breakout board turn on. If not, check your power and ground connections.\
If you start a saleae capture, you should also see the same 0xA71021C5 being sent over the wire.

![Challenge4-6](/assets/images/firmware/challenge4-6.png)

But now there's something new on the CIPO line. It's not anything useful because 0xA71021C5 is not a command that the sensor understands, but we can construct a request over SPI to get the sensor to respond in a way that we want.

Here's a segment from page 30 of the LIS2DW12 [datasheet](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf#page=30). It details how to do a register read over SPI.

![Challenge4-7](/assets/images/firmware/challenge4-7.png)

And here on page 33 we can find the register address table.

![Challenge4-8](/assets/images/firmware/challenge4-8.png)

Lets start out by reading the WHO_AM_I register (0x0F). If we go to page 35 we can see more information

![Challenge4-9](/assets/images/firmware/challenge4-9.png)

This register is supposed to have a value of 0x44.

So let's set up a framework for sending and receiving one byte of data over SPI. We'll change our code from the last tutorial to support both sending and receiving.

![Challenge4-10](/assets/images/firmware/challenge4-10.png)

Here I have a 1 byte spiInput buffer as well as a 1 byte spiOutput buffer. We'll be sending the spiInput to the sensor using the HAL_SPI_Transmit function and then receiving the response through the HAL_SPI_Receive function. Now we just have to figure out what to send to get the value of the WHO_AM_I register.

Recall on page 30 the steps for reading using SPI. We have to SET the MSB (most significant bit) and fill the remaining 7 bits with the address of the register we want to read. So since we're trying to read address 0x0F, we need to send 0x0F augmented with the most significant bit set.

It helps to write the address in binary. 0x0F translates to 0b00001111, so in order to set the MSB, we just have to change it to 0b10001111. That translates back to 0x8F in hex.

So let's set our spiInput to 0x8F.

![Challenge4-11](/assets/images/firmware/challenge4-11.png)

Now let's run the code and check the saleae to see the results.

![Challenge4-12](/assets/images/firmware/challenge4-12.png)

Now this is a promising result, but there is something strange happening. We are sending 0x8F and receiving 0x44 like we should, but it also looks like we are SENDING 0x44 during the period when we receive it. It's also a little strange that the both the COPI and CIPO lines are held high the whole time that we are not sending it anything. Let's investigate these mysteries.

To understand why we are sending a 0x44 while we receive it, it helps to look into the code of the HAL_SPI_Receive function.

![Challenge4-13](/assets/images/firmware/challenge4-13.png)

Here we can find the answer. The HAL_SPI_Receive actually just calls HAL_SPI_TransmitReceive with the receive buffer as the transmit buffer. That means that whatever happens to be in spiOutput when we call HAL_SPI_Receive is sent over the COPI line while we do the receive. We don't need to be sending anything so we can just set that to zero.

![Challenge4-14](/assets/images/firmware/challenge4-14.png)

Now if we run the code again we see zero during the receive period.

![Challenge4-15](/assets/images/firmware/challenge4-15.png)

So that mystery has been solved. But why are both data lines high during the idle period? To be fair, this doesn't really matter because the state of the COPI and CIPO lines are not relevant unless the chip select is down and the clock is moving, but it is at least nice to understand what is causing them to idle high.

The answer to the CIPO line can be found on page 4 of the LIS2DW12 datasheet:

![Challenge4-16](/assets/images/firmware/challenge4-16.png)

The SDO line (CIPO) is set to be pulled up, meaning it idles high. So that's nice to know. But what about the COPI line? That one is controlled by the STM32, so the answer lies there.

And to be honest with you, I could not find it. I looked around and googled around but I can't find a satisfying answer for why the COPI line goes back to being high after receiving. I guess that's just a mystery that will remain unsolved.

But we accomplished what we wanted to, we successfully read the WHO_AM_I register from the sensor! But before we consider the challenge complete, I want to extend some of the functionality of our code. Right now we've hardcoded the register read to be the WHO_AM_I register, but what if instead we created a function that could read arbitrary registers from the sensor.

![Challenge4-17](/assets/images/firmware/challenge4-17.png)

Here I've started defining a function that can read any register from the sensor.

![Challenge4-18](/assets/images/firmware/challenge4-18.png)

Most of this code is just copied from what we had in the main loop. But the key difference is that instead of hardcoding the spiInput to 0x8F, we take the register address and OR it with 0x80. This will ensure that the MSB is SET (since 0x80 decomposes to 0b10000000, and the OR function will SET the 1s but not RESET to 0s).

Now we can replace our main loop with a call to this function:

![Challenge4-19](/assets/images/firmware/challenge4-19.png)

Now to verify that this is working, I'm going to use the debugger functionality of the STM IDE. This debugger is extremely useful for figuring out what code is doing and finding where something is going wrong. Let's edit the debug configurations:

![Challenge4-20](/assets/images/firmware/challenge4-20.png)

Here we're going to make separate debug and release configurations. The advantage of this is that the debug configuration is good for running the code in debug mode, it compiles the code in a way that the debugger can understand and step through. The release configuration will compile the code for speed. It will make the code run faster but at the cost of the ability to debug it. We have a configuration GPIOTest Debug.

![Challenge4-21](/assets/images/firmware/challenge4-21.png)

But let's edit this, we want the Build Configuration to be "Debug", and we also want to Enable auto build.

![Challenge4-22](/assets/images/firmware/challenge4-22.png)

remember to hit Apply!

Now let's make a Release configuration:

![Challenge4-23](/assets/images/firmware/challenge4-23.png)

This one will use the Release build configuration

![Challenge4-24](/assets/images/firmware/challenge4-24.png)

It's also important to set the C/C++ Application as Release/GPIOTest.elf

Okay, time to debug!

![Challenge4-25](/assets/images/firmware/challenge4-25.png)

When you debug, the startup sequence will take a while, but eventually it will drop you at the beginning of the main() function.

![Challenge4-26](/assets/images/firmware/challenge4-26.png)

There are a panel of buttons at the top that allow you to move through the code.

![Challenge4-27](/assets/images/firmware/challenge4-27.png)

![Challenge4-28](/assets/images/firmware/challenge4-28.png)

The "Step Over" button will go to the next line\
"Step Into" will go into a function call\
"Resume" will advance to the next breakpoint.

To create a breakpoint, double click to the left of a line number. Let's put one on the function call.

![Challenge4-29](/assets/images/firmware/challenge4-29.png)

Then let's hit "Resume"

![Challenge4-30](/assets/images/firmware/challenge4-30.png)

Right now we are just about to execute the readRegister function. The "Variables" tab in the debugger is showing whoami as 0x0 (I changed it to hex by right clicking it and selecting Number Format -> Hex). If you don't see the "Variables" tab you can enable it with Window -> Show View -> Variables.

Now we can hit "Step Over".

![Challenge4-31](/assets/images/firmware/challenge4-31.png)

We can see the whoami variable has updated to 0x44. So that means that it worked!

<hr>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-3/" class="btn btn-outline">&#10094; Previous: Challenge 3</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-5/" class="btn btn-primary">Next: Challenge 5 &#10095;</a>
</div>