<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
  /** Scientific name: rendered in italics, per taxonomic convention. */
  scientific?: boolean
}

interface Props {
  title: string
  date?: string
  breadcrumbItems?: BreadcrumbItem[]
  /**
   * Banner width: `wide` aligns with the content column (collection), `narrow`
   * with the templates using a tighter reading column (articles, species sheet).
   */
  width?: 'wide' | 'narrow'
  /**
   * Editorial titles are uppercased. Disable this for a scientific binomial, whose
   * casing is meaningful (capitalised genus, lowercase specific epithet:
   * "Camponotus sylvaticus").
   */
  titleUppercase?: boolean
}

withDefaults(defineProps<Props>(), {
  date: undefined,
  breadcrumbItems: undefined,
  width: 'wide',
  titleUppercase: true,
})
</script>

<template>
  <header
    class="pt-[clamp(32px,6vw,80px)] pb-[clamp(48px,8vw,96px)] text-ink text-left gradient-banner gutter-x full-width"
  >
    <div
      class="flex flex-col mx-auto w-full"
      :class="width === 'narrow' ? 'max-w-[900px]' : 'max-w-[var(--content-max-width)]'"
    >
      <nav
        v-if="breadcrumbItems?.length"
        aria-label="breadcrumb"
        class="relative order-1 mb-4 min-w-0 text-[13px] text-ink-4"
      >
        <!-- Full breadcrumb at every breakpoint (mobile/desktop parity) -->
        <ol class="flex flex-wrap items-center gap-y-1 m-0 p-0 list-none">
          <template
            v-for="(item, index) in breadcrumbItems"
            :key="item.label"
          >
            <li
              v-if="index > 0"
              role="presentation"
              aria-hidden="true"
              class="flex"
            >
              <span class="mx-2">/</span>
            </li>
            <li class="flex min-w-0">
              <NuxtLink
                v-if="item.href && !item.current"
                :to="item.href"
                class="text-ink-4 hover:text-link-hover transition-colors"
                :class="item.scientific ? 'italic' : ''"
              >
                {{ item.label }}
              </NuxtLink>
              <span
                v-else
                :aria-current="item.current ? 'page' : undefined"
                class="text-ink-3"
                :class="item.scientific ? 'italic' : ''"
              >
                {{ item.label }}
              </span>
            </li>
          </template>
        </ol>
      </nav>

      <h1
        class="order-2 m-0 font-400 font-title text-[clamp(2rem,5vw,3.6rem)] italic leading-[1.1]"
        :class="titleUppercase ? 'uppercase' : ''"
      >
        {{ title }}
        <slot name="subtitle" />
      </h1>

      <p
        v-if="date"
        class="order-3 mt-4 mb-0 text-ink-4 text-sm leading-none"
      >
        Publié le {{ date }}
      </p>

      <slot name="metadata" />
    </div>
  </header>
</template>
