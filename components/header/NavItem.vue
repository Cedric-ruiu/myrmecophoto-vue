<script setup>
const props = defineProps({
  link: { type: String, required: true },
})
</script>

<template>
  <li class="[ u-headerNavItem ] relative ml-8">
    <NuxtLink :to="link" class="[ u-headerNavItem__link ]">
      <slot />
    </NuxtLink>
  </li>
</template>

<style lang="scss">
.u-headerNavItem {
  transition: color 0.2s ease-in-out;

  &__link {
    &.router-link-active::before {
      @include gradient-primary();

      display: block;
      position: absolute;
      right: 0;
      left: 0;
      bottom: -8px;
      width: 4px;
      height: 4px;
      margin: 0 auto;
      border-radius: 2px;
      content: '';
    }
  }
}
</style>
