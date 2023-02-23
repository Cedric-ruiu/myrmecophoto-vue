// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
  ],
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
  css: [
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
