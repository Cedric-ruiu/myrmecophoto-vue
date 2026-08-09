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
  grid-template-columns: minmax(0, 1fr);

  /* `minmax(0, 1fr)`: without a lower bound the implicit column is sized to its
     children's max-content — the hero H1 (unbroken) then widened the whole page
     and caused horizontal scrolling on mobile. */
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}

/* The <main> landmark must not alter the grid: its children (hero + section)
   stay direct grid items so the hero's viewport-based layout is preserved. */
.o-main-content {
  display: contents;
}
</style>
