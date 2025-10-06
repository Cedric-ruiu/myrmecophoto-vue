import { Prisma } from '@prisma/client'
import db from '../db'

const taxaInclude = Prisma.validator<Prisma.subfamilyDefaultArgs>()({
  include: {
    genus: {
      include: {
        specie: {
          include: {
            researcher: true,
            _count: {
              select: { specimen: true },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    },
  },
})

export type TaxaWithRelations = Prisma.subfamilyGetPayload<typeof taxaInclude>

export default defineEventHandler(async () => {
  return await db.subfamily.findMany({
    include: taxaInclude.include,
    orderBy: { name: 'asc' },
  })
})
