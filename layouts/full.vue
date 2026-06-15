<template>
  <div class="grid [ o-main ]">
    <BaseHeader />
    <main class="o-main-content">
      <slot />
    </main>
    <BaseFooter />
  </div>
</template>

<style>
.o-main {
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}

/* The <main> landmark must not alter the grid: its children (hero + section)
   stay direct grid items so the hero's viewport-based layout is preserved. */
.o-main-content {
  display: contents;
}
</style>
