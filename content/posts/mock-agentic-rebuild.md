---
title: "Rebuilding this site with an AI agent, end to end"
description: "Notes from letting an agent drive infra, content structure, and design decisions on my own portfolio."
date: "2026-06-14"
tags:
  - nuxt
  - cloudflare
  - agents
# image: "/images/posts/mock-agentic-rebuild/cover.jpg"  # left unset - mock content, no fake photo
draft: false
mock: true
---

This is a mock post. It exists so the blog listing and article page have
something realistic to look at locally, without any of it ever reaching a
public URL.

## Why hand a portfolio to an agent

The honest answer is curiosity. I wanted to see how far an agent could get
on a real, opinionated project - not a toy repo, but the site with my name
on it, deployed on infrastructure I actually use.

The rules were simple: infrastructure and mechanical fixes get shipped
directly, anything touching copy or design waits for review, and nothing
about my actual work history or personal life gets invented.

## What worked well

Deploy plumbing, SEO wiring, bug hunting, dependency upgrades - all of this
is exactly the kind of work an agent handles well. Verifiable, testable,
low ambiguity. A broken build either builds or it doesn't.

## Where a human stayed in the loop

Content and design decisions stayed mine. An agent can wire up an image
pipeline or a sitemap, but it can't write my own career story convincingly,
and it shouldn't try.

## Wrap-up

Worth doing again on the next project - with the same boundary: agent
drives infrastructure, human drives the parts only a human actually knows.
