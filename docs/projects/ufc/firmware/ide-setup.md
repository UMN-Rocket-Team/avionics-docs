---
layout: default
title: STM32CubeIDE Setup
parent: Firmware
grand_parent: Universal Flight Computer
nav_order: 7
permalink: /docs/projects/ufc/firmware/ide-setup/
---

# STM32CubeIDE Setup
{: .no_toc }

Getting the UFC firmware projects to import and build in STM32CubeIDE. The IDE can't find the shared source
folders on its own, so there's some one-time fixing to do.
{: .fs-5 .fw-300 }

**Before you start:** install [STM32CubeIDE](https://www.st.com/en/development-tools/stm32cubeide.html) and
clone the [UFC repo](https://github.umn.edu/Rocket-Team/UFC-2024). If you've never used the IDE, the
[firmware tutorial]({{ '/docs/tutorials/firmware/' | relative_url }}) walks through it.

{: .check }
This guide was written for UFC2, so the screenshots and examples use the `Host_Card` project. The steps should
be the same for the UFC 3.5 card projects, but the project names will be different.

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## 1. Import the projects

Import the projects by selecting the repo's **`Firmware`** folder. In the list of projects it finds, **uncheck
the `Firmware` Eclipse project**. It isn't an STM32 project. All the card projects will then show up in the
Project Explorer.

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/87a4e73c-87c2-4e94-a746-3a9cd71024d3, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/9e0bc18f-a1fb-4080-bd29-db995b86c851, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/feb9cf26-3e6a-4890-ae90-2d1d3fa857d0" %}

## 2. Re-link the shared source folders

Open a project and you'll see that the `FatFS`, `Src`, and `UFC_Core` folders are empty. The IDE is looking in
the wrong place for them. Delete those three folders from the project, then add them back with the right paths:

1. Right-click the project and open **Properties**.
2. Go to **Paths and Symbols → Source Location**.
3. Click **Link Folder**, check **Link to folder in the file system**, and **Browse** to the folder.
4. Do this once for each folder:

   ```text
   Firmware/STMGenerated/FatFS
   Firmware/STMGenerated/Src
   Firmware/UFC_Core
   ```

5. Switch to the **Release** configuration tab and use **Add Folder** to add the same source folders there.
6. Click **Apply and Close**.

Repeat for every card project. Only the project with the SD card driver needs `FatFS`. When this guide was
written that was `Host_Card`; on UFC 3.5 the SD card is on the
[Interface Card]({{ '/docs/projects/ufc/cards/interface-card/' | relative_url }}).

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/b3b7582a-604b-40ee-a96c-2b7ac9923148, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/00448e3f-aeef-4eb0-ba71-f2b2c66b98e6, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/0674cfdc-1215-4150-b8ba-a93938a633d2, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/6300bc4e-e2fb-41a6-817d-50ed8dd8e5de, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/21142dc3-423a-4577-9e05-d410766aeb4c, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/2bee46b0-0efe-41b8-88e6-5d6b99a681cb, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/df1054e6-8b35-4275-b693-234e4723666d" %}

## 3. Check that it builds

Select a project and press the **Build** (hammer) button. The console shows any errors. If the folders are
linked correctly there shouldn't be any.

{% include photo-links.html label="Screenshot" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/2c0f9b07-a540-431f-96a5-7bb50c500329" %}

## 4. Set up run configurations

Set up two run configurations per project, **Debug** and **Release**:

| Configuration | Compiler flag | Use it for |
|:--|:--|:--|
| Debug | `-g` | Anything where you want the debugger |
| Release | `-O2` | Optimised builds |

They should behave identically. The only difference is optimisation versus debug info.

1. Click the arrow next to the green **Run** button and choose **Run Configurations**.
2. Select **STM32 C/C++ Application** and click **New Configuration**. With a project selected, it fills in a
   Debug configuration for that project automatically.
3. Change two settings:
   - Turn on **Enable auto build**, so it rebuilds before running if you've changed anything.
   - Set **Build configuration** to Debug.
4. Make a second configuration for Release. Its **C/C++ Application** must point to
   `Release/<Project>.elf` instead of `Debug/<Project>.elf`.
5. Repeat for every card.

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/460da205-b87c-4245-b6ec-05222699ce5f, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/d71c3722-31c6-4ff5-abe3-fa073e22344f, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/593f9ab9-f20c-44de-8fc7-e08fb9e5e911, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/d5179502-848d-4fed-9358-4abd88de40ac" %}

## Optional: hide the generated code

`Firmware/STMSettings.txt` lists the includes and sources for each project. Despite how many source folders
there are, you only need to edit two of them (the first screenshot below shows which), so the rest is noise.
You can hide it with Project Explorer filters:

- Under **Pre-set filters**, check **Non-C elements**.
- Add **User filters** for the folders you don't edit (the STMGenerated code and the Debug/Release build
  output).

The original author never found a way to hide the Binaries and Includes entries too. If you do, update this page.

{% include photo-links.html label="Screenshots" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/18364ef3-55fe-45a4-bdc2-08e5ec8ed2ad, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/0317b533-d568-4463-97bb-0387bcea1ae9, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/80aef5c5-bd4f-495e-bf05-a9645fdcec9b, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/9c751b4f-9694-4eb5-9889-711ca0b0a20c, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/a961f959-ae6d-457d-8c9f-49c2bbd672eb" %}
