<script setup lang="ts">
import { computed } from 'vue'
import { useTaxonImageData } from '~/composables/useImageData'
import type { SpeciesWithRelations } from '~/server/api/getSpecies'
import type { TaxaWithRelations } from '~/server/api/getTaxa'

const props = defineProps({
  id: { type: Number, required: true },
  taxon: { type: String, required: true },
  researcherName: { type: String, required: true },
  yearDiscover: { type: Number, required: true },
  species: { type: Array as () => SpeciesWithRelations[], required: true },
  genus: { type: Object as () => TaxaWithRelations['genus'][number], required: true },
})

const specieData = computed(() => props.species.find((s) => s.id === props.id))

const imageData = computed(() => {
  const fileName = specieData.value?.specimen?.[0]?.taxonomy_picture?.[0]?.file_name
  if (!fileName || !props.genus.name || !specieData.value?.name) {
    return { hasValidData: false, avifSrcset: '', fallback: null, 'thumbnail-fallback': null, avif: [] }
  }

  return useTaxonImageData(props.genus.name, specieData.value.name, fileName)
})

const to = computed(
  () => `/taxons/${props.taxon.replace(' ', '-').replace('.', '').toLowerCase()}/`,
)
</script>

<template>
  <NuxtLink :to="to" class="group block [ specie-card ]">
    <div class="relative bg-surface rounded-[6px] aspect-[16/10] overflow-hidden">
      <picture v-if="imageData.hasValidData">
        <source
          v-if="imageData.avifSrcset"
          type="image/avif"
          :srcset="imageData.avifSrcset"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        >
        <img
          class="w-full h-full object-cover [ specie-card__img ]"
          :src="imageData.thumbnailSrc"
          :alt="`${props.taxon} - Vue taxonomique`"
          :width="imageData.thumbnailWidth"
          :height="imageData.thumbnailHeight"
          loading="lazy"
          decoding="async"
        >
      </picture>
    </div>
    <p class="mt-3 mb-0 font-400 font-title text-ink text-lg italic leading-tight">
      {{ props.taxon }}
    </p>
    <p class="mt-[3px] mb-0 text-[13px] text-ink-4 leading-tight">
      {{ props.researcherName }}, {{ props.yearDiscover }}
    </p>
  </NuxtLink>
</template>

<style lang="scss">
.specie-card {
  &__img {
    transition: transform 0.4s ease;
  }

  &:hover &__img {
    transform: scale(1.05);
  }
}
</style>
