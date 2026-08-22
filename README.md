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

`draft: true` hides a post from listings, the sitemap, and (everywhere
except a known preview build) direct URL access. It's visible while
running `nuxt dev` locally **and on any Cloudflare Workers Builds preview
deploy that Workers Builds' own git integration ran** (any branch that
isn't the production branch, `WORKERS_CI_DEFAULT_BRANCH === 'false'`) so
you and reviewers can preview unpublished content on a PR without exposing
it on the live domain. Hidden in every other case, including an unset
build var - e.g. a manual `wrangler deploy` from a laptop is NOT treated
as a preview build just because it isn't `'true'`, precisely because it's
also how production got deployed once. See
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

### Mock/example content (local dev only)

Every `draft-1.md` is an empty template - useful as a starting point, but
not something you can actually look at while building layout/design work.
For that, use `mock: true` instead:

```md
---
title: A Realistic Example Title
description: Filled-in fake content, not a [TODO] placeholder
date: 2026-01-01
tags: [example]
mock: true
draft: false
---

Real prose, real structure - just fictional.
```

The existing `content/posts/mock-*.md` and `content/projects/mock-*.md`
files are exactly this: realistic-looking example posts/projects with
made-up (clearly fictional) content, kept around specifically so `/blog`
and `/projects` have something to actually look at locally - testing card
layouts, cover images, view transitions, whatever - without writing real
content first.

`mock: true` is **stricter than `draft: true`**: mock content is hidden
in *every* environment except local `nuxt dev`, including Cloudflare
preview deploys (drafts are visible there; mocks never are). It's also
always excluded from the sitemap, same as drafts. The rule of thumb: use
`draft: true` for real content you're still writing, `mock: true` for
fake example content that will never be published as-is.

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

## Deployment (Cloudflare Workers)

This site targets Cloudflare Workers (the unified Workers+static-assets
model, Cloudflare's current default for new projects - not classic Pages)
via Nitro's `cloudflare-module` preset (see `nuxt.config.ts`). `@nuxt/content`
auto-detects any `cloudflare*` preset at build time and switches its content
database to Cloudflare D1 (binding name `DB`), regardless of which specific
Cloudflare preset is used.

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

# Preview locally against the real Worker runtime (no remote resources touched)
npx wrangler --cwd .output dev

# Deploy (requires a Cloudflare API token with Workers Scripts:Edit + D1:Edit scopes)
npx wrangler --cwd .output deploy
```

### One-time D1 setup

```bash
npx wrangler d1 create nook-sh-content        # production
npx wrangler d1 create nook-sh-content-preview  # preview builds
# both ids are hardcoded in scripts/generate-wrangler-config.mjs, see above
```

Recommended production setup: connect this repo to Cloudflare Workers
Builds' git integration (Dashboard → Workers & Pages → Create → Connect to
Git) so every push to `main` builds and deploys automatically, rather than
deploying via CLI by hand.

## Tech Stack

- Nuxt 4
- Nuxt UI 4
- Nuxt Content 3
- TypeScript
- Tailwind CSS
