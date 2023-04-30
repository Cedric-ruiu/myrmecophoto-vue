<script setup lang="ts">
definePageMeta({
  layout: 'full',
})

useHead({
  title: 'Myrmecophoto : macro photographie, taxonomie & articles sur les fourmis',
  meta: [
    { name: 'description', content: 'Macro photographie taxonomiques de fourmis aidant à l\'identification des spécimens, articles sur les techniques de macro photographie et sujet sur la myrmécologie.' },
  ],
})
</script>

<template>
  <div class="[ o-hero ] grid">
    <div class="[ o-hero__baseline ] flex flex-col text-center justify-center case-upper font-900 leading-[1em] z-1">
      <h1 class="[ o-hero__baselineTitle ]">
        Myrmeco<span class="text-gradient-primary">photo</span>
      </h1>
      <h2 class="[ o-hero__baselineSubtitle ] text-black">
        Macro-photographies de fourmis
      </h2>
    </div>
    <div class="[ o-hero__pictures ] flex relative w-full max-w-full">
      <div class="[ o-hero__picture4Edges ] basis-full">
        <nuxt-img fit="cover" class="w-full h-full object-cover" src="/img/comparatif-35-50/exemple35mm.jpg" />
      </div>
      <div class="[ o-hero__picture4Edges ] basis-full">
        <nuxt-img fit="cover" class="w-full h-full object-cover" src="/img/comparatif-35-50/comparaison50mm.jpg" />
      </div>
      <div class="[ o-hero__picture4Edges ] basis-full">
        <nuxt-img fit="cover" class="w-full h-full object-cover" src="/img/comparatif-35-50/exemple50mm.jpg" />
      </div>
      <div class="[ o-hero__picture6Edges ] absolute w-full left-0">
        <nuxt-img fit="cover" class="w-full h-full object-cover" src="/img/PICT3426c.jpg" />
      </div>
      <div class="[ o-hero__picture6EdgesShadow ] absolute w-full left-0" />
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --hero-font-size: calc(5000vw / 1080);
  --hero-height: calc(var(--hero-font-size) * 3);
  --hero-gap: 20px;
}

.o-hero {
  grid-template-rows: var(--hero-height) calc(100vh - (var(--header-height) + var(--hero-height)));
  height: calc(100vh - var(--header-height));

  &__baseline {
    font-family: Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif;
    font-size: 7vw;

    @include media('>=sm') {
      font-size: var(--hero-font-size);
    }
  }

  &__baselineTitle {
    animation: title-appear 2s ease-in-out both 0.5s;
  }

  &__baselineSubtitle {
    animation: subtitle-appear 2s ease-in-out both 1s;
    font-size: 4.7vw;
    -webkit-text-stroke: 0.03em white;

    @include media('>=sm') {
      font-size: 3.5vw;
    }
  }

  &__pictures {
    gap: var(--hero-gap);
  }

  &__picture4Edges {
    @media screen and (orientation: portrait) {
      margin-top: calc(2 * var(--hero-height));
      height: calc(100% - 2 * var(--hero-height));
    }

    &:nth-child(1) {
      clip-path: polygon(0 0, 0 100%, 100% 100%, 100% calc(var(--hero-height) * 0.7));
      animation: picture-4-edges-appear 2.5s ease-in-out both 0.7s;
    }

    &:nth-child(2) {
      margin-top: calc(0.7 * var(--hero-height));
      height: calc(100% - 0.7 * var(--hero-height));
      animation: picture-4-edges-appear 2.5s ease-in-out both 0.5s;
    }

    &:nth-child(3) {
      clip-path: polygon(0 calc(var(--hero-height) * 0.7), 0 100%, 100% 100%, 100% 0);
      animation: picture-4-edges-appear 2.5s ease-in-out both 0.7s;
    }
  }

  &__picture6Edges {
    animation: picture-6-edges-appear 3s ease-in-out both 0s;
    height: calc(2 * var(--hero-height));
    top: calc(var(--hero-height) - 2 * var(--hero-height));
    clip-path: polygon(50% calc(var(--hero-height)), 100% 0, 100% var(--hero-height), 50% calc(var(--hero-height) * 2), 0px var(--hero-height), 0px 0);

    @media screen and (orientation: portrait) {
      height: calc(4 * var(--hero-height));
      clip-path: polygon(50% calc(var(--hero-height)), 100% 0, 100% calc(var(--hero-height) * 3), 50% calc(var(--hero-height) * 4), 0px calc(var(--hero-height) * 3), 0px 0);
    }
  }

  &__picture6EdgesShadow {
    animation: picture-6-edges-appear 3s ease-in-out both 0s;
    height: calc(var(--hero-gap) + var(--hero-height));
    top: -1px; // hide line glitch
    clip-path: polygon(50% var(--hero-height), 100% 0, 100% var(--hero-gap), 50% calc(var(--hero-height) + var(--hero-gap)), 0px var(--hero-gap), 0px 0);
    background-color: black;

    @media screen and (orientation: portrait) {
      top: calc(var(--hero-height) * 2 - 1px); // -1px => hide line glitch
    }
  }

  // a nonagone try, but it's too complex and prefer save my night
  // &__picture9EdgesShadow {
  //   height: calc(100% + var(--hero-height));
  //   top: calc(var(--hero-height) - 2 * var(--hero-height));
  //   clip-path: polygon(50% calc(var(--hero-height)), 100% 0, 100% var(--hero-height), 58% calc(var(--hero-height) * 1.7), 58% 100%, 42% 100%, 42% calc(var(--hero-height) * 1.7), 0 var(--hero-height), 0 0);
  // }
}

@keyframes title-appear {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(1.10);
  } 80% {
    opacity: 1;
  } 100% {
    transform: translateY(0px) scale(1);
  }
}

@keyframes subtitle-appear {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  } 100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}

@keyframes picture-4-edges-appear {
  0% {
    opacity: 0;
    transform: translateY(-50%);
  } 100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

@keyframes picture-6-edges-appear {
  0% {
    opacity: 0;
    transform: translateY(calc(-1 * var(--header-height)));
  } 50% {
    opacity: 1;
  } 100% {
    transform: translateY(0px);
  }
}
</style>
