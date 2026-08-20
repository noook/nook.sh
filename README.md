# Portfolio - Neil Richter

A modern portfolio built with **Nuxt 4**, **Nuxt UI**, and **Nuxt Content**.

## Features

- 📄 **Content Management**: Powered by Nuxt Content with support for blog posts and projects
- 🎨 **Beautiful UI**: Built with Nuxt UI components for a clean, professional look
- 🔄 **Mixed Content**: Projects can be code-based or IRL projects (like motorcycle road trips, keyboard collections)
- 📝 **Blog Ready**: Blog posts can also function as project documentation
- 🌙 **Dark Mode**: Automatic dark mode support

## Structure

### Pages

- `/` - Home/About page
- `/about` - Detailed about page with expandable experience sections and tech stack
- `/projects` - List of all projects (code and IRL)
- `/blog` - Blog posts

### Content Collections

- `content/*.md` - Static pages
- `content/posts/*.md` - Blog posts
- `content/projects/*.md` - Project descriptions

## Adding Content

### Add a Blog Post

Create a new file in `content/posts/`:

```md
---
title: Your Post Title
description: A brief description
date: 2025-01-20
tags: [Tag1, Tag2]
image: /images/posts/your-post-slug/cover.jpg  # optional
draft: true  # set false when ready to publish
---

# Your Post

Your content here...
```

Cover images live in `public/images/posts/<slug>/` (one folder per post,
so multiple images for the same post stay grouped) and are referenced by
their public path starting with `/images/...`. Cards without an `image`
show a themed placeholder icon instead - not required.

`draft: true` hides a post from listings, the sitemap, and (only in
production builds) direct URL access. It's visible while running `nuxt dev`
locally **and on any Cloudflare Workers Builds preview deploy** (any branch
that isn't the production branch) so you and reviewers can preview unpublished
content on a PR without exposing it on the live domain. See
`runtimeConfig.public.showDrafts` in `nuxt.config.ts` (keyed off Cloudflare's
`WORKERS_CI_DEFAULT_BRANCH` build var) and `app/pages/posts/[...slug].vue`.
The sitemap always excludes drafts, in every environment.

### Add a Project

Create a new file in `content/projects/`:

```md
---
title: Project Name
description: Brief description
date: 2024-01-15
type: code  # or 'irl'
tags: [Tag1, Tag2]
image: /images/projects/your-project-slug/cover.jpg  # optional
draft: true  # set false when ready to publish
---

# Project Name

Project details...
```

Same image/draft conventions as blog posts, under `public/images/projects/`.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment (Cloudflare Pages)

This site targets Cloudflare Pages via Nitro's `cloudflare-pages` preset
(see `nuxt.config.ts`). `@nuxt/content` auto-detects this preset at build
time and switches its content database to Cloudflare D1 (binding name `DB`).

### Config setup (one-time)

`wrangler.jsonc` is **not committed** — it's generated at build/dev time
from `wrangler.jsonc.example` by `scripts/generate-wrangler-config.mjs`
(runs automatically as a `prebuild`/`predev` step), substituting the real D1
`database_id` for the current build. This isn't because the database id is
a secret (it isn't — you still need a real Cloudflare API token to do
anything with it) but to keep infra resource ids out of the public repo.

There are **two separate D1 databases** — production and preview — picked
automatically based on Cloudflare Workers Builds' `WORKERS_CI_DEFAULT_BRANCH`
env var (`"true"` on the production branch, anything else — including
unset, e.g. local dev — is treated as preview). This is deliberate: PR
branches can carry unpublished/in-progress markdown content, and
`@nuxt/content` syncs its D1 content index from whatever's checked out in
the current build. A single shared database would let a preview build's
sync overwrite the index production reads from live, transiently serving
unreleased content on the real domain. Both ids are hardcoded directly in
`scripts/generate-wrangler-config.mjs` — no environment variable needed;
an earlier attempt at sourcing this from a Cloudflare Workers Builds
dashboard env var (`CF_D1_DATABASE_ID`) proved unreliable in practice (the
build step never observed it despite it being set correctly on the
dashboard).

### Commands

```bash
# Build the Cloudflare Worker output (runs the config generator first)
pnpm build

# Preview locally against a local D1 emulation (no remote resources touched)
npx wrangler pages dev dist

# Deploy (requires a Cloudflare API token with Pages:Edit + D1:Edit scopes)
npx wrangler pages deploy dist
```

### One-time D1 setup

```bash
npx wrangler d1 create nook-sh-content
# copy the printed database_id into CF_D1_DATABASE_ID
```

Recommended production setup: connect this repo to Cloudflare Pages' git
integration (Dashboard → Workers & Pages → Create → Connect to Git) so every
push to `main` builds and deploys automatically, rather than deploying via
CLI by hand.

## Tech Stack

- Nuxt 4
- Nuxt UI 4
- Nuxt Content 3
- TypeScript
- Tailwind CSS
