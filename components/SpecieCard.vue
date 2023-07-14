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
    class="[ m-specieCard ] relative inline-flex flex-col justify-end p-3.5 aspect-video"
  >
    <img
      class="[ m-specieCard__bg ] absolute top-0 left-0 w-full h-full object-cover filtered"
      :src="`/img/taxonomy/thumbnails/${taxon
        .replace(' ', '-')
        .replace('.', '')}.jpg`"
      :alt="taxon"
    />
    <h3 class="relative text-white text-lg font-medium">{{ taxon }}</h3>
    <p class="relative text-white text-xs font-normal">
      {{ researcherName }} ({{ yearDiscover }})
    </p>
  </NuxtLink>
</template>

<style lang="scss">
.m-specieCard {
  &__bg {
    filter: contrast(0.7) sepia(0.3) brightness(0.5);
    transition: filter ease 0.2s;
  }

  &:hover {
    .m-specieCard__bg {
      filter: contrast(1) sepia(0) brightness(0.7);
    }
  }
}
</style>
