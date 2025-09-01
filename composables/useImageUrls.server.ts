// Ces imports ne fonctionnent que côté serveur
// @ts-ignore - Node modules
import fs from 'fs'
// @ts-ignore - Node modules  
import path from 'path'

// Type definitions pour le manifest
interface ImageEntry {
  fallback?: { url: string; width: number; height: number }
  'thumbnail-fallback'?: { url: string; width: number; height: number }
  avif: Array<{ url: string; width: number; height: number }>
}

interface ImageManifest {
  [key: string]: ImageEntry
}

// Cache du manifest pour éviter les lectures multiples
let manifestCache: ImageManifest | null = null

/**
 * Charge le manifest d'images (côté serveur seulement)
 */
function loadImageManifest(): ImageManifest {
  if (manifestCache) {
    return manifestCache
  }

  try {
    const manifestPath = path.join(process.cwd(), 'composables', 'image-manifest.json')
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    manifestCache = JSON.parse(manifestContent) as ImageManifest
    return manifestCache
  } catch (error) {
    console.warn('Impossible de charger le manifest d\'images:', error)
    return {}
  }
}

/**
 * Génère les URLs d'images optimisées pour une clé donnée
 * Utilisé côté serveur pendant la génération SSG
 */
export function generateImageUrls(imageKey: string) {
  // Retirer l'extension si présente pour matcher la clé du manifest
  const srcNoExt = imageKey.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  
  const manifest = loadImageManifest()
  const entry = manifest[srcNoExt]

  if (!entry) {
    // Fallback si l'image n'est pas dans le manifest
    return {
      fallback: null,
      'thumbnail-fallback': null,
      avif: [],
      avifSrcset: '',
      hasValidData: false
    }
  }

  // Génération du srcset AVIF
  const avifSrcset = entry.avif && entry.avif.length
    ? entry.avif
        .map(source => `${source.url} ${source.width}w`)
        .join(', ')
    : ''

  return {
    ...entry,
    avifSrcset,
    hasValidData: true
  }
}

/**
 * Génère les URLs pour les images de taxons
 * Convention: taxons/{genus-species}/{filename}
 */
export function generateTaxonImageUrls(
  genusName: string,
  specieName: string,
  fileName: string
) {
  const genus = genusName.toLowerCase()
  const species = specieName.toLowerCase()
  const fileBase = fileName.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  
  const imageKey = `taxons/${genus}-${species}/${fileBase}`
  return generateImageUrls(imageKey)
}

/**
 * Génère les URLs pour les images d'articles
 * Convention: articles/{path}/{filename}
 */
export function generateArticleImageUrls(
  articlePath: string,
  fileName: string
) {
  const fileBase = fileName.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  const imageKey = `articles/${articlePath}/${fileBase}`
  return generateImageUrls(imageKey)
}