<script setup lang="ts">
const props = defineProps({
  id: { type: Number, required: true },
  taxon: { type: String, required: true },
  researcherName: { type: String, required: true },
  yearDiscover: { type: Number, required: true },
})
</script>

<template>
  <NuxtLink :to="`/taxons/${props.taxon.replace(' ', '_').replace('.', '')}`" class="m-specieCard">
    <h3 class="m-specieCard__title">
      {{ taxon }}
    </h3>
    <p class="m-specieCard__text">
      {{ researcherName }} ({{ yearDiscover }})
    </p>
  </NuxtLink>
</template>

<style>
.m-specieCard {
  display: inline-flex;
  flex-direction: column;
  border: 1px solid;
  color: black;
  padding: 20px;
  margin: 0 10px 10px 0;
  border-radius: 5px;
}

.m-specieCard__title {
  margin: 0;
}

.m-specieCard__text {
  margin: 0;
}
</style>
