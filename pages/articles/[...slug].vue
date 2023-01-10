<script setup>
// this catch-all route generate pages with unique articles based from Nuxt Content

const { path } = useRoute()
const { data: article } = await useAsyncData(`content-${path}`, () => {
  return queryContent().where({ _path: path }).findOne()
})

useHead({
  titleTemplate: '%s | Article | Myrmecophoto',
  meta: [
    { name: 'description', content: article.description },
  ],
})
</script>

<template>
  <h1>{{ article.title }}</h1>
  <ContentDoc />
</template>
