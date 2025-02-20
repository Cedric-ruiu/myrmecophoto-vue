import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import db from '../../db'

// This function is called by the sitemap module to generate the list of URLs to include in the sitemap
// /taxons/:taxon

export default defineSitemapEventHandler(async () => {
  // request similar to getTaxa.ts
  const subfamilies = await db.subfamily.findMany({
    include: {
      genus: {
        include: {
          specie: {},
        },
      },
    },
  })

  const urls: SitemapUrlInput[] = []

  subfamilies.forEach((subfamily) => {
    subfamily.genus.forEach((genus) => {
      genus.specie.forEach((specie) => {
        const taxon = `${genus.name}-${specie.name}`
          .replace(' ', '-')
          .replace('.', '')
        urls.push({
          loc: `/taxons/${taxon}`,
          lastmod: new Date(2025, 1, 16).toISOString(),
          _sitemap: 'pages',
        })
      })
    })
  })

  return urls satisfies SitemapUrlInput[]
})
