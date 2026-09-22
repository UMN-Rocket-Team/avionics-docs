---
layout: default
title: "Week 0: Setup"
parent: Crash Course
grand_parent: GNC
nav_order: 1
permalink: /docs/tutorials/gnc/crash-course/week-0/
---

# Week 0: Setup environments and tools
{: .no_toc }

This will be setup for our coding environment, and some starting MATLAB and Simulink tutorials.
Expect everything in total to take ~3-4 hours.

{: .fs-5 .fw-300 }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## 1. Install MATLAB and Simulink

**If you're in CSE**, download MATLAB through the CSE software site:
[software.cse.umn.edu/software/3](https://software.cse.umn.edu/software/3).
**Otherwise**, message the GNC lead and we'll sort out access.

When the installer asks which products to install, select:

- MATLAB
- Simulink
- Aerospace Blockset
- Aerospace Toolbox
- Control System Toolbox
- Embedded Coder
- MATLAB Coder
- Simscape
- Simulink Control Design
- Simulink Coder
- Statistics and Machine Learning Toolbox
- System Identification Toolbox

{: .note }
You can add toolboxes later through the MATLAB **Add-Ons** menu, but it's annoying as shit so I would just do it now.

## 2. Install Python, Git, and VSCode

Download python ***3.13*** here: [python.org](https://www.python.org/downloads/), and Git here: [git-scm.com](https://git-scm.com/downloads)

Download VSCode here: [code.visualstudio.com](https://code.visualstudio.com/Download). You can also use your own prefered coding environment.

If you are not familiar with git commands in the terminal, some find it easier to use [Github Desktop](https://desktop.github.com/download/)


Install python libraries (I suggest in a virtual environment) `pandas`, `numpy`, and `matplotlib` with pip in the terminal:

```bash
pip install --upgrade pip
pip install pandas numpy matplotlib
```

## To check if everything is setup correctly
Run the commands below, replace <python> with the command you use to run Python

```bash
<python> --version    # should print Python 3.13.x
git --version
<python> -c "import pandas, numpy, matplotlib; print('libraries OK')"
```

## 3. Checklist

- [ ] Fill out the Firmware/GNC work-times when2meet (link in the GNC channel)
- [ ] Complete the **MATLAB Onramp** and **Simulink Onramp** at [matlab.mathworks.com](https://matlab.mathworks.com) (~3 hours total)
- [ ] Clone the repo
- [ ] Switch to the **`CrashCourse`** branch
- [ ] Commit and push `CC/<x500>/README.md` to the remote (just your name for now; you'll add to it as you push scripts)
- [ ] Download your assigned flight log (you'll use it in [Week 1]({{ '/docs/tutorials/gnc/crash-course/week-1/' | relative_url }}))

### Switching to the `CrashCourse` branch

**GitHub Desktop:** click **Current Branch** at the top, then pick `CrashCourse` (it may be under
*Other branches* or listed as `origin/CrashCourse`).

**Command line:**

```bash
git fetch
git switch CrashCourse
```

Then create your folder and `README.md`, commit, and push to remote.

## Supplemental reading

- [IREC Design, Test & Evaluation Guide (DTEG)](https://static1.squarespace.com/static/687d3841f7d71450d1ba824d/t/69a0d16686b10911a06afa5e/1772147046804/2026+IREC+DTEG+V1.1.pdf), this covers some requirments for the IREC vehicle.
