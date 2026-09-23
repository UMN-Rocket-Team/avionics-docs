---
layout: default
title: Design History
parent: Universal Flight Computer
grand_parent: Projects
nav_order: 7
permalink: /docs/projects/ufc/design-history/
---

# Design History
{: .no_toc }

Why the UFC is built the way it is, what changed each year, and what's still on the wish list.
{: .fs-5 .fw-300 }

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Versions

| Version | Season | Main changes |
|:--|:--|:--|
| UFC1 | 2019–2023 | The team's first modular SRAD flight computer. Microchip PIC microcontrollers. Developed alongside WinGS, a Windows ground station written in C#/.NET. |
| UFC2 | 2023–24 | Switched to STM32s. Host, Sensor, and Radio cards, with the Host Card controlling the others over an SPI backplane. |
| UFC3 | 2024–25 | CAN backplane, so no card is in charge. Primary, Secondary, and Interface cards. Smaller 2.50 × 2.55 in cards. Flash on every data card. Terminal interface. New G10 structure. |
| UFC 3.5 | 2025–26 | Shortened to four slots for the IREC 2026 rocket. BMS inside a smaller battery holder. |

The ground station changed too. Since 2022, development has moved from WinGS to **WINGS**, a new ground station
built with Tauri and SolidJS.

## Why it's modular, stacked, and on a backplane

These decisions go back to the early days of UFC1, and for the most part they were made after weighing up the
alternatives. The goals throughout were: keep the system modular and extendable, make it easy to fit into lots of
different rockets, and pack as much functionality into as small a space as possible.

### Modular and multi-PCB

**Alternatives:** a single board, or a single board with sensor breakouts on headers.

A single-board flight computer puts everything on one PCB. The headers-and-breakouts version is a single board
that uses off-the-shelf sensor breakouts on header pins to keep the hardware simple. Compared to a modular
design, a single board is much simpler in both hardware and firmware, has fewer interfaces, is usually more space
efficient, and is easier to mount.

What modular gets you: you can redesign one part of the flight computer, add functionality that plugs into the
existing system, or take functionality away by leaving a card out, all without redoing the whole PCB. It's
flexible and extendable, but only worth it if you have a good reason and the people to support it.

The original author's advice:

> If you're thinking about designing your own SRAD flight computer and can't decide between a single board and a
> modular one, ask yourself why you're designing an SRAD flight computer. If the answer is to collect flight data,
> to actuate active controls, or to help with recovery, go with a single board. Save modular designs for when
> building a cool system is itself the goal, or when you don't have a specific purpose for the flight computer yet.

### Stacked

**Alternative:** a sled.

An avionics sled is a plate (usually MDF or fiberglass) mounted lengthwise in the rocket, usually in a coupler,
with PCBs and batteries mounted on both sides. Sleds make it much easier to get at the boards after they're
mounted and before integration, which matters for COTS avionics that have to be wired to batteries and charges by
hand. Stacks are usually much more space efficient: as long as each PCB's headroom is kept small and consistent,
you can fit a lot more boards in the same length of rocket.

### Card size

The card size wasn't chosen for any special reason, except that the diagonal had to fit inside a 4 in airframe.
The team hasn't built a team rocket smaller than 6 in since our last Midwest Rocket Competition entry in 2019, but
fitting 4 in leaves room for test rockets and high-altitude projects. The cards also had to be big enough for the
core four cards to fit all their parts on the top side, since putting parts on the bottom makes PCB assembly much
harder.

{: .check }
The card size in the old docs depends on which page you read. The original design-decision write-up says
2.64 × 2.64 in (3.73 in diagonal), while the 2024–25 change log below says the old cards were 2.75 × 2.67 in.
Either way, **current cards are 2.50 × 2.55 in** (3.57 in diagonal).

### A backplane with PCIe edge connectors

**Alternatives:** edge-to-edge connections, or a header stack.

