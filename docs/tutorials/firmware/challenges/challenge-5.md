---
layout: default
title: "Challenge 5: SPI Communication with Sensor Breakout"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-5/
---

# Challenge 5: SPI Communication with Sensor Breakout

For this challenge we will be focusing on the [Low G Accelerometer](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf) used on the sensor card of the UFC. This sensor has a SPI interface that we will make use of to obtain the acceleration data as well as to change settings. I've linked you to the full 67 page [datasheet](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf) for this sensor, but along the tutorial I'll be highlighting the important parts that we'll need to know for this challenge.

#### What you'll need

- Software: STM32CubeIDE, Logic 2 (Saleae)
- Hardware: STM32L4, Saleae, Low G Accelerometer

Okay! The first thing to do is set up the hardware. You'll need a breakout for the sensor like this:

<img width="465" height="785" alt="Screenshot 2026-09-28 at 10 57 50 PM" src="https://github.com/user-attachments/assets/0abba9cc-84f0-4b41-b661-4b4e826bc206" />

<img width="270" height="300" alt="Screenshot 2026-09-28 at 10 58 19 PM" src="https://github.com/user-attachments/assets/87495181-a41b-4733-823a-1bcf6d3bbf6f" />

There are a lot of pin connections here, but we only have to worry about six of them.

| Breakout pin | Signal | Color |
|---|---|---|
| 7 | GND | Black |
| 6 | 3.3 V | Red |
| 5 | COPI / SDI | Blue |
| 4 | CIPO / SDO | Purple |
| 3 | SCK | Green |
| 2 | CS | Yellow |

We'll need to connect these wires to the corresponding ones on the STM32.

<img width="460" height="640" alt="Screenshot 2026-09-28 at 10 58 42 PM" src="https://github.com/user-attachments/assets/cf005385-8232-4d00-b8f3-dfd494f19ca4" />

<img width="986" height="805" alt="Screenshot 2026-09-28 at 10 59 03 PM" src="https://github.com/user-attachments/assets/7fb2ffa7-508c-4fd5-b65a-9b45c56737e2" />

I'm also going to connect some header pins so that we can use the Saleae on this circuit.

<img width="430" height="552" alt="Screenshot 2026-09-28 at 10 59 23 PM" src="https://github.com/user-attachments/assets/bc03e357-71d0-41fc-88a3-ebe961838ff0" />

Now let's turn on the STM and make sure that all the connections are wired properly.

<img width="402" height="534" alt="Screenshot 2026-09-28 at 10 59 39 PM" src="https://github.com/user-attachments/assets/90ee5697-be61-4ccd-ae7e-cc5e930bc707" />

Upon turning the STM on, you should notice the green light on the breakout board turn on. If not, check your power and ground connections.\
If you start a Saleae capture, you should also see the same 0xA71021C5 being sent over the wire.

<img width="993" height="479" alt="Screenshot 2026-09-28 at 11 00 13 PM" src="https://github.com/user-attachments/assets/b3732d70-e2be-4417-9db6-c9a2cc5efa96" />

But now there's something new on the CIPO line. It's not anything useful because 0xA71021C5 is not a command that the sensor understands, but we can construct a request over SPI to get the sensor to respond in a way that we want.

Here's a segment from page 30 of the LIS2DW12 [datasheet](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf#page=30). It details how to do a register read over SPI.

<img width="851" height="509" alt="Screenshot 2026-09-28 at 11 00 44 PM" src="https://github.com/user-attachments/assets/f92e0222-f3e6-49dc-b947-7d49a4801355" />

And here on page 33 we can find the register address table.

<img width="658" height="829" alt="Screenshot 2026-09-28 at 11 01 11 PM" src="https://github.com/user-attachments/assets/542efe75-26d4-43d8-bb8a-1e2fe8e526d0" />

Lets start out by reading the WHO_AM_I register (0x0F). If we go to page 35 we can see more information

<img width="662" height="143" alt="Screenshot 2026-09-28 at 11 01 33 PM" src="https://github.com/user-attachments/assets/1f0403a8-13ec-4dc7-ac51-793c2f53a410" />

This register is supposed to have a value of 0x44.

So let's set up a framework for sending and receiving one byte of data over SPI. We'll change our code from the last tutorial to support both sending and receiving.

<img width="485" height="273" alt="Screenshot 2026-09-28 at 11 01 54 PM" src="https://github.com/user-attachments/assets/88a7e287-cc4a-4fda-a11e-b5b78e7c89a8" />

