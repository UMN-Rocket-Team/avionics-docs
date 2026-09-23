---
layout: default
title: BMS Testing
parent: Battery Management System
nav_order: 1
permalink: /docs/projects/bms/testing/
math: true
---

# BMS Testing
{: .no_toc }

Environmental and electrical tests of the BMS: thermal soak, discharge surge, short circuit, and hot-case discharge
capacity.
{: .fs-5 .fw-300 }

{: .check }
> The old wiki recorded these tests almost entirely as screenshots and photos. There are no dates, no pass/fail
> criteria, and no written results. If you ran these tests, please add what the results were.
>
> The plots are screenshots from **MAX software**, which appears to be the vendor's evaluation software for the
> MAX17320.

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Test sequence

The avionics environmental testing runs in this order:

1. **1-hour thermal soak**
2. **Vacuum soak**
3. **Thermal functional testing**

There are no vacuum soak results in the old wiki.

## Thermal soak

{% include figure.html src="https://github.umn.edu/user-attachments/assets/aea81402-0838-43d2-b8e3-cd193154c4ad" caption="Thermal soak profile" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/4eb5e5ec-33c3-4742-afbb-d88479eef2d0" caption="Thermal soak results in MAX software" %}

{% include photo-links.html label="Post-test photos" urls="https://github.umn.edu/user-attachments/assets/42e27acd-b41b-475a-90d0-8d9b27f18c03, https://github.umn.edu/user-attachments/assets/7f0b1c4f-a827-4dba-a2ef-bb2cfac923eb, https://github.umn.edu/user-attachments/assets/58b48cca-f8db-4212-9b6d-d78e5bff2263, https://github.umn.edu/user-attachments/assets/556e07e3-18f6-4205-b1ce-346cfa0f851c" %}

## Discharge surge

The pack is discharged into a **2.7 Ω** load at **12.6 V** (a fully charged 3S pack, 3 × 4.2 V). That gives a
theoretical maximum current of:

$$
I = \frac{V}{R} = \frac{12.6\ \text{V}}{2.7\ \Omega} \approx 4.67\ \text{A}
$$

{% include figure.html src="https://github.umn.edu/user-attachments/assets/8d1daabb-e21f-4e33-959a-50836660c284" caption="Surge testing profile" %}

{% include photo-links.html label="Setup photo" urls="https://github.umn.edu/user-attachments/assets/bfe3bca5-d476-4a71-bcc1-54ba0cb975af" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/2ad8a051-5dbc-4b3b-acaa-f10a7c02eb0d" caption="Surge test plots in MAX software" %}

## Short circuit

{% include photo-links.html label="Setup photo" urls="https://github.umn.edu/user-attachments/assets/4a573326-9d85-4b6b-b959-95e2cf38760d" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/ba667c36-6dc6-4413-b2c2-733a9cb8c152" caption="MAX software alerts and protection status during the short" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/082369e5-c25e-4a3a-8e42-5a3244498e52" caption="Short circuit test plots in MAX software" %}

## Hot-case thermal discharge capacity

{% include figure.html src="https://github.umn.edu/user-attachments/assets/0e5e1467-ee98-49f2-aa49-c99e0c174f18" caption="Hot-case thermal discharge capacity test" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/c223ef04-8b43-432d-be1c-f6fd3a933448" caption="Hot-case discharge plots in MAX software" %}

{% include figure.html src="https://github.umn.edu/user-attachments/assets/6af6d60d-d2a3-4dcd-bd73-9f89de13aca9" caption="MAX software at the end of the test" %}
