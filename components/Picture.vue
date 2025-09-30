<script setup lang="ts">
import { useImageData } from '~/composables/useImageData'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  class: { type: String, default: '' },
  loading: { type: String as () => 'lazy' | 'eager', default: 'lazy' },
  sizes: { type: String, default: '(max-width: 768px) 100vw, 800px' }
})

// Get optimized image data
const imageData = useImageData(props.src)
</script>

<template>
  <picture v-if="imageData.hasValidData" :class="class">
    <source
      v-if="imageData.avifSrcset"
      type="image/avif"
      :srcset="imageData.avifSrcset"
      :sizes="sizes"
    >
    <img
      :src="imageData.fallback?.url || imageData.avif[imageData.avif.length - 1]?.url"
      :alt="alt"
      :width="imageData.fallback?.width || imageData.avif[imageData.avif.length - 1]?.width"
      :height="imageData.fallback?.height || imageData.avif[imageData.avif.length - 1]?.height"
      :loading="loading"
      decoding="async"
      :class="class"
    >
  </picture>
  
  <!-- Fallback: use original src if no optimized data available -->
  <img
    v-else
    :src="src"
    :alt="alt"
    :loading="loading"
    decoding="async"
    :class="class"
  >
</template>