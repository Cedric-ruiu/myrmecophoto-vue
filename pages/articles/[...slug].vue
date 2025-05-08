<script setup lang="ts">
// this catch-all route generate pages with unique articles based from Nuxt Content

const { path } = useRoute()
const { data: article } = await useAsyncData(`content-${path}`, () => {
  return queryCollection('content').path(path).first()
})

const description = computed(() => article.value?.description)

useHead({
  titleTemplate: '%s | Article | Myrmecophoto',
  meta: [{ name: 'description', content: description || '' }],
})

useSeoMeta(article?.value?.seo || {}) // <-- Nuxt Robots

useSchemaOrg([
  defineArticle({
    image: useAbsoluteUrl(`/img/articles/${article.value?.image.main}.jpg`),
    thumbnailUrl: useAbsoluteUrl(
      `/img/articles/${article.value?.image.main}-thumbnail.jpg`,
    ),
    datePublished: `${article.value?.date.published}`,
    dateModified: `${article.value?.date.updated || article.value?.date.published}`,
  }),
])

defineOgImageComponent('NuxtSeo', {
  theme: '#e72c27',
  colorMode: 'dark',
})
</script>

<template>
  <article>
    <header
      class="flex flex-col pb-8 sm:pb-16 lg:pb-24 sm:pt-8 lg:pt-16 pb-8 sm:pb-16 lg:pb-24 text-white w-[100cqw] text-left ml-[50%] translate-x-[-50%] bg-[linear-gradient(0deg,hsla(1.56,80%,52.94%,0.15)_0%,hsl(0,9.09%,4.31%)_100%)]"
    >
      <h1
        class="container mx-auto w-full order-2 mt-1.5 mb-4 text-4xl md:text-5xl lg:text-6xl font-normal italic uppercase"
      >
        {{ article?.title }}
      </h1>

      <p
        class="container mx-auto w-full order-3 text-sm text-gray-400 leading-none"
      >
        Publié le {{ article?.date.published }}
      </p>

      <nav
        aria-label="breadcrumb"
        class="container mx-auto w-full order-1 relative min-w-0 text-sm text-gray-400"
      >
        <ol class="flex items-center gap-1.5">
          <li class="min-w-0 hidden sm:flex">
            <a
              href="/"
              class="group relative flex items-center gap-1.5 text-sm min-w-0 font-medium transition-colors"
              ><span class="truncate">Accueil</span></a
            >
          </li>
          <li role="presentation" aria-hidden="true" class="hidden sm:flex">
            <span class="mx-2">/</span>
          </li>
          <li class="flex min-w-0">
            <a
              href="/articles"
              class="group relative flex items-center gap-1.5 text-sm min-w-0 font-medium transition-colors"
              ><span class="truncate">Articles</span></a
            >
          </li>
          <li role="presentation" aria-hidden="true" class="flex">
            <span class="mx-2">/</span>
          </li>
          <li class="flex min-w-0">
            <a
              href="/articles/breadcrumb"
              aria-current="page"
              class="group relative flex items-center gap-1.5 text-sm min-w-0 focus-visible:outline-primary text-primary font-semibold"
              ><span class="truncate">{{ article?.title }}</span></a
            >
          </li>
        </ol>
      </nav>
    </header>

    <ContentRenderer
      v-if="article"
      :value="article"
      class="pt-8 mx-auto prose o-article sm:pt-16 lg:pt-24 dark:prose-invert sm:prose-base lg:prose-lg max-w-prose md:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
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
