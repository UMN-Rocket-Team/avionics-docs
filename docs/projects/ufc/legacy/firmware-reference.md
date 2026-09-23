---
layout: default
title: UFC2 Firmware Reference
parent: Legacy (UFC2)
grand_parent: Universal Flight Computer
nav_order: 1
permalink: /docs/projects/ufc/legacy/firmware-reference/
---

# UFC2 Firmware Reference
{: .no_toc }

The node-based firmware architecture from the Host/Sensor/Radio-card UFC.
{: .fs-5 .fw-300 }

{: .check }
This describes the 2023–24 firmware (Host Card, SPI backplane, Sensor and Radio cards). The current firmware is
described on the [Firmware]({{ '/docs/projects/ufc/firmware/' | relative_url }}) page. Some of these pieces, like
the data structures, may still exist in UFC_Core; check the code before assuming either way.

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Overview

The code had three key parts:

1. **Modular nodes**
2. **Node managers**
3. **Flight and readout modes**

### Modular nodes

The hardware was made of modular PCBs, and each card's firmware was made of modular **node** classes, which made
testing, upgrading, and extending easier. Each node does one job: writing data to the flash chip, running a Kalman
filter, talking to another card, talking to a radio, reading sensors, or reading the pitot tube. Whatever the job,
every node inherits from the same interface, which declares functions for cleaning, initialising, resetting,
acting, and sending and receiving packets.

### Node managers

A node manager object runs the nodes on a card. At startup, the card's nodes are registered with the manager;
changing which nodes are registered changes what the card can do. The manager then calls each node's init
function, routes packets between nodes, cleans out old data, and tells each node when to do its job.

### Flight and readout modes

The UFC ran in one of two modes:

- **Flight mode** collects, stores, processes, and transmits telemetry. This is the default.
- **Readout mode** re-transmits stored data and can erase the connected storage.

To start in readout mode, you flip a switch on the Host Card's DIP switch before powering up. Starting any action in
readout mode also takes a DIP switch. There's no way to change modes without power-cycling. That makes it very hard
for the UFC to run a readout function in flight, which would be a disaster.

Each mode is just a different set of nodes registered with the node manager. Only the Host Card had configurations
for both modes; the other cards only had flight mode.

## Interfaces

Interfaces are used all over the code, for two reasons:

1. **They separate hardware-dependent code from hardware-independent code**, so more code can be reused across
   different hardware. Hardware-independent code that needs peripherals or timers takes pointers to interfaces, and
   through polymorphism it can be handed a hardware-specific implementation without ever including it.
2. **Tests written against an interface run on every implementation of it**, which means fewer tests while still
   making sure all implementations behave the same.

### Init interface (InitIF)

```cpp
class InitIF {
public:
    bool isInitialized = false;
    virtual UFC_ECODE init() = 0;
    virtual UFC_ECODE deInit() = 0;
};
```

Inherited by classes that configure peripherals or hardware, or that own objects that do.

