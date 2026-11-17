---
title: "FormD T1"
description: "My main PC, in a 10-liter CNC-machined aluminium case that most people don't recognise as a computer. Four versions so far."
date: "2025-03-14"
tags:
  - sff
  - hardware
  - pc-build
type: irl
image: "/images/posts/sff-pc-build/desk-wide.jpg"
status: "v4 ㆍ in use"
draft: false
versions:
  - name: "V1, moving in"
    line: "The old PC rehomed: the CPU, RAM, storage and an EVGA RTX 2070 moved in. Stock-style cables, a Thermalright AXP90-X47, no lights."
    image: "/images/posts/sff-pc-build/v1-inside-1.jpg"
    imageAlt: "The first build with the RTX 2070, seen from the front"
  - name: "V2, the GPU swap"
    line: "An Asus Prime Radeon RX 9070 XT OC, 2.5 slots, on an offset spacer that leaves room to route cables through the gap."
    image: "/images/posts/sff-pc-build/v2-gpu-spacer.jpg"
    imageAlt: "The Radeon card seen from the top, with the offset spacer and the cables running through the gap"
  - name: "V3, Noctua colours"
    line: "Custom White and Coffee cables by Ray from DreamBigByRay for the Corsair SF1000, and a Noctua NF-A9x14 on the CPU cooler."
    image: "/images/posts/sff-pc-build/v3-cables-bottom.jpg"
    imageAlt: "The custom Noctua-colored cables and the CPU fan inside the open case"
  - name: "V4, lights and the travel kit"
    line: "Two Corsair LS340 strips in pale indigo, as the power indicator the case was missing, and FormD's GPU Travel Kit, five months in the making."
    image: "/images/posts/sff-pc-build/v4-lights-1.jpg"
    imageAlt: "The T1 in a dark room with the pale indigo strip lit"
---

The T1 is my main PC, and the thing on my desk people keep asking about. How it got here, from a four-month wait for a restock to a GPU bracket made to measure, is in [the build story](/posts/sff-pc-build). This page keeps its current state.

## Current state

It's done, in the sense that it does everything I need. The CPU, a 7700X, runs between 85 and 92°C under load. That's hot, but Ryzen 7000 chips are built to boost until they reach about 95°C, and nothing throttles. The fan curve below explains that range. A bigger cooler would bring it down, but I don't see a reason to spend money on something that already works. I don't know yet what would justify that upgrade, so for now it stays.

The fan curves took some sorting out. Out of the box, before I'd configured anything, the T1 was impressively silent at idle, almost unsettling. Then it would ramp up loud the moment it hit any real load. In FanControl I set the two exhaust fans flat at 65%, which is roughly 1,300 RPM. The CPU and GPU fans keep a curve, and I set it so the burst comes late. The CPU fan stays at 40% until about 80°C, then climbs to 60% at 86°C and 90% at 91°C. The GPU fan stays at about 36% until 57°C, then reaches 60% at 79°C and 90% at 89°C. That's why the CPU sits between 85 and 92°C: the fan only really spins up once it gets there. I lose a bit of idle silence, but I'm no longer startled every time a game loads.

## Parts

::pc-parts
::

## Next

Even at 9.95 liters it takes more desk space than I expected, so I've been thinking about mounting it under the desk to free up room. I haven't done it yet, since I don't have the gear I'd be making room for. I also still need to figure out what hanging it under there would do to the top exhaust.
