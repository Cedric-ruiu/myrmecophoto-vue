<template>
  <div class="w-[1200px] h-[630px] flex bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white relative overflow-hidden">
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
    </div>
    
    <!-- Contenu principal -->
    <div class="relative z-10 flex w-full">
      <!-- Partie gauche - Texte -->
      <div class="flex-1 flex flex-col justify-center p-16">
        <!-- Site branding -->
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-[#e72c27] uppercase tracking-wider">{{ siteName }}</h3>
          <p class="text-lg text-gray-300">Taxonomie & Identification</p>
        </div>
        
        <!-- Nom scientifique -->
        <h1 class="text-6xl font-bold mb-4 leading-tight text-white drop-shadow-lg italic">
          {{ scientificName }}
        </h1>
        
        <!-- Classification -->
        <div class="space-y-2 text-gray-300">
          <p class="text-xl"><span class="text-gray-400">Genre:</span> {{ genus.charAt(0).toUpperCase() + genus.slice(1) }}</p>
          <p class="text-xl"><span class="text-gray-400">Espèce:</span> {{ species }}</p>
        </div>
        
        <!-- Badge -->
        <div class="mt-8">
          <span class="bg-[#e72c27] text-white px-4 py-2 rounded-full text-sm uppercase font-semibold tracking-wide">
            Macrophotographie Taxonomique
          </span>
        </div>
      </div>
      
      <!-- Partie droite - Décoration/Espace pour future image -->
      <div class="w-80 relative">
        <!-- Élément décoratif -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="w-64 h-64 border-4 border-[#e72c27]/30 rounded-full flex items-center justify-center">
            <div class="w-32 h-32 bg-[#e72c27]/20 rounded-full flex items-center justify-center">
              <svg class="w-16 h-16 text-[#e72c27]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Accent decoratif -->
    <div class="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#e72c27] to-orange-500"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  scientificName?: string
  genus?: string
  species?: string
  siteName?: string
  theme?: string
}

withDefaults(defineProps<Props>(), {
  siteName: 'Myrmecophoto',
  theme: '#e72c27'
})
</script>