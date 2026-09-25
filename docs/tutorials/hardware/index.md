---
layout: default
title: Hardware
parent: Tutorials
has_children: true
nav_order: 1
permalink: /docs/tutorials/hardware/
---

<!--
  This page is BOTH a child of Tutorials (parent: Tutorials) AND a parent of its own
  tutorials (has_children: true). Just the Docs handles this three-level nesting fine —
  tutorial pages underneath just need parent: Hardware and grand_parent: Tutorials.
  To make the Software / Firmware / GNC landing pages, copy this file into
  docs/tutorials/software/index.md, docs/tutorials/firmware/index.md, and
  docs/tutorials/gnc/index.md, updating title, nav_order, and permalink each time.
-->

<!-- The tutorial list below this point is auto-generated from child pages. -->

# Hardware - The Ultimate Guide  


## Introduction

Welcome to the Ultimate Hardware Guide! If you’re new here, welcome to the hardware team! If you’re a returning member, feel free to get a refresher from the guides here. 

**What does the Hardware Subteam do?**
* This subteam is focused on the design, component selection, (slight) assembly, and debugging of PCBs. We work very closely with the firmware team to work on flight computer projects.

**What are some past projects we have worked on?**
* For many years this subteam was primarily focused on our main project, the Universal Flight Computer (UFC). In recent years we have also branched out into other projects such as payload control boards, standalone compact flight computers such as GYRO, and battery management systems.

<div class="card-grid" markdown="0">
  <a class="card" href="{{ '/docs/projects/' | relative_url }}">
    <img class="card-img" width="100%" alt="UFC3 5_Render" src="https://github.com/user-attachments/assets/2fe1fe56-710c-4612-b13f-19bdb00a151a" />
    <div class="card-title">Universal Flight Computer (UFC)</div>
    <p>Our long-running main project — a full flight computer, spanning many design generations.</p>
  </a>
  <a class="card" href="{{ '/docs/projects/' | relative_url }}">
    <img class="card-img" width="100%" alt="Firefly" src="https://github.com/user-attachments/assets/971eabf7-cfb0-4d47-ac59-3d5d4df74588" />
    <div class="card-title">Battery Management System (BMS)</div>
    <p>Power monitoring and management hardware for flight systems.</p>
  </a>
  <a class="card" href="{{ '/docs/projects/' | relative_url }}">
    <img class="card-img" width="100%" alt="Firefly (1)" src="https://github.com/user-attachments/assets/65bf04aa-3258-4d6e-9621-012076cae42a" />
    <div class="card-title">GYRO</div>
    <p>A standalone, compact flight computer.</p>
  </a>
</div>

If you’re new, the [Altium Tutorial]({{ '/docs/tutorials/hardware/tutorial' | relative_url }}) section will cover the basics of our eCAD software of choice, Altium. The following sections go more into detail about specific aspects of the software and design process, so feel free to reference those when needed.
 
If you’re unfamiliar with circuit design and basic components, don’t fret! Here’s a playlist of some nice tutorials to get you up to speed: 
[Playlist](https://www.youtube.com/playlist?list=PLah6faXAgguOeMUIxS22ZU4w5nDvCl5gs)
 
<style>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin: 1.75rem 0 2rem;
}
.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  height: 100%;
  padding: 1.25rem 1.25rem 1.5rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  text-decoration: none !important;
  color: inherit;
  background: linear-gradient(180deg, rgba(0,0,0,0.015), rgba(0,0,0,0));
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  border-color: rgba(0,0,0,0.2);
}
.card-img {
  display: block;
  width: 100%;
  height: 180px;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  object-fit: contain;
  background: rgba(0,0,0,0.03);
}
.card-title {
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
  font-weight: 600;
}
.card p {
  margin: 0;
  font-size: 0.92rem;
  color: #5c5c5c;
}
@media (prefers-color-scheme: dark) {
  .card-img { background: rgba(255,255,255,0.04); }
}
@media (prefers-color-scheme: dark) {
  .card { border-color: rgba(255,255,255,0.12); background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)); }
  .card:hover { border-color: rgba(255,255,255,0.3); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
  .card p { color: #b3b3b3; }
}
</style>
