/**
 * Composable for privacy-friendly analytics with Plausible
 * Only loads in production environment
 */
export const useAnalytics = () => {
  const { $router } = useNuxtApp()
  const config = useRuntimeConfig()

  const initAnalytics = () => {
    // Only load analytics in production
    if (process.env.NODE_ENV !== 'production') return

    // Load Plausible script
    const script = document.createElement('script')
    script.defer = true
    script.src = 'https://plausible.io/js/script.js'
    script.setAttribute('data-domain', 'myrmecophoto.fr')
    document.head.appendChild(script)
  }

  const trackEvent = (name: string, props?: Record<string, string | number>) => {
    // Only track in production
    if (process.env.NODE_ENV !== 'production') return

    // Check if plausible is loaded
    if (typeof window !== 'undefined' && 'plausible' in window) {
      const plausible = (window as any).plausible
      if (props) {
        plausible(name, { props })
      } else {
        plausible(name)
      }
    }
  }

  const trackPageView = (path?: string) => {
    // Auto-tracked by Plausible, but can be called manually for SPA navigation
    if (process.env.NODE_ENV !== 'production') return

    if (typeof window !== 'undefined' && 'plausible' in window) {
      const plausible = (window as any).plausible
      plausible('pageview', { u: path || window.location.href })
    }
  }

  return {
    initAnalytics,
    trackEvent,
    trackPageView
  }
}