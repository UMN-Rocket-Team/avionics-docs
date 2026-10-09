---
layout: default
title: "Challenge 3: Timers, Interrupts, and Hardware PWM"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-3/
---

# Challenge 3: Timers, Interrupts, and Hardware PWM

This challenge assumes you completed Challenge 2 and lived to tell the tale of STM32's inverted blue button logic.

#### What you'll need
- Software: STM32CubeIDE & STM32CubeMX
- Hardware: NUCLEO-L476RG board, breadboard, external LED, and $330\,\Omega$ resistor

In Challenge 2, you got an LED to turn on when you pressed a button. That's neat, but if you want the LED to blink on its own, what do you do? 

If you've ever messed with an Arduino or a basic coding class, your instinct might be: "Just tell the code to sleep for a bit." But in bare-metal embedded programming, forcing your CPU to sit in a dumb delay loop while waiting for time to pass is a cardinal sin. If your microcontroller is spending all its time counting down seconds, it can't listen to sensors, talk to flight computers, or respond to emergency shutoffs.

Instead, we're going to teach the **hardware** to count time for us using **Timers**, **Interrupts**, and **PWM**.

---

### How a Timer Actually Works

Your microcontroller runs off a clock signal that ticks at a blistering pace. On our NUCLEO-L476RG board, this internal clock defaults to **4 MHz** (4,000,000 ticks per second), or **80 MHz** if you configured the PLL.

If you tried to blink an LED once every clock tick, it would turn on and off millions of times a second. You wouldn't see it blinking—it would just look solidly dim, and your board might accidentally broadcast radio static.

To make things human-speed, timers give us two hardware gears:

1. **Prescaler (PSC):** The down-shifter. It divides the high-speed clock down to a slower rhythm. The timer only counts up by one tick every $(PSC + 1)$ clock pulses.
2. **Counter Period (ARR / Auto-Reload Register):** The finish line. The timer starts at $0$, counts up to ARR, and the instant it steps past ARR, it slams back to $0$ and sounds an alarm.

{: .note}
**Analogy:** The prescaler decides how fast you walk (1 step every 10 seconds), and ARR is how many steps you take before your phone's timer goes off.

[Image: Block diagram of Clock -> Prescaler -> Counter Register -> Compare with ARR -> Update Event]

#### The Golden Formula
$$\text{Interrupt Frequency (Hz)} = \frac{\text{Timer Clock Frequency}}{(\text{PSC} + 1) \times (\text{ARR} + 1)}$$

**Why the $+1$?** Digital hardware is 0-indexed. If you set `PSC = 0`, it divides by $0 + 1 = 1$ (no division). If you set `PSC = 3999`, it counts 4000 ticks before advancing. Don't let the $+1$ sneak up on you.

---

### What on Earth is an Interrupt?

Normally, your microcontroller runs code from top to bottom inside that infinite `while (1)` loop. 

An **interrupt** is the hardware equivalent of tapping someone on the shoulder and saying, *"Drop what you're doing right now, handle this emergency, and then pick up where you left off."*

Instead of writing code that constantly asks *"Is it 1 second yet? How about now? Now?"* (polling), we configure the timer to trigger an interrupt when it hits its ARR limit. The **NVIC** (Nested Vectored Interrupt Controller—yes, STM love ridiculous acronyms) pauses `main()`, executes a special function called a **Callback**, and then throws the CPU right back into `main()`.

---

### Blinking an LED with Zero CPU Effort

Let's make the onboard green LED (`PA5` / `LD2`) blink once every second, with our `while (1)` loop completely empty.

#### Step 1: Check your Timer Clock
Open your `.ioc` file and click the **Clock Configuration** tab. Trace the line to **HCLK**:
- By default, it's **80 MHz**. 

Write this number down; you need it for the math later.

<img width="1512" height="949" alt="Screenshot 2026-10-09 at 12 31 34 AM" src="https://github.com/user-attachments/assets/7ae1c844-ee34-4d02-9779-83e60a0e60fc" />

#### Step 2: Configure TIM2 in the .ioc
1. Go back to Pinout & Configuration
2. In the left sidebar under **Timers**, click **TIM2**.
3. Change **Clock Source** to **Internal Clock**.
4. Go to the **NVIC Settings** tab and check **TIM2 global interrupt**. 

