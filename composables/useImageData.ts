// Direct import of the manifest - works in SSG because it's static.
// Articles and homepage images only: taxon photos live in useTaxonImageData.
import imageManifest from './image-manifest.json'
import { resolveImageData, type ImageManifest } from './imageData'

export const useImageData = (imagePath: string) =>
  resolveImageData(imageManifest as ImageManifest, imagePath)
