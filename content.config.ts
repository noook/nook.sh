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
        // Draft posts are excluded from listings, sitemap (filter below),
        // and direct URLs in production - see app/pages/blog.vue and
        // app/pages/posts/[...slug].vue, which gate on `import.meta.dev`
        // (a Nuxt build-time constant: true only under `nuxt dev`, baked
        // to `false` in production builds - so this isn't just "hidden
        // from listings", the draft check can never pass once deployed).
        draft: z.boolean().default(false),
        // sitemap filter runs at sitemap-generation time, independent of
        // the import.meta.dev gates in page components - both layers need
        // the same rule since they serve different purposes (page
        // components gate what a visitor/crawler can actually reach, this
        // gates what gets *advertised* in the sitemap for crawlers to find).
        sitemap: defineSitemapSchema({
          name: 'posts',
          filter: entry => !entry.draft,
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
        sitemap: defineSitemapSchema({
          name: 'projects',
          filter: entry => !entry.draft,
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
