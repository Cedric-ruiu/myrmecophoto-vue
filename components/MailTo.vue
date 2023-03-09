<script setup lang="ts">
// This component provides the ability to protect me from spam when I want to display an email.
// The protection is relatively simple, because this site has a low traffic & robots,
// but I can complicate the algorithm in the future if necessary.

const props = defineProps({
  email: { type: String, required: true },
})

const reverseString = (str: string) => {
  return str.split('').reverse().join('')
}

const emailReversed = reverseString(props.email)
const mailtoEmailReversed = `mailto:${reverseString(props.email)}`

const mailtoHandler = () => {
  // event.preventDefault() // disable original link html event
  window.open(`mailto:${reverseString(emailReversed)}`, '_blank')
}
</script>

<template>
  <a :href="mailtoEmailReversed" @click="mailtoHandler">&#x202e;{{ emailReversed }}&#x202c;</a>
</template>
