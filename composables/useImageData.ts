import { computed } from 'vue'

/**
 * Generate image URLs based on file naming conventions
 * This replaces the heavy manifest system for client-side usage
 */
function generateImageUrls(imagePath: string) {
  const basePath = imagePath.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  
  // Standard AVIF sizes used by the project
  const avifSizes = [300, 600, 900, 1200, 1600]
  const avifImages = avifSizes.map(width => ({
    url: `/img/${basePath}-${width}.avif`,
    width
  }))
  
  const fallbackJpg = `/img/${basePath}-1200.jpg`
  const thumbnail = `/img/${basePath}-300.jpg`
  
  const avifSrcset = avifImages.map(img => `${img.url} ${img.width}w`).join(', ')
  
  return {
    fallback: { url: fallbackJpg, width: 1200, height: 0 },
    'thumbnail-fallback': { url: thumbnail, width: 300, height: 0 },
    avif: avifImages,
    avifSrcset,
    hasValidData: true
  }
}

/**
 * Composable for handling responsive images
 * Maintains compatibility with existing templates while supporting new architecture
 */
export const useImageData = (
  preCalculatedData: any = null,
  fallbackSrc: string = ''
) => {
  // If we have pre-calculated data from server-side, use it
  if (preCalculatedData && preCalculatedData.hasValidData) {
    return {
      avifSrcset: computed(() => preCalculatedData.avifSrcset || ''),
      fallback: preCalculatedData.fallback,
      'thumbnail-fallback': preCalculatedData['thumbnail-fallback'],
      avif: preCalculatedData.avif,
      hasValidData: computed(() => true),
      // Legacy compatibility
      fallbackJpgPath: computed(() => preCalculatedData.fallback?.url || ''),
      imgWidth: computed(() => preCalculatedData.fallback?.width || undefined),
      imgHeight: computed(() => preCalculatedData.fallback?.height || undefined)
    }
  }
  
  // Fallback: generate URLs client-side using naming conventions
  if (fallbackSrc) {
    const imageData = generateImageUrls(fallbackSrc)
    return {
      avifSrcset: computed(() => imageData.avifSrcset),
      fallback: imageData.fallback,
      'thumbnail-fallback': imageData['thumbnail-fallback'],
      avif: imageData.avif,
      hasValidData: computed(() => true),
      // Legacy compatibility
      fallbackJpgPath: computed(() => imageData.fallback.url),
      imgWidth: computed(() => imageData.fallback.width),
      imgHeight: computed(() => imageData.fallback.height)
    }
  }
  
  // No data available
  return {
    avifSrcset: computed(() => ''),
    fallback: null,
    'thumbnail-fallback': null,
    avif: [],
    hasValidData: computed(() => false),
    // Legacy compatibility
    fallbackJpgPath: computed(() => ''),
    imgWidth: computed(() => undefined),
    imgHeight: computed(() => undefined)
  }
}
