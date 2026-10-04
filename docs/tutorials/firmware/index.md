---
layout: default
title: Firmware
parent: Tutorials
has_children: true
nav_order: 1
permalink: /docs/tutorials/firmware/
---

# Firmware

<!--
  This page is BOTH a child of Tutorials (parent: Tutorials) AND a parent of its own
  tutorials (has_children: true). Just the Docs handles this three-level nesting fine —
  tutorial pages underneath just need parent: Firmware and grand_parent: Tutorials.
-->

## Introduction
Welcome to the Firmware team! If you're new, start with the **[Challenges]({{ '/docs/tutorials/firmware/challenges/' | relative_url }})**. They will teach you the basics of firmware development.

## What does Firmware do?
Firmware writes software that goes in the flight computer. We use C/C++ to write drivers for the STM32 which communicates with hardware. We also read data from the sensors onboard, process and organize them, and send them to the ground station (WINGS) using radio signals.

## What projects does Firmware work on?
The main project that firmware works on is the Universal Flight Computer (UFC). If you are new to firmware and want to know more, keep in mind that your job will involve a lot of programming that is tightly associated with the hardware. For this reason, it is important to learn how to test and debug your code in the most efficient way. In general, we start small, by unit testing just a single component, be it a sensor or an LED, and we gradually expand to testing the entire system.

Another key project is GYRO. GYRO was developed last year to experiment with roll control on the rocket.

## Important Resources
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">

  <!-- GitHub Card -->
  <a href="https://github.com/UMN-Rocket-Team/Avionics" style="display: block; border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; text-decoration: none; color: inherit; background-color: #ffffff; transition: box-shadow 0.2s, transform 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='none'; this.style.transform='none';">
    <div style="font-weight: 600; font-size: 1.1em; color: #0366d6; margin-bottom: 8px;">GitHub</div>
    <p style="margin: 0; font-size: 0.9em; color: #586069;">Where all project files, avionics documentation, and firmware repositories are stored.</p>
  </a>

  <!-- STM32CubeIDE Card -->
  <a href="{{ '/docs/tutorials/firmware/resources/cubeide/' | relative_url }}" style="display: block; border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; text-decoration: none; color: inherit; background-color: #ffffff; transition: box-shadow 0.2s, transform 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='none'; this.style.transform='none';">
    <div style="font-weight: 600; font-size: 1.1em; color: #0366d6; margin-bottom: 8px;">STM32CubeIDE</div>
    <p style="margin: 0; font-size: 0.9em; color: #586069;">Our primary IDE for microcontroller development.</p>
  </a>

  <!-- STM32CubeMX Card -->
  <a href="https://www.st.com/en/development-tools/stm32cubemx.html#st-get-software" style="display: block; border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; text-decoration: none; color: inherit; background-color: #ffffff; transition: box-shadow 0.2s, transform 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='none'; this.style.transform='none';">
    <div style="font-weight: 600; font-size: 1.1em; color: #0366d6; margin-bottom: 8px;">STM32CubeMX</div>
    <p style="margin: 0; font-size: 0.9em; color: #586069;">A graphical tool where the .ioc file is configured, automatic initialization code is generated, and peripheral setups are defined. Paired with STM32CubeIDE.</p>
  </a>

  <!-- Logic 2 Card -->
  <a href="https://www.saleae.com/downloads/" style="display: block; border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; text-decoration: none; color: inherit; background-color: #ffffff; transition: box-shadow 0.2s, transform 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='none'; this.style.transform='none';">
    <div style="font-weight: 600; font-size: 1.1em; color: #0366d6; margin-bottom: 8px;">Logic 2 (Saleae)</div>
    <p style="margin: 0; font-size: 0.9em; color: #586069;">The software companion for the Saleae logic analyzers. Essential for visually debugging hardware protocols like SPI, I2C, and UART.</p>
  </a>

  <!-- CoolTerm Card -->
  <a href="{{ '/docs/tutorials/firmware/resources/coolterm/' | relative_url }}" style="display: block; border: 1px solid #e1e4e8; border-radius: 8px; padding: 20px; text-decoration: none; color: inherit; background-color: #ffffff; transition: box-shadow 0.2s, transform 0.2s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='none'; this.style.transform='none';">
    <div style="font-weight: 600; font-size: 1.1em; color: #0366d6; margin-bottom: 8px;">CoolTerm</div>
    <p style="margin: 0; font-size: 0.9em; color: #586069;">The serial port terminal we use for testing.</p>
  </a>

</div>

<!-- The tutorial list below this point is auto-generated from child pages. -->