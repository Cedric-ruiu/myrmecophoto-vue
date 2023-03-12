<script setup lang="ts">
// This component provides the ability to protect me from spam when I want to display an email.
// The protection is relatively simple for now, because this site has a low traffic & robots,
// but I'll can enhance the algorithm if necessary.
const props = defineProps({
  emailEncrypted: { type: String, required: true },
})

const mailtoEmailEncrypted = `mailto:${props.emailEncrypted}`

const mailtoHandler = (e: Event) => {
  e.preventDefault() // disable original link html event
  window.open(`mailto:${decryptEmail(props.emailEncrypted)}`, '_blank')
}
</script>

<template>
  <a :href="mailtoEmailEncrypted" @click="mailtoHandler">&#x202e;{{ emailEncrypted }}&#x202c;</a>
</template>
