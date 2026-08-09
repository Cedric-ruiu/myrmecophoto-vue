/** Applies the Schema.org graph matching each page type. */

import { useSchemaFactory, type SchemaFactoryOptions } from '../useSchemaFactory'
import { SCHEMA_CONSTANTS } from '../useSchemaConstants'

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

export const usePageSchemas = () => {
  const factory = useSchemaFactory()

  /**
   * Returns the canonical URL of the current page (with trailing slash).
   */
  const getPageUrl = () => {
    const route = useRoute()
    return `https://myrmecophoto.fr${route.path.endsWith('/') ? route.path : route.path + '/'}`
  }

  const applyHomepageSchemas = () => {
    const pageUrl = getPageUrl()
    const collectionId = 'https://myrmecophoto.fr/#collection'

    const schemas = [
      // Merge into the WebSite emitted by the module (same @id)
      {
        ...factory.createWebSiteSchema(),
        '@id': 'https://myrmecophoto.fr/#website'
      },

      // Homepage-specific WebPage (merged with module default via @id)
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        about: { '@id': collectionId },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://myrmecophoto.fr/img/home-wall.avif',
          caption: 'Collection de macrophotographies de fourmis',
          ...SCHEMA_CONSTANTS.IMAGE_DEFAULTS,
        },
        mainEntity: {
          '@type': 'Collection',
          '@id': collectionId,
          name: 'Collection Taxonomique de Fourmis',
          description: 'Base de données photographique de spécimens de fourmis avec identification taxonomique scientifique',
          creator: factory.createPersonSchema()
        },
        breadcrumb: factory.createBreadcrumbSchema([])
      }
    ]

    useSchemaOrg(schemas)
  }

  const applyArticleSchemas = (options: SchemaFactoryOptions) => {
    if (!options.article) return

    const pageUrl = getPageUrl()
    const articleSchema = factory.createArticleSchema(options)
    const articleImage = articleSchema.image as { '@id'?: string } | undefined

    const schemas = [
      articleSchema,
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        about: { '@id': articleSchema['@id'] },
        mainEntity: { '@id': articleSchema['@id'] },
        primaryImageOfPage: articleImage?.['@id'] ? { '@id': articleImage['@id'] } : undefined,
        breadcrumb: factory.createBreadcrumbSchema([
          { name: 'Articles', url: 'https://myrmecophoto.fr/articles/' },
          { name: options.article.headline }
        ])
      }
    ]

    useSchemaOrg(schemas)
  }

  const applyArticleListSchemas = (options: SchemaFactoryOptions) => {
    if (!options.collection) return

    const pageUrl = getPageUrl()

    const schemas = [
      {
        '@type': ['WebPage', 'CollectionPage'],
        '@id': `${pageUrl}#webpage`,
        mainEntity: factory.createCollectionSchema({
          collection: { ...options.collection, collectionType: 'articles' }
        }),
        breadcrumb: factory.createBreadcrumbSchema([
          { name: 'Articles' }
        ]),
        about: ['Myrmécologie', 'Macrophotographie', 'Formicidae', 'Entomologie', 'Techniques photographiques']
      }
    ]

    useSchemaOrg(schemas)
  }

  const applyTaxonSchemas = (options: SchemaFactoryOptions) => {
    if (!options.taxon) return

    const pageUrl = getPageUrl()
    const taxonSchema = factory.createTaxonSchema(options)
    const primaryImage = Array.isArray(taxonSchema.image) ? taxonSchema.image[0] : undefined

    const schemas = [
      taxonSchema,
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        about: { '@id': taxonSchema['@id'] },
        mainEntity: { '@id': taxonSchema['@id'] },
        primaryImageOfPage: primaryImage ? { '@id': primaryImage['@id'] } : undefined,
        breadcrumb: factory.createBreadcrumbSchema([
          { name: 'Taxons', url: 'https://myrmecophoto.fr/taxons/' },
          { name: options.taxon.scientificName }
        ])
      }
    ]

    useSchemaOrg(schemas)
  }

  const applyTaxonListSchemas = (options: SchemaFactoryOptions) => {
    if (!options.collection) return

    const pageUrl = getPageUrl()

    const schemas = [
      {
        '@type': ['WebPage', 'CollectionPage'],
        '@id': `${pageUrl}#webpage`,
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
        isAccessibleForFree: true
      },
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
        knowsAbout: ['Myrmécologie', 'Macrophotographie', 'Taxonomie', 'Entomologie'],
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
              description: 'Guides et articles sur la macrophotographie et myrmécologie'
            }
          ]
        }
      }
    ]

    useSchemaOrg(schemas)
  }

  const applyAboutSchemas = () => {
    const pageUrl = getPageUrl()

    const schemas = [
      {
        '@type': ['WebPage', 'AboutPage'],
        '@id': `${pageUrl}#webpage`,
        mainEntity: factory.createPersonSchema(true),
        breadcrumb: factory.createBreadcrumbSchema([
          { name: 'À propos' }
        ])
      }
    ]

    useSchemaOrg(schemas)
  }

  const detectPageType = (route: ReturnType<typeof useRoute>): PageType | null => {
    const path = route.path.replace(/\/$/, '') || '/'

    if (path === '/') return 'homepage'
    if (path === '/about') return 'about'
    if (path === '/articles') return 'article-list'
    if (path === '/taxons') return 'taxon-list'
    if (path.startsWith('/articles/')) return 'article'
    if (path.startsWith('/taxons/')) return 'taxon'

    return null
  }

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

  const applyPageSchemas = (options: PageSchemaOptions) => {
    const route = useRoute()

    const pageType = options.pageType || detectPageType(route)

    if (!pageType) {
      applyFallbackSchema(options)
      return
    }

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

export type PageSchemas = ReturnType<typeof usePageSchemas>
