---
layout: default
title: General Design Practices
parent: Hardware
grand_parent: Tutorials
has_children: false
nav_order: 3
permalink: /docs/tutorials/hardware/design_practices
---

# General Design Practices
{: .no_toc }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Design Process
{: .no_toc }

When designing new printed circuit boards (PCBs), or making large revisions to existing cards, the Hardware Sub-Subteam (SST) will go through 4 design stages. These are:

1. Specifications
2. Schematic Design
3. Test Plan
4. PCB Design

The reason for this process is to reduce the number of mistakes that make it to manufactured boards. Mistakes on these boards result not only in wasted money, but also wasted time due to the time it takes to find the error, re-order, re-assemble, and test. Delays in the Hardware SST reduces the time the Firmware SST has to program the boards, which ultimately reduces the likelihood of completing the boards before flight.

### Specifications Stage
The specifications stage is where the initial design specs of either new, or major board revisions are discussed and documented. It will usually consist of the Avionics lead, and the Hardware, Firmware, Software SST leads. Occasionally there might be temporary SST leads or other Rocket Team leads involved depending on the board being designed. The results of the specification stage will be a document outlining the design specs of a board, giving team members that work on the board knowledge on what the leads are looking for.

### Schematic Design Stage
In this stage, a Hardware Team member will be responsible for designing the initial schematic based on the spec document from the specification stage. To do this, the assigned team member must select components while consulting with other hardware SST members, as well as the Firmware SST to ensure that the components will work with the flight computer architecture. Some components will be standard, such as the microcontrollers, and others, such as an accelerometer, must be researched to find a suitable component. The team member will then build the schematic in Altium following the guidelines laid out later in this guide.

At the end of this stage, the Hardware SST will hold a "Schematic Review" with the rest of the Avionics team to point out mistakes and suggest changes. These changes must be made before the PCB stage. By the end of this stage there should be a completed schematic.

### Test Plan Stage
The test plan stage is where the Hardware and Firmware SSTs will meet and discuss a testing process for the board, and what to add to the PCB to make testing and debugging easier for both teams. A couple of examples

* Testing process: Hardware member that finishes assembling the board will go through each adjacent pair of pins with a multimeter and check for solder bridges.
* Board addition: Adding a pin testing pin on the MOSI SPI line between the microcontroller and sensor that the Saleae can connect to.

The test plan meeting can happen as a separate meeting, or the same meeting as the schematic review. By the end of this stage there will be documentation on what the PCB should include to assist Hardware and Firmware SSTs in the test and debugging process.

### PCB Design Stage
The PCB design stage is the last stage of board _design_. Here the member is responsible for building out the PCB in Altium given the spec documentation, the schematic, and the test plan documentation from the previous stages.

At the end of this stage, the Hardware SST will hold a PCB design review to verify the board fulfils the spec document and the test plan, as well as all of the guidelines listed below. By the end of this stage there will be a completed PCB project in Altium ready to be ordered.

***

