import type { Prisma } from '../../../prisma/generated/client/client'
import db from '../../db'

// Everything a taxon page renders (template + Taxon JSON-LD), nothing more.
const taxonSelect = {
  select: {
    id: true,
    genus_id: true,
    name: true,
    year: true,
    description: true,
    vernacular_name: true,
    researcher: { select: { name: true, wiki_url: true } },
    genus: {
      select: {
        name: true,
        subfamily: { select: { name: true, description: true } },
      },
    },
    specimen: {
      select: {
        id: true,
        reference: true,
        size_mm: true,
        capture_site: true,
        capture_date: true,
        description: true,
        form: { select: { name: true } },
        country: { select: { name: true } },
        contributor_specimen_collector_idTocontributor: { select: { name: true } },
        contributor_specimen_identifier_idTocontributor: { select: { name: true } },
        taxonomy_picture: {
          select: { id: true, file_name: true, description: true, date: true },
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { reference: 'asc' },
    },
  },
} satisfies Prisma.specieDefaultArgs

export type TaxonDetail = Prisma.specieGetPayload<typeof taxonSelect> & {
  /** Other photographed species of the same genus. */
  sameGenus: { name: string }[]
}

export default defineEventHandler(async (event): Promise<TaxonDetail> => {
  // Slug shaped as `genus-species` ("sp." is written "sp" in URLs).
  const [genusPart, speciesPart] = (getRouterParam(event, 'slug') || '').split('-', 2)
  const routeGenus = genusPart?.trim().toLowerCase()
  let routeSpecie = speciesPart?.trim()

  if (!routeGenus || !routeSpecie)
    throw createError({ statusCode: 404, statusMessage: 'Taxon Not Found' })

  if (routeSpecie === 'sp') routeSpecie += '.'

  // Several genera share a species name ("sp."): match on the genus as well.
  // SQLite has no case-insensitive mode in Prisma, so the genus is compared here.
  const candidates = await db.specie.findMany({
    where: { name: routeSpecie },
    select: taxonSelect.select,
    orderBy: { id: 'asc' },
  })
  const taxon = candidates.find(s => s.genus.name.toLowerCase() === routeGenus)

  if (!taxon)
    throw createError({ statusCode: 404, statusMessage: 'Taxon Not Found' })

  const sameGenus = await db.specie.findMany({
    where: {
      genus_id: taxon.genus_id,
      id: { not: taxon.id },
      specimen: { some: {} },
    },
    select: { name: true },
    orderBy: { id: 'asc' },
  })

  return { ...taxon, sameGenus }
})
