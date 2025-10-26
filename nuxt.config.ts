// https://nuxt.com/docs/api/configuration/nuxt-config

// Prisma + Nuxt 4 compatibility configuration
// This triple configuration (alias + transpile + externals) is required because:
// 1. Official @prisma/nuxt module doesn't support Nuxt 4 yet
// 2. Nitro 2.x has module resolution conflicts with Prisma Client
// 3. SSG prerendering needs special handling for database client
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo', '@unocss/nuxt', '@nuxt/content', '@nuxt/eslint'],

  linkChecker: {
    // Ignore link validation rules that conflict with French content
    skipInspections: [
      'no-non-ascii-chars',
      'no-baseless',
      'no-uppercase-chars',
    ],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-96x96.png',
          sizes: '96x96',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'Myrmecophoto' },
        { name: 'theme-color', content: '#e72c27' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
      ],
    },
  },

  runtimeConfig: {
    emailContact: '', // use NUXT_EMAIL_CONTACT environment variable
    public: {
      baseURL: process.env.NUXT_SITE_URL || 'https://myrmecophoto.fr',
    },
  },

  vite: {
    optimizeDeps: {
      include: ['photoswipe', 'image-size', '@prisma/client', '@nuxt/content'],
      exclude: ['@nuxtjs/seo'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Sass core contain all mixins & variables
          // Included as dependency for all vue components
          // ex: reuse Sass vars & mixins
          additionalData: '@use "@/assets/core.scss" as *;',
        },
      },
    },
  },

  css: [
    // The entry file loaded on all pages
    '@/assets/main.scss',
  ],

  // Additional SSG optimizations
  ssr: true,

  nitro: {
    prerender: {
      routes: [
        '/api/getTaxa',
        '/api/getSpecies',
        '/api/getEncryptedEmailContact',
        '/api/__sitemap__/urls',
        '/api/__sitemap__/images',
      ],
    },
    esbuild: {
      options: {
        target: 'es2022',
      },
    },
    node: true,
    externals: {
      // Mark Prisma Client as external dependency for Nitro bundling
      // Prevents bundling issues during SSG prerendering of API routes
      external: ['@prisma/client'],
    },
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls', '/api/__sitemap__/images'],
  },

  robots: {
    groups: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/_nuxt/', '/__sitemap__/'],
      },
    ],
    sitemap: ['https://myrmecophoto.fr/sitemap.xml'],
  },

  experimental: {
    payloadExtraction: true,
    sharedPrerenderData: true,
    extractAsyncDataHandlers: true,
    typescriptPlugin: true,
  },

  devtools: { enabled: true },

  compatibilityDate: '2024-12-01',

  site: {
    url: process.env.NUXT_SITE_URL || 'https://myrmecophoto.fr',
    name: process.env.NUXT_SITE_NAME || 'Myrmecophoto',
    description:
      "Myrmecophoto : site de macrophotographie scientifique de fourmis françaises. Identification taxonomique des espèces, techniques photo macro, articles myrmécologie et guides d'équipement pour photographier les Formicidae.",
    defaultLocale: 'fr',
    author: process.env.NUXT_SITE_AUTHOR || 'Cédric Ruiu',
  },

  ogImage: {
    enabled: true,
    defaults: {
      component: 'NuxtSeo',
      width: 1200,
      height: 630,
    },
  },

  seo: {
    automaticDefaults: true,
    redirectToCanonicalSiteUrl: true,
  },

  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Cédric Ruiu',
      url: 'https://myrmecophoto.fr',
      image: '/img/cedric-ruiu-avatar.webp',
      jobTitle: [
        'Développeur Web',
        'Photographe Macro',
        'Myrmécologiste Amateur',
      ],
      description:
        'Créateur de Myrmecophoto, développeur web et photographe spécialisé en macro-photographie scientifique des fourmis.',
      knowsAbout: [
        'Myrmécologie',
        'Macro-photographie',
        'Développement Web',
        'Entomologie',
        'Taxonomie',
      ],
      sameAs: [
        'https://www.linkedin.com/in/cedric-ruiu/',
        'https://github.com/Cedric-ruiu',
      ],
      address: {
        type: 'PostalAddress',
        addressCountry: 'FR',
      },
    },
  },
})
