<script setup lang="ts">
import { useTaxonImageData } from '~/composables/useImageData'

const props = defineProps({
  picture: { type: Object, required: true },
  specimen: { type: Object, required: true },
  specieId: { type: Number, required: true },
})

const { data: species } = useNuxtData('species')

// Simple image data using the unified composable
const imageData = useTaxonImageData(
  species.value?.[props.specieId]?.genus?.name || '',
  species.value?.[props.specieId]?.name || '',
  props.picture.file_name
)
</script>

<template>
  <a
    v-if="imageData.hasValidData"
    :key="picture.id"
    :href="imageData.finalSrc"
    :data-pswp-srcset="imageData.avifSrcset"
    data-pswp-sizes="(max-width: 400px) 300px,
                    (max-width: 700px) 600px,
                    (max-width: 1000px) 900px,
                    (max-width: 1400px) 1200px,
                    1600px"
    :data-pswp-width="imageData.finalWidth"
    :data-pswp-height="imageData.finalHeight"
    target="_blank"
    rel="noreferrer"
  >
    <picture>
      <source
        v-if="imageData.avifSrcset"
        type="image/avif"
        :srcset="imageData.avif[0]?.url"
        :width="imageData.thumbnailWidth"
        :height="imageData.thumbnailHeight"
        sizes="(max-width: 400px) 100vw, 300px"
      />
      <img
        class="w-auto max-h-40 rounded-md"
        :src="imageData.thumbnailSrc"
        :alt="`${species[specieId].genus.name} ${species[specieId].name} - ${picture.description || 'Vue taxonomique'}`"
        :width="imageData.thumbnailWidth"
        :height="imageData.thumbnailHeight"
        loading="lazy"
        decoding="async"
      />
    </picture>
  </a>
</template>