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
    :to="`/taxons/${props.taxon.replace(' ', '-').replace('.', '')}`"
    class="[ specie-card horizontal-bottom-line-gradient ] relative inline-flex flex-col justify-end p-3.5 aspect-video text-white specie-card-border"
  >
    <img
      class="[ specie-card-bg ] absolute top-0 left-0 w-full h-full object-cover rounded-md filtered"
      :src="`/img/taxonomy/thumbnails/${taxon
        .replace(' ', '-')
        .replace('.', '')}.jpg`"
      :alt="taxon"
    />
    <h3 class="relative text-shadow-lg text-lg font-medium">{{ taxon }}</h3>
    <p class="relative text-shadow-lg text-xs font-normal">
      {{ researcherName }} ({{ yearDiscover }})
    </p>
  </NuxtLink>
</template>

<style lang="scss">
.specie-card {
  &__bg {
    filter: contrast(0.7) sepia(0.3) brightness(0.5);
    transition: filter ease 0.2s;
  }

  &:hover {
    .specie-card-bg {
      filter: contrast(1) sepia(0) brightness(0.7);
    }
  }
}
</style>
