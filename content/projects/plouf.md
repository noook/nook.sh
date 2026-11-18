---
title: "Plouf"
description: "An unofficial, mobile-first app for French competitive swimmers, built on the FFN's results and live sites, mostly by AI agents."
date: "2026-11-18"
tags:
  - nuxt
  - dbos
  - postgres
  - pwa
  - tailscale
  - agents
  - homelab
type: code
image: "/images/projects/plouf/cover-light.png"
imageDark: "/images/projects/plouf/cover-dark.png"
draft: false
---

Plouf is an unofficial web app for French competitive swimmers. The French federation (FFN) publishes everything on two sites: Extranat for results, Live FFN for meets in progress. Most of their views sit behind forms with no URL, the pages are dense, and none of it was made for a phone. Plouf reads the same data and gives every swimmer, club, meet and ranking its own link, with live results, follows and push notifications on top.

It's public at [plouf.nook.sh](https://plouf.nook.sh), in French, and unindexed for now, on purpose. The repo is private for now, because the FFN never really authorised the scraping. If they ever ask me to stop, I'll honour it. The story behind it is in [the blog post](/posts/plouf-story). This page is about the build.

## Who it's for

Swimmers first, then coaches, then family & friends. About 95% of them are on a phone, so every screen is designed at 360 px first, with touch targets of at least 44 px.

::themed-image
---
light: /images/projects/plouf/profile-light.webp
dark: /images/projects/plouf/profile-dark.webp
alt: "My swimmer page in Plouf: personal bests in a 25 m pool, times aligned in monospace"
phone: true
---
::

::themed-image
---
light: /images/projects/plouf/live-board-light.webp
dark: /images/projects/plouf/live-board-dark.webp
alt: "The live board of a meet: an LCD-style board in light mode, LED digits in dark mode"
caption: "The live board, on the simulated meet the screenshot tests use"
phone: true
---
::

## Objectives: fast on one bar of signal

Reception inside a pool is often weak, and swimmers look for results between two races. Nothing the FFN publishes is ever truly real time, there is always some delay, so the aim was the best experience we can build on top of it: pages that load fast on a bad connection, a usable copy with no connection at all, and as few requests to the FFN as possible. That became a ladder of caches:

- Server rendering with Nuxt, as a PWA. The first screen arrives as readable HTML, and link previews in WhatsApp work.
- The service worker keeps up to 120 whole rendered pages and pre-saves what you follow. Offline, you get the last copy and the time it was made.
- Live pages poll every 10 seconds with the version they already have. When nothing changed, the answer is a couple of hundred bytes. WebSockets and SSE were rejected because they break each time the reception drops.
- Live answers are cached at the edge for 5 seconds, so phones watching the same meet share one answer.
- Data is stored the first time someone asks and refreshed in the background after 6 hours. Navigation never waits for the FFN.

## Architecture

::diagram-flow
---
steps:
  - label: Phone
    note: PWA, saved pages
  - label: Cloudflare
    note: edge cache, WAF
  - label: Web
    note: Nuxt SSR, Nitro routes
  - label: Postgres
    note: data and DBOS queues
  - label: Worker
    note: DBOS, the only FFN client
    accent: true
  - label: Egresses
    note: 4 networks, Tailscale
  - label: FFN
    note: Extranat ㆍ Live FFN
caption: "From the phone to the FFN. The web app never talks to the FFN: it reads Postgres and queues work for the worker."
---
::

