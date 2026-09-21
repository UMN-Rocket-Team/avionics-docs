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



## Table of Contents
* [Introduction](#introduction)
* [Important Software Downloads](#important-software-downloads)
* [Altium Basics Tutorial](#altium-basics-tutorial)
* [General Design Practices](#general-design-practices)

## Introduction

Welcome to the Ultimate Hardware Guide! If you’re new here, welcome to the hardware team! If you’re a returning member, feel free to get a refresher from the guides here. 

**⍰ What does the Hardware Subteam do?**
* This subteam is focused on the design, component selection, (slight) assembly, and debugging of PCBs. We work very closely with the firmware team to work on flight computer projects.

**⍰ What are some past projects we have worked on?**
* For many years this subteam was primarily focused on our main project, the Universal Flight Computer (UFC). In recent years we have also branched out into other projects such as payload control boards, standalone compact flight computers such as GYRO, and battery management systems.

<details>

<summary>Universal Flight Computer (UFC)</summary>

<img width="20%" height="20%" alt="UFC3 5_Render" src="https://github.com/user-attachments/assets/2fe1fe56-710c-4612-b13f-19bdb00a151a" />
  
</details>

<details>

<summary>Battery Management System (BMS)</summary>

<img width="20%" height="20%" alt="Firefly" src="https://github.com/user-attachments/assets/971eabf7-cfb0-4d47-ac59-3d5d4df74588" />
 
</details>

<details>

<summary>GYRO</summary>

<img width="40%" height="40%" alt="Firefly (1)" src="https://github.com/user-attachments/assets/65bf04aa-3258-4d6e-9621-012076cae42a" />
 
</details>

If you’re new, the next-next section will cover the basics of our eCAD software of choice, Altium. The following sections go more into detail about specific aspects of the software and design process, so feel free to reference those when needed.

If you’re unfamiliar with circuit design and basic components, don’t fret! Here’s a playlist of some nice tutorials to get you up to speed: 
[Playlist](https://www.youtube.com/playlist?list=PLah6faXAgguOeMUIxS22ZU4w5nDvCl5gs)

## Important Software Downloads

This page will provide a ton of different software download links that will be useful for avionics.

⚠️While downloading these, make sure you have access to the team slack, google drive, and github.

### Altium

This is the software most important to hardware. To download Altium, first you will need to create an account and download Altium Designer from this [link](https://www.altium.com/products/downloads) 
Make sure to use your x500 for the account.

ℹ️ ***You may have to wait for an Altium admin (Hardware or Avionics lead) to give you access to the teams workspace before you will be able to download Altium***

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

⚠️ ***It seems that any project you create in Altium will automatically also be created on the workspace. If you work on any personal projects, ensure that you log out first. Stay logged in for any team projects.***

**What’s the difference between the Altium application and Altium365 on your web browser?**
* [Altium365](https://rocket-team.365.altium.com/getstarted) is like the Google Drive of Altium, and it makes it easy to view and organize team files. Altium is used to actually edit those files.

### STM32 CubeIDE

Our primary choice of microcontroller is the STM32, and CubeIDE is used to program the chip. CubeIDE also conveniently labels all the possible operation modes for the pins, making our lives much easier for routing and pinouts. (Trust me, you’ll be in the trenches trying to use the datasheet for this…)

To download, go to this [link](https://www.st.com/en/development-tools/stm32cubeide.html) and scroll down to the “Get Software” section. Select your OS and version 1.13.2 and click download.

<img width="1091" height="241" alt="Screenshot 2026-08-27 124612" src="https://github.com/user-attachments/assets/dbf36c81-cd27-40e0-8fd3-1c92ee921389" />

### STLink Driver

This driver is needed to communicate between the boards and your computer. It is available [here.](https://www.st.com/en/development-tools/stsw-link009.html)

### PuTTY

This is a terminal software used to send and receive data and commands from boards. Find it here, [link pending]

### Other software

The University has a handy little website full of downloads to software like SolidWorks and MatLab. If you want any of these, visit here →  [https://software.cse.umn.edu/](https://software.cse.umn.edu/)

## Altium Basics Tutorial

The purpose of this tutorial is to give new and old members alike a reference to use when designing printed circuit boards (PCBs) in Altium Designer. The example PCB this guide will be designing is an enhanced breakout board for the H3LIS200DL (a high-g 3-axis digital accelerometer).

A breakout board is a PCB that is intended to have a single component such as a sensor on it, and it will generally have all the parts from its schematic needed to work along with terminals and pads to interface with it. This helps the firmware team test and breadboard with it.

### Creating Projects

First we are going to start by creating the project in the workspace.

ℹ️ ***Creating projects in the workspace automatically connects the project to the workspace/Altium's version control***

While you’re in the workspace, navigate to Projects > New Member Training. In the breakouts folder, you will see a button saying “+ New”, click this.

<img width="298" height="84" alt="image" src="https://github.com/user-attachments/assets/7c148826-57be-4735-90b1-cc6e610c0939" />

You will be given 3 options,

* Upload Project
* Create Project
* Create Folder

If you have project files that are not currently on the workspace, you can upload them with the “Upload Project” button, but for now we are going to click “Create Project”.

<img width="176" height="144" alt="image" src="https://github.com/user-attachments/assets/776ceecc-9ce1-4de0-92b5-7ecb63176e31" />

A dialog box will pop up asking for you to enter a name and select a template. Ensure you use a descriptive name, like part#_EnglishName, we are going to use “H3LIS200DL_100gAccelerometer”. Ensure the selected template is “PCB Project”. Feel free to add a description.

<img width="814" height="452" alt="image" src="https://github.com/user-attachments/assets/6278ecd7-56f4-4811-baf4-1fe8dc7c5f81" />

You can now click create and your new project should be visible.

<img width="659" height="358" alt="image" src="https://github.com/user-attachments/assets/97928f43-4a78-4d72-a487-2a140930301a" />

With the project created, open Altium, then click File > Open Project. Click on the “Rocket Team” button on the right hand side of the pane to ensure you are looking at the workspace. Here you can open anything from the workspace, whether it was newly created or an older project.

<img width="1055" height="617" alt="image" src="https://github.com/user-attachments/assets/5ce52e9d-ee50-40f0-8d1a-4fd0665fb078" />

### Creating Schematics

We can now create the breakout schematic. In simple terms, the schematics are graphical representations of an electrical circuit. They are not what the real circuit would look like, but rather are meant to be easily human readable. Altium also uses the schematic to understand how you want your PCB connected electrically. There is no one way to make a schematic, but the Hardware Subteams preferred style can be found in the [General Design Practices](#general-design-practices) page. For simpler projects this layout may not be necessary.

To create the schematic, have your previously blank project open, and click File > New > Schematic.

<img width="444" height="493" alt="image" src="https://github.com/user-attachments/assets/46acdf92-2a2c-4ec4-9c8e-3ac73e79e17c" />

You will then see a file named “Sheet1.ScDoc” appear underneath your project file, in the projects panel. It will also open in the display window showing you a traditional schematic. It is a good idea to immediately rename this document by right clicking “Sheet1.ScDoc” in the left pane, and clicking on rename. We will be renaming it to “H3LIS200DL_Breakout.SchDoc” Some projects may utilize multiple schematic sheets. However we will only be using 1.

### Datasheets

Before you can continue on the schematic, you must learn more about the components you want to use. Since this PCB is a breakout, it's going to only have 1 integrated circuit (IC), and a few passive components. 

The first thing to do is find the datasheet to that IC (H3LIS200DL). The datasheet will tell you (almost) everything you should need to know about that component. The easiest way to do this will be to search in google something like “H3LIS200DL datasheet” or search the part on a website like [DigiKey](https://www.digikey.com/) (a components supplier) and click “datasheet”. You should find something like this:

<img width="597" height="743" alt="image" src="https://github.com/user-attachments/assets/c8079c2f-595d-4e73-a529-f5f865c8772e" />

In order to properly wire and use a component, you will need to refer to the datasheet constantly. The most important thing to first look for in a datasheet is the wiring diagram. Some datasheets are absolute bums and don’t include these (presumably to make you endlessly suffer), but most usually do. It will often be labeled as something like “Wiring Diagram”, “Electrical Connections” or “Applications”. Go ahead and try finding this yourself!

<details>
<summary>This is what it should look like.</summary>

<img width="683" height="506" alt="image" src="https://github.com/user-attachments/assets/09293168-3f14-49a7-81ad-c2cb5e3fe482" />

</details>

ℹ️ ***Quick tip! The table of contents is almost always hyperlinked to bring you straight to the page it refers to.***

As you can see it seems the IC requires capacitors, and it shows how to connect the wires. Keep note that the dots above intersecting lines means that the wires connect, while lines that don’t have a dot or curve over are not connected to each other.

Some pins will be the same no matter what the implementation will be, like pins 1, 14, and 15 all need to be connected to VCC. Pins 5, 10, 12, 13 and 16 will be connected to GND. Other pins depend on implementation. In our case, we are not going to be using pins 9 and 11 (interrupts), and here on the Rocket Team we usually use the SPI protocol for sensor communication. For this we will need pins 4, 6, 7, and 8. However, to set up these specific implementations, we need to know what the pins actually do. This is why the next table we search for is the pin/pinout description. This table will tell you the function of all the pins, allowing you to know what can be wired where. Go ahead and search for this in the datasheet.

<details>
<summary>It’ll look a little something like this.</summary>

<img width="542" height="498" alt="image" src="https://github.com/user-attachments/assets/8c7d67a5-0abb-4673-a0ff-936102a8a515" />

</details>

As you can see, this table labels the power and grounds, and provides brief descriptions of the data pins. You might notice it also lists terms such as I²C, SPI, and stuff like SDO and SCL. If you’re unfamiliar with these data bus terms, I would suggest checking out the [Data Busses](#data-busses) page later. The main takeaway from this table is that now you know the basic functions of each pin.

ℹ️ ***Sometimes in components such as regulators where you have to configure it to a specific mode, there will be separate tables for what parts and wiring are needed to configure it to your specific use.***

### Components

There are a total of 4 different ways to attain a component. In order of preference, these are:

* Components Panel
* Manufacturer Part Search
* Importing from 3rd party
* Custom Creation

In this guide we will only talk about the first two for now. But preferably, you use the Components Panel and Manufacturer Part Search first, and only if necessary import or create a custom component. If you want more detail about component selection and importing/creating component layouts, you can refer to [Selecting Components](#selecting-components).

You should be able to see tabs for the Components Panel and Manufacturer Part Search along the right side of Altium. If you cannot, In the upper left click View → Panels → Components/Manufacturer Part Search.

Altium provides the team with space on the workspace to store components. Navigate back to the [Altium365 workspace](https://rocket-team.365.altium.com/getstarted) on your web browser, then on the left panel click "Components". Here you see all of the components that came with or have been uploaded to the teams workspace.

<img width="1915" height="550" alt="image" src="https://github.com/user-attachments/assets/ac26d21f-9081-406f-b004-8f3c98213886" />

Going back to Altium, the components you were just looking at can be accessed by the "Components" Panel on the right side of the screen.

<img width="428" height="975" alt="image" src="https://github.com/user-attachments/assets/47301ef7-290a-41c1-9d24-b5b46fd5fb63" />

In the search bar, type enter "H3LIS200DL". When it pops up, you can either click and drag it onto the schematic, or right click and press "place".

With the component placed, you should be able to see in the upper left, there is a "U?". That is the designator. The designator gets printed to the actual PCB and is used to help you determine which components go where. Designators start with a single letter which changes depending on what kind of components it is. For an IC, "U" is common. To see the other designators the team uses, refer to the [General Design Practices](#general-design-practices) page. Normally a number will be in place of the question mark, but we leave it as a question mark to later let Altium do the numbering for us.

In the bottom left is the component value. In this case it is just the part number of the IC.


<img width="349" height="416" alt="image" src="https://github.com/user-attachments/assets/4d9fe4d4-0234-4f31-b971-7f6b3d42cbbf" />

If you double click on the component, its property panel will open and you can modify its details here. Notice that the description box is used for an english description of the component. The team's standards for the components panel can be found in the [General Design Practices](#general-design-practices) page as well.

<img width="487" height="276" alt="image" src="https://github.com/user-attachments/assets/443bf95d-b620-4e15-8716-b3dc1f45fcb4" />

Next we need to add the passive components. To add these we will use Manufacturer Part Search. This is a database of components that Altium provides. The team usually uses this for generic passives such as resistors and capacitors, though not always.

If you’ve studied the data sheet, we know that this schematic will need a 10k resistor, 10uF ceramic capacitor, and a 100nf ceramic capacitor. In the search bar enter “10k resistor”. The standard passive component surface mount device (SMD) size for the rocket team is 1206, so we want to search for a 1/4W 1206 10k resistor, such as the one highlighted below.

ℹ️ ***In recent years the team has had JLCPCB place the components on the boards as opposed to soldering them all ourselves. Depending on the project, it’ll be completely fine to use smaller sizes than 1206, though I wouldn’t recommend going smaller than 0603. For more information on standard SMD component sizes visit this [link](https://www.surfacemountprocess.com/smd-component-packages.html).***

<img width="1187" height="349" alt="image" src="https://github.com/user-attachments/assets/aa96e52b-29da-4d11-86af-ed6502e1b7e4" />

Right click on the component and click place, then place one of the schematic. Ensure you update the properties with the comment being the resistor value.

<img width="508" height="342" alt="image" src="https://github.com/user-attachments/assets/0b48c7c0-98d0-4979-8047-59a241286491" />

You should be able to repeat the previous steps to add the capacitors.

<img width="972" height="523" alt="image" src="https://github.com/user-attachments/assets/3166e216-5993-407f-95fd-1c7b0f9436cb" />

### Schematic Wiring

Now we can finally wire up the components. You can move components around the sheet by clicking and dragging over the component, then grabbing and moving them around. While they are selected you can rotate them by hitting the spacebar. Position them approximately like the previous image.

To create wires, click the image with the blue lines in the hotbar on the top of the display window, you can then click the ends of the pins you want to connect together. A red asterisks will appear on your mouse when you are hovering on the edge of a pin.

<img width="400" height="30" alt="image" src="https://github.com/user-attachments/assets/eb601fb0-6086-473a-955b-8f275cffb855" />

Connect the components up like in the image below. Notice the connected GND pins.

<img width="804" height="578" alt="image" src="https://github.com/user-attachments/assets/86e48404-a05f-4a59-966f-067863fbc810" />

We now need to tell Altium where the power and ground pins are. In the toolbar again, click the GND symbol. This should attach one to your mouse. You can then place them on the desired nodes. If you then right click the GND node in the toolbar, you will see a VCC node, you can click on this and place it in your circuit as well.

<img width="395" height="295" alt="image" src="https://github.com/user-attachments/assets/3b585008-7500-42cb-8b6f-054516ff90ed" />

However VCC is not that descriptive, so once you've placed one, you can double click it to open the properties, and there you can rename it to "+3.3".

<img width="396" height="287" alt="image" src="https://github.com/user-attachments/assets/854e7ced-8a3b-4957-901c-64d991f932dd" />

Your circuit should now look like the image below:

<img width="660" height="392" alt="image" src="https://github.com/user-attachments/assets/377b2b89-e641-492b-884d-4dcc175849fd" />

Finally, we need to add some off-board connectors. We will do this by using a 6 pin header (4 pins for SPI, 1 for VCC, 1 for GND). Go into components and search for “6 Pin Header”, add this to the schematic. We are going to connect the remaining pins to this header by using something called a net label. You can place these by right clicking on the wire symbol, and selecting “Net Label”. You can attach these to any pins or existing wires, then double click them to change the “Net Name”. Any wires with the same net label attached to them are considered connected by Altium. It’s essentially wiring without the wires. Spaghetti’s good, but not when your wires look like it, so please use these to organize. Assign Net Labels to match the image below.

<img width="916" height="439" alt="image" src="https://github.com/user-attachments/assets/27e6fc42-39fe-4c55-8dc3-b52df6c3d09f" />

Nearly there! Now we need to annotate all of our components. This means numbering the designators we talked about before. Remember Altium can number these automatically as long as they follow the correct format (Letter?), if any do not look like that, make sure to fix them. To Annotate, click Tools > Annotation > Annotate Schematic.

<img width="543" height="439" alt="image" src="https://github.com/user-attachments/assets/e71118df-be7e-4bc6-95c5-fde31b1652f2" />

There should then be a popup. On this window, click “Update Changes List”, then “Accept Changes (Create ECO)”, there will be another popup showing you the changes it will make. Click “Validate Changes” then “Execute Changes”. You can then close both of these windows and every component should be annotated!

<img width="958" height="453" alt="image" src="https://github.com/user-attachments/assets/44f079dd-d76e-4432-92ef-2520abf8e708" />

Finally we need to validate our schematic. To do this, click Project → Validate PCB Project ProjectName.

<img width="384" height="551" alt="image" src="https://github.com/user-attachments/assets/90cff6fd-db7c-497e-97e7-6bc345cebf3a" />

Look at the bottom of the screen in the messages panel for any errors. If you’ve done everything correctly, it will look something like this:

<img width="745" height="81" alt="image" src="https://github.com/user-attachments/assets/bdf06d8a-ad8a-4109-94ba-9ab49f1a8a34" />

### Creating the PCB

We can finally start working on the PCB! Like with the schematic, you will have to create a PCB document. File → New → PCB. Rename it to something useful like “H3LIS200DL_Breakout_PCB”.

<img width="446" height="358" alt="image" src="https://github.com/user-attachments/assets/571a50e6-1f4a-413d-96d4-56e6a7d67ad3" />

Instead of schematic symbols, the PCB requires what's called footprints. Footprints are the physical pads that the components connect to on the PCB. As with the schematic symbols, some footprints are in Altium natively and others are not. You can also create custom footprints as well (find details on how to in the [Selecting Components](#selecting-components) page). Components from the Components panel and Manufacturer Part Search should have their footprints already attached!

We can now update the PCB based off of the schematic. You can also make changes to the schematic after you’ve edited the PCB file, and update the PCB file again with any changes. But in this process, Altium likes to create something called rooms. We do not use rooms so we can disable them to avoid accidentally adding them when updating the PCB.

Click Project → Project Options → Class Generation, then uncheck the checkboxes underneath “Generate Rooms”. Click “OK”.

<img width="1029" height="597" alt="image" src="https://github.com/user-attachments/assets/14faa624-3858-4be5-8287-6e14190e5128" />

From the schematic, click Design > Update PCB Document FileName. A popup will appear showing you the changes that will be made. Click Validate and Execute.

<img width="1267" height="692" alt="image" src="https://github.com/user-attachments/assets/7205194c-e611-450e-9d35-f47f1b9dd531" />

Your footprints should now appear on the PCB document! It might look straight out of the matrix or something, but don’t worry it’s actually quite simple! You can move around your footprints by dragging them around, just like on the schematic. Take note of the yellow lines connecting components. These lines show you what's connected to what in the schematic. Unfortunately you will have to use your brain to think, so use those brain cells to place components in a way that avoids these lines crossing as much as possible in order to make your job easier later.

<img width="645" height="530" alt="image" src="https://github.com/user-attachments/assets/d5f98bfd-308f-4ec9-a254-8ad51baca982" />

Before we begin routing, notice the tabs at the bottom of the display window.

<img width="778" height="132" alt="image" src="https://github.com/user-attachments/assets/7ae25893-6200-4472-9a37-2f4f78742964" />

These are the board layers. They are all color coded and used for different purposes. The 2 important layers for routing are the Top and Bottom Layers. These are the copper layers of the board and represent the wire connections. If you look at the components already placed, you'll notice the footprint pads are red, this is because these are on the “Top Layer”. It is also possible to have components on the “Bottom Layer”, but that is uncommon unless you’re really pressed for space. Some boards have 4 of these copper layers, useful when there are a lot of things that need to be connected, but we are fine with just 2.

### PCB Routing

To begin routing click the line symbol in the middle of the toolbar.

<img width="407" height="64" alt="image" src="https://github.com/user-attachments/assets/8589fc9c-cece-432e-9d93-1b6309bc8458" />

Remember those faint yellow lines? They are suggesting connections between the pads. You want to use these as a general guide on what pads to build traces between. For example, there is the faint line between the square pin of the header and the left pad of R1, we can place a wire between these similarly to how we did in the schematic.

<img width="367" height="317" alt="image" src="https://github.com/user-attachments/assets/7383f245-3697-4b30-96c3-b274f052b09f" />

We have now created a physical connection between these two points!

Some boards will get very complicated and require you to cross wires, but if you try to do that all on the same layer you will connect pins together that should not be. You do this by creating some wires on the bottom layer. There's two ways to do this, either click the “Bottom Layer” tab, and then the “Interactively Route Connections” button again, and you will now be routing on the bottom layer. Or you can use the “+” and “-” keys to change layers in the middle of a line. When you do this you will create something called a via. Vias are used to do exactly this, change the layer of a wire connection.

### Design Rules












## General Design Practices

## Selecting Components

## Data Busses


