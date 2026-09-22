---
layout: default
title: "Week 3: Roll Rate Control"
parent: Crash Course
grand_parent: GNC
nav_order: 4
permalink: /docs/tutorials/gnc/crash-course/week-3/
math: true
---

# Week 3: Closing the loop 😉
{: .no_toc }

We will add a controller to your Week 2 plant that drives roll rate to zero using a control tab, and find out what
limits how well it can work. There is no step by step this week.

{: .fs-5 .fw-300 }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Readings

- **Tim Wescott, [PID Without a PhD](https://www.wescottdesign.com/articles/Sampling/pidwophd.html)** (~40 min). A free PDF is available online.
- **MATLAB Tech Talks, ["Understanding PID Control"](https://www.mathworks.com/videos/series/understanding-pid-control.html)**, Part 2 onward, especially the **integrator windup** episode (~30 min)
- **IREC DTEG, Sections 7.3 and 7.4** [link](https://static1.squarespace.com/static/687d3841f7d71450d1ba824d/t/69a0d16686b10911a06afa5e/1772147046804/2026+IREC+DTEG+V1.1.pdf)

## Supplemental readings

- *[MathWorks Control Design Onramp with Simulink](https://matlabacademy.mathworks.com/details/control-design-onramp-with-simulink/controls)*
  - Hands-on, but takes a few hours. Worth it if Simulink control design still feels unfamiliar
- *Astrom & Murray, Feedback Systems*
  - If interested in math behind phase margin, read frequency response chapter
- *[MathWorks Stateflow Onramp](https://matlabacademy.mathworks.com/details/stateflow-onramp/stateflow)*
  - Learn state machine concepts
- *[MathWorks Reinforcement Learning Onramp](https://matlabacademy.mathworks.com/details/reinforcement-learning-onramp/reinforcementlearning?s_tid=srchtitle_support_results_1_Reinforcement%20Learning%20Onramp)*
  - Learn intelligent controller design, not really as applicable for what we will be doing

---

## The task

Design a roll rate controller for your [Week 2 roll plant]({{ '/docs/tutorials/gnc/crash-course/week-2/' | relative_url }}#part-1-build-a-roll-plant-in-simulink)
that uses a control tab to drive roll rate to zero, and **passes the success criteria below**

Feel free to go about different controller structures. There is more than one design that will pass.

## The plant

### Tab moment

The tab creates a roll torque proportional to dynamic pressure and deflection:

$$
M_{\text{tab}} = c_t \rho V^2 \delta
$$

with $$c_t = 4.77\times10^{-5}$$ and $$\delta$$ in **radians**.

### New plant equation

$$
I_{xx}\frac{dp}{dt} = M_{\text{forcing}} + M_{\text{tab}} - M_{\text{damping}}
$$

Use the same $$I_{xx}$$, $$\rho$$, $$c_f$$, and $$c_d$$ as Week 2.

### Requirements

Your design will work within these requirments.

| Item | Requirement |
|:--|:--|
| Servo | First-order lag, time constant **0.02s** |
| Tab limit | **±15°**, using a Saturation block |
| Controller rate | **100 Hz**: discrete, sample time **0.01s** |
| Velocity | Constant **V = 100 m/s** |
| Target | Roll rate **= 0** |
| Solver | Fixed step, **0.001 s** (same as Week 2) |
| Parameters | All constants and gains in your `roll_params_<name>.m`. No magic numbers in blocks. |

{: .important }
> **Sign convention:** a positive roll rate must produce a tab command that pushes the roll rate back down.

## Test scenarios

Run both scenarios with the **same gains**. Don't retune between them.

| ID | Scenario | Setup |
|:--|:--|:--|
| **A** | Engage at rest | Controller on from $$t = 0$$, initial roll rate 0. Stop time 4s. |
| **B** | Engage while spinning | Controller **off** (tab at 0°) for the first 1s, so the rocket spins up. Controller switches on at $$t = 1$$ s. Stop time 4s. |

## Success criteria

Measure time from when the controller switches on. $$p$$ is roll rate in deg/s.

| ID | Criteria | Applies to | Pass if |
|:--|:--|:--|:--|
| **S1** | Settling time: the last time $$\lvert p \rvert$$ is above 5 deg/s | B | ≤ **0.5s** |
| **S2** | Overshoot: how far $$p$$ goes past zero, in the opposite direction | B | ≤ **30 deg/s** |
| **S3** | Steady-state error: $$\lvert p \rvert$$ at $$t = 4$$ s | A, B | < **0.5 deg/s** |

Have your run script compute these from the simulation output rather than reading them off a plot.

## Questions to think about
Once your design passes, think about these. 

1. **Saturation.** Where in scenario B does the tab hit its ±15° limit? What happens to your controller while it's pinned there, and how did you handle it?
2. **Servo lag.** Keep your gains and increase the servo time constant. Roughly where does the response fall apart, and why?

<details markdown="block">
  <summary>Optional, if you want more</summary>

- Run scenario B at V = 50 and 30 m/s with the same gains. What changes, and what would you do about it when V changes throughout a real flight?
- Change $$I_{xx}$$ or $$c_t$$ by ±30% without retuning. Does your design still pass? Our real values are never known exactly.
</details>

## What to push

Push to `CC/<x500>/`:

- [ ] `roll_control_<name>.slx` and the updated `roll_params_<name>.m` (with your gains)
- [ ] A run script that runs both scenarios and prints S1–S3
- [ ] Update your `README.md` with how to run it and a line on your controller structure

## If you're stuck

<details markdown="block">
  <summary>Hint 1: nothing works at all</summary>

Check the sign before touching gains. With the controller off, give the tab a small fixed positive deflection
and see which way the roll rate goes. Then make sure a positive roll rate makes your controller command the
deflection that opposes it.
</details>

<details markdown="block">
  <summary>Hint 2: it settles, but not to zero (fails S3)</summary>

The fin misalignment is a constant torque that never goes away. What does the controller need so it can keep
holding a non-zero tab deflection when the error is zero?
</details>

<details markdown="block">
  <summary>Hint 3: huge overshoot in scenario B (fails S2)</summary>

What is your controller doing internally while the tab is pinned at its limit? Re-watch the integrator windup
video.
</details>

<details markdown="block">
  <summary>Hint 4: it oscillates or blows up when you raise the gains</summary>

The servo lag and the 100 Hz sampling both add delay to the loop. More gain means less tolerance for delay.
How fast can this loop really respond given those two things?
</details>
