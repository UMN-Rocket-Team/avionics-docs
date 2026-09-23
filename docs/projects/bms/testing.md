---
layout: default
title: BMS Testing
parent: Battery Management System
nav_order: 1
permalink: /docs/projects/bms/testing/
math: true
---

# BMS Testing
{: .no_toc }

Environmental and electrical tests of the BMS: thermal soak, discharge surge, short circuit, and hot-case discharge
capacity.
{: .fs-5 .fw-300 }

{: .check }
> The old wiki recorded the environmental tests below almost entirely as screenshots and photos, with no dates and no
> written results. The [verification plan](#verification-plan) gives the intended pass criteria, but nothing records
> whether each test passed. If you ran these tests, please add the results.
>
> The plots are screenshots from **MAX software**, which appears to be the vendor's evaluation software for the
> MAX17320.

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Verification plan

How each [requirement]({{ '/docs/projects/bms/' | relative_url }}#requirements) was planned to be verified, from the
2026 verification matrix (`2026 System Requirements Verification Matrix.xlsx`, "BMS" tab).

| ID | Method | Plan |
|:--|:--|:--|
| EPS-1 (125 °F) | Analysis | Test to **145 °F** instead, per MIL-STD-810H Table 501.7-I, "Induced Basic Hot A2" (85–145 °F). |
| EPS-2 (power the mission) | Analysis | With the UFC connected to the BMS, step through the mission by entering terminal commands at mission times: pad at T = 03:30:00, powered ascent at 03:30:00, unpowered ascent at 03:30:08, apogee/drogue at 03:30:42, main at 03:36:56, landed at 03:38:00. |
| EPS-2.1 (40 Wh) | Test | Capacity test (below). Pass if more than **40 Wh** comes out before the cells reach 3.0 V. |
| EPS-2.2 (min voltage) | Analysis | "Verified through 3S2P configuration": 3 × 2.5 V minimum cell voltage = **7.5 V**. (The requirement itself says 11.2 V; see the note on the [BMS page]({{ '/docs/projects/bms/' | relative_url }}#requirements).) |
| EPS-3 (telemetry) | Demonstration | System test with the UFC. Pass if the UFC can track the battery's reported capacity, state of charge, temperature, current, and time to empty. |
| EPS-3.1 (SOC at 10 Hz) | Demonstration | Pass if the UFC receives power telemetry faster than 10 Hz. |
| EPS-3.2 (power out at 10 Hz) | Demonstration | Connect the UFC to the BMS. Pass if it can request and receive the battery current faster than 10 Hz. |
| EPS-3.3 (CAN) | Inspection | Check that CAN is used between the BMS and the UFC. |
| EPS-4 (charge in 4 h) | Analysis | Discharge to 0% state of charge, connect a 12 V source (the plan says through an XT30), and time how long it takes to reach 100%. Pass if it takes 4 hours or less. |

**Capacity test procedure** (EPS-2.1):

1. Charge the pack fully (4.2 V per cell).
2. Let it rest for 2 hours.
3. Connect an inline power meter and a 20 Ω power resistor to the **unprotected** pack, and start a timer. The plan
   says "<10 W"; at a full 12.6 V the resistor dissipates 12.6² / 20 ≈ 8 W, so use one rated for at least that.
4. Stop when a cell reaches **3.0 V**, which counts as discharged.
5. Pass if more than 40 Wh went through the power meter.

{: .warning }
The capacity test discharges the pack without its protection. Stay with it, and stop at 3.0 V per cell.

## Test sequence

The avionics environmental testing runs in this order:

1. **1-hour thermal soak**
2. **Vacuum soak**
3. **Thermal functional testing**

There are no vacuum soak results in the old wiki.

## Test profiles

The profiles presented at the December 2025 PDR. The thermal and vacuum profiles apply to all the avionics and are on
[UFC System Tests]({{ '/docs/projects/ufc/testing/system-tests/' | relative_url }}#environmental-test-profiles).
These two are specific to the BMS:

| Test | Profile | Why |
|:--|:--|:--|
| Discharge surge | 0 A, then **5 A for 30 s**, then back to 0 A | Simulates a short downstream. 5 A is 10× the expected draw; 30 s is the fuse's blow time with a factor of safety of 5. |
| Capacity | **6.5 W** (the UFC's power draw) for **6 hours** | 1 hour on the pad, 5 minutes of flight, 4 hours of recovery, and 1 hour of margin |

6.5 W for 6 hours is 39 Wh, which lines up with the 40 Wh requirement (EPS-2.1). The 4-hour recovery figure was
questioned at the review ([BMS page]({{ '/docs/projects/bms/' | relative_url }}#design-review-december-2025)). The
surge test in the old wiki's photos (below) used a 2.7 Ω load, about 4.7 A, close to this profile.

## Thermal soak

{% include figure.html src="https://github.umn.edu/user-attachments/assets/aea81402-0838-43d2-b8e3-cd193154c4ad" caption="Thermal soak profile" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/4eb5e5ec-33c3-4742-afbb-d88479eef2d0" caption="Thermal soak results in MAX software" %}

{% include photo-links.html label="Post-test photos" urls="https://github.umn.edu/user-attachments/assets/42e27acd-b41b-475a-90d0-8d9b27f18c03, https://github.umn.edu/user-attachments/assets/7f0b1c4f-a827-4dba-a2ef-bb2cfac923eb, https://github.umn.edu/user-attachments/assets/58b48cca-f8db-4212-9b6d-d78e5bff2263, https://github.umn.edu/user-attachments/assets/556e07e3-18f6-4205-b1ce-346cfa0f851c" %}

## Discharge surge

The pack is discharged into a **2.7 Ω** load at **12.6 V** (a fully charged 3S pack, 3 × 4.2 V). That gives a
theoretical maximum current of:

$$
I = \frac{V}{R} = \frac{12.6\ \text{V}}{2.7\ \Omega} \approx 4.67\ \text{A}
$$

{% include figure.html src="https://github.umn.edu/user-attachments/assets/8d1daabb-e21f-4e33-959a-50836660c284" caption="Surge testing profile" %}

{% include photo-links.html label="Setup photo" urls="https://github.umn.edu/user-attachments/assets/bfe3bca5-d476-4a71-bcc1-54ba0cb975af" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/2ad8a051-5dbc-4b3b-acaa-f10a7c02eb0d" caption="Surge test plots in MAX software" %}

## Short circuit

{% include photo-links.html label="Setup photo" urls="https://github.umn.edu/user-attachments/assets/4a573326-9d85-4b6b-b959-95e2cf38760d" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/ba667c36-6dc6-4413-b2c2-733a9cb8c152" caption="MAX software alerts and protection status during the short" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/082369e5-c25e-4a3a-8e42-5a3244498e52" caption="Short circuit test plots in MAX software" %}

## Hot-case thermal discharge capacity

{% include figure.html src="https://github.umn.edu/user-attachments/assets/0e5e1467-ee98-49f2-aa49-c99e0c174f18" caption="Hot-case thermal discharge capacity test" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/c223ef04-8b43-432d-be1c-f6fd3a933448" caption="Hot-case discharge plots in MAX software" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/6af6d60d-d2a3-4dcd-bd73-9f89de13aca9" caption="MAX software at the end of the test" %}
