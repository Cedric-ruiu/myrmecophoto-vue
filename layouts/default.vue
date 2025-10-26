<template>
  <div class="o-main-layout">
    <BaseHeader />
    <div class="o-content-area">
      <slot />
    </div>
    <BaseFooter />
  </div>
</template>

<style lang="scss">
:root {
  --content-max-width: 1220px;
  --content-padding: 20px;

  @include media('>=xs') {
    --content-padding: 30px;
  }
}

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
  padding-block: 1.25rem; /* py-5 */
}

/* Opt-in class for article pages that need full-width support */
.o-content-area > .article-full-width-layout {
  display: grid;
  grid-column: full;
  grid-template-columns: subgrid;
}

/* Direct children of article-full-width-layout default to content area */
.o-content-area .article-full-width-layout > * {
  grid-column: content;
}

/* Other direct children use display: contents to allow nested .full-width */
.o-content-area > :not(.article-full-width-layout) {
  display: contents;
}

/* Their direct children default to content area */
.o-content-area > :not(.article-full-width-layout) > * {
  grid-column: content;
}

/* .prose ONLY in article-full-width-layout propagates subgrid */
.o-content-area .article-full-width-layout .prose {
  display: grid;
  grid-column: full;
  grid-template-columns: subgrid;
}

/* Children of .prose in article layout default to content area */
.o-content-area .article-full-width-layout .prose > * {
  grid-column: content;
}

/* .full-width elements override to span full at any nesting level */
.full-width {
  grid-column: full !important;
}
</style>
