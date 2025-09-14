/**
 * Configuration options for SEO metadata
 *
 * @interface SeoConfigOptions
 */
interface SeoConfigOptions {
  /**
   * Page title for SEO (REQUIRED)
   * Used for <title>, Open Graph and Twitter Cards
   * @example "About - Who am I?"
   */
  title: string

  /**
   * Page description for SEO (REQUIRED)
   * Used for meta description, Open Graph and Twitter Cards
   * @example "Discover Cédric Ruiu, web developer and photographer passionate about myrmecology."
   */
  description: string

  /**
   * Custom props for NuxtSeo OG image component (RECOMMENDED)
   * @example { subtitle: "Developer & Photographer", description: "Creator of Myrmecophoto" }
   */
  ogImageProps?: Record<string, any>

  /**
   * Rules for search engine indexing (OPTIONAL)
   * @default 'index,follow'
   * @example 'noindex,follow' for a private page
   */
  robotsRule?: string

  /**
   * Article section/category (OPTIONAL)
   * @default 'Myrmécologie'
   * @example 'Taxonomy' or 'Macro-photography'
   */
  articleSection?: string

  /**
   * Additional custom metadata (OPTIONAL)
   * @example { ogImageAlt: 'Alternative image description' }
   */
  customMeta?: Record<string, any>

  /**
   * Custom title template (OPTIONAL)
   * @example '%s | Article | Myrmecophoto'
   */
  titleTemplate?: string

  /**
   * Static Open Graph image URL (OPTIONAL)
   * If not provided, uses automatic NuxtSeo generation
   * @example 'https://myrmecophoto.fr/img/home-wall-1.avif'
   */
  ogImageUrl?: string

  /**
   * Specific Twitter image URL (OPTIONAL)
   * If not provided, uses ogImageUrl or automatic generation
   */
  twitterImage?: string
}

/**
 * Centralized SEO composable for Myrmecophoto
 *
 * Automatically generates all necessary SEO metadata:
 * - Automatic canonical URL
 * - Complete Open Graph metadata
 * - Optimized Twitter Cards
 * - Myrmecology keywords
 * - Uniform OG style (#e72c27, dark mode)
 * - Author information (Cédric Ruiu)
 *
 * @param options - Page SEO configuration
 * @returns Configuration objects for debugging
 *
 * @example
 * ```typescript
 * // Simple page
 * useSeoConfig({
 *   title: 'About - Who am I?',
 *   description: 'Discover Cédric Ruiu, creator of Myrmecophoto'
 * })
 *
 * // Page with custom OG image
 * useSeoConfig({
 *   title: 'Articles on myrmecology',
 *   description: 'Collection of scientific articles',
 *   ogImageProps: {
 *     subtitle: 'Articles & Guides',
 *     description: `${articleCount.value} articles available`
 *   }
 * })
 *
 * // Page with static image
 * useSeoConfig({
 *   title: 'Home - Myrmecophoto',
 *   description: 'Ant macro-photography website',
 *   ogImageUrl: '/img/home-wall-1.avif', // Will be automatically prefixed with site.url
 *   twitterImage: '/img/home-wall-1.avif'
 * })
 * ```
 *
 * @since 2024
 */
export function useSeoConfig(options: SeoConfigOptions) {
  const {
    title,
    description,
    ogImageProps = {},
    robotsRule = 'index,follow',
    articleSection = 'Myrmécologie',
    customMeta = {},
    titleTemplate,
    ogImageUrl,
    twitterImage,
  } = options

  // Automatic canonical URL
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = process.env.NUXT_SITE_URL || 'https://myrmecophoto.fr'
  const siteName = process.env.NUXT_SITE_NAME || 'Myrmecophoto'
  const siteAuthor = process.env.NUXT_SITE_AUTHOR || 'Cédric Ruiu'
  const canonicalUrl = `${siteUrl}${route.path}`

  // useHead configuration
  const headConfig = {
    title,
    titleTemplate,
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        name: 'author',
        content: siteAuthor,
      },
      {
        name: 'keywords',
        content:
          'myrmécologie, fourmis, Formicidae, macro-photographie, taxonomie, entomologie, identification',
      },
      {
        property: 'article:author',
        content: siteAuthor,
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
  }

  // defineOgImageComponent configuration - Uniform NuxtSeo style
  const ogImageConfig = {
    title,
    description,
    theme: '#e72c27',
    colorMode: 'dark',
    siteLogo: '/myrmecophoto-logo.png',
    width: 1200,
    height: 630,
    ...ogImageProps,
  }

  // useSeoMeta configuration - Complete metadata
  const seoMetaConfig = {
    // SEO & Robots
    robots: robotsRule,

    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogLocale: 'fr_FR',
    ogSiteName: siteName,
    ogUrl: canonicalUrl,
    ogImage:
      ogImageUrl?.startsWith('http') ? ogImageUrl : 
      ogImageUrl ? `${siteUrl}${ogImageUrl}` :
      `${siteUrl}/__og-image__/image${route.path}.png`,

    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterSite: '@myrmecophoto',
    twitterCreator: '@cedric_ruiu',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage:
      twitterImage?.startsWith('http') ? twitterImage :
      twitterImage ? `${siteUrl}${twitterImage}` :
      ogImageUrl?.startsWith('http') ? ogImageUrl :
      ogImageUrl ? `${siteUrl}${ogImageUrl}` :
      `${siteUrl}/__og-image__/image${route.path}.png`,

    // Theme and appearance
    themeColor: '#e72c27',
    colorScheme: 'light dark',
    viewport: 'width=device-width, initial-scale=1',

    // Content type
    articleSection,

    // Custom metadata
    ...customMeta,
  }

  // Apply configurations
  useHead(headConfig)
  defineOgImageComponent('NuxtSeo', ogImageConfig)
  useSeoMeta(seoMetaConfig)

  return {
    headConfig,
    ogImageConfig,
    seoMetaConfig,
  }
}