{: .warning}
If you forget to check the NVIC box, the timer will count happily in silence and never tell the CPU. Your LED will never blink, and you will spend an hour questioning your life choices.

<img width="1512" height="949" alt="Screenshot 2026-10-09 at 12 35 45 AM" src="https://github.com/user-attachments/assets/a43210b5-a4a0-430b-b6ed-96a8627fde6b" />

4. Click the **Parameter Settings** tab. We want the timer to fire an interrupt once per second (1 Hz).

| Timer Clock | Prescaler (PSC) | Counter Period (ARR) | Interrupt Frequency |
| :--- | :--- | :--- | :--- |
| **80 MHz** | `7999` | `9999` | 1 Hz |

Wait! How did we get the Prescaler and Counter Period again? 
$80,000,000 \div (8000 \times 10000) = 1 Hz.

<img width="1512" height="949" alt="Screenshot 2026-10-09 at 12 47 47 AM" src="https://github.com/user-attachments/assets/0f6c5b32-dbaa-4816-a14d-0ba59ec3242e" />

Notice that TIM2 on the STM32L476 is a 32-bit timer, so its Counter Period can go all the way up to $4,294,967,295$, whereas the prescaler is 16-bit (max $65,535$).

#### Step 3: Write the Code
Regenerate code and switch to `main.c`. 

<img width="1512" height="949" alt="Screenshot 2026-10-09 at 12 50 47 AM" src="https://github.com/user-attachments/assets/64faabc6-796a-4de9-a319-e5d8f3f80554" />

We're going to initialize the timer with an interrupt in `main()`.

<img width="734" height="647" alt="Screenshot 2026-10-09 at 12 58 19 AM" src="https://github.com/user-attachments/assets/b9f13f08-8b0c-48d3-ad53-7e92e1ba9e31" />

{: .note}
- The _IT suffix stands for Interrupt.
- Plain HAL_TIM_Base_Start() would count, but wouldn't interrupt the CPU!

Now scroll down near the bottom of main.c (around USER CODE BEGIN 4) and add the callback. We're going to configure it to PA5 (the internal pin from Challenge 2)

<img width="492" height="115" alt="Screenshot 2026-10-09 at 1 26 43 AM" src="https://github.com/user-attachments/assets/1543c3a4-7bfa-497a-a5bf-d1d374510664" />

You're probably wondering where this callback came from. It comes from the HAL timer library. 
Where is that? It's in Drivers >> STM32L4xx_HAL_Driver >> Src >> stm32l4xx_hal_tim.c

<img width="282" height="718" alt="Screenshot 2026-10-09 at 1 06 44 AM" src="https://github.com/user-attachments/assets/7d051d04-c0fd-443e-869e-1401901a3c88" />

We'll open that file up and CTRL-F (search inside document) `HAL_TIM_PeriodElapsedCallback`. Using the down arrow key on the search bar, we'll find the callback.

<img width="661" height="199" alt="Screenshot 2026-10-09 at 1 09 22 AM" src="https://github.com/user-attachments/assets/3405376b-4619-4496-a772-676e75bab9b6" />

It looks kind of weird here. That's because unused functions will have a compilation warning, so adding "__weak void" and "UNUSED(htim) mitigates that issue.

Since we changed our pin, we need to rewire our circuit. Let's hook up the positive side of the LED to SCK/D13. The rest can stay the same.

<img width="2450" height="2504" alt="IMG_2270" src="https://github.com/user-attachments/assets/d3d62146-243d-4c47-8b8b-8b81c39d0d2f" />

Now let's go back to main.c. We can leave our while (1) loop completely empty. 

Build the project, hit the green Run button to flash your board.

<video width="100%" height="auto" controls>
  <source src="{{ '/assets/videos/video1.mov' | relative_url }}" type="video/mov">
  Your browser does not support the video tag.
</video>

If you look closely, you'll notice LD2 on the NUCLEO board and the external LED are both blinking. Remember from Challenge 2, this is because we hooked the external LED to the same pin as the internal LED (PA5).

Now, look at your while loop!

<img width="268" height="144" alt="Screenshot 2026-10-09 at 1 13 16 AM" src="https://github.com/user-attachments/assets/bb668a22-ceaa-48a6-b59c-af25d9501202" />

