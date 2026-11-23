// Manifest-agnostic resolver: each composable imports only its own manifest,
// so a page's bundle carries the entries of its section only.

export interface ImageData {
  avifSrcset: string
  fallback: { url: string; width: number; height: number } | null
  'thumbnail-fallback': { url: string; width: number; height: number } | null
  avif: Array<{ url: string; width: number; height: number }>
  hasValidData: boolean
  finalSrc: string
  finalWidth: number
  finalHeight: number
  thumbnailSrc: string
  thumbnailWidth: number
  thumbnailHeight: number
  aspectRatio: string | undefined
  largestAvif: { url: string; width: number; height: number } | null
}

type ManifestImage = { url: string; width: number; height: number }
export type ImageManifest = Record<string, {
  fallback: ManifestImage | null
  'thumbnail-fallback': ManifestImage | null
  avif: ManifestImage[]
}>

/** Responsive image sources, resolved from one of the prebuilt manifests. */
export const resolveImageData = (manifest: ImageManifest, imagePath: string): ImageData => {
  const manifestKey = imagePath.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  const manifestEntry = manifest[manifestKey]

  if (manifestEntry && manifestEntry.avif?.length) {
    const avifSrcset = manifestEntry.avif
      .map(img => `${img.url} ${img.width}w`)
      .join(', ')

    const largestAvif = manifestEntry.avif[manifestEntry.avif.length - 1]

    const finalSrc = manifestEntry.fallback?.url || largestAvif?.url || ''
    const thumbnailSrc = manifestEntry['thumbnail-fallback']?.url || manifestEntry.fallback?.url || manifestEntry.avif[0]?.url || ''

    const finalWidth = manifestEntry.fallback?.width || largestAvif?.width || 0
    const finalHeight = manifestEntry.fallback?.height || largestAvif?.height || 0
    const thumbnailWidth = manifestEntry['thumbnail-fallback']?.width || manifestEntry.fallback?.width || manifestEntry.avif[0]?.width || 300
    const thumbnailHeight = manifestEntry['thumbnail-fallback']?.height || manifestEntry.fallback?.height || manifestEntry.avif[0]?.height || 200

    const aspectRatio = finalWidth && finalHeight ? `${finalWidth} / ${finalHeight}` : undefined

    return {
      avifSrcset,
      fallback: manifestEntry.fallback || null,
      'thumbnail-fallback': manifestEntry['thumbnail-fallback'] || null,
      avif: manifestEntry.avif,
      hasValidData: true,
      finalSrc,
      finalWidth,
      finalHeight,
      thumbnailSrc,
      thumbnailWidth,
      thumbnailHeight,
      aspectRatio,
      largestAvif: largestAvif ?? null
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
    finalSrc: `/img/${basePath}-1200.jpg`,
    finalWidth: 1200,
    finalHeight: 0,
    thumbnailSrc: `/img/${basePath}-300.jpg`,
    thumbnailWidth: 300,
    thumbnailHeight: 0,
    aspectRatio: undefined, // Unknown for convention fallback
    largestAvif: largestAvif ?? null
  }
}
