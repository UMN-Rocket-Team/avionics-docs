---
layout: default
title: Parts Reference
parent: Projects
nav_order: 10
permalink: /docs/projects/parts-reference/
---

# Parts Reference
{: .no_toc }

Parts that show up on more than one of our boards, with their datasheets and how we usually wire them. Board-specific
details (which peripheral, which pins) are on each board's page.
{: .fs-5 .fw-300 }

## Where each part is used

| Part | What it is | UFC Primary | UFC Secondary | UFC Interface | Pitot Sensor | GYRO | Payload |
|:--|:--|:-:|:-:|:-:|:-:|:-:|:-:|
| [STM32H730VBT6](#stm32h730vbt6) | Microcontroller | ● | ● | ● | ● | ● | ● |
| [W25N512GV](#w25n512gv-nand-flash) | 64 MB NAND flash | ● | ● | ● | ? | ● | ? |
| [BNO055](#bno055-imu) | 9-axis IMU | ● | | | ● | ● | ● |
| [BMP390](#bmp390-barometerthermometer) | Barometer/thermometer | ● | ● | | | ● | ● |
| [MAX-M10S](#max-m10s-gps) | GPS | ● | | | | ● | |
| [RFD900](#rfd900) | 900 MHz radio | ● ? | | | | ● | |
| [MEM2075 SD slot](#sd-card-slot) | Micro SD card slot | | | ● | | ● | ? |
| [PS1440P02BT](#buzzer) | Piezo buzzer | | | ● | | ● | |
| [REEFS207](#reefs207-servo) | Micro servo | | | | | ● | ● |
| [Würth 150060 LEDs](#leds) | Status LEDs | ● | ● | ● | ? | ● | ● |

A **?** means the old wiki is unclear; see the board's page. The UFC Power Card, Pitot Power Card, and BMS have their
own parts and aren't in this table.

<details open markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## STM32H730VBT6

The microcontroller on every UFC card except the Power Card, and on the Pitot Sensor Card, GYRO, and the Payload
Control Board.

- 100 pins, 550 MHz CPU, 128 KB embedded flash
- 6 SPI, 5 I2C, 5 UART interfaces, plus FDCAN and OCTOSPI

| Document | What's in it |
|:--|:--|
| [Product page](https://www.st.com/en/microcontrollers-microprocessors/stm32h730vb.html) | Overview and all documents |
| [Datasheet](https://www.st.com/resource/en/datasheet/stm32h730vb.pdf) | Pinouts, alternate functions, overview of each module |
| [Reference manual (RM0468)](https://www.st.com/resource/en/reference_manual/rm0468-stm32h723733-stm32h725735-and-stm32h730-value-line-advanced-armbased-32bit-mcus-stmicroelectronics.pdf) | Every register and what it does |
| [Programming manual (PM0253)](https://www.st.com/resource/en/programming_manual/pm0253-stm32f7-series-and-stm32h7-series-cortexm7-processor-programming-manual-stmicroelectronics.pdf) | The Cortex-M7 core: system control, NVIC, processor features, system timer, memory |
| [HAL and LL drivers (UM2217)](https://www.st.com/resource/en/user_manual/um2217-description-of-stm32h7-hal-and-lowlayer-drivers-stmicroelectronics.pdf) | What every HAL and LL function does |
| [Hardware getting started (AN5419)](https://www.st.com/resource/en/application_note/an5419-getting-started-with-stm32h723733-stm32h725735-and-stm32h730-value-line-hardware-development-stmicroelectronics.pdf) | Hardware design and wiring details |
| [Errata (ES0491)](https://www.st.com/resource/en/errata_sheet/es0491-stm32h72xx73xx-device-errata-stmicroelectronics.pdf) | Known silicon bugs and workarounds |
| [FatFS on STM32Cube (UM1721)](https://www.st.com/resource/en/user_manual/um1721-developing-applications-on-stm32cube-with-fatfs-stmicroelectronics.pdf) | The FAT filesystem used for the SD card |

The UFC2 Host Card used an [STM32H735ZGT6](https://www.st.com/resource/en/datasheet/stm32h735zg.pdf) instead; same errata sheet.

**Programming and debugging** goes through an [STLINK-V3MINIE](https://estore.st.com/en/stlink-v3minie-cpn.html) on
a 10-pin [Kyocera AVX board-to-board connector](https://www.digikey.com/en/products/detail/kyocera-avx/009159010061916/4009962).
See [Programming and debugging]({{ '/docs/projects/ufc/cards/' | relative_url }}#programming-and-debugging).

## W25N512GV NAND flash

[Datasheet](https://www.winbond.com/resource-files/w25n512gv%20rev%20c%20112118.pdf). 512 Mbit (64 MB) SLC NAND,
2048-byte pages, 128 KB erase blocks. Single, dual, or quad SPI; we use quad SPI for data and single SPI for
everything else.

NAND flash has some awkward rules (erase in whole blocks, program pages in order, only four writes per page). The
[Flash Driver]({{ '/docs/projects/ufc/firmware/flash-driver/' | relative_url }}) page explains them and how our
driver deals with them.

## BNO055 IMU

[Datasheet](https://cdn-shop.adafruit.com/datasheets/BST_BNO055_DS000_12.pdf). A 9-axis IMU (accelerometer, gyroscope,
magnetometer) that does its own sensor fusion and outputs orientation as a quaternion.

Accelerometer range
: ±2 / ±4 / ±8 / ±16 g

Gyroscope range
: ±125 to ±2000 dps

Magnetometer range
: ±1300 µT (x, y), ±2500 µT (z)

Magnetometer resolution
: ~0.3 µT

Gyro accuracy (old wiki)
: ±2.5 dps

Bus
: I2C, up to 400 kHz
{: .facts }

**How we wire it:** I2C at address **0x28** (COM3 pulled low). It has one interrupt output, **INT1**.

**Things to know:**
- It calibrates itself at power-on, and the April 2025 Pitot test suggests it recalibrates when it's moved around
  ([details]({{ '/docs/projects/pitot/test-results/' | relative_url }}#overnight-flash-test)).
- The old wiki noted it looks likely to be **discontinued** in the next few years, so new designs should consider a
  replacement.

## BMP390 barometer/thermometer

[Datasheet](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmp390-ds002.pdf). Measures
atmospheric pressure and temperature.

Pressure range
: 30–125 kPa

Temperature range
: −40 to 85 °C

Max output rate
: 200 Hz

Bus
: I2C (SPI also supported)
{: .facts }

**How we wire it:** I2C at address **0x76**. To select I2C, chip select (CSB) is tied permanently to power, and SDO
is grounded, which sets the address to 0x76. One interrupt output, **INT**.

{: .check }
The old wiki also listed a resolution of 0.0042 / <0.01 and an accuracy of ±0.15 / ±0.08 (kPa / °C). Those don't
obviously match the datasheet's figures, so check the datasheet before relying on them.

## MAX-M10S GPS

[Product page](https://www.digikey.com/en/products/detail/u-blox/MAX-M10S-00B/15712906),
[datasheet](https://content.u-blox.com/sites/default/files/MAX-M10S_DataSheet_UBX-20035208.pdf). Low-power GNSS
receiver.

Velocity accuracy
: 0.05 m/s

Heading accuracy
: 0.3°

Time accuracy
: 60 ns

Update rate
: Up to 20 Hz
{: .facts }

**How we wire it:** I2C at **400 kHz**, with a timing register value of `0x00B03BCD` on the STM32. One interrupt,
**GPS_INT**. The RF input has a TVS diode for ESD protection and an RLC filter to cut out unwanted frequencies.

For future boards, the u-blox **SAM-M10Q** has a built-in antenna and would be easier to integrate (a suggestion from
the GYRO revision notes).

## Radios

### RFD900

[RFD900ux datasheet](https://files.rfdesign.com.au/Files/documents/RFD900ux%20DataSheet%20v1.2.pdf). 902–928 MHz
frequency-hopping radio, up to 30 dBm (1 W), 64 kbps default air data rate (224 kbps max), with a rated range of 40+ km.
Used on GYRO (off-board, through a header) and, according to most of the old docs, on the UFC Primary Card (see the
note on the [Primary Card]({{ '/docs/projects/ufc/cards/primary-card/' | relative_url }}) page).

**How we wire it:** UART with RTS/CTS flow control. Its 5 V input goes through an **1100 mA resettable fuse** and a
0 Ω jumper. An RFD damaged an STM32 in the past; the RFD peaks at about 1 A, so 1100 mA leaves a little headroom.

**Things to know:** in the April 2025 overnight test it ran at `TX_POWER` 20 because it was getting worryingly hot at
30 ([details]({{ '/docs/projects/ufc/testing/results/' | relative_url }}#overnight-flash-test-2)).

### E22-400T22S LoRa

410–493 MHz (default 433.125 MHz) LoRa module, 22 dBm (158 mW) max, 2.4 kbps default air data rate (62.5 kbps max),
about 5 km range. UART with RTS/CTS. Listed as the Primary Card's radio in its spec.

### RN2483A LoRa

[Product page](https://www.arrow.com/en/products/rn2483a-irm104/microchip-technology),
[datasheet](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/RN2483-Low-Power-Long-Range-LoRa-Technology-Transceiver-Module-DS50002346F.pdf),
[command reference](https://ww1.microchip.com/downloads/en/DeviceDoc/40001784B.pdf). 433 MHz and 868 MHz LoRa
module, 13.6 dBm (23 mW) max. UART with RTS/CTS. The UFC Secondary Card's backup radio.

## SD card slot

[GCT MEM2075-00-140-01-A](https://www.digikey.com/en/products/detail/gct/MEM2075-00-140-01-A/9859614). Takes any micro
SD card. We run it over plain SPI (so it's slower than the flash), with the slot's card-detect pin routed to a GPIO.
Format cards as **exFAT**.

## Buzzer

[TDK PS1440P02BT](https://www.digikey.com/en/products/detail/tdk-corporation/PS1440P02BT/2236828), a piezo buzzer.
We drive it with PWM through a common-emitter amplifier, which makes it much louder and takes less current from the GPIO pin.

## REEFS207 servo

[REEFS RC 49Sub Micro Servo](https://reefsrc.com/products/49sub-micro-servo-reefs207). 3-pin, 4.8–8.4 V, 180° ± 10°
travel, rated −15 to +70 °C. Used for roll control on GYRO and for the payload mechanism.

## LEDs

Würth 150060 series LEDs:
[red (150060RS75000)](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060RS75000/4489901),
[green (150060VS75000)](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060VS75000/4489906),
[blue (150060BS75000)](https://www.digikey.com/en/products/detail/w%C3%BCrth-elektronik/150060BS75000/4489895),
and yellow (150060YS75000).
