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

useSeoConfig({
  title: articleTitle.value,
  description: articleDescription.value,
  titleTemplate: '%s | Article | Myrmecophoto',
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

    <ContentRenderer
      v-if="article"
      :value="article"
      class="dark:prose-invert mx-auto pt-8 sm:pt-16 lg:pt-24 max-w-prose md:max-w-3xl lg:max-w-4xl xl:max-w-5xl prose prose-gray o-article sm:prose-base lg:prose-lg"
    />
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
