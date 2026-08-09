<script setup lang="ts">
import { useImageData, useTaxonImageData } from '~/composables/useImageData'
import type { SpeciesWithRelations } from '~/server/api/getSpecies'
import type { TaxaWithRelations } from '~/server/api/getTaxa'

definePageMeta({
  layout: 'full',
})

const { data: species } = useNuxtData<SpeciesWithRelations[]>('species')
const { data: subfamilies } = useNuxtData<TaxaWithRelations[]>('taxa')

/**
 * Hero slides. Two independent, freely editable lists — add or remove entries and
 * the crossfade cycle adapts on its own (the sequencing is driven in JS below, not
 * by keyframes tied to a fixed count).
 *
 * - Taxon slides: the file base of a real specimen photo; title/caption are pulled
 *   from the database (binomial, caste, view, specimen ref).
 * - Custom slides: any manifest image with its own title / caption / alt.
 *
 * A slide that can't be resolved (unknown photo, missing image data) is dropped, so
 * the hero never renders a broken plate.
 */
const HERO_TAXON_PICTURES = [
  'myrmecia-forceps-ouvriere-face-f0089',
  'messor-capitatus-male-profil-f0007',
  'formica-polyctena-ouvriere-face-f0067',
]

const HERO_CUSTOM_SLIDES = [
  {
    image: 'articles/lasius-nid-structure-galeries-souterraines/tranche-galeries-lasius-zoom',
    title: 'Fourmilière en coupe',
    caption: 'Lasius · nid · carnet de terrain',
    alt: 'Nid de Lasius en coupe : galeries souterraines photographiées en macrophotographie de terrain',
  },
  {
    image: 'articles/lasius-elevage-pucerons-mutualisme-miellat/lasius-sp-elevage-pucerons-2',
    title: 'Mutualisme avec les pucerons',
    caption: 'Lasius · miellat · carnet de terrain',
    alt: 'Ouvrières de Lasius soignant des pucerons producteurs de miellat, macrophotographie de terrain',
  },
]

interface HeroSlide {
  key: string
  image: ReturnType<typeof useImageData>
  title: string
  italic: boolean
  caption: string
  alt: string
}

const heroSlides = computed<HeroSlide[]>(() => {
  const taxonSlides = HERO_TAXON_PICTURES.flatMap((fileBase): HeroSlide[] => {
    for (const specie of species.value || []) {
      for (const specimen of specie.specimen || []) {
        const picture = specimen.taxonomy_picture?.find(
          (p) => p.file_name.replace(/\.(jpg|jpeg|png|avif)$/i, '') === fileBase,
        )
        if (!picture) continue

        const view = taxonViewLabel(picture.file_name, picture.description)
        return [{
          key: `taxon-${fileBase}`,
          image: useTaxonImageData(specie.genus.name, specie.name, picture.file_name),
          title: `${specie.genus.name} ${specie.name}`,
          italic: true,
          caption: [specimen.form.name, view, specimen.reference ? `spéc. ${specimen.reference}` : '']
            .filter(Boolean)
            .join(' · '),
          alt: `${specie.genus.name} ${specie.name} — ${specimen.form.name}, ${view || 'vue taxonomique'}, macrophotographie scientifique`,
        }]
      }
    }
    return []
  })

  const customSlides = HERO_CUSTOM_SLIDES.flatMap((slide): HeroSlide[] => {
    const image = useImageData(slide.image)
    if (!image.hasValidData) return []
    return [{
      key: `custom-${slide.image}`,
      image,
      title: slide.title,
      italic: false,
      caption: slide.caption,
      alt: slide.alt,
    }]
  })

  return [...taxonSlides, ...customSlides]
})

// One plate on screen at a time; JS advances the index so the cycle fits any count.
const SLIDE_DURATION_MS = 5000
const activeIndex = ref(0)
let slideTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  const count = heroSlides.value.length
  if (count <= 1) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  slideTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % heroSlides.value.length
  }, SLIDE_DURATION_MS)
})

onBeforeUnmount(() => clearInterval(slideTimer))

/** Collection excerpt: one photographed species per subfamily. */
const featuredSpecies = computed(() =>
  (subfamilies.value || [])
    .map((subfamily) => {
      for (const genus of subfamily.genus) {
        const specie = genus.specie.find((s) => s._count.specimen > 0)
        if (specie) return { specie, genus }
      }
      return null
    })
    .filter((entry) => entry !== null),
)

const { data: latestArticles } = await useAsyncData('home-latest-articles', () =>
  queryCollection('content').order('date', 'DESC').limit(2).all(),
)

const articleThumbnails = computed(() => {
  const map = new Map<string, ReturnType<typeof useImageData>>()
  for (const article of latestArticles.value || []) {
    if (article?.image?.main) {
      map.set(article.path, useImageData(`articles/${article.image.main}`))
    }
  }
  return map
})