When a card starts up, two things happen before any peripheral configuration: every pin is put into a default
state, and `HAL_Init()` (from ST's HAL library) is called. Only after that should the card configure
peripherals, which usually means using the HAL. Configuring before the pins are in default states can cause
strange behaviour, and using the HAL before it's initialised causes run-time errors.

So all peripheral and hardware configuration goes in `init()` functions, which run after both of those steps.
`isInitialized` is set to true by `init()`. While it's false, every function other than `init()` returns an
ECODE saying the configuration is bad, which forces developers to call `init()` first. `deInit()` just undoes
`init()`; it's mainly used in test suites to reset hardware between tests.

**Use:**
- Make sure `init()` calls `init()` on every object the class holds.
- Make sure `init()` sets `isInitialized` correctly.
- Make sure all hardware configuration happens inside `init()`.

### Node interface (NodeIF)

Every node inherits `NodeIF`, which declares the functions the node manager uses. `NodeIF` inherits from `InitIF`.

Nodes are very flexible, so what follows describes most nodes but isn't a rule. Typically a node has two data
structures: one for packets coming in from other nodes (the **Receiver**) and one for packets going out to other
nodes (the **Sender**). Packets never move from the Receiver to the Sender, so nodes never forward packets they've
received. The names are from the point of view of *other nodes*. For a hypothetical RadioNode, packets from other
nodes go in the Receiver, and packets that arrive over the radio go in the Sender, to be passed on to other nodes.

In practice the Sender was always a `BufferManager` and the Receiver was always a `PacketQue`.

| Function | What it does |
|:--|:--|
| `UFC_ECODE putInReceiver(PacketHandle &pkt)` | Depends on the node. With a `PacketQue` Receiver, makes a child `PacketHandle` from `pkt` and puts it in the Receiver. With a `BufferManager` Receiver, copies the packet into the Receiver. A node that doesn't receive packets does nothing and returns `UFC_ECODE_FAIL`. |
| `PacketHandle *IterateSender(UFC_ECODE *ecode)` | Steps once through the Sender and returns a pointer to the next packet's `PacketHandle`, if there is one. At the end, sets the ECODE to `UFC_ECODE_FAIL \| UFC_ECODE_FULL`. |
| `UFC_ECODE Act(void)` | The node's own job. Called from the card's main loop by the node manager. |
| `UFC_ECODE Clean(void)` | Removes invalid, unused, and (if enabled) expired packets from the Sender. Called from the main loop by the node manager. |
| `UFC_ECODE init(void)` | Initialises the node during the card's init phase: calls `init()` on every member, makes sure the node's hardware is set up, and clears the `isInitialized` lock. |
| `UFC_ECODE deInit(void)` | The reverse: calls `deInit()` on every member, releases the hardware, and sets the lock again. |

**Use:**
- On a peripheral card, communication from the Host can cause an interrupt at any time. Account for that,
  especially if the node owns the data structures that host communication reads from or writes to.
- `Act()`, `init()`, and `deInit()` are the only pure virtual functions in `NodeIF`. The rest have default
  implementations that work for most nodes.

### I2C interface (I2cIF)

I2C was used on the Radio Card for the GPS and on the Sensor Card for the IMU and barometer/thermometer. The
interface keeps classes that use I2C hardware-independent. Besides the usual `init()`, TX, and RX functions, it has
`checkDevice()`, which polls the device until it responds, so the system waits for devices that are slow to power up.

**Use:**
- Classes that use I2C should take an I2C object (inheriting from `I2cIF`) in their constructor.
- The class's `init()` should call the I2C object's `init()`, `delay()` for the device's power-on time (from its
  datasheet), then call `checkDevice()` to make sure the device responds.
- *(STM specific)* The HAL I2C functions need the device address shifted left by 1.
- *(STM specific)* Generate the I2C timing value with a test project and an IOC file. Working it out by hand is not fun.
- Pins and ports for sensors are defined in each project's `<card>_settings.h`. Use them!

**Implementation:** `I2c_Stm32l4xx`, the peripheral cards' I2C driver, used for the GPS, BNO055, and barometer/thermometer.

### SPI interfaces

SPI was used heavily, and the interfaces keep classes that use it hardware-independent. SPI and I2C were the only
peripherals with interfaces: UART and QSPI were each only used on one card, and there wasn't a good reason to
write an interface until several cards used a protocol.

| Interface | Inherits | Adds |
|:--|:--|:--|
| `SpiIF` | `InitIF` | Basic SPI TX/RX, with optional custom callbacks |
| `SpiPeripheralIF` | `SpiIF` | Set, reset, enable, disable, and clear overflow errors from an SPI RX ISR. Implemented by every peripheral card to talk to the Host Card. |
| `SpiControllerIF` | `SpiIF` | The counterpart to `SpiPeripheralIF`. Switches between manual and automatic chip select, and controls it by hand. Assumes one device on the other end. |
| `MultiSpiIF` | `SpiIF` | Multi-device version of `SpiControllerIF`: selects and deselects up to eight chip selects. Used on the Host Card to talk to the peripheral cards, and on the Sensor Card for all its SPI sensors. |

`MultiSpiIF` is the interface; `MultiSpi` is an implementation of it.

### Data structure interfaces

| Interface | Provides |
|:--|:--|
| `TxDataStructureIF` | For structures that send packets: `peep()`, `pop()`, `isEmpty()`. `peep()` returns an item, but `pop()` doesn't return what it popped: once something is popped, its space is free and could be overwritten at any moment. |
| `RxDataStructureIF` | For structures that receive packets: `push()`, `isFull()`. |
| `DataStructureIF` | Both of the above, plus functions for the routing system and a settings struct. |

The settings struct controls packet expiry, and whether newer packets can overwrite old ones when there isn't
room. Overwriting old data means the newest data gets through as soon as possible.

```cpp
typedef struct { //!< The settings struct for all DataStructureIF children
    uint64_t expireDuration = 0;    //!< Time before packets are marked as expired.
    bool allowPktExpiration = true; //!< If the data structure cares about expiration
    bool allowPktOverwrite = true;  //!< If the data structure will remove old data in order to write new data
} ds_settings_t;
```

