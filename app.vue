<script setup>
const { data: species } = await useFetch('/api/getSpecies', { key: 'species' })
const { data: subfamilies } = await useFetch('/api/getTaxa', { key: 'taxa' })
const { data: emailEncrypted } = await useFetch(
  '/api/getEncryptedEmailContact',
  { key: 'emailEncrypted' }
)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
