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
    class="not-prose relative my-8 sm:my-16 lg:my-24 w-[100vw] max-w-[1600px] ml-[50%] translate-x-[-50%]"
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
    <figcaption
      v-if="$slots.default || caption"
      class="px-4 mx-auto mt-2 text-sm text-center text-gray-400 max-w-prose"
    >
      <slot>{{ caption }}</slot>
    </figcaption>
  </figure>
</template>
