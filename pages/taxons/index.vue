<script setup lang="ts">
useHead({
  title: 'Myrmecophoto : macro photographie, taxonomie & articles sur les fourmis',
  meta: [
    { name: 'description', content: 'Macro photographie taxonomiques de fourmis aidant à l\'identification des spécimens, articles sur les techniques de macro photographie et sujet sur la myrmécologie.' },
  ],
})

const { data: subfamilies } = await useFetch('/api/getTaxa')
</script>

<template>
  <div>
    <div v-for="subfamily in subfamilies" :key="subfamily.id">
      <h1>{{ subfamily.name }}</h1>
      <p>{{ subfamily.description }}</p>
      <template v-for="genus in subfamily.genus" :key="genus.id">
        <SpecieCard v-for="specie in genus.specie" :id="specie.id" :key="specie.id" :taxon="`${genus.name} ${specie.name}`" :researcher-name="specie.researcher.name" :year-discover="specie.year" />
      </template>
    </div>
    <pre class="whitespace-normal">{{ subfamilies }}</pre>
  </div>
</template>
