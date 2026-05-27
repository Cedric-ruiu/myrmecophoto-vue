<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const slugParam = useRoute().params.slug?.[0]

if (!slugParam)
  throw createError({ statusCode: 404, statusMessage: 'Taxon page Not Found' })

let [routeGenus, routeSpecie] = slugParam.split('-', 2)

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

for (const [index, specie] of species.value.entries()) {
  if (specie.name === routeSpecie) {
    specieId.value = index
    break
  }
}

if (specieId.value === -1)
  throw createError({ statusCode: 404, statusMessage: 'Taxon Not Found' })

// Fallbacks SSG-safe pour données taxonomiques
const currentSpecies = computed(() => species.value?.[specieId.value])
const scientificName = computed(() => {
  if (!currentSpecies.value) return 'Taxon Myrmecophoto'
  return `${currentSpecies.value.genus.name} ${currentSpecies.value.name}`
})
const taxonomicDescription = computed(() => {
  if (!currentSpecies.value) return 'Macrophotographie taxonomique de fourmi'
  return `Macrophotographies taxonomiques de ${scientificName.value} - Identification, morphologie et caractéristiques de cette espèce de fourmi.`
})

// SEO-friendly introduction paragraph generated from available data
const taxonIntro = computed(() => {
  const s = currentSpecies.value
  if (!s) return ''
  const specimenCount = s.specimen?.length || 0
  const formNames = [...new Set((s.specimen || []).map(sp => sp.form.name))]
  const countries = [...new Set((s.specimen || []).map(sp => sp.country?.name).filter(Boolean))]
  const castesLabel = formNames.length
    ? formNames.join(', ').toLowerCase()
    : 'différentes castes'
  const locationLabel = countries.length
    ? `Spécimens collectés en ${countries.join(', ')}.`
    : ''
  return `${scientificName.value} est une espèce de fourmi de la sous-famille des `
    + `${s.genus.subfamily.name} (genre ${s.genus.name}), décrite par `
    + `${s.researcher.name} en ${s.year}. Cette fiche regroupe `
    + `${specimenCount} spécimen${specimenCount > 1 ? 's' : ''} photographié`
    + `${specimenCount > 1 ? 's' : ''} en macrophotographie taxonomique (${castesLabel}). `
    + `${locationLabel}`
})

const subfamilyDescription = computed(
  () => currentSpecies.value?.genus.subfamily.description || '',
)

const taxonSlug = computed(() => {
  const s = currentSpecies.value
  if (!s) return ''
  return `${s.genus.name.toLowerCase()}-${s.name.toLowerCase()}`
})

const sameGenusSpecies = computed(() => {
  if (!currentSpecies.value || !species.value) return []
  const currentGenus = currentSpecies.value.genus.name
  const currentId = currentSpecies.value.id
  return species.value
    .filter((s: typeof currentSpecies.value) =>
      s.genus.name === currentGenus
      && s.id !== currentId
      && (s.specimen?.length || 0) > 0,
    )
    .map((s: typeof currentSpecies.value) => ({
      slug: `${s.genus.name.toLowerCase()}-${s.name.toLowerCase()}`,
      label: `${s.genus.name} ${s.name}`,
    }))
})

const { data: allArticlesForRelations } = await useAsyncData(
  'taxon-related-articles',
  () => queryCollection('content').all(),
)

const relatedArticles = computed(() => {
  if (!taxonSlug.value || !allArticlesForRelations.value) return []
  const slug = taxonSlug.value
  return allArticlesForRelations.value
    .filter((a: { taxons?: string[], path: string, title: string }) =>
      Array.isArray(a.taxons) && a.taxons.includes(slug),
    )
    .map((a: { path: string, title: string }) => ({
      path: a.path.endsWith('/') ? a.path : `${a.path}/`,
      title: a.title,
    }))
})

useSeoConfig({
  title: scientificName.value,
  description: taxonomicDescription.value,
  ogImageProps: {
    subtitle: currentSpecies.value?.genus.subfamily.name || 'Formicidae',
    description: currentSpecies.value
      ? `${currentSpecies.value.researcher.name} ${currentSpecies.value.year || ''}`
      : 'Taxon scientifique',
  },
  customMeta: {
    ogImageAlt: `${scientificName.value} - Vue taxonomique`,
  },
  pageType: 'taxon',
  schemaData: {
    taxon: {
      scientificName: scientificName.value,
      genus: currentSpecies.value?.genus.name || '',
      subfamily: currentSpecies.value?.genus.subfamily.name || '',
      researcher: currentSpecies.value?.researcher.name || '',
      year: currentSpecies.value?.year,
      specimens: currentSpecies.value?.specimen,
      routeGenus,
      routeSpecie,
    },
  },
})

