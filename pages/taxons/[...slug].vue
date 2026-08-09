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

// SSG-safe fallbacks for taxonomic data
const currentSpecies = computed(() => species.value?.[specieId.value])
const scientificName = computed(() => {
  if (!currentSpecies.value) return 'Taxon Myrmecophoto'
  return `${currentSpecies.value.genus.name} ${currentSpecies.value.name}`
})
const taxonSlug = computed(() => {
  const s = currentSpecies.value
  if (!s) return ''
  return `${s.genus.name.toLowerCase()}-${s.name.toLowerCase()}`
})

// French vernacular name from the DB (specie.vernacular_name). Empty when none.
const vernacularName = computed(() => currentSpecies.value?.vernacular_name || '')
const vernacularDisplay = computed(() => capitalizeFirst(vernacularName.value))

const taxonomicDescription = computed(() => {
  if (!currentSpecies.value) return 'Macrophotographie taxonomique de fourmi'
  const vern = vernacularName.value ? `, ${vernacularName.value}` : ''
  return `Macrophotographies de ${scientificName.value}${vern} : identification, `
    + `morphologie et caractéristiques de cette espèce de fourmi.`
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
  const vern = vernacularName.value
    ? `, communément appelée ${vernacularName.value},`
    : ''
  return `${scientificName.value}${vern} est une espèce de fourmi de la sous-famille des `
    + `${s.genus.subfamily.name} (genre ${s.genus.name}), décrite par `
    + `${s.researcher.name} en ${s.year}. Cette fiche regroupe `
    + `${specimenCount} spécimen${specimenCount > 1 ? 's' : ''} photographié`
    + `${specimenCount > 1 ? 's' : ''} en macrophotographie taxonomique (${castesLabel}). `
    + `${locationLabel}`
})

const subfamilyDescription = computed(
  () => currentSpecies.value?.genus.subfamily.description || '',
)

const breadcrumbItems = computed(() => [
  { label: 'Accueil', href: '/' },
  { label: 'Collection', href: '/taxons/' },
  { label: scientificName.value, current: true, scientific: true },
])

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
  title: vernacularName.value
    ? `${scientificName.value} (${vernacularName.value})`
    : scientificName.value,
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
      vernacularName: vernacularName.value,
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

