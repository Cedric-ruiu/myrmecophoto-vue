import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import path from 'path'
import { readdirSync, statSync } from 'fs'

// Function to recursively find files
function findFiles(dir: string, pattern: string): string[] {
  const results: string[] = []
  
  function walk(currentDir: string) {
    try {
      const files = readdirSync(currentDir)
      
      for (const file of files) {
        const filePath = path.join(currentDir, file)
        const stat = statSync(filePath)
        
        if (stat.isDirectory()) {
          walk(filePath)
        } else if (file.endsWith(pattern)) {
          results.push(filePath)
        }
      }
    } catch (error) {
      // Silent fail for missing directories
    }
  }
  
  walk(dir)
  return results
}

export default defineSitemapEventHandler(async () => {
  const urls: SitemapUrlInput[] = []
  
  try {
    // Base URL for the site
    const baseUrl = 'https://myrmecophoto.fr'
    const publicDir = path.join(process.cwd(), 'public')
    
    // Find all JPG 1200px images in articles directory
    const articlesDir = path.join(publicDir, 'img', 'articles')
    const articleImages = findFiles(articlesDir, '-1200.avif')
    
    for (const imagePath of articleImages) {
      // Convert to relative path from public/
      const relativeImagePath = imagePath
        .replace(publicDir, '')
        .replace(/\\/g, '/')
        .replace('-1200.avif', '-1200.jpg') // Reference JPG version for sitemap
      
      // Extract article name from path for better SEO
      const pathParts = relativeImagePath.split('/')
      const articleSlug = pathParts[3] // /img/articles/[article-slug]/image.jpg
      const imageFileName = path.basename(relativeImagePath, '-1200.jpg')
      
      // Generate descriptive title based on image filename and article
      const imageTitle = imageFileName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
      
      const articleTitle = articleSlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
      
      urls.push({
        loc: relativeImagePath,
        images: [
          {
            loc: `${baseUrl}${relativeImagePath}`,
            title: `${imageTitle} - ${articleTitle}`,
            caption: `Photographie macro de fourmis - ${imageTitle}`,
          }
        ],
        lastmod: new Date(2025, 1, 16).toISOString(),
        changefreq: 'yearly',
        priority: 0.5,
        _sitemap: 'images',
      })
    }
    
    // Find all AVIF 1200px images in taxons directory (we'll reference JPG equivalents)
    const taxonsDir = path.join(publicDir, 'img', 'taxons')
    const taxonImages = findFiles(taxonsDir, '-1200.avif')
    
    for (const imagePath of taxonImages) {
      // Convert to relative path from public/ and reference JPG version
      const relativeImagePath = imagePath
        .replace(publicDir, '')
        .replace(/\\/g, '/')
        .replace('-1200.avif', '-1200.jpg') // Reference JPG version for sitemap
      
      // Extract taxon name from path
      const pathParts = relativeImagePath.split('/')
      const taxonSlug = pathParts[3] // /img/taxons/[genus-species]/image.jpg
      const imageFileName = path.basename(relativeImagePath, '-1200.jpg')
      
      // Generate descriptive title based on taxon and image type
      const taxonParts = taxonSlug.split('-')
      const genus = taxonParts[0].charAt(0).toUpperCase() + taxonParts[0].slice(1)
      const species = taxonParts[1] || ''
      const scientificName = `${genus} ${species}`
      
      // Extract view type from filename
      const imageType = imageFileName
        .replace(new RegExp(`^${taxonSlug}-`), '')
        .replace(/-f\d+$/, '') // Remove specimen reference
        .replace(/-/g, ' ')
      
      urls.push({
        loc: relativeImagePath,
        images: [
          {
            loc: `${baseUrl}${relativeImagePath}`,
            title: `${scientificName} - Vue ${imageType}`,
            caption: `Photographie taxonomique de ${scientificName} - ${imageType}`,
          }
        ],
        lastmod: new Date(2025, 1, 16).toISOString(),
        changefreq: 'yearly',
        priority: 0.6,
        _sitemap: 'images',
      })
    }
    
    console.log(`Generated ${urls.length} image sitemap entries`)
    
  } catch (error) {
    console.error('Error generating image sitemap:', error)
  }
  
  return urls
})