<script setup lang="ts">
import { ref } from 'vue'

useSeoConfig({
  title: 'À propos - Qui suis-je ?',
  description:
    'Découvrez Cédric Ruiu, développeur web et photographe passionné de myrmécologie. Créateur de Myrmecophoto, alliance entre macro-photographie et science des fourmis.',
  ogImageProps: {
    subtitle: 'Développeur & Photographe',
    description:
      'Créateur de Myrmecophoto, développeur web et photographe passionné de myrmécologie et macro-photographie scientifique.',
  },
  customMeta: {
    ogImageAlt: 'Cédric Ruiu - Créateur de Myrmecophoto',
  },
})

const form = ref({
  name: '',
  email: '',
  message: '',
})

const { data: emailEncrypted } = useNuxtData('emailEncrypted')

if (emailEncrypted == null || emailEncrypted.value == null)
  throw createError({
    statusCode: 404,
    statusMessage: 'Api getEncryptedEmailContact Not Found',
  })

const formResponse = ref('')

function handleSubmit(event: Event) {
  event.preventDefault()

  const formData = new FormData(event.target as HTMLFormElement)

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData as any).toString(),
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
  <!-- Hidden form for Netlify detection during build -->
  <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
    <input type="text" name="name" />
    <input type="email" name="email" />
    <textarea name="message"></textarea>
    <input name="bot-field" />
  </form>

  <div class="flex flex-col md:flex-row justify-between gap-8 w-full">
    <div>
      <div class="my-10 lg:my-30">
        <h1
          class="text-white text-5xl lg:text-6xl font-normal italic uppercase"
        >
          Qui suis-je&nbsp;?
        </h1>
      </div>
      <div class="prose prose-gray dark:prose-invert">
        <img
          src="/img/cedric-ruiu-avatar.webp"
          alt="Image avatar de Cédric Ruiu"
        />
        <p>
          <i>MyrmecoPhoto :</i> une fenêtre ouverte sur le monde des fourmis et
          de leur diversité à travers l'objectif de la macro-photographie. Je
          suis un développeur web et un photographe passionné, captivé par la
          nature et tout particulièrement par l'entomologie. Dès mon enfance,
          les insectes, et surtout les fourmis, ont capté mon attention.
        </p>

        <p>
          Ce site est le point de rencontre de mes passions pour la
          macro-photographie, la myrmécologie et le développement web. Vous y
          trouverez des reportages photo détaillés, des comparatifs de matériel
          de photographie, et des images taxonomiques qui mettent en lumière la
          complexité et la beauté des fourmis.
        </p>

        <p>
          Je vous invite à explorer <i>MyrmecoPhoto :</i> pour découvrir les
          richesses de ces créatures fascinantes. Bonne visite!
        </p>
      </div>
    </div>
    <div>
      <div class="my-10 lg:my-30">
        <h1
          class="text-white text-5xl lg:text-6xl font-normal italic uppercase"
        >
          Contactez moi
        </h1>
      </div>
      <div class="prose prose-gray dark:prose-invert">
        <p>
          Si vous souhaitez discuter de collaborations, partager des idées ou
          simplement en savoir plus sur mon travail, voici comment vous pouvez
          me contacter :
        </p>

        <p>
          <a
            href="https://www.linkedin.com/in/cedric-ruiu/"
            alt="Page LinkedIn de Cédric Ruiu"
            class="text-gradient-primary"
            ><i class="i-fa6-brands-linkedin"></i>
            <strong> LinkedIn -</strong></a
          >
          Visitez mon profil.
        </p>

        <p>
          <a
            href="https://github.com/Cedric-ruiu/"
            alt="Page LinkedIn de Cédric Ruiu"
            class="text-gradient-primary"
            ><i class="i-fa6-brands-github"></i> <strong>GitHub -</strong></a
          >
          Découvrez mes projets sur GitHub, avec tout le code source de
          Myrmecophoto.
        </p>

        <p>
          <strong>Formulaire de Contact:</strong> Pour me contacter rapidement,
          utilisez le formulaire suivant, je vous répondrais aussitôt que
          possible.
        </p>

        <div class="p-4 w-full mx-auto bg-stone-900 rounded">
          <div v-if="formResponse">
            <p></p>
            {{ formResponse }}
            <p><MailTo :email-encrypted="emailEncrypted?.data" /></p>
          </div>
          <form
            v-else
            @submit="handleSubmit"
            data-netlify="true"
            netlify-honeypot="bot-field"
            name="contact"
            method="POST"
            action="/"
          >
            <input type="hidden" name="form-name" value="contact" />
            <div style="display: none">
              <label
                >Don't fill this out if you're human: <input name="bot-field"
              /></label>
            </div>

            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-white"
                >Nom:</label
              >
              <input
                type="text"
                id="name"
                name="name"
                v-model="form.name"
                required
                class="mt-1 block w-full px-3 py-2 border border-stone-700 rounded-md shadow-sm bg-stone-800 text-white focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-white"
                >Email:</label
              >
              <input
                type="email"
                id="email"
                name="email"
                v-model="form.email"
                required
                class="mt-1 block w-full px-3 py-2 border border-stone-700 rounded-md shadow-sm bg-stone-800 text-white focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="mb-4">
              <label for="message" class="block text-sm font-medium text-white"
                >Message:</label
              >
              <textarea
                id="message"
                name="message"
                v-model="form.message"
                required
                class="mt-1 block w-full px-3 py-2 border border-stone-700 rounded-md shadow-sm bg-stone-800 text-white focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white gradient-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
