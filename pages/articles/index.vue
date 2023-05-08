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

const { data: articles } = await useAsyncData('articles', () => {
  return queryContent('articles').sort({ 'date.published': -1 }).find()
})
</script>

<template>
  <div>
    <h1>Les articles</h1>
    <div v-for="article in articles" :key="article._path">
      <NuxtLink :to="article._path">
        <h3>{{ article.title }}</h3>
      </NuxtLink>
      <p>{{ article.date.published }} - {{ article.description }}</p>
    </div>
  </div>
</template>
