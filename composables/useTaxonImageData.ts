import imageManifest from './image-manifest-taxons.json'
import { resolveImageData, type ImageManifest } from './imageData'

export const useTaxonImageData = (
  genusName: string,
  specieName: string,
  fileName: string,
) => {
  const genus = genusName.toLowerCase()
  const species = specieName.toLowerCase()
  const fileBase = fileName.replace(/\.(jpg|jpeg|png|avif)$/i, '')

  return resolveImageData(
    imageManifest as ImageManifest,
    `taxons/${genus}-${species}/${fileBase}`,
  )
}
