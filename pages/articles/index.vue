<script setup lang="ts">
// this route generate page with list of all articles

useHead({
  title:
    'Articles myrmécologiques et photographiques, Macro photographie des fourmis en milieu naturel ou artificiel | Myrmecophoto',
  meta: [
    {
      name: 'description',
      content:
        "Liste d'articles sur les techniques de la macro photographie ou la myrmécologie en général. Galerie représentant des macros photographies de fourmis (Formicidae).",
    },
  ],
})

// Configuration Open Graph pour la page d'index des articles
defineOgImage({
  component: 'Home',
  props: {
    title: 'Articles',
    subtitle: 'Myrmécologie & Macro-photographie',
    description: 'Découvrez nos articles sur les techniques de macro-photographie et la myrmécologie',
    siteName: 'Myrmecophoto',
    theme: '#e72c27'
  }
})

useSeoMeta({
  ogTitle: 'Articles - Myrmécologie et Macro-photographie | Myrmecophoto',
  ogDescription: "Découvrez nos articles sur les techniques de macro-photographie et la myrmécologie. Galerie de macrophotographies de fourmis (Formicidae).",
  ogImage: 'https://myrmecophoto.fr/img/home-wall-1.avif',
  ogImageAlt: 'Myrmecophoto - Articles sur la myrmécologie',
  twitterCard: 'summary_large_image',
})

const { data: articles } = await useAsyncData('articles', () => {
  return queryCollection('content').order('date', 'DESC').all()
})
</script>

<template>
  <div>
    <h1 class="mb-16 text-white text-6xl font-normal italic uppercase">
      Tous les articles
    </h1>
    <article
      v-for="article in articles"
      :key="article.path"
      class="flex flex-row gap-4 mb-16"
    >
      <NuxtLink
        :to="article.path"
        class="block relative w-20 md:w-80 h-20 md:h-60 flex-[1_0_auto] md:flex-none horizontal-bottom-line-gradient"
        ><img
          class="rounded-md w-full h-full object-cover"
          :src="'/img/articles/' + article?.image?.main + '-thumbnail.jpg'"
          alt="Photo 3"
      /></NuxtLink>
      <NuxtLink :to="article.path" class="prose prose-gray dark:prose-invert">
        <h3 class="line-clamp-2 mt-0 mb-2">{{ article.title }}</h3>
        <p class="line-clamp-5 mb-2 mt-2">{{ article.description }}</p>
        <small
          >Publié le:
          {{ new Date(article.date.published).toLocaleDateString() }}</small
        >
      </NuxtLink>
    </article>
    <!-- The cursor elements -->
    <div class="cursor cursor--small"></div>
    <canvas class="cursor cursor--canvas" resize></canvas>
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
