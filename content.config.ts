import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        date: z.object({
          published: z.date(),
        }),
        thumbnail: z.string(),
        location: z.string(),
        idGaleryAnts: z.number(),
        fk_idSpecie: z.number(),
      }),
    }),
  },
})
