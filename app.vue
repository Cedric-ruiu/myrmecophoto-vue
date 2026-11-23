<script setup>
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
