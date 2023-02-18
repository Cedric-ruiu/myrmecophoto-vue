// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
  ],
  unocss: {
    // presets
    uno: true, // enabled `@unocss/preset-uno`
    typography: true,
    // icons: true, // enabled `@unocss/preset-icons`
    // attributify: true, // enabled `@unocss/preset-attributify`,

    // core options
    shortcuts: [],
    rules: [],
  },
  nitro: {
    prerender: {
      routes: [
        '/api/getTaxa',
        '/api/getSpecies',
      ],
    },
  },
})
