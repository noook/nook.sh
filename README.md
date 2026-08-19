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
---

# Your Post

Your content here...
```

### Add a Project

Create a new file in `content/projects/`:

```md
---
title: Project Name
description: Brief description
date: 2024-01-15
type: code  # or 'irl'
tags: [Tag1, Tag2]
---

# Project Name

Project details...
```

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
`database_id` from the `CF_D1_DATABASE_ID` environment variable. This isn't
because the database id is a secret (it isn't — you still need a real
Cloudflare API token to do anything with it) but to keep infra resource ids
out of the public repo.

```bash
# Local dev/build: set once in your shell, or add to .env / .dev.vars
export CF_D1_DATABASE_ID=<your-d1-database-id>
```

On Cloudflare Pages' git integration, set `CF_D1_DATABASE_ID` as a project
environment variable (Dashboard → Workers & Pages → your project → Settings
→ Environment variables) — it doesn't need to be marked "secret", just set.

If `CF_D1_DATABASE_ID` isn't set and no `wrangler.jsonc` exists yet, the
generator script warns and exits without failing the build — useful for
CI steps that don't need the Cloudflare preset (e.g. pure lint/typecheck).

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
