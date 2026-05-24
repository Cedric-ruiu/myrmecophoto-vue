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
      size_mm?: number | null
      capture_site?: string | null
      country?: { name: string } | null
      description?: string | null
      taxonomy_picture?: Array<{
        file_name: string
        width?: number
        height?: number
        date?: string
        description?: string | null
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
   * Creates an enriched ImageObject schema for a single taxon picture
   */
  const createTaxonImageObjectSchema = (
    picture: NonNullable<NonNullable<SchemaFactoryOptions['taxon']>['specimens']>[number]['taxonomy_picture'][number],
    specimen: NonNullable<NonNullable<SchemaFactoryOptions['taxon']>['specimens']>[number],
    taxon: NonNullable<SchemaFactoryOptions['taxon']>,
    isPrimary: boolean
  ) => {
    const url = SCHEMA_URLS.image(`taxons/${taxon.routeGenus}-${taxon.routeSpecie}/${picture.file_name}`)
    const sizeSuffix = specimen.size_mm ? ` (${specimen.size_mm} mm)` : ''
    const locationParts = [specimen.capture_site, specimen.country?.name].filter(Boolean)

    return {
      '@type': 'ImageObject',
      '@id': `${url}#image`,
      contentUrl: url,
      url,
      caption: `${taxon.scientificName} — ${specimen.form.name}${sizeSuffix}`,
      description: picture.description || specimen.description || undefined,
      width: picture.width || 1200,
      height: picture.height || 800,
      dateCreated: picture.date,
      contentLocation: locationParts.length ? {
        '@type': 'Place',
        name: locationParts.join(', ')
      } : undefined,
      representativeOfPage: isPrimary || undefined,
      ...SCHEMA_CONSTANTS.IMAGE_DEFAULTS
    }
  }

  /**
   * Builds the list of canonical external references for a taxon.
   * Only includes URLs that can be reconstructed reliably from genus/species
   * without relying on opaque external IDs stored in our database.
   */
  const buildTaxonSameAs = (taxon: NonNullable<SchemaFactoryOptions['taxon']>): string[] => {
    const sameAs: string[] = []
    if (taxon.genus) {
      const genus = encodeURIComponent(taxon.genus)
      if (taxon.routeSpecie && taxon.routeSpecie !== 'sp.') {
        sameAs.push(`https://www.antweb.org/description.do?genus=${genus}&species=${encodeURIComponent(taxon.routeSpecie)}`)
      } else {
        sameAs.push(`https://www.antweb.org/description.do?genus=${genus}&rank=genus`)
      }
    }
    return sameAs
  }

  /**
   * Creates a Bioschemas-aligned Taxon schema
   */
  const createTaxonSchema = (options: SchemaFactoryOptions) => {
    if (!options.taxon) throw new Error('Taxon data required')

    const { taxon } = options
    const route = useRoute()
    const pageUrl = SCHEMA_URLS.absolute(route.path)
    const isSpOnly = taxon.routeSpecie === 'sp.'

    const images = taxon.specimens?.flatMap((specimen, sIdx) =>
      specimen.taxonomy_picture?.map((picture, pIdx) =>
        createTaxonImageObjectSchema(picture, specimen, taxon, sIdx === 0 && pIdx === 0)
      ) || []
    ) || []

    const sameAs = buildTaxonSameAs(taxon)

    const speciesParent = {
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
          taxonRank: 'family',
          parentTaxon: {
            '@type': 'Taxon',
            name: 'Hymenoptera',
            taxonRank: 'order',
            parentTaxon: {
              '@type': 'Taxon',
              name: 'Insecta',
              taxonRank: 'class'
            }
          }
        }
      }
    }

    const genusParent = speciesParent.parentTaxon

    const description = isSpOnly
      ? `Profil taxonomique du genre ${taxon.genus} (sous-famille ${taxon.subfamily}), spécimens documentés mais non déterminés à l'espèce. Documentation morphologique en macro-photographie scientifique.`
      : `Profil taxonomique de ${taxon.scientificName}, espèce de fourmi de la sous-famille des ${taxon.subfamily}. Documentation morphologique en macro-photographie scientifique.`

    const additionalProperty = [
      { '@type': 'PropertyValue', name: 'Family', value: 'Formicidae' },
      { '@type': 'PropertyValue', name: 'Subfamily', value: taxon.subfamily },
      { '@type': 'PropertyValue', name: 'Genus', value: taxon.genus },
      !isSpOnly && { '@type': 'PropertyValue', name: 'Species', value: taxon.routeSpecie },
      !isSpOnly && { '@type': 'PropertyValue', name: 'Year of description', value: taxon.year?.toString() },
      !isSpOnly && { '@type': 'PropertyValue', name: 'Describing author', value: taxon.researcher },
      { '@type': 'PropertyValue', name: 'Specimens documented', value: taxon.specimens?.length?.toString() }
    ].filter((prop): prop is { '@type': string; name: string; value: string } => Boolean(prop && prop.value))

    return {
      '@type': 'Taxon',
      '@id': `${pageUrl}#taxon`,
      name: taxon.scientificName,
      alternateName: !isSpOnly && taxon.researcher && taxon.year
        ? `${taxon.scientificName} ${taxon.researcher}, ${taxon.year}`
        : undefined,
      description,
      taxonRank: isSpOnly ? 'genus' : 'species',
      parentTaxon: isSpOnly ? genusParent : speciesParent,
      sameAs: sameAs.length ? sameAs : undefined,
      image: images.length ? images : undefined,
      subjectOf: { '@id': pageUrl },
      additionalProperty
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
    createCollectionSchema,
    createBreadcrumbSchema,
    createContactPointSchema
  }
}

/**
 * Type for TypeScript validation
 */
export type SchemaFactory = ReturnType<typeof useSchemaFactory>
