import { usePageSchemas, type PageType, type PageSchemaOptions } from './schemas/usePageSchemas'
import type { SchemaFactoryOptions } from './useSchemaFactory'

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
   * @example 'https://myrmecophoto.fr/img/home-wall.avif'
   */
  ogImageUrl?: string

  /**
   * Specific Twitter image URL (OPTIONAL)
   * If not provided, uses ogImageUrl or automatic generation
   */
  twitterImage?: string

  /**
   * Page type for automatic Schema.org generation (OPTIONAL - Auto-detected from route)
   * When provided, explicitly sets the schema type. If not provided, auto-detects from route path.
   *
   * Auto-detection rules:
   * - '/' → 'homepage'
   * - '/about' → 'about'
   * - '/articles' → 'article-list'
   * - '/taxons' → 'taxon-list'
   * - '/articles/*' → 'article'
   * - '/taxons/*' → 'taxon'
   * - Other routes → fallback WebPage schema
   *
   * Manual override examples:
   * - 'homepage': WebSite + WebPage + Collection schemas
   * - 'article': Article + breadcrumbs + mainEntityOfPage
   * - 'article-list': CollectionPage + ItemList for articles
   * - 'taxon': Enhanced Taxon + ScholarlyArticle + ImageGallery + Dataset
   * - 'taxon-list': Collection + Organization for taxonomic database
   * - 'about': AboutPage + Person + ContactPage
   *
   * @example 'homepage', 'article', 'taxon', 'taxon-list', 'about' (or leave undefined for auto-detection)
   */
  pageType?: PageType

  /**
   * Schema.org data for structured data generation (OPTIONAL)
   * Provides content-specific data for automatic schema generation
   * Required when using pageType for dynamic content pages
   *
   * @example
   * // For articles:
   * { article: { headline: 'My Article', datePublished: '2024-01-01', tags: ['myrmecology'] } }
   *
   * // For taxons:
   * { taxon: { scientificName: 'Lasius niger', genus: 'Lasius', subfamily: 'Formicinae' } }
   *
   * // For collections:
   * { collection: { itemCount: 42, collectionType: 'articles', items: [...] } }
   */
  schemaData?: SchemaFactoryOptions
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
 * // Auto-detected from route
 * useSeoConfig({
 *   title: 'About - Who am I?',
 *   description: 'Discover Cédric Ruiu'
 * })
 *
 * // Dynamic content with data
 * useSeoConfig({
 *   title: scientificName.value,
 *   pageType: 'taxon',
 *   schemaData: { taxon: { scientificName: '...', genus: '...' } }
 * })
 * ```
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
    pageType,
    schemaData = {},
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
    ogImage: ogImageUrl
      ? (ogImageUrl.startsWith('http') ? ogImageUrl : `${siteUrl}${ogImageUrl}`)
      : `${siteUrl}/__og-image__/image${route.path}.png`,

    // Twitter Cards
    twitterCard: 'summary_large_image',
    twitterSite: '@myrmecophoto',
    twitterCreator: '@cedric_ruiu',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: twitterImage
      ? (twitterImage.startsWith('http') ? twitterImage : `${siteUrl}${twitterImage}`)
      : ogImageUrl
        ? (ogImageUrl.startsWith('http') ? ogImageUrl : `${siteUrl}${ogImageUrl}`)
        : `${siteUrl}/__og-image__/image${route.path}.png`,

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

  // Always apply Schema.org (either explicit pageType or auto-detected)
  const pageSchemas = usePageSchemas()
  pageSchemas.applyPageSchemas({
    pageType,
    title,
    description,
    ...schemaData
  })

  return {
    headConfig,
    ogImageConfig,
    seoMetaConfig,
  }
}

/*
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 📚 USAGE EXAMPLES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * // Standard pages (auto-detected from route)
 * useSeoConfig({
 *   title: 'About - Who am I?',
 *   description: 'Discover Cédric Ruiu...'
 * })
 *
 * // Dynamic content with Schema.org
 * useSeoConfig({
 *   title: scientificName.value,
 *   pageType: 'taxon',
 *   schemaData: {
 *     taxon: {
 *       scientificName: 'Lasius niger',
 *       genus: 'Lasius',
 *       specimens: [...]
 *     }
 *   }
 * })
 *
 * // Custom OG image
 * useSeoConfig({
 *   title: 'Articles',
 *   description: '...',
 *   ogImageProps: {
 *     subtitle: 'Macro Photography',
 *     description: `${count.value} articles`
 *   }
 * })
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🔧 ADDING NEW PAGE TYPE
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * 1. Add type to @schemas/usePageSchemas.ts:
 *    export type PageType = '...' | 'my-new-type'
 *
 * 2. Add schema factory in @useSchemaFactory.ts:
 *    const createMyNewTypeSchema = (options) => ({ '@type': 'MySchema', ... })
 *
 * 3. Add detection rule in @schemas/usePageSchemas.ts:
 *    if (path.startsWith('/my-path/')) return 'my-new-type'
 *
 * 4. Add case in applyPageSchemas switch:
 *    case 'my-new-type': applyMyNewTypeSchemas(options); break
 *
 * 5. Use: useSeoConfig({ pageType: 'my-new-type', schemaData: {...} })
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ⚡ AUTO-DETECTION: '/' → homepage, '/about' → about, '/articles/*' → article, '/taxons/*' → taxon
 * 🎯 FEATURES: Automatic canonical URLs, OG images, Schema.org, breadcrumbs
 * 🏗️ SSG-SAFE: Use computed() with fallbacks for dynamic data
 */
