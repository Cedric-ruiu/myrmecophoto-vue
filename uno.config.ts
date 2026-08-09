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
      // Dark theme only: the `dark` class is hardcoded on <html> (see nuxt.config.ts).
      // With 'media', an OS set to light rendered `dark:prose-invert` text in light
      // colours on the dark background.
      dark: 'class',
    }),
    presetTypography(),
    presetWebFonts({
      provider: 'bunny', // default provider
      fonts: {
        // Open Sans:ital,wght@0,400;0,700;1,400 + Quicksand:wght@400;500;700
        //
        // Styles are declared weight by weight (`i` suffix = italic).
        // Do NOT use the `italic: true` option with the bunny provider: it appends
        // `i` to *every* requested weight, so no upright face is ever loaded and both
        // the logo's "photo" and the headings render slanted.
        title: [
          {
            name: 'Open Sans',
            weights: ['400', '400i', '700'],
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
      // `collections` expects one *loader* per icon set. The former
      // `{ fa6: { prefix, icons } }` shape was not recognised, and automatic
      // `@iconify-json/*` discovery does not work here: no rule was generated at all
      // and the LinkedIn / GitHub icons stayed invisible.
      collections: {
        'fa6-brands': () =>
          import('@iconify-json/fa6-brands/icons.json', { with: { type: 'json' } }).then(
            (m) => m.default,
          ),
      },
    }),
  ],
  outputToCssLayers: true,
  transformers: [transformerDirectives()],
  rules: [
    // Line numbers rather than names: `full` / `content` are not inherited by the
    // nested subgrids of the article template — see layouts/default.vue.
    ['full-width', { 'grid-column': '1 / -1' }],
    ['content-width', { 'grid-column': '2 / 3' }],
  ],
  shortcuts: {
    'container-responsive': 'w-full sm:w-[calc(100%_-_10rem)] px-5 xs:px-7.5 mx-auto lg:max-w-256 xl:max-w-320 xxl:max-w-400',
    // Horizontal rhythm of the redesign. Driven by the layout custom properties
    // (see layouts/default.vue) so full-bleed banners and the body content column
    // resolve to the exact same left edge at every viewport width.
    'gutter-x': 'px-[var(--content-padding)]',
    'measure-wide': 'mx-auto w-full max-w-[var(--content-max-width)]',
    'measure-editorial': 'mx-auto w-full max-w-[720px]',
    // Technical metadata (specimen refs, view labels, counters)
    'meta-mono': 'font-mono text-[11px] tracking-[0.05em] text-ink-4',
  },
  theme: {
    breakpoint: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1600px',
    },
    colors: {
      // Dark-only surfaces
      page: 'oklch(0.15 0.01 50)',
      'page-deep': 'oklch(0.1 0.01 50)',
      surface: 'oklch(0.19 0.01 50)',
      'surface-raised': 'oklch(0.26 0.01 50)',
      'surface-footer': 'oklch(0.11 0.01 50)',
      // Text ramp: primary → secondary → tertiary/meta
      ink: 'oklch(0.96 0.004 90)',
      'ink-2': 'oklch(0.85 0.004 90)',
      'ink-3': 'oklch(0.72 0.008 80)',
      'ink-4': 'oklch(0.6 0.01 60)',
      link: 'oklch(0.7 0.17 38)',
      'link-hover': 'oklch(0.76 0.15 55)',
    },
  },
})
