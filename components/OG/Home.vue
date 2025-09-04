<template>
  <div class="w-[1200px] h-[630px] flex bg-gradient-to-br from-gray-900 via-slate-800 to-black text-white relative overflow-hidden">
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"m20 20 20 20-20-20-20 20z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
    </div>
    
    <!-- Contenu principal -->
    <div class="relative z-10 flex flex-col justify-center items-center w-full p-16 text-center">
      <!-- Titre principal -->
      <h1 class="text-7xl font-black mb-6 leading-tight">
        Myrmeco<span class="text-[#e72c27]">photo</span>
      </h1>
      
      <!-- Sous-titre -->
      <h2 class="text-3xl font-semibold mb-8 text-gray-200">
        {{ subtitle }}
      </h2>
      
      <!-- Description -->
      <p class="text-xl text-gray-300 leading-relaxed max-w-4xl mb-12">
        {{ description }}
      </p>
      
      <!-- Site name badge -->
      <div class="bg-[#e72c27] text-white px-6 py-3 rounded-full">
        <span class="text-lg font-semibold uppercase tracking-wider">{{ siteName }}</span>
      </div>
    </div>
    
    <!-- Éléments décoratifs -->
    <div class="absolute top-16 right-16 w-24 h-24 border-4 border-[#e72c27]/30 rounded-full"></div>
    <div class="absolute bottom-24 left-24 w-16 h-16 bg-[#e72c27]/20 rounded-full"></div>
    <div class="absolute top-1/3 left-16 w-8 h-8 bg-[#e72c27]/40 rounded-full"></div>
    <div class="absolute bottom-1/3 right-32 w-12 h-12 border-2 border-[#e72c27]/20 rounded-full"></div>
    
    <!-- Accent decoratif en bas -->
    <div class="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#e72c27] via-orange-500 to-red-600"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  description?: string
  siteName?: string
  theme?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Myrmecophoto',
  subtitle: 'Macrophotographie & Myrmécologie',
  siteName: 'Myrmecophoto',
  theme: '#e72c27'
})
</script>