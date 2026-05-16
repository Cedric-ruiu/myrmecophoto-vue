import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import { readdirSync, statSync } from 'fs'
import path from 'path'
import db from '../../db'

// This function is called by the sitemap module to generate the list of URLs to include in the sitemap
// Root pages + /taxons/:slug/ + /articles/:slug/

export default defineSitemapEventHandler(async () => {
  const urls: SitemapUrlInput[] = []
  const now = new Date().toISOString()

  urls.push(
    { loc: '/', lastmod: now, changefreq: 'weekly', priority: 1.0, _sitemap: 'pages' },
    { loc: '/taxons/', lastmod: now, changefreq: 'weekly', priority: 0.9, _sitemap: 'pages' },
    { loc: '/articles/', lastmod: now, changefreq: 'weekly', priority: 0.9, _sitemap: 'pages' },
    { loc: '/about/', lastmod: now, changefreq: 'monthly', priority: 0.6, _sitemap: 'pages' },
  )

  const subfamilies = await db.subfamily.findMany({
    include: {
      genus: {
        include: {
          specie: {},
        },
      },
    },
  })

  subfamilies.forEach((subfamily) => {
    subfamily.genus.forEach((genus) => {
      genus.specie.forEach((specie) => {
        const taxon = `${genus.name}-${specie.name}`
          .replace(/\s+/g, '-')
          .replace(/\./g, '')
          .toLowerCase()

        urls.push({
          loc: `/taxons/${taxon}/`,
          lastmod: now,
          changefreq: 'monthly',
          priority: 0.7,
          _sitemap: 'pages',
        })
      })
    })
  })

  try {
    const articlesDir = path.join(process.cwd(), 'content', 'articles')
    const articleFiles = readdirSync(articlesDir).filter(f => f.endsWith('.md'))

    for (const file of articleFiles) {
      const slug = file.replace(/\.md$/, '')
      const mtime = statSync(path.join(articlesDir, file)).mtime.toISOString()

      urls.push({
        loc: `/articles/${slug}/`,
        lastmod: mtime,
        changefreq: 'monthly',
        priority: 0.8,
        _sitemap: 'pages',
      })
    }
  } catch (error) {
    console.error('Error reading articles directory for sitemap:', error)
  }

  return urls satisfies SitemapUrlInput[]
})
