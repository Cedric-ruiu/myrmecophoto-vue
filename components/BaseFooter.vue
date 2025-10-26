<script setup lang="ts">
const { data: emailEncrypted } = useNuxtData('emailEncrypted')

if (emailEncrypted == null || emailEncrypted.value == null)
  throw createError({
    statusCode: 404,
    statusMessage: 'Api getEncryptedEmailContact Not Found',
  })

const currentYear = new Date().getFullYear()

const navigationLinks = [
  { to: '/taxons', label: 'Photos spécimens' },
  { to: '/articles', label: 'Articles' },
  { to: '/about', label: 'À propos / Contact' },
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
  <footer class="bg-black/30 mt-16 py-16 border-white/10 border-t font-text">
    <div class="gap-12 lg:gap-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_3fr] container-responsive">
      <!-- Left Zone: Brand & Info -->
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <h2 class="m-0 font-500 sm:text-[1.75rem] text-2xl uppercase leading-tight tracking-tight">
            Myrmeco<span class="text-gradient-primary">photo</span>
          </h2>
          <p class="m-0 text-[0.9rem] text-white/70 sm:text-base italic leading-snug">
            Macro-photographies des fourmis
          </p>
        </div>
        <address class="text-white/60 text-sm not-italic leading-relaxed">
          <p class="my-1">&copy; {{ currentYear }} Cédric Ruiu</p>
          <p class="my-1">Vannes, Brittany, France</p>
        </address>
      </div>

      <!-- Right Zone: Navigation & Social -->
      <div class="gap-8 sm:gap-10 grid grid-cols-1 sm:grid-cols-2">
        <!-- Navigation Links -->
        <nav aria-label="Navigation du pied de page">
          <h3 class="m-0 mb-4 font-700 text-gradient-primary text-sm uppercase leading-tight tracking-widest">
            Navigation
          </h3>
          <ul class="flex flex-col gap-3 m-0 p-0 list-none">
            <li v-for="link in navigationLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="inline-flex items-center gap-2 focus-visible:outline-none text-[0.9rem] text-white/80 no-underline leading-snug transition-all hover:translate-x-1 focus-visible:translate-x-1 duration-200 ease-in-out"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Contact & Social Links -->
        <div>
          <h3 class="m-0 mb-4 font-700 text-gradient-primary text-sm uppercase leading-tight tracking-widest">
            Contact & Réseaux
          </h3>
          <ul class="flex flex-col gap-3 m-0 p-0 list-none">
            <li class="text-[0.9rem] text-white/80 hover:translate-x-1 focus-visible:translate-x-1 duration-200 ease-in-out">
              <MailTo :email-encrypted="emailEncrypted?.data" />
            </li>
            <li v-for="social in socialLinks" :key="social.href">
              <a
                :href="social.href"
                :aria-label="social.ariaLabel"
                target="_blank"
                rel="noopener noreferrer"
                class="group inline-flex items-center gap-2 focus-visible:outline-none text-[0.9rem] text-white/80 no-underline leading-snug transition-all hover:translate-x-1 focus-visible:translate-x-1 duration-200 ease-in-out"
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
