<script setup lang="ts">
// this catch-all route generate pages with unique articles based from Nuxt Content

const { path } = useRoute()
const { data: article } = await useAsyncData(`content-${path}`, () => {
  return queryContent().where({ _path: path }).findOne()
})

useHead({
  titleTemplate: '%s | Article | Myrmecophoto',
  meta: [{ name: 'description', content: article.description }],
})
</script>

<template>
  <div>
    <h1 class="text-white text-6xl font-normal italic uppercase">
      {{ article.title }}
    </h1>
    <div class="prose">
      <ContentDoc />
    </div>
  </div>
</template>
