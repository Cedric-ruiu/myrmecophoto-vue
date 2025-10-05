<script setup lang="ts">
const { data: emailEncrypted } = useNuxtData('emailEncrypted')

if (emailEncrypted == null || emailEncrypted.value == null)
  throw createError({
    statusCode: 404,
    statusMessage: 'Api getEncryptedEmailContact Not Found',
  })
</script>

<template>
  <footer
    class="flex justify-center items-center mx-auto p-5 w-full h-20 font-text container"
  >
    <p>
      Cédric Ruiu • Vannes, Brittany, France •
      <MailTo :email-encrypted="emailEncrypted?.data" />
    </p>
  </footer>
</template>
