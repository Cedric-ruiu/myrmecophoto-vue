// @nuxtjs/sitemap normalizes every absolute <loc> through fixSlashes(), which uses
// site.trailingSlash = true to append "/" — including <image:loc> values. That breaks
// image URLs (foo-1200.avif/ → 404). We can't override per-image because the module
// reads siteConfig directly. The cleanest workaround is to strip the slash from
// <image:loc> entries in the final XML via the sitemap:output hook.
//
// See: node_modules/@nuxtjs/sitemap/dist/runtime/server/sitemap/urlset/normalise.js (preNormalizeEntry)

// Plain function rather than `defineNitroPlugin` ('nitropack/runtime', Nitro v2) or
// `definePlugin` ('nitro', Nitro v3): both are identity helpers, and either import
// would tie this file to one Nitro major.
interface SitemapNitroApp {
  hooks: {
    hook: (name: 'sitemap:output', handler: (ctx: { sitemap: string }) => void) => void
  }
}

export default (nitroApp: SitemapNitroApp) => {
  nitroApp.hooks.hook('sitemap:output', (ctx) => {
    ctx.sitemap = ctx.sitemap.replace(
      /(<image:loc>[^<]+?)\/<\/image:loc>/g,
      '$1</image:loc>'
    )
  })
}
