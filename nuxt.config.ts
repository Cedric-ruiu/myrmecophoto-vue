// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
    },
  },
  runtimeConfig: {
    public: {
      emailContact: '', // overridden by NUXT_PUBLIC_EMAIL_CONTACT environment variable
    },
  },
  unocss: {
    uno: true,
    typography: true,
    preflight: true,
    webFonts: {
      provider: 'google', // default provider
      fonts: {
        // <link href="https://fonts.googleapis.com/css?family=Open+Sans:400i|Quicksand:400,500,700" rel="stylesheet">
        title: [
          {
            name: 'Open Sans',
            weights: ['400'],
            italic: true,
          },
        ],
        text: [
          {
            name: 'Quicksand',
            weights: ['400', '500', '700'],
          },
        ],
      },
    },
    shortcuts: [],
    rules: [],
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
  },
  css: [
    // The entry file loaded on all pages
    '@/assets/main.scss',
  ],
  nitro: {
    prerender: {
      routes: [
        '/api/getTaxa',
        '/api/getSpecies',
      ],
    },
  },
})
