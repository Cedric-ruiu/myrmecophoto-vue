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
</script>

<template>
  <div v-if="species">
    <div class="my-30">
      <h1 class="text-white text-6xl font-normal italic uppercase">
        {{ species[specieId].genus.name }} {{ species[specieId].name
        }}<span class="text-md"
          >{{ species[specieId].researcher.name }}
          {{ species[specieId].year }}</span
        >
      </h1>
      <p>
        Sous-famille : <i>{{ species[specieId].genus.subfamily.name }}</i> -
        Genre : <i>{{ species[specieId].genus.name }}</i> - Espèce :
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
      <div class="bg-white rounded-md p-12 flex gap-6">
        <img
          v-for="picture in specimen.taxonomy_picture"
          :key="picture.id"
          class="max-h-40 rounded-md"
          :src="`/img/taxonomy/${picture.file_name}`"
          :alt="`${species[specieId].genus.name} ${species[specieId].name}`"
        />
      </div>
      <div class="w-full relative p-6 border-gradient rounded-md mb-30">
        <ul class="prose relative -top-2.5">
          <li>Specimen n°{{ specimen.reference }}</li>
          <li>Caste {{ specimen.form.name }}</li>
          <li>
            Collecteur -
            {{ specimen.contributor_specimen_collector_idTocontributor.name }}
          </li>
          <li
            v-if="specimen.contributor_specimen_identifier_idTocontributor.name"
          >
            Identificateur -
            {{ specimen.contributor_specimen_identifier_idTocontributor.name }}
          </li>
          <li>Size : {{ specimen.size_mm }}mm</li>
          <li>
            Lieu de capture : {{ specimen.capture_site }} ({{
              specimen.country.name
            }})
          </li>
          <li>Date de capture : {{ specimen.capture_date }}</li>
        </ul>
      </div>
    </template>
    <div class="prose">
      <h2>Resources</h2>
      <ul>
        <li>
          Page wiki sur
          <a
            href="{{ species[specieId].researcher.wiki_url }}"
            target="_blank"
            >{{ species[specieId].researcher.name }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.border-gradient::before {
  content: '';
  padding: 0 0 1px 0;
  background-image: linear-gradient(#222, #000), $gradient-primary;
  background-clip: content-box, border-box;
  z-index: -1;
  @apply absolute w-full h-full rounded-md -top-2.5 left-0;
}
</style>
