<script setup lang="ts">
const { data: emailEncrypted } = await useFetch('/api/getEncryptedEmailContact')

if (emailEncrypted == null || emailEncrypted.value == null)
  throw createError({ statusCode: 404, statusMessage: 'Api getEncryptedEmailContact Not Found' })
</script>

<template>
  <footer class="[ o-footer ] h-20 container mx-auto w-full p-5 font-text">
    <p>Cédric RUIU • Vannes, Brittany, France • <MailTo :email-encrypted="emailEncrypted?.data" /></p>
  </footer>
</template>

<style>
.o-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
