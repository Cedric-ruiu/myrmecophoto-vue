// uno.config.ts
import {
  defineConfig,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetWebFonts({
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
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    breakpoints: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
})
