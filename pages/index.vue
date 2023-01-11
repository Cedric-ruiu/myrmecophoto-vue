<script setup lang="ts">
useHead({
  title: 'Myrmecophoto : macro photographie, taxonomie & articles sur les fourmis',
  meta: [
    { name: 'description', content: 'Macro photographie taxonomiques de fourmis aidant à l\'identification des spécimens, articles sur les techniques de macro photographie et sujet sur la myrmécologie.' },
  ],
})

// const countries = await $fetch('/api/testCountries')
const countries = await useFetch('/api/testCountries')
</script>

<template>
  <div>
    <h1>Macro photographies de fourmis !</h1>
    <pre>{{ countries }}</pre>
  </div>
</template>
