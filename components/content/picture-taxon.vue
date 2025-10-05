<script setup lang="ts">
import { computed } from 'vue'
import { useTaxonImageData } from '~/composables/useImageData'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  sizes: { type: String, default: '100vw' },
  loading: { type: String as () => 'lazy' | 'eager', default: 'lazy' },
  decoding: {
    type: String as () => 'async' | 'sync' | 'auto',
    default: 'async',
  },
  caption: { type: String, default: '' },
})

// Parse taxon path: "genus-species/filename" → genus, species, filename
const parsedTaxon = computed(() => {
  const parts = props.src.split('/')
  if (parts.length < 2) {
    console.warn(`PictureTaxon: Invalid src format "${props.src}". Expected "genus-species/filename"`)
    return { genus: '', species: '', fileName: '' }
  }
  
  const [genusSpecies, fileName] = [parts[0], parts.slice(1).join('/')]
  const [genus, species] = genusSpecies.split('-')
  
  if (!genus || !species) {
    console.warn(`PictureTaxon: Could not parse genus-species from "${genusSpecies}"`)
    return { genus: '', species: '', fileName }
  }
  
  return { genus, species, fileName }
})

// Get taxon image data using parsed information
const imageData = computed(() => {
  const { genus, species, fileName } = parsedTaxon.value
  if (!genus || !species || !fileName) {
    return { hasValidData: false, finalSrc: '', finalWidth: 0, finalHeight: 0, aspectRatio: undefined, avifSrcset: '' }
  }
  
  return useTaxonImageData(genus, species, fileName)
})
</script>

<template>
  <figure
    class="relative my-8 sm:my-16 lg:my-24 ml-[50%] w-[100vw] max-w-[1600px] translate-x-[-50%] not-prose"
    :style="{
      aspectRatio: imageData.aspectRatio
    }"
  >
    <picture v-if="imageData.hasValidData">
      <source
        v-if="imageData.avifSrcset"
        type="image/avif"
        :srcset="imageData.avifSrcset"
        :sizes="sizes"
      >
      <img
        :src="imageData.finalSrc"
        :alt="alt"
        :width="imageData.finalWidth"
        :height="imageData.finalHeight"
        :loading="loading"
        :decoding="decoding"
        class="block mx-auto w-full h-auto"
      >
    </picture>
    
    <!-- Fallback if image data not found -->
    <div 
      v-else
      class="flex justify-center items-center bg-gray-100 h-48 text-gray-500"
    >
      <span>Image taxon non trouvée : {{ src }}</span>
    </div>
    
    <figcaption
      v-if="$slots.default || caption"
      class="mx-auto mt-2 px-4 max-w-prose text-gray-400 text-sm text-center"
    >
      <slot>{{ caption }}</slot>
    </figcaption>
  </figure>
</template>