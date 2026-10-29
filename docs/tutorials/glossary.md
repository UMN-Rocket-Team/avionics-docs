---
layout: default
title: Glossary
nav_order: 2
permalink: /docs/glossary/
---

# Glossary

Running list of avionics terms, acronyms, and abbreviations. If you see something missing, feel free to add it!

<div id="sortable-table-wrapper" markdown="1">


| Term | Definition |
|:-----|:-----------|
| bno, sensor, accel, accelerometer | BNO055; sensor that measures acceleration, angular velocity, and magnetic field |
| mag | Magnetometer (measures magnetic field) on the BNO055 |
| gyro | Gyroscope (measures angular velocity) on the BNO055; different from GYRO |
| Midwest, Midwest card, GYRO | Roll control board |
| alt, altimeter, bmp | BMP390; pressure and temperature sensor |
| radio, LoRa | Radio used for long-range wireless communication (LoRa is the modulation technology) |
| PR | Pull Request; request to merge code changes into another branch |
| CAN | Controller Area Network; communication protocol used between boards |
| IMU | Inertial Measurement Unit; general term for a sensor that measures acceleration and angular velocity |
| COTS | Commercial Off-the-Shelf; components purchased rather than custom-built |


</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const wrapper = document.getElementById("sortable-table-wrapper");
  if (!wrapper) return;

  const table = wrapper.querySelector("table");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const cellA = a.cells[0].textContent.trim().toLowerCase();
    const cellB = b.cells[0].textContent.trim().toLowerCase();
    return cellA.localeCompare(cellB);
  });

  rows.forEach(row => tbody.appendChild(row));
});
</script>
