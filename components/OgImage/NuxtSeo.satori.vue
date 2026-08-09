<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  colorMode?: 'dark' | 'light'
  title?: string
  description?: string
  subtitle?: string
  date?: string
  location?: string
  siteName?: string
  siteLogo?: string
  theme?: string
}>(), {
  colorMode: 'dark',
  theme: '#e72c27',
  siteName: 'Myrmecophoto',
  siteLogo: '/myrmecophoto-logo.png',
  title: '',
})

const HexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i

const themeHex = computed(() => {
  if (HexRegex.test(props.theme)) return props.theme
  if (HexRegex.test(`#${props.theme}`)) return `#${props.theme}`
  if (props.theme.startsWith('rgb')) {
    const rgb = props.theme.replace(/rgba?\(/, '').replace(')', '').split(',').map(v => Number.parseInt(v.trim(), 10))
    return '#' + rgb.map((v) => {
      const h = v.toString(16)
      return h.length === 1 ? `0${h}` : h
    }).join('')
  }
  return '#e72c27'
})

const themeRgb = computed(() => themeHex.value
  .replace('#', '')
  .match(/.{1,2}/g)
  ?.map(v => Number.parseInt(v, 16))
  .join(', '))

const isDark = computed(() => props.colorMode === 'dark')
const hasMeta = computed(() => Boolean(props.date || props.location))
</script>

<template>
  <div
    class="relative flex justify-between p-[60px] w-full h-full"
    :class="isDark ? ['bg-gray-900', 'text-white'] : ['bg-white', 'text-gray-900']"
  >
    <div
      class="top-0 right-[-100%] absolute flex"
      :style="{
        width: '200%',
        height: '200%',
        backgroundImage: `radial-gradient(circle, rgba(${themeRgb}, 0.45) 0%, ${isDark ? 'rgba(17, 24, 39, 0.3)' : 'rgba(255, 255, 255, 0.7)'} 50%, ${isDark ? 'rgba(17, 24, 39, 0)' : 'rgba(255, 255, 255, 0)'} 70%)`,
      }"
    />
    <div class="relative flex flex-col justify-between w-full h-full">
      <div class="flex flex-col w-full max-w-[85%]">
        <p
          v-if="subtitle"
          class="m-0 mb-[20px] font-bold text-[26px] uppercase tracking-wide"
          :style="{ color: themeHex }"
        >
          {{ subtitle }}
        </p>
        <h1 class="m-0 mb-[28px] font-bold text-[72px] leading-tight">
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="m-0 text-[32px] leading-snug"
          :class="isDark ? ['text-gray-300'] : ['text-gray-700']"
        >
          {{ description }}
        </p>
      </div>

      <div class="flex flex-row justify-between items-center w-full">
        <div class="flex flex-row items-center">
          <img v-if="siteLogo" :src="siteLogo" height="46" style="margin-right: 18px;">
          <p
            v-if="siteName"
            class="m-0 font-bold text-[28px]"
            :style="{ color: themeHex }"
          >
            {{ siteName }}
          </p>
        </div>
        <div
          v-if="hasMeta"
          class="flex flex-row items-center text-[22px]"
          :class="isDark ? ['text-gray-400'] : ['text-gray-600']"
        >
          <span v-if="date">{{ date }}</span>
          <span v-if="date && location" style="margin: 0 12px;">·</span>
          <span v-if="location">{{ location }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
