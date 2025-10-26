<script setup lang="ts">
import { useArticleImageData } from '~/composables/useImageData'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  sourceWidth: { type: [String, Number], default: null },
  sizes: { type: String, default: '100vw' },
  loading: { type: String as () => 'lazy' | 'eager', default: 'lazy' },
  decoding: {
    type: String as () => 'async' | 'sync' | 'auto',
    default: 'async',
  },
  caption: { type: String, default: '' },
})

// Use simplified system for articles
const imageData = useArticleImageData('', props.src)
</script>

<template>
  <figure
    class="relative mx-auto my-8 sm:my-16 lg:my-24 max-w-[1600px] full-width not-prose"
    :style="{
      aspectRatio: imageData.aspectRatio
    }"
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
    <figcaption
      v-if="$slots.default || caption"
      class="mx-auto mt-2 px-4 max-w-prose text-gray-400 text-sm text-center"
    >
      <slot>{{ caption }}</slot>
    </figcaption>
  </figure>
</template>
