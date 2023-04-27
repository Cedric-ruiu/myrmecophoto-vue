<template>
  <div class="[ o-main ]">
    <BaseHeader />
    <slot />
    <BaseFooter />
  </div>
</template>

<style>
.o-main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}
</style>
