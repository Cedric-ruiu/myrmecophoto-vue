import prisma from '../db'

export default defineEventHandler(() => {
  return prisma.country.findMany()
})
