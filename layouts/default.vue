<template>
  <div class="[ o-main ] grid">
    <BaseHeader />
    <div class="container mx-auto w-full p-5">
      <slot />
    </div>
    <BaseFooter />
  </div>
</template>

<style>
.o-main {
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}
</style>
