<script setup lang="ts">
useHead({
  title:
    'Myrmecophoto : macro photographie, taxonomie & articles sur les fourmis',
  meta: [
    {
      name: 'description',
      content:
        "Macro photographie taxonomiques de fourmis aidant à l'identification des spécimens, articles sur les techniques de macro photographie et sujet sur la myrmécologie.",
    },
  ],
})

// Configuration Open Graph pour la page d'index des taxons
defineOgImage({
  component: 'Home',
  props: {
    title: 'Taxonomie',
    subtitle: 'Macrophotographies Taxonomiques',
    description: 'Découvrez notre collection de macrophotographies taxonomiques de fourmis pour l\'identification scientifique',
    siteName: 'Myrmecophoto',
    theme: '#e72c27'
  }
})

useSeoMeta({
  ogTitle: 'Taxonomie - Macrophotographies scientifiques | Myrmecophoto',
  ogDescription: "Collection de macrophotographies taxonomiques de fourmis aidant à l'identification des spécimens. Référence scientifique en myrmécologie.",
  ogImage: 'https://myrmecophoto.fr/img/home-wall-1.avif',
  ogImageAlt: 'Myrmecophoto - Collection taxonomique de fourmis',
  twitterCard: 'summary_large_image',
})

const { data: subfamilies } = useNuxtData('taxa')
const { data: species } = useNuxtData('species')
</script>

<template>
  <div>
    <h1 class="text-white text-6xl font-normal italic uppercase">
      Macro Photographie Taxonomique
    </h1>
    <div v-for="subfamily in subfamilies" :key="subfamily.id">
      <div class="prose prose-gray dark:prose-invert">
        <h2>{{ subfamily.name }}</h2>
        <p>{{ subfamily.description }}</p>
      </div>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5">
        <template v-for="genus in subfamily.genus">
          <template v-for="specie in genus.specie">
            <SpecieCard
              v-if="specie._count.specimen"
              :key="specie.id"
              class="not-prose"
              :id="specie.id"
              :taxon="`${genus.name} ${specie.name}`"
              :researcher-name="specie.researcher.name"
              :year-discover="specie.year"
              :species="species"
              :genus="genus"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
