<script setup lang="ts">
import type { BreadcrumbItem } from '~/components/PageHeader.vue'

const { path } = useRoute()
const { data: article } = await useAsyncData(`content-${path}`, () => {
  return queryCollection('content').path(path).first()
})

// SSG-safe fallbacks for article data
const articleTitle = computed(
  () => article.value?.title || 'Article Myrmecophoto',
)
const articleDescription = computed(
  () =>
    article.value?.description ||
    'Article sur la myrmécologie et macrophotographie',
)

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: 'Accueil', href: '/' },
  { label: 'Articles', href: '/articles/' },
  { label: articleTitle.value, current: true },
])

const citedTaxons = computed(() => {
  const slugs = (article.value as { taxons?: string[] } | null)?.taxons || []
  return slugs.map((slug) => {
    const [genus = '', species = ''] = slug.split('-')
    const label = species
      ? `${genus.charAt(0).toUpperCase()}${genus.slice(1)} ${species}`
      : slug
    return { slug, label }
  })
})

type TocLink = { id: string, text: string, depth: number, children?: TocLink[] }

const tocLinks = computed<TocLink[]>(() => {
  const body = (article.value as { body?: { toc?: { links?: TocLink[] } } } | null)?.body
  return body?.toc?.links || []
})

const showToc = computed(() => tocLinks.value.length >= 3)

// Tap to zoom on the article images. Same zoom levels as the taxon gallery:
// "fit" on open, double-tap / magnifier at native pixels, pinch up to 2.5x.
// Every figure of the article forms a single gallery, so the viewer also swipes
// from one image to the next.
useLightbox('.o-article', {
  initialZoomLevel: 'fit',
  secondaryZoomLevel: 1,
  maxZoomLevel: 2.5,
})

useSeoConfig({
  title: articleTitle.value,
  description: articleDescription.value,
  titleTemplate: '%s | Myrmecophoto',
  ogImageProps: {
    subtitle: 'Article Myrmécologie',
    description: articleDescription.value,
    date: article.value?.date.published,
    location: article.value?.location,
  },
  customMeta: {
    ogImageAlt: articleTitle.value,
  },
  pageType: 'article',
  schemaData: {
    article: {
      headline: articleTitle.value,
      description: articleDescription.value,
      datePublished: article.value?.date.published || '',
      dateModified:
        article.value?.date.updated || article.value?.date.published || '',
      image: {
        main: article.value?.image.main || '',
        width: 1200,
        height: 800,
      },
      tags: article.value?.tags,
      location: article.value?.location,
    },
  },
})
</script>

