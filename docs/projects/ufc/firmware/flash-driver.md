---
layout: default
title: Flash Driver
parent: Firmware
grand_parent: Universal Flight Computer
nav_order: 4
permalink: /docs/projects/ufc/firmware/flash-driver/
---

# Flash Driver
{: .no_toc }

How the `W25N512GV_Driver` class stores flight data, and why NAND flash forces it to work the way it does.
{: .fs-5 .fw-300 }

Code
: [`UFC_Core/W25N512GV_Driver.h`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Firmware/UFC_Core/W25N512GV_Driver.h)

Chip
: Winbond W25N512GV, 512 Mbit (64 MB) SLC NAND ([datasheet](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf))

Page
: 2048 bytes

Block (erase unit)
: 128 KB (131072 bytes)

Bus
: Quad SPI for reading and writing data, single SPI for everything else (configuration, erasing, write enable)
{: .facts }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## How NAND flash behaves

Flash isn't like RAM. You can't just overwrite a byte with a new value.

- **Erasing** sets a whole block of bytes to `0xFF` (all ones). On this chip the smallest thing you can erase
  is one [block](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf#page=12), 131072 bytes.
- **Writing** (called "programming") can only turn ones into zeros. It can never turn a zero back into a one.

For example, to write `0xA1` (`0b1010 0001`) you start from `0xFF` and clear bits 1, 2, 3, 4, and 6 (bits
numbered 0–7 from the right). If that byte already held `0x00`, "writing" `0xA1` does nothing, because there
are no ones left to clear. So each location can be programmed once, and then the whole block has to be erased
before it can be programmed again.

The W25N512GV adds a few more rules on top of that:

- Data can only be erased in [blocks of 128 KB](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf#page=37).
- Each page can only be [written to four times](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf#page=40) before it's erased.
- Pages within a block have to be [programmed in order](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf#page=40).
- To write a page, the data first goes into the chip's internal data buffer, and
  [reading a page overwrites that buffer](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf#page=38).
- NAND flash doesn't guarantee every bit works, so [some bits on the chip may be unreliable](https://www.enterprisestorageforum.com/hardware/nand-flash-storage).

## Driver rules

The driver is designed around those limits:

- **Writes are buffered a page at a time.** The driver keeps its own 2048-byte buffer in RAM and only programs
  a page once that buffer is full. That avoids partial page programs. It's separate from the chip's internal
  buffer, so you can still read from the flash in the middle of filling a page. In practice this means data
  goes in through `writeNext`, and nothing reaches the chip until 2048 bytes have been written.
- **Data is written from the start of the flash to the end**, with one exception: the circular buffer (below).
- **Erasing is all or nothing.** Data is only ever erased by a terminal command (`RESET`), and that erases the
  whole chip. There are no partial erases.

## The circular buffer

The state detection doesn't know the rocket has launched until *after* it has launched, so recording would
normally miss the launch itself. To catch it, the driver keeps a circular buffer in the STM32's RAM that
records continuously until a **LAUNCH** condition is detected. Its size depends on the card, but the aim is
about **10 seconds** of data.

The driver sets aside a section of flash for the buffer's contents. When a **LANDING** condition is detected,
or the flash fills up, the buffer is written out to the beginning of the flash chip. That's the one exception to
writing front to back.

### Why the buffer is written last

An earlier version wrote the buffer to flash as soon as launch was detected. With single-SPI flash writes and about
10 s of pad data, the Secondary Card spent **1.3 s** of the ascent writing its 296,000-byte buffer and missed that
part of the flight. The firmware notes from the time (around the end of 2024) list the options they considered:

- make the transfer faster (quad SPI, a smaller buffer),
- defer writing the buffer until after the flight,
- reserve space at the start of the flash for it,
- or mark the start of the buffer with a delimiter and write it at the end of the flash on landing.

The current design combines the second and third: space is reserved at the start, and the buffer is written there
after landing. Buffer sizes and write times per card are on
[Timings & Budgets]({{ '/docs/projects/ufc/firmware/timings/' | relative_url }}#circular-buffer-sizes).
