<script setup lang="ts">
// this catch-all route generate pages with unique articles based from Nuxt Content

import type { BreadcrumbItem } from '~/components/PageHeader.vue'

const { path } = useRoute()
const { data: article } = await useAsyncData(`content-${path}`, () => {
  return queryCollection('content').path(path).first()
})

// Fallbacks SSG-safe pour données d'article
const articleTitle = computed(
  () => article.value?.title || 'Article Myrmecophoto',
)
const articleDescription = computed(
  () =>
    article.value?.description ||
    'Article sur la myrmécologie et macro-photographie',
)

// Breadcrumb items for PageHeader component
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
  <article class="article-full-width-layout">
    <PageHeader
      :title="articleTitle"
      :date="article?.date.published"
      :breadcrumb-items="breadcrumbItems"
    />

    <nav
      v-if="showToc"
      aria-label="Sommaire de l'article"
      class="dark:prose-invert mx-auto mt-8 sm:mt-12 lg:mt-16 px-6 py-4 max-w-prose md:max-w-3xl lg:max-w-4xl xl:max-w-5xl prose prose-gray sm:prose-base lg:prose-sm"
    >
      <p class="m-0 mb-2 font-semibold text-gray-300 text-sm uppercase tracking-wider">
        Sommaire
      </p>
      <ol class="my-0">
        <li v-for="link in tocLinks" :key="link.id">
          <a :href="`#${link.id}`">{{ link.text }}</a>
        </li>
      </ol>
    </nav>

    <ContentRenderer
      v-if="article"
      :value="article"
      class="dark:prose-invert mx-auto pt-8 sm:pt-16 lg:pt-24 max-w-prose md:max-w-3xl lg:max-w-4xl xl:max-w-5xl prose prose-gray o-article sm:prose-base lg:prose-lg"
    />

    <aside
      class="dark:prose-invert flex items-start gap-4 mx-auto mt-16 pt-8 sm:pt-12 lg:pt-16 max-w-prose md:max-w-3xl lg:max-w-4xl xl:max-w-5xl border-white/10 border-t prose prose-gray"
    >
      <img
        src="/img/cedric-ruiu-avatar.webp"
        alt="Portrait de Cédric Ruiu"
        width="80"
        height="80"
        loading="lazy"
        decoding="async"
        class="m-0 rounded-full w-20 h-20 object-cover shrink-0"
      >
      <div class="min-w-0">
        <p class="m-0 font-semibold">
          <NuxtLink to="/about/">Cédric Ruiu</NuxtLink>
        </p>
        <p class="m-0 text-gray-300 text-sm">
          Photographe et développeur web installé à Vannes, passionné de myrmécologie depuis l'enfance. Je documente
          les fourmis de France à travers la macrophotographie taxonomique sur Myrmecophoto.
          <NuxtLink to="/about/">En savoir plus</NuxtLink>.
        </p>
      </div>
    </aside>

    <aside
      v-if="citedTaxons.length"
      class="dark:prose-invert mx-auto mt-16 pt-8 sm:pt-12 lg:pt-16 max-w-prose md:max-w-3xl lg:max-w-4xl xl:max-w-5xl border-white/10 border-t prose prose-gray"
    >
      <h2>Taxons cités dans cet article</h2>
      <ul>
        <li v-for="taxon in citedTaxons" :key="taxon.slug">
          <NuxtLink :to="`/taxons/${taxon.slug}/`"><i>{{ taxon.label }}</i></NuxtLink>
        </li>
      </ul>
    </aside>
  </article>
</template>

<style>
/* this is a workaround to remove the margin-top generated from 'prose' unocss of the first child of the article and the following figures */

.o-article > :first-child {
  margin-top: 0;
}

.o-article > figure + * {
  margin-top: 0;
}
</style>
