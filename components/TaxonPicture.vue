<script setup lang="ts">
import { computed } from 'vue'
import { useImageData } from '~/composables/useImageData'

const props = defineProps({
  picture: { type: Object, required: true },
  specimen: { type: Object, required: true },
  specieId: { type: Number, required: true },
})

const { data: species } = useNuxtData('species')

// Generate fallback src path based on taxon naming convention
const fallbackSrc = computed(() => {
  if (!species.value?.[props.specieId]?.genus?.name || !species.value?.[props.specieId]?.name) {
    return ''
  }
  
  const genusName = species.value[props.specieId].genus.name.toLowerCase()
  const specieName = species.value[props.specieId].name.toLowerCase()
  const fileName = props.picture.file_name.replace(/\.(jpg|jpeg|png|avif)$/i, '')
  
  return `taxons/${genusName}-${specieName}/${fileName}`
})

// Use the new system with client-side fallback
const imageData = useImageData(null, fallbackSrc.value)
</script>

<template>
  <a
    v-if="imageData.hasValidData && imageData.fallback?.url"
    :key="picture.id"
    :href="imageData.avif[imageData.avif.length - 1]?.url || imageData.fallback?.url"
    :data-pswp-srcset="imageData.avifSrcset.value"
    data-pswp-sizes="(max-width: 400px) 300px,
                    (max-width: 700px) 600px,
                    (max-width: 1000px) 900px,
                    (max-width: 1400px) 1200px,
                    1600px"
    :data-pswp-width="imageData.avif[imageData.avif.length - 1]?.width || imageData.fallback?.width"
    :data-pswp-height="imageData.avif[imageData.avif.length - 1]?.height || imageData.fallback?.height"
    target="_blank"
    rel="noreferrer"
  >
    <picture>
      <source
        v-if="imageData.avifSrcset.value"
        type="image/avif"
        :srcset="imageData.avif[0]?.url"
        :width="imageData['thumbnail-fallback']?.width || 300"
        :height="imageData['thumbnail-fallback']?.height || 200"
        sizes="(max-width: 400px) 100vw, 300px"
      />
      <img
        class="w-auto max-h-40 rounded-md"
        :src="imageData['thumbnail-fallback']?.url || imageData.fallback?.url"
        :alt="`${species[specieId].genus.name} ${species[specieId].name} - ${picture.description || 'Vue taxonomique'}`"
        :width="imageData['thumbnail-fallback']?.width || 300"
        :height="imageData['thumbnail-fallback']?.height || 200"
        loading="lazy"
        decoding="async"
      />
    </picture>
  </a>
</template>
