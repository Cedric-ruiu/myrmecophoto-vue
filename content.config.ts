import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    content: defineCollection(
      asSeoCollection({
        type: 'page',
        source: '**/*.md',
        schema: z.object({
          // title: Nuxt Content generates this standard field
          // description: Nuxt Content generates this standard field
          date: z.object({
            published: z.date(),
            updated: z.date().optional(),
          }),
          image: z.object({
            main: z.string(),
            thumbnail: z.string(),
          }),
          location: z.string().optional(),
          idGaleryAnts: z.number().optional(),
          fk_idSpecie: z.number().optional(),
        }),
      }),
    ),
  },
})
