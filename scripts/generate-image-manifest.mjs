import fs from 'fs/promises'
import path from 'path'
import { imageSize } from 'image-size'

const IMG_DIR = path.join(process.cwd(), 'public', 'img')
const OUTPUT = path.join(process.cwd(), 'composables', 'image-manifest.json')
const CACHE_FILE = path.join(process.cwd(), '.cache', 'image-manifest-cache.json')

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (err) {
    // Directory might already exist, ignore
  }
}

async function walk(dir) {
  let files = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const res = path.resolve(dir, entry.name)
    if (entry.isDirectory()) files = files.concat(await walk(res))
    else files.push(res)
  }
  return files
}

async function getFileStats(files) {
  const stats = {}
  await Promise.all(
    files.map(async (file) => {
      try {
        const stat = await fs.stat(file)
        stats[file] = stat.mtime.getTime()
      } catch (err) {
        // File might have been deleted, ignore
      }
    }),
  )
  return stats
}

async function loadCache() {
  try {
    const cacheData = await fs.readFile(CACHE_FILE, 'utf-8')
    return JSON.parse(cacheData)
  } catch (err) {
    return { fileStats: {}, manifest: {} }
  }
}

async function saveCache(fileStats, manifest) {
  await ensureDir(path.dirname(CACHE_FILE))
  await fs.writeFile(CACHE_FILE, JSON.stringify({ fileStats, manifest }, null, 2), 'utf-8')
}

function hasFilesChanged(currentStats, cachedStats) {
  const currentFiles = Object.keys(currentStats)
  const cachedFiles = Object.keys(cachedStats)
  
  if (currentFiles.length !== cachedFiles.length) return true
  
  for (const file of currentFiles) {
    if (!cachedStats[file] || currentStats[file] !== cachedStats[file]) {
      return true
    }
  }
  
  return false
}

function ensureEntry(manifest, key) {
  if (!manifest[key])
    manifest[key] = { fallback: null, 'thumbnail-fallback': null, avif: [] }
}

async function generateManifest(files, fileBuffers) {
  const manifest = {}

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
  return Object.keys(manifest)
    .sort()
    .reduce((obj, key) => {
      obj[key] = manifest[key]
      return obj
    }, {})
}

;(async () => {
  const start = Date.now()
  const files = await walk(IMG_DIR)
  
  // Check cache
  const currentStats = await getFileStats(files)
  const cache = await loadCache()
  
  let manifest
  let useCache = false
  
  if (!hasFilesChanged(currentStats, cache.fileStats)) {
    // Use cached manifest
    manifest = cache.manifest
    useCache = true
    console.log('Using cached image manifest (no changes detected)')
  } else {
    console.log('Regenerating image manifest (changes detected)')
    
    // Pre-read all files to avoid multiple reads
    const fileBuffers = {}
    await Promise.all(
      files.map(async (file) => {
        fileBuffers[file] = await fs.readFile(file)
      }),
    )
    
    manifest = await generateManifest(files, fileBuffers)
    
    // Save to cache
    await saveCache(currentStats, manifest)
  }

  // Always write the manifest file (for first-time setup or changes)
  await fs.writeFile(OUTPUT, JSON.stringify(manifest, null, 2), 'utf-8')
  
  const duration = ((Date.now() - start) / 1000).toFixed(2)
  console.log('Image manifest ready:', OUTPUT)
  if (useCache) {
    console.log('Cache hit - execution time:', duration + 's')
  } else {
    console.log('Full generation - execution time:', duration + 's')
  }
})()
