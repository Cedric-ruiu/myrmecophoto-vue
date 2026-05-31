<script setup lang="ts">
import type { TaxaWithRelations } from '~/server/api/getTaxa'

const { data: subfamilies } = useNuxtData<TaxaWithRelations[]>('taxa')
const { data: species } = useNuxtData('species')

// Fallbacks SSG-safe pour computed dynamiques
const speciesCount = computed(() => {
  if (!subfamilies?.value) return 0
  return subfamilies.value.reduce(
    (total: number, subfamily: TaxaWithRelations) =>
      total +
      subfamily.genus.reduce(
        (genusTotal: number, genus: TaxaWithRelations['genus'][number]) =>
          genusTotal +
          genus.specie.filter((specie) => specie._count.specimen > 0).length,
        0,
      ),
    0,
  )
})

const subfamilyCount = computed(() => subfamilies?.value?.length || 0)

useSeoConfig({
  title: 'Collection taxonomique - Fourmis de France',
  description:
    "Collection taxonomique illustrée de fourmis : photographies haute définition par espèce, sous-famille et caste pour l'identification des Formicidae.",
  ogImageProps: {
    subtitle: 'Collection Taxonomique',
    description: `${speciesCount.value} espèces de fourmis documentées dans ${subfamilyCount.value} sous-familles`,
  },
  customMeta: {
    ogImageAlt: 'Myrmecophoto - Collection taxonomique de fourmis',
  },
  pageType: 'taxon-list',
  schemaData: {
    collection: {
      itemCount: speciesCount.value,
      collectionType: 'taxons',
      subfamilies: subfamilies.value,
    },
  },
})
</script>

<template>
  <div>
    <PageHeader title="Collection taxonomique des fourmis de France" />
    <p class="mx-auto pt-4 max-w-prose text-gray-300 text-sm">
      Vous cherchez une espèce précise ?
      <NuxtLink to="/taxons/index-alphabetique/" class="underline">
        Voir l'index alphabétique
      </NuxtLink>.
    </p>
    <div class="sm:pt-8 lg:pt-16">
      <div v-for="subfamily in subfamilies" :key="subfamily.id">
        <div class="dark:prose-invert prose prose-gray">
          <h2>{{ subfamily.name }}</h2>
          <p>{{ subfamily.description }}</p>
        </div>
        <div class="gap-3.5 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          <template v-for="genus in subfamily.genus">
            <template v-for="specie in genus.specie">
              <SpecieCard
                v-if="specie._count.specimen"
                :id="specie.id"
                :key="specie.id"
                class="not-prose"
                :taxon="`${genus.name} ${specie.name}`"
                :researcher-name="specie.researcher.name"
                :year-discover="specie.year"
                :species="species"
                :genus="genus"
              />
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
