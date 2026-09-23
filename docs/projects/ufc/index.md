---
layout: default
title: Universal Flight Computer
parent: Projects
nav_order: 1
has_children: true
has_toc: false
permalink: /docs/projects/ufc/
---

# Universal Flight Computer (UFC)
{: .no_toc }

Our own flight computer: a stack of cards on a shared backplane that collects sensor data during flight,
logs it, and sends telemetry down to our ground station, WINGS.
{: .fs-5 .fw-300 }

{% include figure.html src="https://github.com/user-attachments/assets/2fe1fe56-710c-4612-b13f-19bdb00a151a" alt="Render of the UFC 3.5 structure" caption="UFC 3.5 (IREC 2026): four cards on the backplane, with the battery holder and BMS on top." width="300px" %}

Current version
: UFC 3.5, 2025–26 season, built for IREC 2026

Cards
: Power, Primary, Secondary, Interface (4 backplane slots)

Microcontroller
: STM32H730VBT6 on every card except the Power Card

Card-to-card link
: Classic CAN at 1 Mbit/s over the backplane

Ground station
: [WINGS](https://github.umn.edu/Rocket-Team/WINGS)

Code
: [UFC-2024 repo](https://github.umn.edu/Rocket-Team/UFC-2024), under `Firmware/`
{: .facts }

## What it's for

The UFC is an SRAD (student researched and developed) system. We use the data it collects to help recover
the rocket (GPS), to analyse how a flight actually went, to feed future simulations, and to support
experimental projects like active control and air brakes. It usually sits in the nose cone, right below
the [Pitot Tube System]({{ '/docs/projects/pitot/' | relative_url }}), and it can pass data from other
systems (like the Pitot cards) on to the ground station.

"Universal" means two things:

- **Structurally**, it's meant to fit 4-inch airframes and anything larger, so the same computer can go in
  test rockets, IREC rockets, and high-altitude projects.
- **Electronically**, it's modular. Each card does one job, and you pick which cards to fly depending on
  what data you want from that flight.

The two design priorities are to keep it **versatile** (any combination of cards should work, and no
card needs another card to function) and **user-focused** (someone who didn't write the firmware should be
able to set it up, fly it, and get the data off it, even in less-than-ideal conditions).

These pages describe UFC 3.5 unless they say otherwise. [Design History]({{ '/docs/projects/ufc/design-history/' | relative_url }})
covers how the design got here, and the older UFC2 docs are kept under
[Legacy (UFC2)]({{ '/docs/projects/ufc/legacy/' | relative_url }}).

## New here? Read in this order

1. **[System Architecture]({{ '/docs/projects/ufc/architecture/' | relative_url }})**: how the cards, backplane, and outside systems connect.
2. **[Cards]({{ '/docs/projects/ufc/cards/' | relative_url }})**: what every card has in common, then open the card you'll be working on.
3. **[Firmware]({{ '/docs/projects/ufc/firmware/' | relative_url }})**: how the code is organised. Firmware people should do the [firmware tutorial]({{ '/docs/tutorials/firmware/' | relative_url }}) and [STM32CubeIDE Setup]({{ '/docs/projects/ufc/firmware/ide-setup/' | relative_url }}) next.
4. **[Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }})**: what actually happens on launch day. Worth reading whatever your subteam is.

## Quick lookup

| Looking for | Go to |
|:--|:--|
| Launch-day checklist | [Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}#checklist) |
| Terminal commands | [Terminal]({{ '/docs/projects/ufc/firmware/terminal/' | relative_url }}#commands) |
| CARD_TYPE values, CAN message types | [CAN Protocol]({{ '/docs/projects/ufc/firmware/can-protocol/' | relative_url }}) |
| Packet types and sizes | [Packets]({{ '/docs/projects/ufc/firmware/packets/' | relative_url }}) |
| What an ECODE value means | [Error Codes]({{ '/docs/projects/ufc/firmware/error-codes/' | relative_url }}) |
| I2C addresses and interrupts for a sensor | That card's page, or the [Parts Reference]({{ '/docs/projects/parts-reference/' | relative_url }}) |
| Pin allocations | [Pin allocation spreadsheet](https://docs.google.com/spreadsheets/d/1c7ZB62Nly-gnfADdhTH96M57njbn2Hou3k6CWnDpNqs/edit?usp=sharing) (source of truth for every card) |
| Screws and parts for the structure | [Assembly]({{ '/docs/projects/ufc/assembly/' | relative_url }}) |
| Test procedures, and which ones are finished | [Testing & Validation]({{ '/docs/projects/ufc/testing/' | relative_url }}) |
| Why it's designed the way it is | [Design History]({{ '/docs/projects/ufc/design-history/' | relative_url }}) |
