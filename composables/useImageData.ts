import imageManifest from './image-manifest.json'
import { computed } from 'vue'

export const useImageData = (
  src: string,
  sourceWidth: string | number | null,
) => {
  const entry = imageManifest[src]

  const avifSrcset = computed(() =>
    entry && entry.avif && entry.avif.length
      ? entry.avif
          .map(
            (source: { url: string; width: number }) =>
              `${source.url} ${source.width}w`,
          )
          .join(', ')
      : '',
  )

  const fallbackJpgPath = computed(() => entry?.fallback || '')
  const imgWidth = computed(() => entry?.width || undefined)
  const imgHeight = computed(() => entry?.height || undefined)

  return {
    avifSrcset,
    fallbackJpgPath,
    imgWidth,
    imgHeight,
  }
}
