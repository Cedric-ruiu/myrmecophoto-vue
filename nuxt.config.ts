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
    '@unocss/reset/tailwind.css',
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
})
