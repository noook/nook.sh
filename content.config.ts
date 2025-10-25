import { defineContentConfig, defineCollection } from '@nuxt/content'

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
  },
})
