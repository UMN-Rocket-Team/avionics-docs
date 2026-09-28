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
- [ ] Commit and push `CC/<x500>/README.md` to the remote (just your name for now; you'll add to it as you push scripts)
- [ ] Download your assigned flight log (you'll use it in [Week 1]({{ '/docs/tutorials/gnc/crash-course/week-1/' | relative_url }}))

### `CrashCourse` repo
Follow the command line instructions or github deskop instructions below. You have to be added to the github for either to work, so message the GNC or Avionics lead if you have not yet.

**Command line:**
```bash
git clone git@github.com:UMN-Rocket-Team/GNC-CrashCourse.git <directory-location>
git add <directory-location>/CC/<yourx500>/README.txt
git commit -m "Add README"
git push origin main
```

**GitHub Desktop:**
1. Clone the repository
  - Open GitHub Desktop
  - Go to File → Clone Repository
  - Select URL
  - Enter: `git@github.com:UMN-Rocket-Team/GNC-CrashCourse.git`
2. Choose where you want the repo stored locally
  - Click Clone
  - Add your README
  - Open the cloned `GNC-CrashCourse` folder.
  - Navigate to: `CC/<yourx500>/`
  - Create or add your `README.txt` there.
3. Commit your changes
  - Return to GitHub Desktop.
  - Your `README.txt` should appear under Changes.
  - Make sure it is checked.
  - In the bottom-left commit message box, enter: `Add README`
  - Click Commit to main.
4. Push to GitHub
  - Click Push origin at the top of GitHub Desktop.
  - Your README should now be on the `main` branch.


## Supplemental reading

- [IREC Design, Test & Evaluation Guide (DTEG)](https://static1.squarespace.com/static/687d3841f7d71450d1ba824d/t/69a0d16686b10911a06afa5e/1772147046804/2026+IREC+DTEG+V1.1.pdf), this covers some requirments for the IREC vehicle.
