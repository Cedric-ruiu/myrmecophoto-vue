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

const imageData = computed(() => {
  const { genus, species, fileName } = parsedTaxon.value
  if (!genus || !species || !fileName) {
    return { hasValidData: false, finalSrc: '', finalWidth: 0, finalHeight: 0, aspectRatio: undefined, avifSrcset: '', largestAvif: null }
  }
  
  return useTaxonImageData(genus, species, fileName)
})
</script>

<template>
  <figure
    class="relative mx-auto my-8 sm:my-16 lg:my-24 w-full max-w-[1600px] full-width not-prose"
    :style="{
      aspectRatio: imageData.aspectRatio
    }"
  >
    <!-- Same zoomable link as PictureArticle: taxon views inside an article are
         where readers most need to inspect the identification criteria. -->
    <a
      v-if="imageData.hasValidData"
      :href="imageData.finalSrc"
      :data-pswp-srcset="imageData.avifSrcset"
      :data-pswp-width="imageData.largestAvif?.width || imageData.finalWidth"
      :data-pswp-height="imageData.largestAvif?.height || imageData.finalHeight"
      :aria-label="`Agrandir l'image : ${alt}`"
      class="block cursor-zoom-in"
      target="_blank"
      rel="noopener noreferrer"
    >
      <picture>
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
    </a>
    
    <div 
      v-else
      class="flex justify-center items-center bg-gray-100 h-48 text-gray-700"
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