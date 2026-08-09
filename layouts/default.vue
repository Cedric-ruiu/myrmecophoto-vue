<template>
  <div class="o-main-layout">
    <BaseHeader />
    <main class="o-content-area">
      <slot />
    </main>
    <BaseFooter />
  </div>
</template>

<style lang="scss">
.o-main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.o-content-area {
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--content-padding), 1fr)
    [content-start] minmax(0, var(--content-max-width))
    [content-end] minmax(var(--content-padding), 1fr)
    [full-end];
  flex: 1;

  /* No vertical padding here: it sat between the header and the first section,
     reading as extra header height. Each template owns its own vertical rhythm —
     the gradient banner is meant to butt straight against the header bar. */
}

/* Opt-in class for article pages that need full-width support */
.o-content-area > .article-full-width-layout {
  display: grid;
  grid-column: full;
  grid-template-columns: subgrid;
}

.o-content-area .article-full-width-layout > * {
  grid-column: content;
}

/* Other direct children use display: contents to allow nested .full-width */
.o-content-area > :not(.article-full-width-layout) {
  display: contents;
}

.o-content-area > :not(.article-full-width-layout) > * {
  grid-column: content;
}

.o-content-area .article-full-width-layout .prose {
  display: grid;
  grid-column: full;
  grid-template-columns: subgrid;
}

.o-content-area .article-full-width-layout .prose > * {
  grid-column: content;
}

/* .full-width elements override to span full at any nesting level.
   Line numbers rather than the `full` name: the parent grid's line names are not
   inherited by the subgrids nested here, so `grid-column: full` did not resolve —
   article full-bleed figures were auto-placed into an implicit column sized to
   max-content (horizontal overflow on mobile). `1 / -1` spans the 3 tracks in both
   contexts (direct child of .o-content-area as well as subgrid descendant). */
.full-width {
  grid-column: 1 / -1 !important;
}
</style>
