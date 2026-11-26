import {
  usePageSchemas,
  type PageType
} from './schemas/usePageSchemas'
import type { SchemaFactoryOptions } from './useSchemaFactory'

interface SeoConfigOptions {
  /**
   * Page title for SEO
   * Used for <title> and Open Graph
   * @example "About - Who am I?"
   */
  title: string

  /**
   * Page description for SEO
   * Used for meta description and Open Graph
   * @example "Discover Cédric Ruiu, web developer and photographer passionate about myrmecology."
   */
  description: string

  /**
   * Custom props for NuxtSeo OG image component
   * @example { subtitle: "Developer & Photographer", description: "Creator of Myrmecophoto" }
   */
  ogImageProps?: Record<string, string | number | boolean | undefined>

  /**
   * Rules for search engine indexing
   * @default 'index,follow'
   * @example 'noindex,follow' for a private page
   */
  robotsRule?: string

  /**
   * Article section/category
   * @default 'Myrmécologie'
   * @example 'Taxonomy' or 'Macro-photography'
   */
  articleSection?: string

  /**
   * Additional custom metadata
   * @example { ogImageAlt: 'Alternative image description' }
   */
  customMeta?: Record<string, string | number | boolean>

  /**
   * Custom title template
   * @example '%s | Article | Myrmecophoto'
   */
  titleTemplate?: string

  /**
   * Static Open Graph image URL
   * If not provided, uses automatic NuxtSeo generation
   * @example 'https://myrmecophoto.fr/img/home-wall.avif'
   */
  ogImageUrl?: string

  /**
   * Page type for automatic Schema.org generation (auto-detected from route)
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
   * - 'error': generic WebPage (error page, whatever its URL)
   *
   * @example 'homepage', 'article', 'taxon', 'taxon-list', 'about' (or leave undefined for auto-detection)
   */
  pageType?: PageType

  /**
   * Schema.org data for structured data generation
   * Provides content-specific data for automatic schema generation
   * Required when using pageType for dynamic content pages
   *
   * @example
   * // For articles:
   * { article: { headline: 'My Article', datePublished: '2024-01-01' } }
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
    pageType,
    schemaData = {},
  } = options

  // Automatic canonical URL with trailing slash (Netlify Pretty URLs compatibility)
  const route = useRoute()
  const siteUrl = process.env.NUXT_SITE_URL || 'https://myrmecophoto.fr'
  const siteName = process.env.NUXT_SITE_NAME || 'Myrmecophoto'
  const siteAuthor = process.env.NUXT_SITE_AUTHOR || 'Cédric Ruiu'

  const routePath = route.path === '/'
    ? route.path
    : route.path.endsWith('/') ? route.path : route.path + '/'

  const canonicalUrl = `${siteUrl}${routePath}`

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
          'myrmécologie, fourmis, Formicidae, macrophotographie, taxonomie, entomologie, identification',
      },
      {
        property: 'article:author',
        content: siteAuthor,
      },
    ],
    // No canonical on noindex pages (error page): once prerendered as 404.html it
    // would point to a URL that does not exist.
    link: robotsRule.includes('noindex')
      ? []
      : [
          {
            rel: 'canonical' as const,
            href: canonicalUrl,
          },
        ],
  }

  // defineOgImage configuration — constants stay out of the URL, keeping
  // `/_og/s/*` paths under the 200-char threshold and avoiding the
  // hashed-payload prerender slowdown: width/height live in nuxt.config.ts
  // `ogImage.defaults`, colorMode/theme/siteLogo are the component's prop defaults.
  const ogImageConfig = {
    title,
    description,
    ...ogImageProps,
  }

  const isArticle = pageType === 'article'
  const articleMeta = isArticle && schemaData.article
    ? {
        articlePublishedTime: schemaData.article.datePublished,
        articleModifiedTime:
          schemaData.article.dateModified || schemaData.article.datePublished,
      }
    : {}

  const seoMetaConfig = {
    robots: robotsRule,

    ogTitle: title,
    ogDescription: description,
    ogType: isArticle ? 'article' as const : 'website' as const,
    ogLocale: 'fr_FR',
    ogSiteName: siteName,
    ogUrl: canonicalUrl,
    // Without ogImageUrl, nuxt-og-image provides og:image (and its dimensions).
    ...(ogImageUrl && {
      ogImage: ogImageUrl.startsWith('http') ? ogImageUrl : `${siteUrl}${ogImageUrl}`,
    }),

    themeColor: '#e72c27',
    colorScheme: 'light dark' as const,
    viewport: 'width=device-width, initial-scale=1',

    articleSection,
    ...articleMeta,

    ...customMeta,
  }

  useHead(headConfig)
  // nuxt-og-image owns the og:image tag group, so its alt must go through the module options
  const ogImageAlt = customMeta.ogImageAlt
  defineOgImage('NuxtSeo.satori', ogImageConfig, ogImageAlt ? { alt: String(ogImageAlt) } : undefined)
  useSeoMeta(seoMetaConfig)

  const pageSchemas = usePageSchemas()
  pageSchemas.applyPageSchemas({
    pageType,
    title,
    description,
    ...schemaData,
  })

  return {
    headConfig,
    ogImageConfig,
    seoMetaConfig,
  }
}

/*
 * Adding a new page type:
 * 1. Extend PageType in ./schemas/usePageSchemas.ts
 * 2. Add its factory in ./useSchemaFactory.ts
 * 3. Add its path rule to the auto-detection in ./schemas/usePageSchemas.ts
 * 4. Add its case to the applyPageSchemas switch
 */
