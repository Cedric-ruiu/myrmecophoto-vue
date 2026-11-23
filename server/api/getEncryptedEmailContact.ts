import { defineEventHandler, useRuntimeConfig } from 'nuxt/server'
import { encryptEmail } from '#shared/utils/email'

export default defineEventHandler(() => {
  return { data: encryptEmail(useRuntimeConfig().emailContact) }
})