It's empty. Nothing is in it. Yet your green LED is flashing like clockwork.

The CPU isn't running in circles or burning power; the timer counts on its own, wakes the CPU for 5 microseconds to toggle PA5, and the CPU goes right back to doing nothing.

Ayo, it’s not blinking?
- Did you enable the checkbox in NVIC Settings? (Seriously, check this first).
- Did you wire the breadboard properly?
- Did you call HAL_TIM_Base_Start_IT instead of HAL_TIM_Base_Start?
- Did you misspell HAL_TIM_PeriodElapsedCallback? It has to match ST's exact naming or the linker won't hook it up.
- Did you write your callback inside /* USER CODE BEGIN 4 */? If not, regenerating the .ioc will delete it.

## Blinking Two LEDs at Different Speeds

One LED is neat. Two LEDs blinking at completely different rates, without any delay loops, is where embedded hardware gets fun.

We can do this by using a second timer.

#### Blinking Multiple LEDs
Let's plug an external LED into breadboard pin PC10, just like you wired pins in Challenge 2.

Pick pin PC10 in your .ioc, set it to GPIO_Output.

<img width="595" height="544" alt="Screenshot 2026-10-09 at 1 54 38 AM" src="https://github.com/user-attachments/assets/ee5cd0af-0114-4fe7-bd4c-da618d764be6" />

Choose another LED and a resistor of the same resistance.

Open TIM3 in the .ioc and set it up like timer 2.
- Clock Source: Internal Clock
- NVIC Settings: enable the TIM3 global interrupt
- Parameter Settings: let's make this LED toggle every $250\text{ ms}$ (4 times per second).
  What is the PSC and ARR?
  PSC = 7999, ARR = 2499.
  $\frac{80,000,000}{8000 \times 2500} = 4\text{ Hz}$.

<img width="1512" height="949" alt="Screenshot 2026-10-09 at 2 14 49 AM" src="https://github.com/user-attachments/assets/91102d64-f813-450b-90b7-5ff7189c0df1" />

Generate code and add timer 3 to main():

<img width="735" height="665" alt="Screenshot 2026-10-09 at 2 10 41 AM" src="https://github.com/user-attachments/assets/9dbc19fc-e134-4978-ad99-467bef6fba5b" />

Add timer 3 to callback:

<img width="502" height="173" alt="Screenshot 2026-10-09 at 2 12 06 AM" src="https://github.com/user-attachments/assets/a801e807-800a-49a2-a215-0da07b821f75" />

Flash the board. 

<video width="100%" height="auto" controls>
  <source src="{{ '/assets/videos/video2.mov' | relative_url }}" type="video/mov">
  Your browser does not support the video tag.
</video>

Two independent blinking LEDs!

### Part 3: Pulse Width Modulation (PWM)

Up until now, our pins have been strictly binary: 3.3V (HIGH) or 0V (LOW). What if we want an LED at half brightness? Microcontrollers can't output an analog 1.65V on regular GPIOs. Instead, we use a trick called Pulse Width Modulation (PWM). We switch the pin between 3.3V and 0V hundreds of times a second. If it spends 50% of each cycle ON and 50% OFF, your eyes can't track the flashing and perceive it as half brightness.

