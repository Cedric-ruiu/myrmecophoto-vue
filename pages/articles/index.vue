<script setup lang="ts">
import { useImageData } from '~/composables/useImageData'

const { data: articles } = await useAsyncData('articles', () => {
  return queryCollection('content').order('date', 'DESC').all()
})

// SSG-safe fallback for computed values
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

const breadcrumbItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Articles', current: true },
]

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
    <PageHeader
      title="Articles : myrmécologie & macrophotographie"
      :breadcrumb-items="breadcrumbItems"
      width="narrow"
    >
      <template #metadata>
        <p class="order-4 mt-5 mb-0 max-w-[60ch] text-[15px] text-ink-3 leading-[1.7]">
          Observations de terrain et d'élevage, comportements des fourmis (essaimage, fondation de
          colonie, mutualisme avec les pucerons) et guides techniques de macrophotographie des
          <i>Formicidae</i>.
        </p>
      </template>
    </PageHeader>

    <div
      class="flex flex-col gap-[clamp(40px,6vw,64px)] mx-auto pt-[clamp(48px,8vw,88px)] pb-[clamp(72px,10vw,120px)] max-w-[820px]"
    >
      <!-- `minmax(0,1fr)` on the text column: without it, its min-content floor
           causes horizontal overflow on mobile. -->
      <article v-for="article in articles" :key="article.path">
        <NuxtLink
          :to="withTrailingSlash(article.path)"
          class="group items-start gap-4 sm:gap-6 grid grid-cols-[110px_minmax(0,1fr)] sm:grid-cols-[minmax(140px,220px)_minmax(0,1fr)]"
        >
          <div class="bg-surface rounded-[6px] aspect-[4/3] overflow-hidden">
            <img
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400 ease"
              :src="thumbnails.get(article.path)?.src"
              :width="thumbnails.get(article.path)?.width"
              :height="thumbnails.get(article.path)?.height"
              :alt="`Image de l'article : ${article.title}`"
              loading="lazy"
              decoding="async"
            >
          </div>
          <div>
            <p class="m-0 mb-1.5 text-ink-4 text-xs">
              {{ formatArticleDate(article.date.published) }}
            </p>
            <h2
              class="m-0 mb-2 font-400 font-title text-[clamp(1.2rem,2.2vw,1.5rem)] text-ink leading-[1.3]"
            >
              {{ article.title }}
            </h2>
            <p class="m-0 text-[14.5px] text-ink-3 leading-[1.65]">
              {{ article.description }}
            </p>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>
