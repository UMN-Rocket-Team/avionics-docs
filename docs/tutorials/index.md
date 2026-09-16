---
layout: default
title: Tutorials
nav_order: 4
has_children: true
permalink: /docs/tutorials/
---

# Tutorials

Onboarding material for each Avionics subteam. Pick your subteam below to get started —
each one has its own sequence of tutorials, from fundamentals to team-specific tools and workflow.

<!--
  Just the Docs automatically lists this page's children below this content because
  `has_children: true` is set above. The four subteams (Hardware, Software, Firmware, GNC)
  are the children here; each of those is itself a parent page with its own tutorials nested
  underneath (three levels of nav total).
-->

| Subteam | Covers |
|:--|:--|
| [Hardware]({{ '/docs/tutorials/hardware/' | relative_url }}) | PCB design, sensor selection, wiring |
| [Software]({{ '/docs/tutorials/software/' | relative_url }}) | Ground station, telemetry, data pipelines |
| [Firmware]({{ '/docs/tutorials/firmware/' | relative_url }}) | Flight computer code, RTOS, drivers |
| [GNC]({{ '/docs/tutorials/gnc/' | relative_url }}) | Guidance, navigation, and control algorithms |

## Adding a new tutorial

1. Duplicate `tutorial-template.md` inside the tutorial folder and move it to the relevant subteam folder (e.g. `docs/tutorials/hardware/`).
2. Set `parent:` to the subteam name (e.g. `Hardware`) and `grand_parent: Tutorials`.
3. Set `nav_order` to control where it falls in the tutorial sequence.
4. Remove `nav_exclude: true` and fill in the content.