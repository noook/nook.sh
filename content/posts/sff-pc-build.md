---
title: "Building a computer that doesn't look like one"
description: "How a 10-liter FormD T1 became my main PC, from a four-month wait for a restock to custom cables and a GPU bracket that took five months to get right."
date: "2026-11-13"
tags:
  - sff
  - hardware
  - pc-build
draft: false
---

I built my current PC at 26, and the whole project was more about identity than performance. I never liked RGB or the "gamer" look in the first place. What pushed me was moving into a new apartment with a very different artistic direction from my old setup. I wanted the computer to blend in instead of announcing itself.

![The T1 at the left of my desk with its pale indigo light strip on](/images/posts/sff-pc-build/desk-wide.jpg)

The FormD T1 does exactly that. Most people who see it don't clock it as a computer at all. My favorite reaction is when I tell someone it's right there on the desk and they keep looking around for "the actual computer". It's 9.95 liters of CNC-machined aluminium, 13.5 × 22 × 33.5 cm, with roughly the footprint of an A4 sheet of paper.

![The T1 with its panels on, in the evening sun on the balcony](/images/posts/sff-pc-build/outside-panels-on.jpg)

I found the small form factor (SFF) world almost by accident. A [Louqe Ghost S1](https://caseend.com/data/abee/louqe-ghost-s1) ad showed up in my instagram feed, and the idea of a tiny, minimalist PC case was funny enough that I went looking. That led me to the SFF Discord community and to [a massive spreadsheet][1] that half the SFF world seems to use when comparing cases and other parts. Out of everything on it, the T1 was the one that stood out.

Getting one was its own little ordeal. FormD restocks at random moments, a handful of units at a time, and they're gone almost immediately. I watched their Discord for about four months, and several times I couldn't complete the purchase before the stock was gone. When I finally got one, I was in the middle of a class when the Shop app notified me of the restock. I was the teacher, so I asked my students to wait while I completed my T1 purchase.

## Constraints I didn't expect: the desk

The other reason for going small was more mundane. I have a rising desk, and I wanted the computer to live on it or under it, not on the floor like every tower I'd owned before. That mostly worked out. Funnily enough, even at 9.95 liters it takes more desk space than I expected, so I've been thinking about mounting it under the desk to free up room. I haven't done it yet, since I don't have the gear I'd be making room for. I also still need to figure out what hanging it under there would do to the top exhaust.

## V1: moving in

The T1 replaced an NZXT S340 Elite in black and red, so the first version was really about rehoming an old PC. The PSU, motherboard, watercooling and case fans weren't compatible with the T1, so I sold them. The CPU, RAM, storage and GPU (an EVGA RTX 2070 at the time) all made the move.

That first build had no lights, stock-style cables and a Thermalright AXP90-X47 copper cooler on the CPU. Nothing was dressed up yet, I only wanted to prove it could go together at all.

![The first build with the RTX 2070, seen from the front](/images/posts/sff-pc-build/v1-inside-1.jpg)

![The first build with the RTX 2070, seen from above](/images/posts/sff-pc-build/v1-inside-2.jpg)

Cable routing in SFF is a different discipline from a mid-tower, with no slack to hide a mistake in. If a cable isn't exactly where it should be, the case won't close, and forcing it shut isn't an option.

## V2: the GPU swap nobody could plan for

By the time I needed a new GPU, Nvidia cards were either absurdly expensive or not available at all. The RX 9070 XT had just launched as roughly AMD's answer to the 5070 and 5070 Ti at my budget, so the model was decided for me. What was left was picking the variant.

Inside a case this small, that question gets narrow fast. Of all the 9070 XT variants on the market, I could realistically fit four or five. What mattered was slot width (2.75 slots or less) and length. FormD rates GPU clearance at 140 × 325 × 65 mm, and in this case that number is a hard limit. I went with the Asus Prime Radeon RX 9070 XT OC, a 2.5-slot card.

Then I tested a few slot and spacing configurations to find the best combination, with an offset spacer between the motherboard and the GPU. The spacer decides how much room the card has to breathe. It also turned out to leave just enough space between the motherboard and the GPU to route cables through that gap instead of around it.

![The GPU side with the mesh panel on: the card is just visible behind the holes](/images/posts/sff-pc-build/outside-gpu-side-mesh.jpg)

![The Radeon card seen from the top, with the offset spacer and the cables running through the gap](/images/posts/sff-pc-build/v2-gpu-spacer.jpg)

![The open GPU side in the sun, with the card's three fans](/images/posts/sff-pc-build/outside-gpu-open.jpg)

![The same side from an angle, the CPU cooler's copper fins above the card](/images/posts/sff-pc-build/outside-gpu-open-angle.jpg)

## V3: getting rid of the last "gamer" cable

Once the GPU was sorted, I moved on to Noctua-themed PSU cables and a Noctua NF-A9x14 fan on the CPU cooler. The cables are custom, made by Ray from [DreamBigByRay][2] on Etsy, in White and Coffee, for my Corsair SF1000. Every internal cable (not the power cord) is cut to length and sleeved for this case, instead of whatever length happens to come in a kit.

Noctua's beige and brown is about as anti-RGB as it gets, which made it the obvious pick for a build whose whole point was moving away from anything that screamed "gaming PC". The color follows from the decision I made at the start.

This is also where I started to enjoy cable routing. In a case this size every cable is visible, and there's no back panel deep enough to bury a mess behind. Getting the routing both functional and clean from the bottom of the case turned out to be my favorite part of the whole project.

![The custom Noctua-colored cables and the CPU fan inside the open case](/images/posts/sff-pc-build/v3-cables-bottom.jpg)

![The open case from the side, with the Noctua CPU fan and the white and brown cables](/images/posts/sff-pc-build/v3-open-side.jpg)

## V4: lights, for a practical reason

After three versions spent avoiding anything gamer-coded, I added lights. I know how that sounds.

The reason is dumber and more practical than it looks. When the machine was idle, there was zero sign it was even on. No LED, nothing. I'd stand in front of it, unsure whether to press the power button or not. So the lights are a status indicator, the one the case was missing. I wanted it minimal, dim and configurable.

I went with two Corsair LS340 Aurora light strips wrapped around the two Noctua NF-A12x25 top exhaust fans. They run standalone, no iCUE link needed. I tried to get as close to Noctua's beige and brown as I could, but LEDs don't do beige convincingly. I landed on something in the same spirit and eventually settled on a very pale indigo for good.

![The top panel opened, with the two Noctua NF-A12x25 exhaust fans](/images/posts/sff-pc-build/outside-top-fans.jpg)

![The T1 in a dark room with the pale indigo strip lit](/images/posts/sff-pc-build/v4-lights-1.jpg)

![The T1 in a dark room, a second angle of the indigo glow](/images/posts/sff-pc-build/v4-lights-2.jpg)

Around the same time I picked up FormD's [GPU Travel Kit][3]. It's a CNC-machined, anodized bracket set that stops the GPU from sagging or flexing in transit, under its own weight plus the load from the cables and the offset. It also adds a second anchor point at the far end of the card, so the card is held on one more side than the stock mount gives you. There was an Asus Prime kit that was supposed to fit the 5070 and the 9070, but the measurements didn't match, and I was the one who reported it. I sent my measurements to FormD's shop directly. We went back and forth on a few prototypes that didn't work. They were unusable, and I threw them away. About five months after first contact, I had one that fit.

![The back of the case, with the custom GPU Travel Kit plate by the I/O panel](/images/posts/sff-pc-build/travel-kit-io.jpg)

## Where it lives now

For something called a desktop, the T1 moves around a lot. Going from the desk to the living room TV is easy. I unplug five cables at the desk (power, USB dock, Ethernet and two video cables) and plug two in at the TV (power and HDMI). The cables themselves never move. Each spot keeps its own set. On the TV it's an Xbox Elite controller and Steam Big Picture, nothing fancier.

![The living room TV, with the T1 on a stool to the right of the cabinet](/images/posts/sff-pc-build/tv-setup.jpg)

It's been further than the living room, too. I took it to my parents' place strapped into a backpack on the motorcycle, wrapped in a t-shirt. I worried about the paint more than the weight. It's also done a holiday trip in a suitcase, buried in clothes for the same reason. Both times, setting it up on the other end was trivial, which is pretty much the whole promise of small form factor.

## Current state

It's done, in the sense that it does everything I need. The CPU, a 7700X, runs between 85 and 92°C under load. That's hot, but Ryzen 7000 chips are built to boost until they reach about 95°C, and nothing throttles. The CPU fan has a curve that ramps up quickly around 90°C, to about 80% of its speed, and that keeps the temperature there. A bigger cooler would bring it down, but I don't see a reason to spend money on something that already works. I don't know yet what would justify that upgrade, so for now it stays.

The fan curves took some sorting out. Out of the box, before I'd configured anything, the T1 was impressively silent at idle, almost unsettling. Then it would ramp up loud the moment it hit any real load. In FanControl I set the two exhaust fans flat at 65%. The CPU and GPU fans keep a curve, but I set it so their RPM burst comes late. I lose a bit of idle silence, but I'm no longer startled every time a game loads.

## What stuck with me

My favorite part of this project is how meticulous the case forces me to be. Fighting the cable routing until it's both efficient and clean, working out exactly which parts fit in a volume this small: a mid-tower never asked for that kind of attention. I'd never have spent five months getting a GPU bracket made for one, either.

[1]: https://docs.google.com/spreadsheets/d/1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4/edit?gid=1824037046#gid=1824037046
[2]: https://www.etsy.com/listing/1480956978
[3]: https://formdt1.com/products/t1-gpu-travel-kit
