import type { SitemapUrlInput } from '#sitemap/types'
import { readdirSync, statSync } from 'fs'
import path from 'path'
import db from '../../db'

// Single sitemap source: pages with their associated images attached via <image:image>.
// Image sitemap format reference:
// https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps

type ImageEntry = { loc: string; title: string; caption: string }

function findFiles(dir: string, suffix: string): string[] {
  const results: string[] = []

  function walk(currentDir: string) {
    try {
      const files = readdirSync(currentDir)
      for (const file of files) {
        const filePath = path.join(currentDir, file)
        const stat = statSync(filePath)
        if (stat.isDirectory()) walk(filePath)
        else if (file.endsWith(suffix)) results.push(filePath)
      }
    } catch {
      // Silent fail for missing directories
    }
  }

  walk(dir)
  return results
}

function titleCase(str: string): string {
  return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function collectArticleImages(publicDir: string, baseUrl: string): Map<string, ImageEntry[]> {
  const articlesDir = path.join(publicDir, 'img', 'articles')
  const imagesByArticle = new Map<string, ImageEntry[]>()

  for (const imagePath of findFiles(articlesDir, '-1200.avif')) {
    const relativeImagePath = imagePath
      .replace(publicDir, '')
      .replace(/\\/g, '/')

    // /img/articles/[article-slug]/image-1200.avif
    const pathParts = relativeImagePath.split('/')
    const articleSlug = pathParts[3]
    if (!articleSlug) continue

    const imageFileName = path.basename(relativeImagePath, '-1200.avif')
    const imageTitle = titleCase(imageFileName)
    const articleTitle = titleCase(articleSlug)

    const entries = imagesByArticle.get(articleSlug) ?? []
    entries.push({
      loc: `${baseUrl}${relativeImagePath}`,
      title: `${imageTitle} - ${articleTitle}`,
      caption: `Photographie macro de fourmis - ${imageTitle}`,
    })
    imagesByArticle.set(articleSlug, entries)
  }

  return imagesByArticle
}

function collectTaxonImages(publicDir: string, baseUrl: string): Map<string, ImageEntry[]> {
  const taxonsDir = path.join(publicDir, 'img', 'taxons')
  const imagesByTaxon = new Map<string, ImageEntry[]>()

  for (const imagePath of findFiles(taxonsDir, '-1200.avif')) {
    const relativeImagePath = imagePath
      .replace(publicDir, '')
      .replace(/\\/g, '/')

    // /img/taxons/[genus-species]/image-1200.avif
    const pathParts = relativeImagePath.split('/')
    const taxonSlug = pathParts[3]
    if (!taxonSlug) continue

    const imageFileName = path.basename(relativeImagePath, '-1200.avif')
    const taxonParts = taxonSlug.split('-')
    const genus = taxonParts[0]
      ? taxonParts[0].charAt(0).toUpperCase() + taxonParts[0].slice(1)
      : ''
    const species = taxonParts[1] ?? ''
    const scientificName = `${genus} ${species}`.trim()
    const imageType = imageFileName
      .replace(new RegExp(`^${taxonSlug}-`), '')
      .replace(/-f\d+$/, '')
      .replace(/-/g, ' ')

    const entries = imagesByTaxon.get(taxonSlug) ?? []
    entries.push({
      loc: `${baseUrl}${relativeImagePath}`,
      title: `${scientificName} - Vue ${imageType}`,
      caption: `Photographie taxonomique de ${scientificName} - ${imageType}`,
    })
    imagesByTaxon.set(taxonSlug, entries)
  }

  return imagesByTaxon
}

export default defineSitemapEventHandler(async () => {
  const urls: SitemapUrlInput[] = []
  const now = new Date().toISOString()
  const baseUrl = 'https://myrmecophoto.fr'
  const publicDir = path.join(process.cwd(), 'public')

  urls.push(
    { loc: '/', lastmod: now, changefreq: 'weekly', priority: 1.0 },
    { loc: '/taxons/', lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { loc: '/taxons/index-alphabetique/', lastmod: now, changefreq: 'weekly', priority: 0.7 },
    { loc: '/articles/', lastmod: now, changefreq: 'weekly', priority: 0.9 },
    { loc: '/about/', lastmod: now, changefreq: 'monthly', priority: 0.6 },
  )

  const taxonImagesBySlug = collectTaxonImages(publicDir, baseUrl)

  const subfamilies = await db.subfamily.findMany({
    include: {
      genus: {
        include: {
          specie: { include: { _count: { select: { specimen: true } } } },
        },
      },
    },
  })

  subfamilies.forEach((subfamily) => {
    subfamily.genus.forEach((genus) => {
      genus.specie.forEach((specie) => {
        // Skip empty species (no specimens = page is hidden in the listing and
        // would 404 anyway). Avoids feeding the sitemap with placeholder URLs.
        if (!specie._count.specimen) return

        const taxon = `${genus.name}-${specie.name}`
          .replace(/\s+/g, '-')
          .replace(/\./g, '')
          .toLowerCase()

        urls.push({
          loc: `/taxons/${taxon}/`,
          lastmod: now,
          changefreq: 'monthly',
          priority: 0.7,
          images: taxonImagesBySlug.get(taxon),
        })
      })
    })
  })

  const articleImagesBySlug = collectArticleImages(publicDir, baseUrl)

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
        images: articleImagesBySlug.get(slug),
      })
    }
  } catch (error) {
    console.error('Error reading articles directory for sitemap:', error)
  }

  return urls satisfies SitemapUrlInput[]
})
