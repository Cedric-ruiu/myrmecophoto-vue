<script setup lang="ts">
import type { TaxaWithRelations } from '~/server/api/getTaxa'

const { data: subfamilies } = useNuxtData<TaxaWithRelations[]>('taxa')
const { data: species } = useNuxtData('species')

// SSG-safe fallbacks for dynamic computed values
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

const breadcrumbItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Collection', current: true },
]

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
    <PageHeader
      title="Collection taxonomique des fourmis de France"
      :breadcrumb-items="breadcrumbItems"
    >
      <template #metadata>
        <p class="order-4 mt-5 mb-0 max-w-[60ch] text-[15px] text-ink-3 leading-[1.7]">
          {{ speciesCount }} espèces documentées à travers {{ subfamilyCount }} sous-familles,
          chacune illustrée par des vues taxonomiques multi-angles à but d'identification.
          Vous cherchez une espèce précise ?
          <NuxtLink to="/taxons/index-alphabetique/">
            Voir l'index alphabétique
          </NuxtLink>.
        </p>
      </template>
    </PageHeader>

    <div class="flex flex-col gap-[clamp(56px,8vw,96px)] pt-[clamp(48px,8vw,96px)] pb-[clamp(72px,10vw,120px)]">
      <section v-for="subfamily in subfamilies" :key="subfamily.id">
        <h2 class="m-0 mb-1 font-400 font-title text-[clamp(1.5rem,2.8vw,2rem)] leading-tight">
          {{ subfamily.name }}
        </h2>
        <p
          v-if="subfamily.description"
          class="mt-0 mb-7 max-w-[70ch] text-ink-4 text-sm leading-[1.7]"
        >
          {{ subfamily.description }}
        </p>
        <div class="gap-6 grid grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))]">
          <template v-for="genus in subfamily.genus">
            <template v-for="specie in genus.specie">
              <SpecieCard
                v-if="specie._count.specimen"
                :id="specie.id"
                :key="specie.id"
                :taxon="`${genus.name} ${specie.name}`"
                :researcher-name="specie.researcher.name"
                :year-discover="specie.year"
                :species="species"
                :genus="genus"
              />
            </template>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>
