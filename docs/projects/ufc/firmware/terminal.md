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
| `restart` | Reboots the card (see below) |

**Flight and test commands.** These come from the IREC 2025 launch procedure and the test procedures, not from the
spec, so not every card has every one.

| Command | What it does |
|:--|:--|
| **Getting around** | |
| `cd {card_id}` | Sends your following commands to another card over CAN. `cd ..` comes back to the card you're plugged into. |
| `pwd` | Tells you which card you're talking to |
| `ls` | Lists every card this card can see, marking itself with `(this card)` |
| `sync` | Resets this card's CAN "phone". Try it when `ls` is missing a card. |
| **State** | |
| `status [card_id]` | Flight state (`UFC_STATE_PAD`, …) and whether each card and component is **Online**. No ID means this card. |
| `RECORD` | Starts recording now (`UFC_STATE_PAD_RECORD`) and forwards it to the other cards. The backup for [state detection]({{ '/docs/projects/ufc/firmware/' | relative_url }}#state-detection). |
| `LAUNCH` | Steps the card into launch by hand. Used in [flight simulation tests]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#flight-simulation-day). |
| `LAND` | Sets `UFC_STATE_LANDED` and moves the [circular buffer]({{ '/docs/projects/ufc/firmware/flash-driver/' | relative_url }}#the-circular-buffer) to the start of the flash |
| `RESET` | **Destructive.** Asks y/n, then erases the flash on **every** card and puts them all in `UFC_STATE_PAD` |
| `restart` | Reboots **this** card only. It goes back to the pad state and stops recording, but keeps its flash. No response, since it's rebooting. |
| **Flash and SD card** | |
| `flash status` | Page number, write address, and how full the flash is |
| `flash read {address}` | Prints one page of flash, starting at the address |
| `flash transfer {card_id}` | Copies one card's flash onto the SD card (run on the Interface Card) |
| `sd status` | SD card health (`GOOD`) and the files on it |
| `sd transfer` | Copies every card's flash onto the SD card |
| **Radios** | |
| `tele on` | Turns live telemetry back on after `rfdTurnOffTelemetry.py` turned it off |
| `gps` | Prints the GPS position. Handy for recovery over the RFD. |
| `lora {command}` | On the Secondary Card, appears to pass the rest of the line to the RN2483. `lora sys get ver` should answer `RN2483 1.0.5 Oct 31 2018 15:06:52`. |

Where these get used in practice is on [Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}).
The empty-flash `flash status` values and the `flash read` spot-check addresses are there too.

{: .check }
Nobody wrote down which cards support which flight commands, so run `help` on the card to get the real list.
Commands are case-sensitive: `restart` and `RESET` are different commands, so type everything exactly as shown.
The `lora` passthrough is a guess from the one example in the launch procedure.

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
