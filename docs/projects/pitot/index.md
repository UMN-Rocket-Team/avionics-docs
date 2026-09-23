---
layout: default
title: Pitot Tube System
parent: Projects
nav_order: 2
has_children: true
has_toc: false
permalink: /docs/projects/pitot/
math: true
---

# Pitot Tube System
{: .no_toc }

A pitot-static probe that replaces the nose cone tip, plus two boards behind it that measure static pressure,
total pressure, and the pressures used to work out angle of attack.
{: .fs-5 .fw-300 }

Where it sits
: The tip of the nose cone, right above the UFC

Boards
: [Pitot Sensor Card]({{ '/docs/projects/pitot/sensor-card/' | relative_url }}) and [Pitot Power Card]({{ '/docs/projects/pitot/power-card/' | relative_url }})

Sensors
: 6 analog pressure sensors, plus a BNO055 IMU for launch detection

Power
: Its own 2S2P 18650 pack, or the UFC through the Interface Card

Arming
: Magnetic switch (no physical access once it's in the nose cone)

Firmware
: [`Firmware/Pitot_Card`](https://github.umn.edu/Rocket-Team/UFC-2024/tree/main/Firmware/Pitot_Card), CARD_TYPE 16

Status
: Redesigned probe for 2025–26, with a wind-tunnel calibration at Collins Aerospace planned for January 2026. The fall 2026 kickoff slides say it was calibrated; the data isn't in the old wiki or the Drive export.
{: .facts }

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/30202/484dc91a-396d-4b18-a02d-40a45c709572" caption="Pitot tube system overview" %}

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## How it works

A pitot tube is a slender tube with ports facing straight into the airflow and ports perpendicular to it. It's
the standard way to measure airspeed on aircraft. Ours sits at the very tip of the nose cone, with the
electronics right behind it:

- The **[Pitot Power Card]({{ '/docs/projects/pitot/power-card/' | relative_url }})** turns the 2S2P battery pack
  into regulated 5 V and 3.3 V. It has screw terminals for a
  [Featherweight magnetic switch](https://www.featherweightaltimeters.com/store/p4/Magnetic_Switch.html), which turns
  the system on at the pad. It has to be a magnetic switch because the system is fully sealed inside the nose cone
  before launch, with no way to reach it.
- The **[Pitot Sensor Card]({{ '/docs/projects/pitot/sensor-card/' | relative_url }})** has the six pressure sensors
  and an IMU. It can be powered by the Pitot Power Card, or by the UFC through the Molex CLIK-Mate connector on the
  [Interface Card]({{ '/docs/projects/ufc/cards/interface-card/' | relative_url }}). When it's connected to the UFC,
  it can also talk to the other cards over CAN.

When the system powers up, it sits idle and periodically reads the accelerometer to see if the rocket has
launched. Once it has, the STM32 reads the analog pressure sensors and writes the data to its flash chip. (The
2025–26 PDR slide says data is saved to the STM32's own embedded flash from power-on, and to the flash chip once the
IMU sees launch.)

At IREC 2025 this launch detection worked, and the UFC's didn't
([UFC state detection]({{ '/docs/projects/ufc/firmware/' | relative_url }}#state-detection)). Comparing the two
algorithms is one of the 2025–26 PDR action items.

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/22969/a7706732-ba63-4f1f-be3f-d394e18e1330" caption="Pitot system block diagram" %}

### The six pressure sensors

| Sensors | Port | Measures |
|:--|:--|:--|
| 1 | Center port, facing into the flow | Total (stagnation) pressure. The old docs call this the "dynamic" reading. |
| 1 | Static ports around the body | Static (atmospheric) pressure |
| 4 | Radial ports on the cone | Pressure differences used to work out angle of attack (the angle between the rocket's long axis and the oncoming air) and sideslip |

The sensors have analog outputs, which gives more freedom in choosing how accurately to digitise them.

{% include photo-links.html label="Probe images" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/464e3ad7-8a9f-4d3e-8565-2b00664b0b36, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/7fe66582-719e-4e51-a970-42de3c5a7146, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/1e47e5d2-c5e1-4c16-8687-f302724efff5" %}

### From pressure to airspeed

These are the standard textbook relations, as background. For 2025–26 the firmware was changed to calculate Mach
number on board, with per-sensor calibration offsets, and send it to the UFC over CAN (2025–26 PDR). The code
itself isn't described anywhere migrated here. The ~2019 probe ([History](#history)) used the subsonic and Rayleigh
equations below, with an uncertainty of about ±0.017 Mach.

With total pressure $$p_t$$ and static pressure $$p_s$$, the dynamic pressure is $$q = p_t - p_s$$. At low speed,
where air is effectively incompressible:

$$
V = \sqrt{\frac{2\,(p_t - p_s)}{\rho}}
$$

That needs the air density $$\rho$$. Once compressibility matters (roughly above Mach 0.3), use the subsonic
isentropic relation instead. It gives Mach number from the pressure ratio alone, with $$\gamma = 1.4$$ for air:

$$
M = \sqrt{\frac{2}{\gamma - 1}\left[\left(\frac{p_t}{p_s}\right)^{\frac{\gamma-1}{\gamma}} - 1\right]}
$$

Above Mach 1 a shock forms in front of the probe and neither formula holds; you need the Rayleigh pitot-tube
formula. It has no closed-form solution for M, so the ~2019 code solved it with Newton's method. Turning the four
radial pressures into angle of attack and sideslip needs a calibration for this particular probe
([Calibration](#calibration)).

## Probe design

The probe is part mechanical, part electronic. The design comes from the *Springer Handbook of Experimental Fluid
Mechanics* and from feedback from engineers at Collins Aerospace.

There are **5 ports at the tip** (the center port plus 4 radial ports) and **8 static ports** around the body. They
feed **6 separate pressure measurements**: center, 4 radial, and one shared static.

| Part | Size / material | Why |
|:--|:--|:--|
| Tip cone | 6061-T6 aluminum, 33° half angle | The Springer Handbook data shows a cone this angle reads Mach number the same up to 18° angle of attack, which is plenty for our flights. |
| Center port | 0.180 in diameter | A bigger center port gives more accurate readings (Collins and the Springer Handbook). The size was also limited by the footprint of the probe body. |
| Radial ports (×4) | 0.0625 in diameter | Collins suggested 0.060 in, but the machine's spindle speed limited us to 0.0625 in. |
| Body | Single 6061-T6 aluminum tube, 0.75 in ID, 1.00 in OD, threaded inside and out | Holds the pitot and radial pressure tubes, the static pressure volume, and mounting points for the electronics. It's one of the three parts of the nose cone attachment. |
| Static ports (×8) | 0.0625 in diameter | Many small holes make the static reading insensitive to angle of attack. |
| Tubing | 3/16 in ID Tygon | Connects the ports to copper studs on the electronics side. |

**Attachment.** It works like the compression fitting on a commercial nose cone tip: the nose cone is clamped
between the conical transition section and a mounting washer inside the nose cone, with the aluminum body of the
probe in tension (the way the bolt is in the commercial version). The forces on the fiberglass shouldn't be any
higher than with a normal nose cone tip under nominal recovery, because the axial bearing area is bigger than the
original COTS tip's. That comes from the changes made to the nose cone to fit the probe's larger conical transition.

**Manifold.** Above the Pitot Sensor Card sits an acrylic plate with aluminum standoffs embedded in it. The
standoffs have machined pockets for radial O-ring seals. The card itself mounts on a second acrylic plate.

{: .check }
The old write-up says the attachment's strength is shown by "the structural simulation detailed in diagram XX in
Appendix XX". It was lifted from a report, and neither the simulation nor the appendix made it into the wiki.

### 2025–26 changes

From the December 2025 PDR:

- **Angle-of-attack ports** re-drilled normal to the conical surface, in a 5-hole layout for angle of attack and
  sideslip.
- **1/8 in copper tubing** from the ports, with **epoxy potting**, instead of the Tygon above. A retaining disk and an
  "instrumentation suite mount" hold the electronics behind the nose cone transition.
- **Electronics:** "circuitry identical to 2024", with firmware changes: Mach number calculated on board, pressure
  calibration offsets built in, and data sent to the UFC over CAN. Power is still a 2S2P 18650 pack.
- **Sensors:** the center port is estimated to see about 63 psi at most, and the others much less. The PDR compared
  keeping six identical 100 psi sensors (±0.25%) with a mixed set: a barbed 100 psi sensor (±0.5%) for the center
  port and 60 psi sensors (±0.25%) for the rest. The component table still lists the 100 psi part for all six, so
  the mixed set may not have happened.

## Calibration

Each port reads a little differently because of manufacturing variation, so the probe has to be calibrated as a
whole in a wind tunnel. The plan described at the 2024–25 PDR: put the probe in a transonic wind tunnel at 0° angle
of attack for the head-on readings, calibrate the center port at known transonic Mach numbers, and calibrate each
radial port individually at set angles. Before that, the team used numbers provided by Collins and had never
calibrated with our own sensors. On the bench, the team checked the sensors responded to pressure with a rubber air
pump, and had no plans to validate accuracy at high pressure.

The 2025–26 PDR planned the calibration in **Collins Aerospace's transonic wind tunnel in January 2026**, sweeping
angle of attack over 10°.

{: .check }
Nothing migrated here has the calibration results or says where they're stored. If you find them, link them here.

## Design review feedback

Reviewers at the 2024–25 PDR spent most of their Pitot time on the analog side:

- **Do an error budget.** Work out the pressures and voltages you expect in flight, add noise and tolerances at every
  step, and see how much the ADC reading actually changes. That tells you whether you need an instrumentation amplifier
  to use more of the ADC's range. (The team's answer: the sensors put out 0.5–4.5 V, the peak should be about 64 psi
  of the 100 psi range, and that's scaled down to 3.3 V for a 16-bit ADC.)
- **All the analog signals are single-ended**, which makes the analysis a bit harder.
- **Simplify the power.** Put the sensors and the ADC on the same rail so any ripple is common to both, and consider
  dropping the switching regulator or moving the linear regulators downstream of it
  ([Pitot Power Card]({{ '/docs/projects/pitot/power-card/' | relative_url }})).
- **Add debugger pins** to the Sensor Card.

## History

The team has flown a pitot probe for a while. The earliest write-up in the Drive
(`Archive/Air Data Systems/PITOT PROBE`, around 2019) describes a different design:

- The probe was **built into the nose cone** rather than replacing its tip, because earlier probes had been fragile
  and broke on landing, and the previous year's tubes had kinked and twisted.
- Total pressure came in through an axial channel at the tip. The threaded rod that held the nose cone on had a
  1/8 in hole through it that doubled as that channel.
- Static pressure came from **six holes** drilled into the fiberglass 12 in from the tip, feeding a semi-torus inside
  that averaged them to make the reading insensitive to angle of attack.
- **Two sensors**: an absolute one on static pressure, and a differential one between total and static.
- UTC Aerospace Systems (now part of Collins) advised on the design and gave simulation feedback.

## Pages in this section

| Page | What's on it |
|:--|:--|
| [Pitot Sensor Card]({{ '/docs/projects/pitot/sensor-card/' | relative_url }}) | Pressure sensors, analog front end, IMU, schematic, PCB |
| [Pitot Power Card]({{ '/docs/projects/pitot/power-card/' | relative_url }}) | Low-noise power for the sensors, standalone or through the UFC |
| [Pitot Test Results]({{ '/docs/projects/pitot/test-results/' | relative_url }}) | Overnight flash test and channel check, April 2025 |
