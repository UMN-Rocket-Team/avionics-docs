---
layout: default
title: Important Downloads
parent: Hardware
grand_parent: Tutorials
has_children: false
nav_order: 1
permalink: /docs/tutorials/hardware/downloads
---



# Important Software Downloads
{: .no_toc }

This page will provide a ton of different software download links that will be useful for avionics.

{ .important }
> Make sure you have access to the teams' resources below!

<div class="card-grid" markdown="0">
  <a class="card" href="https://umn-rkt.slack.com/">
    <img class="card-img" width="100%" alt="Slack Link" src="https://github.com/user-attachments/assets/ea0a9d8f-0dcd-4527-8b79-06fd260a2ff7" />
    <div class="card-title">Slack</div>
    <p>Our primary communication platform. Where all updates and events are announced.</p>
  </a>
  <a class="card" href="http://z.umn.edu/rktnotion">
    <img class="card-img" width="100%" alt="Notion Link" src="https://github.com/user-attachments/assets/dd605b45-77ca-4cfb-a858-8025c0813efd" />
    <div class="card-title">Notion</div>
    <p>The team's timeline and project tracking manager.</p>
  </a>
  <a class="card" href="http://z.umn.edu/rktgithub">
    <img class="card-img" width="100%" alt="Github Link" src="https://github.com/user-attachments/assets/bbf61472-be51-487e-a20f-316720ee4c65" />
    <div class="card-title">Github</div>
    <p>Where all the project files, documentation, and repos are stored.</p>
  </a>
  <a class="card" href="mailto:moha2063@umn.edu">
    <img class="card-img" width="100%" alt="Drive Link" src="https://github.com/user-attachments/assets/fcd885e2-8293-4a07-939c-546cf4e7b810" />
    <div class="card-title">Googel Drive</div>
    <p>Email Mohamed for access. Where files, videos, data, and presentations reside.</p>
  </a>
  <a class="card" href="https://rocket-team.365.altium.com/getstarted">
    <img class="card-img" width="100%" alt="Altium Link" src="https://github.com/user-attachments/assets/1e501850-611d-4fa6-9e8c-d3459145448c" />
    <div class="card-title">Altium365</div>
    <p>Our hub for all PCB projects and files.</p>
  </a>
</div>

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Altium

This is the software most important to hardware. To download Altium, first you will need to create an account and download Altium Designer from this [link](https://www.altium.com/products/downloads) 
Make sure to use your x500 for the account.

{ .note }
You may have to wait for an Altium admin (Hardware or Avionics lead) to give you access to the teams workspace before you will be able to download Altium.

Once you have an account, a team member will have to permit you one of the team's licenses for Altium. When you open Altium and you don’t have a license, you will be prompted with the “License Management” window. To use your license, click on the copy you've been given and click “Use”. You should now be able to use Altium.

<img width="955" height="280" alt="image" src="https://github.com/user-attachments/assets/9e3af92d-0680-4e5e-a770-37acadf63eb6" />

Once it's downloaded and you have a license, open up Altium. In the upper right hand corner you will notice a small cloud icon with the words “Not Connected” next to it.

<img width="321" height="47" alt="image" src="https://github.com/user-attachments/assets/99f5d514-7475-4fb6-8838-5426ea2df97b" />

This is how you will log into the Rocket Teams Altium workspace. The workspace is essentially a source control software, like git, but oriented specifically around Altium project files.

To log in, click on “Not Connected”. You should then see the Rocket Team workspace under “Shared With Me”.

<img width="310" height="200" alt="image" src="https://github.com/user-attachments/assets/5487ee2c-177e-481f-bf9b-9eb6f165b47b" />

It will ask for your credentials.

Once logged in, 2 new symbols will show up. One is log out and the other is “Open Workspace In Web Browser”. If you click this you will be able to see all of the projects currently stored on the workspace.

On the left pane, click "Projects". The PCBs for the flight computer can be found under the “UFC Cards” folder. Feel free to explore the other folders and check out what has already been created.

{ .important }
> It seems that any project you create in Altium will automatically also be created on the workspace. If you work on any personal projects, ensure that you log out first. Stay logged in for any team projects.

**What’s the difference between the Altium application and Altium365 on your web browser?**
* [Altium365](https://rocket-team.365.altium.com/getstarted) is like the Google Drive of Altium, and it makes it easy to view and organize team files. Altium is used to actually edit those files.

## STM32 CubeIDE

Our primary choice of microcontroller is the STM32, and CubeIDE is used to program the chip. CubeIDE also conveniently labels all the possible operation modes for the pins, making our lives much easier for routing and pinouts. (Trust me, you’ll be in the trenches trying to use the datasheet for this…)

To download, go to this [link](https://www.st.com/en/development-tools/stm32cubeide.html) and scroll down to the “Get Software” section. Select your OS and version 1.13.2 and click download.

<img width="1091" height="241" alt="Screenshot 2026-08-27 124612" src="https://github.com/user-attachments/assets/dbf36c81-cd27-40e0-8fd3-1c92ee921389" />

## STLink Driver

This driver is needed to communicate between the boards and your computer. It is available [here.](https://www.st.com/en/development-tools/stsw-link009.html)

## PuTTY

This is a terminal software used to send and receive data and commands from boards. Find it here, [link pending]

## Other software

The University has a handy little website full of downloads to software like SolidWorks and MatLab. If you want any of these, visit here →  [https://software.cse.umn.edu/](https://software.cse.umn.edu/)

---