Two apps share one Postgres database. The web app is Nuxt 4 with Nuxt UI. The worker runs [DBOS](https://www.dbos.dev/) workflows, and it's the only part of the project allowed to talk to the FFN. A test enforces that rule: HTTP lives in one file of the worker, and the test fails if anything else makes a request.

DBOS keeps its queues in Postgres, so there's no extra service to run, and a workflow survives a crash or a deploy. BullMQ was more mature, with a free dashboard. I took DBOS anyway, mostly to try something new and learn durable execution.

Politeness sets the pace. The worker makes at most 2 requests per second per source and per network. Meets in progress are polled every 5 minutes, or every 20 seconds when someone is watching one. The live widget is requested in the same 10 second window as the FFN's own widget, so their CDN often answers from cache and the request never reaches their servers.

### Egresses on other people's networks

One network is fine on a quiet Saturday. The Interclubs weekend had 119 meets on the calendar. So the worker spreads its traffic over several networks, which I call Egresses: 4 to date, mine, my family's and 2 friends'.

A friend's or family member's Egress is one public container: Tailscale in userspace mode and a small proxy that only lets traffic through to the FFN's two hosts, with no published port. TLS goes end to end, so their machine relays encrypted bytes and holds no Plouf secret. It runs from one `docker run` line, or a compose file in Coolify.

The worker finds Egresses on its own. Every 15 seconds it reads the local Tailscale daemon, and a peer with the right tag and name joins the pool once its proxy answers. Each Egress gets its own 2 requests per second. A live meet sticks to one network (rendezvous hashing), and Extranat requests go to the least busy one. A 429 or a confirmed 403 pauses that network alone. The pool exists to spread the load, and it is never used to get around an FFN refusal.

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
caption: "Share of the Live FFN requests per network over the Interclubs weekend, 7 and 8 November"
---
::


## Two paths through the app

Most of what Plouf does is one of two paths: someone opens a page, or a heat finishes at a pool.

::diagram-steps
---
title: Opening a swimmer page
steps:
  - actor: phone
    text: "Opens /nageurs/<id>, from a shared link or a search."
  - actor: web
    text: "The page asks its Nitro route for the personal bests. The route checks the id with Zod."
  - actor: postgres
    text: "The stored copy is read. If it's fresh, it's served at once, and that's the end of it."
  - actor: web
    text: "Missing, or older than 6 hours: a refresh is queued for the worker."
    note: "a stale copy is served meanwhile; a first visit waits up to about 3 s"
  - actor: worker
    text: "Checks the opt-out list, then waits for a slot at the gate."
    note: "2 requests per second, per source and per network"
  - actor: egress
    text: "The request leaves through the least busy network, encrypted end to end."
  - actor: extranat
    text: "Answers with an HTML page made for a desktop browser."
  - actor: worker
    text: "Parses it against a Zod schema. A value that doesn't fit is stored as published and flagged."
  - actor: postgres
    text: "Stores the swimmer and records when the copy was fresh."
  - actor: phone
    text: "The page, which kept polling while it waited, shows the result."
---
::

::diagram-steps
---
title: A heat, from the pool to your phone
steps:
  - actor: pool
    text: "The heat ends. With manual timing, an official types the times in."
    note: "that can take up to 40 minutes"
  - actor: live ffn
    text: "The times show up on Live FFN's live widget and results pages."
  - actor: worker
    text: "Polls the meet every 5 minutes, or every 20 seconds while someone watches it."
    note: "a meet always leaves from the same network"
  - actor: postgres
    text: "New swims are stored as pending, until the FFN's official export replaces them after the meet."
  - actor: phone
    text: "On the live page, asks every 10 seconds what changed since the version it holds."
    note: "nothing new: a couple of hundred bytes"
  - actor: cloudflare
    text: "Caches that answer for 5 seconds, so phones watching the same meet share it."
  - actor: push
    text: "If you follow a swimmer in that heat, you get one notification per swim."
---
::

## Built by agents, planned by me

Each feature started as a grilling session: the agent asks, I answer, and each settled answer becomes an architecture decision record (ADR) or a glossary entry. The first commit has no code in it, only a glossary, 13 ADRs and some sketches. Decisions became spec issues with user stories, then tickets with blocking links between them. The v1 spec reached 100 sub-issues, GitHub's cap, so live work got its own spec.

A [Hermes](https://hermes-agent.nousresearch.com) cron job starts an autonomous run every 5 hours. A parent agent picks the next unblocked ticket and hands it to a fresh subagent, which works on a branch until it opens a pull request. The parent merges green PRs and fixes red ones first. When an agent can't decide something (an ADR change, a URL, a cost), it asks on the ticket and waits for me.

Agents ignored the rules that only lived in a doc, so I moved them into tooling. A subagent once looped on the full test suite for over an hour after CI was already green, so now `pnpm test` refuses to run the whole suite locally without a flag. Other tests check that no UI copy sits in code and that every route validates its input with Zod. dependency-cruiser checks module boundaries against a baseline that can only shrink.

## The CI bill

At first CI ran on every push, and again on a long-lived draft PR, so twice per commit. Three Docker images were built per push too. After four days, GitHub showed 1,801 of my 2,000 free monthly minutes used.

Two fixes followed. CI now runs on pull requests and releases only, images are built per release, and `main` is a trunk of squashed commits. And I set up a self-hosted runner on my homelab: a VM rather than an LXC container, because a job with the Docker socket is root in its guest, and an LXC shares the host kernel. It has a lower CPU weight, so production always wins. Its first run took 6.5 minutes and cost zero Actions minutes.

The pipeline kept growing, though. The test job reached about 9 minutes, and a release took 18.4. So I split CI into four parallel jobs, gave the integration tests more Vitest workers, and built the three images together with `docker buildx bake`, alongside CI. The next release took 10.8 minutes.
The runner shares a 4-core machine with production, and that is its main limit.

## The day a crawler arrived

On 11 November, ClaudeBot made 161,247 of the 170,588 requests Plouf received between 05:00 and 13:00 UTC. From 07:30, traffic went from about 300 requests per 15 minutes to between 6,000 and 10,000. Each Swimmer or Meet page it opened queued a refresh from the FFN, about 35,000 workflows in two hours, and 8% of the FFN requests started to answer 403 on every network. Over the whole day, Extranat ran at the cap on all four networks, 1,971 requests were refused, the networks spent 5 to 9 hours paused, and about 21,600 meet imports failed. The fix has four parts. `robots.txt` names the AI crawlers and nothing else, since search engines must keep reading the `noindex` header (ADR 0038). A Cloudflare rule blocks them at the edge, and a Nitro middleware answers the same user agents with a 403 before anything is rendered or queued, as a second line. A test keeps `robots.txt` and the middleware list equal. And a visit no longer refreshes old data: a Meet that ended over a month ago waits a month, a Swimmer whose last swim is over a year old waits a week. The story is in [the blog post](/posts/plouf-story).

## What changed after the Interclubs

The architecture could be simpler. Code drifts from its first goal: a change lands as one small `if`, then another, and one day there are nine in a row. Plouf got there too, with many modules and layers, some of which could merge. My test for "done enough" is a map of the services and how they talk: fewer boxes than today, and someone new (or an agent) reads the domains and the steps of a parse or a poll straight off it.

On 11 November, after the Interclubs, I had agents review a snapshot of the code and measure it. The result was a plan of 25 tickets, which grew to 40 as the work went on, each blocked by the previous one and run by the same autonomous loop. The PRs say which numbers were measured and which are estimated. Most of these tickets buy maintainability and testability, not speed, and they say so. When a national championship or a dozen-meet weekend is within 7 days, the tickets that touch the live poll wait. By 17 November, 34 of the 40 were merged. The first 20 were in by 12 November:

| Before (11 Nov) | After (12 Nov) |
| --- | --- |
| 16 hand-written upserts of the "freshness" record, plus scattered wait constants | one read-through module for db, web and worker |
| 8 hand-written copies of a Live FFN read, with 11 `console.warn` | one recipe, one catalogue of jobs, structured logs with trace ids |
| 63 files at the root of the worker's `src/` | 5, the rest sorted by role |
| 41 hand-written fakes of the FFN, no Live FFN fixture | one shared fake and anonymised Live FFN fixtures, plus a simulated FFN for local dev |
| 2 different two-digit birth-year rules (web and worker) | 1 rule in the kernel |
| 5 wire shapes and 4 adapters for relay legs and splits | 1 swim row and 1 shape on every wire |
| 2,352 test cases | 2,220 after a first pruning |
| first open of a live Club page: median 3,484 ms | median 139 ms, measured on the simulated FFN |

The last row comes from the one structural change that was also a speed gain. Domain events are now written to an outbox in the same transaction as the change, and the worker wakes on them instead of waiting for its 10 second tick.

Since then, every route went on a contract handler (27 of 35 weren't), an API reference is generated from the contracts for local dev, the code moved into workspace packages with one module per FFN page kind, and there's a free `/admin/workflows` page, because DBOS Conductor needs a paid licence for what I'd use. Grafana Faro for browser errors is ready and waits for me to switch it on. What's left is moving the rest of Swimmer and Rankings into their modules.

The tests were the other half. There were almost as many lines of tests as lines of code, because agents follow test-driven development to the letter and write a test for every decision, config files included. One test pinned every value of the Renovate config, which a validator already checks in CI. The rule is now written in the agent docs and in the cron prompt: a test must guard something that breaks for a user, for the FFN or for stored data. The first pass cut 132 cases.

## Numbers

As of 17 November 2026:

- 388 commits on `main`, 168 pull requests (165 merged)
- 43 ADRs, about 25,600 words of decisions
- 242 GitHub issues, 206 closed
- about 45,000 lines of TypeScript and Vue, and about 41,000 lines of tests in 315 test files
- 64 database tables and 42 migrations
- 550 workflow runs: about 2,080 hosted job-minutes in the first five days, everything since on the homelab

### The Interclubs weekend, 7 and 8 November

- 119 meets on the calendar, 101 of them Interclubs
- about 136,000 requests to the FFN, shared by the 4 Egresses (21% to 28% each)
- 1,781 of them (1.3%) refused with a 403, none with a 429
- 47% of the requests were programme sheets, read in advance for every meet
- CloudFront served 4.4% of the Live FFN requests from its cache
- 103 visitors (Umami), 98 of them on a phone, with almost no advertising
- 2 push notifications sent, 4 devices subscribed
- no outage, only temporary Egress pauses

## Links

- The app: [plouf.nook.sh](https://plouf.nook.sh)
- The homelab it runs on, CI runner and shared monitoring included: [noook/hanok](https://github.com/noook/hanok)
- The Plouf repo is private.
