<script setup lang="ts">
// this route generate page with list of all articles

const { data: articles } = await useAsyncData('articles', () => {
  return queryCollection('content').order('date', 'DESC').all()
})

// Fallback SSG-safe pour computed
const articleCount = computed(() => articles?.value?.length || 0)

useSeoConfig({
  title: 'Articles myrmécologie & macro-photographie | Myrmecophoto',
  description:
    "Liste d'articles sur les techniques de la macro photographie ou la myrmécologie en général. Galerie représentant des macros photographies de fourmis (Formicidae).",
  ogImageProps: {
    subtitle: 'Articles & Guides',
    description: `${articleCount.value} articles sur la macro-photographie et la myrmécologie`,
  },
  customMeta: {
    ogImageAlt: 'Myrmecophoto - Articles sur la myrmécologie',
  },
  pageType: 'article-list',
  schemaData: {
    collection: {
      itemCount: articleCount.value,
      collectionType: 'articles',
      items: articles.value,
    },
  },
})
</script>

<template>
  <div>
    <PageHeader title="Tous les articles" />
    <article
      v-for="article in articles"
      :key="article.path"
      class="flex flex-row gap-4 mb-16 pt-12 sm:pt-20 lg:pt-28"
    >
      <NuxtLink
        :to="article.path"
        :aria-label="`Lire l'article : ${article.title}`"
        class="block horizontal-bottom-line-gradient relative flex-[1_0_auto] md:flex-none w-20 md:w-80 h-20 md:h-60"
        ><img
          class="rounded-md w-full h-full object-cover"
          :src="'/img/articles/' + article?.image?.main + '-thumbnail.jpg'"
          :alt="`Image de l'article : ${article.title}`"
      ></NuxtLink>
      <NuxtLink :to="article.path" class="dark:prose-invert prose prose-gray">
        <h3 class="mt-0 mb-2 line-clamp-2">{{ article.title }}</h3>
        <p class="mt-2 mb-2 line-clamp-5">{{ article.description }}</p>
        <small
          >Publié le:
          {{ new Date(article.date.published).toLocaleDateString() }}</small
        >
      </NuxtLink>
    </article>
    <!-- The cursor elements -->
    <div class="cursor--small cursor"/>
    <canvas class="cursor--canvas cursor" resize/>
  </div>
</template>

<style lang="scss">
body.tutorial {
  --color-text: #fff;
  --color-bg: #171717;
  --color-link: #f00;

  background-color: var(--color-bg);
}

.page {
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  &__inner {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
