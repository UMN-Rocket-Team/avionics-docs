---
layout: default
title: Crash Course
parent: GNC
grand_parent: Tutorials
has_children: true
nav_order: 1
permalink: /docs/tutorials/gnc/crash-course/
---

# GNC Crash Course

_This crash course will cover everything needed to get started_

You will be continually learning throughout the semester, but this crash course is designed to get you one your feet and start contributing ASAP. Each week is going to build on the last one, so I recommend going through them in order. If you know the material then skip ahead, but you will struggle later in the semester if you don't understand the concepts. 

| Week | Topic | What you'll build |
|:--|:--|:--|
| [Week 0]({{ '/docs/tutorials/gnc/crash-course/week-0/' | relative_url }}) | Setup | MATLAB/Simulink, Python, and Git installed, and your `CC/<x500>/` folder created |
| [Week 1]({{ '/docs/tutorials/gnc/crash-course/week-1/' | relative_url }}) | What is the rocket (and its sensors) doing? | Scripts that pull events, bias, noise, clipping, and roll out of a flight log, plus a summary of that flight's numbers |
| [Week 2]({{ '/docs/tutorials/gnc/crash-course/week-2/' | relative_url }}) | Rocket roll | A Simulink roll plant, and a bias-corrected roll angle script |
| [Week 3]({{ '/docs/tutorials/gnc/crash-course/week-3/' | relative_url }}) | Roll rate control | A controller that drives roll rate to zero with a control tab |

## Github

All Crash Course work should get pushed on the **`CrashCourse`** branch in a folder with your x500 (that part infront of your UMN email):

```text
CC/<x500>/
```

You can find what to push at the bottom of each week. **This isn't homework, so there's nothing to hand in.** Only push
files that will be useful for GNC later: scripts, Simulink models, parameter files, and data summaries. Questions on
these pages are for you to think about; you don't submit answers.

Name files clearly (e.g. `find_events.py`, not `script2.py`), and keep a `README.md` in your folder that says what
each file does and how to run it.

## Repo and branches

#TODO 

| Branch | Use |
|:--|:--|
| `feature/<ver#>/...` | Feature work for a given version |
| `personal/<x500>/...` | Your own scratch work |
| `CrashCourse` | Crash Course submissions (in `CC/<x500>/`) |

{: .important }
> Ask for help if you get stuck! 

<!-- The weekly pages below this point are auto-generated from child pages. -->
