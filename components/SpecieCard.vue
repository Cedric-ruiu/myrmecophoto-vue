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
    class="[ m-specieCard ] relative inline-flex flex-col justify-end p-3.5 aspect-video text-white specie-card-border"
  >
    <img
      class="[ m-specieCard__bg ] absolute top-0 left-0 w-full h-full object-cover rounded-md filtered"
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

  &::before {
    content: '';
    padding: 0 0 5px 0;
    background-image: linear-gradient(#222, #000),
      linear-gradient(90deg, #e72c27 64.09%, #faa307 94.45%);
    background-clip: content-box, border-box;
    z-index: -1;
    @apply absolute w-full h-full rounded-md -bottom-px left-0;
  }
}
</style>
