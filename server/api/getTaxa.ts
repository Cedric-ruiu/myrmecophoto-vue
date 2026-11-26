import { defineHandler } from 'nuxt/server'
import type { Prisma } from '../../prisma/generated/client/client'
import db from '../db'

// Taxonomic tree for the collection listings (home excerpt, /taxons/, alphabetical
// index): only the fields those pages and their JSON-LD read.
const taxaSelect = {
  select: {
    id: true,
    name: true,
    description: true,
    genus: {
      select: {
        id: true,
        name: true,
        specie: {
          select: {
            id: true,
            name: true,
            year: true,
            researcher: { select: { name: true } },
            _count: { select: { specimen: true } },
            // Card thumbnail: first view of the first specimen.
            specimen: {
              select: {
                taxonomy_picture: {
                  select: { file_name: true },
                  orderBy: { id: 'asc' },
                  take: 1,
                },
              },
              orderBy: { reference: 'asc' },
              take: 1,
            },
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    },
  },
} satisfies Prisma.subfamilyDefaultArgs

export type TaxaWithRelations = Prisma.subfamilyGetPayload<typeof taxaSelect>

export default defineHandler(async () => {
  return await db.subfamily.findMany({
    select: taxaSelect.select,
    orderBy: { name: 'asc' },
  })
})
