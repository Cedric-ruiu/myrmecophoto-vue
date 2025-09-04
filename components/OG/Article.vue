<template>
  <div class="w-[1200px] h-[630px] flex bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
    <!-- Image de fond avec overlay -->
    <div class="absolute inset-0">
      <img 
        v-if="image" 
        :src="`https://myrmecophoto.fr${image}`" 
        alt="" 
        class="w-full h-full object-cover opacity-60"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    </div>
    
    <!-- Contenu -->
    <div class="relative z-10 flex flex-col justify-end p-16 w-full">
      <!-- Logo/Site name -->
      <div class="mb-4">
        <h3 class="text-2xl font-bold text-[#e72c27] uppercase tracking-wider">{{ siteName }}</h3>
        <p class="text-lg text-gray-300">Macrophotographie & Myrmécologie</p>
      </div>
      
      <!-- Title -->
      <h1 class="text-5xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
        {{ title }}
      </h1>
      
      <!-- Description -->
      <p v-if="description" class="text-xl text-gray-200 leading-relaxed max-w-4xl">
        {{ description }}
      </p>
    </div>
    
    <!-- Accent decoratif -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-[#e72c27] opacity-20 transform rotate-45 translate-x-16 -translate-y-16"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  image?: string
  siteName?: string
  theme?: string
}

withDefaults(defineProps<Props>(), {
  siteName: 'Myrmecophoto',
  theme: '#e72c27'
})
</script>