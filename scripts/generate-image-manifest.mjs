import fs from 'fs/promises'
import path from 'path'
import { imageSize } from 'image-size'

const IMG_DIR = path.join(process.cwd(), 'public', 'img')
const OUTPUT = path.join(process.cwd(), 'composables', 'image-manifest.json')

async function walk(dir) {
  let files = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const res = path.resolve(dir, entry.name)
    if (entry.isDirectory()) files = files.concat(await walk(res))
    else files.push(res)
  }
  return files
}

function ensureEntry(manifest, key) {
  if (!manifest[key])
    manifest[key] = { fallback: null, 'thumbnail-fallback': null, avif: [] }
}

;(async () => {
  const start = Date.now()
  const files = await walk(IMG_DIR)
  const manifest = {}

  // Pre-read all files to avoid multiple reads
  const fileBuffers = {}
  await Promise.all(
    files.map(async (file) => {
      fileBuffers[file] = await fs.readFile(file)
    }),
  )

  for (const file of files) {
    const rel = path.relative(IMG_DIR, file).replace(/\\/g, '/')
    if (file.endsWith('.jpg')) {
      const dims = imageSize(fileBuffers[file])
      const base = rel.replace(/\.jpg$/, '')
      if (base.endsWith('-thumbnail')) {
        // Thumbnail fallback
        const mainBase = base.replace(/-thumbnail$/, '')
        ensureEntry(manifest, mainBase)
        manifest[mainBase]['thumbnail-fallback'] = {
          url: '/img/' + rel,
          width: dims.width,
          height: dims.height,
        }
      } else {
        // Main fallback
        ensureEntry(manifest, base)
        manifest[base].fallback = {
          url: '/img/' + rel,
          width: dims.width,
          height: dims.height,
        }
      }
    } else if (file.endsWith('.avif')) {
      // AVIF variant
      const match = rel.match(/^(.*)-(\d+)\.avif$/)
      if (match) {
        const base = match[1]
        const dims = imageSize(fileBuffers[file])
        ensureEntry(manifest, base)
        manifest[base].avif.push({
          url: '/img/' + rel,
          width: dims.width,
          height: dims.height,
        })
      }
    }
  }

  // Sort AVIF by width
  for (const key in manifest) {
    manifest[key].avif.sort((a, b) => a.width - b.width)
  }

  // Sort manifest keys for readability
  const orderedManifest = Object.keys(manifest)
    .sort()
    .reduce((obj, key) => {
      obj[key] = manifest[key]
      return obj
    }, {})

  await fs.writeFile(OUTPUT, JSON.stringify(orderedManifest, null, 2), 'utf-8')
  const duration = ((Date.now() - start) / 1000).toFixed(2)
  console.log('Image manifest generated:', OUTPUT)
  console.log('Execution time:', duration + 's')
})()
