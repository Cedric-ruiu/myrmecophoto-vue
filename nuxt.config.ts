// https://nuxt.com/docs/api/configuration/nuxt-config

// Prisma v7 + Nuxt 4 + SSG configuration
// 1. Official @prisma/nuxt module doesn't support Nuxt 4 yet
// 2. Prisma v7 uses driver adapter (@prisma/adapter-better-sqlite3) wrapping a native
//    module — better-sqlite3 must stay external so Rollup/Nitro never bundle the .node binary
// 3. Prisma Client is generated locally (prisma/generated/client) and only runs at build
//    time during SSG prerender of API routes
export default defineNuxtConfig({
  modules: ['@nuxtjs/seo', '@unocss/nuxt', '@nuxt/content', '@nuxt/eslint'],

  content: {
    build: {
      // No code blocks in the articles: skip Shiki, which Vite otherwise discovers
      // at runtime in development and reloads the page for.
      markdown: { highlight: false },
    },
  },

  linkChecker: {
    // Ignore link validation rules that conflict with French content
    skipInspections: [
      'no-non-ascii-chars',
      'no-baseless',
      'no-uppercase-chars',
    ],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
        // Dark theme only (see `dark: 'class'` in uno.config.ts)
        class: 'dark',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon-96x96.png',
          sizes: '96x96',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'apple-mobile-web-app-title', content: 'Myrmecophoto' },
        { name: 'theme-color', content: '#e72c27' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
        },
      ],
      script: [
        {
          // `crossorigin` is required because the site sends
          // Cross-Origin-Embedder-Policy: require-corp (see netlify.toml): the remote
          // host answers with `Access-Control-Allow-Origin: *`, so a CORS-mode request
          // satisfies COEP while a plain no-cors one would be blocked.
          // 'low' renders the tag after the app's own scripts (unhead groups head
          // tags by type, so it still comes before the meta tags).
          defer: true,
          src: 'https://stats.cedric-ruiu.fr/m.js',
          'data-website-id': 'efd1bb96-5ca9-4636-9b01-7c6396fe9b7b',
          'data-domains': 'myrmecophoto.fr',
          crossorigin: 'anonymous',
          tagPriority: 'low',
        },
      ],
    },
  },

  runtimeConfig: {
    emailContact: '', // use NUXT_EMAIL_CONTACT environment variable
    public: {
      baseURL: process.env.NUXT_SITE_URL || 'https://myrmecophoto.fr',
    },
  },

  vite: {
    optimizeDeps: {
      // @vue/devtools-core and photoswipe/lightbox (dynamic import): discovered at
      // runtime otherwise, which reloads the dev server on the first page view.
      include: ['photoswipe', 'photoswipe/lightbox', 'image-size', '@nuxt/content', '@vue/devtools-core'],
      exclude: ['@nuxtjs/seo'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Auto-injected into every component, so Sass vars & mixins are always in scope.
          additionalData: '@use "@/assets/core.scss" as *;',
        },
      },
    },
  },

  css: [
    '@/assets/main.scss',
  ],

  ssr: true,

  prerender: {
    routes: [
      '/api/getEncryptedEmailContact',
      '/api/__sitemap__/urls',
    ],
  },

  nitro: {
    // Nitro v3 (Nuxt 5) ignores `esbuild` and `externals` (NUXT_B9001) and the site
    // generates the same output without them: drop both when upgrading.
    prerender: {
      // Builder-specific: not part of the top-level `prerender` option.
      concurrency: 2,
    },
    esbuild: {
      options: {
        target: 'es2022',
      },
    },
    node: true,
    externals: {
      // Keep the better-sqlite3 native module and its Prisma adapter external so
      // Rollup/Nitro never try to bundle the .node binary during SSG prerender.
      external: ['@prisma/adapter-better-sqlite3', 'better-sqlite3'],
    },
  },

  sitemap: {
    // Page URLs already include trailing slashes (emitted by urls.ts).
    // Note: @nuxtjs/sitemap also appends "/" to <image:loc> values (driven by
    // site.trailingSlash); that is patched out by server/plugins/sitemap-image-loc-fix.ts.
    sources: ['/api/__sitemap__/urls'],
    excludeAppSources: true, // Prevent auto-discovery of pages to avoid duplicates
  },

  robots: {
    groups: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/api/', '/__sitemap__/'],
      },
    ],
    sitemap: ['https://myrmecophoto.fr/sitemap.xml'],
  },

  // Opt into Nuxt 5 defaults ahead of the upgrade. Among them, payloadExtraction
  // defaults to 'client': the initial render reads the payload inlined in the HTML,
  // client-side navigation still loads the extracted _payload.json files.
  future: {
    compatibilityVersion: 5,
  },

  experimental: {
    // sharedPrerenderData already defaults to true.
    extractAsyncDataHandlers: true,
    // Server-rendered 404.html (served by Netlify for unknown paths) instead of an
    // empty SPA shell.
    prerenderErrorPages: true,
    typescriptPlugin: true,
    // Build client and server one after the other: UnoCSS global mode shares its
    // state across Vite environments, so concurrent builds leak server-only classes
    // (OG image templates) into the client CSS. See unocss/unocss#5483.
    parallelBuild: false,
  },

  devtools: { enabled: true },

  compatibilityDate: '2024-12-01',

  site: {
    url: process.env.NUXT_SITE_URL || 'https://myrmecophoto.fr',
    name: process.env.NUXT_SITE_NAME || 'Myrmecophoto',
    description:
      "Myrmecophoto : site de macrophotographie scientifique de fourmis françaises. Identification taxonomique des espèces, techniques photo macro, articles myrmécologie et guides d'équipement pour photographier les Formicidae.",
    defaultLocale: 'fr',
    author: process.env.NUXT_SITE_AUTHOR || 'Cédric Ruiu',
    trailingSlash: true,
  },

  ogImage: {
    enabled: true,
    zeroRuntime: true,
    buildCache: true,
    defaults: {
      // colorMode, theme and siteLogo: prop defaults of OgImage/NuxtSeo.satori.vue
      // (nuxt-og-image v7 only accepts image options here).
      width: 1200,
      height: 630,
      emojis: false,
    },
    security: {
      renderTimeout: 30000,
      imageFetchTimeout: 5000,
    },
    // sharp is only needed for JPEG output and is not installed. With zeroRuntime,
    // nuxt-og-image skips its own "sharp missing" detection and keeps the sharp
    // binding, so the dev server crashes on `import "sharp"`.
    compatibility: {
      dev: { sharp: false },
      prerender: { sharp: false },
      runtime: { sharp: false },
    },
  },

  seo: {
    automaticDefaults: true,
    redirectToCanonicalSiteUrl: true,
    // X builds its cards from Open Graph: no twitter:* tags, from nuxt-seo-utils
    // or nuxt-og-image (unhead flags them as deprecated).
    automaticTwitterTags: false,
  },

  // Bundled by @nuxtjs/seo v6 and enabled by default: not wanted on this static site.
  aiReady: false,
  skewProtection: false,

  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Cédric Ruiu',
      url: 'https://cedric-ruiu.fr',
      image: '/img/cedric-ruiu-avatar.webp',
      jobTitle: [
        'Développeur web freelance',
        'Photographe macro',
        'Myrmécologiste amateur',
      ],
      description:
        'Passionné d\'entomologie, créateur de Myrmecophoto et développeur web freelance près de Vannes.',
      knowsAbout: [
        'Myrmécologie',
        'Macrophotographie',
        'Développement Web',
        'Entomologie',
        'Taxonomie',
      ],
      sameAs: [
        'https://www.linkedin.com/in/cedric-ruiu/',
        'https://github.com/Cedric-ruiu',
      ],
      address: {
        type: 'PostalAddress',
        addressCountry: 'FR',
      },
    },
  },
})
