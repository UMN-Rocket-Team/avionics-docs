---
layout: default
title: "Challenge 1: LED on Breadboard"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-1/
---

# Challenge 1: LED on Breadboard

In this first challenge we'll be setting up a simple circuit on a breadboard using a power source, an LED, and a resistor.

#### What you'll need

- STMicro NUCLEO-L476RG board, USB 2.0 cable, breadboard, 220Ω resistor, LED, button

### Breadboard

Here is a picture of the internal connections on the breadboard:

<img width="873" height="391" alt="Screenshot 2026-09-28 at 6 14 52 PM" src="https://github.com/user-attachments/assets/f98ab1bf-860e-4f31-808a-53f36049ca27" />

*   **Rails (Red/Blue lines):** Used for power and ground.
*   **Terminal Strips (Middle rows):** Connect components vertically.

{: .note }
Power and ground rails are connected **horizontally** (shown in the image above) while the terminal strips are connected **vertically** (shown in white lines above).

### Resistors & Ohm's Law

Resistors limit the flow of current through a circuit. If you connect an LED directly from power to ground, you will burn it because too much current is going through the LED at once.

Ohm's Law states that the voltage V across a resistor equals the current I that goes across it times its resistance R. Or **V = IR**, for short. This means that we can calculate the exact resistance needed if we know the voltage and current. 

<table>
  <thead>
    <tr>
      <th></th> 
      <th>Symbol</th>
      <th>Units</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Voltage</th>
      <td>V</td>
      <td>Volt(V)</td>
    </tr>
    <tr>
      <th>Current</th>
      <td>I</td>
      <td>Amp(A)</td>
    </tr>
    <tr>
      <th>Resistance</th>
      <td>R</td>
      <td>Ohm(Ω)</td>
    </tr>
  </tbody>
</table>

We will be using resistors look like this:

<img width="876" height="432" alt="Screenshot 2026-09-28 at 6 15 36 PM" src="https://github.com/user-attachments/assets/adb38c24-c3d6-45ad-b52f-4d67262720a6" />


As you can see, resistors have colored bands that indicate their value. Most of our resistors use **4 colored bands** so let's focus on those. Using the above image as a reference, let's imagine we want to get a 1500Ω resistor. The resistor value is split into three components: the base value, multiplier, and tolerance. The base value is the digit(s) before the zeros. In this case, they are 1 and 5, so we will look for brown, then green bands. Next is the multiplier. Since we want 1500, we must multiply 15 by 100 (multiplier = 100), so the third band should be red. Finally, the last band is the error tolerance. If it is gold, for example, it means that the real resistance may be between 1500 ±5%, so somewhere between 1425Ω and 1575Ω.

### LEDs
A light emitting diode (LED) emits light when current is flowing through it. Diodes have a positive (+) and a negative (-) side, which means that current can only flow one direction through it. This is called **polarity**. To differentiate + from -, there are some visual cues shown in the image below.

<img width="1179" height="725" alt="Screenshot 2026-09-28 at 7 05 45 PM" src="https://github.com/user-attachments/assets/1d258f8f-bb57-4800-9d28-aca34a46d7ea" />


<a href="https://learn.illuminations.mit.edu/chapter/blink">image source</a>

- The longer lead is +, while the shorter lead is -.
- The flat edge on the plastic rim marks the - side.

{: .note}
The positive side of the LED should connect to the positive side of the power supply. Otherwise the LED will not light up.

### Lighting LED on a breadboard
An LED lights up when there is current going through it, so we need a source of power. Let's start by grabbing our development boards. We'll be using the STMicro NUCLEO-L476RG board, which have both 3.3V and 5V pins. There's actually more than one of each, but these ones are the ones that we'll be using.

<img width="553" height="645" alt="Screenshot 2026-09-28 at 6 16 02 PM" src="https://github.com/user-attachments/assets/36272fab-8fe1-43ae-9dea-4f65600e3670" />


#### Test it out: LED Simulator
As you now know, LEDs cannot be connected directly to power, otherwise they will burn! So we will be using resistors. And yes, the resistance value will influence on how bright your LED will shine. If your LED is connected to a resistor that is too low, it will still burn, and if it is too high, you will barely see it lighting up.

{% include led-circuit-simulator.html %}

So what is the ideal value? Each color of LED has a different current limit, but it usually varies between 10 and 30 mA. Considering that we want to use the 3.3V power supply pin, if you do the math, resistors that have the multiplier band around the color brown should work. In this activity, let's use one that looks like this. Can you figure out what is its resistance?

<img width="702" height="525" alt="Screenshot 2026-09-28 at 6 16 35 PM" src="https://github.com/user-attachments/assets/866e5404-ccb4-4e0c-8f73-2046afd123ba" />


[image source](https://www.adafruit.com/product/2780)

<details> 
  <summary> Answer  </summary>
  Red (2), Red (2), Brown (x10). 
  <br>
  If you answered 220 Ohms, that's correct.
</details>

Ok, now that we have all the materials we need, it's time to connect things together. Your circuit should look like this:

Top View | Side View | Circuit Diagram
:-------------------------:|:-------------------------:|:-------------------------:
<img width="391" height="564" alt="Screenshot 2026-09-28 at 6 17 04 PM" src="https://github.com/user-attachments/assets/ff21203f-e62b-4584-b1cb-dbde0f837dbe" /> | <img width="374" height="567" alt="Screenshot 2026-09-28 at 6 17 30 PM" src="https://github.com/user-attachments/assets/56a48c03-ded0-44bd-bca6-8d01b8f976dd" /> | <img width="433" height="583" alt="Screenshot 2026-09-28 at 6 17 55 PM" src="https://github.com/user-attachments/assets/4254013f-23dd-419d-9c18-6161e9f81331" />

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
<img width="410" height="578" alt="Screenshot" src="https://github.com/user-attachments/assets/f225056a-58cb-47ac-bc58-268b05be60a9" /> | <img width="384" height="580" alt="Screenshot" src="https://github.com/user-attachments/assets/0a497c2b-7888-4f08-b2d3-713753ed88d5" /> | <img width="414" height="590" alt="Screenshot" src="https://github.com/user-attachments/assets/1a48afb0-c2a3-482e-83cf-96bf55308ab2" />


<hr>

<div style="display: flex; justify-content: flex-end; margin-top: 2rem;">
  <a href="/docs/tutorials/firmware/challenges/challenge-2/" class="btn btn-primary">Next: Challenge 2 &#10095;</a>
</div>
