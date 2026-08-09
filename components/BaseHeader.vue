<script setup lang="ts">
const open = ref(false)
const route = useRoute()
const navEl = ref<HTMLElement | null>(null)
const buttonEl = ref<HTMLElement | null>(null)

// Close the panel on navigation: without this it stays open over the new page.
watch(() => route.fullPath, () => {
  open.value = false
})

// Bound to the window rather than the header: a keydown handler on the header
// only fires while focus is still inside it.
const closeOnEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') open.value = false
}

// Any pointer outside the panel closes it — the backdrop, but also the bare
// header area next to the logo. The toggle itself is excluded so the very click
// that opens the panel does not immediately close it again.
const closeOnOutsidePointer = (event: PointerEvent | MouseEvent) => {
  const target = event.target as Node | null
  if (!target) return
  if (navEl.value?.contains(target) || buttonEl.value?.contains(target)) return
  open.value = false
}

watch(open, (isOpen) => {
  const method = isOpen ? 'addEventListener' : 'removeEventListener'
  window[method]('keydown', closeOnEscape as EventListener)
  window[method]('click', closeOnOutsidePointer as EventListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', closeOnEscape as EventListener)
  window.removeEventListener('click', closeOnOutsidePointer as EventListener)
})
</script>

<template>
  <header class="z-50 relative">
    <div
      :class="{ 'to-anime': route.name === 'index' }"
      class="flex justify-between items-center gap-4 h-[var(--header-height)] font-text gutter-x [ o-header ]"
    >
      <NuxtLink
        to="/"
        class="font-400 font-title text-[22px] text-ink italic leading-none"
      >
        Myrmeco<span class="font-700 text-gradient-primary not-italic">photo</span>
      </NuxtLink>

      <nav
        id="main-nav-header"
        ref="navEl"
        :class="{ 'is-open': open }"
        class="top-full right-0 left-0 z-50 sm:static absolute flex bg-surface sm:bg-transparent sm:px-0 py-2 sm:py-0 border-white/10 border-t border-b sm:border-none gutter-x [ o-header__panel ]"
        aria-label="Navigation principale"
      >
        <ul
          class="flex sm:flex-row flex-col sm:items-center gap-x-[clamp(20px,3vw,40px)] m-0 p-0 w-full sm:w-auto text-sm uppercase tracking-[0.04em] list-none [ o-header__nav ]"
        >
          <HeaderNavItem link="/taxons/"> Photos spécimens </HeaderNavItem>
          <HeaderNavItem link="/articles/"> Articles </HeaderNavItem>
          <HeaderNavItem link="/about/"> À propos / Contact </HeaderNavItem>
        </ul>
      </nav>

      <button
        ref="buttonEl"
        type="button"
        :class="{ on: open }"
        class="sm:hidden box-content relative p-0 [ o-header__menuBar ]"
        aria-controls="main-nav-header"
        :aria-expanded="open"
        :aria-label="open ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'"
        @click="open = !open"
      />
    </div>

    <!-- Sibling of .o-header, never a child: the homepage animates that element's
         transform, which would turn it into the containing block of a fixed child. -->
    <div
      :class="{ 'is-open': open }"
      class="sm:hidden [ o-header__backdrop ]"
      aria-hidden="true"
    />
  </header>
</template>

<style lang="scss">
$menu-bar-height: 3px !default;
$menu-bar-width: 25px !default;
$panel-ease: cubic-bezier(0.19, 1, 0.22, 1);

:root {
  // Pinned so the row keeps one height across breakpoints: the burger's touch
  // box is taller than the inline nav and would otherwise grow the mobile header.
  --header-height: 72px;
}

.o-header {
  // Stacked above the backdrop explicitly: on the homepage the entrance animation
  // applies a transform, which makes this element a stacking context and would
  // otherwise trap the panel's z-index below the backdrop.
  position: relative;
  z-index: 50;
  transition: color $anime-duration $anime-ease;

  // animate header only on the homepage
  &.to-anime {
    animation: header-home-appear 2s ease-in-out both 1.7s;
  }

  &__nav:hover {
    :not(:hover) {
      color: $color-ink-4;
    }
  }

  // `visibility` rather than `display` so the panel can be transitioned, while
  // staying out of the accessibility tree and untouchable when closed.
  &__panel {
    transform: translateY(-0.5rem);

    visibility: hidden;
    opacity: 0;
    box-shadow: 0 18px 40px rgb(0 0 0 / 45%);

    transition:
      opacity 0.25s ease,
      transform 0.25s $panel-ease,
      visibility 0.25s;

    &.is-open {
      transform: translateY(0);
      visibility: visible;
      opacity: 1;
    }

    @include media('>=sm') {
      transform: none;

      visibility: visible;
      opacity: 1;
      box-shadow: none;

      transition: none;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  &__backdrop {
    position: fixed;
    z-index: 40;
    inset: var(--header-height) 0 0 0;

    visibility: hidden;
    opacity: 0;
    background: rgb(0 0 0 / 55%);
    backdrop-filter: blur(2px);

    transition:
      opacity 0.25s ease,
      visibility 0.25s;

    &.is-open {
      visibility: visible;
      opacity: 1;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  // Three gradient bars: the button itself is the middle one, the two pseudo
  // elements fold into a cross when open. Transparent borders widen the hit area
  // to ~49x49px without moving the bars; `background-clip: content-box` keeps the
  // gradient on the 3px bar only, instead of flooding the whole border box.
  &__menuBar {
    @include gradient-primary();

    box-sizing: content-box;
    width: $menu-bar-width;
    height: $menu-bar-height;
    border: 12px solid transparent;
    border-top-width: 23px;
    border-bottom-width: 23px;

    background-clip: content-box;

    &::before,
    &::after {
      @include gradient-primary();

      content: '';

      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: $menu-bar-height;
    }

    &::before {
      animation: bar-top $anime-duration ease-in-out 1 normal both;
    }

    &::after {
      animation: bar-bottom $anime-duration ease-in-out 1 normal both;
    }

    &.on {
      background: transparent;

      &::before {
        animation-name: bar-top-on;
      }

      &::after {
        animation-name: bar-bottom-on;
      }
    }
  }
}

@keyframes header-home-appear {
  0% {
    transform: translateY(-50%);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bar-top {
  0% {
    transform: translateY(0) rotateZ(45deg);
  }

  50% {
    transform: translateY(0) rotateZ(0);
  }

  100% {
    transform: translateY(#{-$menu-bar-height * 2}) rotateZ(0);
  }
}

@keyframes bar-top-on {
  0% {
    transform: translateY(#{-$menu-bar-height * 2}) rotateZ(0);
  }

  50% {
    transform: translateY(0) rotateZ(0);
  }

  100% {
    transform: translateY(0) rotateZ(45deg);
  }
}

@keyframes bar-bottom {
  0% {
    transform: translateY(0) rotateZ(-45deg);
  }

  50% {
    transform: translateY(0) rotateZ(0);
  }

  100% {
    transform: translateY(#{$menu-bar-height * 2}) rotateZ(0);
  }
}

@keyframes bar-bottom-on {
  0% {
    transform: translateY(#{$menu-bar-height * 2}) rotateZ(0);
  }

  50% {
    transform: translateY(0) rotateZ(0);
  }

  100% {
    transform: translateY(0) rotateZ(-45deg);
  }
}
</style>
