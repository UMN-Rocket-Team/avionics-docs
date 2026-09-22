---
layout: default
title: "Week 1: What Is the Rocket Doing?"
parent: Crash Course
grand_parent: GNC
nav_order: 2
permalink: /docs/tutorials/gnc/crash-course/week-1/
---

# Week 1: What Is the Rocket (and Its Sensors) Doing?
{: .no_toc }

We want to be able to read recorded flight data and say what happened on that flight.
{: .fs-5 .fw-300 }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Why this matters

To do useful GNC work we need **bias, noise density, etc.** numbers from past flights, and we need
to understand *why* they are what they are. We will be testing our models and filters against past flight data, 
so this week is focused on learning how to read our noisy and biased sensor data.

## Readings

Readings are highly recommended to get you up to speed, but not neccesarly hard rules to complete. But if you don't understand the concepts you will struggle later in the semester. 

- **Woodman, [_An Introduction to Inertial Navigation_](https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-696.pdf)**, MEMS error sections (~30 min)
  - Section 3.2, "MEMS Gyro Error Characteristics"
  - Section 4.2, "MEMS Accelerometer Error Characteristics"
  - Read Table 2 and Table 3
  - The derivations aren't really that important to understand, I would focus on the text and tables.
  - *Also suggested:* Section 5, "Signal Noise Analysis", and Section 6.2.3
- **MATLAB Tech Talks, [Understanding Sensor Fusion and Tracking](https://www.mathworks.com/videos/series/understanding-sensor-fusion-and-tracking.html)**, Part 1 (~12 min)
- **IREC DTEG** [Link](https://static1.squarespace.com/static/687d3841f7d71450d1ba824d/t/69a0d16686b10911a06afa5e/1772147046804/2026+IREC+DTEG+V1.1.pdf)
  - Section 1.3: the definitions of "shall," "should," "may," and "will" (useful if you haven't read requirement documents before)
  - Section 7

## Supplemental readings

- NXP [AN5087](https://www.nxp.com/docs/en/application-note/AN5087.pdf), Allan Variance: Noise Analysis for Gyroscopes
- MathWorks, [Inertial Sensor Noise Analysis Using Allan Variance](https://www.mathworks.com/help/fusion/ug/inertial-sensor-noise-analysis-using-allan-variance.html)

These readings are optional, you might find the useful if you just love reading about GNC that much.


## Flight report
You should have a flight log downloaded or assigned, if not ask the GNC lead. 
Below is a step by step guide to analyze useful data from a past flight.
The goal is to write **reusable scripts** that pull these numbers out of any flight log. The numbers themselves
(bias, noise, clipping, event times) feed our sim's sensor model, so they get saved too. Questions along the way are
for you to think about, not to submit.

### 1. Sanity-check the data
- Load the data with `load_flight.py`.
- Find the sample rate (time between samples, `dt`):
  - What is the **median** `dt`? What is the **largest** `dt`?
- Does the accelerometer read about **1 g** while sitting on the pad?

### 2. Find the roll axis

The roll axis is the gyro axis that points along the rocket's length. Find **which axis** it is and its **sign**.

### 3. Find the flight events

Find the **sample time** of each event, and its **time since liftoff** (with liftoff at `t = 0`):

| Event | How to spot it |
|:--|:--|
| Liftoff | Long-axis acceleration goes above 2 g |
| Burnout | Long-axis acceleration drops sharply |
| Apogee | Highest barometric altitude |
| Deployment(s) | Sharp accelerometer spikes after apogee, maybe baro spikes from the ejection charges |

### 4. Choose a pad window

The pad window is a stretch of time where the rocket is powered and sitting still on the rail. We use it to
measure bias and noise.

- End it about **1 second before liftoff**.
- We want roughly **10–30 seconds** long.
- Plot the gyro and accelerometer data in chosen window:
  - Gyro traces should be flat.
  - Accelerometer magnitude should be ~1g throughout.

### 5. Compute pad statistics

For each channel in the pad window, compute:

| Statistic | What it tells you |
|:--|:--|
| Mean | Gyro: the **bias**. Accelerometer: **gravity plus bias** |
| Standard deviation | The **noise** |
| Number of samples | -- |

### 6. Check for saturation

Each sensor has a fixed range once it's configured. For every channel:

- Figure out what our sensor range was for the flight (this might be a bit hard to find, so ask the GNC lead if you can't find it).
- Find the largest absolute value and check whether it's within ~0.5% of the top of the range.
- A channel is **clipped** if it spends 2 or more samples there.
- Compute the percentage of **boost** samples (liftoff to burnout) that are clipped, for each channel.

{: .note }
The long-axis accelerometer is the one most likely to clip during boost.

### 7. Find the roll

- Find the **maximum absolute roll rate**, its timestamp, and which flight phase it happens in.
- Find the roll rate at **burnout**.

{: .note }
> *Something to think about:* why does the roll rate peak when it does? Keep this in mind for Week 2's roll model.

## What to push

Push everything to `CC/<x500>/` on the `CrashCourse` branch:

- [ ] Your analysis scripts (loading, event detection, pad statistics, saturation check)
- [ ] `<flight>_summary.csv` (or `.json`), ideally written by your script: flight name, sample rate (median and max `dt`), event times, pad window, bias and noise per channel, sensor ranges, and clipping % per channel
- [ ] Update or create a `README.md` with how to run the scripts

You don't need to push any plots. The scripts can regenerate them.
