---
layout: default
title: Pitot Test Results
parent: Pitot Tube System
nav_order: 3
permalink: /docs/projects/pitot/test-results/
---

# Pitot Test Results
{: .no_toc }

Two bench tests of the Pitot Sensor Card from the end of April 2025, in the order they happened.
{: .fs-5 .fw-300 }

| Test | Date | Result |
|:--|:--|:--|
| [Overnight flash test](#overnight-flash-test) | 29–30 Apr 2025 | Ran ~19 h. Found a firmware bug reading the wrong ADC channels. |
| [Channel check](#channel-check) | 30 Apr 2025 | Every channel mapped to the right pressure sensor |

---

## Overnight flash test

**Setup:** Pitot tube left on overnight, collecting data. It wasn't recording to flash for most of the test, because
the flash was full for most of it. Code at commit
[`4f6094b`](https://github.umn.edu/Rocket-Team/UFC-2024/tree/4f6094b4b691c3304b527a56f8b205395267556e).

Ran
: About 17:00, 29 Apr 2025 to 12:00, 30 Apr 2025 (about 19 hours)

Battery
: 92% → 8%

Packets
: 2,485,359

Timestamps
: 23,572 to 8,369,981 ms (2.32 hours of recorded data)

Data
: [Drive folder](https://drive.google.com/drive/folders/1URs9cJkoubhn1YptRff1XKb_xFK0v9NZ?usp=sharing)
{: .facts }

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/afcf01aa-9c71-4e98-9c84-732653b3dfaa" caption="Overnight Pitot flash test data" %}

**What it showed:**

- **The BNO055 may calibrate itself when moved.** Whoever ran the test believed the BNO "got calibrated" when the
  pitot tube was moved around timestamp 830,000 (look at the acceleration and angle plots). We should make sure the
  BNO is calibrated before flight, but since it has to calibrate itself at power-on, that may not be possible.
- **`left_port` and `static_port` read the same data.** That was a firmware bug: at this commit, most of the ports
  were being read from the wrong ADC channels.

## Channel check

**What was done:** with the Pitot tube recording, each pressure sensor was pressed in turn (sensor 1, sensor 2,
sensor 3, and so on) to see which data channel responded.

**Result:** every channel recorded correctly and matched the right pressure sensor.

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/611339f9-8f40-44d8-a929-219adb791ab4" caption="Channel check: each sensor pressed in order" %}

{: .check }
The write-up doesn't say which commit the channel check ran on. It's reasonable to guess it was after the ADC channel
fix found the night before, but that isn't recorded.
