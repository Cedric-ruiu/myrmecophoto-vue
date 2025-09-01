<script setup lang="ts">
import { useImageData } from '~/composables/useImageData'

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

// Use new system with articles path
const imagePath = 'articles/' + props.src
const imageData = useImageData(null, imagePath)

// Extract values for template compatibility
const { avifSrcset, fallbackJpgPath, imgWidth, imgHeight } = imageData
</script>

<template>
  <figure
    class="not-prose relative my-8 sm:my-16 lg:my-24 w-[100vw] max-w-[1600px] ml-[50%] translate-x-[-50%]"
    :style="{
      aspectRatio:
        imgWidth && imgHeight ? `${imgWidth} / ${imgHeight}` : undefined,
    }"
  >
    <picture>
      <source
        v-if="avifSrcset"
        type="image/avif"
        :srcset="avifSrcset"
        :sizes="sizes"
      />
      <img
        :src="fallbackJpgPath"
        :alt="alt"
        :width="imgWidth"
        :height="imgHeight"
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
