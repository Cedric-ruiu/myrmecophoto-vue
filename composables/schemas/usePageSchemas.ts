/**
 * Specialized composables for applying schemas according to page type
 * Uses the factory pattern to generate appropriate schemas
 */

import { useSchemaFactory, type SchemaFactoryOptions } from '../useSchemaFactory'

/**
 * Supported page types
 */
export type PageType =
  | 'homepage'
  | 'article'
  | 'article-list'
  | 'taxon'
  | 'taxon-list'
  | 'about'
  | 'contact'

export interface PageSchemaOptions extends SchemaFactoryOptions {
  pageType?: PageType
  title?: string
  description?: string
}

/**
 * Automatically applies appropriate schemas according to page type
 */
export const usePageSchemas = () => {
  const factory = useSchemaFactory()

  /**
   * Applies schemas for the homepage
   */
  const applyHomepageSchemas = () => {
    const schemas = [
      // Main WebSite schema (unique across the entire app)
      factory.createWebSiteSchema(),

      // Homepage-specific WebPage
      {
        '@type': 'WebPage',
        name: 'Myrmecophoto - Accueil',
        description: 'Découvrez le monde fascinant des fourmis à travers la macrophotographie scientifique. Collection taxonomique, articles spécialisés et guides techniques.',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://myrmecophoto.fr/img/home-wall.avif',
          caption: 'Collection de macrophotographies de fourmis',
        },
        mainEntity: {
          '@type': 'Collection',
          name: 'Collection Taxonomique de Fourmis',
          description: 'Base de données photographique de spécimens de fourmis avec identification taxonomique scientifique',
          creator: factory.createPersonSchema()
        },
        breadcrumb: factory.createBreadcrumbSchema([])
      }
    ]

    useSchemaOrg(schemas)
  }

  /**
   * Applies schemas for an individual article page
   */
  const applyArticleSchemas = (options: SchemaFactoryOptions) => {
    if (!options.article) return

    const schemas = [
      factory.createArticleSchema(options),
      {
        '@type': 'WebPage',
        breadcrumb: factory.createBreadcrumbSchema([
          { name: 'Articles', url: 'https://myrmecophoto.fr/articles' },
          { name: options.article.headline }
        ])
      }
    ]

    useSchemaOrg(schemas)
  }

  /**
   * Applies schemas for the article list
   */
  const applyArticleListSchemas = (options: SchemaFactoryOptions) => {
    if (!options.collection) return

    const schemas = [
      {
        '@type': 'CollectionPage',
        name: 'Articles Myrmécologie & Macro-photographie',
        description: "Collection d'articles spécialisés sur les techniques de macro-photographie et la myrmécologie scientifique.",
        mainEntity: factory.createCollectionSchema({
          collection: { ...options.collection, collectionType: 'articles' }
        }),
        breadcrumb: factory.createBreadcrumbSchema([
          { name: 'Articles' }
        ]),
        about: ['Myrmécologie', 'Macro-photographie', 'Formicidae', 'Entomologie', 'Techniques photographiques'],
        inLanguage: 'fr-FR'
      }
    ]

    useSchemaOrg(schemas)
  }

  /**
   * Applies schemas for an individual taxonomic page
   */
  const applyTaxonSchemas = (options: SchemaFactoryOptions) => {
    if (!options.taxon) return

    const schemas = [
      factory.createTaxonSchema(options),
      factory.createImageGallerySchema(options),
      {
        '@type': 'WebPage',
        name: `${options.taxon.scientificName} - Page taxonomique`,
        description: `Macrophotographies taxonomiques de ${options.taxon.scientificName} - Identification, morphologie et caractéristiques de cette espèce de fourmi.`,
        breadcrumb: factory.createBreadcrumbSchema([
          { name: 'Taxons', url: 'https://myrmecophoto.fr/taxons' },
          { name: options.taxon.scientificName }
        ])
      }
    ]

    useSchemaOrg(schemas)
  }

  /**
   * Applies schemas for the taxonomic list
   */
  const applyTaxonListSchemas = (options: SchemaFactoryOptions) => {
    if (!options.collection) return

    const schemas = [
      {
        '@type': 'CollectionPage',
        name: 'Collection Taxonomique - Fourmis de France',
        description: 'Base de données photographique taxonomique des fourmis avec identification scientifique des espèces.',
        mainEntity: factory.createCollectionSchema({
          collection: { ...options.collection, collectionType: 'taxons' }
        }),
        breadcrumb: factory.createBreadcrumbSchema([
          { name: 'Taxons' }
        ]),
        about: {
          '@type': 'DefinedTermSet',
          name: 'Classification Taxonomique des Formicidae',
          description: 'Système de classification scientifique des fourmis selon la taxonomie moderne'
        },
        inLanguage: 'fr-FR',
        isAccessibleForFree: true
      },
      // Site organization
      {
        '@type': 'Organization',
        '@id': 'https://myrmecophoto.fr/#organization',
        name: 'Myrmecophoto',
        url: 'https://myrmecophoto.fr',
        logo: {
          '@type': 'ImageObject',
          url: 'https://myrmecophoto.fr/myrmecophoto-logo.png'
        },
        description: 'Site personnel de documentation taxonomique et photographique des fourmis françaises',
        founder: factory.createPersonSchema(),
        knowsAbout: ['Myrmécologie', 'Macro-photographie', 'Taxonomie', 'Entomologie'],
        areaServed: 'FR',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services Myrmecophoto',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Base de données taxonomique',
              description: 'Consultation gratuite de la base de données photographique'
            },
            {
              '@type': 'Offer',
              name: 'Articles spécialisés',
              description: 'Guides et articles sur la macro-photographie et myrmécologie'
            }
          ]
        }
      }
    ]

    useSchemaOrg(schemas)
  }

  /**
   * Applies schemas for the About page
   */
  const applyAboutSchemas = () => {
    const schemas = [
      {
        '@type': 'AboutPage',
        name: 'À propos - Cédric Ruiu',
        description: 'Découvrez Cédric Ruiu, créateur de Myrmecophoto, développeur web et photographe spécialisé en macro-photographie scientifique des fourmis.',
        mainEntity: factory.createPersonSchema(true),
        breadcrumb: factory.createBreadcrumbSchema([
          { name: 'À propos' }
        ]),
        inLanguage: 'fr-FR'
      },
      // Contact page
      {
        '@type': 'ContactPage',
        name: 'Contact - Myrmecophoto',
        description: 'Contactez Cédric Ruiu pour des collaborations, questions techniques ou échanges sur la myrmécologie',
        mainEntity: factory.createContactPointSchema()
      }
    ]

    useSchemaOrg(schemas)
  }

  /**
   * Auto-detect page type from route if not provided
   */
  const detectPageType = (route: ReturnType<typeof useRoute>): PageType | null => {
    const path = route.path

    // Route-based detection with smart defaults
    if (path === '/') return 'homepage'
    if (path === '/about') return 'about'
    if (path === '/articles') return 'article-list'
    if (path === '/taxons') return 'taxon-list'
    if (path.startsWith('/articles/')) return 'article'
    if (path.startsWith('/taxons/')) return 'taxon'

    return null
  }

  /**
   * Apply fallback schema for unknown page types
   */
  const applyFallbackSchema = (options: PageSchemaOptions) => {
    const route = useRoute()
    const schemas = [
      {
        '@type': 'WebPage',
        name: options.title || 'Page Myrmecophoto',
        description: options.description || 'Page du site Myrmecophoto',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': SCHEMA_URLS.absolute(route.path)
        },
        breadcrumb: factory.createBreadcrumbSchema([
          { name: options.title || 'Page' }
        ]),
        inLanguage: 'fr-FR',
        isAccessibleForFree: true
      }
    ]
    useSchemaOrg(schemas)
  }

  /**
   * Main function that applies schemas according to page type with intelligent defaults
   */
  const applyPageSchemas = (options: PageSchemaOptions) => {
    const route = useRoute()

    // Auto-detect page type if not provided
    const pageType = options.pageType || detectPageType(route)

    if (!pageType) {
      // Apply fallback schema for unknown page types
      applyFallbackSchema(options)
      return
    }

    // Apply schemas based on detected or provided page type
    switch (pageType) {
      case 'homepage':
        applyHomepageSchemas()
        break

      case 'article':
        if (options.article) {
          applyArticleSchemas(options)
        } else {
          console.warn('Article data required for article page type')
          applyFallbackSchema(options)
        }
        break

      case 'article-list':
        applyArticleListSchemas(options)
        break

      case 'taxon':
        if (options.taxon) {
          applyTaxonSchemas(options)
        } else {
          console.warn('Taxon data required for taxon page type')
          applyFallbackSchema(options)
        }
        break

      case 'taxon-list':
        applyTaxonListSchemas(options)
        break

      case 'about':
        applyAboutSchemas()
        break

      default:
        console.warn(`Page type "${pageType}" not supported, applying fallback schema`)
        applyFallbackSchema(options)
    }
  }

  return {
    applyPageSchemas,
    applyHomepageSchemas,
    applyArticleSchemas,
    applyArticleListSchemas,
    applyTaxonSchemas,
    applyTaxonListSchemas,
    applyAboutSchemas
  }
}

/**
 * Type for validation
 */
export type PageSchemas = ReturnType<typeof usePageSchemas>
