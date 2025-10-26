<script setup>
defineProps({
  link: { type: String, required: true },
})
</script>

<template>
  <li class="relative not-first:sm:ml-8 [ u-headerNavItem ]">
    <NuxtLink :to="link" class="block py-2 sm:py-0 [ u-headerNavItem__link ]">
      <slot />
    </NuxtLink>
  </li>
</template>

<style lang="scss">
.u-headerNavItem {
  transition: color $anime-duration ease-in-out;

  &__link {
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
        bottom: -8px;
        left: 0;

        margin: 0 auto;
      }
    }
  }
}
</style>
