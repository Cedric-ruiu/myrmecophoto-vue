<template>
  <div class="[ o-main ]">
    <BaseHeader />
    <div class="container mx-auto w-full p-5">
      <slot />
    </div>
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
