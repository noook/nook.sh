import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      // Schema includes every custom frontmatter field the templates read
      // (blog.vue, posts/[...slug].vue) - zod strips unlisted keys by
      // default, so a partial schema would silently drop date/tags.
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).default([]),
        // Cover image shown on the /blog listing card - optional, cards
        // fall back to a themed placeholder (see blog.vue) when unset so
        // the grid still looks intentional before real photos exist.
        image: z.string().optional(),
        // Draft posts are excluded from listings and the sitemap always;
        // whether they 404 on direct URL access depends on environment -
        // see nuxt.config.ts runtimeConfig.showDrafts (visible in local
        // `nuxt dev` and on Cloudflare preview deploys, hidden only on the
        // real production build) and app/pages/blog.vue /
        // app/pages/posts/[...slug].vue for where that flag is consumed.
        draft: z.boolean().default(false),
        // Mock/example posts - filled-in fake content for local dev only
        // (testing layout, cover images, view transitions, etc against
        // something more realistic than an empty draft template). Unlike
        // `draft`, mock content is dev-only in every sense: never visible
        // on a Cloudflare preview deploy, not just hidden on production -
        // see app/pages/blog.vue / posts/[...slug].vue for the
        // import.meta.dev gate.
        mock: z.boolean().default(false),
        // sitemap filter always excludes drafts and mock content, in every
        // environment including preview deploys - neither should ever be
        // *advertised* to crawlers even when directly reachable for review.
        // This is deliberately unconditional, independent of
        // runtimeConfig.showDrafts / import.meta.dev.
        sitemap: defineSitemapSchema({
          name: 'posts',
          filter: entry => !entry.draft && !entry.mock,
          z,
        }),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        date: z.string(),
        tags: z.array(z.string()).default([]),
        type: z.enum(['code', 'irl']).default('code'),
        image: z.string().optional(),
        draft: z.boolean().default(false),
        mock: z.boolean().default(false),
        sitemap: defineSitemapSchema({
          name: 'projects',
          filter: entry => !entry.draft && !entry.mock,
          z,
        }),
      }),
    }),
    experience: defineCollection({
      type: 'data',
      source: 'experience.yml',
      // @nuxt/content's data collections do not support a bare YAML array
      // at the document root (it silently wraps it into a `body` field
      // instead, which broke rendering - the schema below expecting a
      // top-level array never actually matched the parsed data). Wrapping
      // the list under an `items` key is the supported shape.
      schema: z.object({
        items: z.array(z.object({
          title: z.string(),
          period: z.string(),
          company: z.string(),
          description: z.string(),
        })),
      }),
    }),
  },
})
