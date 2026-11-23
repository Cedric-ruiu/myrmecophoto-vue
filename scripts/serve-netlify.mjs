// Local approximation of Netlify's static hosting for the generated site, so that
// production-only behaviour (CSP, COEP, redirects, pretty URLs, 404) can be tested
// before deploying. Usage: `yarn generate && yarn serve:netlify` (PORT=4000 by default).
//
// Emulated, read from the project files:
// - [[headers]] blocks of netlify.toml (`*` wildcards, all matching rules merged)
// - public/_redirects: exact and `/*` → `:splat` rules, 200 rewrites, 301/302/404,
//   shadowing (a rule only applies when no file exists, unless forced with `!`)
// - pretty URLs: `/foo` → 301 `/foo/` when `foo/index.html` exists
// - 404.html served with a 404 status for unknown paths
// - brotli/gzip compression negotiated from Accept-Encoding
// Not emulated: rules targeting another host, query/country/role conditions, edge
// functions, forms (the contact form POST returns 405).
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import zlib from 'node:zlib'

const cwd = process.cwd()
const root = path.resolve(cwd, process.argv[2] || '.output/public')
const port = Number(process.env.PORT || 4000)

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error(`No build found in ${root}: run \`yarn generate\` first.`)
  process.exit(1)
}

const globToRegex = glob =>
  new RegExp(`^${glob.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`)

// Minimal reader for the [[headers]] blocks of netlify.toml.
function readHeaderRules(file) {
  const rules = []
  let current = null
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (trimmed === '[[headers]]') {
      current = { pattern: null, values: {} }
      rules.push(current)
      continue
    }
    if (trimmed.startsWith('[') && trimmed !== '[headers.values]') {
      current = null
      continue
    }
    const match = trimmed.match(/^("?)([\w-]+)\1\s*=\s*"(.*)"$/)
    if (!current || !match) continue
    if (match[2] === 'for') current.pattern = globToRegex(match[3])
    else current.values[match[2]] = match[3]
  }
  return rules.filter(rule => rule.pattern)
}

function readRedirects(file) {
  if (!fs.existsSync(file)) return []
  return fs.readFileSync(file, 'utf8').split('\n')
    .map(line => line.replace(/#.*/, '').trim().split(/\s+/))
    .filter(parts => parts.length >= 2 && parts[0].startsWith('/'))
    .map(([from, to, status = '301']) => ({
      from,
      to,
      status: Number.parseInt(status, 10),
      force: status.endsWith('!'),
      splat: from.endsWith('/*'),
    }))
}

const headerRules = readHeaderRules(path.join(cwd, 'netlify.toml'))
const redirects = readRedirects(path.join(root, '_redirects'))

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ttf': 'font/ttf', '.wasm': 'application/wasm',
}
const compressible = /^(text\/|application\/(json|xml|manifest|javascript)|image\/svg)/

// Resolves a URL path to a file the way Netlify does (exact file, then index.html).
function resolveFile(urlPath) {
  const file = path.join(root, urlPath)
  if (!file.startsWith(root)) return null
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file
  if (urlPath.endsWith('/') && fs.existsSync(path.join(file, 'index.html')))
    return path.join(file, 'index.html')
  return null
}

function matchRedirect(urlPath, hasFile) {
  for (const rule of redirects) {
    if (hasFile && !rule.force) continue
    if (rule.splat) {
      const base = rule.from.slice(0, -2)
      if (urlPath === base || urlPath.startsWith(`${base}/`))
        return { ...rule, target: rule.to.replace(':splat', urlPath.slice(base.length + 1)) }
    }
    else if (urlPath === rule.from) {
      return { ...rule, target: rule.to }
    }
  }
  return null
}

function headersFor(urlPath) {
  const headers = {}
  for (const rule of headerRules)
    if (rule.pattern.test(urlPath)) Object.assign(headers, rule.values)
  return headers
}

function send(req, res, file, status, urlPath) {
  const type = types[path.extname(file)] || 'application/octet-stream'
  const headers = { ...headersFor(urlPath), 'Content-Type': type, 'Vary': 'Accept-Encoding' }
  const accept = req.headers['accept-encoding'] || ''
  let body = fs.readFileSync(file)
  if (compressible.test(type)) {
    if (/\bbr\b/.test(accept)) {
      body = zlib.brotliCompressSync(body)
      headers['Content-Encoding'] = 'br'
    }
    else if (/\bgzip\b/.test(accept)) {
      body = zlib.gzipSync(body)
      headers['Content-Encoding'] = 'gzip'
    }
  }
  headers['Content-Length'] = body.length
  res.writeHead(status, headers)
  res.end(req.method === 'HEAD' ? undefined : body)
}

function log(status, method, url, note = '') {
  const color = status >= 400 ? 31 : status >= 300 ? 33 : 32
  console.log(`\x1B[${color}m${status}\x1B[0m ${method} ${url}${note ? ` ${note}` : ''}`)
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  let urlPath
  try {
    urlPath = decodeURIComponent(url.pathname)
  }
  catch {
    res.writeHead(400).end()
    return log(400, req.method, req.url)
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end()
    return log(405, req.method, req.url, '(forms are not emulated)')
  }

  const file = resolveFile(urlPath)
  const redirect = matchRedirect(urlPath, Boolean(file))
  if (redirect) {
    if (redirect.status === 200 || redirect.status === 404) {
      const target = resolveFile(redirect.target)
      if (target) {
        log(redirect.status, req.method, req.url, `(rewrite → ${redirect.target})`)
        return send(req, res, target, redirect.status, urlPath)
      }
    }
    else {
      res.writeHead(redirect.status, { Location: redirect.target + url.search })
      res.end()
      return log(redirect.status, req.method, req.url, `→ ${redirect.target}`)
    }
  }

  if (file) {
    log(200, req.method, req.url)
    return send(req, res, file, 200, urlPath)
  }

  // Pretty URLs: directory without its trailing slash.
  if (!urlPath.endsWith('/') && fs.existsSync(path.join(root, urlPath, 'index.html'))) {
    res.writeHead(301, { Location: `${url.pathname}/${url.search}` })
    res.end()
    return log(301, req.method, req.url, `→ ${url.pathname}/`)
  }

  log(404, req.method, req.url)
  send(req, res, path.join(root, '404.html'), 404, urlPath)
}).listen(port, () => {
  console.log(`Netlify-like static server: http://localhost:${port}`)
  console.log(`  root: ${path.relative(cwd, root) || '.'}, ${headerRules.length} header rules, ${redirects.length} redirects`)
})