<img width="859" height="397" alt="Screenshot 2026-10-09 at 2 43 44 AM" src="https://github.com/user-attachments/assets/c5c5dc97-f0f3-4ce8-915f-4222e3f2beb9" />
[image source](https://pico.implrust.com/core-concepts/pwm/basic-concepts.html)

$$\text{Duty Cycle (\%)} = \frac{\text{CCR}}{\text{ARR} + 1} \times 100$$ARR sets the total cycle period (the frequency). 
CCR (Capture/Compare Register) sets how many counts the pin stays HIGH during that cycle. When the counter hits CCR, the hardware drives the pin LOW. When the counter hits ARR, the hardware rolls over to $0$ and pulls the pin HIGH again. The killer feature? PWM runs 100% in silicon. No interrupts, no CPU wake-ups, no callbacks. Once you tell the timer to start, the pin dims itself while your code is free to do whatever it wants.

### Dimming the LED

Remember how PA5 is hooked to LED2 on the NUCLEO? If you look closely at the pinout, PA5 is also internally wired to TIM2_Channel_1. 

In the pinout view, right click on PA5 to unlock pin.

<img width="486" height="533" alt="Screenshot 2026-10-09 at 2 48 52 AM" src="https://github.com/user-attachments/assets/01b4add6-6088-4ee1-8d91-4fdf187f5e7a" />

Now click on PA5 again and select TIM2_CH1.

<img width="505" height="513" alt="Screenshot 2026-10-09 at 2 49 22 AM" src="https://github.com/user-attachments/assets/1303b9db-a3a9-4e0f-a177-a252fd2956a0" />

Go to TIM2, under Timers, and set Channel 1 = PWM Generation CH1.

<img width="1512" height="949" alt="Screenshot 2026-10-09 at 2 56 21 AM" src="https://github.com/user-attachments/assets/d33e71cc-db2b-4322-92d9-ed04ddff92dc" />

In Parameter Settings: We want a $1\text{ kHz}$ PWM signal with $1000$ brightness levels ($0 \to 999$).
- Set Prescaler (PSC) = 79. This configures the timer to tick at exactly $1\text{ MHz}$ ($1\,\mu\text{s}$ per tick).
- Set Counter Period (ARR) = 999 ($1000$ ticks at $1\,\mu\text{s} = 1\text{ ms} \implies 1\text{ kHz}$).
  <img width="1512" height="949" alt="Screenshot 2026-10-09 at 2 58 10 AM" src="https://github.com/user-attachments/assets/ced20fe9-39a4-4599-a165-c89fe3437913" />
- Leave the NVIC interrupt checkbox unchecked since we're not using interrupts anymore
- Note: We don't need interrupts for PWM!

Generate code and head to main.c. 

You can replace your interrupts with `HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1)`.

<img width="743" height="662" alt="Screenshot 2026-10-09 at 3 01 40 AM" src="https://github.com/user-attachments/assets/e8bba776-963e-4c81-8032-f7a8e95d2429" />

Now you can set the brightness anywhere using one macro: `__HAL_TIM_SET_COMPARE`. 

{: .note} Comment out `BSP_LED_Init(LED_GREEN)` if you put the compare function above internal LED initialization otherwise it'll reconfigure the pin as a GPIO pin.

<img width="743" height="675" alt="Screenshot 2026-10-09 at 3 16 02 AM" src="https://github.com/user-attachments/assets/b46b9ca5-49f3-4ae0-92b4-55f4554e14f0" />

<img width="2420" height="2666" alt="IMG_2274" src="https://github.com/user-attachments/assets/a04c683c-2f82-4731-a733-633726973f29" />

Try putting different numbers in: 0 (off), 250 (quarter), 500 (half), and 999 (full blast).

#### Fade LED
Let's make the LED fade smoothly in and out. We can step the brightness up and down, or update the compare register in small steps. Here is how you can sweep the brightness register:

<img width="596" height="424" alt="Screenshot 2026-10-09 at 3 40 20 AM" src="https://github.com/user-attachments/assets/60f16598-a406-462e-ae2c-b33732b7141b" />

{: .note} 
Why (i * i) / 999? Human eyes perceive light non-linearly (Weber-Fechner Law). Going from 1% to 10% brightness looks like a massive leap, but going from 80% to 90% is barely noticeable. Squaring the value produces a clean, cinematic fade.

<video width="100%" height="auto" controls>
  <source src="{{ '/assets/videos/video3.mov' | relative_url }}" type="video/mov">
  Your browser does not support the video tag.
</video>

Want proof that PWM and regular LED blinking are the exact same mechanism? Go back into your .ioc file, leave ARR = 999, but change the Prescaler to 79999. Re-flash your code. 

{: .note}
Remember that `BSP_LED_Init(LED_GREEN)` will not be commented out after code generation because it's not inside `USER CODE`

Your PWM signal is now running at a glacial 1 Hz (1 full second per cycle). Change the prescaler back to 79, and that slow blink blurs right back into smooth brightness. Dimming is literally just blinking faster than your eyeballs can process!

<hr>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-2/" class="btn btn-outline">&#10094; Previous: Challenge 2</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-4/" class="btn btn-primary">Next: Challenge 4 &#10095;</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-2/" class="btn btn-outline">&#10094; Previous: Challenge 2</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-4/" class="btn btn-primary">Next: Challenge 4 &#10095;</a>
</div>
