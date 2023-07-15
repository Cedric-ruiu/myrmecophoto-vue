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
    '@unocss/reset/tailwind.css',
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
})
