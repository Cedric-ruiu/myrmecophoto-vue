/** Shared Schema.org constants. */

export const SCHEMA_CONSTANTS = {
  AUTHOR: {
    '@type': 'Person',
    name: 'Cédric Ruiu',
    alternateName: 'Cedric Ruiu',
    url: 'https://myrmecophoto.fr',
    image: '/img/cedric-ruiu-avatar.webp',
    jobTitle: ['Développeur Web', 'Photographe Macro', 'Myrmécologiste Amateur'],
    description: 'Créateur de Myrmecophoto, développeur web et photographe spécialisé en macrophotographie scientifique des fourmis.',
    knowsAbout: [
      'Myrmécologie',
      'Macrophotographie',
      'Développement Web',
      'Entomologie',
      'Taxonomie',
      'Vue.js',
      'Nuxt.js',
      'JavaScript',
      'TypeScript'
    ],
    sameAs: [
      'https://www.linkedin.com/in/cedric-ruiu/',
      'https://github.com/Cedric-ruiu'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR'
    }
  } as const,

  SITE: {
    name: 'Myrmecophoto',
    url: 'https://myrmecophoto.fr',
    description: 'Site de macrophotographie scientifique de fourmis françaises avec identification taxonomique, articles myrmécologie et guides techniques.',
    inLanguage: 'fr-FR',
    about: 'Myrmécologie',
    keywords: ['myrmécologie', 'fourmis', 'Formicidae', 'macrophotographie', 'taxonomie', 'entomologie', 'identification'],
    logo: {
      '@type': 'ImageObject',
      url: 'https://myrmecophoto.fr/myrmecophoto-logo.png'
    },
    areaServed: 'FR',
    foundingDate: '2024',
    knowsAbout: ['Myrmécologie', 'Macrophotographie', 'Taxonomie', 'Entomologie']
  } as const,

  IMAGE_DEFAULTS: {
    creator: {
      '@type': 'Person',
      name: 'Cédric Ruiu'
    },
    copyrightHolder: {
      '@type': 'Person',
      name: 'Cédric Ruiu'
    },
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    acquireLicensePage: 'https://myrmecophoto.fr/about',
    copyrightNotice: '© Cédric Ruiu — Myrmecophoto',
    creditText: 'Cédric Ruiu / Myrmecophoto'
  } as const,

  BREADCRUMBS: {
    home: {
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: 'https://myrmecophoto.fr'
    },
    articles: {
      '@type': 'ListItem',
      position: 2,
      name: 'Articles',
      item: 'https://myrmecophoto.fr/articles'
    },
    taxons: {
      '@type': 'ListItem',
      position: 2,
      name: 'Taxons',
      item: 'https://myrmecophoto.fr/taxons'
    },
    about: {
      '@type': 'ListItem',
      position: 2,
      name: 'À propos',
      item: 'https://myrmecophoto.fr/about'
    }
  } as const,

  CONTACT: {
    contactType: 'Contact professionnel',
    availableLanguage: ['French', 'English'],
    areaServed: 'Worldwide',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    }
  } as const,

  SERVICES: {
    database: {
      '@type': 'Offer',
      name: 'Base de données taxonomique',
      description: 'Consultation gratuite de la base de données photographique'
    },
    articles: {
      '@type': 'Offer',
      name: 'Articles spécialisés',
      description: 'Guides et articles sur la macrophotographie et myrmécologie'
    }
  } as const,

  KEYWORDS: {
    myrmecology: ['Myrmécologie', 'Macrophotographie', 'Formicidae', 'Entomologie'],
    taxonomy: ['Formicidae', 'Taxonomie', 'Identification', 'Fourmis', 'Myrmécologie'],
    photography: ['Macrophotographie', 'Photographie scientifique', 'Techniques photographiques'],
    technical: ['Vue.js', 'Nuxt.js', 'JavaScript', 'TypeScript', 'Développement Web']
  } as const
} as const

export const SCHEMA_URLS = {
  absolute: (path: string) => `https://myrmecophoto.fr${path}`,
  image: (path: string) => `https://myrmecophoto.fr/img/${path}`,
  api: (endpoint: string) => `https://myrmecophoto.fr/api/${endpoint}`
} as const

export type SchemaAuthor = typeof SCHEMA_CONSTANTS.AUTHOR
export type SchemaSite = typeof SCHEMA_CONSTANTS.SITE
export type SchemaKeywords = keyof typeof SCHEMA_CONSTANTS.KEYWORDS