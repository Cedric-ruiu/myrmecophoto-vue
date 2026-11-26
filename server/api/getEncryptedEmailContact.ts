import { defineHandler, useRuntimeConfig } from 'nuxt/server'
import { encryptEmail } from '#shared/utils/email'

export default defineHandler(() => {
  return { data: encryptEmail(useRuntimeConfig().emailContact) }
})
