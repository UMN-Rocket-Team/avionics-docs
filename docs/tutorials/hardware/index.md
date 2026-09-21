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

Before we go ahead and finish all of our traces, we need to adjust some of Altium's design rules. The design rules are rules dictating things like the minimum distance between two pads, or the minimum distance between a trace and a via. These are dictated by the manufacturer. We can use JLBPCB’s rules as a guide, which can be found at https://jlcpcb.com/capabilities/pcb-capabilities. To edit these in Altium, click Design → Rules. The ones we are particularly interested in are under Design Rules > Electrical > Clearance > Clearance. Here you can change the minimum clearances Altium will accept.

ℹ️ ***You may not always need to change these, you can often just keep Altiums defaults, as they are very generous. But you can change these to your PCB manufacturer's minimums if you are having issues. But never go below the manufacturers minimums.***

I have set them up like this (in accordance to JLBPBs rules)

⚠️ **Ensure your units are displayed in mm, by looking at the bottom left of the editor, you will see grid coordinates in the unit you are in. You change change them to mm by going to View → Toggle Units**

<img width="1330" height="541" alt="image" src="https://github.com/user-attachments/assets/63a1a808-06e5-4522-ad21-c6e4f6be198e" />

There's another rule we want to change that is separated from the ones we just modified. In the rules window search bar, search for "sliver". Once you open every subsection you should find a rule for "MinimumSolderMaskSliver". Change this value to .18mm.

<img width="608" height="445" alt="image" src="https://github.com/user-attachments/assets/f1c309f1-f985-4305-a1f2-d2f90aeb5c42" />

Now you should be able to proceed through and complete all of the connections. Ignore the GND connections for now, we will do something different with these later. Don't be afraid to try a few different layouts to find one that looks the cleanest! Try routing your traces!

<details>
<summary>Let's compare. Notice how my layout changed.</summary>
  <img width="976" height="612" alt="image" src="https://github.com/user-attachments/assets/ee8d9ca2-f3f3-4ad5-8ef4-0ecdb359b298" />
</details>

With our components laid out how we want them, we can now define the edges of our board. Note that in some instances this is the first thing you do, such as for the flight computer where the boards must have defined dimensions. On other projects, the dimensions will depend on the components needed, which is the case for this project.

### Test Points

While not being used for this project, this section will briefly describe test pins and pads. Altium also lets the user place pins/pads by hand instead of just with footprints. This is useful for test points. 

Test points allow hardware to debug the PCBs more easily while soldering, and firmware to debug it during firmware development. We use pins for firmware, as this provides a solid connection for a device called a Saleae. For hardware, we can use pads as we only need them for a multimeter contact. 

ℹ️ ***Often for devices using the STM32 we use STLink test points, a preset component. However if you are making boards such as this breakout, manually creating test points is very useful.***


