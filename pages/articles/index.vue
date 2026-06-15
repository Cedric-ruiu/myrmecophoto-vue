<script setup lang="ts">
import { useImageData } from '~/composables/useImageData'

// this route generate page with list of all articles

const { data: articles } = await useAsyncData('articles', () => {
  return queryCollection('content').order('date', 'DESC').all()
})

// Fallback SSG-safe pour computed
const articleCount = computed(() => articles?.value?.length || 0)

const thumbnails = computed(() => {
  const map = new Map<string, { src: string, width: number, height: number }>()
  for (const article of articles.value || []) {
    const main = article?.image?.main
    if (!main) continue
    const data = useImageData(`articles/${main}`)
    map.set(article.path, {
      src: data.thumbnailSrc,
      width: data.thumbnailWidth,
      height: data.thumbnailHeight,
    })
  }
  return map
})

useSeoConfig({
  title: 'Articles myrmécologie & macrophotographie',
  description:
    "Articles d'observation myrmécologique et tutoriels de macrophotographie : comportements de fourmis, élevage, matériel et techniques photo.",
  ogImageProps: {
    subtitle: 'Articles & Guides',
    description: `${articleCount.value} articles sur la macrophotographie et la myrmécologie`,
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
    <PageHeader title="Articles : myrmécologie & macrophotographie">
      <template #metadata>
        <p class="order-4 max-w-prose text-gray-300 text-sm">
          Observations de terrain et d'élevage, comportements des fourmis (essaimage, fondation de
          colonie, mutualisme avec les pucerons) et guides techniques de macrophotographie :
          l'ensemble des articles de Myrmecophoto consacrés à la myrmécologie et à la photographie
          macro des <i>Formicidae</i>.
        </p>
      </template>
    </PageHeader>
    <article
      v-for="article in articles"
      :key="article.path"
      class="flex flex-row gap-4 mb-16 pt-12 sm:pt-20 lg:pt-28"
    >
      <NuxtLink
        :to="article.path.endsWith('/') ? article.path : article.path + '/'"
        :aria-label="`Lire l'article : ${article.title}`"
        class="block horizontal-bottom-line-gradient relative flex-[1_0_auto] md:flex-none w-20 md:w-80 h-20 md:h-60"
        ><img
          class="rounded-md w-full h-full object-cover"
          :src="thumbnails.get(article.path)?.src || ('/img/articles/' + article?.image?.main + '-thumbnail.jpg')"
          :width="thumbnails.get(article.path)?.width"
          :height="thumbnails.get(article.path)?.height"
          :alt="`Image de l'article : ${article.title}`"
          loading="lazy"
          decoding="async"
      ></NuxtLink>
      <NuxtLink :to="article.path.endsWith('/') ? article.path : article.path + '/'" class="dark:prose-invert prose prose-gray">
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
