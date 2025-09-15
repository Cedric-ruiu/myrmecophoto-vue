<script setup>
// Chargement conditionnel des données taxonomiques selon la route
const route = useRoute()

// Condition réactive pour déterminer si les données taxonomiques sont nécessaires
const needsTaxonomicData = computed(() =>
  route.path === '/taxons' || route.path.startsWith('/taxons/')
)

// Données taxonomiques avec chargement conditionnel réactif
const { data: species, refresh: refreshSpecies } = await useFetch('/api/getSpecies', {
  key: 'species',
  server: true,
  lazy: true,
  default: () => [],
  // Ne pas exécuter le fetch si pas nécessaire côté serveur
  skip: () => !needsTaxonomicData.value && process.server
})

const { data: subfamilies, refresh: refreshSubfamilies } = await useFetch('/api/getTaxa', {
  key: 'taxa',
  server: true,
  lazy: true,
  default: () => [],
  // Ne pas exécuter le fetch si pas nécessaire côté serveur
  skip: () => !needsTaxonomicData.value && process.server
})

// Watch pour déclencher le fetch lors des changements de route
watch(needsTaxonomicData, (newValue) => {
  if (newValue && process.client) {
    // Déclencher le fetch des données seulement si nécessaire
    if (!species.value?.length) {
      refreshSpecies()
    }
    if (!subfamilies.value?.length) {
      refreshSubfamilies()
    }
  }
}, { immediate: true })

// Email contact toujours nécessaire et léger
const { data: emailEncrypted } = await useFetch(
  '/api/getEncryptedEmailContact',
  { key: 'emailEncrypted' },
)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
