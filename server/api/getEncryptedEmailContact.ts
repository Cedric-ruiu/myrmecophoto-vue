import { encryptEmail } from '~/composables/utils'

export default defineEventHandler(() => {
  return { data: encryptEmail(useRuntimeConfig().emailContact) }
})
