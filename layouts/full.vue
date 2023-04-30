<template>
  <div class="[ o-main ] grid">
    <BaseHeader />
    <slot />
    <BaseFooter />
  </div>
</template>

<style>
.o-main {
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}
</style>
