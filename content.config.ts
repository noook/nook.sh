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
      schema: z.array(z.object({
        title: z.string(),
        period: z.string(),
        company: z.string(),
        description: z.string(),
      })),
    }),
  },
})
