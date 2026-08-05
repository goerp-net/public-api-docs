import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs_en: defineCollection({
      type: 'page',
      source: 'en/**',
    }),
    docs_ar: defineCollection({
      type: 'page',
      source: 'ar/**',
    }),
  },
})
