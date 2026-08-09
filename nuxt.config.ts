// https://nuxt.com/docs/api/configuration/nuxt-config

// Prisma v7 + Nuxt 4 + SSG configuration
// 1. Official @prisma/nuxt module doesn't support Nuxt 4 yet
// 2. Prisma v7 uses driver adapter (@prisma/adapter-better-sqlite3) wrapping a native
//    module — better-sqlite3 must stay external so Rollup/Nitro never bundle the .node binary
// 3. Prisma Client is generated locally (prisma/generated/client) and only runs at build
//    time during SSG prerender of API routes
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
        // Dark theme only (see `dark: 'class'` in uno.config.ts)
        class: 'dark',
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
      include: ['photoswipe', 'image-size', '@nuxt/content'],
      exclude: ['@nuxtjs/seo'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Auto-injected into every component, so Sass vars & mixins are always in scope.
          additionalData: '@use "@/assets/core.scss" as *;',
        },
      },
    },
  },

  css: [
    '@/assets/main.scss',
  ],

  ssr: true,

  nitro: {
    prerender: {
      routes: [
        '/api/getTaxa',
        '/api/getSpecies',
        '/api/getEncryptedEmailContact',
        '/api/__sitemap__/urls',
      ],
      concurrency: 2,
    },
    esbuild: {
      options: {
        target: 'es2022',
      },
    },
    node: true,
    externals: {
      // Keep the better-sqlite3 native module and its Prisma adapter external so
      // Rollup/Nitro never try to bundle the .node binary during SSG prerender.
      external: ['@prisma/adapter-better-sqlite3', 'better-sqlite3'],
    },
  },

  sitemap: {
    // Page URLs already include trailing slashes (emitted by urls.ts).
    // Note: @nuxtjs/sitemap also appends "/" to <image:loc> values (driven by
    // site.trailingSlash); that is patched out by server/plugins/sitemap-image-loc-fix.ts.
    sources: ['/api/__sitemap__/urls'],
    excludeAppSources: true, // Prevent auto-discovery of pages to avoid duplicates
  },

  robots: {
    groups: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/__sitemap__/'],
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
    trailingSlash: true,
  },

  ogImage: {
    enabled: true,
    zeroRuntime: true,
    buildCache: true,
    defaults: {
      component: 'NuxtSeo',
      width: 1200,
      height: 630,
      colorMode: 'dark',
      theme: '#e72c27',
      siteLogo: '/myrmecophoto-logo.png',
      emojis: false,
    },
    security: {
      renderTimeout: 30000,
      imageFetchTimeout: 5000,
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
        'Créateur de Myrmecophoto, développeur web et photographe spécialisé en macrophotographie scientifique des fourmis.',
      knowsAbout: [
        'Myrmécologie',
        'Macrophotographie',
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
