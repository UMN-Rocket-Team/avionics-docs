---
layout: default
title: "Challenge 2: GPIO Pins with STM32 using HAL"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-2/
---

# Challenge 2: GPIO Pins with STM32 using HAL
This challenge assumes that you have a working LED breadboard from Challenge 1.

#### What you'll need

- Software: STM32CubeIDE
- Hardware: Breadboard setup from Challenge 1

Now that you learned how to build a circuit in which you push a button to turn an LED on and off, how about we step up a bit? What if we control when to turn on and off using **code**? We'll first have to identify and utilise the GPIO pins on the STM.

#### GPIO Pins
GPIO stands for "General Purpose Input/Output". It just means that the pin doesn't have some specific purpose.

The GPIO pins on the STM are identified by their **PORT** (letter) and **PIN** (number). The PORT refers to a bank of (i think up to 16) pins. So an example is like pin A11, which is port A and pin 11.

Here's a picture labelling all of the pins on the NUCLEO-L476RG board because I guess STM didn't feel the need to put the labels on the board itself, we also have a physical wood board with this same picture:

<img width="574" height="464" alt="Screenshot 2026-09-28 at 7 08 01 PM" src="https://github.com/user-attachments/assets/0d61949e-d562-44c4-aa24-b951cbf136ee" />


So whatever pin you decide to use, note down the LETTER and the NUMBER, like for example the top left blue pin is labelled PC10, disregard the P, it's just C10.

