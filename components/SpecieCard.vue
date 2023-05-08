<script setup lang="ts">
const props = defineProps({
  id: { type: Number, required: true },
  taxon: { type: String, required: true },
  researcherName: { type: String, required: true },
  yearDiscover: { type: Number, required: true },
})
</script>

<template>
  <NuxtLink
    :to="`/taxons/${props.taxon.replace(' ', '_').replace('.', '')}`"
    class="m-specieCard"
  >
    <h3 class="ms-2">
      {{ taxon }}
    </h3>
    <p class="">{{ researcherName }} ({{ yearDiscover }})</p>
  </NuxtLink>
</template>

<style>
.m-specieCard {
  display: inline-flex;
  flex-direction: column;

  margin: 0 10px 10px 0;
  padding: 20px;

  border: 1px solid;
  border-radius: 5px;
}
</style>
