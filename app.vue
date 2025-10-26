<script setup>
const route = useRoute()

const needsTaxonomicData = computed(() =>
  route.path === '/taxons' || route.path.startsWith('/taxons/')
)

const { data: species, refresh: refreshSpecies } = await useFetch('/api/getSpecies', {
  key: 'species',
  server: true,
  lazy: true,
  default: () => [],
  skip: () => !needsTaxonomicData.value && import.meta.server
})

const { data: subfamilies, refresh: refreshSubfamilies } = await useFetch('/api/getTaxa', {
  key: 'taxa',
  server: true,
  lazy: true,
  default: () => [],
  skip: () => !needsTaxonomicData.value && import.meta.server
})

// Fetch taxonomic data on client-side navigation when needed
watch(needsTaxonomicData, (newValue) => {
  if (newValue && import.meta.client) {
    if (!species.value?.length) {
      refreshSpecies()
    }
    if (!subfamilies.value?.length) {
      refreshSubfamilies()
    }
  }
}, { immediate: true })

const { data: _emailEncrypted } = await useFetch(
  '/api/getEncryptedEmailContact',
  { key: 'emailEncrypted' },
)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
