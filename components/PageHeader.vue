<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface Props {
  title: string
  date?: string
  breadcrumbItems?: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <header
    class="bg-[linear-gradient(0deg,hsla(1.56,80%,52.94%,0.15)_0%,hsl(0,9.09%,4.31%)_100%)] sm:pt-8 lg:pt-16 pb-8 sm:pb-16 lg:pb-24 text-white text-left full-width"
  >
    <div class="flex flex-col container-responsive">
      <nav
        v-if="breadcrumbItems?.length"
        aria-label="breadcrumb"
        class="relative order-1 min-w-0 text-gray-400 text-sm"
      >
        <ol class="flex items-center gap-1.5">
          <template
            v-for="(item, index) in breadcrumbItems"
            :key="item.label"
          >
            <li
              v-if="index > 0"
              role="presentation"
              aria-hidden="true"
              class="flex"
              :class="{ 'hidden sm:flex': index === 1 }"
            >
              <span class="mx-2">/</span>
            </li>
            <li
              class="flex min-w-0"
              :class="{ 'hidden sm:flex': index === 0 }"
            >
              <a
                v-if="item.href && !item.current"
                :href="item.href"
                class="group relative flex items-center gap-1.5 min-w-0 font-medium text-sm transition-colors"
              >
                <span class="truncate">{{ item.label }}</span>
              </a>
              <p
                v-else
                :aria-current="item.current ? 'page' : undefined"
                class="group relative flex items-center gap-1.5 focus-visible:outline-primary min-w-0 font-semibold text-sm"
                :class="{ 'text-primary': item.current }"
              >
                <span class="truncate">{{ item.label }}</span>
              </p>
            </li>
          </template>
        </ol>
      </nav>

      <h1
        class="order-2 mt-1.5 mb-4 font-normal text-4xl md:text-5xl lg:text-6xl italic uppercase"
      >
        {{ title }}
        <slot name="subtitle" />
      </h1>

      <p
        v-if="date"
        class="order-3 text-gray-400 text-sm leading-none"
      >
        Publié le {{ date }}
      </p>

      <slot name="metadata" />
    </div>
  </header>
</template>
