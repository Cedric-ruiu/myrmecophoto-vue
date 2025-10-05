<script setup lang="ts">
import { computed } from 'vue'
import { useTaxonImageData } from '~/composables/useImageData'

const props = defineProps({
  id: { type: Number, required: true },
  taxon: { type: String, required: true },
  researcherName: { type: String, required: true },
  yearDiscover: { type: Number, required: true },
  species: { type: Array as () => any[], required: true },
  genus: { type: Object, required: true },
})

const specieData = computed(() => props.species.find((s) => s.id === props.id))

// Use simplified taxon image data
const imageData = computed(() => {
  const fileName = specieData.value?.specimen?.[0]?.taxonomy_picture?.[0]?.file_name
  if (!fileName || !props.genus.name || !specieData.value?.name) {
    return { hasValidData: false, avifSrcset: '', fallback: null, 'thumbnail-fallback': null, avif: [] }
  }
  
  return useTaxonImageData(props.genus.name, specieData.value.name, fileName)
})
</script>

<template>
  <NuxtLink
    :to="`/taxons/${props.taxon.replace(' ', '-').replace('.', '').toLowerCase()}`"
    class="inline-flex relative flex-col justify-end p-3.5 rounded-md aspect-video text-white [ specie-card ]"
  >
    <picture v-if="imageData.hasValidData">
      <source
        v-if="imageData.avifSrcset"
        type="image/avif"
        :srcset="imageData.avif[0]?.url"
        :width="imageData.thumbnailWidth"
        :height="imageData.thumbnailHeight"
        sizes="(max-width: 400px) 100vw, 300px"
      >
      <img
        class="top-0 left-0 absolute w-full h-full object-cover [ specie-card-bg ] filtered"
        :src="imageData.thumbnailSrc"
        :alt="`${props.taxon} - Vue taxonomique`"
        :width="imageData.thumbnailWidth"
        :height="imageData.thumbnailHeight"
        loading="lazy"
        decoding="async"
      >
    </picture>
    <!-- <img
      class="top-0 left-0 absolute w-full h-full object-cover [ specie-card-bg ] filtered"
      :src="`/img/taxonomy/thumbnails/${taxon
        .replace(' ', '-')
        .replace('.', '')}.jpg`"
      :alt="taxon"
    /> -->
    <h3 class="z-1 relative text-shadow-lg font-medium text-lg">
      {{ props.taxon }}
    </h3>
    <p class="z-1 relative text-shadow-lg font-normal text-xs">
      {{ props.researcherName }} ({{ props.yearDiscover }})
    </p>
  </NuxtLink>
</template>

<style lang="scss">
.specie-card-bg {
  transition: transform ease 0.4s;
}

.specie-card {
  overflow: hidden;

  &::after {
    content: '';

    position: absolute;
    top: 0;
    left: 0;

    display: flex;

    width: 100%;
    height: 100%;

    background: linear-gradient(
      to bottom,
      rgb(0 0 0 / 0%) 30%,
      rgb(0 0 0 / 100%) 100%
    );

    transition: opacity ease 0.4s;
  }

  &:hover::before {
    bottom: -3px;
  }

  &:hover::after {
    opacity: 0.5;
  }

  &:hover {
    .specie-card-bg {
      transform: scale(1.05);
    }
  }
}
</style>
