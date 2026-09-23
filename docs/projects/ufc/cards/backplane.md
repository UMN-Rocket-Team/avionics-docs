---
layout: default
title: Backplane
parent: Cards
grand_parent: Universal Flight Computer
nav_order: 1
permalink: /docs/projects/ufc/cards/backplane/
---

# Backplane
{: .no_toc }

The board every card plugs into. It carries power from the Power Card to the other cards, and the CAN bus
between them.
{: .fs-5 .fw-300 }

Size
: 1820 × 3500 mil (1.82 × 3.50 in)

Slots
: 4 PCIe connectors (8 before UFC 3.5)

Connector
: PCIe edge connector, 36 pins (18 per side)

Lines
: CAN_P, CAN_N, GND, 3.3 V, 5 V

Design files
: [Altium 365](https://rocket-team.365.altium.com/designs/53DDD4B2-7DCF-4AE1-BEEF-ACE332D8193F)
{: .facts }

{% include figure.html src="https://github.umn.edu/user-attachments/assets/d773931f-b277-4fbb-afb4-152ac1761a27" caption="UFC 3.5 backplane (4 slots)" %}

## Slots and connectors

Cards plug straight into PCIe edge connectors. They've held up well to repeated plugging, there's only one
way a card can physically go in, and they're easy to use. Any card can go in any of the four slots.

The UFC 3.5 built for IREC 2026 had to be shorter to fit the rocket, so the backplane went from eight slots
to four.

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/6992a24e-7be1-43ca-bb0a-e608b27456fe" caption="PCIe backplane connections (pinout)" %}

## Power

The 3.3 V, 5 V, and GND lines just distribute the Power Card's output to every slot. The backplane has no
regulation of its own.

## CAN

The two CAN lines are labeled **CAN_P** and **CAN_N**.

- **Transceiver:** each card uses a [TCAN332DR](https://www.ti.com/lit/ds/symlink/tcan332.pdf), a 3.3 V
  transceiver good for up to 5 Mbit/s with CAN FD. The microcontrollers can do CAN FD up to 8 Mbit/s, but the
  firmware currently runs **classic CAN at 1 Mbit/s**.
- **Termination:** a DIP switch on the [Power Card]({{ '/docs/projects/ufc/cards/power-card/' | relative_url }})
  (and only there) connects a 120 Ω resistor between CAN_P and CAN_N. With the switch off, the lines aren't
  connected on that card. The Power Card got the switch because it's the one card every UFC configuration has.

{: .note }
CAN normally has a 120 Ω terminator at each end of the bus. The old wiki only mentions this one. If you're
chasing CAN errors while external cables are connected (Pitot, BMS), check whether the far end is terminated.

### Protocol in one paragraph

Each card gets a unique power-of-two **CARD_ID** and announces itself (with its CARD_ID and **CARD_TYPE**) when it
powers up, so every card knows who else is on the bus. To send something, a card ORs its own CARD_ID with the
receiver's and uses that as the 11-bit CAN identifier. That's why there can be at most 11 cards on the bus.
Communication is always one card requesting from one other card. Responses longer than a single frame are
split into 6-byte chunks, and a card can't request from several cards at once. Commands between cards are
handled separately from data requests. Cards can't tell when another card leaves the bus, and they don't try.

The full spec is on the [CAN Protocol]({{ '/docs/projects/ufc/firmware/can-protocol/' | relative_url }}) page.