const lightboxes = ref<PhotoSwipeLightbox[]>([])

onMounted(async () => {
  const galleryElements = document.querySelectorAll('.galleryTaxon')
  galleryElements.forEach(async (galleryElement) => {
    const links = Array.from(galleryElement.querySelectorAll('a'))

    await Promise.all(
      links.map(async (link) => {
        const img = new Image()
        img.src = link.href
        await new Promise((resolve) => (img.onload = resolve))
        link.dataset.pswpWidth = img.naturalWidth + ''
        link.dataset.pswpHeight = img.naturalHeight + ''
      }),
    )

    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryElement as HTMLElement,
      children: 'a',
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 'fit',
      maxZoomLevel: 'fit',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()

    lightboxes.value.push(lightbox)
  })
})

onUnmounted(() => {
  lightboxes.value.forEach((lightbox) => {
    if (lightbox) {
      lightbox.destroy()
      lightbox = {} as PhotoSwipeLightbox
    }
  })
  lightboxes.value = []
})
</script>

<template>
  <div v-if="species">
    <PageHeader
      :title="`${species[specieId].genus.name} ${species[specieId].name}`"
    >
      <template #subtitle>
        <span class="ml-2 text-xl">
          {{ species[specieId].researcher.name }}&nbsp;{{ species[specieId].year }}
        </span>
      </template>
      <template #metadata>
        <p class="order-4 text-gray-200 text-sm">
          <strong>Sous-famille : </strong>
          <i>{{ species[specieId].genus.subfamily.name }}</i> -
          <strong>Genre : </strong>
          <i>{{ species[specieId].genus.name }}</i> -
          <strong>Espèce : </strong>
          <i>{{ species[specieId].name }}</i>
        </p>
      </template>
    </PageHeader>
    <section class="dark:prose-invert mx-auto pt-8 sm:pt-12 lg:pt-16 max-w-prose prose prose-gray">
      <p>{{ taxonIntro }}</p>
      <p v-if="subfamilyDescription">
        <strong>Sous-famille {{ species[specieId].genus.subfamily.name }} :</strong>
        {{ subfamilyDescription }}
      </p>
    </section>
    <div class="sm:pt-4 lg:pt-12">

      <template v-for="specimen in species[specieId].specimen" :key="specimen.id">
        <div class="relative-md dark:prose-invert w-full prose prose-gray">
          <h2>
            {{ specimen.form.name }} de <i>{{ scientificName }}</i>{{ specimen.size_mm ? ` — ${specimen.size_mm} mm` : '' }}
          </h2>
          <p v-if="specimen.description">
            {{ specimen.description }}
          </p>
        </div>
        <div
          id="galleryTaxon"
          class="flex flex-wrap gap-6 bg-white p-12 rounded-md galleryTaxon"
        >
          <TaxonPicture
            v-for="picture in specimen.taxonomy_picture"
            :key="picture.id"
            :picture="picture"
            :specimen="specimen"
            :specie-id="specieId"
          />
        </div>
        <div
          class="horizontal-bottom-line-gradient relative mb-30 p-6 rounded-md w-full [ ]"
        >
          <ul class="relative dark:prose-invert prose prose-gray">
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
            <li v-if="specimen.size_mm">
              <strong>Size :</strong> {{ specimen.size_mm }}mm
            </li>
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
    </div>
    <aside
      v-if="relatedArticles.length"
      class="dark:prose-invert w-full mx-auto max-w-prose prose prose-gray"
    >
      <h2>Articles évoquant <i>{{ scientificName }}</i></h2>
      <ul>
        <li v-for="article in relatedArticles" :key="article.path">
          <NuxtLink :to="article.path">{{ article.title }}</NuxtLink>
        </li>
      </ul>
    </aside>

    <aside
      v-if="sameGenusSpecies.length"
      class="dark:prose-invert w-full mx-auto max-w-prose prose prose-gray"
    >
      <h2>Autres espèces du genre <i>{{ currentSpecies?.genus.name }}</i></h2>
      <ul>
        <li v-for="related in sameGenusSpecies" :key="related.slug">
          <NuxtLink :to="`/taxons/${related.slug}/`"><i>{{ related.label }}</i></NuxtLink>
        </li>
      </ul>
    </aside>

    <aside class="dark:prose-invert w-full mx-auto max-w-prose prose prose-gray">
      <h2>Ressources sur <i>{{ scientificName }}</i></h2>
      <ul>
        <li>
          Page Wikipédia sur
          <a :href="species[specieId].researcher.wiki_url" target="_blank" rel="noopener noreferrer">
            {{ species[specieId].researcher.name }}
          </a>, taxonomiste auteur de la description originale.
        </li>
      </ul>
    </aside>
  </div>
</template>
