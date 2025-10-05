<script setup lang="ts">
const open = ref(false)
const route = useRoute()
// <code>{{ route }}</code>
</script>

<template>
  <header>
    <div
      :class="{ 'to-anime': route.name === 'index' }"
      class="flex flex-wrap justify-between content-center mx-auto p-5 w-full sm:h-20 font-text [ o-header ] container"
    >
      <NuxtLink to="/" class="font-400 text-lg uppercase">
        Myrmeco<span class="font-700 text-gradient-primary">photo</span>
      </NuxtLink>
      <nav
        id="main-nav-header"
        :class="{ hidden: !open }"
        class="sm:flex sm:flex-row flex-col order-3 sm:order-2 pl-2.5 sm:pl-0 basis-full sm:basis-auto"
        aria-label="Navigation principale"
      >
        <ul
          class="sm:inline-flex sm:items-center py-5 sm:py-0 text-sm sm:text-right uppercase [ o-header__nav ]"
        >
          <HeaderNavItem link="/taxons"> Photos spécimens </HeaderNavItem>
          <HeaderNavItem link="/articles"> Articles </HeaderNavItem>
          <HeaderNavItem link="/about"> À propos / Contact </HeaderNavItem>
        </ul>
      </nav>
      <button
        type="button"
        :class="{ on: open }"
        class="sm:hidden box-content relative p-0 [ o-header__menuBar ]"
        aria-controls="main-nav-header"
        :aria-expanded="open"
        aria-label="Ouvrir le menu de navigation"
        @click="open = !open"
        @keydown.escape="open = false"
      />
    </div>
  </header>
</template>

<style lang="scss">
$menu-bar-height: 3px !default;
$menu-bar-width: 25px !default;

:root {
  --header-height: 4.6875rem; // approximative height
}

.o-header {
  transition: color $anime-duration $anime-ease;

  // animate header only on the homepage
  &.to-anime {
    animation: header-home-appear 2s ease-in-out both 1.7s;
  }

  &__nav:hover {
    :not(:hover) {
      color: #bebebe;
    }
  }

  &__menuBar {
    @include gradient-primary();

    width: $menu-bar-width;
    height: $menu-bar-height;
    border-top: #{$soft-touch + $menu-bar-height * 2} solid $color-layout;
    border-right: $soft-touch solid $color-layout;
    border-bottom: #{$soft-touch + $menu-bar-height * 2} solid $color-layout;
    border-left: $soft-touch solid $color-layout;

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
      background: $color-layout;

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
