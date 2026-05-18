import { Prisma } from '../../prisma/generated/client/client'
import db from '../db'

const taxaInclude = {
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
} satisfies Prisma.subfamilyDefaultArgs

export type TaxaWithRelations = Prisma.subfamilyGetPayload<typeof taxaInclude>

export default defineEventHandler(async () => {
  return await db.subfamily.findMany({
    include: taxaInclude.include,
    orderBy: { name: 'asc' },
  })
})
