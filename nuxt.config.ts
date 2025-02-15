// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@unocss/nuxt'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
    },
  },

  runtimeConfig: {
    emailContact: '', // use NUXT_EMAIL_CONTACT environment variable
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
        '/api/getEncryptedEmailContact',
      ],
    },
  },

  experimental: {
    payloadExtraction: false, // Fix 404 payload on SSG https://github.com/nuxt/nuxt/issues/22068
  },

  devtools: { enabled: false },

  compatibilityDate: '2024-09-17',

  site: {
    indexable: false,
    url: 'https://myrmecophoto.fr',
    name: 'Myrmecophoto - Macrophotographie et Élevage de Fourmis | Myrmécologie et Biodiversité',
    description: `Découvrez Myrmecophoto, le site dédié à la macrophotographie des fourmis, à leur élevage et à l'exploration de la myrmécologie. Articles, guides pratiques, et comparatifs de matériel pour capturer la biodiversité.`,
    defaultLocale: 'fr', // not needed if you have @nuxtjs/i18n installed
  },
})
