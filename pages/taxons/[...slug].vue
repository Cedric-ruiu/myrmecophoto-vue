<script setup lang="ts">
let [routeGenus, routeSpecie] = useRoute().params.slug[0].split('_', 2)

if (!routeGenus || !routeSpecie)
  throw createError({ statusCode: 404, statusMessage: 'Taxon page Not Found' })

routeGenus = routeGenus.trim()
routeSpecie = routeSpecie.trim()

if (routeSpecie === 'sp') {
  routeSpecie += '.'
}

const { data: species } = useNuxtData('species')

if (species == null || species.value == null)
  throw createError({
    statusCode: 404,
    statusMessage: 'Api getSpecies Not Found',
  })

const specieId = ref(-1)

for (const [index, specie] of species.value?.entries()) {
  if (specie.name === routeSpecie) {
    specieId.value = index
    break
  }
}

if (specieId.value === -1)
  throw createError({ statusCode: 404, statusMessage: 'Taxon Not Found' })

useHead({
  title: `${species.value[specieId.value].genus.name} ${
    species.value[specieId.value].name
  }`,
  meta: [
    {
      name: 'description',
      content:
        "Macro photographie taxonomiques de fourmis aidant à l'identification des spécimens, articles sur les techniques de macro photographie et sujet sur la myrmécologie.",
    },
  ],
})

import { onMounted, onUnmounted, ref } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const lightboxes = ref([])

onMounted(async () => {
  const galleryElements = document.querySelectorAll('.galleryTaxon')
  galleryElements.forEach(async (galleryElement) => {
    const links = Array.from(galleryElement.querySelectorAll('a'))

    // Assurez-vous que les dimensions de chaque image sont chargées
    await Promise.all(
      links.map(async (link) => {
        const img = new Image()
        img.src = link.href
        await new Promise((resolve) => (img.onload = resolve))
        link.dataset.pswpWidth = img.naturalWidth
        link.dataset.pswpHeight = img.naturalHeight
      }),
    )

    // Créez une nouvelle instance de PhotoSwipeLightbox pour chaque galerie
    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryElement, // Utilisez l'élément de galerie actuel
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()

    // Stockez l'instance de lightbox pour un usage futur, par exemple pour le nettoyage
    lightboxes.value.push(lightbox)
  })
})

onUnmounted(() => {
  // Nettoyez chaque lightbox lors du démontage du composant
  lightboxes.value.forEach((lightbox) => {
    if (lightbox) {
      lightbox.destroy()
    }
  })
  lightboxes.value = []
})
</script>

<template>
  <div v-if="species">
    <div class="my-30">
      <h1 class="text-white font-normal italic uppercase heading-1">
        {{ species[specieId].genus.name }} {{ species[specieId].name
        }}<span class="ml-2 text-xl"
          >{{ species[specieId].researcher.name }}
          {{ species[specieId].year }}</span
        >
      </h1>
      <p>
        <strong>Sous-famille : </strong>
        <i>{{ species[specieId].genus.subfamily.name }}</i> -
        <strong>Genre :</strong> <i>{{ species[specieId].genus.name }}</i> -
        <strong>Espèce : </strong>
        <i>{{ species[specieId].name }}</i>
      </p>
    </div>
    <template v-for="specimen in species[specieId].specimen" :key="specimen.id">
      <div class="w-full relative-md prose">
        <h2>{{ specimen.form.name }} de {{ specimen.size_mm }}mm</h2>
        <p v-if="specimen.description">
          {{ specimen.description }}
        </p>
      </div>
      <div
        id="galleryTaxon"
        class="galleryTaxon bg-white rounded-md p-12 flex flex-wrap gap-6"
      >
        <a
          v-for="picture in specimen.taxonomy_picture"
          :key="picture.id"
          :href="`/img/taxonomy/${picture.file_name}`"
          :data-pswp-width="picture.width"
          :data-pswp-height="picture.height"
          target="_blank"
          rel="noreferrer"
        >
          <img
            class="max-h-40 rounded-md"
            :src="`/img/taxonomy/${picture.file_name}`"
            :alt="`${species[specieId].genus.name} ${species[specieId].name}`"
          />
        </a>
      </div>
      <div
        class="[ horizontal-bottom-line-gradient ] w-full relative p-6 rounded-md mb-30"
      >
        <ul class="prose relative">
          <li>
            <strong>Numéro du specimen :&nbsp;</strong>
            <samp>{{ specimen.reference }}</samp>
          </li>
          <li><strong>Caste :</strong> {{ specimen.form.name }}</li>
          <li>
            <strong>Collecteur : </strong>
            <i>{{
              specimen.contributor_specimen_collector_idTocontributor.name
            }}</i>
          </li>
          <li
            v-if="specimen.contributor_specimen_identifier_idTocontributor.name"
          >
            <strong>Identificateur :</strong>
            <i>{{
              specimen.contributor_specimen_identifier_idTocontributor.name
            }}</i>
          </li>
          <li><strong>Size :</strong> {{ specimen.size_mm }}mm</li>
          <li>
            <strong>Lieu de capture :</strong> {{ specimen.capture_site }} ({{
              specimen.country.name
            }})
          </li>
          <li>
            <strong>Date de capture :</strong> {{ specimen.capture_date }}
          </li>
        </ul>
      </div>
    </template>
    <div class="prose">
      <h2>Resources</h2>
      <ul>
        <li>
          Page wiki sur
          <a :href="species[specieId].researcher.wiki_url" target="_blank">{{
            species[specieId].researcher.name
          }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