<template>
  <article class="pb-[clamp(72px,10vw,120px)] article-full-width-layout">
    <!-- The article has no gradient banner: the title sits straight on the page background. -->
    <nav
      aria-label="breadcrumb"
      class="mx-auto pt-2 w-full max-w-[760px] text-[13px] text-ink-4"
    >
      <ol class="flex flex-wrap items-center gap-y-1 m-0 p-0 list-none">
        <template v-for="(item, index) in breadcrumbItems" :key="item.label">
          <li v-if="index > 0" role="presentation" aria-hidden="true" class="flex">
            <span class="mx-2">/</span>
          </li>
          <li class="flex min-w-0">
            <NuxtLink
              v-if="item.href && !item.current"
              :to="item.href"
              class="text-ink-4 hover:text-link-hover transition-colors"
            >
              {{ item.label }}
            </NuxtLink>
            <span v-else :aria-current="item.current ? 'page' : undefined" class="text-ink-3">
              {{ item.label }}
            </span>
          </li>
        </template>
      </ol>
    </nav>

    <header class="mx-auto pt-[clamp(24px,4vw,40px)] w-full max-w-[760px]">
      <h1
        class="m-0 font-400 font-title text-[clamp(2rem,4.5vw,3rem)] italic leading-[1.15]"
      >
        {{ articleTitle }}
      </h1>
      <p v-if="article" class="mt-4 mb-0 text-ink-4 text-sm">
        Publié le {{ formatArticleDate(article.date.published) }}
        <template v-if="article.location"> · {{ article.location }}</template>
      </p>

      <details
        v-if="showToc"
        open
        class="bg-surface mt-7 px-[22px] py-[18px] rounded-lg"
      >
        <summary
          class="font-600 text-[13px] text-ink-3 uppercase tracking-[0.08em] cursor-pointer"
        >
          Sommaire
        </summary>
        <ol class="flex flex-col gap-2 mt-4 mb-0 pl-5 text-[14.5px] leading-[1.4]">
          <li v-for="link in tocLinks" :key="link.id">
            <a :href="`#${link.id}`">{{ link.text }}</a>
          </li>
        </ol>
      </details>
    </header>

    <ContentRenderer
      v-if="article"
      :value="article"
      class="dark:prose-invert pt-[clamp(40px,7vw,72px)] prose prose-gray o-article"
    />

    <aside
      class="flex items-start gap-5 mx-auto mt-[clamp(56px,8vw,96px)] pt-[clamp(40px,6vw,56px)] border-white/10 border-t w-full max-w-[680px]"
    >
      <img
        src="/img/cedric-ruiu-avatar.webp"
        alt="Portrait de Cédric Ruiu"
        width="64"
        height="64"
        loading="lazy"
        decoding="async"
        class="m-0 rounded-full w-16 h-16 object-cover shrink-0"
      >
      <div class="min-w-0">
        <p class="m-0 font-700 text-[15px] text-ink">
          <NuxtLink to="/about/" class="text-inherit">Cédric Ruiu</NuxtLink>
        </p>
        <p class="mt-1.5 mb-0 text-ink-3 text-sm leading-[1.6]">
          Photographe et développeur web installé à Vannes, passionné de myrmécologie depuis l'enfance. Je documente
          les fourmis de France à travers la macrophotographie taxonomique sur Myrmecophoto.
          <NuxtLink to="/about/">En savoir plus</NuxtLink>.
        </p>
      </div>
    </aside>

    <aside
      v-if="citedTaxons.length"
      class="mx-auto mt-[clamp(32px,6vw,56px)] pt-[clamp(32px,6vw,56px)] border-white/10 border-t w-full max-w-[680px]"
    >
      <h2 class="m-0 mb-4 font-400 font-title text-xl">
        Taxons cités dans cet article
      </h2>
      <ul class="flex flex-col gap-2 m-0 p-0 text-[15px] list-none">
        <li v-for="taxon in citedTaxons" :key="taxon.slug">
          <NuxtLink :to="`/taxons/${taxon.slug}/`"><i>{{ taxon.label }}</i></NuxtLink>
        </li>
      </ul>
    </aside>
  </article>
</template>

<style lang="scss">
/* this is a workaround to remove the margin-top generated from 'prose' unocss of the first child of the article and the following figures */

.o-article > :first-child {
  margin-top: 0;
}

.o-article > figure + * {
  margin-top: 0;
}

/* Reading measure: text runs at 680px, figures keep their full-bleed span.
   `width: 100%` is required: on a grid item, `margin-inline: auto` alone triggers
   content-based sizing — short headings ended up centred instead of aligned with
   the text column. */
.o-article > :not(figure, .full-width) {
  width: 100%;
  max-width: 680px;
  margin-inline: auto;
}

/* Nuxt Content wraps heading text in an anchor: it must not be painted as a link. */
.o-article :is(h2, h3, h4) a {
  color: inherit;
  text-decoration: none;
}

/* Pull-quote: accent gradient rendered as the left rule. */
.o-article blockquote {
  margin-block: 44px;
  padding: 0 0 0 24px;
  border-left: 3px solid transparent;
  border-image: linear-gradient(180deg, $color-primary, $color-secondary) 1;

  font-family: 'Open Sans', sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.5;
  color: $color-ink;

  p {
    margin: 0;
  }
}
</style>
