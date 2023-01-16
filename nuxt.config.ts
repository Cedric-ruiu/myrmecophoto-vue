// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  nitro: {
    prerender: {
      routes: ['/api/getTaxa'],
    },
  },
})
