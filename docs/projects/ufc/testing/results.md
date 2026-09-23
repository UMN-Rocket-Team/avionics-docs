---
layout: default
title: Test Results
parent: Testing & Validation
grand_parent: Universal Flight Computer
nav_order: 4
permalink: /docs/projects/ufc/testing/results/
---

# Test Results
{: .no_toc }

Write-ups of UFC tests that were recorded in the old wiki. Newer results belong in that year's validation
results document ([Where results live]({{ '/docs/projects/ufc/testing/' | relative_url }}#where-results-live)).
Pitot results are on the [Pitot Test Results]({{ '/docs/projects/pitot/test-results/' | relative_url }}) page.
{: .fs-5 .fw-300 }

| Test | Date | Headline |
|:--|:--|:--|
| [Overnight flash test 1](#overnight-flash-test-1) | 23 Apr 2025 | Both data cards filled their flash (about 2 h and 1 h of data). The Interface Card's flash wasn't working. |
| [Overnight flash test 2](#overnight-flash-test-2) | 23–24 Apr 2025 | 15 h of live RFD telemetry, 3.28 million packets |

The data files for both tests are in [this Drive folder](https://drive.google.com/drive/folders/1URs9cJkoubhn1YptRff1XKb_xFK0v9NZ?usp=sharing).

---

## Overnight flash test 1

**Goal:** check that the flash chips record accurate data, and stop recording when they're full.

**Setup:** UFC left running overnight with the Primary and Secondary cards recording (started with the `RECORD`
command). Code at commit [`430eb68`](https://github.umn.edu/Rocket-Team/UFC-2024/tree/430eb68924781c85bef3c7d0d1391fb70422968d).

| Time | What happened |
|:--|:--|
| 01:15, 23 Apr 2025 | Test started. Battery at about 20%. |
| First few minutes | Secondary Card flash filled about 5% in 3 minutes; Primary Card about 5% in 5 minutes. Interface Card flash still didn't work. |
| 12:48 | Came back to find both flash chips full. Started the SD transfer for the Primary Card (took 34 minutes). |
| 13:39 | SD transfer for the Secondary Card (also 34 minutes). |

The battery read 0% on the B6AC charger by the end, but the UFC was still running.

{% include photo-links.html label="Setup photos" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/3095bb51-e4b6-42a1-a271-25542438c16a, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/10422410-44d2-479f-80ba-fbdb8b4e3937" %}

### What was on the flash

| | Primary Card (Card 4) | Secondary Card (Card 8) |
|:--|--:|--:|
| Packets (counted by WINGS) | 1,683,382 | 1,525,201 |
| Timestamps | 82,474 to 7,569,577 ms | 50,126 to 3,878,589 ms |
| Time span | 124.8 min | 63.8 min |
| Average temperature | ~35.5 °C | ~27.8 °C |
| Average pressure | ~98,600 Pa | ~98,600 Pa |

The two cards' timestamps **aren't synchronised**. They were programmed at slightly different times, so 80,000 on
the Primary Card isn't the same moment as 80,000 on the Secondary Card.

On both cards, the circular buffer holds a tiny amount of `UFC_STATE_PAD` data, and everything after that is
`UFC_STATE_PAD_RECORD`, as expected for a test started with `RECORD`.

**Primary Card plots:**

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/35d60361-86b1-4c8f-94d2-30771557f77b" caption="Primary Card: timestamp-to-timestamp (left) and state (right)" %}

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/96e52d9c-565c-443b-b53c-19291d5534a4" caption="Primary Card: temperature in °C, about 35.5 average (left), and pressure in Pa, about 98,600 average (right)" %}

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/94b08197-9cac-4fb4-a16f-c1237cc01e89" caption="Primary Card: minutes (left), showing about two hours of data, and seconds (right)" %}

**Secondary Card plots:**

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/77b79cd4-ea0a-4517-b958-22931483006b" caption="Secondary Card: timestamp-to-timestamp (left) and state (right)" %}

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/0ec7a271-aa43-4863-a235-e31838b5bb39" caption="Secondary Card: temperature, about 27.8 °C average (left), and pressure, about 98,600 Pa average (right)" %}

A single outlier data point at a timestamp of about 2,050,000 squashes the Secondary Card's plots, so they aren't
very useful as-is.

## Overnight flash test 2

**Setup:** code at commit [`ac3f40b`](https://github.umn.edu/Rocket-Team/UFC-2024/tree/ac3f40b37b90500f0b758f79f98d3946d64896fd),
timestamps synced between cards this time. The RFD was sending live telemetry to WINGS the whole time.

| Setting | Value | Why |
|:--|:--|:--|
| `TX_POWER` | 20, no antennas | At 30 the RFD was getting worryingly hot |
| `RFD_SEND_CYCLE` | 5 | Gave a main loop of about 101 Hz on the Primary Card, which the tester called optimal |

Started
: 19:56, 23 Apr 2025

Ended
: 11:08, 24 Apr 2025 (15 h 12 min later)

WINGS packets
: 3,284,674 received over the RFD
{: .facts }

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/b4047fe2-5487-44d1-a1f7-f63d2cf743d3" caption="Overnight flash test 2, WINGS plots (1 of 2)" %}

{% include figure.html src="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/5ad4912c-571b-47b1-8448-4d578a386da4" caption="Overnight flash test 2, WINGS plots (2 of 2)" %}

{: .check }
The write-up for this test is just the setup and the packet count. It doesn't say whether the flash data was
checked, or what the plots show.
