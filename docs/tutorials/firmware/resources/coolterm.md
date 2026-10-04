---
layout: default
title: CoolTerm
parent: Firmware
has_children: false
nav_exclude: true
permalink: /docs/tutorials/firmware/resources/coolterm/
---

# CoolTerm

## What is CoolTerm?

CoolTerm is a serial port terminal we use for testing/debugging. It's where we can see the print statements to track sensor data.

## Downloads

Click [here](https://freeware.the-meiers.org/#:~:text=Very%20useful%20stuff) to go to downloads page.

I know the website looks sketchy, but I promise it's not malware.

Under "Very useful stuff" click on the version that's compatible with your computer's OS.

<img width="1362" height="672" alt="Screenshot 2026-09-30 at 3 42 44 PM" src="https://github.com/user-attachments/assets/0a816a3b-b31b-46af-a052-82069885ac63" />

We're also going to want to download the <a href="{{ '/assets/downloads/stm.cooltermsettings' | relative_url }}" download>CoolTerm configuration</a> we use for firmware testing.


## Setup

{: .important}
Make sure your computer is connected to the STM before you proceed with the setup.

Open CoolTerm and click the file icon that says "Open".

<img width="711" height="573" alt="Screenshot 2026-09-30 at 3 46 49 PM" src="https://github.com/user-attachments/assets/e5b9da17-c8af-48ea-b7e8-550165b12c80" />

Type and select `stm.cooltermsettings`.

<img width="726" height="189" alt="Screenshot 2026-09-30 at 3 50 15 PM" src="https://github.com/user-attachments/assets/0ac775b7-2815-4fee-aa29-d4b8b347e9bc" />

Once you open that file, a new terminal with a window that says "The serial port 'usbmodem1303' is not available". That's because we put usbmodem1303 as the placeholder. The port will be different on your device. Choose "Select a different port".

<img width="708" height="572" alt="Screenshot 2026-10-01 at 12 19 31 PM" src="https://github.com/user-attachments/assets/559e4d85-3d81-46d4-9b93-b820f0a8c71a" />

"Serial Port Options" will show up. Under the "Port" dropdown, select the port that's label as `usbmodem` followed by some numbers. We don't need to change anything else so we can just hit "OK".

{: .note}
If the port is not showing up, it's because you're not connected to the STM.

<img width="514" height="547" alt="Screenshot 2026-10-01 at 12 22 17 PM" src="https://github.com/user-attachments/assets/7ff5c1f5-082a-400b-910c-ecfbd2996dcb" />

<img width="512" height="549" alt="Screenshot 2026-10-01 at 12 39 26 PM" src="https://github.com/user-attachments/assets/572b66e4-37dd-4c4c-8680-82bfb9bff8c9" />

It's going to bring you back to the terminal. The last step we have to do is to select "Connect".

<img width="706" height="570" alt="Screenshot 2026-10-01 at 12 23 23 PM" src="https://github.com/user-attachments/assets/4eefb8d2-b4a3-4d4a-b2a7-9b859293846d" />

Your terminal is now good to go! We know that it's setup because in the bottom left corner it lists your port number and "Connected".

<img width="707" height="570" alt="Screenshot 2026-10-01 at 12 24 09 PM" src="https://github.com/user-attachments/assets/e6b66311-07ee-44c1-866a-7b381ec8d2c7" />
