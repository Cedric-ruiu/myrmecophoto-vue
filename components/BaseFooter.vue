<script setup lang="ts">
const { data: emailEncrypted } = useNuxtData('emailEncrypted')

const currentYear = new Date().getFullYear()

const navigationLinks = [
  { to: '/taxons/', label: 'Photos spécimens' },
  { to: '/articles/', label: 'Articles' },
  { to: '/about/', label: 'À propos / Contact' },
]

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/cedric-ruiu/',
    icon: 'i-fa6-brands-linkedin',
    label: 'LinkedIn',
    ariaLabel: 'Profil LinkedIn de Cédric Ruiu',
  },
  {
    href: 'https://github.com/Cedric-ruiu/',
    icon: 'i-fa6-brands-github',
    label: 'GitHub',
    ariaLabel: 'Profil GitHub de Cédric Ruiu',
  },
]
</script>

<template>
  <footer class="bg-surface-footer mt-auto pt-16 pb-8 border-white/10 border-t font-text gutter-x">
    <div class="gap-12 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] measure-wide">
      <div class="flex flex-col gap-4">
        <div>
          <p class="m-0 font-400 font-title text-[22px] italic leading-none">
            Myrmeco<span class="font-700 text-gradient-primary not-italic">photo</span>
          </p>
          <p class="mt-2 mb-0 text-[15px] text-ink-4 italic leading-snug">
            Macrophotographies des fourmis
          </p>
        </div>
        <address class="text-[13px] text-ink-4 not-italic leading-relaxed">
          <p class="my-0">&copy; {{ currentYear }} Cédric Ruiu</p>
          <p class="my-0">Vannes, Bretagne, France</p>
        </address>
      </div>

      <div class="gap-8 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
        <nav aria-label="Navigation du pied de page">
          <h3 class="m-0 mb-4 font-700 font-text text-gradient-primary text-xs uppercase leading-tight tracking-[0.1em]">
            Navigation
          </h3>
          <ul class="flex flex-col gap-2.5 m-0 p-0 text-sm list-none">
            <li v-for="link in navigationLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="inline-flex items-center gap-2 focus-visible:outline-none text-ink-2 hover:text-link-hover no-underline leading-snug transition-all hover:translate-x-1 focus-visible:translate-x-1 duration-200 ease-in-out"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div>
          <h3 class="m-0 mb-4 font-700 font-text text-gradient-primary text-xs uppercase leading-tight tracking-[0.1em]">
            Contact & Réseaux
          </h3>
          <ul class="flex flex-col gap-2.5 m-0 p-0 text-sm list-none">
            <li v-if="emailEncrypted?.data" class="text-ink-2 hover:translate-x-1 focus-visible:translate-x-1 duration-200 ease-in-out">
              <MailTo :email-encrypted="emailEncrypted.data" />
            </li>
            <li v-for="social in socialLinks" :key="social.href">
              <a
                :href="social.href"
                :aria-label="social.ariaLabel"
                target="_blank"
                rel="noopener noreferrer"
                class="group inline-flex items-center gap-2 focus-visible:outline-none text-ink-2 hover:text-link-hover no-underline leading-snug transition-all hover:translate-x-1 focus-visible:translate-x-1 duration-200 ease-in-out"
              >
                <i :class="[social.icon, 'transition-transform duration-200 ease-in-out']" />
                {{ social.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
