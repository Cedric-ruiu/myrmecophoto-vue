// uno.config.ts
import {
  defineConfig,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
} from 'unocss'

import presetIcons from '@unocss/preset-icons'
import presetWind4 from '@unocss/preset-wind4'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
      dark: 'media', // Active le mode dark basé sur prefers-color-scheme
    }),
    presetTypography(),
    presetWebFonts({
      provider: 'bunny', // default provider
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
    }),
    presetIcons({
      scale: 1.4,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'text-bottom',
      },
      collections: {
        fa6: {
          prefix: 'i-fa6',
          icons: 'brands-linkedin brands-github',
        },
      },
    }),
  ],
  outputToCssLayers: true,
  transformers: [transformerDirectives()],
  theme: {
    breakpoint: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1600px',
    },
  },
})
