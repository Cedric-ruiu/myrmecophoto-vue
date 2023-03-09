<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <footer class="[ o-footer ] h-20 container mx-auto w-full p-5 font-text">
    <p>Cédric RUIU • Vannes, Brittany, France • <MailTo :email="runtimeConfig.emailContact" /></p>
  </footer>
</template>

<style>
.o-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
