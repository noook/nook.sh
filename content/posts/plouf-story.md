---
title: "Back in the pool, back to the app I gave up on in 2019"
description: "I started competing again in 2026, found the federation's tools exactly where I left them, and finally built the swimming app I'd dropped years ago, this time with AI agents doing the coding."
date: "2026-11-18"
tags:
  - plouf
  - swimming
  - agents
  - side-project
# image: "/images/posts/plouf-story/cover-light.png"
# imageDark: "/images/posts/plouf-story/cover-dark.png"
project: plouf
draft: true
---

At a swimming meet in France, you know your own time as soon as you touch the wall. The splits are another matter, and so are your teammates' results and the next heat. The public often has to wait, and when the timing is manual, someone types the times in one by one, so the delay can be long. Meanwhile everyone is on their phone. Each lookup is a few taps, a form, some zooming, and a page that takes a while to load on one bar of signal.

I built [Plouf](https://plouf.nook.sh) to cut that down. It's an unofficial app that reads the French federation's results and live sites and puts them in a shape that works on a phone. This post is about how it came to exist. The [project page](/projects/plouf) covers the technical side.

::themed-image
---
light: /images/posts/plouf-story/live-board-light.webp
dark: /images/posts/plouf-story/live-board-dark.webp
alt: "Plouf's live board for a meet: an LCD-style board in light mode, LED digits in dark mode"
caption: "The live board, on the simulated meet Plouf's own screenshot tests use"
phone: true
---
::


## The first try, in 2019

This isn't my first attempt. In 2019 I started the same idea with Symfony, which was my favourite framework at the time. There was no AI to lean on back then, and most of the work went into parsing.

The FFN publishes its data as pages made for a browser, with nothing a program can read directly. Finding the right strategy to pull clean results out of those pages took me ages. I only ever worked on the back end, and it ate so much time that I never got to a single screen. Eventually I just dropped it.

## Seven years later, nothing had changed

This year I started competing again, and the tools were exactly where I'd left them. As far as I can tell they haven't really changed since 2015.

At my first meet back, I struggled with the network. What bugged me even more was the repetition. We all check results on our phones, and every action means moving around the UI: navigating somewhere, finding someone, reading the right line in a dense table. We even had to pinch-zoom just to tap on something.

Extranat, the results site, got a slightly more modern interface since. Live FFN, the one you use at the pool, still works like this:

::diagram-compare
---
left:
  title: Live FFN
  steps:
    - "Open the meet index."
    - "Scroll to find the meet. The page is zoomed out, so you pinch to read the names and places."
    - "Open the meet. The programme lives in a submenu next to start lists and participants: zoom in to tap the right link."
    - "Tap a race: it opens on the side. Zoom, tap, zoom out to read it, back and forth."
    - "Zoom in on the results and follow the swimmer's line to read the time and the splits."
right:
  title: Plouf
  accent: true
  steps:
    - "Open the meet, from a shared link or the Compétitions tab."
    - "Tap the race in the programme."
    - "Read the times, aligned in monospace. The splits are one tap away."
caption: "Finding one result during a meet, on a phone"
---
::


There was a second reason to try again. I wanted a real use case for a fully agentic development workflow, on something that people other than me would use. A swimming app for my own club was about as concrete as it gets.

## Planning like I meant it

I wrote almost no code myself, mostly secrets. My effort went into the planning and the architecture.

Every feature started as a long interview. The agent asked questions, I answered, and each settled answer became a written decision: an ADR, or a term in a glossary. Sometimes I came in with a precise idea of what I wanted. Sometimes I only had a rough one, and the questions forced me to develop it and defend it. The first commit in the repo has no code in it at all, just the glossary, 13 ADRs and a few sketches.

::diagram-flow
---
steps:
  - label: Interview
    note: the agent asks, I answer
  - label: ADRs & glossary
    note: every settled answer
  - label: Spec & tickets
    note: user stories, blocking links
  - label: Agent on a branch
    note: one ticket, fresh context
    accent: true
  - label: PR & CI
    note: lint, types, 4 test jobs
  - label: Merge
    note: one squashed commit
loop: "every 5 hours, the next unblocked ticket"
caption: "How a feature went from an idea to main"
---
::


That's also why I trusted the agents early. The planning and the docs were detailed enough that the first pull requests were already good. Autonomous runs pick a ticket, work on it, open a PR, and the next one starts. I did have to steer, sometimes hard. Once an agent built a team ranking for every meet, when teams only exist at the Interclubs. But each correction ended up as a new or amended ADR, so the next run started from the fixed rule instead of my memory of a chat. Today there are 43 ADRs, about 25,600 words of decisions, and that pile is what kept the quality from sliding.

I'm on the Claude Pro plan, and during the build I hit the weekly limit once and almost hit it a second time.

The parsing that beat me in 2019 is still hard, by the way, but I'm no longer alone with it. The FFN's maintenance page answers HTTP 200 on every URL, so a page can say "everything went fine" while returning nothing. One parser expected a day number and met "Dimanche 1er Novembre", so every race on the first of a month vanished. When Plouf meets a weird value now, it stores it as published, flags it and keeps going.

## Fixing it from the stands

On the first day of the Interclubs, I realised the relays needed a lot of work. When I opened a relay, in the programme or in the results, I couldn't see who swam in it, nor their birth years. And the splits of the 10×50 m and the 4×200 m were hard to read.

So I fixed all of it from the pool, through my agent on Telegram, without opening a laptop. A few curious heads around me leaned over to see what I was using to check all this. And reading splits on Plouf was so much easier than on Live FFN.

::themed-image
---
light: /images/posts/plouf-story/splits-light.webp
dark: /images/posts/plouf-story/splits-dark.webp
alt: "My 100 back of 8 November in Plouf, 1:03.16, with its splits opened: 28.77 at 50 m, 34.39 for the second length"
phone: true
---
::

That's my own 100 back from Sunday 8 November, on [my swimmer page](https://plouf.nook.sh/nageurs/1979311).

Navigation was the other problem. Pages felt stuck for a moment after every tap. At 15:29 I sent this from the stands:

> All the navigation on Plouf feels delayed, lagging. It seems navigation is blocked while data fetches. It feels unnatural and unresponsive for the user. Can you check why, and improve this?

At 15:40 the pull request was ready to merge, tests included. Some pages fetched their data with a plain `await` at the top, and Nuxt keeps the previous page on screen until that request returns. The meets page was the worst: three requests one after another, each waiting on a phone's round trip. Today a test fails the build if a page makes navigation wait for its data.

## Sharing it, and the Google mistake

Once it worked, I sent it to my club, then to my previous club, and asked them to show it around. That's still the whole plan. Plouf is public, but for now it's deliberately not on Google. It's a tool for people who already know whom they're looking for, and shared links work fine without a search engine.

At first, adults' pages could be indexed. I hadn't thought about people's names showing up in search results. Then a swimmer found their own results page through Google and asked to be removed. That was my first opt-out request, it surprised me, and fair enough. I turned indexing off for every page, adults included, and used Search Console's removal tool. Google took 3 to 4 hours to handle the request. Every response now carries `noindex`, so Google drops the pages it still has the next time it comes by. That's a temporary default, because it's the safe one. Later I may index the pages that say nothing about a person, like the homepage and the meets.

The FFN hasn't contacted me. If they ever ask me to stop, I'll honour it, no hard feelings. To me this is an experiment in agentic development and a way to make other swimmers' days a bit easier. It's also why the repo is private for now.

## Friends with homelabs

During the Interclubs, dozens of meets run all over France on the same weekend. If several networks share the requests, each one makes only a fraction of them, and a block is less likely. It was also a learning challenge I wanted to take on. So the worker can send its requests through small proxies on other people's networks. I call them Egresses. There are 4 to date: mine, my family's and two friends'.

It sounded like a big favour to ask, and it took one message. My friends like self-hosting as much as I do, and both run Coolify and talk to their own AI agent on Telegram. So I sent them my `docker run` command, and they wrote to their agent from their phone, more or less: "my friend gave me this command, can you add that project to Coolify". A new network then showed up in Plouf's pool on its own.

I like this part a lot. The proxy only lets traffic through to the FFN's two sites, it holds no secret, and the traffic stays encrypted end to end, so whoever lends a network can't see anything in it.

::diagram-fanout
---
from:
  label: Worker
  note: 2 req/s per network
branches:
  - label: egress-1
    share: 27
  - label: egress-2
    share: 21
  - label: egress-3
    share: 28
  - label: egress-4
    share: 25
to:
  label: FFN
  note: Extranat ㆍ Live FFN
caption: "Share of the Live FFN requests per network over the Interclubs weekend"
---
::


## The Interclubs weekend

The Interclubs were the date I had built everything around. On 7 and 8 November there were 119 meets on the calendar, 101 of them Interclubs, all over France at the same time.

Over those two days the worker made about 136,000 requests to the FFN's two sites. The 4 Egresses shared them almost evenly, between 21% and 28% each. About 1.3% of the requests (1,781) were refused with a 403, and none with a 429. Nearly half of the traffic was programme sheets, since every meet had its whole programme read in advance. I had hoped the FFN's CDN would answer a good share of the live requests from its cache, and it didn't: only 4.4% of the Live FFN requests were cache hits.

Umami counted 103 visitors, 39 on Saturday and 65 on Sunday, and 98 of them were on a phone, which is exactly who Plouf is built for. During the meets they came for the programme and the live board, about 9 pages per visit. For an app I barely advertised, that's a lot, and I hope it's still up next year with way more traffic. Only 2 notifications went out that weekend, because only 4 devices had turned them on.

::diagram-bars
---
title: Visitors per day, 6 to 15 Nov
bars:
  - { label: "6", value: 28 }
  - { label: "7", value: 39, highlight: true }
  - { label: "8", value: 65, highlight: true }
  - { label: "9", value: 33 }
  - { label: "10", value: 12 }
  - { label: "11", value: 12 }
  - { label: "12", value: 15 }
  - { label: "13", value: 7 }
  - { label: "14", value: 7 }
  - { label: "15", value: 2 }
caption: "Umami visitors per day. The Interclubs were on Saturday 7 and Sunday 8, the official results came out from Monday 9."
---
::


The FFN published the official results over three days, starting on Monday 9 November at 04:35. In the week after, 84 visitors came by, mostly to find a meet and then its results. Monday was the busiest with 33, then it settled at 12 to 15 a day. Umami tells visitors apart by network and browser, so someone who moves from the pool to home counts twice. Take these as rough counts.

Besides the relays and the navigation, I fixed a few other things I saw at the pool:

- Some results were incomplete, and I had to backfill the data.
- When an official types the times by hand, they can show up as much as 40 minutes after the swim, but the LiveFFN suffered from the same delay anyway. Automatic chronometers may behave very differently.
- Long texts caused layout shifts.

The reactivity is still not ideal, though it's better than it was.

People told me a few things. A birth year next to each swimmer always helps, so it's now shown everywhere a swimmer is named. Several said they like the app and prefer it to the FFN's sites now. A few were curious about how it works, and I can point them to the schemas and the technical documentation later.

## The morning ClaudeBot came by

On 11 November my Telegram filled up with Plouf alerts saying the FFN had answered 403 to one of the Egresses. Cloudflare's analytics showed what was going on. From 07:30 UTC, plouf.nook.sh went from about 300 requests per 15 minutes to between 6,000 and 10,000, and it stayed there. Between 05:00 and 13:00 UTC, ClaudeBot made 161,247 of the 170,588 requests, Amazonbot 8,065 and Reflectionbot 925. Real browsers made about 290. It's a bit funny that most of Plouf was built with Claude's help and ClaudeBot was the one hitting it hardest.

::diagram-bars
---
title: Requests to plouf.nook.sh per 15 minutes, 11 Nov (UTC)
labelEvery: 4
bars:
  - label: "05:00"
    value: 293
  - label: "05:15"
    value: 318
  - label: "05:30"
    value: 318
  - label: "05:45"
    value: 290
  - label: "06:00"
    value: 324
  - label: "06:15"
    value: 325
  - label: "06:30"
    value: 300
  - label: "06:45"
    value: 306
  - label: "07:00"
    value: 315
  - label: "07:15"
    value: 294
  - label: "07:30"
    value: 859
    highlight: true
  - label: "07:45"
    value: 4287
    highlight: true
  - label: "08:00"
    value: 9238
    highlight: true
  - label: "08:15"
    value: 8239
    highlight: true
  - label: "08:30"
    value: 7191
    highlight: true
  - label: "08:45"
    value: 7888
    highlight: true
  - label: "09:00"
    value: 7267
    highlight: true
  - label: "09:15"
    value: 7515
    highlight: true
  - label: "09:30"
    value: 7877
    highlight: true
  - label: "09:45"
    value: 6096
    highlight: true
  - label: "10:00"
    value: 6294
    highlight: true
  - label: "10:15"
    value: 6120
    highlight: true
  - label: "10:30"
    value: 8105
    highlight: true
  - label: "10:45"
    value: 8202
    highlight: true
  - label: "11:00"
    value: 7905
    highlight: true
  - label: "11:15"
    value: 8692
    highlight: true
  - label: "11:30"
    value: 9041
    highlight: true
  - label: "11:45"
    value: 9001
    highlight: true
  - label: "12:00"
    value: 8857
    highlight: true
  - label: "12:15"
    value: 8652
    highlight: true
  - label: "12:30"
    value: 10045
    highlight: true
  - label: "12:45"
    value: 10134
    highlight: true
marks:
  - { at: "07:30", text: "ClaudeBot starts" }
  - { at: "12:30", text: "12:36, the Cloudflare rule: from here the crawlers are blocked at the edge" }
caption: "From Cloudflare's analytics. Blocked requests still count here: the rule keeps them away from my homelab, not from Cloudflare."
---
::


The problem was what each request triggered. Every swimmer or meet page a crawler opened queued a refresh from the FFN, and in two hours that came to about 35,000 refresh workflows, spread over meet ids from the whole range and thousands of swimmers. Requests to Extranat went from around 70 to around 1,200 per 15 minutes. About 8% of requests got a 403, on every network at the same second. Over the whole day, Extranat ran at the 2 requests per second cap on all four networks, about 23,700 requests against 1,800 on a normal Friday. 1,971 of them were refused, the four networks spent 5 to 9 hours paused, one pause after another, and about 21,600 meet imports failed between 10:00 and 15:00. During the Interclubs the share of refusals was 1.3%, and there was no outage, only short pauses.

I can't prove that my own volume caused those 403s, because the FFN answers them for other reasons too. But that load had no value, so I cut it on three fronts:

- A Cloudflare rule blocks the AI crawlers (ClaudeBot, Amazonbot, Reflectionbot, GPTBot, CCBot, PerplexityBot, Bytespider and Meta's) at the edge, so their requests never reach my homelab. Only `robots.txt` stays readable for them.
- `robots.txt` names the same crawlers and asks them to stay away, and a Nitro middleware answers their user agents with a 403 before anything is rendered or queued, in case one slips past Cloudflare. Search engines aren't in that list. A blocked crawler can't read the `noindex` header, so I never add a `Disallow` for them.
- A visit no longer refreshes old data. A meet that ended over a month ago is refreshed from a visit after a month, and a swimmer whose last swim is over a year old after a week. It used to be 6 hours.

First visits to an unknown swimmer or meet are unchanged.

## Seven years on

The 2019 version never got past the parser. This one has been to a meet, runs partly on borrowed networks, and two clubs have the link. The code stays private for now, and I may open some of it next year. How it's built, from the CI bill to the clean-up after the Interclubs, is on the [project page](/projects/plouf).
