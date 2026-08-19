import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
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
