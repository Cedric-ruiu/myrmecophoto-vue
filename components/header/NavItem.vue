<script setup>
defineProps({
  link: { type: String, required: true },
})
</script>

<template>
  <li class="relative [ u-header-nav-item ]">
    <NuxtLink
      :to="link"
      class="block py-3 sm:py-1 text-ink-4 [ u-header-nav-item__link ]"
    >
      <slot />
    </NuxtLink>
  </li>
</template>

<style lang="scss">
.u-header-nav-item {
  transition: color $anime-duration ease-in-out;

  &__link {
    &:hover,
    &.router-link-active {
      color: $color-ink;
    }

    // Accent dot marking the current section: left of the label while stacked in
    // the mobile panel, centred underneath once the nav is inline.
    &.router-link-active::before {
      @include gradient-primary();

      content: '';

      position: absolute;
      top: 0;
      bottom: 0;
      left: -10px;

      display: block;

      width: 4px;
      height: 4px;
      margin: auto 0;
      border-radius: 2px;

      @include media('>=sm') {
        top: initial;
        right: 0;
        bottom: -6px;
        left: 0;

        margin: 0 auto;
      }
    }
  }
}
</style>
