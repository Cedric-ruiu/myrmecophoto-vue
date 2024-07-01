<script setup lang="ts">
import { ref } from 'vue'

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

function handleSubmit() {
  const data = {
    name: form.value.name,
    email: form.value.email,
    message: form.value.message,
  }

  fetch('/.netlify/functions/sendEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        formResponse.value = `Parfait, le message a bien été envoyé ;)`
      } else {
        buildErrorMessage('Form submission failed')
      }
    })
    .catch((error) => {
      buildErrorMessage(error)
    })
}

function buildErrorMessage(mess: string) {
  formResponse.value = `Oups, une erreur interne est survenue, merci d'utiliser l'email de contact en attendant ;)`
  console.error('Error:', mess)
}
</script>

<template>
  <div class="flex flex-row justify-between gap-2 w-full">
    <div>
      <div class="my-30">
        <h1 class="text-white text-6xl font-normal italic uppercase">
          Qui suis-je ?
        </h1>
      </div>
      <div class="prose">
        <img
          src="/public/img/cedric-ruiu-avatar.webp"
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
      <div class="my-30">
        <h1 class="text-white text-6xl font-normal italic uppercase">
          Contactez moi
        </h1>
      </div>
      <div class="prose">
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

        <div class="p-4 w-full mx-auto bg-gray-900 rounded">
          <div v-if="formResponse">
            <p></p>
            {{ formResponse }}
            <p><MailTo :email-encrypted="emailEncrypted?.data" /></p>
          </div>
          <form
            v-else
            @submit.prevent="handleSubmit"
            data-netlify="true"
            name="contact"
            method="POST"
          >
            <input type="hidden" name="form-name" value="contact" />

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
                class="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
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
                class="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
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
                class="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
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
