---
layout: default
title: WINGS Ground Station
parent: Projects
nav_order: 6
permalink: /docs/projects/wings/
---

# WINGS Ground Station
{: .no_toc }

Our ground station software. It receives telemetry from the UFC and from commercial flight computers at the same
time, plots it live, and records each flight for later.
{: .fs-5 .fw-300 }

Repo
: [UMN-Rocket-Team/WINGS](https://github.com/UMN-Rocket-Team/WINGS) (public, Apache 2.0)

Downloads
: [Releases](https://github.com/UMN-Rocket-Team/WINGS/releases) (v2.2.0 as of May 2026)

Developer docs
: [WINGS wiki](https://github.com/UMN-Rocket-Team/WINGS/wiki) and [CONTRIBUTING.md](https://github.com/UMN-Rocket-Team/WINGS/blob/main/CONTRIBUTING.md)

Stack
: Tauri desktop app. Rust back end; TypeScript, SolidJS, and Tailwind front end.

Runs on
: Windows, macOS, and Linux

Name
: **W**INGS **I**s **N**ot a **G**round **S**tation. It started out as WinGS, the **Win**dows **G**round **S**tation, and
  became recursive once it stopped being Windows-only.
{: .facts }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Why it exists

A big launch usually flies several flight computers for redundancy, some commercial and some of our own, and each
one talks its own protocol on its own frequency. Normally that means a separate base station radio and a separate
laptop running separate software for each one. A lot of that software only runs on certain operating systems, and some
of it is bad at what you actually need during recovery. Some ground stations show a velocity graph without making the
current descent rate obvious, or just freeze on the last packet when they lose signal, so you can't tell which way the
rocket was drifting.

WINGS aims to be one piece of software that talks to every flight computer at once, so data from different
computers can be cross-checked, with a display you can rearrange for each flight (single stage, two stage, different
sensors). The goal is to cover as many flight configurations as possible while keeping troubleshooting at the launch
site to a minimum. Right now its scope is processing, saving, and displaying data during flight and recovery.

## Where it's at

- WINGS was selected for the team's **podium presentation at IREC 2025**, because working with flight computers from
  several brands at once is something few ground stations do.
- The software lead's 2025 notes call what flew at IREC 2025 "more of a proof of concept", with the goal of turning
  it into a complete product.
- In **summer 2025** the repo moved from the UMN Enterprise GitHub to
  [public GitHub](https://github.com/UMN-Rocket-Team/WINGS). The old copy at `github.umn.edu/Rocket-Team/WINGS`
  is out of date.
- For **2026–27** the software subteam is continuing WINGS back-end work and building out the
  [Grafana setup](#grafana), so several people at the launch site can watch live.

## What it talks to

From the [README](https://github.com/UMN-Rocket-Team/WINGS#features) as of 2026:

| Kind | Supported |
|:--|:--|
| Base stations and other inputs | Entacore AIMBASE, Featherweight GPS Tracker, Altus Metrum TeleDongle, any serial input (RFD, XBee, etc., usually through an FTDI USB-serial cable) |
| Flight computers and trackers | Entacore AIM XTRA, Featherweight GPS Tracker, Altus Metrum TeleMega and TeleMetrum, and our own [UFC]({{ '/docs/projects/ufc/' | relative_url }}) over a serial radio |
| Displays | Line graphs, scrolling-window graphs, direct readouts, inclination indicator, dark and high-contrast modes |

The UFC connects as a plain serial device: its radio's ground-side modem plugs into the laptop and shows up as a
serial port. Flights have also used a Teensy with a LoRa module this way (the Leep mini on the 2024 High Altitude
flight).

## Using it on launch day

This is the flight setup order from the 2025 WINGS notes. The UFC-specific steps (radio settings, which packets
to plot) are in [Flight Operations]({{ '/docs/projects/ufc/operations/' | relative_url }}#live-telemetry-in-wings).

1. **Open or create a flight config** from the title screen.
2. **Add or remove packet types** in the config.
3. **Add your radios** on the **Communications** tab, using the "Add ___" buttons in the left column:
   - *Add serial port*: anything that shows up as a serial or virtual serial port, like an RFD900x on an FTDI cable
     (this is how the UFC connects).
   - *Add Altus Metrum product*: a TeleDongle.
   - *Add Aim Xtra*: an AIM XTRA over USB.
   - *Add paths*: raw data files from the UFC or an Altus Metrum computer, for replaying a flight.

   Adding radios first also lets WINGS sanity-check the config (for example, that you haven't modified the AIM XTRA's
   built-in packets). The right-hand column lights up when packets arrive; the middle column sends data out over
   serial and is mostly a developer debugging tool.
4. **Set up the display** on the **Settings** tab. The buttons in the top left add graphs and indicators, which fill
   the display left to right, then top to bottom. Click one to open its settings and pick which data it shows.
5. **Save the config** for later.
6. **Connect the radios** at the launch site. Plug the radio into the laptop and pick it from the dropdown on the
   Communications tab.
7. **Watch the flight** on the **Display** tab.

There's a dark mode toggle in the top right of every tab, for better viewing indoors.

**After the flight**, WINGS keeps its logs in `C:\Users\{you}\AppData\Roaming\Wings_data_logs` on Windows. Copy
them to the team Drive.

### The 2024 procedure

The older, shorter version from 2024 (`2024 Wings Startup Procedure` in the Drive), for when you just need the UFC over
an RFD. The test procedures call this the "WINGS / UFC startup procedure".

**Bring:** the RFD modem, two RFD antennas, an FTDI cable, the WINGS laptop, and a way to charge it.

**Before launch day:** download the newest WINGS release, open it, set up graphs for the barometer, acceleration, and
BNO gyro, plus a GPS readout, then close it. Keep the laptop above 90% charge until launch.

**At the launch site, before the rocket goes on the pad:**
1. Turn the laptop on **without** the RFD plugged in.
2. Open WINGS and go to the Communications screen.
3. Plug the RFD in through the FTDI cable, and pick the new COM port in WINGS.
4. Wait for packets from the UFC.
5. Once packets are arriving, don't close WINGS until the rocket has probably been on the ground for at least
   5 minutes.

{: .check }
> These steps come from notes written in 2025, before WINGS v2.1 and v2.2. At that point steps 1, 2, and 5 weren't
> finished: configs were created and saved automatically (the app remembers the last config, but you couldn't send
> one to another computer), and adding packet types was disabled ("use an older version of WINGS or reach out to the
> devs"). The notes also say a TeleDongle sometimes doesn't show up as a device you can connect to. Check the
> [WINGS wiki](https://github.com/UMN-Rocket-Team/WINGS/wiki) for the current behaviour.

## Defining packets

WINGS doesn't have the UFC's packet formats built in. They're defined in JSON files; the UFC's live in the
[`WINGSpacket`](https://github.umn.edu/Rocket-Team/UFC-2024/tree/main/WINGSpacket) folder of the UFC repo, and the
packet editor can import and export them.

A packet definition is a list of three kinds of pieces:

| Piece | What it is |
|:--|:--|
| **Delimiter** | A fixed byte string (entered in hex) that identifies the packet in the incoming byte stream |
| **Field** | Bytes WINGS should decode. You give it a name and a data type, and the length follows from the type. Fields can also carry a metadata tag that tells the back end to treat them specially (e.g. as a timestamp). |
| **Gap** | Bytes WINGS should skip |

Rules of thumb, from the constraints written for the original WinGS (2020). The current code may be looser, but these
still keep parsing reliable:

- Every packet type needs a **fixed size** and a **unique delimiter scheme**: at least one non-zero delimiter byte, or a
  delimiter position, that no other packet shares.
- Use **both a start and an end delimiter** if you can. With only one, a dropped byte over the radio corrupts
  everything after it in that packet, and it still gets parsed as if it were fine.
- Values are **little-endian**. No arrays or structs inside a packet.
- Convert to real units **on the rocket** before sending, so the ground station shows the value as-is.

If you change a packet in the UFC's [`packets.h`]({{ '/docs/projects/ufc/firmware/packets/' | relative_url }}),
update its JSON definition too.

## Requirements

The 2026 ground station requirements from the team's requirements sheet (`UMNRKT Requirements.xlsx`, "Wings
Requirements" tab). None of them had been marked as verified yet.

| ID | Requirement | Verified by |
|:--|:--|:--|
| GNDSTN | The ground station shall collect, record, and display flight telemetry from the rocket | Demonstration |
| GNDSTN-1 | Collect flight telemetry from the rocket | Demonstration |
| GNDSTN-1.1 | Use an **E22-400T33S** radio to talk to the UFC (other RFD modems aren't compatible) | Inspection |
| GNDSTN-1.2 | Receive and process telemetry at **64 kbps** | Analysis |
| GNDSTN-2 | Record flight telemetry from the rocket | Demonstration |
| GNDSTN-2.1 | Record separate flights individually | Demonstration |
| GNDSTN-2.2 | Export a single flight's data as CSV | Demonstration |
| GNDSTN-3 | Display flight telemetry | Demonstration |
| GNDSTN-3.1 to 3.7 | Show Mach number, altitude, UFC battery state of charge, roll rate, pitch, yaw, and X/Y/Z acceleration | Demonstration |
| GNDSTN-3.8 | Let several people view current flight data at once (e.g. a web portal) | Demonstration |
| GNDSTN-3.9 | Show a 3D rendering of the rocket's orientation | Demonstration |
| GNDSTN-4 | Work without an internet connection | Demonstration |

GNDSTN-1.1 is because the UFC moved from the RFD900 (which flew at IREC 2025) to a 433 MHz E22 LoRa radio for 2026
([Primary Card radio]({{ '/docs/projects/ufc/cards/primary-card/' | relative_url }}#radio)). The launch-day steps above
still describe the RFD setup.

## Grafana

The 2025–26 plan for GNDSTN-3.8 (several people watching at once), from the December 2025 PDR. The notes also call
the idea UGGS, the Universal Grafana Ground Station.

{% include figure.html src="/assets/images/projects/wings/wings-grafana-design.png" alt="Block diagram: radio and log files feed the WINGS back end, whose InfluxExporter writes to an InfluxDB bucket that Grafana reads, all inside one Docker Compose application" caption="WINGS + Grafana integration, design draft 1" %}

- **WINGS back end.** Works as before: it reads packets from the radios (or a log file), parses them, and logs the
  raw data to `.wings` or `.csv` files. The one addition is an **InfluxExporter** module. Once a packet is fully
  processed, a copy goes to InfluxExporter, which converts it to InfluxDB line protocol and writes it to a local
  database bucket through the InfluxDB v2 HTTP API.
- **InfluxDB** (v2.7) is a time-series database: fast writes of numbers, real-time queries, and retention policies that
  delete old data automatically.
- **Grafana** reads from InfluxDB (it supports it out of the box) and shows dashboards of charts, gauges, and tables.
  Dashboards can be set up beforehand or at the launch site.
- **Docker.** WINGS, InfluxDB, and Grafana each run in their own container, started together with one Docker Compose
  file. You need a Docker runtime installed. An installer that bundles Docker Desktop, the Compose file, and a launch
  script was floated.

**At the launch site**, it's meant to run on a closed network with no internet: one ground station laptop runs the
whole thing, and other laptops connect to it through a local 2.4 GHz Wi-Fi access point and open Grafana in a browser,
with viewer-only accounts. The host laptop sees both WINGS and Grafana. Testing was planned with live data, past
flight data, and deliberately manipulated flight data.

{: .check }
> Open questions from the PDR:
> - **2.4 GHz Wi-Fi at the competition.** IREC may reserve 2.4 GHz for ground support equipment. The team asked the
>   organisers, whose answer at the time was that they were "figuring it out". The fallback is a wired network.
> - **Refresh rate.** Expected to get down to milliseconds, but not tested.

## History

| Years | Ground station |
|:--|:--|
| ~2019–2022 | **WinGS**, a Windows-only C#/.NET app built alongside UFC1. Live telemetry over a serial port (tuned for the RFD900), auto-updating graphs, CSV and custom "Flight" file export and import, a telemetry simulator, and dark mode. Packet formats came from a config file. |
| 2022 onward | **WINGS**, rewritten from scratch in Tauri, Rust, and SolidJS so it runs on any OS. |
| 2024–25 | Focus on data processing, talking to commercial avionics (Altus Metrum, Entacore, Leep), and the SAC live telemetry video challenge. The plan also lists features to carry over from an older Python ground station: a GPS map, CSV playback, and status lights. |
| Summer 2025 | Open-sourced on public GitHub. |

The 2024–25 plan's wish list is a good source of project ideas: sending commands to the rocket from buttons in WINGS
(including automatic ones), playback with seek and speed control, trimming pre-launch and post-landing data, a state
machine that combines data from several computers, and hardware-in-the-loop testing with the UFC.

## Working on WINGS

Start with the [Software tutorials]({{ '/docs/tutorials/software/' | relative_url }}), then the repo's
[README](https://github.com/UMN-Rocket-Team/WINGS#developing) (build steps) and
[CONTRIBUTING.md](https://github.com/UMN-Rocket-Team/WINGS/blob/main/CONTRIBUTING.md). Questions can go in the repo's
[Discussions](https://github.com/UMN-Rocket-Team/WINGS/discussions) or the #avionics Slack channel.
