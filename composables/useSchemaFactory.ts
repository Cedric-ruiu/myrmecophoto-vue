/**
 * Factory pattern for generating Schema.org schemas
 * Centralizes creation logic and prevents duplication
 */

import { SCHEMA_CONSTANTS, SCHEMA_URLS } from './useSchemaConstants'

export interface SchemaFactoryOptions {
  // Common options
  title?: string
  description?: string
  url?: string
  image?: string

  // Article-specific options
  article?: {
    headline: string
    description: string
    datePublished: string
    dateModified?: string
    image?: {
      main: string
      width?: number
      height?: number
    }
    tags?: string[]
    location?: string
  }

  // Taxon-specific options
  taxon?: {
    scientificName: string
    genus: string
    subfamily: string
    researcher: string
    year?: number
    specimens?: Array<{
      form: { name: string }
      taxonomy_picture?: Array<{
        file_name: string
        width?: number
        height?: number
        date?: string
      }>
    }>
    routeGenus?: string
    routeSpecie?: string
  }

  // Collection-specific options
  collection?: {
    itemCount: number
    collectionType: 'articles' | 'taxons'
    items?: Array<{
      path: string
      title: string
      description: string
      image: { main: string }
      date: { published: string }
    }>
    subfamilies?: Array<{
      name: string
      description?: string
      genus?: Array<{
        specie?: Array<{
          _count?: { specimen: number }
        }>
      }>
    }>
  }

  // About page-specific options
  person?: {
    hasOccupation?: boolean
    contactPoint?: boolean
  }
}

/**
 * Main factory for creating schemas
 */