```cpp
class DataStructureIF : public TxDataStructureIF, public RxDataStructureIF {
public:
    uint16_t iteratorIndex = 0;
    ds_settings_t settings;

    // Resets the iterator to the beginning of the structure.
    virtual void resetIterator(void) = 0;

    // Iterates and gets the next packet.
    // Returns a valid PacketHandle pointer, if the operation succeeded.
    virtual PacketHandle* Iterate(UFC_ECODE* ecode) = 0;

    // Getter for the iteratorIndex field.
    virtual uint16_t getIteratorIndex(void) = 0;

    // Cleans the data structure of expired, unused, and invalid packets.
    UFC_ECODE CleanStructure(void);

    UFC_ECODE setExpireDuration(uint64_t duration);
    uint64_t getExpireDuration(void);
    UFC_ECODE setAllowPktExpiration(bool permission);
    bool getAllowPktExpiration(void);
    UFC_ECODE setAllowPktOverwrite(bool permission);
    bool getAllowPktOverwrite(void);

    // Resets the entire data structure.
    virtual UFC_ECODE ResetStructure(void) = 0;
};
```

## Data structures

### PacketHandle

Basically a pointer to a packet header, plus fields for routing, cleaning old data, and checking the pointer still
points at a valid packet.

```cpp
typedef struct PacketHandle {
    pktHeader_t* address;  //!< Address of the packet this handle is associated with.
    uint64_t timestamp;    //!< The timestamp of the packet.
    PacketHandle* parent;  //!< A pointer to the parent, if it exists
    uint16_t length;       //!< The length of the packet.
    int16_t link_count;    //!< Number of children this PacketHandle has

    PacketHandle() {       // Default constructor
        link_count = -1;   //!< -1 = not routed yet
        parent = 0;        //!< 0 = no parent
        address = 0;       //!< 0 = not pointing to a packet
        length = 0;
        timestamp = 0;
    }
} PacketHandle;
```

`timestamp` and `length` are copies of fields that are already in the packet. If they stop matching the packet,
the packet has been overwritten and the handle is no longer valid.

**Parents and children.** Handles can have a parent-child relationship. A child points to its parent in `parent`;
a parent counts its children in `link_count`. Apart from those two fields, parent and child are identical and
point to the same packet. Children never have children of their own.

**`link_count`** starts at −1, meaning "not routed yet". The first child makes it 1, and each new child adds 1.
When a child is deleted or overwritten, it takes 1 off its parent's count. A count of 0 means the handle had
children and they've all gone, so the cleaning system can remove it.

### PacketQue

Inherits `DataStructureIF`. A FIFO circular buffer of `PacketHandle`s. The name comes from the early days of the
UFC and stuck.

When `pop()` removes a handle that has a parent, it decrements the parent's `link_count`. Since popped space is
immediately free to reuse, the parent's count has to reflect that it has one less child right away.

### BufferManager

Inherits `DataStructureIF`. Owns a FIFO circular buffer of the packets themselves, plus a private `PacketQue` that
tracks where each packet is in the buffer.

It can also write packets in pieces (for example, a packet coming from another card over several SPI
transactions) and undo a partial write if a packet was written wrong or can't be finished. It has a lot of code
for spotting bad packets and errors and handling them gracefully, and it's reentrant: it copes with an interrupt
using it while it's already in use.

### PacketSwitcher

Inherits `TxDataStructureIF`. A pair of packets and a flag saying which is which. The **active** packet is being
written; the **full** one is ready to use. When the active packet is finished, they swap.

## Running a card

The node manager class is called `UFC`:

```cpp
class UFC {
public:
    std::vector<NodeIF*> NodeMaster; //!< pointers to all the Nodes
    PacketRouter Router;             //!< Packet router object
    uint8_t currentNode;             //!< Index of node currently being operated

    UFC(void);                        // Constructs the Router and sets currentNode to 0
    UFC_ECODE InitAll(void);          // Calls init() on every node
    UFC_ECODE DoActions(void);        // Runs every node's Act(), in registration order
    UFC_ECODE RouteAll(void);         // Routes all pending packets (calls PacketRouter::RouteAll())
    UFC_ECODE CleanBuffers(void);     // Removes unused/invalid (and, per node, expired) data

    // Register a node. Nodes should be dynamically cast to NodeIF*.
    // Returns the node's handle/ID, or -1 if unsuccessful.
    RtrEndpointHandle RegisterNode(NodeIF *node);

    // Route packets of `type` to `dst`. Call several times to add more destinations.
    UFC_ECODE RegisterPacket(uint16_t type, NodeHandle dst);

    UFC_ECODE Run();                  // Runs the UFC. Loops forever.
};

extern UFC myUFC; //!< Global UFC instance. THIS is the UFC!
```

A card runs in three phases:

1. **Setup.** `main` puts every pin in its default state and calls `HAL_Init()`. Data structures, nodes, drivers,
   and peripherals are constructed but not initialised. On the Host Card, the mode switch is read and that mode's
   node configuration is loaded. Finally, nodes and the packets they want are registered with `myUFC` using
   `RegisterNode()` and `RegisterPacket()`.
