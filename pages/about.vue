<script setup lang="ts">
import { ref } from 'vue'

useSeoConfig({
  title: 'À propos - Qui suis-je ?',
  description:
    'Cédric Ruiu, photographe et développeur web passionné de myrmécologie. Démarche, parcours et matériel derrière Myrmecophoto.',
  ogImageProps: {
    subtitle: 'Développeur & Photographe',
    description:
      'Créateur de Myrmecophoto, développeur web et photographe passionné de myrmécologie et macrophotographie scientifique.',
  },
  customMeta: {
    ogImageAlt: 'Cédric Ruiu - Créateur de Myrmecophoto',
  },
  pageType: 'about',
})

const form = ref({
  name: '',
  email: '',
  message: '',
})

const { data: emailEncrypted } = useNuxtData('emailEncrypted')

const formResponse = ref('')

function handleSubmit(event: Event) {
  event.preventDefault()

  const formData = new FormData(event.target as HTMLFormElement)
  const params = new URLSearchParams()

  formData.forEach((value, key) => {
    params.append(key, value.toString())
  })

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
    .then((response) => {
      if (response.ok) {
        formResponse.value = `Parfait, le message a bien été envoyé ;)`
        form.value = { name: '', email: '', message: '' }
      } else {
        buildErrorMessage('Form submission failed')
      }
    })
    .catch((error) => {
      buildErrorMessage(error.message)
    })
}

function buildErrorMessage(mess: string) {
  formResponse.value = `Oups, une erreur interne est survenue, merci d'utiliser l'email de contact en attendant ;)`
  console.error('Error:', mess)
}
</script>

<template>
  <div>
    <!-- Hidden form for Netlify detection during build -->
    <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
      <input type="text" name="name" >
      <input type="email" name="email" >
      <textarea name="message"/>
      <input name="bot-field" >
    </form>
  
    <nav aria-label="breadcrumb" class="pt-[clamp(20px,4vw,40px)] text-[13px] text-ink-4">
      <ol class="flex flex-wrap items-center gap-y-1 m-0 p-0 list-none">
        <li><NuxtLink to="/" class="text-ink-4 hover:text-link-hover transition-colors">Accueil</NuxtLink></li>
        <li role="presentation" aria-hidden="true"><span class="mx-2">/</span></li>
        <li><span aria-current="page" class="text-ink-3">À propos</span></li>
      </ol>
    </nav>

    <div
      class="gap-[clamp(48px,7vw,96px)] grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] pt-[clamp(48px,8vw,96px)] pb-[clamp(72px,10vw,120px)]"
    >
      <div>
        <h1
          class="m-0 mb-8 font-400 font-title text-[clamp(2rem,4.5vw,3rem)] italic uppercase leading-[1.15]"
        >
          Qui suis-je&nbsp;?
        </h1>
        <img
          src="/img/cedric-ruiu-avatar.webp"
          alt="Portrait de Cédric Ruiu"
          width="677"
          height="677"
          loading="lazy"
          decoding="async"
          class="mb-7 rounded-full w-full max-w-[280px] object-cover aspect-square"
        >
        <div class="dark:prose-invert max-w-none prose prose-gray">
          <p>
            <i>Myrmecophoto :</i> une fenêtre ouverte sur le monde des fourmis et
            de leur diversité à travers l'objectif de la macrophotographie. Je
            suis développeur web et photographe passionné, captivé par la
            nature et tout particulièrement par l'entomologie. Dès mon enfance,
            les insectes, et surtout les fourmis, ont capté mon attention.
          </p>

          <p>
            Ce site est le point de rencontre de mes passions pour la
            macrophotographie, la myrmécologie et le développement web. Vous y
            trouverez des reportages photo détaillés, des comparatifs de matériel
            de photographie, et des images taxonomiques qui mettent en lumière la
            complexité et la beauté des fourmis.
          </p>

          <p>
            Je vous invite à explorer <i>Myrmecophoto</i> pour découvrir les
            richesses de ces créatures fascinantes. Bonne visite !
          </p>
        </div>
      </div>

      <div>
        <h2
          class="m-0 mb-8 font-400 font-title text-[clamp(1.8rem,4vw,2.6rem)] uppercase leading-tight"
        >
          Contactez-moi
        </h2>
        <p class="mt-0 mb-5 text-ink-2 text-base leading-[1.8]">
          Pour discuter d'une collaboration, partager une observation ou simplement
          échanger sur les fourmis, voici comment me joindre :
        </p>

        <div class="flex flex-col gap-3.5 mb-8">
          <a
            href="https://www.linkedin.com/in/cedric-ruiu/"
            aria-label="Profil LinkedIn de Cédric Ruiu"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2.5 text-[15px] text-ink"
          >
            <i class="text-ink-3 shrink-0 i-fa6-brands-linkedin" />
            <strong class="text-gradient-primary">LinkedIn</strong>
            <span class="text-ink-3">— Visitez mon profil</span>
          </a>
          <a
            href="https://github.com/Cedric-ruiu/"
            aria-label="Profil GitHub de Cédric Ruiu"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2.5 text-[15px] text-ink"
          >
            <i class="text-ink-3 shrink-0 i-fa6-brands-github" />
            <strong class="text-gradient-primary">GitHub</strong>
            <span class="text-ink-3">— Code source de Myrmecophoto</span>
          </a>
        </div>

        <div class="bg-surface p-[clamp(20px,3vw,32px)] rounded-lg">
          <p class="mt-0 mb-5 text-[14.5px] text-ink-3 leading-[1.6]">
            <strong class="text-ink">Formulaire de contact :</strong>
            je réponds généralement sous 48h.
          </p>

          <div v-if="formResponse" class="text-[15px] text-ink-2">
            <p class="mt-0 mb-3">{{ formResponse }}</p>
            <p class="m-0"><MailTo :email-encrypted="emailEncrypted?.data" /></p>
          </div>

          <form
            v-else
            data-netlify="true"
            netlify-honeypot="bot-field"
            name="contact"
            method="POST"
            action="/"
            class="flex flex-col gap-4"
            @submit="handleSubmit"
          >
            <input type="hidden" name="form-name" value="contact" >
            <div style="display: none">
              <label>Don't fill this out if you're human: <input name="bot-field" ></label>
            </div>

            <div>
              <label for="name" class="block mb-1.5 text-[13px] text-ink-4">Nom</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                name="name"
                required
                class="block bg-page px-3 py-2.5 border border-white/15 focus:border-link rounded-[5px] focus:outline-none w-full text-ink text-sm"
              >
            </div>

            <div>
              <label for="email" class="block mb-1.5 text-[13px] text-ink-4">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                name="email"
                required
                class="block bg-page px-3 py-2.5 border border-white/15 focus:border-link rounded-[5px] focus:outline-none w-full text-ink text-sm"
              >
            </div>

            <div>
              <label for="message" class="block mb-1.5 text-[13px] text-ink-4">Message</label>
              <textarea
                id="message"
                v-model="form.message"
                name="message"
                required
                rows="4"
                class="block bg-page px-3 py-2.5 border border-white/15 focus:border-link rounded-[5px] focus:outline-none w-full text-ink text-sm resize-y"
              />
            </div>

            <button
              type="submit"
              class="mt-1 px-5 py-3 border-none rounded-[5px] w-full font-700 text-[#171513] text-sm uppercase tracking-[0.04em] cursor-pointer gradient-primary"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