### Now let's set up an STM project
In order to put programs on the NUCLEO board, we have to do it through [STM's IDE](https://www.st.com/en/development-tools/stm32cubeide.html#st-get-software). I hope you like eclipse and 1999 GUI styling. It's called STM32CubeIDE, and yet I have not encountered a single cube in the entire program.

All of my screenshots are in dark theme, which you can enable by doing Window >> Preferences >> Appearance. And Enable theming and switch it to Dark theme.

To create a project for the NUCLEO board, go to File >> New >> STM32 Project.\
After like 20 seconds, it'll pop up this wizard:\
Click the Board Selector

<img width="837" height="631" alt="Screenshot 2026-09-28 at 7 08 30 PM" src="https://github.com/user-attachments/assets/2db98595-ea0b-438f-8bd4-85385bc4a14f" />


Then type NUCLEO-L476RG into the Commercial Part Number

<img width="839" height="634" alt="Screenshot 2026-09-28 at 7 08 55 PM" src="https://github.com/user-attachments/assets/8bb5790a-904d-4496-a79e-879647e7db33" />


Make sure to click on the NUCLEO-L476RG to select it. Then the "Next >" button will become available.

<img width="839" height="633" alt="Screenshot 2026-09-28 at 7 09 26 PM" src="https://github.com/user-attachments/assets/b2bad6d2-451f-457d-a229-3c820a545554" />


Give the project a name, and make sure to select C++ as targeted language. That's the language used in the UFC codebase, so we might as well use it here too.

<img width="445" height="494" alt="Screenshot 2026-09-28 at 7 09 47 PM" src="https://github.com/user-attachments/assets/78df84b2-2041-4afe-8b8a-a69470ca987a" />

It might ask if you want to initialize all peripherals in default mode, and sure. I don't even know what that means but I just click yes.

Then it's going to pop up the ioc configuration.

<img width="841" height="585" alt="Screenshot 2026-09-28 at 7 10 27 PM" src="https://github.com/user-attachments/assets/7c03eb0f-4ca2-48fb-8f3d-df0555fc1460" />


We can go ahead and go to Connectivity >> USART2 and disable it (we won't be needing it for this project)

<img width="838" height="583" alt="Screenshot 2026-09-28 at 7 10 47 PM" src="https://github.com/user-attachments/assets/2d9ef354-dff5-4496-896f-a779276f2a32" />


Hey while we're here though, we can take a look at some of the pin allocations. So remember when I said that all the pins that started with P were good for GPIO. Well it looks like that was once again a lie! This diagram shows us that some of the pins are allocated for certain tasks.

<img width="540" height="521" alt="Screenshot 2026-09-28 at 7 11 11 PM" src="https://github.com/user-attachments/assets/16fa47d4-aacc-4fab-8502-a7f0dc99a4be" />


We can choose to deallocate some of these pins. For example, all the ones labelled in <span style="color:Yellow;">yellow 🟨</span> have their functionality already disabled. So we are safe to deallocate them. To do so, click on the pin and double click the thing that it is selected to.

<img width="543" height="519" alt="Screenshot 2026-09-28 at 7 11 30 PM" src="https://github.com/user-attachments/assets/1e41cc2d-d6fe-48f3-b15a-212543d92b83" />


Some of the pins are <span style="color:Green;">green 🟩</span> though. That means they are actively being used. PC13 is used to detect when the blue user button is being pressed (something we'll use later in the code). PA5 is bound to the internal LED (on the board a little below the RESET button). PC14 and PC15 are used for an external clock which is a literal crystal that just happens to vibrate at exactly 32Khz (plz fact check idk anything about the crystal and i can't even verify if it exists on the boards we use). And finally PA13 and PA14 are used for Serial Wire debugging. This is used for the debugger in STM, and we want to eventually use that so we should keep these pins allocated. Make sure not to connect the LED to any pins that are already being used. So you can't use PC13, PC14, PC15, PA5, PA13, or PA14. Luckily there are still dozens to choose from.

Then click CTRL+S to save. It'll ask you if you want to generate code. And we do! It might make you login for this.

The file we'll be editing is the main.c file.

<img width="665" height="703" alt="Screenshot 2026-09-28 at 7 11 54 PM" src="https://github.com/user-attachments/assets/a3bacdd8-b546-47f9-8ff4-d8245d26f3a2" />

Yikes! That allman swirly brace, and that 2 space indent. It's fine, what we're looking at is the main() function of the entire program. When the NUCLEO board is programmed, this function will run every time you supply power to the board (and right after you program it). So to restart a program, you can simply unplug and plug in the board. The NUCLEO boards also have a RESET button, it's the black button on the right labelled RESET. Pressing this button will also run the main() function.

It looks like the main() function does four things:
- initializes the HAL
- initializes the system clock
- initializes GPIO pins
- enters a loop that never ends

What do these things mean?
- The HAL is the "Hardware Abstraction Layer" (no relation to its 9000 counterpart, don't worry). It makes things easier (usually) than manually setting register values or pin states. We'll be making use of a lot of HAL functions in these examples, and we also use them regularly in the UFC codebase, so it's worth getting to know your way around HAL.
- The system clock is used to keep track of time on the microcontroller, as well as to determine how fast instructions can execute. It can be configured via the ioc file, (this should be discussed in greater detail)

<img width="1007" height="679" alt="Screenshot 2026-09-28 at 7 12 37 PM" src="https://github.com/user-attachments/assets/0f2c8950-8dec-4aa8-9eef-223c37699c46" />


Here we can see that everything is 80MHz, so basically the clock on this microcontroller runs at 80MHz. Most PCs these days are 2.4GHz or more, so slightly more than our little computer here.
- The GPIO pins are what we're going to be using. Let's take a closer look at the GPIO initialization code.

<img width="569" height="670" alt="Screenshot 2026-09-28 at 7 13 03 PM" src="https://github.com/user-attachments/assets/cb0cc7fd-dbdb-48fb-b1bc-870ee7d03ba3" />


Here it is (btw, if your Project Explorer ever goes away just double click one of the files like main.c at the top and it will come back).

So here we can see that we've enabled two clocks, GPIOC and GPIOA. We're also writing RESET to the LD2 pin. That's pin PA5, the internal LED. How did I know that? You can hold CTRL and click on LD2_Pin to see its definition.

<img width="361" height="649" alt="Screenshot 2026-09-28 at 7 13 27 PM" src="https://github.com/user-attachments/assets/a7a0e046-d892-4974-b68c-fd45ecb7a518" />


LD2_GPIO_Port is set to GPIOA, and LD2_Pin is set to GPIO_PIN_5. That means A5 (specifically PA5, but the P is dropped in the code).\
Here we can also see the B1_Pin and port are bounded to PC13, that's the blue user button on the board. We'll see these pins both be set up in MX_GPIO_Init.

Now it's time to set up our LED pin (not to be confused with the internal LED pin). We'll need to initialize whichever pin we are connecting to the LED.\
I'll do my code example with PC10, that's the top left pin on the board (not including the top top of the board. That part can actually snap off as it is just a programmer, but please DO NOT SNAP IT OFF we need it).

So I want to set up PC10 just like they do with PA5.

<img width="508" height="580" alt="Screenshot 2026-09-28 at 7 13 48 PM" src="https://github.com/user-attachments/assets/9bb01721-469b-4e3b-bbb4-0984666d7b06" />


So here I've put my Pin as GPIO_PIN_10, and the port as GPIOC. But what do all of these other fields mean?
- The Mode field refers to one of the many GPIO_mode options. There's stuff like Input, Output, Open Drain, Analog, Alternate Function. Yeah, I don't know what half of those mean either, but it doesn't matter. All we want is OUTPUT_PP, this means output push/pull. Because we want this pin to be an OUTPUT (from the controller) and able to both PUSH (push voltage & current through the pin) and PULL (drain voltage & current from the pin). So basically it can act as a POWER or GND pin, and we can set it however we like within the code! How neat is that!
- The Pull field refers to the default state of the pin. This really only applies when the controller starts up (I think), because once the pin is set (either HIGH or LOW), it will stay that way until it is set again.
- The Speed field refers to the "slew rate" of the pin. Basically, going from 3.3V to 0V doesn't happen instantly (although it is very fast). The slew rate is exactly how fast, well it's not very exact since the possible values are LOW, MEDIUM, HIGH, and VERY_HIGH. We don't need nanosecond precision for our LED so we'll keep it at LOW.

Lastly, we have to make sure that the clock is enabled. At the top of the MX_GPIO_Init function the clocks for GPIOC and GPIOA are enabled. But if you chose a pin from GPIOB, GPIOD, or GPIOH, it won't work unless those clocks are also enabled.

<img width="486" height="630" alt="Screenshot 2026-09-28 at 7 14 15 PM" src="https://github.com/user-attachments/assets/ab85e147-b2fc-485a-ac66-8ce6146bd234" />


Alright so we've successfully initialized our LED pin. Now how do we actually turn it on and off?

Let's go back to the main function and start editing that infinite loop.

We already saw the MX_GPIO_Init function do a write to the LED pin with HAL_GPIO_WritePin, so let's just use that for our LED.

<img width="451" height="159" alt="Screenshot 2026-09-28 at 7 14 35 PM" src="https://github.com/user-attachments/assets/77e3748d-ca02-4bd0-aeb0-d394812163be" />


So it's port C, pin 10, and we want it to SET the pin, which means to bring it HIGH.\
I want to run this program to ensure that it works before we bind the LED to the blue user button.

To run the program, click the green button in the top row. Make sure to save the main.c file first!

<img width="1010" height="49" alt="Screenshot 2026-09-28 at 7 15 01 PM" src="https://github.com/user-attachments/assets/96b1a654-5b58-454f-bb05-b0fc59f9317e" />


Yeah I kind of hate these buttons and wish I could get rid of most of them, and you probably can I just don't know how.

Anyway, a window will pop up for configuration properties. I don't think we have to change anything here so we can just click OK

<img width="822" height="690" alt="Screenshot 2026-09-28 at 7 15 34 PM" src="https://github.com/user-attachments/assets/c802d323-c089-4eb0-a92e-a0bd715b09da" />


It might take a second to compile the program, there should be information on the status in the Console at the bottom. If you don't see a console go to Window >> Show View >> Console. But once it's done compiling and uploading, the LED should turn on!

<img width="408" height="585" alt="Screenshot 2026-09-28 at 7 15 54 PM" src="https://github.com/user-attachments/assets/13428b1e-5f21-4ec9-84d4-a2270b5f86f9" />
<img width="515" height="306" alt="Screenshot 2026-09-28 at 7 16 51 PM" src="https://github.com/user-attachments/assets/811b4765-1b8e-468d-b34c-e2e3cb556574" />


#### Ayo this LED is NOT on
- Ensure that the program compiled and uploaded itself to the STM. The console will tell you if something went wrong.
- Make sure that you initialized and activated the right pin. Consult the chart and check the code and the pin to make sure they match
- Make sure your pin isn't used by anything else. You can check the ioc file to see if something else is allocated to the pin you chose
- Make sure your circuit still works by plugging the wire into the 3.3V pin instead of the GPIO one. If it turns on then it still works, otherwise the breadboard may be set up incorrectly.
- Don't be afraid to ask for help!

If the LED did turn on then you're good! You just coded an LED to turn on. We're literally computer engineering right now! But let's take this just one step further. I want to be able to control the LED using the blue user button on the NUCLEO board. For this we have to READ the state of the PC13 pin in order to determine the state of our LED pin.

Reading a pin's state works very similarly to writing. Instead of calling HAL_GPIO_WritePin, we call HAL_GPIO_ReadPin, and it will return either a GPIO_PIN_SET or GPIO_PIN_RESET.

So, in our infinite loop, we can read the value of pin C13, and use that to write SET or RESET to our LED pin.

<img width="671" height="252" alt="Screenshot 2026-09-28 at 7 17 24 PM" src="https://github.com/user-attachments/assets/636eff57-fd01-4870-9304-a8d17c9c3049" />


Now if we run this... hey the LED is turned on and i'm not pushing the button, and when I push the button it turns off.

STM decided to reverse the user button -> C13 wire. Instead of being SET when you are pushing the button, it gets RESET when the button is held down. So we have to switch the branches in our if statement.

<img width="670" height="254" alt="Screenshot 2026-09-28 at 7 17 45 PM" src="https://github.com/user-attachments/assets/4b8f744a-f211-4582-93c9-bda5c85908e2" />


Button Off | Button On
:-------------------------:|:-------------------------:
<img width="387" height="561" alt="Screenshot 2026-09-28 at 7 18 15 PM" src="https://github.com/user-attachments/assets/85adeb20-dac8-4f1c-9b78-8c164cd58e9e" /> | <img width="382" height="562" alt="Screenshot 2026-09-28 at 7 18 54 PM" src="https://github.com/user-attachments/assets/a6917ec4-87a3-4382-b58f-b547554e33dc" />


And voilà! The LED is controlled by the user button!

<hr>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-1/" class="btn btn-outline">&#10094; Previous: Challenge 1</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-3/" class="btn btn-primary">Next: Challenge 3 &#10095;</a>
</div>
