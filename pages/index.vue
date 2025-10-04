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
        Macro-photographies<br >des fourmis
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
      // Three background images creating a wave pattern with angled top edges

      &:nth-child(1) {
        // Left image: trapezoid with angled top-right edge
        clip-path: polygon(
          0 0,                                // top left
          0 100%,                             // bottom left
          100% 100%,                          // bottom right
          100% calc(var(--hero-height) * 0.7) // top right (angled)
        );
        animation: picture-4-edges-appear 2.5s ease-in-out both 0.7s;
      }

      &:nth-child(2) {
        // Center image: rectangle shifted down by 70% hero-height
        height: calc(100% - 0.7 * var(--hero-height));
        margin-top: calc(0.7 * var(--hero-height));
        animation: picture-4-edges-appear 2.5s ease-in-out both 0.5s;
      }

      &:nth-child(3) {
        // Right image: trapezoid with angled top-left edge
        clip-path: polygon(
          0 calc(var(--hero-height) * 0.7), // top left (angled)
          0 100%,                           // bottom left
          100% 100%,                        // bottom right
          100% 0                            // top right
        );
        animation: picture-4-edges-appear 2.5s ease-in-out both 0.7s;
      }

      @media screen and (orientation: portrait) {
        // Portrait: all shifted down by 2x hero-height to make room for hexagon
        height: calc(100% - 2 * var(--hero-height));
        margin-top: calc(2 * var(--hero-height));
      }
    }

    &__picture6Edges {
      // Position: vertically centered on hero (overflows top)
      top: calc(var(--hero-height) - 2 * var(--hero-height)); // = -1 * hero-height
      height: calc(2 * var(--hero-height));

      // Hexagonal shape: 6 points define the corners
      // Top center point: (50%, hero-height)
      // Top corners: (0,0) and (100%,0)
      // Bottom corners: (0,hero-height) and (100%,hero-height)
      // Bottom center point: (50%, 2*hero-height)
      clip-path: polygon(
        50% calc(var(--hero-height)),     // top center
        100% 0,                           // top right
        100% var(--hero-height),          // bottom right
        50% calc(var(--hero-height) * 2), // bottom center
        0 var(--hero-height),             // bottom left
        0 0                               // top left
      );
      animation: picture-6-edges-appear 3s ease-in-out both 0s;

      @media screen and (orientation: portrait) {
        // Portrait: hexagon 2x taller
        height: calc(4 * var(--hero-height));
        clip-path: polygon(
          50% calc(var(--hero-height)),      // top center
          100% 0,                            // top right
          100% calc(var(--hero-height) * 3), // bottom right
          50% calc(var(--hero-height) * 4),  // bottom center
          0 calc(var(--hero-height) * 3),    // bottom left
          0 0                                // top left
        );
      }
    }

    &__picture6EdgesShadow {
      // Creates gap between hexagon and background images using inverted hexagon shape
      top: -1px; // hide line glitch

      height: calc(var(--hero-gap) + var(--hero-height));

      background-color: $color-layout;

      // Inverted hexagon matching picture6Edges but with gap offset
      clip-path: polygon(
        50% var(--hero-height),                         // top center
        100% 0,                                         // top right
        100% var(--hero-gap),                           // gap right
        50% calc(var(--hero-height) + var(--hero-gap)), // bottom center
        0 var(--hero-gap),                              // gap left
        0 0                                             // top left
      );

      animation: picture-6-edges-appear 3s ease-in-out both 0s;

      @media screen and (orientation: portrait) {
        top: calc(var(--hero-height) * 2 - 1px); // -1px => hide line glitch
      }
    }
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