onMounted(() => {
  const galleryElements = document.querySelectorAll('.galleryTaxon')
  galleryElements.forEach((galleryElement) => {
    // Dimensions come from the build manifest via data-pswp-width/height on each
    // link, so there is no need to preload every full-size image just to measure it.
    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryElement as HTMLElement,
      children: 'a',
      // Zoom matters most on mobile, where "fit" barely fills the screen.
      // Open the whole specimen (fit), double-tap / magnifier goes to 1:1 native
      // pixels, and pinch reaches 2.5x native to inspect morphology up close.
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 1,
      maxZoomLevel: 2.5,
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
      :breadcrumb-items="breadcrumbItems"
      width="narrow"
      :title-uppercase="false"
    >
      <template #metadata>
        <p class="order-4 mt-3.5 mb-0 text-[clamp(1.1rem,2vw,1.4rem)] text-ink-3 leading-[1.3]">
          {{ species[specieId].researcher.name }}, {{ species[specieId].year }}
        </p>
        <!-- Vernacular name: no italics, those are reserved for scientific names. -->
        <p
          v-if="vernacularName"
          class="order-5 mt-2 mb-0 text-ink-4 text-base"
        >
          {{ vernacularDisplay }}
        </p>
        <!-- Explicit spaces: Vue strips whitespace-only text nodes containing a
             newline between two elements. -->
        <p class="order-6 mt-6 mb-0 text-ink-3 text-sm">
          <strong>Sous-famille :</strong>&#32;<i>{{ species[specieId].genus.subfamily.name }}</i>
          &nbsp;·&nbsp;
          <strong>Genre :</strong>&#32;<i>{{ species[specieId].genus.name }}</i>
          &nbsp;·&nbsp;
          <strong>Espèce :</strong>&#32;<i>{{ species[specieId].name }}</i>
        </p>
      </template>
    </PageHeader>

    <section class="dark:prose-invert pt-[clamp(48px,8vw,80px)] prose prose-gray measure-editorial">
      <p>{{ taxonIntro }}</p>
      <p v-if="currentSpecies?.description">{{ currentSpecies.description }}</p>
      <p v-if="subfamilyDescription">
        <strong>Sous-famille {{ species[specieId].genus.subfamily.name }} :</strong>
        {{ subfamilyDescription }}
      </p>
    </section>

    <section
      v-for="specimen in species[specieId].specimen"
      :key="specimen.id"
      class="mx-auto pt-[clamp(56px,9vw,100px)] w-full max-w-[1000px]"
    >
      <h2 class="m-0 mb-2 font-400 font-title text-[clamp(1.4rem,2.6vw,1.9rem)] leading-tight">
        {{ specimen.form.name }} de <i>{{ scientificName }}</i>{{ specimen.size_mm ? ` — ${specimen.size_mm} mm` : '' }}
      </h2>
      <p
        v-if="specimen.description"
        class="mt-0 mb-7 max-w-[70ch] text-[15px] text-ink-3 leading-[1.7]"
      >
        {{ specimen.description }}
      </p>

      <!-- Multi-angle grid: adapts from 3 to 7+ views with no code change. -->
      <div
        class="gap-3 grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] bg-surface p-[clamp(16px,3vw,32px)] rounded-lg galleryTaxon"
      >
        <TaxonPicture
          v-for="picture in specimen.taxonomy_picture"
          :key="picture.id"
          :picture="picture"
          :specimen="specimen"
          :specie-id="specieId"
        />
      </div>

      <dl
        class="flex flex-wrap gap-x-6 gap-y-1 mt-3 mb-0 text-[14.5px] text-ink-2 leading-[1.4]"
      >
        <div v-if="specimen.reference">
          <dt class="inline text-ink-4">Numéro du spécimen </dt>
          <dd class="inline m-0"><samp>{{ specimen.reference }}</samp></dd>
        </div>
        <div>
          <dt class="inline text-ink-4">Caste </dt>
          <dd class="inline m-0">{{ specimen.form.name }}</dd>
        </div>
        <div v-if="specimen.contributor_specimen_collector_idTocontributor?.name">
          <dt class="inline text-ink-4">Collecteur </dt>
          <dd class="inline m-0">
            <i>{{ specimen.contributor_specimen_collector_idTocontributor.name }}</i>
          </dd>
        </div>
        <div v-if="specimen.contributor_specimen_identifier_idTocontributor?.name">
          <dt class="inline text-ink-4">Identificateur </dt>
          <dd class="inline m-0">
            <i>{{ specimen.contributor_specimen_identifier_idTocontributor.name }}</i>
          </dd>
        </div>
        <div v-if="specimen.size_mm">
          <dt class="inline text-ink-4">Taille </dt>
          <dd class="inline m-0">{{ specimen.size_mm }} mm</dd>
        </div>
        <div v-if="specimen.capture_site || specimen.country?.name">
          <dt class="inline text-ink-4">Lieu de capture </dt>
          <dd class="inline m-0">
            {{ [specimen.capture_site, specimen.country?.name ? `(${specimen.country.name})` : null].filter(Boolean).join(' ') }}
          </dd>
        </div>
        <div v-if="specimen.capture_date">
          <dt class="inline text-ink-4">Date de capture </dt>
          <dd class="inline m-0">{{ formatCaptureDate(specimen.capture_date) }}</dd>
        </div>
      </dl>
    </section>
    <div
      class="flex flex-col gap-10 pt-[clamp(64px,9vw,110px)] pb-[clamp(80px,10vw,120px)] measure-editorial"
    >
      <section v-if="relatedArticles.length">
        <h2 class="m-0 mb-4 font-400 font-title text-xl">
          Articles évoquant <i>{{ scientificName }}</i>
        </h2>
        <ul class="flex flex-col gap-2 m-0 p-0 text-[15px] list-none">
          <li v-for="article in relatedArticles" :key="article.path">
            <NuxtLink :to="article.path">{{ article.title }}</NuxtLink>
          </li>
        </ul>
      </section>

      <section v-if="sameGenusSpecies.length">
        <h2 class="m-0 mb-4 font-400 font-title text-xl">
          Autres espèces du genre <i>{{ currentSpecies?.genus.name }}</i>
        </h2>
        <div class="flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
          <NuxtLink
            v-for="related in sameGenusSpecies"
            :key="related.slug"
            :to="`/taxons/${related.slug}/`"
          >
            <i>{{ related.label }}</i>
          </NuxtLink>
        </div>
      </section>

      <section v-if="species[specieId].researcher.wiki_url">
        <h2 class="m-0 mb-4 font-400 font-title text-xl">
          Ressources sur <i>{{ scientificName }}</i>
        </h2>
        <p class="m-0 text-[15px] text-ink-3 leading-[1.6]">
          Page Wikipédia sur
          <a :href="species[specieId].researcher.wiki_url" target="_blank" rel="noopener noreferrer">
            {{ species[specieId].researcher.name }}
          </a>, taxonomiste auteur de la description originale.
        </p>
      </section>
    </div>
  </div>
</template>
