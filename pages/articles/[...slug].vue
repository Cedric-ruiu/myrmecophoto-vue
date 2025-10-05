<script setup lang="ts">
// this catch-all route generate pages with unique articles based from Nuxt Content

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
  <article>
    <header
      class="flex flex-col bg-[linear-gradient(0deg,hsla(1.56,80%,52.94%,0.15)_0%,hsl(0,9.09%,4.31%)_100%)] ml-[50%] sm:pt-8 lg:pt-16 pb-8 pb-8 sm:pb-16 sm:pb-16 lg:pb-24 lg:pb-24 w-[100cqw] text-white text-left translate-x-[-50%]"
    >
      <h1
        class="order-2 mx-auto mt-1.5 mb-4 w-full font-normal text-4xl md:text-5xl lg:text-6xl italic uppercase container"
      >
        {{ article?.title }}
      </h1>

      <p
        class="order-3 mx-auto w-full text-gray-400 text-sm leading-none container"
      >
        Publié le {{ article?.date.published }}
      </p>

      <nav
        aria-label="breadcrumb"
        class="relative order-1 mx-auto w-full min-w-0 text-gray-400 text-sm container"
      >
        <ol class="flex items-center gap-1.5">
          <li class="hidden sm:flex min-w-0">
            <a
              href="/"
              class="group relative flex items-center gap-1.5 min-w-0 font-medium text-sm transition-colors"
              ><span class="truncate">Accueil</span></a
            >
          </li>
          <li role="presentation" aria-hidden="true" class="hidden sm:flex">
            <span class="mx-2">/</span>
          </li>
          <li class="flex min-w-0">
            <a
              href="/articles"
              class="group relative flex items-center gap-1.5 min-w-0 font-medium text-sm transition-colors"
              ><span class="truncate">Articles</span></a
            >
          </li>
          <li role="presentation" aria-hidden="true" class="flex">
            <span class="mx-2">/</span>
          </li>
          <li class="flex min-w-0">
            <p
              aria-current="page"
              class="group relative flex items-center gap-1.5 focus-visible:outline-primary min-w-0 font-semibold text-primary text-sm"
            >
              <span class="truncate">{{ article?.title }}</span>
            </p>
          </li>
        </ol>
      </nav>
    </header>

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
