<script setup lang="ts">
import type { BreadcrumbItem } from '~/components/PageHeader.vue'
import type { TaxaWithRelations } from '~/server/api/getTaxa'

// Flattened server-side so the payload only holds the rows rendered below.
const { data: photographedSpecies } = await useFetch('/api/getTaxa', {
  key: 'taxa-index',
  default: () => [],
  transform: (subfamilies: TaxaWithRelations[]) => subfamilies
    .flatMap(subfamily => subfamily.genus.flatMap(genus => genus.specie
      .filter(s => s._count.specimen > 0)
      .map((s) => {
        const scientificName = `${genus.name} ${s.name}`
        const slug = `${genus.name.toLowerCase()}-${s.name.toLowerCase()}`
          .replace(/\s+/g, '-')
          .replace(/\./g, '')
        return {
          scientificName,
          slug,
          initial: genus.name.charAt(0).toUpperCase(),
          researcher: s.researcher.name,
          year: s.year,
          subfamily: subfamily.name,
        }
      })))
    .sort((a, b) => a.scientificName.localeCompare(b.scientificName)),
})

const groupedByLetter = computed(() => {
  const groups = new Map<string, typeof photographedSpecies.value>()
  for (const s of photographedSpecies.value) {
    const arr = groups.get(s.initial) || []
    arr.push(s)
    groups.set(s.initial, arr)
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
})

const speciesCount = computed(() => photographedSpecies.value.length)

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: 'Accueil', href: '/' },
  { label: 'Taxons', href: '/taxons/' },
  { label: 'Index alphabétique', current: true },
])

useSeoConfig({
  title: 'Index alphabétique des espèces de fourmis',
  description:
    'Liste alphabétique de toutes les espèces de fourmis photographiées sur Myrmecophoto, classées par binôme scientifique.',
  ogImageProps: {
    subtitle: 'Index alphabétique',
    description: `${speciesCount.value} espèces de fourmis classées de A à Z`,
  },
  customMeta: {
    ogImageAlt: 'Myrmecophoto - Index alphabétique des espèces',
  },
  pageType: 'taxon-list',
  schemaData: {
    collection: {
      itemCount: speciesCount.value,
      collectionType: 'taxons',
    },
  },
})
</script>

<template>
  <div>
    <PageHeader
      title="Index alphabétique"
      :breadcrumb-items="breadcrumbItems"
    >
      <template #metadata>
        <p class="order-4 text-gray-200 text-sm">
          {{ speciesCount }} espèces classées par binôme scientifique
        </p>
      </template>
    </PageHeader>

    <nav
      aria-label="Aller à la lettre"
      class="dark:prose-invert mx-auto pt-8 sm:pt-12 max-w-prose prose prose-gray"
    >
      <ul class="flex flex-wrap gap-3 p-0 list-none">
        <li v-for="[letter] in groupedByLetter" :key="letter" class="m-0">
          <a
            :href="`#letter-${letter}`"
            class="inline-block hover:bg-white/10 px-3 py-1 border border-white/20 rounded-md text-sm no-underline uppercase"
          >{{ letter }}</a>
        </li>
      </ul>
    </nav>

    <section
      v-for="[letter, items] in groupedByLetter"
      :key="letter"
      class="dark:prose-invert mx-auto pt-8 sm:pt-12 last:pb-[clamp(72px,10vw,120px)] max-w-prose prose prose-gray"
    >
      <h2 :id="`letter-${letter}`">{{ letter }}</h2>
      <ul>
        <li v-for="item in items" :key="item.slug">
          <NuxtLink :to="`/taxons/${item.slug}/`">
            <i>{{ item.scientificName }}</i>
          </NuxtLink>
          <span class="text-gray-400 text-sm"> — {{ item.researcher }} {{ item.year }} ({{ item.subfamily }})</span>
        </li>
      </ul>
    </section>
  </div>
</template>
