---
title: "Self-hosted GeoRide dashboard"
description: "A read-only widget pulling live position and trip history from my motorcycle's GPS tracker."
date: "2026-04-18"
tags:
  - nuxt
  - nitro
  - api-integration
type: code
draft: false
mock: true
---

This is a mock project entry, kept here as a template for the "code"
project type.

## What is this

A small Nitro server route that authenticates against the GeoRide API,
caches trip and position data, and exposes it to a read-only widget on the
site. No lock/unlock/alarm controls exposed - display only.

## How it works

Auth is email+password once, exchanged for a bearer token refreshed every
30 days. The token never touches the browser; only the server route talks
to GeoRide. Data is cached and refreshed on a schedule rather than fetched
live per visitor, so the site isn't hammering the API or leaking exact
live position on every page load.

## Links

Repo link goes here once the real project exists.
