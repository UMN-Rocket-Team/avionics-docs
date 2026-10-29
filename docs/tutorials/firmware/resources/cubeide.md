---
layout: default
title: STM32CubeIDE
parent: Resources
has_children: false
nav_exclude: true
permalink: /docs/tutorials/firmware/resources/cubeide/
---

# STM32CubeIDE

## What is STM32CubeIDE?

STM32CubeIDE is the primary IDE for microcontroller development.

## Download

Click [here](https://www.st.com/en/development-tools/stm32cubeide.html#st-get-software) to go to the downloads page.

Download the version compatible with your device.

## Setup

{: .note}
This is setup for development. Come back here after completing the [challenges](/docs/firmware/challenges/).

Depending on the task assigned, clone the [GYRO](https://github.com/UMN-Rocket-Team/GYRO) or [Avionics](https://github.com/UMN-Rocket-Team/Avionics) repo.

Open up STM32CubeIDE and either click the leftmost icon on the toolbar or go to **File -> STM32 Project Create/Import**

<img width="851" height="27" alt="Screenshot 2026-10-29 at 12 38 57 AM" src="https://github.com/user-attachments/assets/abbb4bb1-c92e-45c4-83ff-795f2bcd696c" />

<img width="485" height="639" alt="Screenshot 2026-10-29 at 12 40 03 AM" src="https://github.com/user-attachments/assets/6c690ef4-7fde-409d-aea7-cd0bb9b1972c" />

Under **Import STM32 Project** select **STM32CubeMX/STM32CubeIDE Project** and hit **Next**.

<img width="592" height="445" alt="Screenshot 2026-10-29 at 12 42 13 AM" src="https://github.com/user-attachments/assets/efd34816-871b-4e48-abdb-f55cc20c0478" />


<details>
    <summary>GYRO Setup</summary>
    <p>

        Look up the GYRO repo in <strong>Directory</strong>
    </p>
    <p>

        <img width="883" height="627" alt="Screenshot 2026-10-03 at 11 35 03 PM" src="https://github.com/user-attachments/assets/071eb652-0e24-40d1-96e4-aaff890c1635" />
    </p>
    <p>

        We're only going to import the nested GYRO repo.
    </p>
    <p>

        <img width="592" height="445" alt="Screenshot 2026-10-29 at 12 42 13 AM" src="https://github.com/user-attachments/assets/8c30f05f-fbbc-40ca-8bd7-b3cae81b44b8" />
    </p>
    <p>

        <img width="885" height="567" alt="Screenshot 2026-10-29 at 12 46 55 AM" src="https://github.com/user-attachments/assets/361c8078-ee13-4021-9e7b-718f54d22a8b" />
    </p>
    <p>

        Hit <strong>Finish></strong>
    </p>
    <p>

        You can now see GYRO under <strong>Project Explorer</strong> on the left hand side.
    </p>
    <p>

        <img width="1511" height="947" alt="Screenshot 2026-10-03 at 11 53 49 PM" src="https://github.com/user-attachments/assets/60d43e11-87c9-4aa9-8b21-4c2d4aeed56c" />
    </p>
</details>

<details>
    <summary>UFC Setup</summary>
    <p>
        Look up the Avionics repo in <strong>Directory</strong>

    </p>
    <p>

        <img width="883" height="627" alt="Screenshot 2026-10-03 at 11 35 03 PM" src="https://github.com/user-attachments/assets/071eb652-0e24-40d1-96e4-aaff890c1635" />

    </p>
    <p>

        Typically, we only work on one or two projects at a time, so there isn't a need to import all the projects from the repo. You can uncheck the projects you don't need on the left hand side and then hit <strong>Finish</strong>.
    </p>
    <p>

        <img width="887" height="628" alt="Screenshot 2026-10-03 at 11 36 58 PM" src="https://github.com/user-attachments/assets/025492b9-fad5-4d57-b525-ebcea059ccd0" />
    </p>
</details>

You can now see your projects under **Project Explorer** on the left hand side.

<img width="1511" height="947" alt="Screenshot 2026-10-03 at 11 53 49 PM" src="https://github.com/user-attachments/assets/60d43e11-87c9-4aa9-8b21-4c2d4aeed56c" />

{: .note}
We won't really be using STM32CubeMX because we don't generate code for our projects.
