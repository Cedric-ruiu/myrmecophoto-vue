<script setup lang="ts">
const { data: emailEncrypted } = await useFetch('/api/getEncryptedEmailContact')

if (emailEncrypted == null || emailEncrypted.value == null)
  throw createError({
    statusCode: 404,
    statusMessage: 'Api getEncryptedEmailContact Not Found',
  })
</script>

<template>
  <footer
    class="flex items-center justify-center h-20 container mx-auto w-full p-5 font-text"
  >
    <p>
      Cédric RUIU • Vannes, Brittany, France •
      <MailTo :email-encrypted="emailEncrypted?.data" />
    </p>
  </footer>
</template>
