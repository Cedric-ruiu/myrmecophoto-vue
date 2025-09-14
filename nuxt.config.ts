// https://nuxt.com/docs/api/configuration/nuxt-config

// Prisma + Nuxt 4 compatibility configuration
// This triple configuration (alias + transpile + externals) is required because:
// 1. Official @prisma/nuxt module doesn't support Nuxt 4 yet
// 2. Nitro 2.x has module resolution conflicts with Prisma Client
// 3. SSG prerendering needs special handling for database client
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo', '@unocss/nuxt', '@nuxt/content'],

  linkChecker: {
    // Ignore link validation rules that conflict with French content
    skipInspections: [
      'no-non-ascii-chars',
      'no-baseless',
      'no-uppercase-chars',
    ],
  },

  content: {
    experimental: {
      sqliteConnector: 'native',
    },
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
      meta: [{ name: 'apple-mobile-web-app-title', content: 'Myrmecophoto' }],
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
    resolve: {
      alias: {
        // Fix Prisma Client browser resolution issues with Nuxt 4 + Nitro bundler
        // Without this alias, build fails with ".prisma/client/index-browser" module not found
        // This maps the browser-specific Prisma client to the correct file location
        '.prisma/client/index-browser':
          './node_modules/.prisma/client/index-browser.js',
      },
    },
  },

  css: [
    // The entry file loaded on all pages
    '@/assets/main.scss',
  ],

  build: {
    // Ensure Prisma Client is properly transpiled during build process
    // Required for SSG (Static Site Generation) compatibility
    transpile: ['@prisma/client'],
  },

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
    experimental: {
      wasm: true,
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
    payloadExtraction: false, // Fix 404 payload on SSG https://github.com/nuxt/nuxt/issues/22068
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
    compatibility: {
      // disable chromium dependency for prerendering (skips the chromium install in CIs)
      prerender: {
        chromium: false,
        resvg: false,
        sharp: false,
        'css-inline': false,
      },
    },
  },

  seo: {
    automaticDefaults: true,
    redirectToCanonicalSiteUrl: true,
  },

  // schemaOrg: {
  //   identity: definePerson({
  //     name: 'Cédric Ruiu',
  //     image: '/public/img/cedric-ruiu-avatar.webp',
  //     jobTitle: 'Senior Software Engineer',
  //     url: 'https://myrmecophoto.fr',
  //     sameAs: [
  //       'https://www.linkedin.com/in/cedric-ruiu/',
  //       'https://github.com/Cedric-ruiu',
  //     ],
  //   }),
  // },
})
