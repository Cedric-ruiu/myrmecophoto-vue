<script setup>
const props = defineProps({
  link: { type: String, required: true },
})
</script>

<template>
  <li class="[ u-headerNavItem ] ml-8">
    <NuxtLink :to="link" class="[ o-header__navItemLink ]">
      <slot />
    </NuxtLink>
  </li>
</template>

<style lang="scss">
.u-headerNavItem {
  transition: color 0.2s ease-in-out;
}
</style>
