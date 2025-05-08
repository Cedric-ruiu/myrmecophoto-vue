import { imageSize } from 'image-size'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { ISizeCalculationResult } from 'image-size/types/interface'
import { computed, ref } from 'vue'

export const useImageData = (
  src: string,
  sourceWidth: string | number | null,
) => {
  const imageBaseUrl = '/img/'
  // Standard target widths for AVIF generation
  const standardWidths = [300, 600, 900, 1200, 1600]

  const dimensions = ref<Pick<
    ISizeCalculationResult,
    'width' | 'height'
  > | null>(null)
  const avifSources = ref<Array<{ url: string; width: number }>>([])

  const parsedSourceWidth = ref<number | null>(null)
  if (sourceWidth !== null && sourceWidth !== undefined) {
    parsedSourceWidth.value = Number(sourceWidth)
    if (isNaN(parsedSourceWidth.value)) {
      console.warn(
        `[PictureArticle] sourceWidth fourni n'est pas un nombre valide : ${sourceWidth}`,
      )
    }
  }
  const effectiveMaxWidth =
    parsedSourceWidth.value || Math.max(...standardWidths)

  // This block executes only on the server during the build process.
  if (import.meta?.server) {
    const publicDir = path.join(process.cwd(), 'public', 'img')
    const jpgFileName = `${src}.jpg`
    const jpgFilePath = path.join(publicDir, jpgFileName)

    // Attempt to read dimensions from the fallback JPG file.
    // This is the primary source for the final width/height attributes.
    fs.readFile(jpgFilePath)
      .then((jpgBuffer) => {
        const dims = imageSize(new Uint8Array(jpgBuffer))

        if (dims && dims.width && dims.height) {
          // Basic sanity check if sourceWidth prop was provided
          if (parsedSourceWidth.value && dims.width > effectiveMaxWidth) {
            console.warn(
              `[PictureArticle] Fallback JPG "${jpgFileName}" width (${dims.width}px) exceeds provided sourceWidth (${effectiveMaxWidth}px). Check image generation process. Using JPG dimensions.`,
            )
          }
          if (parsedSourceWidth.value && dims.width < effectiveMaxWidth) {
            console.warn(
              `[PictureArticle] Fallback JPG "${jpgFileName}" width (${dims.width}px) is less than provided sourceWidth (${effectiveMaxWidth}px). Check image generation process or sourceWidth prop. Using JPG dimensions.`,
            )
          }
          dimensions.value = { width: dims.width, height: dims.height }
        } else {
          console.warn(
            `[PictureArticle] image-size failed for fallback JPG: ${jpgFilePath}. Missing dimensions.`,
          )
        }
      })
      .catch((e) => {
        // Log specific errors for missing files or read issues
        if ((e as any).code === 'ENOENT') {
          console.error(
            `[PictureArticle] Fallback JPG not found: ${jpgFilePath}`,
          )
        } else {
          console.error(
            `[PictureArticle] Failed to read dimensions from fallback JPG: ${jpgFilePath}`,
            e,
          )
        }
        // Continue without dimensions, AVIF check might still work but CLS is likely.
      })

    // Calculate the specific AVIF widths to check based on standard widths and effective max width.
    let widthsToCheck: number[] = standardWidths.filter(
      (w) => w <= effectiveMaxWidth,
    )
    const minStandardWidth = Math.min(...standardWidths)
    if (
      !standardWidths.includes(effectiveMaxWidth) &&
      effectiveMaxWidth >= minStandardWidth
    ) {
      widthsToCheck.push(effectiveMaxWidth)
    }
    // Ensure unique, sorted list of widths
    widthsToCheck = [...new Set(widthsToCheck)].sort((a, b) => a - b)

    // Asynchronously check for the existence of each potential AVIF file.
    Promise.allSettled(
      // Use Promise.allSettled to avoid failing all if one check fails
      widthsToCheck.map(async (width) => {
        const avifFileName = `${src}-${width}.avif`
        const avifFilePath = path.join(publicDir, avifFileName)
        const avifPublicUrl = `${imageBaseUrl}${avifFileName}`
        // fs.access throws if file doesn't exist or isn't readable
        await fs.access(avifFilePath, fs.constants.R_OK)
        return { url: avifPublicUrl, width } // Return data needed for srcset
      }),
    ).then((sourceChecks) => {
      // Filter out failed checks and map to the final structure.
      avifSources.value = sourceChecks
        .filter(
          (
            result,
          ): result is PromiseFulfilledResult<{ url: string; width: number }> =>
            result.status === 'fulfilled',
        )
        .map((result) => result.value)

      if (avifSources.value.length === 0) {
        console.warn(
          `[PictureArticle] Aucun fichier AVIF trouvé pour la source "${src}" (widths: ${widthsToCheck.join(', ')}).`,
        )
      }
    })
  }

  const avifSrcset = computed(() =>
    (avifSources.value || [])
      // Use the actual file width for the 'w' descriptor in srcset
      .map((source) => `${source.url} ${source.width}w`)
      .join(', '),
  )

  const fallbackJpgPath = computed(() => `${imageBaseUrl}${src}.jpg`)

  // Computed dimensions derived from the build-time check for the <img> tag attributes.
  // Essential for preventing Cumulative Layout Shift (CLS).
  const imgWidth = computed(() => dimensions.value?.width)
  const imgHeight = computed(() => dimensions.value?.height)

  return {
    avifSrcset,
    fallbackJpgPath,
    imgWidth,
    imgHeight,
  }
}