useSeoConfig({
  title: 'Macrophotographie de fourmis de France',
  description:
    "Macrophotographie scientifique des fourmis de France : collection taxonomique illustrée, articles d'observation et guides techniques en myrmécologie.",
  ogImageProps: {
    subtitle: 'Macrophotographie et Myrmécologie',
    description:
      'Découvrez le monde fascinant des fourmis à travers la macrophotographie scientifique. Taxonomie, identification et articles spécialisés.',
  },
  customMeta: {
    ogImageAlt: 'Myrmecophoto - Macrophotographies de fourmis',
  },
  pageType: 'homepage',
})
</script>

<template>
  <div>
    <section class="relative bg-page-deep w-full h-[94vh] min-h-[600px] max-h-[980px] overflow-hidden [ o-hero ]">
      <div
        v-for="(slide, index) in heroSlides"
        :key="slide.key"
        class="absolute inset-0 [ o-hero__plate ]"
        :class="{ 'is-active': index === activeIndex }"
      >
        <picture>
          <source
            v-if="slide.image.avifSrcset"
            type="image/avif"
            :srcset="slide.image.avifSrcset"
            sizes="100vw"
          >
          <img
            :src="slide.image.finalSrc"
            :alt="slide.alt"
            class="w-full h-full object-cover"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            decoding="async"
          >
        </picture>
      </div>

      <!-- Vignetting -->
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_35%,oklch(0.1_0.01_50/0.65)_100%)]"
      />
      <!-- Real photographs are far brighter than the mockup's flat fills: the top
           scrim is strengthened to keep the data reader legible. -->
      <div
        class="absolute inset-0 bg-[linear-gradient(0deg,oklch(0.1_0.01_50)_0%,transparent_32%,transparent_62%,oklch(0.1_0.01_50/0.72)_100%)]"
      />

      <!-- Viewfinder reticle -->
      <div class="top-3 sm:top-7 left-3 sm:left-7 absolute border-white/35 border-t border-l w-6.5 h-6.5" />
      <div class="top-3 sm:top-7 right-3 sm:right-7 absolute border-white/35 border-t border-r w-6.5 h-6.5" />
      <div class="bottom-3 sm:bottom-7 left-3 sm:left-7 absolute border-white/35 border-b border-l w-6.5 h-6.5" />
      <div class="right-3 sm:right-7 bottom-3 sm:bottom-7 absolute border-white/35 border-r border-b w-6.5 h-6.5" />

      <!-- Data reader, synchronised with the plates -->
      <div class="top-12 right-16.5 absolute max-w-[calc(100%-5.5rem)] text-right">
        <div class="relative">
          <div
            v-for="(slide, index) in heroSlides"
            :key="slide.key"
            class="[ o-hero__data ]"
            :class="[
              index > 0 ? 'absolute inset-[0_0_auto_auto]' : '',
              { 'is-active': index === activeIndex },
            ]"
          >
            <p
              class="m-0 font-400 font-title text-[17px] text-ink sm:whitespace-nowrap"
              :class="slide.italic ? 'italic' : ''"
            >
              {{ slide.title }}
            </p>
            <p class="mt-1 mb-0 font-mono text-[11px] text-ink-3 uppercase tracking-[0.05em] sm:whitespace-nowrap">
              {{ slide.caption }}
            </p>
          </div>
        </div>
      </div>

      <div class="right-0 bottom-0 left-0 absolute py-[clamp(24px,6vw,72px)] gutter-x">
        <h1
          class="m-0 font-400 font-title text-[clamp(2.2rem,6vw,4.6rem)] uppercase leading-[1.05] [ o-hero__title ]"
        >
          Macro<br class="sm:hidden">photographies des fourmis
        </h1>
        <p
          class="mt-4 mb-0 max-w-[46ch] text-[clamp(1rem,2vw,1.25rem)] text-ink-3 leading-[1.4] [ o-hero__subtitle ]"
        >
          de France et d'Europe<br>collection taxonomique &amp; carnet de terrain
        </p>
      </div>
    </section>

    <section
      class="dark:prose-invert py-[clamp(56px,10vw,120px)] prose prose-gray gutter-x measure-editorial"
    >
      <h2>Macrophotographie scientifique des fourmis françaises</h2>
      <p>
        Myrmecophoto est dédié à la <strong>macrophotographie taxonomique</strong> des fourmis de France
        et d'Europe. Plus de trente espèces de la famille des <i>Formicidae</i> y sont documentées à
        travers des vues détaillées d'ouvrières, gynes, mâles et castes spécialisées (minors, majors,
        médias), photographiées en studio à fort grossissement pour faire ressortir les critères
        d'identification morphologiques utilisés en myrmécologie.
      </p>
      <p>
        La <NuxtLink to="/taxons/">collection taxonomique</NuxtLink> couvre les principales sous-familles
        observables sur le territoire français — <i>Formicinae</i>, <i>Myrmicinae</i>, <i>Ponerinae</i>,
        <i>Dolichoderinae</i> et <i>Myrmeciinae</i>. Chaque fiche réunit des photographies sous plusieurs
        angles (face, profil, dessus) ainsi que les détails utiles à la détermination : forme du
        pétiole, propodéum, scape, funicules, mandibules, ainsi que les informations de capture du
        spécimen (collecteur, identificateur, site, date).
      </p>
      <p>
        Les <NuxtLink to="/articles/">articles</NuxtLink> abordent le terrain et la technique :
        observations comportementales (essaimages, fondations claustrales, mutualisme avec les pucerons,
        transport du couvain), suivis de colonies en élevage, et retours d'expérience sur le matériel
        photographique adapté à la macrophoto de fourmis — comparatifs d'objectifs inversés
        (Canon 50mm, 35mm) et de bonnettes macro (Raynox CM-3500), choix de la mise au point, gestion
        de la profondeur de champ et des aberrations chromatiques.
      </p>
    </section>

    <section class="pb-[clamp(56px,10vw,120px)] gutter-x">
      <div class="measure-wide">
        <div class="flex flex-wrap justify-between items-baseline gap-3 mb-8">
          <h2 class="m-0 font-400 font-title text-[clamp(1.4rem,2.6vw,1.9rem)] leading-tight">
            La collection en images
          </h2>
          <NuxtLink to="/taxons/" class="text-sm">Voir toute la collection →</NuxtLink>
        </div>
        <div class="gap-7 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))]">
          <SpecieCard
            v-for="entry in featuredSpecies"
            :id="entry.specie.id"
            :key="entry.specie.id"
            :taxon="`${entry.genus.name} ${entry.specie.name}`"
            :researcher-name="entry.specie.researcher.name"
            :year-discover="entry.specie.year"
            :species="species || []"
            :genus="entry.genus"
          />
        </div>
      </div>
    </section>

    <section class="pb-[clamp(64px,10vw,120px)] border-white/10 border-t gutter-x">
      <div class="pt-[clamp(56px,10vw,96px)] measure-wide">
        <div class="flex flex-wrap justify-between items-baseline gap-3 mb-8">
          <h2 class="m-0 font-400 font-title text-[clamp(1.4rem,2.6vw,1.9rem)] leading-tight">
            Derniers articles
          </h2>
          <NuxtLink to="/articles/" class="text-sm">Tous les articles →</NuxtLink>
        </div>
        <div class="gap-8 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))]">
          <NuxtLink
            v-for="article in latestArticles"
            :key="article.path"
            :to="withTrailingSlash(article.path)"
            class="group flex flex-col gap-4"
          >
            <div class="bg-surface rounded-[6px] aspect-[16/9] overflow-hidden">
              <img
                :src="articleThumbnails.get(article.path)?.thumbnailSrc"
                :width="articleThumbnails.get(article.path)?.thumbnailWidth"
                :height="articleThumbnails.get(article.path)?.thumbnailHeight"
                :alt="`Image de l'article : ${article.title}`"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400 ease"
                loading="lazy"
                decoding="async"
              >
            </div>
            <div>
              <p class="m-0 mb-1.5 text-ink-4 text-xs">
                {{ formatArticleDate(article.date.published) }}
              </p>
              <h3 class="m-0 mb-2 font-400 font-title text-ink text-xl leading-[1.3]">
                {{ article.title }}
              </h3>
              <p class="m-0 text-ink-3 text-sm leading-[1.6]">
                {{ article.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.o-hero {
  // Crossfade driven by `.is-active` (toggled in JS): only the active plate is
  // shown, blurred → sharp. Works for any number of slides — no keyframes tied to
  // a fixed plate count.
  &__plate {
    transform: scale(1.06);
    opacity: 0;
    filter: blur(12px) saturate(0.8);
    transition:
      opacity 0.9s ease,
      transform 1.1s cubic-bezier(0.19, 1, 0.22, 1),
      filter 1.1s ease;

    &.is-active {
      transform: scale(1);
      opacity: 1;
      filter: blur(0) saturate(1);
    }
  }

  &__data {
    transform: translateY(8px);
    text-shadow: 0 1px 6px oklch(10% 0.01 50deg / 85%);
    opacity: 0;
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;

    &.is-active {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &__title,
  &__subtitle {
    text-shadow: 0 2px 12px oklch(10% 0.01 50deg / 55%);
  }

  &__title {
    animation: hero-reveal 1.1s cubic-bezier(0.19, 1, 0.22, 1) both;
  }

  &__subtitle {
    animation: hero-sub 0.9s ease 0.4s both;
  }
}

@keyframes hero-reveal {
  from {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
  }

  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

@keyframes hero-sub {
  from {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Honour prefers-reduced-motion: the JS timer never starts, so the active plate
   stays on the first slide — here we just drop the transitions and reveal so it
   settles instantly, without motion. */
@media (prefers-reduced-motion: reduce) {
  .o-hero {
    &__plate,
    &__data {
      transition: none;
    }

    &__title,
    &__subtitle {
      animation: none;
    }
  }
}
</style>