Here I have a 1 byte spiInput buffer as well as a 1 byte spiOutput buffer. We'll be sending the spiInput to the sensor using the HAL_SPI_Transmit function and then receiving the response through the HAL_SPI_Receive function. Now we just have to figure out what to send to get the value of the WHO_AM_I register.

Recall on page 30 the steps for reading using SPI. We have to SET the MSB (most significant bit) and fill the remaining 7 bits with the address of the register we want to read. So since we're trying to read address 0x0F, we need to send 0x0F augmented with the most significant bit set.

It helps to write the address in binary. 0x0F translates to 0b00001111, so in order to set the MSB, we just have to change it to 0b10001111. That translates back to 0x8F in hex.

So let's set our spiInput to 0x8F.

<img width="481" height="274" alt="Screenshot 2026-09-28 at 11 02 19 PM" src="https://github.com/user-attachments/assets/86bd200c-2de6-4ffb-83a2-96ab3e713682" />

Now let's run the code and check the Saleae to see the results.

<img width="896" height="428" alt="Screenshot 2026-09-28 at 11 02 40 PM" src="https://github.com/user-attachments/assets/3c2438fe-06b6-49b4-826d-42d1f1856fb5" />


Now this is a promising result, but there is something strange happening. We are sending 0x8F and receiving 0x44 like we should, but it also looks like we are SENDING 0x44 during the period when we receive it. It's also a little strange that the both the COPI and CIPO lines are held high the whole time that we are not sending it anything. Let's investigate these mysteries.

To understand why we are sending a 0x44 while we receive it, it helps to look into the code of the HAL_SPI_Receive function.

<img width="810" height="346" alt="Screenshot 2026-09-28 at 11 03 01 PM" src="https://github.com/user-attachments/assets/6e776d9a-3874-46e2-ba63-59dc9f69d752" />

Here we can find the answer. The HAL_SPI_Receive actually just calls HAL_SPI_TransmitReceive with the receive buffer as the transmit buffer. That means that whatever happens to be in spiOutput when we call HAL_SPI_Receive is sent over the COPI line while we do the receive. We don't need to be sending anything so we can just set that to zero.

<img width="489" height="276" alt="Screenshot 2026-09-28 at 11 03 21 PM" src="https://github.com/user-attachments/assets/33c5f1f6-d765-4732-ab70-203a4d496010" />

Now if we run the code again we see zero during the receive period.

<img width="894" height="429" alt="Screenshot 2026-09-28 at 11 03 39 PM" src="https://github.com/user-attachments/assets/ee876503-6e7a-4672-af15-ac73cbe3a20b" />

So that mystery has been solved. But why are both data lines high during the idle period? To be fair, this doesn't really matter because the state of the COPI and CIPO lines are not relevant unless the chip select is down and the clock is moving, but it is at least nice to understand what is causing them to idle high.

The answer to the CIPO line can be found on page 4 of the LIS2DW12 datasheet:

<img width="595" height="461" alt="Screenshot 2026-09-28 at 11 03 58 PM" src="https://github.com/user-attachments/assets/3aff82a4-3bf4-4025-8a81-cbdd89317512" />

The SDO line (CIPO) is set to be pulled up, meaning it idles high. So that's nice to know. But what about the COPI line? That one is controlled by the STM32, so the answer lies there.

And to be honest with you, I could not find it. I looked around and googled around but I can't find a satisfying answer for why the COPI line goes back to being high after receiving. I guess that's just a mystery that will remain unsolved.

But we accomplished what we wanted to, we successfully read the WHO_AM_I register from the sensor! But before we consider the challenge complete, I want to extend some of the functionality of our code. Right now we've hardcoded the register read to be the WHO_AM_I register, but what if instead we created a function that could read arbitrary registers from the sensor.

<img width="612" height="575" alt="Screenshot 2026-09-28 at 11 04 21 PM" src="https://github.com/user-attachments/assets/685ede14-fa8c-45b1-8867-3bf594fa6455" />

Here I've started defining a function that can read any register from the sensor.

<img width="606" height="190" alt="Screenshot 2026-09-28 at 11 04 44 PM" src="https://github.com/user-attachments/assets/c67e275c-f5e1-4036-a153-cb4c7599bbda" />

Most of this code is just copied from what we had in the main loop. But the key difference is that instead of hardcoding the spiInput to 0x8F, we take the register address and OR it with 0x80. This will ensure that the MSB is SET (since 0x80 decomposes to 0b10000000, and the OR function will SET the 1s but not RESET to 0s).

