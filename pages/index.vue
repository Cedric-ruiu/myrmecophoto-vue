<script setup lang="ts">
definePageMeta({
  layout: 'full',
})

useSeoConfig({
  title:
    'Myrmecophoto : macro photographie, taxonomie & articles sur les fourmis',
  description:
    "Macro photographie taxonomiques de fourmis aidant à l'identification des spécimens, articles sur les techniques de macro photographie et sujet sur la myrmécologie.",
  ogImageProps: {
    subtitle: 'Macrophotographie et Myrmécologie',
    description:
      'Découvrez le monde fascinant des fourmis à travers la macrophotographie scientifique. Taxonomie, identification et articles spécialisés.',
  },
  customMeta: {
    ogImageAlt: 'Myrmecophoto - Macrophotographies de fourmis',
  },
  pageType: 'homepage',
})
</script>

<template>
  <div class="[ o-hero ] grid">
    <div
      class="[ o-hero__baseline ] flex flex-col text-center justify-center case-upper font-900 leading-[1em] z-1"
    >
      <h1 class="[ o-hero__baselineTitle ]">
        Myrmeco<span class="text-gradient-primary">photo</span>
      </h1>
      <h2 class="[ o-hero__baselineSubtitle ] text-black">
        Macro-photographies<br />des fourmis
      </h2>
    </div>
    <div class="[ o-hero__pictures ] flex relative w-full max-w-full">
      <div class="[ o-hero__picture4Edges ] basis-full">
        <Picture
          src="taxons/Camponotus-sylvaticus/camponotus-sylvaticus-gyne-face-f0075.avif"
          alt="Camponotus sylvaticus - Gyne (reine) en vue taxonomique, macrophotographie scientifique"
          class="w-full h-full object-cover"
          loading="eager"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div class="[ o-hero__picture4Edges ] basis-full">
        <Picture
          src="taxons/myrmecia-forceps/myrmecia-forceps-ouvriere-face-f0089.avif"
          alt="Myrmecia forceps - Ouvrière en vue taxonomique, macrophotographie scientifique"
          class="w-full h-full object-cover"
          loading="eager"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div class="[ o-hero__picture4Edges ] basis-full">
        <Picture
          src="taxons/formica-polyctena/formica-polyctena-ouvriere-face-f0067.avif"
          alt="Formica polyctena - Ouvrière en vue taxonomique, macrophotographie scientifique"
          class="w-full h-full object-cover"
          loading="eager"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div class="[ o-hero__picture6Edges ] absolute w-full left-0">
        <Picture
          src="home-wall.avif"
          alt="Myrmecophoto - Galerie de macrophotographies scientifiques de fourmis et myrmécologie"
          class="w-full h-full object-cover"
          loading="eager"
          sizes="100vw"
        />
      </div>
      <div class="[ o-hero__picture6EdgesShadow ] absolute w-full left-0" />
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --hero-font-size: calc(5000vw / 1080);
  --subtitle-font-size: calc(4000vw / 1080);
  --hero-height: calc((5000vw / 1080) * 3);
  --hero-gap: 20px;
}

@layer components {
  .o-hero {
    grid-template-rows: var(--hero-height) calc(
        100vh - (var(--header-height) + var(--hero-height))
      );
    height: calc(100vh - var(--header-height));

    &__baseline {
      font-family:
        Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial,
        sans-serif;
    }

    &__baselineTitle {
      margin-top: 50px;
      font-size: 7vw;
      animation: title-appear 2s ease-in-out both 0.5s;

      @include media('>=sm') {
        margin-top: 150px;
        font-size: calc(8000vw / 1080);
      }

      @include media('>=md') {
        font-size: calc(8000vw / 1080);
      }

      @include media('>=lg') {
        font-size: calc(6000vw / 1080);
      }
    }

    &__baselineSubtitle {
      margin-top: 20px;

      font-size: calc(6000vw / 1080);
      line-height: 1.1em;

      animation: subtitle-appear 2s ease-in-out both 1s;

      -webkit-text-stroke: 0.03em white;

      @include media('>=lg') {
        margin-top: 0.3em;
        font-size: calc(3000vw / 1080);
      }
    }

    &__pictures {
      gap: var(--hero-gap);
    }

    &__picture4Edges {
      &:nth-child(1) {
        clip-path: polygon(
          0 0,
          0 100%,
          100% 100%,
          100% calc(var(--hero-height) * 0.7)
        );
        animation: picture-4-edges-appear 2.5s ease-in-out both 0.7s;
      }

      &:nth-child(2) {
        height: calc(100% - 0.7 * var(--hero-height));
        margin-top: calc(0.7 * var(--hero-height));
        animation: picture-4-edges-appear 2.5s ease-in-out both 0.5s;
      }

      &:nth-child(3) {
        clip-path: polygon(
          0 calc(var(--hero-height) * 0.7),
          0 100%,
          100% 100%,
          100% 0
        );
        animation: picture-4-edges-appear 2.5s ease-in-out both 0.7s;
      }

      @media screen and (orientation: portrait) {
        height: calc(100% - 2 * var(--hero-height));
        margin-top: calc(2 * var(--hero-height));
      }
    }

    &__picture6Edges {
      top: calc(var(--hero-height) - 2 * var(--hero-height));
      height: calc(2 * var(--hero-height));
      clip-path: polygon(
        50% calc(var(--hero-height)),
        100% 0,
        100% var(--hero-height),
        50% calc(var(--hero-height) * 2),
        0 var(--hero-height),
        0 0
      );
      animation: picture-6-edges-appear 3s ease-in-out both 0s;

      @media screen and (orientation: portrait) {
        height: calc(4 * var(--hero-height));
        clip-path: polygon(
          50% calc(var(--hero-height)),
          100% 0,
          100% calc(var(--hero-height) * 3),
          50% calc(var(--hero-height) * 4),
          0 calc(var(--hero-height) * 3),
          0 0
        );
      }
    }

    &__picture6EdgesShadow {
      top: -1px; // hide line glitch

      height: calc(var(--hero-gap) + var(--hero-height));

      background-color: $color-layout;
      clip-path: polygon(
        50% var(--hero-height),
        100% 0,
        100% var(--hero-gap),
        50% calc(var(--hero-height) + var(--hero-gap)),
        0 var(--hero-gap),
        0 0
      );

      animation: picture-6-edges-appear 3s ease-in-out both 0s;

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
}

@keyframes title-appear {
  0% {
    transform: translateY(-10px) scale(1.1);
    opacity: 0;
  }

  80% {
    opacity: 1;
  }

  100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes subtitle-appear {
  0% {
    transform: translateY(20px) scale(0.9);
    opacity: 0;
  }

  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes picture-4-edges-appear {
  0% {
    transform: translateY(-50%);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes picture-6-edges-appear {
  0% {
    transform: translateY(calc(-1 * var(--header-height)));
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: translateY(0);
  }
}
</style>
