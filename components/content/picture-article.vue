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

const imageData = useImageData(`articles/${props.src}`)
</script>

<template>
  <figure
    class="relative mx-auto my-8 sm:my-16 lg:my-24 w-full max-w-[1600px] full-width not-prose"
    :style="{
      aspectRatio: imageData.aspectRatio
    }"
  >
    <!-- Plain link to the full-size file, upgraded to a zoomable viewer by
         `useLightbox` on the article page. PhotoSwipe reuses this srcset, so the
         size already cached by the page is displayed without a new request. -->
    <a
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
    <figcaption
      v-if="$slots.default || caption"
      class="mx-auto mt-2 px-4 max-w-prose text-gray-400 text-sm text-center"
    >
      <slot>{{ caption }}</slot>
    </figcaption>
  </figure>
</template>
