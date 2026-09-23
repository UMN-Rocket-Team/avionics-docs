---
layout: default
title: Error Codes
parent: Firmware
grand_parent: Universal Flight Computer
nav_order: 5
permalink: /docs/projects/ufc/firmware/error-codes/
---

# Error Codes (ECODEs)
{: .no_toc }

Most UFC functions return a `UFC_ECODE`: a bitfield where each bit is one basic error code, so several can
be combined into one return value.
{: .fs-5 .fw-300 }

The definitions live in [`UFC_Core/errors.h`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/Firmware/UFC_Core/errors.h).
If this page and the file disagree, the file wins.

## Example

A function that fails because something was set up wrong returns `0x41`: `UFC_ECODE_FAIL` (`0x01`) combined
with `UFC_ECODE_CONFIG` (`0x40`).

## Core codes

Every ECODE contains exactly one of these. They say whether the action worked overall.

| Code | Value | Meaning |
|:--|:--|:--|
| `UFC_ECODE_OK` | `0x00` | It worked. |
| `UFC_ECODE_WARN` | `0x02` | There was an issue, but one we expected or dealt with. A kind of OK. |
| `UFC_ECODE_FAIL` | `0x01` | It failed. |
| `UFC_ECODE_ERROR` | `0x03` | Complete failure. A more serious kind of FAIL (it includes the FAIL bit). |

## Informational codes

Combine these with a core code to say where the problem came from.

| Code | Value | Meaning |
|:--|:--|:--|
| `UFC_ECODE_EMPTY` | `0x08` | Something the function used was empty. |
| `UFC_ECODE_FULL` | `0x10` | Something the function used was full. |
| `UFC_ECODE_EXPIRED` | `0x20` | Something is or was expired. |
| `UFC_ECODE_CONFIG` | `0x40` | Configuration problem, meaning a developer needs to go back and check that things are called in the right order and set up correctly. Usually returned with `UFC_ECODE_ERROR`, since config problems can't be fixed without reprogramming. |
| `UFC_ECODE_INVALID` | `0x80` | A field or object is invalid and should be thrown away. Used for packets that are invalid or have been overwritten. |

Bit `0x04` isn't used by any of the codes listed here.

## Decoding by hand

| Bit | Value | Set means |
|--:|:--|:--|
| 0 | `0x01` | FAIL (ERROR if bit 1 is also set) |
| 1 | `0x02` | WARN (ERROR if bit 0 is also set) |
| 3 | `0x08` | EMPTY |
| 4 | `0x10` | FULL |
| 5 | `0x20` | EXPIRED |
| 6 | `0x40` | CONFIG |
| 7 | `0x80` | INVALID |

## Checking codes in code

`errors.h` has one helper per basic code, named `is<NAME>`, which tests for `UFC_ECODE_<NAME>`. For example,
`isFAIL(e)` is true if `e` contains `UFC_ECODE_FAIL`.

The exception is `isOK(e)`: it checks that none of the *other* core codes (like `UFC_ECODE_FAIL`) are present.