/*
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 📚 COMPLETE USAGE GUIDE - useSeoConfig
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🎯 PROPERTIES BY PRIORITY
 *
 * ✅ REQUIRED (always fill)
 * • title       - Critical SEO title for ranking
 * • description - Essential meta description
 *
 * 🔶 RECOMMENDED (depending on page type)
 * • ogImageProps - Customize generated Open Graph image
 * • articleSection - Content category (default: "Myrmécologie")
 *
 * ⚙️ OPTIONAL (special cases)
 * • ogImageUrl    - Static OG image (otherwise auto generation)
 * • titleTemplate - Custom title template
 * • robotsRule    - Control indexing (default: 'index,follow')
 * • twitterImage  - Specific Twitter image
 * • customMeta    - Additional metadata
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 📋 USAGE EXAMPLES BY PAGE TYPE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🏠 HOME PAGE (with static image)
 * useSeoConfig({
 *   title: 'Myrmecophoto: macro photography, taxonomy & articles about ants',
 *   description: 'Taxonomic macro photography of ants helping with specimen identification',
 *   ogImageUrl: '/img/home-wall-1.avif', // Will be automatically prefixed with site.url
 *   twitterImage: '/img/home-wall-1.avif',
 *   ogImageProps: {
 *     subtitle: 'Macro Photography & Myrmecology',
 *     description: 'Discover the fascinating world of ants'
 *   }
 * })
 *
 * 👤 SIMPLE PAGE (About, Contact)
 * useSeoConfig({
 *   title: 'About - Who am I?',
 *   description: 'Discover Cédric Ruiu, web developer and photographer passionate about myrmecology',
 *   ogImageProps: {
 *     subtitle: 'Developer & Photographer',
 *     description: 'Creator of Myrmecophoto'
 *   }
 * })
 *
 * 📚 LIST PAGE (Articles, Taxons with dynamic data)
 * const articleCount = computed(() => articles?.value?.length || 0) // IMPORTANT: SSG-safe fallback
 *
 * useSeoConfig({
 *   title: 'Myrmecological and photographic articles',
 *   description: 'List of articles on macro photography techniques and myrmecology',
 *   ogImageProps: {
 *     subtitle: 'Articles & Guides',
 *     description: `${articleCount.value} articles on macro-photography`
 *   },
 *   articleSection: 'Macro-photography'
 * })
 *
 * 📄 DYNAMIC PAGE (Individual article, Specific taxon)
 * // IMPORTANT: SSG-safe fallbacks for async data
 * const articleTitle = computed(() => article.value?.title || 'Article Myrmecophoto')
 * const articleDescription = computed(() => article.value?.description || 'Myrmecology article')
 *
 * useSeoConfig({
 *   title: articleTitle.value,
 *   description: articleDescription.value,
 *   titleTemplate: '%s | Article | Myrmecophoto',
 *   ogImageProps: {
 *     subtitle: 'Myrmecology Article',
 *     description: articleDescription.value,
 *     date: article.value?.date.published,
 *     location: article.value?.location
 *   }
 * })
 *
 * 🔬 TAXONOMIC PAGE (Ant species)
 * const scientificName = computed(() => {
 *   if (!species.value) return 'Taxon Myrmecophoto'
 *   return `${species.value.genus.name} ${species.value.name}`
 * })
 *
 * useSeoConfig({
 *   title: scientificName.value,
 *   description: `Taxonomic macro-photographs of ${scientificName.value}`,
 *   ogImageProps: {
 *     subtitle: species.value?.subfamily || 'Formicidae',
 *     description: `${species.value?.researcher} ${species.value?.year || ''}`
 *   },
 *   articleSection: 'Taxonomy'
 * })
 *
 * 🚫 PRIVATE PAGE (Admin, Maintenance)
 * useSeoConfig({
 *   title: 'Maintenance page',
 *   description: 'Site under maintenance',
 *   robotsRule: 'noindex,nofollow'
 * })
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚡ AUTOMATIC FEATURES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🔗 Canonical URL generated automatically: {siteUrl}{route.path}
 * 👤 Author metadata added: from environment variables
 * 🏷️ Myrmecology keywords: "myrmécologie, fourmis, Formicidae, macro-photographie, taxonomie, entomologie, identification"
 * 🎨 Uniform OG style: Theme #e72c27, dark mode, Myrmecophoto logo
 * 🐦 Twitter Cards: @myrmecophoto, @cedric_ruiu
 * 📱 Mobile configuration: viewport, themeColor, colorScheme
 * 🖼️ OG Images: Automatic fallback to NuxtSeo generation if no URL provided
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚠️ IMPORTANT TECHNICAL NOTES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 🏗️ SSG-SAFE: Always use computed() with fallbacks for async data
 *    ❌ WRONG: title: article.value?.title
 *    ✅ CORRECT: title: computed(() => article.value?.title || 'Default')
 *
 * 🖼️ OG IMAGES:
 *    • Without ogImageUrl -> automatic NuxtSeo generation
 *    • With ogImageUrl -> static image (absolute URLs required)
 *    • Netlify compatible via runtimeBrowser: true in nuxt.config.ts
 *
 * 🌐 ABSOLUTE URLS: Environment variables used for SSG-safe URL generation
 *
 * 📊 DYNAMIC DATA: Computed with fallbacks to avoid SSG errors
 *    const count = computed(() => data?.value?.length || 0)
 *
 * 🔄 COMPATIBILITY: Compatible with useAsyncData, useNuxtData, queryCollection
 */
