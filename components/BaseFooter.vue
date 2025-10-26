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
    class="flex justify-center items-center py-5 h-20 font-text container-responsive"
  >
    <p>
      Cédric Ruiu • Vannes, Brittany, France •
      <MailTo :email-encrypted="emailEncrypted?.data" />
    </p>
  </footer>
</template>