2. **Initialisation.** `myUFC.InitAll()` calls `init()` on everything, configuring and starting every peripheral.
3. **Running.** `myUFC.Run()` loops forever:

```cpp
UFC_ECODE Run(void) {
    UFC_ECODE e = UFC_ECODE_OK;
    while (!isERROR(e)) {
        while (!checkIfUfcMainLoopTimerElapsed());
        clearUfcMainLoopTimer();

        e = DoActions();          // do node-specific actions
        myLEDs.set_LED_ECODE(e);

        e = RouteAll();           // route data between nodes
        myLEDs.set_LED_ECODE(e);

        e = CleanBuffers();       // clean nodes
        myLEDs.set_LED_ECODE(e);
    }
    return e;
}
```

## Packet routing

`PacketRouter` registers nodes with the routing system, records where each packet type should go, and routes
packets between all registered nodes.

It tracks destinations with a list of `uint32_t` values called `NodeLookup`. Each entry is one packet type, and
each bit is one node: 1 if that packet type should go to that node.

Two functions, called by the manager during setup, fill this in:

- **`RegisterEndpoint()`** adds a node to the router's list so it's used as a source and destination in
  `RouteAll()`, and gives it a bit.
- **`RegisterPacketEndpoint()`** takes a node and a packet type, finds that type's entry in `NodeLookup`, and sets
  the node's bit.

`RouteAll()`, called by the manager, does this:

```text
for each node n in the endpoint list:
    for each packet p in n's Sender:
        for each node m in the endpoint list, where m != n:
            if NodeLookup says p's type should go to m:
                m.putInReceiver(p)
```

It's called routing rather than copying or moving because the packet isn't copied: the destination gets a
`PacketHandle` pointer, which saves CPU time and memory. The destination can then either store a child of that
handle in its Receiver and use it to reach the packet, or copy the packet into its Receiver. Which one happens
depends on the node's `putInReceiver()` and the type of its Receiver.

## Packet cleaning

The cleaning system clears out invalid, expired, and unused packets to make room for new ones.

**Expired** is easy: compare the packet's timestamp with the current time and the expiry duration.

**Invalid** means any of these:
- The handle's `address` is zero.
- The handle's `timestamp` or `length` doesn't match the packet header.
- The handle has both children and a parent. That means a handle from a Receiver was routed as if it were in a
  Sender, which shouldn't happen.
- The handle has a parent, and `address`, `timestamp`, or `length` don't match the parent's.
- The handle has a parent whose `link_count` is less than 1 (the parent thinks it has no children).
- The handle has a parent that's invalid for any of the reasons above.

**Unused** is trickier and relies on `link_count` and `parent`. With a `BufferManager` Sender and a `PacketQue`
Receiver (which every node had):

1. When the router calls `putInReceiver()`, the node makes a child of the handle, bumps the parent's `link_count`,
   and puts the child in its `PacketQue`.
2. When the node is done with the packet, it pops it. `PacketQue::pop()` sees the parent and decrements its
   `link_count`.
3. When a handle in a Sender reaches `link_count` 0, nothing else on the card is using that packet, so it can be removed.

## Node list

### Host Card

**CardNode.** Handles communication between the Host Card and one peripheral card; the Host makes one per
peripheral. Its constructor takes a pointer to a `MultiSpiIF`, which on the Host is set up to use the COB SPI.
During setup a single `MultiSpi` object is created and shared by every CardNode. The constructor also takes the
slot number of its card, which it passes to the `MultiSpi` select/deselect functions to talk to the right card.

In `init()`, a CardNode keeps trying a status exchange with its card to confirm the card is up. The number of
attempts and the delay between them are set when the node is created. If the card doesn't respond in time, the
CardNode's status is set to `UFC_ECODE_FAIL`. `init()` also resets the node's data structures and calls `init()`
on the `MultiSpi`.

**Data Storage Node.** Receives every packet and writes it to the SD card and the flash chip, using the HAL
Quad-SPI driver for the flash and a `SpiController` driver for the SD card.

**KalmanNode.** Runs a linear Kalman filter on data from the Sensor Card and produces Kalman packets.

**DataReadoutNode.** Reads the flash chip with the HAL Quad-SPI driver and sends it out on the backplane over the
COB SPI, where WINGS reads it through a debugging board.

### Sensor Card

**Sensor Node.** Uses the HAL I2C driver for the temperature sensor, barometer, and IMU, and a `MultiSpi` for
every other sensor. Sensor data goes into a packet in a `PacketSwitcher`, and those packets are sent to the Host Card.

### Radio Card

**Radio Node.** Its `Act()` does nothing.

The old reference also had empty placeholders for the RFD, LoRa, and GPS nodes, the Pitot node, the LED codes
(startup in flight, readout, and debug modes), and the flight/readout mode diagrams. None of those were ever
written.
