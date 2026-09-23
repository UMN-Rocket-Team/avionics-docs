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

Everything you do with the UFC around a launch: the day before, on the pad, right before flight, after landing,
and getting the data off afterwards. The checklist is at the top; the sections below explain each step.
{: .fs-5 .fw-300 }

{: .check }
> This page follows the team's **IREC 2025** launch procedure (`UFC Integration and Launch Procedures - IREC 2025`
> in the team Drive). That UFC flew an RFD900 on the Primary Card and an RN2483 LoRa on the Secondary Card. For
> IREC 2026 the Primary Card's radio became a 433 MHz E22 LoRa
> ([Primary Card]({{ '/docs/projects/ufc/cards/primary-card/' | relative_url }}#radio)), so every RFD step below will
> have changed. Update this page with the next procedure.

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Checklist

**Day before launch**
- [ ] Check the structure, wiring, and screws ([UFC pre-integration](#ufc-pre-integration))
- [ ] Charge the battery and check the rails ([battery and power](#battery-and-power))
- [ ] Erase the SD card, format it as **exFAT**, and put it in the Interface Card
- [ ] [Reset the flash](#reset-for-flight) and check every card's status
- [ ] Zip-tie the antennas, hot-glue the SD card, tape over the debug pads
- [ ] [Pitot pre-integration](#pitot-pre-integration)

**On the pad**
- [ ] Wait about a minute after power-on
- [ ] [Check the RFD link and start WINGS](#live-telemetry-in-wings)
- [ ] [Check the LoRa link](#check-the-lora-link)
- [ ] [Check the cards](#check-the-cards): they all see each other, the flash is empty, the state is `UFC_STATE_PAD`

**A few minutes before launch**
- [ ] [Start recording](#recording) and check the flash is filling

**After landing**
- [ ] Screenshot WINGS, then send [`LAND`](#after-landing)

**Day after**
- [ ] [Get the data off](#after-the-flight): WINGS logs, SD card files, flash checks

The old wiki kept a shorter version of this checklist with clickable checkboxes in
[UFC-2024 issue #22](https://github.umn.edu/Rocket-Team/UFC-2024/issues/22).

## Settings at a glance

Programmer terminal
: Serial, **115200** baud ([Terminal]({{ '/docs/projects/ufc/firmware/terminal/' | relative_url }}))

RFD (PuTTY and WINGS)
: Serial, **115200** baud

LoRa
: `python lora.py COMx`, run from the UFC-2024 repo

Card IDs
: 2 Interface · 4 Primary · 8 Secondary · 16 Pitot

WINGS display setups
: `ufc_display_sense_edition.json` if the Primary Card can see the Secondary Card, otherwise `ufc_display_bno_edition.json`

WINGS logs
: `C:\Users\{you}\AppData\Roaming\Wings_data_logs`
{: .facts }

You'll need three COM ports on the day (programmer, RFD, LoRa). Write them down once you've found them.

## What to pack

From the IREC 2025 packing list.

| Group | Items |
|:--|:--|
| **Flight hardware** | Primary, Secondary, Interface, and Power cards; backplane; battery; screw switch cable; RFD, GPS, and LoRa antennas; GPS antenna mount; 64 GB micro SD; TPU spacers; Pitot Sensor and Power cards |
| **Spares** | A second of each card and antenna, the backplane, and micro SDs; SMA cables (in case the right-angle SMAs get in the way during integration); a full set of structure screws ([Assembly]({{ '/docs/projects/ufc/assembly/' | relative_url }}#fasteners)) |
| **Ground station** | Yagi antenna for the RFD, plus a spare adapter; LoRa antenna; radio box; FTDI cables (5 V and 3.3 V) |
| **Programming and debugging** | Two programmers and three cables, Saleae, breadboards, jumper wires and wire, spare sensor breakouts (gyro, low-g, high-g, altimeter, magnetometer, BNO, GPS, LoRa, SD) |
| **Power** | Two blue battery chargers with their adapters, individual cell charger, Kapton tape for the battery |
| **Tools** | 1/16 in and 1/8 in hex keys, small flathead (terminal block), large Phillips (screw switch), strong magnet (Pitot magnetic switch), hot glue, electrical tape, soldering iron and spare tips, solder, flux pen, tweezers, magnifier |

The IREC 2025 spares weren't all flight-ready: the spare Primary Card had jumper wires soldered to its RFD, the spare
Secondary was missing its LoRa and magnetometer, the spare Interface's CAN transceiver didn't work, the spare Power
Card still needed its screw-switch terminal block, and some slots on the spare backplane didn't work. Worth knowing
before you reach for one at the launch site.

The flight cards had names: **Dicky** (Primary), **Dawn** (Secondary), **Nicky** (Interface), and **Ricky** (Power).
So did some of the antennas. Keep the tradition going.

## Connect to the terminal

You'll use the [terminal]({{ '/docs/projects/ufc/firmware/terminal/' | relative_url }}) for most of the steps
below, through the programmer on the ground or through a radio on the pad.

1. Plug the STLINK programmer into the programmer pads on the side of a UFC card. **The card has to be powered.**
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

**Moving between cards.** Whichever card you're plugged into, `cd {card_id}` sends your commands to another card
over CAN, and `cd ..` brings you back. `pwd` tells you where you are.

**`restart` vs `RESET`.** Easy to mix up, and they do very different things:

| Command | What it does | Erases flash? |
|:--|:--|:--|
| `restart` (lower case) | Reboots **one** card. The card goes back to the pad state and stops recording, so you'd need `RECORD` again. You won't get a response, since it's rebooting; wait, then send another command to check. The Primary Card takes about a minute, the Secondary about 10 seconds. | No |
| `RESET` (upper case) | Erases the flash on **all** cards and puts them all in `UFC_STATE_PAD`. Asks you to confirm first. | **Yes** |

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/c7c681a5-39e4-4d1f-b8da-80f33e3351bd, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/52250f79-8bab-435d-9758-394558e1ad93, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/7b7b167f-b85b-4d28-a976-9b5c405c39e5, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/2870fad1-7541-4083-8134-b17388be7c9b, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/93a4276f-60c7-424a-8bf1-c46b447745f1, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/cbdc3fbc-71a2-4e53-b0a5-ccca4125c29a, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/284b38af-1ddd-4144-8784-244538ef47be, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/5e31782b-6461-4251-a913-d445af1209eb" %}

## The day before launch

### UFC pre-integration

**Structure and wiring**
- [ ] Every structural part is attached and in good shape.
- [ ] RFD and GPS antennas are connected to the **Primary Card**; the LoRa antenna to the **Secondary Card**.
- [ ] Screw switch and battery are connected to the **Power Card**.
- [ ] Screws are tight: battery mount, GPS antenna mount, horizontal standoffs, backplane to the back sled, and every
      L-bracket (4 on each sled, 8 on the top bulkhead, 8 on the bottom bulkhead).

**Functional check** (skip it if you're short on time). Go through the [on-the-pad](#on-the-pad) steps to check the
radio link to WINGS, the flash, the SD card, and the sensors. Record for a few minutes, then stop recording by
restarting each card (`cd {card_id}`, `restart`, wait, `ls`, `cd ..`), and pull the data off as in
[After the flight](#after-the-flight). Then carry on below.

### Battery and power

1. Charge the battery on the blue charger in **"LiIo Charge 3A 3S"** mode, to 99%.
2. Check the battery voltage with a multimeter.
3. Make sure the screw switch is **off** (righty-tighty), then connect the battery to the Power Card (yellow connector).
4. Turn the screw switch on. You should hear **three beeps**.
5. Check the 3.3 V and 5 V rails with a multimeter.

**SD card:** erase everything on it, format it as **exFAT**, and put it in the Interface Card.

### Reset for flight

Connect the programmer to the **Primary Card** and open the terminal.

1. `ls` to check the card is responding.
2. `RESET`, and answer yes when it asks. This erases every card's flash and sets the state back to the pad.

   ```text
   RESET
   Warning, this is a destructive action, proceed? (y/n): y
   SUCCESS - Changed rocket_state to UFC_STATE_PAD
   Successfully erased all flash data
   successfully sent RESET command to card 2
   successfully sent RESET command to card 8
   ```

3. `flash status`. An empty flash isn't at zero, because the start is reserved for the
   [circular buffer]({{ '/docs/projects/ufc/firmware/flash-driver/' | relative_url }}#the-circular-buffer):

   | Card | Empty flash status |
   |:--|:--|
   | Primary | `pageNumber: 65`, `writeAddress: 0x20800`, 0.20% filled |
   | Secondary | `pageNumber: 129`, `writeAddress: 0x40800`, 0.39% filled |
   | Pitot | `pageNumber: 65`, `writeAddress: 0x20800`, 0.20% filled |
   | Interface | Varies. It's already recording. |

4. `cd ..`, then `ls` to list the card IDs.
5. `status {card_id}` for each card. You want `UFC_STATE_PAD`, and **Online** for every card and component. If a card
   isn't on the pad, `RESET` again.

{: .warning }
`RESET` erases all flash data. If there's anything on the flash you want to keep, get it off first
([After the flight](#after-the-flight)).

**If the reset fails on a card:**
- **Interface Card:** turn the whole UFC off and on, then `RESET` again. Restarting just that card doesn't work; the
  procedure's note is that "for some reason the flash stops working if we restart it".
- **Any other card:** `cd {card_id}`, `restart`, wait for it to come back, then `RESET` again.

Then:
- [ ] Turn the screw switch off.
- [ ] Zip-tie the RFD and LoRa antennas.
- [ ] Hot-glue the SD card into the Interface Card.
- [ ] Put electrical tape over all the debug pads.

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/c982c077-3741-4c9e-aa57-952efb8f495d, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/f2910261-83ba-41cf-997b-2ba5e45d8d1f" %}

### Pitot pre-integration

- [ ] Attach the structural parts, zip-tie the tubing, and attach the threaded rods to the electronics hardware and
      mounting washer.
- [ ] Check the tubing for leaks.
- [ ] Connect the programmer to the **Pitot card**, `ls`, then `RESET` (answer yes).
- [ ] `flash status` should read `pageNumber: 65`, `writeAddress: 0x20800`, 0.20% filled.
- [ ] `status` should show `UFC_STATE_PAD` and **Online** everywhere. If it doesn't, `RESET` again.
- [ ] Turn off the Pitot's magnetic switch.
- [ ] Tape over the debug pads.

## On the pad

Once the UFC is switched on at the pad, **wait about a minute** for every card to finish starting up.

### Live telemetry in WINGS

1. **Check the RFD link.** Plug the radio box's RFD into the laptop, find its COM port, and open PuTTY on it at
   **115200** baud. Point the Yagi antenna at the rocket. If you're connected, you'll see a stream of binary garbage.
   Close PuTTY.
2. **Start [WINGS]({{ '/docs/projects/wings/' | relative_url }}).**
   - Load the saved display setup: `ufc_display_sense_edition.json` if the Primary Card can see the Secondary Card,
     otherwise `ufc_display_bno_edition.json`.
   - On the **Communications** tab, click **addSerialPort** and pick the RFD's COM port. Packets should start
     arriving. The baud should already be 115200.
   - Check the **Display** tab for data.

The UFC sends these packet structures as live telemetry. If you're building a display from scratch, these are the
ones to graph:

| Structure | Rate |
|:--|--:|
| `ufc_alt_structure` | 20 Hz |
| `ufc_bno_structure` | 20 Hz |
| `ufc_gps_structure` | 2 Hz |
| `ufc_sense_structure` | 20 Hz |

{% include photo-links.html label="Older WINGS v2.0 setup screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/856e09ea-bf03-493e-94f4-f38a9c157a0f, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/25321736-4664-45ef-99fc-9350dfc2692e" %}

### Check the LoRa link

1. Plug the radio box's LoRa into the laptop and find its COM port.
2. In a terminal in the UFC-2024 folder, run [`lora.py`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/lora.py):
   `python lora.py COMx`. The radio box's LoRa is working if it prints:

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

   If it doesn't, unplug and replug the cable and try again.
3. Check it can reach the UFC: `pwd`, `status`, and `ls` should all get answers. If not, run `lora.py` again.

The UFC's LoRa is on the Secondary Card, so that's where your commands land (`pwd` should say card 8).

**If the UFC's LoRa still doesn't answer,** restart the Secondary Card through the RFD:

1. Go [over the RFD](#over-the-rfd). You should be on the Primary Card (`ls`).
2. `cd 8`, then `restart`. Wait about 10 seconds, then `ls` to check you're on the Secondary Card.
3. `lora sys get ver` sometimes fixes it. It should answer `RN2483 1.0.5 Oct 31 2018 15:06:52`.
4. Run `lora.py` again and try `pwd`.
5. Still nothing? Repeat the restart two or three times. After that, assume the LoRa has no link.
6. `cd ..` back to the Primary Card in PuTTY.

### Over the RFD

The RFD is normally busy with live telemetry. To send commands over it (because the LoRa isn't answering, say):

1. **Close WINGS.** Only one program can have a serial port open at a time.
2. Turn off telemetry: `python rfdTurnOffTelemetry.py COMx`
   ([script](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/rfdTurnOffTelemetry.py)).
3. Open PuTTY on the RFD's COM port at **115200** baud and type commands, just like on the programmer.
4. When you're done, `tele on` to turn telemetry back on, close PuTTY, and set WINGS up again.

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/2699fbab-fd17-4d30-9721-b90407825b29, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/1f748197-f5b4-413a-b925-a0614efbbe74" %}

### Check the cards

Over the LoRa, or [over the RFD](#over-the-rfd):

1. `ls` on each card. Every card should see all three:

   ```text
   INTERFACE_CARD, ID: 2
   PRIMARY_CARD, ID: 4 (this card)
   SECONDARY_CARD, ID: 8
   ```

   If card A can't see card B, run `sync` on card A (it resets the card's CAN "phone") and `ls` again. If that
   doesn't fix it, `cd` to card B and `restart` it, wait, then `sync` and `ls` from every card again.
2. `flash status` on each card (`cd 8`, `ls`, `flash status`, `cd ..`, then the same for card 2). It should match the
   [empty values](#reset-for-flight). If it doesn't, `RESET` and check again.
3. `status {card_id}` for each card: `UFC_STATE_PAD` and **Online** everywhere.

Then:
- **If the LoRa works:** `tele on` (if you turned it off), close PuTTY, and set WINGS up again.
- **If only the RFD works:** leave telemetry off and PuTTY open on the Primary Card, ready to send `RECORD`.

## A few minutes before launch

### Recording

In theory the state detection starts recording when it sees the launch. At IREC 2025 it didn't
([state detection]({{ '/docs/projects/ufc/firmware/' | relative_url }}#state-detection)), and recording was started by
hand. So start it yourself, a few minutes before launch. Not much earlier than that: the Secondary Card fills its flash
in under an hour ([Timings & Budgets]({{ '/docs/projects/ufc/firmware/timings/' | relative_url }}#how-fast-each-card-fills-its-flash)).

**Over the LoRa:** run `python lora.py COMx`, then:
1. `pwd`, to check the LoRa still answers.
2. `RECORD`:

   ```text
   RECORD
   SUCCESS - Changed rocket_state to UFC_STATE_PAD_RECORD
   successfully sent RECORD command to card 2
   successfully sent RECORD command to card 4
   ```

3. `status`, `status 2`, and `status 4` should all show `UFC_STATE_PAD_RECORD`.
4. `flash status`, wait a few seconds, `flash status` again. The fill percentage should have gone up.

**Over the RFD** (WINGS closed, telemetry off, PuTTY open on the Primary Card): `RECORD`. If there's time, do the same
`status` checks (cards 2 and 8 this time, since you're on card 4) and the `flash status` check. Copy the PuTTY output
into a text file, then `tele on`, close PuTTY, and set WINGS up again.

{% include photo-links.html label="Screenshot" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/e246f281-d5dc-47fd-8ffe-fa8d6b702d76" %}

## After landing

1. Screenshot the WINGS Display tab to share with the team.
2. Connect over the LoRa (`lora.py`), or [over the RFD](#over-the-rfd).
3. Check the cards still see each other and the flash has data: `cd 8`, `ls`, `status`, `flash status`, then the same
   for cards 2 and 4.
4. `ls`, then **`LAND`**. This moves each card's circular buffer to the start of its flash.
5. `status`, `status 2`, and `status 4` should show `UFC_STATE_LANDED`.
6. Copy the terminal output into a text file.

Optional: turn telemetry back on (`tele on`) and use WINGS to help find the rocket, or send `gps` over the RFD for
its coordinates. Once the rocket is recovered, if the UFC still has battery, `sd status` should report
`SD card status: GOOD` and three files: `FlashBackup_Card2…`, `FlashBackup_Card4…`, and `FlashBackup_Card8…`.

## After the flight

### Get the data off

1. **WINGS logs:** copy them from `C:\Users\{you}\AppData\Roaming\Wings_data_logs` and upload them to the team Drive.
2. **SD card:** with the UFC off, take the SD card out of the Interface Card, copy the files to a computer, and write
   down their names:

   ```text
   FlashBackup_Card2_{timestamp}.txt
   FlashBackup_Card4_{timestamp}.txt
   FlashBackup_Card8_{timestamp}.txt
   ```

3. Put the SD card back, connect the Pitot cable between the Pitot card and the Interface Card, and power the UFC.
4. Connect the programmer to the **Interface Card**, open the terminal, and `ls`. You should see every card,
   including the Pitot.

### Check the flash contents

`flash status` on each card should show 100% filled, as long as nobody reset the flash after landing. Then
spot-check with `flash read {address}`, which prints one page:

| Card | Address | You should see |
|:--|:--|:--|
| Interface | `0` | All `FF` |
| | `0x700` | First half `FF`, second half data |
| Primary, Pitot | `0` | All data |
| | `0x1F700` | First half data, second half `FF` |
| | `0x20700` | First half `FF`, second half data |
| Secondary | `0` | All data |
| | `0x3F700` | First half data, second half `FF` |
| | `0x40700` | First half `FF`, second half data |

The boundaries line up with each card's reserved circular-buffer space: **0x20000** (128 KB) on the Primary and
Pitot cards, **0x40000** (256 KB) on the Secondary, and none on the Interface Card.

### Copy the flash to the SD card

If the SD files are missing or incomplete:

1. `sd status` should say `GOOD`.
2. `sd transfer` copies every card's flash to the SD card. Wait for it to finish.
3. `sd status` again should list **four** files.
4. If a card didn't transfer, do it on its own with `flash transfer {card_id}`.

Budget time for this. In the April 2025 overnight test, one full flash took about **34 minutes** to transfer.

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/b68f3f6e-6e4c-4172-b697-9a2b28bfdc23, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/52bf780f-ad1c-4611-b764-71deba74f8bb" %}

### Reading a flash straight to a computer

The slow way. It skips the SD card, and it's how the Pitot data was pulled off after IREC 2025.

1. Plug the programmer into the card you want to read.
2. Run [`readAllFlash.py`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Demos/readAllFlash.py) with the
   programmer's COM port. **This takes about 3 hours.** It saves `FlashDataASCII.txt` in `UFC-2024/Demos/`.
3. Run the conversion script to turn that into `FlashData.txt`, the binary contents of the flash. This one finishes
   instantly.
4. Open `FlashData.txt` with VS Code's Hex Editor. Packets start with `11 BA 5E BA` and end with `1E AB 11 CA`
   ([packet format]({{ '/docs/projects/ufc/firmware/packets/' | relative_url }})).

{: .check }
The old wiki calls the conversion script
[`convertFlashASCII.py`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Demos/convertFlashASCII.py). The IREC
2025 procedure calls it `convertAllFlash.py` and passes it a COM port. Check the `Demos/` folder for the current name.
