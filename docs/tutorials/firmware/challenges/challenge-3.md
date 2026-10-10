---
layout: default
title: "Challenge 3: Timers, Interrupts, and PWMs"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-3/
---

<script>
  window.MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
    svg: { fontCache: 'global' }
  };
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>

<style>
  .video-container {
    width: 100%;
    max-width: 900px;
    margin: 1.25rem auto;
  }
  .video-container video {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
  }
</style>

# Challenge 3: Timers, Interrupts, and PWMs

Welcome back! This challenge builds on Challenge 2, where you met the STM32's slightly confusing blue-button logic. If your button works, you're ready to make time itself do some work for you.

#### What you'll learn

By the end of this challenge you will be able to:

- Explain what a hardware **timer** is and calculate its speed using the **prescaler** and **counter period**.
- Explain what an **interrupt** is and why it beats constantly checking ("polling").
- Blink LEDs at different speeds with an empty `while (1)` loop.
- Dim and fade an LED using **PWM** (Pulse Width Modulation).

#### What you'll need

- Software: STM32CubeIDE & STM32CubeMX
- Hardware: NUCLEO-L476RG board, breadboard, external LED, and resistors

---

## Why Do We Need Timers?

In Challenge 2, you got an LED to turn on when you pressed a button. That's neat, but what if you want the LED to blink on its own?

If you've used Arduino or written beginner programs, you might be thinking, "Can't I just tell the code to wait for a bit?" You can. It usually looks something like this:

```c
HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
HAL_Delay(1000);   // wait 1000 ms
```

This works, but `HAL_Delay()` is a **busy-wait**: the CPU sits there counting and can't do anything else until the delay is over. On a real project (say, a rocket's flight computer) the CPU might need to read sensors, talk to other boards, or react to something important. A CPU stuck in a delay can't do any of that.

So instead, we're going to teach the **hardware** to count time for us. Three tools make that happen:

| Tool | What it does |
| :--- | :--- |
| **Timer** | A counter built into the chip that counts clock ticks all by itself. |
| **Interrupt** | A signal sent by the timer to pause the CPU and execute a dedicated task (like updating a clock or sampling a sensor) whenever an interval or counter limit is reached. |
| **PWM** | A way for the timer to flip a pin on and off on its own, with no CPU help at all. |

---

## How a Timer Actually Works

Your microcontroller has a **clock**: a signal that ticks very, very quickly. A **timer** is a little piece of hardware that counts those ticks. Think of it as a stopwatch that never gets tired and never asks the CPU for help.

