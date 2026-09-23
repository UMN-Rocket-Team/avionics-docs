---
layout: default
title: Packets
parent: Firmware
grand_parent: Universal Flight Computer
nav_order: 3
permalink: /docs/projects/ufc/firmware/packets/
---

# Packets
{: .no_toc }

Packets are the UFC's data format. Everything a card stores, sends over the radio, or passes to another
card is a packet.
{: .fs-5 .fw-300 }

The source of truth for every packet and every field is
[`UFC_Core/packets.h`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Firmware/UFC_Core/packets.h).
This page is the overview.

## Packet types

| Packet | Size (bytes) | Produced by |
|:--|--:|:--|
| `STATUS_PKT` | 28 | Every card |
| `SENSOR_PKT` | 64 | Secondary Card |
| `BNO_PKT` | 52 | Primary and Pitot cards |
| `ALT_PKT` | 24 | Primary, Secondary, and Pitot cards |
| `GPS_PKT` | 80 | Primary Card |
| `PITOT_CENTER_PKT` | 24 | Pitot card |
| `PITOT_RADIAL_PKT` | 32 | Pitot card |
| `FLASH_PKT` | 2048 | Any card, on demand. Only the Interface Card uses it. |

The flash packet is the odd one out: it's made on request and read by the Interface Card when it copies another
card's flash to the SD card. At 2048 bytes it's the same size as one page of the
[flash chip]({{ '/docs/projects/ufc/firmware/flash-driver/' | relative_url }}).

Every packet starts with a header that includes a 64-bit timestamp
([format]({{ '/docs/projects/ufc/firmware/' | relative_url }}#timestamps)).

{: .check }
The PKT_TYPE table in the [CAN spec]({{ '/docs/projects/ufc/firmware/can-protocol/' | relative_url }}#pkt_type-values)
uses different names (`rawPkt_t`, `bnoPkt_t`, `tempBaroPkt_t`, ...), and the telemetry names below are different
again. Some of these are from older versions of the code. Check `packets.h` before relying on either list.

## In WINGS

The [WINGS ground station](https://github.umn.edu/Rocket-Team/WINGS) reads packets using the JSON packet
definitions in the UFC repo's [`WINGSpacket`](https://github.umn.edu/Rocket-Team/UFC-2024/tree/main/WINGSpacket)
folder. If you change a packet in `packets.h`, update its JSON file too.

These are the structures the UFC sends as live telemetry, according to the flight guide:

| WINGS structure | Rate |
|:--|--:|
| `ufc_alt_structure` | 20 Hz |
| `ufc_bno_structure` | 20 Hz |
| `ufc_gps_structure` | 2 Hz |
| `ufc_sense_structure` | 20 Hz |
