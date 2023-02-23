<template>
  <header>
    <div class="[ o-header ] h-20 container mx-auto w-full font-text">
      <NuxtLink to="/" class="text-lg font-400 uppercase">
        Myrmeco<span class="font-700 gradient-primary">photo</span>
      </NuxtLink>
      <nav aria-label="Main Navigation">
        <ul class="[ o-header__nav ] flex text-sm text-right uppercase">
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
      <button type="button" class="[ o-header__menuBar ] md:hidden" role="button" aria-controls="main-nav-header" aria-expanded="false" />
    </div>
  </header>
</template>

<style lang="scss">
@layer components {
  .o-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__nav:hover {
      :not(:hover) {
        color: #ccc;
      }
    }
  }
}
</style>
