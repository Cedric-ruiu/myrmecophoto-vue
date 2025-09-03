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
    class="not-prose relative my-8 sm:my-16 lg:my-24 w-[100vw] max-w-[1600px] ml-[50%] translate-x-[-50%]"
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
      />
      <img
        :src="imageData.finalSrc"
        :alt="alt"
        :width="imageData.finalWidth"
        :height="imageData.finalHeight"
        :loading="loading"
        :decoding="decoding"
        class="block w-full h-auto mx-auto"
      />
    </picture>
    
    <!-- Fallback if image data not found -->
    <div 
      v-else
      class="flex items-center justify-center h-48 bg-gray-100 text-gray-500"
    >
      <span>Image taxon non trouvée : {{ src }}</span>
    </div>
    
    <figcaption
      v-if="$slots.default || caption"
      class="px-4 mx-auto mt-2 text-sm text-center text-gray-400 max-w-prose"
    >
      <slot>{{ caption }}</slot>
    </figcaption>
  </figure>
</template>