Now we can replace our main loop with a call to this function:

<img width="485" height="235" alt="Screenshot 2026-09-28 at 11 04 56 PM" src="https://github.com/user-attachments/assets/42244b6a-30aa-4f07-8db9-b97672595040" />

Now to verify that this is working, I'm going to use the debugger functionality of the STM IDE. This debugger is extremely useful for figuring out what code is doing and finding where something is going wrong. Let's edit the debug configurations:

<img width="219" height="129" alt="Screenshot 2026-09-28 at 11 05 11 PM" src="https://github.com/user-attachments/assets/5a891fa8-44a6-4da6-84d6-be3b6737c629" />

Here we're going to make separate debug and release configurations. The advantage of this is that the debug configuration is good for running the code in debug mode, it compiles the code in a way that the debugger can understand and step through. The release configuration will compile the code for speed. It will make the code run faster but at the cost of the ability to debug it. We have a configuration GPIOTest Debug.

<img width="897" height="566" alt="Screenshot 2026-09-28 at 11 05 25 PM" src="https://github.com/user-attachments/assets/1783e5dd-0351-4ce1-9cc9-33bb89095b38" />

But let's edit this, we want the Build Configuration to be "Debug", and we also want to Enable auto build.

<img width="896" height="561" alt="Screenshot 2026-09-28 at 11 05 56 PM" src="https://github.com/user-attachments/assets/07093e5f-393d-437d-aeb4-aa4db7c88615" />

remember to hit Apply!

Now let's make a Release configuration:

<img width="896" height="567" alt="Screenshot 2026-09-28 at 11 06 41 PM" src="https://github.com/user-attachments/assets/bb824b09-8e32-4747-9c4b-2ff970d669f1" />

This one will use the Release build configuration

<img width="898" height="565" alt="Screenshot 2026-09-28 at 11 06 57 PM" src="https://github.com/user-attachments/assets/891be5dc-c6fb-4cd7-96b0-3a4666036253" />

It's also important to set the C/C++ Application as Release/GPIOTest.elf

Okay, time to debug!

<img width="220" height="122" alt="Screenshot 2026-09-28 at 11 07 15 PM" src="https://github.com/user-attachments/assets/52a741cb-c4bf-443b-94fa-45b23ff74217" />

When you debug, the startup sequence will take a while, but eventually it will drop you at the beginning of the main() function.

<img width="663" height="572" alt="Screenshot 2026-09-28 at 11 07 40 PM" src="https://github.com/user-attachments/assets/5144571b-09c2-472d-ac96-dcac92991312" />

There are a panel of buttons at the top that allow you to move through the code.

<img width="291" height="46" alt="Screenshot 2026-09-28 at 11 08 14 PM" src="https://github.com/user-attachments/assets/d07f4b44-e263-4fe1-a310-828d8d2f8dac" />

<img width="373" height="84" alt="Screenshot 2026-09-28 at 11 08 36 PM" src="https://github.com/user-attachments/assets/b09cea07-a5e5-4975-8aab-061d1397aaf7" />

The "Step Over" button will go to the next line\
"Step Into" will go into a function call\
"Resume" will advance to the next breakpoint.

To create a breakpoint, double click to the left of a line number. Let's put one on the function call.

<img width="763" height="349" alt="Screenshot 2026-09-28 at 11 09 15 PM" src="https://github.com/user-attachments/assets/8fd55913-df0c-4fcc-b9cb-4edb302ed7c6" />

Then let's hit "Resume"

<img width="1085" height="711" alt="Screenshot 2026-09-28 at 11 09 47 PM" src="https://github.com/user-attachments/assets/45136d3d-6fbb-4d54-8078-bc1b3d90821b" />

Right now we are just about to execute the readRegister function. The "Variables" tab in the debugger is showing whoami as 0x0 (I changed it to hex by right clicking it and selecting Number Format -> Hex). If you don't see the "Variables" tab you can enable it with Window -> Show View -> Variables.

Now we can hit "Step Over".

<img width="1084" height="731" alt="Screenshot 2026-09-28 at 11 10 15 PM" src="https://github.com/user-attachments/assets/7f57c555-c1fe-4ffb-8d4a-e11afab52b4d" />

We can see the whoami variable has updated to 0x44. So that means that it worked!

<hr>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-4/" class="btn btn-outline">&#10094; Previous: Challenge 4</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-6/" class="btn btn-primary">Next: Challenge 6 &#10095;</a>
</div>
