---
layout: default
title: GNC
parent: Tutorials
has_children: true
nav_order: 1
permalink: /docs/tutorials/gnc/
---

# GNC Tutorials

<!--
  This page is BOTH a child of Tutorials (parent: Tutorials) AND a parent of its own
  tutorials (has_children: true). Tutorial pages underneath need parent: GNC and
  grand_parent: Tutorials. Crash Course and Environment Setup are themselves parents of
  their own pages (four levels of nav, supported by Just the Docs 0.10+).

  Roadmap and Conventions pages exist but are hidden (nav_exclude / search_exclude).
  Remove those two lines from their front matter to publish them in the sidebar.
-->

Onboarding for the **Guidance, Navigation, and Control (GNC)** subteam. If you are a new member start with the 
**[Crash Course]({{ '/docs/tutorials/gnc/crash-course/' | relative_url }})**, this is a self pased three
week "course" that covers the data processing, physics, and controls knowledge needed to jump start on GNC tasks.

## What GNC does

GNC takes input of sensor measurement, filters it, and then computes commands to control the rocket.

- **Navigation (estimation):** working out what the rocket is actually doing (roll angle, roll rate, tilt, altitude, velocity) from noisy, biased, and sometimes saturated sensors. This includes *sensor fusion*, *filtering*, and *state estimation*.
- **Guidance:** we don't do this since guidance systems on rockets have a tendacy to turn them into missles. If we did it would look like giving a desired trajectory and final GPS position, and computing the desired roll angle and roll rate to get there.
- **Control:** computing the actuator or other commands to change how the rocket moves in space. For us this means *deflecting roll control tabs*.

Our current focus is **active roll control**. Every model and algorithm will be built in a simulation and checked against real flight data before running on flight hardware. Proper testing and validation before any flight or running on hardware is absolutely critical, both for safety and for useful data.

## Onboarding path

1. **[Crash Course]({{ '/docs/tutorials/gnc/crash-course/' | relative_url }})**: Week 0 through Week 3. It is best to go through this in order, but skip around if you already know the material. It covers the basics of GNC plus reading and parsing flight data.
2. **[Glossary]({{ '/docs/tutorials/gnc/glossary/' | relative_url }})**: running list of GNC and other avionics terms, acronyms, and abbreviations. If you see something missing then feel free to add it!

**Expected Background knowledge:**

- Basic Python or MATLAB: know what variables, functions, and loops are. Everything else will be taught in the Crash Course or picked up along the way :) 
- Intro physics: know what a force is, and understanding of torque and moments of inertia. If this sim was boiled down to basics it looks like *"force = mass * acceleration"* and *"torque = moment of inertia * angular acceleration"*.
- Intro calculus: understand how to do derivatives and integrals. 
- *Helpful but not needed:* linear algebra, differential equations, a controls or dynamics course. Applying controls, dynamics, and the math is a lot easier then learning it in a class imo, so don't worry if you don't have background here.

## Some GNC best practices (not just for Crash Course)

- **The two-hour rule**. I would say if you are stuck on a problem and reaching that 1-2 hour mark I would ask for help. Just asking another member during worktimes or posting something along these lines in the GNC channel will get you unstuck:
  1. the command you're running and/or the code you're working on
  2. the *full* error message,
  3. your OS if applicable
- **Units and signs go on everything.** There are guidlines for the units and signs we use in the [Conventions]({{ '/docs/tutorials/gnc/conventions/' | relative_url }}) page. If you are unsure about a unit or sign, ask! We should also still be putting units and signs on everything with this.
- **Write down where numbers come from.** We want to know looking back where a number comes from, and this avoids "magic numbers" in code. Possible sources include: past flight data, datasheets, calculations, CAD, OpenRocket, bench tests.
- **Periodically push your work.** Crash Course work will go on the `CrashCourse` branch under `CC/<x500>/`. Pushing your work consistently helps avoid merge conflicts and save your work online in case of some computer issue. 

<!-- The tutorial list below this point is auto-generated from child pages. -->