## Overall
### Project Creation
New projects will be created in the teams [Altium Workspace](https://rocket-team.365.altium.com/designs) in a corresponding folder, then opened in the Altium Designer application. This ensures that the project is stored in Altium's own version control. Some older projects were saved here on Github and require Github access to open. The workspace allows active viewing of each project without actually needing to open them in Altium, as well as access to the teams components list.

Any major revisions should be new files, but time can be saved by duplicating the file you wish to work on, renaming it (typically by its revision number), and then making the desired changes to the new file.

***

## Schematic
### Layout
The layout of the schematic should be in sections, connecting each section by use of named nets. This provides a much cleaner schematic that is easier to read. Additionally, each section should be boxed and named using clear English (not a part number) to allow someone to understand what the section does at a glance.

Currently we are using a single page for schematics, and enlarge them as needed.

Notes should be written onto the schematic as needed to make it clear to future editors to understand what is happening. Use notes for possibly unique design decisions or to give someone assembling the board some instruction.

Example of a good schematic:

<img width="1124" height="746" alt="image" src="https://github.com/user-attachments/assets/93346f66-f1ad-48a9-aa32-ba7b7b8fcc66" />

### Components
There are multiple ways to add components, the "Components" panel, the "Manufacturer Part Search" panel, downloading from online, or creating our own. Preference should be given to components and manufacturer part search, for consistency. When downloading or creating components, they can be added to the teams components page on Altium so that they show up in the components panel in Altium Designer. Though this should only be done after verifying correctness of the component.

Also ensure that components have a few properties filled out. These being
* Designator -> which can be filled automatically
* Comment -> which is the part number
* Description -> The English description of the component, such as "GPS"

Example:

<img width="377" height="237" alt="image" src="https://github.com/user-attachments/assets/3316188c-602b-4c90-9dcc-13f679e3adec" />

### Designators
Currently, these are the standard designators the team uses

* C -> Capacitors
* R -> Resistors
* U -> Integrated Circuits
* D -> Diodes
* P -> PCIE (though this does not get placed on the PCB)
* J -> Off Board Connectors

***

## PCB
### Layout
The layout of the PCB is mostly a matter of UFC structure, and how to make the components and routing fit.

Example Layout: (This is from last year's UFC Template, ours will look slightly different)

<img width="705" height="672" alt="image" src="https://github.com/user-attachments/assets/9306edd9-346c-4b3e-acf3-83965a5b13cf" />

### Power and Ground Polygons
We typically will use power and ground polygons that encompass our whole boards. its the easiest to apply these using the polygon manager in Altium (see the Altium Hardware Training). Typically they will be laid out like below:

_**2 Layer Boards**_
| Layer | Net |
| ----------- | ----------- |
| Top Layer     | Power (3.3V or 5V) |
| Bottom Layer  | GND      |

<br>

_**4 Layer Boards**_
| Layer | Net | Routing |
| ----------- | ----------- | ---------- |
| Top Layer    | GND  | Primary Routing Layer |
| Mid Layer 1  | GND      | Minimal Routing |
| Mid Layer 2  | Power (3.3V or 5V) | Minimal Routing |
| Bottom Layer | GND      | Primary Routing Layer |

<br>

### Silkscreen
For UFC Boards, there should be at least 2 standard silkscreens on the back side of the card, these are:

```
UFC XXXX Card
Rev. X.X
STUDENT NAME
'.ModifiedDate'
```

replacing XXX with the board name, X.X with the board revision, and STUDENT Name with the designers name. Altium will detect '.ModifiedDate' as a variable and automatically change the date on the board every time it is edited.

```
UMNRT Avionics
Universal Flight Computer
rkt-team@umn.edu
```

Sometimes the team will use other decals or logos in the remaining space on either side.

If they are not a UFC card, ensure it is labeled similarly but adjusted as necessary.

### Test Points
Each board should contain test pad/pins based on the decisions outlined in the Test Plan. Each of these should also be labeled with a silkscreen.
The designator on the test connections should be `TEST`.

Hardware will typically use test pads for multimeter contacts, and the test pad template used is `r120_110`. 

<img width="242" height="200" alt="image" src="https://github.com/user-attachments/assets/38137b31-8bdb-42c9-b041-9c4558e42f19" />


Firmware will use test pins for Saleae contacts, and the pin template used is `c150_h90`.

<img width="556" height="176" alt="image" src="https://github.com/user-attachments/assets/bff14237-d4c7-48f4-a854-3697044fd22d" />


### Passives
In order to make soldering easier, any resistors, capacitors, LEDs, and any other passive sharing the same footprint, should all SMD sized at `1206` whenever possible. If cramp for space on any particular card, smaller sizes can be used.

### Decoupling
Decoupling capacitors are capacitors which are placed very close to the power pins of a chip in order to fulfill two purposes. Bulk decoupling, which eliminates low frequency noise in a power supply caused by load transients (ex. other chips rapidly changing the amount of current they are drawing, for instance due to radio transmissions or ADC conversion). And the high-frequency decoupling capacitor, which filters out higher frequency noise caused by other chips or RF interference. **Unless otherwise stated in a packages recommended circuit or application hints section**, the spec should be that there should be minimum 1x **10uF ceramic bulk decoupling capacitor** per chip, adding another 1x 10uF ceramic bulk cap for every two sets of power pins (ex. if a package has 1 or 2 pairs of power pins, use 1 bulk cap, if it has 3 or 4 use 2 bulk caps, etc). High-frequency decoupling capacitors should be placed at every set of power pins and should be a **0.1uF ceramic capacitor**.

### Trace Length Equalization & Impedance Matching
Traces for clocked synchronous communication buses (I2C, SPI, etc) should be length-matched when possible and as such vias should be avoided. The length matching helps avoid situations in which the propagation delay between clk and data edges are misaligned which can cause corrupted data transmission. This rule is not absolute but should be adhered to when convenient. Vias are to be avoided because they can complicate the length calculation for trace length equalization. Impedance matching is a similar concept which attempts to minimize signal reflection of a transmission line (in this case a data or clock signal for a communication bus) by matching the load impedance of the trace to the expected load impedance of the trace driver. For SPI, the most used communication protocol on the UFC, impedance matching is not greatly beneficial unless the bus is particularly long or fast. The backplane host interface might be a good target for a first trial of impedance matching, especially if the speed limit is ever tested.

### Package Shapes
Whenever possible, Avionics prefers to use SMD for all of the board components with the exception of off board connectors. For integrated circuits, it is preferably to use package types that have the pins exposed, such as `SOIC` or `TQFP`. This makes soldering and testing much easier than when using package types with hidden pins. Though this is not a hard rule, other considerations may warrant using other package types.
