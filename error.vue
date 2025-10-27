<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const errorCode = computed(() => props.error?.statusCode || 500)
const errorMessage = computed(() => {
  if (props.error?.statusMessage) {
    return props.error.statusMessage
  }

  // Default messages based on status code
  const messages: Record<number, string> = {
    404: 'Page introuvable',
    500: 'Erreur interne du serveur',
    403: 'Accès refusé',
    401: 'Non autorisé',
  }

  return messages[errorCode.value] || 'Une erreur est survenue'
})

const errorDescription = computed(() => {
  const descriptions: Record<number, string> = {
    404: 'La page que vous recherchez semble avoir disparu.',
    500: 'Nos ouvrières travaillent activement pour résoudre ce problème.',
    403: 'Vous n\'avez pas l\'autorisation d\'accéder à cette ressource.',
    401: 'Vous devez être authentifié pour accéder à cette page.',
  }

  return descriptions[errorCode.value] || 'Une erreur inattendue s\'est produite lors du traitement de votre demande.'
})

// SEO for error page
useSeoConfig({
  title: `Erreur ${errorCode.value} | Myrmecophoto`,
  description: errorMessage.value,
  robotsRule: 'noindex, nofollow',
})
</script>

<template>
  <NuxtLayout>
    <div class="flex-col justify-center items-center px-4 py-16 min-h-[calc(100vh-var(--header-height))]">
      <div class="flex flex-col justify-center items-center mx-auto max-w-2xl text-center">
        <!-- Error Code -->
        <h1 class="mb-6 font-900 text-gradient-primary text-8xl md:text-9xl">
          {{ errorCode }}
        </h1>

        <!-- Error Message -->
        <h2 class="mb-4 font-700 text-3xl md:text-4xl">
          {{ errorMessage }}
        </h2>

        <!-- Error Description -->
        <p class="mb-8 text-gray-600 dark:text-gray-400 text-lg md:text-xl">
          {{ errorDescription }}
        </p>

        <!-- Action Buttons -->
        <div class="flex sm:flex-row flex-col sm:justify-center gap-4">
          <NuxtLink
            to="/"
            class="horizontal-bottom-line-gradient bg-gradient-to-r from-red-600 hover:from-red-700 to-orange-500 hover:to-orange-600 px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-600 text-white transition-all"
          >
            Retour à l'accueil
          </NuxtLink>

          <NuxtLink
            to="/articles/"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 border-1 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-600 text-gray-700 dark:text-gray-300 transition-all"
          >
            Parcourir les articles
          </NuxtLink>
        </div>

        <!-- Decorative ant illustration hint -->
        <div class="opacity-20 mt-12 text-6xl">
          🐜
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