To make one (again it's not needed in this project, but for demonstration purposes), in the hotbar, if you right click on via, you can select a pad. Place one of these down where it's needed then double click it to open the properties.

<img width="411" height="291" alt="image" src="https://github.com/user-attachments/assets/85acd5ce-177a-4e1d-a21c-05e002c0875e" />

Here you will set the designator to "TEST", and the net to whatever net you intend to connect to this point. You'll also notice a "Template" option, which allows you to use various different pins and pads. You can view the team's test point standards in the [General Design Practices](#general-design-practices) page. You then connect the test point up with a trace just as you did previously.

### Defining Board Shapes

To change the board shape, click View → Board Planning Mode. You’ll notice the previously black area turn green. You are now editing the shape of the board. Since our board is already a square, you can click Design → Edit Board Shape. Drag in the edges using the white mouse points until the board fits your components more ideally, leaving a bit of extra space on the bottom (we will get to this in a minute). It should now look something like this:

<img width="752" height="614" alt="image" src="https://github.com/user-attachments/assets/8eed6391-7809-4f62-857a-04f398a20f17" />

You can go back to the layout mode by clicking View → 2D Layout Mode.

### Silkscreens

Next we want to add text to the board. For this project, it would be helpful for the users of this breakout to have the header pins clearly labeled to avoid having to look at our documentation every time they want to use the breakout. To do this we are going to use the yellow layer called the “Top Overlay” in Altium. This is also known as the silkscreen layer, and is used for adding drawings or text to the board.

To add the labels, click “Top Overlay” to make sure you are editing the correct layer. Then in the toolbar click the “Place String” button.

<img width="437" height="69" alt="image" src="https://github.com/user-attachments/assets/a54874b0-b80b-4203-9b6a-9ed9d496b0bc" />

Then place it near the VCC pin on the header. Double click the text to open its properties panel. First, change the Font Type to TrueType. Change the text to “VCC”, then edit the Text Height to something reasonable like 1.524mm.

<img width="426" height="312" alt="image" src="https://github.com/user-attachments/assets/5e943c58-00e4-4509-86e1-d4e8d4abfa61" />

Continue to add text near the rest of the header pins labeling them with their respective nets. You can redefine the board shape again as necessary to get the text to fit. It should now look something like this:

<img width="589" height="545" alt="image" src="https://github.com/user-attachments/assets/bfee53ab-078b-4634-b314-f88acb630218" />

Next, you need to label the PCB as a whole. For example, since we are working on a breakout for the H3LIS200DL accelerometer, labeling the PCB as "H3LIS200DL" will be sufficient. These labels are usually put on the backside of the board. To do this, again you will use the "Place String" button, but this time change the "Top Overlay" to "Bottom Overlay", then set the "Mirror" checkbox to checked so that the text will be the right way around when reading it from the back.

<img width="895" height="804" alt="image" src="https://github.com/user-attachments/assets/f9c722d6-3aff-4942-905f-684df6aa04ed" />

ℹ️ Remember the bottom overlay is on the, well, bottom. This means it won't interfere with anything exclusively placed on the top of the board, such as the top overlay or the top layer! The team's silkscreen standards can be found in the [General Design Practices](#general-design-practices) page. 

### Ground Planes

Remember those ground connections we left unconnected? Now that we have a more defined board shape, we are going to finally connect those up. But we are going to do it by using something called a ground plane, that is, the whole bottom copper layer of the board will be a ground connection. The team often uses both power and ground planes on their PCBs.

In the top toolbar, click Tools → Polygon Pour → Polygon Manager

<img width="553" height="363" alt="image" src="https://github.com/user-attachments/assets/e59cca70-e3ec-49b2-8af1-ca6117f66161" />

You should now be in the polygon manager window. Here you can manage all of the "polygons" on your PCB. Polygons are basically just big shapes (polygons) of copper (just like the traces) that you can connect any electrical signals to, usually power and ground. In our case, we will just use a ground plane for now.

Click the button farthest on the right that says New polygon from > board outline. Now in the settings for that polygon in the right hand panel, set the Net to be GND, make sure the layer is the blue layer (known in Altium as the "Bottom Layer"), and name it whatever you want, I will just use GND. In the center screen, check the "Locked" checkbox. This will prevent the plane from being accidentally moved around. Then click apply.

<img width="1248" height="349" alt="image" src="https://github.com/user-attachments/assets/9703d2b9-b21f-4809-a1b5-63b29de35908" />

Your polygon should now look something like this (your polygons may go all the way to the edge):

<img width="433" height="390" alt="image" src="https://github.com/user-attachments/assets/2b4b7879-1fe1-4821-a225-535c003abc8a" />

As you make changes to the PCB beyond this, the polygon will need to be updated. You can do this either by going back to the polygon manager and click the "Repour" button, or you can do it from the polygons properties.

Double click the polygon you just created. The properties panel should open. Then near the top of the panel it will have a button that says “Repour”, click that. This will tell Altium to calculate the details of this plane avoiding obstacles such as holes and previously existing traces.

<img width="266" height="547" alt="image" src="https://github.com/user-attachments/assets/46372239-1c93-45ac-ae64-b0183769e319" />

This ground plane will connect to anything that is either on the layer it’s on, such as pads on an SMD component, or connect to components going through the layer such as vias or through-hole components (as long as they are on the same net). Let's start by pacing vias next to ground pads. Then you can connect traces to those vias that are now grounded. Make sure you repour the ground plane again after adding the vias!

<img width="435" height="389" alt="image" src="https://github.com/user-attachments/assets/64004f0a-49a7-4f42-bd89-710dc8075b01" />

### Design Rule Check

That's it for the design process! Remember the rules we set earlier? We must now go through and verify there are no errors and all of the rules are followed. This is done by clicking Tools → Design Rule Check > Run Design Rule Check.

A design rule verification report will appear with any errors or rule violations. Altium might ragebait you as you’re forced to endlessly conform to the design rules, but don’t take it personally. You will have to work through any errors and try to fix these violations. You can view where the rule violation occurs by clicking the blue link of the rule.

<img width="1555" height="683" alt="image" src="https://github.com/user-attachments/assets/8b7e86d3-48f5-443a-bbd5-cff35577c228" />

When you are happy with the final result, ensure you click “Save to Server” next to the project name. This will save changes to the project to the workspace

ℹ️ ***There may be a popup that allows you to make a comment on the revision being saved to the server. On larger projects where you are saving more often, I highly recommend adding to the comment notes on the changes made.***

### Generating Output Files

There is one last step, and that is to verify that there are no issues from a manufacturers standpoint. There are 2 ways we do this, the first is through a free online manufacturing check.

Start by ensuring your PCB file is selected, then go to File → Fabrication Outputs → Gerber X2 Files.

<img width="372" height="707" alt="image" src="https://github.com/user-attachments/assets/bdea5b31-2d16-4fcc-a3cd-53445490791c" />

There will be a popup with output options for you to select. On the right there are all of the layers we have been using that you can select and generate output files for. Please match the settings in the image below.

<img width="1033" height="705" alt="image" src="https://github.com/user-attachments/assets/7a9c81e9-3133-4c66-99f3-258278f3b329" />

Next go to (with PCB file selected) File → Fabrication Outputs → NC Drill Files.

<img width="372" height="706" alt="image" src="https://github.com/user-attachments/assets/0e5733c3-9500-448c-808e-fae5ed7cd288" />

In the popup, select inches and 2:5 for the resolution, then make sure “Suppress leading zeros” is selected, as well as “Reference to relative origin”, then click OK. If another window pops up, select OK again.

<img width="459" height="714" alt="image" src="https://github.com/user-attachments/assets/d73c766a-65ec-4255-ba6d-d76204087e33" />

Now that you’ve created the output files, open the file explorer, find the project folder on your local device, and inside it there should be a folder called “Project Outputs for projectname”. Here you can find all of the output files you just created.

Select all of the CAMtastic files (except for the CAMtastic Aperture Data file) as well as the the “H3LIS200DL_Breakout_PCB.TXT” and "H3LIS200DL_Breakout_PCB.GM" files.

<img width="761" height="431" alt="image" src="https://github.com/user-attachments/assets/ae18a9ba-61cb-4c5e-857b-3375ef348732" />

Then right click → Send to → Compressed (zipped) folder.

With your zip file, you can see a preview of your board with [JLBPCB](https://jlcpcb.com/), and drag your zip file over where it says "Add gerber file"

<img width="885" height="135" alt="image" src="https://github.com/user-attachments/assets/b837e71c-54d9-4250-87ee-6ea1a460a184" />

After it uploads, JLB will then show you a preview of your board, take a look over this and verify it appears correctly by checking things like all of the holes showing up, the silkscreens showing up and not overlapping, all of the pins and pads where they are supposed to be, etc.

<img width="906" height="234" alt="image" src="https://github.com/user-attachments/assets/18ff757d-18b1-428c-b361-0013700bc4d6" />

If all of it looks good, then that's it! You're done with the training!

⚠️ **Don't forget to Save to Server when you are done with everything!**

### Other Resources

This guide is just a quick guide to getting started using Altium on the team, we encourage you to continue to practice and utilize online resources and the rest of this guide to improve your skills. Listed below are a few links that may help you in your adventures with Altium!

A video on YouTube by Robert Feranec, with a very in depth tutorial how to use Altium, long but very helpful: https://www.youtube.com/watch?v=PqFtSpAXB9Q

Guides from EE3102: https://drive.google.com/drive/u/2/folders/1zoEPUlK-15pITA9IwbEAqrWZzhHMu31a

Guide to creating custom footprints. Again, very long but very helpful if your project requires custom component footprints https://youtu.be/wxYbIGV9_CY?si=AotVodZdm0toma9B

The next section will go over the team’s design practices, which I urge you to go over.



## General Design Practices

## Selecting Components

## Data Busses


