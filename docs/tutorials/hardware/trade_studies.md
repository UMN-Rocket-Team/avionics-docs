---
layout: default
title: Trade Studies
parent: Hardware
grand_parent: Tutorials
has_children: false
nav_order: 6
permalink: /docs/tutorials/hardware/trade_studies
---

# Trade Studies
---
{: .no_toc }

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

What are trade studies?

By definition in the NASA Systems engineering handbook, a trade study is "A means of evaluating system designs by devising alternative means to meet functional requirements, evaluating these alternatives in terms of the measures of effectiveness and system cost, ranking the alternatives according to appropriate selection criteria, dropping less promising alternatives, and proceeding to the next level of resolution, if needed."

That's a lot of jargon. What did it actually mean? Let's break it down with an example for selecting a sensor to collect motor pressure data.

The trade study template below can be found [here](https://docs.google.com/spreadsheets/d/1DZZNgTP6iAYz3JNk8SiITwpT2VR6S7-8nERe-11uSDI/edit?gid=0#gid=0)

<img width="2082" height="582" alt="image" src="https://github.com/user-attachments/assets/a5f42606-f6fc-48e2-83c6-3f1143b53340" />

---

# How to perform a trade study

First, before performing a trade study, it is important to understand the requirements that we are trying to fulfill by selecting a specific component or making a certain design decision. For our example, we will be using the system requirements for a wireless motor data pressure collection system, which can be found below.

<img width="1777" height="541" alt="image" src="https://github.com/user-attachments/assets/93c331be-4031-4495-88f4-7c38c800d8a1" />

The first column is the criteria column. These are the metrics we want to compare or "grade against". For a device like a pressure sensor, we need to address its purpose. What role is it trying to play in your system? What requirement is it trying to meet? For our pressure sensor, its purpose is to collect motor pressure data for our system. What we are trying to do is determine how well each device, or design choice, fulfills our system requirements.

First, you must find alternative solutions. Usually, a "baseline" model is used, and other potential solutions are compared against it. This is useful if you are trying to find alternatives to an existing component that may not be manufactured anymore or out of stock. If you are using a trade study to find an alternative to an existing component, the existing component should be the "baseline" and other potential replacements would be compared against it as alternatives.

# Trade study steps

## 1. Define evaluation criteria

Criteria are the measurable factors used to compare possible solutions. They should all be judged by the same standards. Below are a few examples of measurable factors:

 * Cost
 * Reliability
 * Ease of Integration
 * Pressure Measurement Accuracy
 * Power Consumption
 * Flight Heritage

<img width="1835" height="513" alt="image" src="https://github.com/user-attachments/assets/d66be9a8-e851-470e-890a-93a3696c4720" />

## 2. Explain Rationale

Rationale should provide a clear description of each criterion and tie back to specific system or subsystem requirements. If we are performing a trade study for a pressure transducer, a good rationale for a criterion of "pressure measurement accuracy" might be MOTORDAQ-1.4 along with a brief narrative explaining the system accuracy requirement.

<img width="2083" height="580" alt="image" src="https://github.com/user-attachments/assets/51f860bb-71f9-4e58-bcb5-0591981147f9" />

## 3. Weights

How much do I care about this criterion? These should reflect the priorities of your system. For example, in a rocket, physical space and mass are both at a premium. If I have a very tight mass constraint for a subsystem, I might care a lot about the mass of my individual components in a trade study. For a pressure transducer instrumentation subsystem, I might care heavily about its accuracy, maximum operating pressure, and measurement bandwidth. Since most pressure transducers are similar in mass, comparing their masses against each other may not make sense if I have a sufficient mass budget for my system. If I'm counting grams, then that might be a different story.

{: .note }
> Weights should all add up to 100%

<img width="2083" height="597" alt="image" src="https://github.com/user-attachments/assets/e7a33aaa-cb0c-416f-91fa-67d832e1ca1f" />

## 4. Scale

Scales must be defined to explain how you graded your options. Scales ensure all potential options are compared equally against each other. For our trade study template, a range of 0.00 - 1.00 is used with 0.05 increments. Do not go beyond this in terms of precision; it adds unnecessary complications.

<img width="2082" height="594" alt="image" src="https://github.com/user-attachments/assets/1b1e3fc4-4801-4fc3-bcd3-4d11b5250fa2" />

## 5. Scoring

Now that we have established our criteria, rationale, weights, and scale, we can start figuring out how well our options meet our requirements. Using the drop-downs, select the score for each component with respect to the specific criteria. For example if a pressure transducer has a 2.5 % Full scale accuracy listed in the datasheet, its corresponding score for that criterion would be 0.5 according to our scale. if it had a 3% accuracy, then the resulting score would be 0.6 for our accuracy criteria.

<img width="2082" height="585" alt="image" src="https://github.com/user-attachments/assets/5bb4e83a-6451-4d72-9fb0-e38b04b38a77" />

## 6. Option selection

Once all of our scores for each criterion have been selected, the resulting components will each be given a score in terms of a percentage. The score represents how good a fit each component is, given our system or subsystem requirements.

 * 100% Score > 85% This component is a good option for our subsystem.
 * 85% > Score > 50% This component meets our needs, but isn't anything to phone home about.
 * 65% > Score > 30% Options in this range will probably do the thing?
 * 30% > Score > 0% This is the "guys, we might be cooked" zone. We should probably reevaluate our design, since what we want simply doesn't exist and we might have to invent a new technology.

<img width="2095" height="585" alt="image" src="https://github.com/user-attachments/assets/edd07035-5d9e-40e3-8bf6-aeaa0a4c6d36" />

# Conclusion

Now that you know how to do a trade study. Use them for all of your design decisions! One advantage of trade studies is now you have multiple options to pick from in the event that your 1st place option is a dud or you run into issues later down the design process. This is the process that NASA, Blue Origin, and many other aerospace companies use to select components for space missions. Make sure to talk about trade studies in your job interview!











