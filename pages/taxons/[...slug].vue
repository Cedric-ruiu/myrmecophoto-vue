<script setup lang="ts">
let [routeGenus, routeSpecie] = useRoute().params.slug[0].split('_', 2)

if (!routeGenus || !routeSpecie)
  throw createError({ statusCode: 404, statusMessage: 'Taxon page Not Found' })

routeGenus = routeGenus.trim()
routeSpecie = routeSpecie.trim()

if (routeSpecie === 'sp') {
  routeSpecie += '.'
}

const { data: species } = await useFetch('/api/getSpecies')

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
</script>

<template>
  <div v-if="species">
    <h1 class="text-white text-6xl font-normal italic uppercase">
      {{ species[specieId].genus.name }} {{ species[specieId].name }}
    </h1>
    <p>{{ species[specieId].researcher.name }} {{ species[specieId].year }}</p>
    <template v-for="specimen in species[specieId].specimen" :key="specimen.id">
      <div class="prose">
        <h2>Specimen "{{ specimen.reference }}" ({{ specimen.form.name }})</h2>
        <p v-if="specimen.description">
          {{ specimen.description }}
        </p>
      </div>
      <div v-for="picture in specimen.taxonomy_picture" :key="picture.id">
        <img
          class="mb-2.5"
          :src="`/img/taxonomy/${picture.file_name}`"
          :alt="`${species[specieId].genus.name} ${species[specieId].name}`"
        />
      </div>
    </template>
  </div>
</template>