The NUCLEO-L476RG can run with different clock configurations, so don't assume one frequency for every project. In this challenge, we'll use an **80 MHz timer clock** for all the calculations (that's 80 million ticks per second). Check your own project's clock configuration, and confirm the clock actually feeding your timer. It isn't always the same as HCLK, which we'll look at in Step 1.

If the timer counted every single clock tick and you blinked an LED once per tick, the LED would turn on and off tens of millions of times a second. You wouldn't see any blinking. It would just look solidly (and slightly dimly) on.

To get to human speed, timers give us two hardware "gears":

1. **Prescaler (PSC):** The down-shifter. It divides the fast clock down to a slower rhythm. The counter only goes up by one every $(PSC + 1)$ clock ticks.

2. **Counter Period (ARR / Auto-Reload Register):** The finish line. The counter starts at $0$ and counts up to ARR. On the next tick it rolls back to $0$ and fires an **update event** (an alarm saying "I finished a lap!"). Then it starts over, forever.

{: .note}
**Analogy:** The prescaler decides how fast you walk (say, 1 step every 10 seconds), and ARR is how many steps you take before your phone's timer goes off. Slower walking or a longer trip both mean a longer wait.

**Timer flow:** Clock source → Prescaler (PSC) → Counter → Compare against ARR → Update event (then the counter resets and repeats)

The timer does all of this in hardware. Your code only has to set it up and start it.

### The Golden Formula

$$\text{Update Frequency (Hz)} = \frac{\text{Timer Clock Frequency}}{(\text{PSC} + 1) \times (\text{ARR} + 1)}$$

In plain English: take the clock speed, divide it by the prescaler (that's the down-shift), then divide it by the number of counts per lap. What's left is how many laps (update events) happen per second.

**Why the $+1$?** Digital hardware counts from $0$, not from $1$. If you set `PSC = 0`, the timer divides by $0 + 1 = 1$ (no division at all). If you set `PSC = 7999`, it divides by $8000$. Likewise, an ARR of $9999$ means the counter goes $0, 1, 2, \dots, 9999$, which is $10{,}000$ counts. Don't let the $+1$ sneak up on you.

**Worked example.** With an 80 MHz clock, `PSC = 7999`, and `ARR = 9999`:

1. After the prescaler: $\dfrac{80{,}000{,}000}{7999 + 1} = 10{,}000$ ticks per second. Each tick is $100\ \mu s$.
2. One lap is $9999 + 1 = 10{,}000$ ticks.
3. So one lap takes $\dfrac{10{,}000 \text{ ticks}}{10{,}000 \text{ ticks/s}} = 1$ second, which is $1\text{ Hz}$.

### How to Pick a Prescaler and Counter Period

The formula tells you what a PSC and ARR _do_, but in practice you'll start from the other end: "I want something to happen X times per second. What do I type into CubeMX?" Here's a recipe that works every time.

**Step A: Find the total divide.** Take your timer clock and divide by the frequency you want:

$$(\text{PSC} + 1) \times (\text{ARR} + 1) = \frac{\text{Timer Clock}}{\text{Target Frequency}}$$

For a 2 Hz interrupt (a toggle every 500 ms) on an 80 MHz clock, that's $\dfrac{80{,}000{,}000}{2} = 40{,}000{,}000$. Now we have to split $40{,}000{,}000$ into two numbers that multiply together.

**Step B: Pick the prescaler to get a friendly tick rate.** Don't guess randomly. Decide how fast you want the counter to tick, and let that choose the prescaler:

$$\text{PSC} + 1 = \frac{\text{Timer Clock}}{\text{Tick Rate}}$$

Round tick rates are easiest to think in:

| Tick rate | PSC (with an 80 MHz clock) | Time per tick |
| :--- | :--- | :--- |
| 1 MHz | 79 | 1 µs |
| 100 kHz | 799 | 10 µs |
| 10 kHz | 7999 | 100 µs |
| 1 kHz | 79999 (too big for the 16-bit prescaler!) | 1 ms |

For our 2 Hz example, pick a 10 kHz tick rate, so $\text{PSC} = 7999$.

**Step C: Let ARR finish the job.** Now figure out how many ticks make up one lap:

$$\text{ARR} + 1 = \frac{\text{Tick Rate}}{\text{Target Frequency}}$$

At a 10 kHz tick rate and a 2 Hz target, $\text{ARR} + 1 = \dfrac{10{,}000}{2} = 5000$, so $\text{ARR} = 4999$.

**Step D: Check your work.** Plug both numbers back into the golden formula: $\dfrac{80{,}000{,}000}{8000 \times 5000} = 2\text{ Hz}$. 
{: .note}
Don't forget the $-1$ in Step B and Step C. You compute $\text{PSC} + 1$ and $\text{ARR} + 1$, then subtract one before typing the values into CubeMX.

#### Rules to keep in mind

- **Respect the size limits.** The prescaler is 16-bit, so $\text{PSC} \le 65{,}535$. ARR is 32-bit on TIM2 but 16-bit on most other timers (like TIM3), so $\text{ARR} \le 65{,}535$ there. If a value doesn't fit, move some of the division into the other register. For example, a 1 Hz tick with `PSC = 0` would need $\text{ARR} = 79{,}999{,}999$. That's fine on TIM2 but impossible on TIM3.
- **Prefer numbers that divide evenly.** If the division isn't a whole number (say, 3 Hz from 80 MHz), you can't hit it exactly. Pick the nearest whole numbers and accept a tiny error. For most LED blinking, nobody will notice.
- **Slow timing: the split doesn't matter much.** For the blinking sections, many PSC/ARR pairs give the same frequency. Pick one that's easy to read, like a 10 kHz tick rate.
- **PWM: favor a bigger ARR.** ARR sets how many brightness levels you get. With `ARR = 999` you get 1000 steps of brightness, but with `ARR = 9` you'd only get 10. That's why the PWM section below uses a fast 1 MHz tick rate and lets ARR do the work.

#### Cheat sheet (80 MHz timer clock)

| Goal | Tick rate | PSC | ARR |
| :--- | :--- | :--- | :--- |
| 1 Hz interrupt | 10 kHz | 7999 | 9999 |
| 2 Hz interrupt | 10 kHz | 7999 | 4999 |
| 4 Hz interrupt | 10 kHz | 7999 | 2499 |
| 10 Hz interrupt | 10 kHz | 7999 | 999 |
| 100 Hz interrupt | 10 kHz | 7999 | 99 |
| 1 kHz PWM, 1000 brightness levels | 1 MHz | 79 | 999 |
| 50 Hz PWM (what hobby servos use) | 1 MHz | 79 | 19999 |

<details>
  <summary>Try it: what are the PSC and ARR for a 5 Hz interrupt?</summary>
  Total divide: $\dfrac{80{,}000{,}000}{5} = 16{,}000{,}000$.
  <br>
  Pick a 10 kHz tick rate, so $\text{PSC} + 1 = 8000$ and $\text{PSC} = 7999$.
  <br>
  Then $\text{ARR} + 1 = \dfrac{10{,}000}{5} = 2000$, so $\text{ARR} = 1999$.
  <br>
  Check: $\dfrac{80{,}000{,}000}{8000 \times 2000} = 5\text{ Hz}$. ✅
</details>

---

## What on Earth is an Interrupt?

Normally, your microcontroller runs code from top to bottom, and then loops forever inside `while (1)`.

An **interrupt** is the hardware equivalent of tapping someone on the shoulder and saying, _"Drop what you're doing right now, handle this, and then pick up where you left off."_

Think of it like reading a book when your phone buzzes. You put a finger on your page, answer the text, then go right back to where you were. You didn't have to look at your phone every ten seconds to see if anything came in.

Instead of writing code that constantly asks _"Is it 1 second yet? How about now? Now?"_ (this is called **polling**), we set up the timer to raise an interrupt when it hits its ARR limit.

Here's the chain of events when that happens:

1. The timer finishes a lap and raises an interrupt request.
2. The **NVIC** (Nested Vectored Interrupt Controller, because embedded systems _love_ acronyms) is the traffic cop that decides whether the CPU should respond, and which piece of code to jump to.
3. The CPU pauses `main()` and runs the timer's interrupt handler, which lives inside the HAL library.
4. The HAL calls a function we get to write ourselves, called a **callback**. This is where we put our own code (like toggling an LED).
5. When the callback finishes, the CPU goes right back to what it was doing.

{: .note}
Keep callbacks short and quick. While the CPU is inside an interrupt, it isn't running anything else. Toggling a pin is perfect. Waiting around or doing heavy math is not.

---

## Blinking an LED with an Interrupt

Let's toggle the onboard green LED (`PA5` / `LD2`) once per second, with our `while (1)` loop completely empty. Since each toggle flips the LED, a full ON-then-OFF cycle takes about two seconds.

### Step 1: Check your Timer Clock

Before we do any math, we need to know how fast our timer's clock is.

Open your `.ioc` file and click the **Clock Configuration** tab. This diagram shows how the clock signal travels through the chip. Trace the line to **HCLK** (the main system clock):

- If your board is set up for full speed, it's **80 MHz**.

Write this number down. You need it for the math later.

{: .note}
Timers don't connect to HCLK directly. They hang off a "peripheral bus" (TIM2 and TIM3 are on APB1). If the APB1 prescaler is set to `/1`, as it is in the default 80 MHz setup, the timer clock equals HCLK. If you ever see a different divider there, your timer clock will be different too.

<img width="1512" height="949" alt="CubeMX Clock Configuration tab showing HCLK at 80 MHz" src="https://github.com/user-attachments/assets/7ae1c844-ee34-4d02-9779-83e60a0e60fc" />

### Step 2: Configure TIM2 in the .ioc

1. Go back to the **Pinout & Configuration** tab.
2. In the left sidebar under **Timers**, click **TIM2**.
3. Change **Clock Source** to **Internal Clock**. This tells the timer to count ticks from the chip's own clock instead of an external signal.
4. Go to the **NVIC Settings** tab and check **TIM2 global interrupt**. This is what lets the timer actually interrupt the CPU.

{: .warning}
If you forget to check the NVIC box, the timer will count happily in silence and never tell the CPU. Your LED will never blink, and you will spend an hour questioning your life choices.

<img width="1512" height="949" alt="TIM2 NVIC Settings tab with TIM2 global interrupt enabled" src="https://github.com/user-attachments/assets/a43210b5-a4a0-430b-b6ed-96a8627fde6b" />

5. Click the **Parameter Settings** tab. We want the timer to fire an interrupt once per second (1 Hz). Using our golden formula, these values work:

| Timer Clock | Prescaler (PSC) | Counter Period (ARR) | Interrupt Frequency |
| :--- | :--- | :--- | :--- |
| **80 MHz** | 7999 | 9999 | 1 Hz |

Wait, how did we get those numbers? Plug them back into the formula:

$$\frac{80{,}000{,}000}{(7999+1) \times (9999+1)} = \frac{80{,}000{,}000}{8000 \times 10{,}000} = 1 \text{ Hz}$$

There's more than one "right" answer here. For example, `PSC = 79` and `ARR = 999999` also gives 1 Hz. What matters is that the product $(PSC+1) \times (ARR+1)$ equals $80{,}000{,}000$. We picked `PSC = 7999` by choosing a friendly 10 kHz tick rate first, then letting ARR finish the job. See [How to Pick a Prescaler and Counter Period](#how-to-pick-a-prescaler-and-counter-period) above for the full recipe.

<img width="1512" height="949" alt="TIM2 Parameter Settings with Prescaler 7999 and Counter Period 9999" src="https://github.com/user-attachments/assets/0f6c5b32-dbaa-4816-a14d-0ba59ec3242e" />

{: .note}
Different timers have different sizes. **TIM2** on the STM32L476 is a **32-bit timer**, so its Counter Period can go all the way up to $2^{32} - 1 = 4{,}294{,}967{,}295$. Most other timers (like TIM3) are **16-bit**, so their max is $2^{16} - 1 = 65{,}535$. The **prescaler** is always **16-bit** (max $65{,}535$). If a number you want is too big to fit, shift the work between the prescaler and the period.

### Step 3: Write the Code

Click **Generate Code** (or save the `.ioc` and accept the prompt), then open `main.c`.

<img width="1512" height="949" alt="Generating code from the .ioc file in STM32CubeIDE" src="https://github.com/user-attachments/assets/64faabc6-796a-4de9-a319-e5d8f3f80554" />

First, we start the timer with its interrupt turned on. Add this inside `main()`, in the `USER CODE BEGIN 2` section (after all the `MX_..._Init()` calls):

<img width="734" height="647" alt="main.c with HAL_TIM_Base_Start_IT(&htim2) added in USER CODE BEGIN 2" src="https://github.com/user-attachments/assets/b9f13f08-8b0c-48d3-ad53-7e92e1ba9e31" />

{: .note}
- `htim2` is the handle (a struct) that CubeMX generated to represent TIM2.
- The `_IT` suffix stands for **Interrupt**.
- Plain `HAL_TIM_Base_Start()` would start counting, but it wouldn't interrupt the CPU!

Now scroll down near the bottom of `main.c` (around `USER CODE BEGIN 4`) and add the callback. This is the function the HAL calls every time a timer finishes a lap. We'll toggle `PA5`, the same pin as the onboard LED from Challenge 2:

<img width="492" height="115" alt="PeriodElapsedCallback toggling PA5 in USER CODE BEGIN 4" src="https://github.com/user-attachments/assets/1543c3a4-7bfa-497a-a5bf-d1d374510664" />

The `if (htim->Instance == TIM2)` check matters: **every** timer shares this one callback. Right now only TIM2 exists, but in a minute we'll add TIM3, and this check is how we tell them apart.

You're probably wondering where this callback came from. It comes from the HAL timer library.

Where is that? It's in **Drivers → STM32L4xx_HAL_Driver → Src → stm32l4xx_hal_tim.c**.

<img width="282" height="718" alt="Project Explorer showing stm32l4xx_hal_tim.c in the HAL driver Src folder" src="https://github.com/user-attachments/assets/7d051d04-c0fd-443e-869e-1401901a3c88" />

Open that file and press **Ctrl+F** (search inside the document) for `HAL_TIM_PeriodElapsedCallback`. Use the down arrow in the search bar to find the definition.

<img width="661" height="199" alt="The weak definition of HAL_TIM_PeriodElapsedCallback in stm32l4xx_hal_tim.c" src="https://github.com/user-attachments/assets/3405376b-4619-4496-a772-676e75bab9b6" />

It looks kind of weird there. Two things are going on:

- **`__weak`** means "this is only a default version." If you write your own function with the same name (like we just did), the compiler uses yours instead. If you don't, this empty default runs and nothing happens. That's why the name has to match _exactly_.
- **`UNUSED(htim)`** tells the compiler "yes, I know this function doesn't use its parameter" so it doesn't print a warning about it.

Since we're using `PA5` for the interrupt blink, let's also wire up the external LED. Hook the positive side (the longer leg) of the LED, through a resistor, to **SCK/D13**, which is the Arduino-header name for `PA5`. The rest of the circuit can stay the same.

<img width="2450" height="2504" alt="Breadboard wiring with the LED connected to D13 (PA5)" src="https://github.com/user-attachments/assets/d3d62146-243d-4c47-8b8b-8b81c39d0d2f" />

Now go back to `main.c`. Leave your `while (1)` loop completely empty.

Build the project, then hit the green Run button to flash your board.

<div class="video-container">
  <video controls playsinline preload="metadata">
    <source src="{{ '/assets/videos/video1.mp4' | relative_url }}" type="video/mp4">
    Your browser does not support embedded video. You can <a href="{{ '/assets/videos/video1.mp4' | relative_url }}">open the video directly</a>.
  </video>
</div>

If you look closely, you'll notice LD2 on the NUCLEO board and the external LED are both blinking. As in Challenge 2, that's because we hooked the external LED to the same pin as the internal LED (`PA5`).

Now, look at your `while` loop:

<img width="268" height="144" alt="An empty while(1) loop in main.c" src="https://github.com/user-attachments/assets/bb668a22-ceaa-48a6-b59c-af25d9501202" />

It's empty. Nothing is in it. Yet your green LED is flashing like clockwork.

That's the whole point. The timer runs in hardware and requests attention when its period elapses. The callback toggles `PA5`, then the program returns to whatever it was doing. The CPU is free to do other work in the meantime. (How long the interrupt takes depends on your code and system, which is why we keep callbacks short.)

### Ayo, it's not blinking?

- Did you enable the checkbox in NVIC Settings? (Seriously, check this first.)
- Did you wire the breadboard properly, with the LED the right way around and a resistor in series?
- Did you call `HAL_TIM_Base_Start_IT` instead of `HAL_TIM_Base_Start`?
- Did you misspell `HAL_TIM_PeriodElapsedCallback`? It has to match ST's exact naming, or your function will just be a regular function that nobody calls.
- Did you write your code inside the `USER CODE BEGIN` / `USER CODE END` markers? If not, regenerating from the `.ioc` will delete it.

---

## Blinking Two LEDs at Different Speeds

One LED is neat. Two LEDs blinking at completely different rates, without any delay loops, is where embedded hardware gets fun. We'll do it by using a second timer.

Plug an additional external LED (with a resistor) into breadboard pin `PC10`, just like you wired it in Challenge 2. Make sure `PC10` is still set as a **GPIO Output** in your `.ioc`.

{: .important}
Do NOT wire both signals together in the power rail. The signal wires should be connected DIRECTLY to the positive side of the EACH LED.

Open **TIM3** in the `.ioc` and set it up like TIM2:

- Clock Source: Internal Clock
- NVIC Settings: enable the **TIM3 global interrupt**
- Parameter Settings: let's make this LED toggle every $250\text{ ms}$ (4 times per second).

Try working out the PSC and ARR yourself first. Remember, you need $(PSC+1) \times (ARR+1) = \dfrac{80{,}000{,}000}{4} = 20{,}000{,}000$, and TIM3 is 16-bit, so neither number can exceed $65{,}535$.

<details>
  <summary>What is the PSC and ARR?</summary>
  PSC = 7999, ARR = 2499.
  <br>
  $\frac{80{,}000{,}000}{(7999 + 1) \times (2499 + 1)} = \frac{80{,}000{,}000}{8000 \times 2500} = 4\text{ Hz}$.
</details>

<img width="1512" height="949" alt="TIM3 Parameter Settings with Prescaler 7999 and Counter Period 2499" src="https://github.com/user-attachments/assets/91102d64-f813-450b-90b7-5ff7189c0df1" />

Generate code and start TIM3 in `main()`, right next to TIM2:

<img width="735" height="665" alt="main.c starting both htim2 and htim3 with HAL_TIM_Base_Start_IT" src="https://github.com/user-attachments/assets/9dbc19fc-e134-4978-ad99-467bef6fba5b" />

Then add TIM3 to the callback. Remember that both timers call the _same_ function, so we check `htim->Instance` to see which one fired:

<img width="502" height="173" alt="PeriodElapsedCallback handling both TIM2 and TIM3" src="https://github.com/user-attachments/assets/a801e807-800a-49a2-a215-0da07b821f75" />

Flash the board.

<div class="video-container">
  <video controls playsinline preload="metadata">
    <source src="{{ '/assets/videos/video2.mp4' | relative_url }}" type="video/mp4">
    Your browser does not support embedded video. You can <a href="{{ '/assets/videos/video2.mp4' | relative_url }}">open the video directly</a>.
  </video>
</div>

Two independent blinking LEDs, and your `while (1)` loop is still empty!

---

## Pulse Width Modulation (PWM)

Up until now, our pins have been strictly binary: 3.3V (HIGH) or 0V (LOW). So what if we want an LED at half brightness? Regular GPIO pins can't output an analog 1.65V. Instead, we use a trick called **Pulse Width Modulation (PWM)**.

The idea: switch the pin between 3.3V and 0V hundreds or thousands of times a second. If the pin spends 50% of each cycle ON and 50% OFF, your eyes can't follow the rapid switching, so the LED looks like it's at roughly half brightness. The perceived brightness isn't perfectly linear (more on that later), but this gives us a very useful dial.

Two terms to know:

- **Frequency:** how many ON/OFF cycles happen per second. This is set by the timer's PSC and ARR, same as before.
- **Duty cycle:** the percentage of each cycle the pin is HIGH. A 25% duty cycle is dim, 50% is medium, 100% is always on.

<img width="859" height="397" alt="Diagram of PWM signals at different duty cycles" src="https://github.com/user-attachments/assets/c5c5dc97-f0f3-4ce8-915f-4222e3f2beb9" />

[Image source: PWM basics](https://pico.implrust.com/core-concepts/pwm/basic-concepts.html)

$$\text{Duty Cycle (%)} = \frac{\text{CCR}}{\text{ARR} + 1} \times 100$$

Here's how the pieces fit together:

- **ARR** sets the total length of one cycle (so it sets the frequency).
- **CCR** (Capture/Compare Register) sets how many counts the pin stays HIGH during that cycle.

The counter runs from $0$ up to ARR, over and over. While the counter is below CCR, the pin is HIGH. When the counter reaches CCR, the hardware drives the pin LOW. When the counter reaches ARR and rolls over to $0$, the hardware pulls the pin HIGH again.

The killer feature? PWM runs 100% in hardware. No interrupts, no callbacks, no CPU involvement. Once you tell the timer to start, the pin dims itself while your code is free to do whatever it wants.

### Dimming the LED

Remember how `PA5` is hooked to LD2 on the NUCLEO? If you look closely at the pinout, `PA5` can also be connected to **TIM2_CH1** (Timer 2, Channel 1). A timer **channel** is an output that can drive a pin using the timer's counter, and that's what PWM needs.

We have to tell CubeMX to give `PA5` to the timer instead of using it as a plain GPIO. In the pinout view, **right-click** `PA5` and choose to unlock the pin.

<img width="486" height="533" alt="Right-clicking PA5 in the pinout view to unlock it" src="https://github.com/user-attachments/assets/01b4add6-6088-4ee1-8d91-4fdf187f5e7a" />

Now click `PA5` again and select **TIM2_CH1**.

<img width="505" height="513" alt="Selecting TIM2_CH1 for pin PA5" src="https://github.com/user-attachments/assets/1303b9db-a3a9-4e0f-a177-a252fd2956a0" />

Go to **TIM2** under Timers, and set **Channel 1 = PWM Generation CH1**.

<img width="1512" height="949" alt="TIM2 configuration with Channel 1 set to PWM Generation CH1" src="https://github.com/user-attachments/assets/d33e71cc-db2b-4322-92d9-ed04ddff92dc" />

In **Parameter Settings**, we want a $1\text{ kHz}$ PWM signal with $1000$ brightness levels ($0 \to 999$).

- Set **Prescaler (PSC) = 79**. This divides the 80 MHz clock by 80, so the timer ticks at exactly $1\text{ MHz}$ (1 µs per tick).
- Set **Counter Period (ARR) = 999**. One cycle is $1000$ ticks at 1 µs each, which is $1\text{ ms}$, or $1\text{ kHz}$.

  <img width="1512" height="949" alt="TIM2 Parameter Settings with Prescaler 79 and Counter Period 999" src="https://github.com/user-attachments/assets/ced20fe9-39a4-4599-a165-c89fe3437913" />

- Leave the NVIC interrupt checkbox **unchecked**. We're not using interrupts anymore.
- **Pulse (CCR)** is the starting duty cycle. You can leave it at $0$; we'll set it from code.

Why 1 kHz? It's fast enough that your eyes can't see the flicker, but slow enough to be easy to calculate.

Generate code and head to `main.c`.

Replace `HAL_TIM_Base_Start_IT(&htim2)` with the PWM start function (and delete the TIM2 part of your callback, since TIM2 no longer interrupts):

<img width="743" height="662" alt="main.c with HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1)" src="https://github.com/user-attachments/assets/e8bba776-963e-4c81-8032-f7a8e95d2429" />

Now you can set the brightness anywhere in your code with one macro, `__HAL_TIM_SET_COMPARE`. It writes a new value into CCR:

{: .note}
Comment out `BSP_LED_Init(LED_GREEN)` if you put the compare function above the internal LED initialization. Otherwise it'll reconfigure the pin as a regular GPIO and PWM won't work.

<img width="743" height="675" alt="main.c with __HAL_TIM_SET_COMPARE setting the LED brightness" src="https://github.com/user-attachments/assets/b46b9ca5-49f3-4ae0-92b4-55f4554e14f0" />

<img width="2420" height="2666" alt="LED glowing at reduced brightness on the breadboard" src="https://github.com/user-attachments/assets/a04c683c-2f82-4731-a733-633726973f29" />

Try putting different numbers in:

| CCR value | Duty cycle | What you should see |
| :--- | :--- | :--- |
| 0 | 0% | Off |
| 250 | 25% | Dim |
| 500 | 50% | Medium |
| 999 | 99.9% | Practically full blast |

(A value of $1000$, one more than ARR, would give a true 100%.)

### Fade LED

Let's make the LED fade smoothly in and out. All we have to do is change the compare value in small steps. Here is how you can sweep the brightness:

<img width="596" height="424" alt="Fade loop in main.c sweeping the compare value up and down" src="https://github.com/user-attachments/assets/60f16598-a406-462e-ae2c-b33732b7141b" />

Here's what each piece does:

- The outer `for` loops walk a counter `i` from $0$ up toward $999$ (and back down). We step by $5$ instead of $1$, so each ramp takes about $200$ steps instead of $1000$. That keeps the fade from taking forever.
- `duty = (i * i) / 999` converts the counter into the compare value. At `i = 999` it gives $999$ (nearly full brightness), and at `i = 0` it gives $0$ (off).
- `__HAL_TIM_SET_COMPARE` writes `duty` into CCR. The hardware picks up the new brightness on its own.
- The inner `for (volatile uint32_t d ...)` loop is a crude delay. It just counts to $12{,}000$ so each brightness step lasts long enough for your eyes to see. `volatile` tells the compiler "don't optimize this away." Without it, the compiler would notice the loop does nothing and delete it, and the fade would blur past too fast to see.
- Why `int32_t` on the way down? An unsigned counter can't go below $0$. If `i` were `uint32_t`, then `i >= 0` would always be true and the loop would never end. A signed `int32_t` lets `i` go negative, which ends the loop.

{: .note} 
Why use `(i * i) / 999`? Our eyes don't perceive brightness linearly, so a straight-line change in duty cycle can look uneven (most of the visible change seems to happen at the dim end). Squaring the value makes the brightness rise more slowly at the dim end, which often creates a smoother-looking fade.

{: .note} 
That empty `for` loop is a busy-wait, just like `HAL_Delay()`. It's fine for a demo, but remember the lesson from the top of this page: the PWM is handled by hardware, while the delay is the CPU counting in circles. How long the fade takes also depends on your clock speed and compiler settings. In a real project, you'd drive the fade from a timer interrupt instead. (That makes a great exercise once you're comfortable with this challenge!)

<div class="video-container"> <video controls playsinline preload="metadata"> <source src="{{ '/assets/videos/video3.mp4' | relative_url }}" type="video/mp4"> Your browser does not support embedded video. You can <a href="{{ '/assets/videos/video3.mp4' | relative_url }}">open the video directly</a>. </video> </div>

### Bonus: PWM Is Just Fast Blinking

Want proof that PWM and regular LED blinking are the same mechanism? Go back into your `.ioc` file, leave ARR = 999, but change the Prescaler to **63999**. (The prescaler is 16-bit, so $65{,}535$ is the biggest value it can hold.) Re-flash your code.

The PWM frequency is now $\dfrac{80{,}000{,}000}{64{,}000 \times 1000} = 1.25\text{ Hz}$, so each cycle takes just under a second. You'll see the LED visibly blink instead of looking dimmed. Change the prescaler back to 79, and that slow blink blurs right back into smooth brightness. Dimming is literally just blinking faster than your eyeballs can process!

{: .note}
Remember that `BSP_LED_Init(LED_GREEN)` will come back after code generation, because it isn't inside a `USER CODE` block. Comment it out again if the LED stops responding to PWM.

---

## Recap

| Concept | Key idea |
| :--- | :--- |
| **Timer** | Hardware counter that counts clock ticks without the CPU. |
| **Prescaler (PSC)** | Divides the clock by $(PSC + 1)$ so the counter ticks slower. |
| **Counter Period (ARR)** | The counter runs $0 \to$ ARR, then resets. A lap is $(ARR + 1)$ ticks. |
| **Interrupt** | The timer interrupts the CPU; the callback runs; `main()` resumes. |
| **Callback** | Your function (`HAL_TIM_PeriodElapsedCallback`), shared by all timers, so check `htim->Instance`. |
| **PWM** | The timer drives a pin on its own. ARR sets frequency, CCR sets duty cycle. |

<hr>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-2/" class="btn btn-outline">&#10094; Previous: Challenge 2</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-4/" class="btn btn-primary">Next: Challenge 4 &#10095;</a>
</div>