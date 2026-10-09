---
layout: default
title: "Challenge 6: Sensor Driver"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-6/
---

# Challenge 6: Sensor Driver

The sensor driver is the ultimate goal of these challenges. Drivers like these are used all across the UFC for communicating with a myriad of different peripheral devices.

#### What you'll need
- Software: STM32CubeIDE, Logic 2 (Saleae)
- Hardware: Breadboard setup from Challenge 4

Drivers make use of [classes in C++](https://www.w3schools.com/cpp/cpp_classes.asp). A class encapsulates the functionality of a driver into a package that can be easily used by other parts of the code. It's good when doing high-level design to always think about what the express purpose of your code is. In the case of a sensor driver there is a very clear purpose: Get the data from the sensor. The sensor produces data, we want to extract that data, and the driver is what we use to do it.

So let's start by creating the class. We'll do it in a new file.

<img width="794" height="608" alt="Screenshot 2026-09-28 at 11 14 06 PM" src="https://github.com/user-attachments/assets/e1c2a392-97c9-4f08-9db2-3ea820cb1f3a" />

We're going to create what's called a "Header file". This is a C/C++ convention that declares classes and functions.

<img width="474" height="385" alt="Screenshot 2026-09-28 at 11 14 30 PM" src="https://github.com/user-attachments/assets/70d21d28-9d60-4ac2-bea4-9790618b062c" />

The UFC codebase generally uses a separate file to declare each class, and the name of the file is the name of the class declared within. So for this file we'll call it Sensor_Driver.h and put a class called Sensor_Driver in it.

At the top of the file, we put #includes to other files that we'll be using. In this case we need the "stm32l4xx_hal.h" file, which is where those HAL_SPI functions come from.

<img width="516" height="263" alt="Screenshot 2026-09-28 at 11 14 45 PM" src="https://github.com/user-attachments/assets/60b970df-d736-4d31-8b65-ed5e1345fe0f" />

The STM IDE also automatically generates this include guard, this #ifndef statement at the top ensures that this file can't be #included twice in a file.

The next thing that we generally do is put a bunch of macros for addresses we use in the class. I've gathered the relevant ones from page 33 of the [datasheet](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf)

<img width="842" height="838" alt="Screenshot 2026-09-28 at 11 15 32 PM" src="https://github.com/user-attachments/assets/68248c72-137d-4171-acc6-1f536ff55be9" />

Now we can define our class. I'm actually going to use a "struct" instead of a class, but they do the same thing in C++. The reason I use a struct is because everything in a struct is public, whereas everything in a class is private. I like things to be public so that I can access all the fields (class variables) and methods (class functions) from anywhere else in the code.

<img width="704" height="773" alt="Screenshot 2026-09-28 at 11 15 54 PM" src="https://github.com/user-attachments/assets/3e6b140e-cc40-426e-8a40-00f6ed66d1a2" />

The header file is a place to map out the skeleton of the class, not to actually write the code for it. This is because in order for the binary to be linked correctly after being compiled, there can only exist one instance of the code to avoid namespace collisions. But the #ifndef guard was supposed to already take care of that! Well it only works for #including the file multiple times **within one file**. So when the compiler goes to compile ALL of the source files, if you have a #include "Sensor_Driver.h" in multiple source files then the include guard won't work as you expect. The linker will get mad at you for multiple definitions. This is a little bit annoying but we have to deal with it, so headers are reserved for _declarations_ not definitions.

With that said, we now need to determine what kinds of fields and methods to declare in this class. This is subject to the designer of the class, but given our ultimate goal (reading data from the sensor), I would say we don't actually need any fields. The only thing that we _really need_ is a single function that "gets the data from the sensor". But there are multiple steps to that process. The first two functions I'll declare will be almost universal to all classes in the UFC, these are the init and deinit functions for the class.

<img width="695" height="812" alt="Screenshot 2026-09-28 at 11 16 30 PM" src="https://github.com/user-attachments/assets/8cbb0a8c-0580-429a-b2e9-e993bfa612ee" />

The init and deinit functions are for doing the business that's done in the MX_SPI2_Init function (and Deinit, if it existed) in the main.c file. We move that code to the relevant class to keep things organised. Now we can define what I call the _interface_ methods.

<img width="549" height="151" alt="Screenshot 2026-09-28 at 11 16 50 PM" src="https://github.com/user-attachments/assets/8c16369b-19ed-4784-81ea-1d94d7ee791d" />

There is just the one readAccel function. This function just reads the acceleration value from the sensors and outputs the data into three floats (passed in). I also specify that the output will be in m/s^2.

But in order to just "get the data from the sensor", we have a number of steps we'll go through. That's where the third category of methods come in, the _internal_ methods.

<img width="573" height="265" alt="Screenshot 2026-09-28 at 11 17 09 PM" src="https://github.com/user-attachments/assets/a3bd8e59-26ac-495c-a7d4-7cf683992367" />

These internal methods outline the steps for getting the data from the sensor. We need to read the raw data, which requires reading from registers on the sensor. Then convert the raw uint16 data into m/s^2. The writeRegister will be used in the init() function to configure the sensor with certain parameters.

The last thing I like to do is includes a global instance of the driver, so that any file that #includes this sensor driver will have access to one. Because there isn't really a need to make multiple drivers.

<img width="558" height="766" alt="Screenshot 2026-09-28 at 11 17 44 PM" src="https://github.com/user-attachments/assets/6d350458-f710-4973-b520-08e20818c55a" />

In order to prevent this instance of the class from being defined multiple times, we define it as "extern", which _declares_ it rather than instantiates/defines it. We'll create the real instance in the source file, which we can finally start!

<img width="694" height="688" alt="Screenshot 2026-09-28 at 11 18 23 PM" src="https://github.com/user-attachments/assets/16840933-66ad-4e11-a0ee-47a12052773a" />

So I've created Sensor_Driver.cpp and filled it with definitions of all those methods we declared in the header. Now we just need to put in the code, and luckily, we have already written some of it!

We can repurpose this MX_SPI2_Init function from main.c to be our driver's init function. So I'll just copy and paste it in.

<img width="583" height="778" alt="Screenshot 2026-09-28 at 11 18 42 PM" src="https://github.com/user-attachments/assets/f4da19f5-f122-4d65-a2cf-42605ea15374" />

Ahh, I've just realised. The hspi2 which was previous defined as a global at the top of the main.c file is not accessible to our source file here. So I suppose there is a reason to have a field in this class. We can go back to the header and define it.

<img width="570" height="358" alt="Screenshot 2026-09-28 at 11 18 58 PM" src="https://github.com/user-attachments/assets/9549a877-d90e-4b06-80a4-a27891ebbeb1" />

<img width="630" height="443" alt="Screenshot 2026-09-28 at 11 19 21 PM" src="https://github.com/user-attachments/assets/82b856ae-4648-43c2-8ae7-adc58a4e80f7" />

The other thing we don't have access to is this Error_Handler() function, which runs if the HAL_SPI_Init function fails. In the real UFC codebase, we have a UFC_ECODE type (UFC Error Code) that is used to indicate failures like this, but since this driver is in a separate project, I'll just remove the check for now.

<img width="566" height="340" alt="Screenshot 2026-09-28 at 11 19 42 PM" src="https://github.com/user-attachments/assets/3e4a5b3e-7e0c-42ba-ad90-c560c9a19fb1" />

There are also a few other things we want to do in the initialization sequence that have to do with the sensor itself. This is where it really helps to comb through the datasheet. Luckily someone else has already done that work for us, but when it comes to making new drivers this is something that you'll just have to figure out. We'll be changing the values of CTRL registers on the sensor, specifically CTRL2, CTRL1, CTRL3, and CTRL6. The relevant page numbers on the datasheet are 38, 36, 39, and 42.

<img width="1098" height="304" alt="Screenshot 2026-09-28 at 11 20 00 PM" src="https://github.com/user-attachments/assets/f0aca60b-7cfd-4b2d-ae30-27b8679a64d5" />

Yeah this code is a little complex. But for the most part it is just a series of writeRegister commands to enable different settings on the sensor. There is that loop section, which keeps track of the "boot process" status. We enable the "boot bit" in CTRL2 (the most significant bit) and wait for the boot process to be complete (which is indicated by the boot bit being set back to 0). So that's what the loop does. We also have a maximum read attempts of 10000 to avoid getting into an endless loop. It's important to have timeout cases for any looping code, because we never want to get stuck in an endless loop as it will essentially crash the entire flight computer. I'd encourage you to read more about these configuration settings in the datasheet of the sensor.

The deinit function is much simpler. We just disable the SPI2 clock, deinit SPI, and deinitialize all the pins with HAL_GPIO_DeInit.

<img width="420" height="155" alt="Screenshot 2026-09-28 at 11 20 21 PM" src="https://github.com/user-attachments/assets/8bd3569d-37e3-4e2a-a93d-38cc01880bdd" />

I think next we'll focus on the read and write register functions. We have already written a readRegister function in the main.c file, so we just have to port it over and modify it slightly.

<img width="656" height="171" alt="Screenshot 2026-09-28 at 11 20 38 PM" src="https://github.com/user-attachments/assets/548e4805-80e7-4cb6-82f8-fb0fad8c89c5" />

The reason we don't simply return the output is because in the real codebase we return a UFC_ECODE, so I leave it as void in this example to better match that.

Then, the write register sequence is very similar. Page 31 of the datasheet says that the MSB must be a zero, which it already will always be in the case of a valid register address.

<img width="653" height="123" alt="Screenshot 2026-09-28 at 11 21 04 PM" src="https://github.com/user-attachments/assets/bf296dda-9168-4ecd-91cd-e056c6aaf971" />

Remember to do two Transmits!

Now we can write the readRawAccel function. This function will read the registers that actually contain the acceleration data. These are specified on pages 44 and 45 of the datasheet.

<img width="1104" height="252" alt="Screenshot 2026-09-28 at 11 21 29 PM" src="https://github.com/user-attachments/assets/89ac88ee-6cb4-4fd4-b65a-ffcad57b4416" />

This function also gets slightly involved. The two main reasons are that the there are six associated registers comprising 16-bit values for each acceleration axis, and that there's a DRDY flag (data ready) that is triggered when the data is ready to read. So the first thing we do is pull the status register until that flag is RESET, then we read the data from the six registers.

In order to complete the conversion function, we once again look to the datasheet. Page 6 specifies the conversion values under the "Sensitivity" section. This conversion factor only gets us to mg (milli-gs) though, so in order to convert to m/s^2 we have to do a little bit of extra math.

<img width="1099" height="54" alt="Screenshot 2026-09-28 at 11 21 52 PM" src="https://github.com/user-attachments/assets/9dea2f40-eebf-4a4f-9788-c05375505a24" />

Since this function has no error case, it returns the converted value directly.

We're finally ready to throw everything together to create our readAccel function - the one that actually matters. The readAccel function will be the primary function used by other code from this driver, and now we have all the pieces we need to construct it.

<img width="462" height="157" alt="Screenshot 2026-09-28 at 11 22 12 PM" src="https://github.com/user-attachments/assets/84165883-95d0-4ca1-8ba3-207f593f1625" />

There we go! We should make sure this builds. For some reason the compiler is getting mad at my readRegister function `spiInput[1] = {regAddress | 0x80}` so I altered it slightly.

<img width="677" height="195" alt="Screenshot 2026-09-28 at 11 23 36 PM" src="https://github.com/user-attachments/assets/e3148284-32f1-4983-8cf0-a8affedc817d" />

idk why it got upset though. We should probably also tie this in to the main file and function.

<img width="502" height="739" alt="Screenshot 2026-09-28 at 11 24 07 PM" src="https://github.com/user-attachments/assets/15cf5e28-ca8c-4f85-8921-a7a7fa55e70a" />

We gotta rename the main.c to main.cpp for it to work, because we just made a C++ class.

Then I've just removed the readRegister function from before as well as the MX_SPI2_Init function. And I've rewritten the main function to this:

<img width="619" height="710" alt="Screenshot 2026-09-28 at 11 24 26 PM" src="https://github.com/user-attachments/assets/e378170f-d89a-4a46-bfec-bfe72a4e2974" />

Actually it makes sense to move the `HAL_GPIO_WritePin(GPIOA, GPIO_PIN_11, GPIO_PIN_SET)` call to inside `Sensor_Driver::init()`. So I will also do that.

<img width="826" height="782" alt="Screenshot 2026-09-28 at 11 24 47 PM" src="https://github.com/user-attachments/assets/a45160b3-3519-4425-b710-2236d6829970" />

Now we can actually try running this to see if it works.

I've run the debugger once again and put a breakpoint on the readAccel function:

<img width="897" height="581" alt="Screenshot 2026-09-28 at 11 25 33 PM" src="https://github.com/user-attachments/assets/67d256fa-71af-4034-a85b-6e1f1b79437f" />

And a simple way to test the functionality is just by using the "Resume" button and shaking the sensor in real time while you do this. The result of the "accel" variable in the variables tab should be changing. And if you don't move the sensor, the values should be at or around zero. It's not the best method of testing, but without the interface tools of the UFC codebase we are limited in what tools we have.

Another way of doing tests is by using the Saleae to see if the spi lines are acting correctly.

<img width="1103" height="567" alt="Screenshot 2026-09-28 at 11 25 11 PM" src="https://github.com/user-attachments/assets/3ea1d2b2-d1e8-42ba-a23e-ae2ae93cc243" />

<img width="1106" height="570" alt="Screenshot 2026-09-28 at 11 26 03 PM" src="https://github.com/user-attachments/assets/e9432333-5ae2-4ad0-997d-3e8fab91335a" />

<hr>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-5/" class="btn btn-outline">&#10094; Previous: Challenge 5</a>
  <a href="/avionics-docs/docs/tutorials/firmware/challenges/challenge-7/" class="btn btn-primary">Next: Challenge 7 &#10095;</a>
</div>