export const useSchemaFactory = () => {

  /**
   * Creates a reusable Person schema
   */
  const createPersonSchema = (extended = false) => {
    const baseSchema = { ...SCHEMA_CONSTANTS.AUTHOR }

    if (extended) {
      return {
        ...baseSchema,
        '@id': 'https://myrmecophoto.fr/about#person',
        hasOccupation: [
          {
            '@type': 'Occupation',
            name: 'Développeur Web',
            occupationLocation: {
              '@type': 'Place',
              addressCountry: 'FR'
            },
            skills: ['Vue.js', 'Nuxt.js', 'JavaScript', 'TypeScript', 'Node.js']
          },
          {
            '@type': 'Occupation',
            name: 'Photographe Macro',
            occupationLocation: {
              '@type': 'Place',
              addressCountry: 'FR'
            },
            skills: ['Macro-photographie', 'Photographie scientifique', 'Éclairage macro']
          }
        ],
        worksFor: {
          '@type': 'Organization',
          name: 'Freelance'
        },
        creator: {
          '@type': 'CreativeWork',
          name: 'Myrmecophoto',
          url: 'https://myrmecophoto.fr',
          description: 'Site de macrophotographie scientifique de fourmis'
        }
      }
    }

    return baseSchema
  }

  /**
   * Creates a unique WebSite schema (to avoid duplication)
   */
  const createWebSiteSchema = () => ({
    '@type': 'WebSite',
    name: SCHEMA_CONSTANTS.SITE.name,
    url: SCHEMA_CONSTANTS.SITE.url,
    description: SCHEMA_CONSTANTS.SITE.description,
    inLanguage: SCHEMA_CONSTANTS.SITE.inLanguage,
    keywords: SCHEMA_CONSTANTS.SITE.keywords,
    about: SCHEMA_CONSTANTS.SITE.about,
    creator: createPersonSchema(),
    publisher: {
      '@type': 'Organization',
      name: SCHEMA_CONSTANTS.SITE.name,
      logo: SCHEMA_CONSTANTS.SITE.logo,
      founder: createPersonSchema()
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://myrmecophoto.fr/taxons?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  })

  /**
   * Creates an enriched Article schema
   */
  const createArticleSchema = (options: SchemaFactoryOptions) => {
    if (!options.article) throw new Error('Article data required')

    const { article } = options
    const route = useRoute()

    return {
      '@type': 'Article',
      '@id': SCHEMA_URLS.absolute(route.path),
      headline: article.headline,
      description: article.description,
      image: {
        '@type': 'ImageObject',
        url: SCHEMA_URLS.image(`articles/${article.image?.main}-1200.jpg`),
        width: article.image?.width || 1200,
        height: article.image?.height || 800,
        caption: article.headline
      },
      thumbnailUrl: SCHEMA_URLS.image(`articles/${article.image?.main}-thumbnail.jpg`),
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      author: createPersonSchema(),
      publisher: {
        '@type': 'Organization',
        name: SCHEMA_CONSTANTS.SITE.name,
        url: SCHEMA_CONSTANTS.SITE.url,
        logo: SCHEMA_CONSTANTS.SITE.logo
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': SCHEMA_URLS.absolute(route.path)
      },
      articleSection: 'Myrmécologie',
      about: SCHEMA_CONSTANTS.KEYWORDS.myrmecology,
      keywords: article.tags || SCHEMA_CONSTANTS.KEYWORDS.myrmecology,
      inLanguage: 'fr-FR',
      isAccessibleForFree: true,
      locationCreated: article.location ? {
        '@type': 'Place',
        name: article.location
      } : undefined
    }
  }

  /**
   * Creates a scientific Taxon schema with enhanced scholarly properties
   */
  const createTaxonSchema = (options: SchemaFactoryOptions) => {
    if (!options.taxon) throw new Error('Taxon data required')

    const { taxon } = options
    const route = useRoute()

    return {
      '@type': ['Taxon', 'ScholarlyArticle'],
      '@id': SCHEMA_URLS.absolute(route.path),
      name: taxon.scientificName,
      headline: `${taxon.scientificName} - Taxonomic Profile`,
      description: `Scientific taxonomic profile of ${taxon.scientificName}, a ant species from the ${taxon.subfamily} subfamily. Detailed morphological documentation with macro photography.`,
      taxonRank: 'species',

      // Taxonomic hierarchy
      parentTaxon: {
        '@type': 'Taxon',
        name: taxon.genus,
        taxonRank: 'genus',
        parentTaxon: {
          '@type': 'Taxon',
          name: taxon.subfamily,
          taxonRank: 'subfamily',
          parentTaxon: {
            '@type': 'Taxon',
            name: 'Formicidae',
            taxonRank: 'family'
          }
        }
      },

      // Scientific classification
      hasDefinedTerm: {
        '@type': 'DefinedTerm',
        name: taxon.scientificName,
        inDefinedTermSet: 'Formicidae',
        termCode: `${taxon.genus}.${taxon.routeSpecie}`
      },

      // Main taxonomic image
      image: taxon.specimens?.[0]?.taxonomy_picture?.[0] ? {
        '@type': 'ImageObject',
        url: SCHEMA_URLS.image(`taxons/${taxon.routeGenus}-${taxon.routeSpecie}/${taxon.specimens[0].taxonomy_picture[0].file_name}`),
        caption: `${taxon.scientificName} - Taxonomic view`,
        about: {
          '@type': 'Taxon',
          name: taxon.scientificName
        },
        ...SCHEMA_CONSTANTS.IMAGE_DEFAULTS
      } : undefined,

      // Scholarly article properties
      author: createPersonSchema(),
      publisher: {
        '@type': 'Organization',
        name: SCHEMA_CONSTANTS.SITE.name,
        url: SCHEMA_CONSTANTS.SITE.url,
        logo: SCHEMA_CONSTANTS.SITE.logo
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': SCHEMA_URLS.absolute(route.path)
      },

      // Scientific properties
      about: {
        '@type': 'DefinedTermSet',
        name: 'Myrmecology',
        description: 'Scientific study of ants'
      },
      keywords: ['Formicidae', 'Myrmecology', 'Taxonomy', taxon.scientificName, taxon.genus, taxon.subfamily],
      inLanguage: 'fr-FR',
      isAccessibleForFree: true,

      // Specimen data as dataset
      dataset: taxon.specimens?.length ? {
        '@type': 'Dataset',
        name: `${taxon.scientificName} specimens collection`,
        description: `Collection of ${taxon.specimens.length} documented specimens`,
        numberOfItems: taxon.specimens.length,
        creator: createPersonSchema()
      } : undefined,

      // Taxonomic properties
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Family',
          value: 'Formicidae'
        },
        {
          '@type': 'PropertyValue',
          name: 'Subfamily',
          value: taxon.subfamily
        },
        {
          '@type': 'PropertyValue',
          name: 'Genus',
          value: taxon.genus
        },
        {
          '@type': 'PropertyValue',
          name: 'Species',
          value: taxon.routeSpecie
        },
        {
          '@type': 'PropertyValue',
          name: 'Year of description',
          value: taxon.year?.toString()
        },
        {
          '@type': 'PropertyValue',
          name: 'Describing author',
          value: taxon.researcher
        },
        {
          '@type': 'PropertyValue',
          name: 'Specimens documented',
          value: taxon.specimens?.length?.toString()
        }
      ].filter(prop => prop.value) // Remove undefined values
    }
  }

  /**
   * Creates an ImageGallery schema for taxonomic collections
   */
  const createImageGallerySchema = (options: SchemaFactoryOptions) => {
    if (!options.taxon) throw new Error('Taxon data required for ImageGallery')

    const { taxon } = options

    return {
      '@type': 'ImageGallery',
      name: `Galerie taxonomique - ${taxon.scientificName}`,
      description: `Collection de macrophotographies taxonomiques de ${taxon.scientificName}`,
      creator: createPersonSchema(),
      about: {
        '@type': 'Taxon',
        name: taxon.scientificName,
        taxonRank: 'species'
      },
      associatedMedia: taxon.specimens?.flatMap(specimen =>
        specimen.taxonomy_picture?.map((picture) => ({
          '@type': 'ImageObject',
          url: SCHEMA_URLS.image(`taxons/${taxon.routeGenus}-${taxon.routeSpecie}/${picture.file_name}`),
          caption: `${taxon.scientificName} - ${specimen.form.name}`,
          width: picture.width || 1200,
          height: picture.height || 800,
          dateCreated: picture.date,
          ...SCHEMA_CONSTANTS.IMAGE_DEFAULTS
        }))
      ) || []
    }
  }

  /**
   * Creates a Collection schema for listings
   */
  const createCollectionSchema = (options: SchemaFactoryOptions) => {
    if (!options.collection) throw new Error('Collection data required')

    const { collection } = options

    if (collection.collectionType === 'articles') {
      return {
        '@type': 'ItemList',
        name: 'Articles Myrmecophoto',
        description: `${collection.itemCount} articles sur la macro-photographie et la myrmécologie`,
        numberOfItems: collection.itemCount,
        itemListElement: collection.items?.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            '@id': SCHEMA_URLS.absolute(article.path),
            headline: article.title,
            description: article.description,
            image: SCHEMA_URLS.image(`articles/${article.image.main}-1200.jpg`),
            datePublished: article.date.published,
            author: createPersonSchema(),
            publisher: {
              '@type': 'Organization',
              name: SCHEMA_CONSTANTS.SITE.name
            }
          }
        })) || []
      }
    }

    if (collection.collectionType === 'taxons') {
      return {
        '@type': 'Collection',
        name: 'Collection Taxonomique Myrmecophoto',
        description: `${collection.itemCount} espèces de fourmis documentées`,
        collectionSize: collection.itemCount,
        creator: createPersonSchema(),
        about: {
          '@type': 'Taxon',
          name: 'Formicidae',
          taxonRank: 'family'
        },
        keywords: SCHEMA_CONSTANTS.KEYWORDS.taxonomy,
        hasPart: collection.subfamilies?.map((subfamily) => ({
          '@type': 'Collection',
          name: subfamily.name,
          description: subfamily.description,
          about: {
            '@type': 'Taxon',
            name: subfamily.name,
            taxonRank: 'subfamily'
          },
          collectionSize: subfamily.genus?.reduce((total: number, genus) =>
            total + (genus.specie?.filter((specie) => (specie._count?.specimen ?? 0) > 0).length ?? 0), 0) || 0
        })) || []
      }
    }

    throw new Error('Invalid collection type')
  }

  /**
   * Creates structured breadcrumbs
   */
  const createBreadcrumbSchema = (items: Array<{ name: string; url?: string }>) => ({
    '@type': 'BreadcrumbList',
    itemListElement: [
      SCHEMA_CONSTANTS.BREADCRUMBS.home,
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: item.url || undefined
      }))
    ]
  })

  /**
   * Creates a ContactPoint schema
   */
  const createContactPointSchema = () => ({
    '@type': 'ContactPoint',
    ...SCHEMA_CONSTANTS.CONTACT
  })

  return {
    createPersonSchema,
    createWebSiteSchema,
    createArticleSchema,
    createTaxonSchema,
    createImageGallerySchema,
    createCollectionSchema,
    createBreadcrumbSchema,
    createContactPointSchema
  }
}

/**
 * Type for TypeScript validation
 */
export type SchemaFactory = ReturnType<typeof useSchemaFactory>
