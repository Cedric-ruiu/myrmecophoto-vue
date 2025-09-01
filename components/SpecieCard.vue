<script setup lang="ts">
import { computed } from 'vue'
import { useImageData } from '~/composables/useImageData'

const props = defineProps({
  id: { type: Number, required: true },
  taxon: { type: String, required: true },
  researcherName: { type: String, required: true },
  yearDiscover: { type: Number, required: true },
  species: { type: Array as () => any[], required: true },
  genus: { type: Object, required: true },
})

const specieData = computed(() => props.species.find((s) => s.id === props.id))

// Generate fallback src path based on taxon naming convention
const fallbackSrc = computed(() => {
  const fileName = specieData.value?.specimen?.[0]?.taxonomy_picture?.[0]?.file_name
  if (!fileName || !props.genus.name || !specieData.value?.name) {
    return ''
  }
  
  const genusName = props.genus.name.toLowerCase()
  const specieName = specieData.value.name.toLowerCase()
  const fileBase = fileName.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  
  return `taxons/${genusName}-${specieName}/${fileBase}`
})

// Use the new system with client-side fallback
const imageData = useImageData(null, fallbackSrc.value)
</script>

<template>
  <NuxtLink
    :to="`/taxons/${props.taxon.replace(' ', '-').replace('.', '').toLowerCase()}`"
    class="[ specie-card ] relative inline-flex flex-col rounded-md justify-end p-3.5 aspect-video text-white"
  >
    <picture v-if="imageData.hasValidData">
      <source
        v-if="imageData.avifSrcset.value"
        type="image/avif"
        :srcset="imageData.avif[0]?.url"
        :width="imageData['thumbnail-fallback']?.width || 300"
        :height="imageData['thumbnail-fallback']?.height || 200"
        sizes="(max-width: 400px) 100vw, 300px"
      />
      <img
        class="[ specie-card-bg ] absolute top-0 left-0 w-full h-full object-cover filtered"
        :src="imageData['thumbnail-fallback']?.url || imageData.fallback?.url"
        :alt="`${props.taxon} - Vue taxonomique`"
        :width="imageData['thumbnail-fallback']?.width || 300"
        :height="imageData['thumbnail-fallback']?.height || 200"
        loading="lazy"
        decoding="async"
      />
    </picture>
    <!-- <img
      class="[ specie-card-bg ] absolute top-0 left-0 w-full h-full object-cover filtered"
      :src="`/img/taxonomy/thumbnails/${taxon
        .replace(' ', '-')
        .replace('.', '')}.jpg`"
      :alt="taxon"
    /> -->
    <h3 class="relative text-shadow-lg text-lg font-medium z-1">
      {{ props.taxon }}
    </h3>
    <p class="relative text-shadow-lg text-xs font-normal z-1">
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
