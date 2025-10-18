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
  <div class="relative [ o-hero ]">
    <div
      class="z-1 absolute flex flex-col justify-center w-full font-900 text-center leading-[1em] [ o-hero__baseline ] case-upper"
    >
      <h1 class="[ o-hero__baselineTitle ]">
        Myrmeco<span class="text-gradient-primary">photo</span>
      </h1>
      <h2 class="text-black [ o-hero__baselineSubtitle ]">
        Macro-photographies<br >des fourmis
      </h2>
    </div>
    <div class="relative flex w-full max-w-full [ o-hero__pictures ]">
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
      <div class="left-0 absolute w-full [ o-hero__picture6Edges ]">
        <Picture
          src="home-wall.avif"
          alt="Myrmecophoto - Galerie de macrophotographies scientifiques de fourmis et myrmécologie"
          class="w-full h-full object-cover"
          loading="eager"
          sizes="100vw"
        />
      </div>
      <div class="left-0 absolute w-full [ o-hero__picture6EdgesShadow ]" />
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --hero-height: calc((5000vw / 1080) * 3); // 13.88vw
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
      margin-top: 25px;
      font-size: 8vw;
      animation: title-appear 2s ease-in-out both 0.5s;

      @include media('>=lg') {
        font-size: 5.5vw
      }

      @include media('>=xl') {
        margin-top: 50px;
      }

      @include media('>=xxl') {
        margin-top: 125px;
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
      height: 100%;
    }

    &__picture4Edges {
      // Three background images creating a wave pattern with angled top edges
      height: calc(100dvh - (var(--hero-height) + var(--header-height)));
      margin-top: var(--hero-height);

      &:nth-child(1) {
        // Left image: trapezoid with angled top-right edge
        clip-path: polygon(
          0 0,                                // top left
          0 100%,                             // bottom left
          100% 100%,                          // bottom right
          100% calc(var(--hero-height) * 0.7) // top right (angled)
        );
        animation: picture-4-edges-appear 2.5s ease-in-out both 0.7s;

        @media screen and (orientation: portrait) {
          img {
            object-position: 60% 50%;
          }
        }
      }

      &:nth-child(2) {
        // Center image: rectangle shifted down by 70% hero-height
        height: calc(100dvh - ((var(--hero-height) * 1.65 + var(--header-height))));
        margin-top: calc(var(--hero-height) * 1.65);
        animation: picture-4-edges-appear 2.5s ease-in-out both 0.5s;

        @media screen and (orientation: portrait) {
          height: calc(100% - (35dvh));
          margin-top: calc(35dvh);

          img {
            object-position: 63% 50%;
          }
        }
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

        @media screen and (orientation: portrait) {
          img {
            object-position: 70% 50%;
          }
        }
      }

      @media screen and (orientation: portrait) {
        // Portrait: all shifted down by 2x hero-height to make room for hexagon
        height: calc(100% - (30dvh));
        margin-top: calc(30dvh);
      }
    }

    &__picture6Edges {
      // Position: vertically centered on hero (overflows top)
      height: calc(2 * var(--hero-height));

      // Hexagonal shape: 6 points define the corners
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
        height: calc(30dvh + var(--hero-height));
        clip-path: polygon(
          50% var(--hero-height),               // top center
          100% 0,                               // top right
          100% 30dvh,                           // bottom right
          50% calc(30dvh + var(--hero-height)), // bottom center
          0 30dvh,                              // bottom left
          0 0                                   // top left
        );
      }
    }

    &__picture6EdgesShadow {
      // Creates gap between hexagon and background images using inverted hexagon shape
      top: calc(var(--hero-height) - 1px);

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
        top: 30dvh;
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
