// https://nuxt.com/docs/api/configuration/nuxt-config

// Prisma + Nuxt 4 compatibility configuration
// This triple configuration (alias + transpile + externals) is required because:
// 1. Official @prisma/nuxt module doesn't support Nuxt 4 yet
// 2. Nitro 2.x has module resolution conflicts with Prisma Client
// 3. SSG prerendering needs special handling for database client
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo', '@unocss/nuxt', '@nuxt/content'],

  content: {
    experimental: { 
      sqliteConnector: 'native' 
    }
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
      baseURL: 'https://myrmecophoto.fr',
    },
  },

  vite: {
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
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
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

  // linkChecker: {
  //   failOnError: true,
  // },

  experimental: {
    payloadExtraction: false, // Fix 404 payload on SSG https://github.com/nuxt/nuxt/issues/22068
  },

  devtools: { enabled: true },

  compatibilityDate: '2024-12-01',

  site: {
    url: 'https://myrmecophoto.fr',
    name: 'Myrmecophoto - Macrophotographie et Élevage de Fourmis | Myrmécologie et Biodiversité',
    description: `Découvrez Myrmecophoto, le site dédié à la macrophotographie des fourmis, à leur élevage et à l'exploration de la myrmécologie. Articles, guides pratiques, et comparatifs de matériel pour capturer la biodiversité.`,
    defaultLocale: 'fr',
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
