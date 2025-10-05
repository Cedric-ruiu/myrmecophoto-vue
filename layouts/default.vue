<template>
  <div class="grid [ o-main ]">
    <BaseHeader />
    <div class="mx-auto p-5 w-full container">
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
