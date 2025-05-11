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

;(async () => {
  const files = await walk(IMG_DIR)
  const manifest = {}
  for (const file of files) {
    const rel = path.relative(IMG_DIR, file).replace(/\\/g, '/')
    if (file.endsWith('.jpg')) {
      // Fallback image
      const buffer = await fs.readFile(file)
      const dims = imageSize(buffer)
      const base = rel.replace(/\.jpg$/, '')
      if (!manifest[base])
        manifest[base] = {
          fallback: '',
          avif: [],
          width: dims.width,
          height: dims.height,
        }
      manifest[base].fallback = '/img/' + rel
      manifest[base].width = dims.width
      manifest[base].height = dims.height
    } else if (file.endsWith('.avif')) {
      // AVIF variant
      const match = rel.match(/^(.*)-(\d+)\.avif$/)
      if (match) {
        const base = match[1]
        const width = parseInt(match[2], 10)
        if (!manifest[base])
          manifest[base] = { fallback: '', avif: [], width: null, height: null }
        manifest[base].avif.push({ url: '/img/' + rel, width })
      }
    }
  }
  // Sort AVIF variants by width
  for (const key in manifest) {
    manifest[key].avif.sort((a, b) => a.width - b.width)
  }
  await fs.writeFile(OUTPUT, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log('Image manifest generated:', OUTPUT)
})()
