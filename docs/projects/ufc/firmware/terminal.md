---
layout: default
title: Terminal
parent: Firmware
grand_parent: Universal Flight Computer
nav_order: 2
permalink: /docs/projects/ufc/firmware/terminal/
---

# Terminal (UFCTI 1.0)
{: .no_toc }

A plain-text command line on every card. It's how we check status, configure, test, and read out the UFC
without reflashing anything.
{: .fs-5 .fw-300 }

Spec
: UFC Terminal Interface Spec 1.0 ("UFCTI 1.0"), by Ryan Srichai, 9 July 2024

Code
: [`UFC_Core/terminal.h`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Firmware/UFC_Core/terminal.h) (`Terminal_Driver`)

Link
: UART through the programmer, **115200 baud**

Also reachable from
: Either radio, and other cards over CAN
{: .facts }

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Connecting

Plug the STLINK programmer into the programmer pads of any powered card, find its COM port, and open a
serial console (we use PuTTY) at 115200 baud. The step-by-step version with the PuTTY settings is in
[Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}#connect-to-the-terminal).

Commands can also be scripted from Python with `pyserial`.

## Commands

**Every card** has these, from the spec:

| Command | What it does |
|:--|:--|
| `help` | Lists the commands this card supports |
| `whoami` | Prints this card's CARD_ID and CARD_TYPE |
| `echo {text}` | Prints the text back |
| `ls` | Lists the CARD_ID and CARD_TYPE of every card on the network |
| `restart` | Tries to reboot the card |

**Flight and test commands** that show up in the flight guide and test procedures:

| Command | What it does | Seen in |
|:--|:--|:--|
| `status {card_id}` | Shows the status of a card | [Check the cards]({{ '/docs/projects/ufc/operations/' | relative_url }}#check-the-cards) |
| `RESET` | **Destructive.** Asks y/n, then erases the flash and sets the state to `UFC_STATE_PAD`, and forwards `RESET` to the other cards | [Reset for flight]({{ '/docs/projects/ufc/operations/' | relative_url }}#reset-for-flight) |
| `RECORD` | Starts recording now (`UFC_STATE_PAD_RECORD`). Works over either radio as a backup to state detection. | [Recording]({{ '/docs/projects/ufc/operations/' | relative_url }}#recording) |
| `LAUNCH`, `LAND` | Steps the card through launch and landing by hand | [Flight simulation tests]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#flight-simulation-day) |
| `tele on` | Turns live RFD telemetry back on | [Recording over the RFD]({{ '/docs/projects/ufc/operations/' | relative_url }}#over-the-rfd) |
| `flash transfer {card_id}` | Copies that card's flash onto the SD card (run on the Interface Card) | [After the flight]({{ '/docs/projects/ufc/operations/' | relative_url }}#after-the-flight) |

{: .check }
This list is only what the old wiki happened to mention. Commands vary between cards, and the docs don't say
which cards support which flight commands or whether commands are case-sensitive (type them as shown). Run
`help` on the card to get the real list.

## Command format

- Commands are plain ASCII sent over UART at 115200 baud.
- The spec says to end every command with a carriage return, a newline, and a null: `\r\n\0`. In practice the
  firmware stops reading at the `\r`, or when no character arrives for `TERMINAL_TIMEOUT` (100 ms).
- The command is split on spaces into arguments. `echo hello world` becomes three arguments: `echo`, `hello`,
  and `world`.
- The output is one string, ending in `\r\n`.

There are four limits, set in the code:

| Constant | Limits | Default |
|:--|:--|:--|
| `TERMINAL_ARGS_LIMIT` | Number of arguments in one command | Not documented |
| `TERMINAL_ARG_LENGTH_LIMIT` | Length of any one argument | Not documented |
| `TERMINAL_RESPONSE_LIMIT` | Length of the response (size of the response buffer) | 2048 |
| `TERMINAL_TIMEOUT` | Milliseconds allowed between characters of one command | 100 |

## How it works

The terminal is mostly interrupt-driven. When data arrives on the programmer UART, an interrupt reads it byte
by byte until it sees a `\r` (or times out). The command is then parsed into a list of string arguments and
handed to `terminalHandler`, which builds the response in a buffer of `TERMINAL_RESPONSE_LIMIT` bytes. When the
command finishes, the buffer is sent back over UART.

## Adding a command

Edit the `terminalHandler` function in [`Terminal_Driver`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Firmware/UFC_Core/terminal.h).
A command doesn't have to just print something: it can change global state, call functions, or drive hardware.

## Running commands from other sources

The terminal is tied to the UART interrupt, but any string that follows the command format can be run as a
command. That's what lets commands come in over the radios and from other cards (the
[CAN command frames]({{ '/docs/projects/ufc/firmware/can-protocol/' | relative_url }}#message-types)):

```cpp
terminal.parseTerminalMessage(string);
terminal.terminalHandler(terminal.terminalCmd.argc, terminal.terminalCmd.argv);
// The output is now a plain-text string in terminal.terminalResponse,
// ready to send back wherever the command came from.
```
