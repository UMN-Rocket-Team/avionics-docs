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

Here's a picture labeling all of the pins on the NUCLEO-L476RG board because I guess STM didn't feel the need to put the labels on the board itself, we also have a physical wood board with this same picture:

<img width="574" height="464" alt="Screenshot 2026-09-28 at 7 08 01 PM" src="https://github.com/user-attachments/assets/0d61949e-d562-44c4-aa24-b951cbf136ee" />

So whatever pin you decide to use, note down the LETTER and the NUMBER, like for example the top left blue pin is labelled PC10, disregard the P, it's just C10.

### Now let's set up an STM project
STM32 development is split into STM32CubeMX and STM32CubeIDE. CubeMX is used to configure the microcontroller, including pins, clocks, and peripherals, and it stores those configurations in the .ioc file. It can then automatically generate the initialization code for those settings.

In the trainings, we'll be using the .ioc file quite a bit so you can see how the different peripherals and pins are configured. Once you start working on projects, though, we generally won't need to change the .ioc file as often. Many of the things configured through CubeMX can also be configured and controlled directly in code.

STM32CubeIDE is where most of our actual coding, building, debugging, and flashing will happen. CubeMX is essentially a convenient way to configure the hardware and generate the initial setup code for us.

In order to put programs on the NUCLEO board, we have to do it through [STM's IDE](https://www.st.com/en/development-tools/stm32cubeide.html#st-get-software). I hope you like eclipse and 1999 GUI styling. It's called STM32CubeIDE, and yet I have not encountered a single cube in the entire program.

Once STM32CubeIDE is downloaded, we're going to put it to the side. We'll come back to it later.

To create a project for the NUCLEO board, we're going to go through [STM32CubeMX](https://www.st.com/en/development-tools/stm32cubemx.html#st-get-software) first to get an ioc file. 

Once you have CubeMX downloaded, click "Access to Board Selector". 

<img width="1641" height="958" alt="STM32CubeMX Home Dashboard" src="https://github.com/user-attachments/assets/e1cda78d-c3af-482a-9dc9-0d4ca330b503" />

Click the "Board Selector"

<img width="1406" height="818" alt="Screenshot 2026-09-30 at 12 27 03 AM" src="https://github.com/user-attachments/assets/a94fdd70-e1c7-433f-8951-d54f077a00c3" />

Then type "NUCLEO-L476RG" into the "Commercial Part Number"

<img width="1409" height="818" alt="Screenshot 2026-09-30 at 12 28 00 AM" src="https://github.com/user-attachments/assets/9b098e31-a389-41a2-8ec7-58c7d97b6643" />

Click on the NUCLEO-L476RG to select it and then click "Start Project"

<img width="1409" height="818" alt="Screenshot 2026-09-30 at 12 29 48 AM" src="https://github.com/user-attachments/assets/af056f0a-630c-4855-86a9-0013b1de0ef1" />

<img width="1410" height="817" alt="Screenshot 2026-09-30 at 12 30 28 AM" src="https://github.com/user-attachments/assets/9b9bf3ac-5452-46e7-859e-163d32aa1a7a" />

"Board Project Options" will show up. The default settings are fine so just click "OK".

<img width="459" height="480" alt="Screenshot 2026-09-30 at 12 31 52 AM" src="https://github.com/user-attachments/assets/57086137-3d29-4e36-ae1e-e6b86633ab3e" />

Then it's going to pop up the ioc configuration.

<img width="1279" height="749" alt="Screenshot 2026-09-30 at 12 32 23 AM" src="https://github.com/user-attachments/assets/a42844c0-50e4-469d-bddf-896c82341eef" />

We can go ahead and go to Connectivity >> USART2 and disable it (we won't be needing it for this project)

<img width="1279" height="746" alt="Screenshot 2026-09-30 at 12 34 59 AM" src="https://github.com/user-attachments/assets/32745d53-9072-4572-9ac5-f2094d0bb6b7" />

Hey while we're here though, we can take a look at some of the pin allocations. So remember when I said that all the pins that started with P were good for GPIO. Well it looks like that was once again a lie! This diagram shows us that some of the pins are allocated for certain tasks.

<img width="601" height="537" alt="Screenshot 2026-09-30 at 12 36 49 AM" src="https://github.com/user-attachments/assets/05ad4ef9-3d89-456b-a573-7eb6a00a3fb9" />

We can choose to deallocate some of these pins. For example, all the ones labelled in <span style="color: #F8D548;">yellow 🟨</span> have their functionality already disabled. So we are safe to deallocate them. To do so, click on the pin and double click the thing that it is selected to.

<img width="604" height="530" alt="Screenshot 2026-09-30 at 12 37 36 AM" src="https://github.com/user-attachments/assets/dc90284f-77e7-4b88-a060-7bfe8557234e" />

Some of the pins are <span style="color: #D32D7D;">magenta 🟪</span> though. That means they are actively being used. PC13 is used to detect when the blue user button is being pressed (something we'll use later in the code). PA5 is bound to the internal LED (on the board a little below the RESET button). PC14 and PC15 are used for an external clock which is a literal crystal that just happens to vibrate at exactly 32Khz (plz fact check idk anything about the crystal and I can't even verify if it exists on the boards we use). And finally PA13 and PA14 are used for Serial Wire debugging. This is used for the debugger in STM, and we want to eventually use that so we should keep these pins allocated. Make sure not to connect the LED to any pins that are already being used. So you can't use PC13, PC14, PC15, PA5, PA13, or PA14. Luckily there are still dozens to choose from.

It's not going to let you generate code without giving the project a name, so let's go do that. Click on "Project Manager".
<img width="1279" height="749" alt="Screenshot 2026-09-30 at 12 40 05 AM" src="https://github.com/user-attachments/assets/4745bedd-f8c3-422f-80a9-a30de673e23f" />

Name the project. Click on "Browse" to choose a project location. Make sure to switch the "Toolchain / IDE" to "STM32CubeIDE".
<img width="1284" height="752" alt="Screenshot 2026-09-30 at 12 45 20 AM" src="https://github.com/user-attachments/assets/cc8524bc-f16b-460b-be3c-9e7e55bec65a" />

We can finally generate code!

<img width="1278" height="747" alt="Screenshot 2026-09-30 at 12 47 05 AM" src="https://github.com/user-attachments/assets/c6bacf15-82da-44b8-91b4-b1f36e4da314" />

There's going to be multiple successive popups.
We're going to want to accept this one because we need the Firmware packages.

<img width="1031" height="150" alt="Screenshot 2026-09-30 at 12 47 50 AM" src="https://github.com/user-attachments/assets/10caf826-8f42-4352-a318-b4526dc34790" />

It'll ask you if you want to enable notifications. Choose based on your preference. 

<img width="380" height="194" alt="Screenshot 2026-09-30 at 12 48 44 AM" src="https://github.com/user-attachments/assets/c71da829-357f-4fd6-864b-815cf342187e" />

Read the license agreement (or not) and select "I agree".

<img width="610" height="430" alt="Screenshot 2026-09-30 at 12 49 07 AM" src="https://github.com/user-attachments/assets/0c3515de-ae22-48f9-a8db-3bdbb495119e" />

Our code has successfully been generated. Yay!

<img width="377" height="178" alt="Screenshot 2026-09-30 at 12 50 17 AM" src="https://github.com/user-attachments/assets/88446431-51e7-4500-84f6-61d202fd9bd3" />

We can open the project once code generation is complete. This will open up CubeIDE if it is installed.

It will ask you one additional question. Click "YES" to import.

<img width="551" height="163" alt="Screenshot 2026-09-30 at 2 08 22 AM" src="https://github.com/user-attachments/assets/8d8967d2-3135-4750-be48-e4ecc5b1dbef" />

The project has been successfully imported!

<img width="583" height="149" alt="Screenshot 2026-09-30 at 2 08 59 AM" src="https://github.com/user-attachments/assets/aff77750-7240-45d7-81d1-4502db6a8d60" />

The file we'll be editing is the main.c file.

{: .note}
All of my screenshots are in dark theme, which you can enable by doing Window >> Preferences >> Appearance. And Enable theming and switch it to Dark theme.

<img width="1035" height="733" alt="Screenshot 2026-10-02 at 3 31 55 PM" src="https://github.com/user-attachments/assets/4262563d-f042-471e-bd5d-622f55a0a40c" />

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

So here we can see that we've enabled four clocks: GPIOC, GPIOH, GPIOA, and GPIOB. We're also configuring the USART_TX_Pin and the USART_RX_Pin pins. That's pin PA2 and PA3, respectively. How did I know that? You can hold CTRL and click on USART_TX_Pin and USART_RX_Pin to see their definitions.

<img width="578" height="538" alt="Screenshot 2026-10-05 at 1 24 45 AM" src="https://github.com/user-attachments/assets/834ff241-614d-4dbb-bb7e-cb4e050408a6" />

Both USART_TX_GPIO_Port and USART_RX_GPIO_Port are set to GPIOA, and USART_TX_Pin and USART_RX_Pin are set to GPIO_PIN_2 and GPIO_PIN_3, respectively. That means A2 and A3 (specifically PA2 and PA3, but the P is dropped in the code).\

Now it's time to set up our LED pin (not to be confused with the internal LED pin which we'll talk about later). We'll need to initialize whichever pin we are connecting to the LED.\
I'll do my code example with PC10, that's the top left pin on the board (not including the top top of the board. That part can actually snap off as it is just a programmer, but please DO NOT SNAP IT OFF we need it).

So I want to set up PC10 just like they do with PA2 and PA3.

<img width="890" height="824" alt="Screenshot 2026-10-05 at 1 25 22 AM" src="https://github.com/user-attachments/assets/39f182a4-786b-485e-954c-d8271313b5c0" />


So here I've put my Pin as GPIO_PIN_10, and the port as GPIOC. But what do all of these other fields mean?
- The Mode field refers to one of the many GPIO_mode options. There's stuff like Input, Output, Open Drain, Analog, Alternate Function. Yeah, I don't know what half of those mean either, but it doesn't matter. All we want is OUTPUT_PP, this means output push/pull. Because we want this pin to be an OUTPUT (from the controller) and able to both PUSH (push voltage & current through the pin) and PULL (drain voltage & current from the pin). So basically it can act as a POWER or GND pin, and we can set it however we like within the code! How neat is that!
- The Pull field refers to the default state of the pin. This really only applies when the controller starts up (I think), because once the pin is set (either HIGH or LOW), it will stay that way until it is set again.
- The Speed field refers to the "slew rate" of the pin. Basically, going from 3.3V to 0V doesn't happen instantly (although it is very fast). The slew rate is exactly how fast, well it's not very exact since the possible values are LOW, MEDIUM, HIGH, and VERY_HIGH. We don't need nanosecond precision for our LED so we'll keep it at LOW.

Lastly, we have to make sure that the clock is enabled. At the top of the MX_GPIO_Init function the clocks for GPIOC, GPIOH, GPIOA, and GPIOB are enabled. But if you chose a pin from say GPIOH, it won't work unless those GPIOH are also enabled.

<img width="835" height="822" alt="Screenshot 2026-10-05 at 1 26 13 AM" src="https://github.com/user-attachments/assets/83fcf8dd-3d60-4041-9ec7-9505219db2de" />

Alright so we've successfully initialized our LED pin. Now how do we actually turn it on and off?

Let's go back to the main function and start editing that infinite loop.

We already saw the MX_GPIO_Init function do a write to the LED pin with HAL_GPIO_WritePin, so let's just use that for our LED.

<img width="451" height="159" alt="Screenshot 2026-09-28 at 7 14 35 PM" src="https://github.com/user-attachments/assets/77e3748d-ca02-4bd0-aeb0-d394812163be" />


So it's port C, pin 10, and we want it to SET the pin, which means to bring it HIGH.\
I want to run this program to ensure that it works before we bind the LED to the blue user button.

To run the program, click the green button in the top row. Make sure to save the main.c file first!

<img width="895" height="27" alt="Screenshot 2026-10-05 at 1 28 05 AM" src="https://github.com/user-attachments/assets/270d5c9d-05df-4c42-8c7e-7bb7cc02e0ec" />


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

If the LED did turn on then you're good! You just coded an LED to turn on. We're literally computer engineering right now! 

Now, let's take a look at the code `BSP_LED_Init(LED_GREEN)` that CubeMX generated for us.

<img width="748" height="164" alt="Screenshot 2026-10-05 at 1 31 29 AM" src="https://github.com/user-attachments/assets/5b95410c-a736-479a-9e47-1c7c533f8eab" />

`LED_GREEN` is one of the internal LEDs. An internal LED is an LED built into the NUCLEO board. The GPIO pins used for internal LEDs shouldn't be configured for external use since you will lose the lights on the NUCLEO board, but they can since they're just regular GPIO pins.

Lets' try that now.

If you CTRL-click `LED_GREEN`, you will see that it's connect to LED2. 

<img width="198" height="223" alt="Screenshot 2026-10-05 at 1 33 03 AM" src="https://github.com/user-attachments/assets/263eadbd-184c-4b9b-bc32-4754b94bec80" />

Scroll down the .h file to see where `LED2` is defined. We can see that it's set to pin PA5.

<img width="849" height="284" alt="Screenshot 2026-10-05 at 1 34 00 AM" src="https://github.com/user-attachments/assets/1bba9567-b01c-4326-9ffb-ec8a1a106027" />

Let's replace `GPIO_PIN_5` with `GPIO_PIN_10` (where our signal is currently connected to on the NUCLEO board).

<img width="843" height="268" alt="Screenshot 2026-10-05 at 1 36 20 AM" src="https://github.com/user-attachments/assets/c05b6166-4e3f-4bfe-b611-b548d13a673d" />

Reprogramming the board we can see that the LED lights up.

<img width="408" height="585" alt="Screenshot 2026-09-28 at 7 15 54 PM" src="https://github.com/user-attachments/assets/13428b1e-5f21-4ec9-84d4-a2270b5f86f9" />

But let's take this just one step further. I want to be able to control the LED using the blue user button on the NUCLEO board. For this we have to READ the state of the PC13 pin in order to determine the state of our LED pin.

Reading a pin's state works very similarly to writing. Instead of calling HAL_GPIO_WritePin, we call HAL_GPIO_ReadPin, and it will return either a GPIO_PIN_SET or GPIO_PIN_RESET.

So, in our infinite loop, we can read the value of pin C13, and use that to write SET or RESET to our LED pin.

<img width="671" height="252" alt="Screenshot 2026-09-28 at 7 17 24 PM" src="https://github.com/user-attachments/assets/636eff57-fd01-4870-9304-a8d17c9c3049" />


Now if we run this... hey the LED is turned on and I'm not pushing the button, and when I push the button it turns off.

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
