/**
 * Global middleware to enforce trailing slashes for Netlify Pretty URLs compatibility
 *
 * This middleware ensures URL consistency across the application:
 * - Forces trailing slashes on all routes except root
 * - Prevents duplicate content issues for SEO
 * - Aligns with Netlify's Pretty URLs behavior
 *
 * @see https://dev.to/mornir/nuxt-netlify-and-the-trailing-slash-3gge
 */
export default defineNuxtRouteMiddleware((to) => {
  // Skip on server (prerender + SSR): with site.trailingSlash: true, both
  // /foo and /foo/ are written to foo/index.html. If this middleware runs
  // during prerender of /foo, it writes a meta-refresh that overwrites
  // the real content (race condition with concurrency: 2).
  // Netlify Pretty URLs handles slash canonicalization at HTTP level.
  if (import.meta.server) return

  // Skip middleware for:
  // - Root path
  // - API routes
  // - Static assets
  // - Special Nuxt routes
  if (
    to.path === '/' ||
    to.path.startsWith('/api/') ||
    to.path.startsWith('/_nuxt/') ||
    to.path.startsWith('/__') ||
    to.path.includes('.') // Files with extensions
  ) {
    return
  }

  // Force trailing slash if not present
  if (!to.path.endsWith('/')) {
    // Preserve query parameters and hash
    const query = to.query
    const hash = to.hash

    return navigateTo(
      {
        path: to.path + '/',
        query,
        hash,
      },
      { redirectCode: 301 }
    )
  }
})