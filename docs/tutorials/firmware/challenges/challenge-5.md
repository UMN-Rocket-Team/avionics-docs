---
layout: default
title: "Challenge 5: Sensor Driver"
parent: Challenges
grand_parent: Firmware
nav_order: 1
permalink: /docs/tutorials/firmware/challenges/challenge-5/
---

# Challenge 5: Sensor Driver

The sensor driver is the ultimate goal of these challenges. Drivers like these are used all across the UFC for communicating with a myriad of different peripheral devices.

#### What you'll need

- Software: STM32CubeIDE, Logic 2 (Saleae)
- Hardware: Breadboard setup from Challenge 4

Drivers make use of [classes in C++](https://www.w3schools.com/cpp/cpp_classes.asp). A class encapsulates the functionality of a driver into a package that can be easily used by other parts of the code. It's good when doing high-level design to always think about what the express purpose of your code is. In the case of a sensor driver there is a very clear purpose: Get the data from the sensor. The sensor produces data, we want to extract that data, and the driver is what we use to do it.

So let's start by creating the class. We'll do it in a new file.

![Challenge5-1](/assets/images/firmware/challenge5-1.png)

We're going to create what's called a "Header file". This is a C/C++ convention that declares classes and functions.

![Challenge5-2](/assets/images/firmware/challenge5-2.png)

The UFC codebase generally uses a separate file to declare each class, and the name of the file is the name of the class declared within. So for this file we'll call it Sensor_Driver.h and put a class called Sensor_Driver in it.

At the top of the file, we put #includes to other files that we'll be using. In this case we need the "stm32l4xx_hal.h" file, which is where those HAL_SPI functions come from.

![Challenge5-3](/assets/images/firmware/challenge5-3.png)

The STM IDE also automatically generates this include guard, this #ifndef statement at the top ensures that this file can't be #included twice in a file.

The next thing that we generally do is put a bunch of macros for addresses we use in the class. I've gathered the relevant ones from page 33 of the [datasheet](https://www.mouser.com/datasheet/2/389/lis2dw12-1849760.pdf)

![Challenge5-4](/assets/images/firmware/challenge5-4.png)

Now we can define our class. I'm actually going to use a "struct" instead of a class, but they do the same thing in C++. The reason I use a struct is because everything in a struct is public, whereas everything in a class is private. I like things to be public so that I can access all the fields (class variables) and methods (class functions) from anywhere else in the code.

![Challenge5-5](/assets/images/firmware/challenge5-5.png)

The header file is a place to map out the skeleton of the class, not to actually write the code for it. This is because in order for the binary to be linked correctly after being compiled, there can only exist one instance of the code to avoid namespace collisions. But the #ifndef guard was supposed to already take care of that! Well it only works for #including the file multiple times **within one file**. So when the compiler goes to compile ALL of the source files, if you have a #include "Sensor_Driver.h" in multiple source files then the include guard won't work as you expect. The linker will get mad at you for multiple definitions. This is a little bit annoying but we have to deal with it, so headers are reserved for _declarations_ not definitions.

With that said, we now need to determine what kinds of fields and methods to declare in this class. This is subject to the designer of the class, but given our ultimate goal (reading data from the sensor), I would say we don't actually need any fields. The only thing that we _really need_ is a single function that "gets the data from the sensor". But there are multiple steps to that process. The first two functions I'll declare will be almost universal to all classes in the UFC, these are the init and deinit functions for the class.

![Challenge5-6](/assets/images/firmware/challenge5-6.png)

The init and deinit functions are for doing the business that's done in the MX_SPI2_Init function (and Deinit, if it existed) in the main.c file. We move that code to the relevant class to keep things organised. Now we can define what I call the _interface_ methods.

![Challenge5-7](/assets/images/firmware/challenge5-7.png)

There is just the one readAccel function. This function just reads the acceleration value from the sensors and outputs the data into three floats (passed in). I also specify that the output will be in m/s^2.

But in order to just "get the data from the sensor", we have a number of steps we'll go through. That's where the third category of methods come in, the _internal_ methods.

![Challenge5-8](/assets/images/firmware/challenge5-8.png)

These internal methods outline the steps for getting the data from the sensor. We need to read the raw data, which requires reading from registers on the sensor. Then convert the raw uint16 data into m/s^2. The writeRegister will be used in the init() function to configure the sensor with certain parameters.

The last thing I like to do is includes a global instance of the driver, so that any file that #includes this sensor driver will have access to one. Because there isn't really a need to make multiple drivers.

![Challenge5-9](/assets/images/firmware/challenge5-9.png)

In order to prevent this instance of the class from being defined multiple times, we define it as "extern", which _declares_ it rather than instantiates/defines it. We'll create the real instance in the source file, which we can finally start!

![Challenge5-10](/assets/images/firmware/challenge5-10.png)

So I've created Sensor_Driver.cpp and filled it with definitions of all those methods we declared in the header. Now we just need to put in the code, and luckily, we have already written some of it!

We can repurpose this MX_SPI2_Init function from main.c to be our driver's init function. So I'll just copy and paste it in.

![Challenge5-11](/assets/images/firmware/challenge5-11.png)

Ahh, I've just realised. The hspi2 which was previous defined as a global at the top of the main.c file is not accessible to our source file here. So I suppose there is a reason to have a field in this class. We can go back to the header and define it.

![Challenge5-12](/assets/images/firmware/challenge5-12.png)

![Challenge5-13](/assets/images/firmware/challenge5-13.png)

The other thing we don't have access to is this Error_Handler() function, which runs if the HAL_SPI_Init function fails. In the real UFC codebase, we have a UFC_ECODE type (UFC Error Code) that is used to indicate failures like this, but since this driver is in a separate project, I'll just remove the check for now.

![Challenge5-14](/assets/images/firmware/challenge5-14.png)

There are also a few other things we want to do in the initialisation sequence that have to do with the sensor itself. This is where it really helps to comb through the datasheet. Luckily someone else has already done that work for us, but when it comes to making new drivers this is something that you'll just have to figure out. We'll be changing the values of CTRL registers on the sensor, specifically CTRL2, CTRL1, CTRL3, and CTRL6. The relevant page numbers on the datasheet are 38, 36, 39, and 42.

![Challenge5-15](/assets/images/firmware/challenge5-15.png)

Yeah this code is a little complex. But for the most part it is just a series of writeRegister commands to enable different settings on the sensor. There is that loop section, which keeps track of the "boot process" status. We enable the "boot bit" in CTRL2 (the most significant bit) and wait for the boot process to be complete (which is indicated by the boot bit being set back to 0). So that's what the loop does. We also have a maximum read attempts of 10000 to avoid getting into an endless loop. It's important to have timeout cases for any looping code, because we never want to get stuck in an endless loop as it will essentially crash the entire flight computer. I'd encourage you to read more about these configuration settings in the datasheet of the sensor.

The deinit function is much simpler. We just disable the SPI2 clock, deinit SPI, and deinitialise all the pins with HAL_GPIO_DeInit.

![Challenge5-16](/assets/images/firmware/challenge5-16.png)

I think next we'll focus on the read and write register functions. We have already written a readRegister function in the main.c file, so we just have to port it over and modify it slightly.

![Challenge5-17](/assets/images/firmware/challenge5-17.png)

The reason we don't simply return the output is because in the real codebase we return a UFC_ECODE, so I leave it as void in this example to better match that.

Then, the write register sequence is very similar. Page 31 of the datasheet says that the MSB must be a zero, which it already will always be in the case of a valid register address.

![Challenge5-18](/assets/images/firmware/challenge5-18.png)

Remember to do two Transmits!

Now we can write the readRawAccel function. This function will read the registers that actually contain the acceleration data. These are specified on pages 44 and 45 of the datasheet.

![Challenge5-19](/assets/images/firmware/challenge5-19.png)

This function also gets slightly involved. The two main reasons are that the there are six associated registers comprising 16-bit values for each acceleration axis, and that there's a DRDY flag (data ready) that is triggered when the data is ready to read. So the first thing we do is pull the status register until that flag is RESET, then we read the data from the six registers.

In order to complete the conversion function, we once again look to the datasheet. Page 6 specifies the conversion values under the "Sensitivity" section. This conversion factor only gets us to mg (milli-gs) though, so in order to convert to m/s^2 we have to do a little bit of extra math.

![Challenge5-20](/assets/images/firmware/challenge5-20.png)

Since this function has no error case, it returns the converted value directly.

We're finally ready to throw everything together to create our readAccel function - the one that actually matters. The readAccel function will be the primary function used by other code from this driver, and now we have all the pieces we need to construct it.

![Challenge5-21](/assets/images/firmware/challenge5-21.png)

There we go! We should make sure this builds. For some reason the compiler is getting mad at my readRegister function spiInput[1] = {regAddress | 0x80} so I altered it slightly.

![Challenge5-22](/assets/images/firmware/challenge5-22.png)

idk why it got upset though. We should probably also tie this in to the main file and function.

![Challenge5-23](/assets/images/firmware/challenge5-23.png)

We gotta rename the main.c to main.cpp for it to work, because we just made a C++ class.

Then I've just removed the readRegister function from before as well as the MX_SPI2_Init function. And I've rewritten the main function to this:

![Challenge5-24](/assets/images/firmware/challenge5-24.png)

Actually it makes sense to move this HAL_GPIO_WritePin(GPIOA, GPIO_PIN_11, GPIO_PIN_SET) call to inside the Sensor_Driver::init() function. So I will also do that.

![Challenge5-25](/assets/images/firmware/challenge5-25.png)

Now we can actually try running this to see if it works.

I've run the debugger once again and put a breakpoint on the readAccel function:

![Challenge5-26](/assets/images/firmware/challenge5-26.png)

And a simple way to test the functionality is just by using the "Resume" button and shaking the sensor in real time while you do this. The result of the "accel" variable in the variables tab should be changing. And if you don't move the sensor, the values should be at or around zero. It's not the best method of testing, but without the interface tools of the UFC codebase we are limited in what tools we have.

Another way of doing tests is by using the saleae to see if the spi lines are acting correctly.

![Challenge5-27](/assets/images/firmware/challenge5-27.png)

![Challenge5-28](/assets/images/firmware/challenge5-28.png)

<hr>

<div style="display: flex; justify-content: space-between; margin-top: 2rem;">
  <a href="/docs/tutorials/firmware/challenges/challenge-4/" class="btn btn-outline">&#10094; Previous: Challenge 4</a>
  <a href="/docs/tutorials/firmware/challenges/challenge-6/" class="btn btn-primary">Next: Challenge 6 &#10095;</a>
</div>