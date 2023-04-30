<script setup lang="ts">
const open = ref(false)
const route = useRoute()
// <code>{{ route }}</code>
</script>

<template>
  <header>
    <div :class="{ 'to-anime': route.name === 'index' }" class="[ o-header ] flex justify-between flex-wrap content-center sm:h-20 container mx-auto w-full font-text p-5">
      <NuxtLink to="/" class="text-lg font-400 uppercase">
        Myrmeco<span class="font-700 text-gradient-primary">photo</span>
      </NuxtLink>
      <nav :class="{ hidden: !open }" class="pl-2.5 sm:pl-0 order-3 basis-full sm:order-2 sm:basis-auto sm:flex flex-col sm:flex-row" aria-label="Main Navigation">
        <ul class="[ o-header__nav ] py-5 sm:py-0 text-sm sm:text-right uppercase sm:items-center sm:inline-flex">
          <HeaderNavItem link="/taxons">
            Photos spécimens
          </HeaderNavItem>
          <HeaderNavItem link="/articles">
            Articles
          </HeaderNavItem>
          <HeaderNavItem link="javascript:;">
            About
          </HeaderNavItem>
          <HeaderNavItem link="javascript:;">
            Contact
          </HeaderNavItem>
        </ul>
      </nav>
      <button type="button" :class="{ on: open }" class="[ o-header__menuBar ] relative box-content p-0 sm:hidden" role="button" aria-controls="main-nav-header" aria-expanded="false" @click="open = !open" />
    </div>
  </header>
</template>

<style lang="scss">
$menuBar-height: 3px !default;
$menuBar-width: 25px !default;

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
    width: $menuBar-width;
    height: $menuBar-height;
    border-top: #{$soft-touch + $menuBar-height * 2} solid $color-layout;
    border-right: $soft-touch solid $color-layout;
    border-bottom: #{$soft-touch + $menuBar-height * 2} solid $color-layout;
    border-left: $soft-touch solid $color-layout;
    @include gradient-primary();

    &::before,
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: $menuBar-height;
      @include gradient-primary();
      content: '';
    }

    &::before {
      animation: barTop $anime-duration ease-in-out 1 normal both;
    }

    &::after {
      animation: barBottom $anime-duration ease-in-out 1 normal both;
    }

    &.on {
      background: $color-layout;

      &::before {
        animation-name: barTopOn;
      }

      &::after {
        animation-name: barBottomOn;
      }
    }
  }
}

@keyframes header-home-appear {
  0% {
    opacity: 0;
    transform: translateY(-50%);
  } 100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

@keyframes barTop {
  0% {
    transform: translateY(0) rotateZ(45deg);
  }

  50% {
    transform: translateY(0) rotateZ(0);
  }

  100% {
    transform: translateY(#{-$menuBar-height * 2}) rotateZ(0);
  }
}

@keyframes barTopOn {
  0% {
    transform: translateY(#{-$menuBar-height * 2}) rotateZ(0);
  }

  50% {
    transform: translateY(0) rotateZ(0);
  }

  100% {
    transform: translateY(0) rotateZ(45deg);
  }
}

@keyframes barBottom {
  0% {
    transform: translateY(0) rotateZ(-45deg);
  }

  50% {
    transform: translateY(0) rotateZ(0);
  }

  100% {
    transform: translateY(#{$menuBar-height * 2}) rotateZ(0);
  }
}

@keyframes barBottomOn {
  0% {
    transform: translateY(#{$menuBar-height * 2}) rotateZ(0);
  }

  50% {
    transform: translateY(0) rotateZ(0);
  }

  100% {
    transform: translateY(0) rotateZ(-45deg);
  }
}
</style>
