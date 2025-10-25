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

## Tech Stack

- Nuxt 4
- Nuxt UI 4
- Nuxt Content 3
- TypeScript
- Tailwind CSS