- **Edge-to-edge** means lining boards up side by side and joining them with edge-mounted connectors. It suits
  sled-style computers (stacks don't have edges to connect), but every board you add makes the avionics bay longer.
- **A header stack** joins a stack of PCBs with big blocks of vertical header pins, usually along one or more
  sides. The hardware is simpler than a backplane: no backplane PCB that needs every card connection precisely
  aligned, and header pins are easy to get. But integration gets much harder. Header stacks usually mount on large
  standoff pylons, so for every board you connect the headers, tighten the standoffs, and repeat.

We went with a backplane using **PCIe edge connectors** because:

- It uses fewer parts. The male side of a PCIe connector is just the edge of the PCB, so each connection is one
  part.
- Integration is much easier: the cards slide into their slots and two bolts hold each one in.
- Boards can be packed closer. Header stacks need enough space between boards for both the male and female headers.
- PCIe connectors have a much higher pin density.

## Change log

### UFC2 (2023–24)

**Microcontrollers: PIC → STM32.** The UFC originally used PICs because a common ECE course (EE 2361: Intro to
Microcontrollers) uses the PIC24. In 2023 we switched to STM32s because:

- They're a more robust platform with a lot of hardware interoperability.
- There's a much bigger community and more company support: lots of tutorials, example code, and code on GitHub.
  ST has released official drivers and software packages for loads of things, including their own sensors, flash
  chips, SD cards and FAT32, and RTOSes.
- There are different levels of firmware abstraction, and you can mix them. HAL is very high level and very
  portable; LL ("low layer") is closer to what we were used to with PICs.

More detail in the [PIC to STM32 document](https://docs.google.com/document/d/1l1fBgGi84rJFY93UA7JNQFxcix_WhbQ-QEUoF82LNxQ/edit?usp=sharing).

**Host Card**
- PIC replaced with an STM32H7.
- Added footprints for a flash chip and an SD card slot.
- Added physical switches for mode selection.
- Debug: added an SWD port for STM32 ITM/ETM debugging and profiling, and test pins on the SPI and SQI
  interfaces for a Saleae.

**Sensor Card**
- PIC replaced with an STM32.
- Standardised on ST parts for the discrete gyroscope, accelerometers, and magnetometers, so the firmware could
  be shared.
- Switched to a combined barometer/thermometer for more accurate atmospheric data.
- Debug: SWD port; a separate USART port for two-way debugging and perturbation; sensor SPI/I2C USB emulation
  support via an FT2232HQ; 0 Ω power jumpers on every sensor; a break-off tab with SPI, I2C, and every sensor
  interrupt line.

**Radio Card**
- PIC replaced with an STM32.
- The RFD900x now mounts on the card, instead of separately on the structure.
- GPS changed from the u-blox MAX-M8 to the MAX-M10S.
- Debug: SWD port; a separate USART port for two-way debugging and perturbation; a dedicated GPS lock LED.

### UFC3 (2024–25)

**Card size.** The UFC was always meant to fit a 4 in body tube, but the first design didn't: the backplane's
thickness on the back of the structure made it slightly too big. The cards shrank from 2.75 × 2.67 in to
2.50 × 2.55 in.

**Backplane: SPI → CAN.** The first UFC used SPI on the backplane, with the Host Card as controller and every
other card (Sensor, Radio, Pitot) as a peripheral. That made every card depend on the Host, and peripherals
couldn't talk to each other directly. To make the system actually modular, the backplane switched to CAN. Now
every card is an independent node that can talk to any other card.

**Interface Card.** With CAN there's no need for a host microcontroller, so the Host Card became the Interface
Card. Like the old Host Card, it stores the data collected across all the cards and is meant to run GNC
algorithms on it. It also gained connectors for other electronics in the rocket, like the Pitot Tube system and
possible future systems such as air brakes.

**Data cards.** Previously the parts were split by function: a Sensor Card (all the sensors) and a Radio Card
(RFD, LoRa, and GPS). That's a clean split and easier for firmware, but in past years it was hard to keep to the
timeline and fully validate the system before competition. Since most of the parts come in pairs anyway, they
were split into two data cards with the same job (read the same kinds of sensor data, save it, send it to the
ground) using different part numbers. That way we can finish testing one data card first and test the other if
there's time. The plan that year was to develop and test Data Card 1 and fly it on a test rocket in the spring,
earlier than IREC. Data Card 1 and 2 are now the Primary and Secondary cards.

**Storage.** Before, the Host Card had the only flash chip and SD card, and they stored everything from the whole
UFC during flight. Now every data card has its own flash chip and saves locally, triggered by its own state
detection. There's still one SD card, on the Interface Card. The firmware moves data from the flash chips to the
SD card over CAN, either during or after flight, which is faster than reading each chip out over UART.

**Terminal.** Added a [terminal]({{ '/docs/projects/ufc/firmware/terminal/' | relative_url }}) on the
programmer's UART pins: a simple text interface between a computer and the UFC. Commands can be sent from PuTTY
or another serial console, from WINGS, or scripted in Python with `pyserial`. It's used for debugging during
development, unit and system testing, flight configuration, and readout. It's also available over both radios,
so commands can be sent remotely.

### UFC 3.5 (2025–26)

- The structure was cut down from 8 cards to 4 to fit the IREC 2026 rocket, and the backplane went from 8 slots
  to 4.
- The battery holder got smaller, with the new [BMS]({{ '/docs/projects/bms/' | relative_url }}) inside it.

## Future work

Ideas that came up but didn't make it in because of time:

**Power Card**
- Add a microcontroller and power sensors (like a current sensor) to measure and validate the UFC's power
  performance properly.
- If it gets a microcontroller, move the DIP switch and buzzer onto it too.
- Charge the batteries through an "umbilical" cable connected to the Power Card.

**Primary Card (Data Card 1)**
- Add a PPS LED so you can see when the GPS has a lock.
- Label which SMA port belongs to which radio.
- The BNO055 looks like it'll be discontinued in the next few years, so switch to a different part.

## People

The 2025–26 subteam leads, from the old wiki's front page: Owen Krumm (Avionics Lead), Cole Monroe (Hardware
Lead), Mohamed-dek Mohamed (Firmware Lead), and Joe Anderson (Software Lead). For current leads, see
[Meet the Team]({{ '/docs/team/' | relative_url }}).
