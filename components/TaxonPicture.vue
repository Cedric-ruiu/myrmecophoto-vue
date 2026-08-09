<script setup lang="ts">
import { computed } from 'vue'
import { useTaxonImageData } from '~/composables/useImageData'

const props = defineProps({
  picture: { type: Object, required: true },
  specimen: { type: Object, required: true },
  specieId: { type: Number, required: true },
})

const { data: species } = useNuxtData('species')

const scientificName = computed(() => {
  const specie = species.value?.[props.specieId]
  return specie ? `${specie.genus.name} ${specie.name}` : ''
})

const imageData = useTaxonImageData(
  species.value?.[props.specieId]?.genus?.name || '',
  species.value?.[props.specieId]?.name || '',
  props.picture.file_name,
)

// Viewing angle: database description when available, otherwise derived from the file name.
const viewLabel = computed(
  () => taxonViewLabel(props.picture.file_name, props.picture.description),
)

const altText = computed(
  () => `${scientificName.value} - ${viewLabel.value || 'Vue taxonomique'}`,
)
</script>

<template>
  <div v-if="imageData.hasValidData">
    <a
      :href="imageData.finalSrc"
      :data-pswp-srcset="imageData.avifSrcset"
      data-pswp-sizes="(max-width: 400px) 300px,
                      (max-width: 700px) 600px,
                      (max-width: 1000px) 900px,
                      (max-width: 1400px) 1200px,
                      1600px"
      :data-pswp-width="imageData.largestAvif?.width || imageData.finalWidth"
      :data-pswp-height="imageData.largestAvif?.height || imageData.finalHeight"
      :aria-label="`Agrandir la photo de ${altText}`"
      class="block bg-surface-raised rounded-[5px] aspect-[4/3] overflow-hidden"
      target="_blank"
      rel="noopener noreferrer"
    >
      <picture>
        <source
          v-if="imageData.avifSrcset"
          type="image/avif"
          :srcset="imageData.avifSrcset"
          sizes="(max-width: 640px) 45vw, 200px"
        >
        <!-- `object-contain`: cropping a taxonomic view would cut off the very
             identification criteria (petiole, propodeum, scape…) it must show. -->
        <img
          class="w-full h-full object-contain"
          :src="imageData.thumbnailSrc"
          :alt="altText"
          :width="imageData.thumbnailWidth"
          :height="imageData.thumbnailHeight"
          loading="lazy"
          decoding="async"
        >
      </picture>
    </a>
    <p v-if="viewLabel" class="mt-2 mb-0 text-[13px] text-ink-3 text-center">
      {{ viewLabel }}
    </p>
  </div>
</template>
