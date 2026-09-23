---
layout: default
title: Flight Operations
parent: Universal Flight Computer
grand_parent: Projects
nav_order: 5
permalink: /docs/projects/ufc/operations/
---

# Flight Operations
{: .no_toc }

Everything you do with the UFC on launch day, from plugging into the terminal to getting the data back off it.
The checklist is at the top; the sections below explain each step.
{: .fs-5 .fw-300 }

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Checklist

- [ ] Charge the battery fully
- [ ] [Assemble the UFC]({{ '/docs/projects/ufc/assembly/' | relative_url }})
- [ ] Erase the SD card and format it as **exFAT**
- [ ] Put the SD card in the Interface Card
- [ ] [Check that every card is up](#check-the-cards)
- [ ] [Reset the flash](#reset-for-flight)
- [ ] [Set up live telemetry](#live-telemetry-in-wings)
- [ ] When the rocket is about to launch, [start recording](#recording)
- [ ] Watch the live data during the flight
- [ ] After recovery, [get the saved data](#after-the-flight)

The old wiki kept a copy of this checklist with clickable checkboxes in
[UFC-2024 issue #22](https://github.umn.edu/Rocket-Team/UFC-2024/issues/22).

## Connect to the terminal

You'll use the [terminal]({{ '/docs/projects/ufc/firmware/terminal/' | relative_url }}) for most of the steps
below.

1. Plug the STLINK programmer into the programmer pads on the side of any UFC card. **The card has to be powered.**
2. Plug the programmer into your computer and find its COM port. It shows up as an STMicroelectronics device.
   On Windows, look in Device Manager.
3. Open a serial console. We use [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html), with
   these settings:

   | PuTTY tab | Setting | Value |
   |:--|:--|:--|
   | Session | Connection type | Serial |
   | Session | Serial line | The programmer's COM port |
   | Session | Speed | 115200 |
   | Terminal | Local echo | Force on |
   | Terminal | Local line editing | Force on |

4. Back on the **Session** tab, name the session (something like `UFC`) and click **Save**. Next time, just
   double-click the saved session to open it.

**Why local line editing matters.** The terminal gives up on a command if more than 100 ms passes between
characters. With local line editing on, PuTTY sends the whole line at once when you press Enter, instead of one
character per keypress. If you use a different serial console, make sure it has an equivalent line mode.

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/c7c681a5-39e4-4d1f-b8da-80f33e3351bd, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/52250f79-8bab-435d-9758-394558e1ad93, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/7b7b167f-b85b-4d28-a976-9b5c405c39e5, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/2870fad1-7541-4083-8134-b17388be7c9b, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/93a4276f-60c7-424a-8bf1-c46b447745f1, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/cbdc3fbc-71a2-4e53-b0a5-ccca4125c29a, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/284b38af-1ddd-4144-8784-244538ef47be, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/5e31782b-6461-4251-a913-d445af1209eb" %}

## Check the cards

1. Run `ls` to list the ID of every card on the network. Make sure every card you're flying shows up.
2. Run `status {card_id}` for each card to check its status.

{% include photo-links.html label="Screenshot" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/c982c077-3741-4c9e-aa57-952efb8f495d" %}

## Reset for flight

Send `RESET` from the terminal. It sets the flight state back to the pad and erases the flash on the cards.

{: .warning }
`RESET` erases all flash data. If the flash has anything on it you want to keep, get it off first
([After the flight](#after-the-flight)).

```text
RESET
Warning, this is a destructive action, proceed? (y/n): y
SUCCESS - Changed rocket_state to UFC_STATE_PAD
Successfully erased all flash data
successfully sent RESET command to card 2
successfully sent RESET command to card 4
```

{% include photo-links.html label="Screenshot" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/f2910261-83ba-41cf-997b-2ba5e45d8d1f" %}

## Live telemetry in WINGS

You need [WINGS]({{ '/docs/projects/wings/' | relative_url }}). This guide was written for v2.0.0 (the "Vehicle Release Build" on the
[old UMN repo](https://github.umn.edu/Rocket-Team/WINGS/releases/tag/v2.0.0)); newer releases are on
[public GitHub](https://github.com/UMN-Rocket-Team/WINGS/releases), and the setup screens may have moved.

1. Set up the RFD connection in WINGS with the settings in the screenshot below.
2. Set up whatever graphs you want. The UFC sends these packet structures:

   | Structure | Rate |
   |:--|--:|
   | `ufc_alt_structure` | 20 Hz |
   | `ufc_bno_structure` | 20 Hz |
   | `ufc_gps_structure` | 2 Hz |
   | `ufc_sense_structure` | 20 Hz |

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/856e09ea-bf03-493e-94f4-f38a9c157a0f" caption="WINGS RFD communication settings" %}

{: .check }
The RFD settings for WINGS only exist in that screenshot. Once someone can see it, please write the settings
out here as text.

{% include photo-links.html label="Graph setup screenshot" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/25321736-4664-45ef-99fc-9350dfc2692e" %}

## Recording

Normally you don't have to do anything: the state detection starts recording to flash when it sees the launch.
If that doesn't happen (or you don't want to risk it), you can start recording by hand over either radio with
the `RECORD` command.

### Over the LoRa

Run [`lora.py`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/lora.py). When it starts, it should print:

```text
b'4294967245\r\n'
b'ok\r\n'
b'ok\r\n'
b'ok\r\n'
b'ok\r\n'
b'ok\r\n'
b'ok\r\n'
b'ok\r\n'
```

Then type `RECORD`:

```text
RECORD
SUCCESS - Changed rocket_state to UFC_STATE_PAD_RECORD
successfully sent RECORD command to card 2
successfully sent RECORD command to card 4
```

Once you see that, you can close the script.

{% include photo-links.html label="Screenshot" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/e246f281-d5dc-47fd-8ffe-fa8d6b702d76" %}

### Over the RFD

The RFD is normally busy with live telemetry, so you have to turn that off first.

1. **Disconnect the RFD from WINGS.** Only one program can have a serial port open at a time.
2. Run [`rfdTurnOffTelemetry.py`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/rfdTurnOffTelemetry.py)
   to turn off live telemetry. That leaves the link clear for commands.
3. Open PuTTY on the RFD's serial port. It works just like the programmer terminal. Run `RECORD`.
4. Once recording is confirmed, run `tele on` to turn live telemetry back on, then close PuTTY and reconnect WINGS.

{: .check }
The old guide doesn't give the serial settings for connecting PuTTY to the RFD. **57600 baud** is the best guess:
it's the SiK firmware default, the RFD test sheet in the team Drive (`RFD test.xlsx`) configures the radios at 57600
with `TX_POWER` 20, and the old UFC2 readout procedure sets WINGS to 57600. `rfdTurnOffTelemetry.py` has to open the
same port, so check it to be sure.

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/2699fbab-fd17-4d30-9721-b90407825b29, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/1f748197-f5b4-413a-b925-a0614efbbe74" %}

## After the flight

Take the SD card out of the Interface Card. It should have all the UFC data, in one file per card, named:

```text
FlashBackup_Card{card_id}_{timestamp}.txt
```

### If the files aren't there

Regenerate them from each card's flash:

1. Put the SD card back in the Interface Card and power on the UFC.
2. Connect the programmer to the **Interface Card** and open the terminal.
3. Run `ls` to make sure every card is recognised.
4. For each card, run `flash transfer {card_id}`. The terminal prints progress as it goes.

Budget time for this. In the April 2025 overnight test, transferring one full flash chip took about
**34 minutes per card**.

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/b68f3f6e-6e4c-4172-b697-9a2b28bfdc23, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/52bf780f-ad1c-4611-b764-71deba74f8bb" %}

### Reading a flash straight to a computer

This works without the SD card, but it's slow.

1. Plug the programmer into the card you want to back up.
2. Run [`readAllFlash.py`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Demos/readAllFlash.py) from the
   UFC-2024 repo and give it the programmer's COM port. **This takes about 3 hours.** It saves
   `flashDataASCII.txt` in the same folder as the script.
3. Run [`convertFlashASCII.py`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Demos/convertFlashASCII.py)
   to turn that into `FlashData.txt`, the binary contents of the card's flash. This one finishes instantly.
