---
layout: default
title: "Week 2: Rocket Roll"
parent: Crash Course
grand_parent: GNC
nav_order: 3
permalink: /docs/tutorials/gnc/crash-course/week-2/
math: true
---

# Week 2: Rocket Roll and why
{: .no_toc }

We are going to build a simplified model of rocket roll in Simulink. We will see how the roll rate responds to fin misalignment and roll damping, and then use gyro data from week 1 or a past flight to see what uncorrect bias does to roll angle estimates.
{: .fs-5 .fw-300 }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Readings

- **RocketPy, ["Roll equations for high-powered rockets"](https://docs.rocketpy.org/en/v1.0.0/technical/aerodynamics/roll_equations.html)** (~30 min), key ideas:
  - Fin misalignment pushes the rocket into a spin.
  - Roll damping resists it.
  - They balance at a steady roll rate.
- **MATLAB Tech Talks, ["Understanding PID Control"](https://www.mathworks.com/videos/series/understanding-pid-control.html)**, Part 1 (~10 min)
- **[MathWorks Control System Modeling Essentials](https://matlabacademy.mathworks.com/details/control-system-modeling-essentials/otmlslcsme)**

## Supplemental readings

- Hoult, [_Sounding Rocket Fin Design to Mitigate Roll Lock-In_](http://www.rsandt.com/media/Sounding%20Rocket%20Fin%20Design%20to%20Mitigate%20Roll%20Lock-In.pdf)
   - If you are interested in OpenRocket/RASAero desigining fins to avoid roll lock-in.
- 3Blue1Brown & Ben Eater, [Visualizing Quaternions](https://eater.net/quaternions/video/intro)
   - If you are interested in how 3 DOF rotations will work.

---

## Part 1: Build a roll plant in Simulink

Lets model the rocket's roll rate response to fin misalignment and roll damping.

### Physics review

Rotation works just like linear motion, with each quantity swapped for its rotational version:

| Linear motion | Rotational motion |
|:--|:--|
| Mass $$m$$ | Moment of inertia $$I_{xx}$$ |
| Acceleration $$a$$ | Angular acceleration $$\frac{dp}{dt}$$ |
| Force $$F$$ | Torque $$M$$ |
| $$F = ma$$ | $$M = I\alpha$$ |

where:

- $$p$$ is the rocket's **roll rate**: how quickly it is currently rolling
- $$I_{xx}$$ is how hard the rocket is to rotationally accelerate about its roll axis
- $$\frac{dp}{dt}$$ is how quickly the roll rate is changing
- $$M_{\text{forcing}}$$ is the torque trying to make the rocket roll
- $$M_{\text{damping}}$$ is the torque trying to stop the roll

### Placeholder values

| Symbol | Value | Unit |
|:--|--:|:--|
| $$I_{xx}$$ | $$0.003$$ | $$\mathrm{kg\,m^2}$$ |
| $$\rho$$ | $$1.2$$ | $$\mathrm{kg/m^3}$$ |
| $$c_f$$ | $$2.5\times10^{-6}$$ | — |
| $$c_d$$ | $$8.3\times10^{-5}$$ | — |

### Equations

Newton's second law for rotation:

$$
I_{xx}\frac{dp}{dt} = M_{\text{forcing}} - M_{\text{damping}}
$$

**Forcing torque** from fin misalignment:

$$
M_{\text{forcing}} = c_f \rho V^2
$$

- $$c_f$$: how strongly the fin misalignment produces roll
- $$\rho$$: air density
- $$V$$: rocket velocity

Picture one or more fins that aren't perfectly aligned. Airflow hits the fins and creates a small sideways
force, and faster airflow makes that effect much stronger. Because forcing goes with $$V^2$$, doubling the speed
gives $$(2V)^2 = 4V^2$$: **four times** the forcing torque.

**Damping torque**:

$$
M_{\text{damping}} = c_d \rho V p
$$

Damping depends on both velocity and roll rate: a faster rocket gets more damping, and a faster roll gets more damping.

Putting it together:

$$
I_{xx}\frac{dp}{dt} = c_f\rho V^2 - c_d\rho V p
\qquad\text{or}\qquad
\frac{dp}{dt} = \frac{c_f\rho V^2 - c_d\rho V p}{I_{xx}}
$$

### Steady-state roll rate

At steady state the roll rate stops changing, so $$\frac{dp}{dt} = 0$$ and $$M_{\text{forcing}} = M_{\text{damping}}$$:

$$
p_{\text{ss}} = \frac{c_f}{c_d}V
$$

So $$p_{\text{ss}} \propto V$$. In this simple model, **the faster the rocket flies, the higher its eventual steady roll rate.**

### Time constant

$$
\tau = \frac{I_{xx}}{c_d\rho V}
$$

$$\tau$$ is how quickly the roll rate approaches its steady-state value (it reaches ~63% of $$p_{\text{ss}}$$ after one $$\tau$$).

| Change | Effect on $$\tau$$ | Meaning |
|:--|:--|:--|
| $$I_{xx}\uparrow$$ | $$\tau\uparrow$$ | Heavier-to-spin rocket settles more slowly |
| $$c_d\uparrow$$ | $$\tau\downarrow$$ | More damping settles faster |
| $$V\uparrow$$ | $$\tau\downarrow$$ | Faster rocket settles faster |
| $$\rho\uparrow$$ | $$\tau\downarrow$$ | Denser air settles faster |

### Its model time >:)

**Goal:** find $$p_{\text{ss}}$$ and $$\tau$$ at **V = 50 m/s** and **V = 100 m/s**.

1. Create `roll_params_<name>.m` containing the constants above.
   There should be no hard coded "magic numbers" in the blocks, since this makes it hard to read for other people and yourself when you come back to it. Always reference constants with a well named variable.
2. Build `roll_plant_<name>.slx`:
   - A **Sum** block (forcing minus damping)
   - A **Gain** of $$1/I_{xx}$$
   - An **Integrator** whose output is $$p$$
   - $$p$$ fed back into the damping term
3. Solver settings: **fixed step**, step size **0.001s**, stop time **3s**, initial roll rate **0**.
4. Measure $$p_{\text{ss}}$$ (the final value) and $$\tau$$ (the time to reach 63% of $$p_{\text{ss}}$$).

If you are up for the challenge, you can check your sims values against hand calculation (or an online solver):

| V [m/s] | $$p_{\text{ss}}$$ hand calc | $$p_{\text{ss}}$$ sim | $$\tau$$ hand calc | $$\tau$$ sim |
|:--|:--|:--|:--|:--|
| 50 | | | | |
| 100 | | | | |
| Ratio 100/50 | expect ≈ 2 deg/s | | expect ≈ 0.5 deg/s | |

### What to push

Push to `CC/<x500>/`:

- [ ] `roll_plant_<name>.slx`, `roll_params_<name>.m`, and a run script
- [ ] Update or create a `README.md` with how to run the script

Try to keep your model clean since we will build onto it on Week 3

---

## Part 2: Roll angle and gyro bias

Show how badly the gyro bias you measured in [Week 1]({{ '/docs/tutorials/gnc/crash-course/week-1/' | relative_url }})
corrupts the roll angle if you don't remove it.

### Steps

1. Use the gyro roll axis (and sign) you found in Week 1.
2. Integrate the raw roll-rate reading over time to get a roll angle. Use the **actual** `dt` between samples.
3. Integrate again, but subtract the pad bias from each sample first.
4. Compute the difference between the two angles over time.

{: .note }
>*Something to think about:* is the difference a straight line? What does that mean for holding a roll angle over a 30s flight?


Compare against a simple bias × time prediction:

| Time since liftoff [s] | Difference [deg] | Bias × t prediction [deg] |
|:--|:--|:--|
| 10 | | |
| 20 | | |
| 30 | | |

### What to push

Push to `CC/<x500>/`:

- [ ] Your roll angle script (bias-corrected gyro integration using the real `dt`), written to work on any flight log
- [ ] Update your `README.md` with how to run it

<!-- ---

## Part 3: Pick a task

{: .note }
TBA -->
