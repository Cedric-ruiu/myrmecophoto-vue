// Direct import of the manifest - works in SSG because it's static
import imageManifest from './image-manifest.json'

interface ImageData {
  avifSrcset: string
  fallback: { url: string; width: number; height: number } | null
  'thumbnail-fallback': { url: string; width: number; height: number } | null
  avif: Array<{ url: string; width: number; height: number }>
  hasValidData: boolean
  // Enhanced computed properties for template simplification
  finalSrc: string
  finalWidth: number
  finalHeight: number
  thumbnailSrc: string
  thumbnailWidth: number
  thumbnailHeight: number
  aspectRatio: string | undefined
  largestAvif: { url: string; width: number; height: number } | null
}

/**
 * Simple, unified composable for responsive images
 * Works with direct manifest import for optimal SSG performance
 */
export const useImageData = (imagePath: string): ImageData => {
  // Remove extension and normalize path for manifest lookup
  const manifestKey = imagePath.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  const manifestEntry = imageManifest[manifestKey as keyof typeof imageManifest]

  if (manifestEntry && manifestEntry.avif?.length) {
    // Generate srcset from manifest data
    const avifSrcset = manifestEntry.avif
      .map(img => `${img.url} ${img.width}w`)
      .join(', ')

    // Get largest AVIF for primary display
    const largestAvif = manifestEntry.avif[manifestEntry.avif.length - 1]

    // Determine final sources with fallback priority
    const finalSrc = manifestEntry.fallback?.url || largestAvif?.url || ''
    const thumbnailSrc = manifestEntry['thumbnail-fallback']?.url || manifestEntry.fallback?.url || manifestEntry.avif[0]?.url || ''

    // Determine final dimensions with fallback priority  
    const finalWidth = manifestEntry.fallback?.width || largestAvif?.width || 0
    const finalHeight = manifestEntry.fallback?.height || largestAvif?.height || 0
    const thumbnailWidth = manifestEntry['thumbnail-fallback']?.width || manifestEntry.fallback?.width || manifestEntry.avif[0]?.width || 300
    const thumbnailHeight = manifestEntry['thumbnail-fallback']?.height || manifestEntry.fallback?.height || manifestEntry.avif[0]?.height || 200

    // Calculate aspect ratio
    const aspectRatio = finalWidth && finalHeight ? `${finalWidth} / ${finalHeight}` : undefined

    return {
      avifSrcset,
      fallback: manifestEntry.fallback || null,
      'thumbnail-fallback': manifestEntry['thumbnail-fallback'] || null,
      avif: manifestEntry.avif,
      hasValidData: true,
      // Enhanced properties
      finalSrc,
      finalWidth,
      finalHeight,
      thumbnailSrc,
      thumbnailWidth,
      thumbnailHeight,
      aspectRatio,
      largestAvif
    }
  }

  // Fallback: convention-based URLs (for missing manifest entries)
  const basePath = manifestKey
  const avifSizes = [300, 600, 900, 1200, 1600]
  const avifImages = avifSizes.map(width => ({
    url: `/img/${basePath}-${width}.avif`,
    width,
    height: 0 // Will be calculated by browser - not ideal but fallback only
  }))

  const avifSrcset = avifImages.map(img => `${img.url} ${img.width}w`).join(', ')
  const largestAvif = avifImages[avifImages.length - 1]

  return {
    avifSrcset,
    fallback: { url: `/img/${basePath}-1200.jpg`, width: 1200, height: 0 },
    'thumbnail-fallback': { url: `/img/${basePath}-300.jpg`, width: 300, height: 0 },
    avif: avifImages,
    hasValidData: true,
    // Enhanced properties for convention fallback
    finalSrc: `/img/${basePath}-1200.jpg`,
    finalWidth: 1200,
    finalHeight: 0,
    thumbnailSrc: `/img/${basePath}-300.jpg`,
    thumbnailWidth: 300,
    thumbnailHeight: 0,
    aspectRatio: undefined, // Unknown for convention fallback
    largestAvif
  }
}

/**
 * Specialized helper for taxon images
 */
export const useTaxonImageData = (
  genusName: string,
  specieName: string,
  fileName: string
) => {
  const genus = genusName.toLowerCase()
  const species = specieName.toLowerCase()
  const fileBase = fileName.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  const imagePath = `taxons/${genus}-${species}/${fileBase}`

  return useImageData(imagePath)
}

/**
 * Specialized helper for article images  
 */
export const useArticleImageData = (
  articlePath: string,
  fileName: string
) => {
  const fileBase = fileName.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  const imagePath = `articles/${articlePath}/${fileBase}`

  return useImageData(imagePath)
}
