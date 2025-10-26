import { Prisma } from '@prisma/client'
import db from '../db'

const speciesInclude = Prisma.validator<Prisma.specieDefaultArgs>()({
  include: {
    researcher: true,
    specimen: {
      include: {
        country: true,
        form: true,
        contributor_specimen_collector_idTocontributor: true,
        contributor_specimen_identifier_idTocontributor: true,
        taxonomy_picture: {
          include: {
            material_taxonomy_picture_camera_idTomaterial: true,
            material_taxonomy_picture_lens_primary_idTomaterial: true,
            material_taxonomy_picture_lens_secondary_idTomaterial: true,
            material_taxonomy_picture_lighting_system_idTomaterial: true,
            material_taxonomy_picture_other_material_idTomaterial: true,
          },
        },
      },
      orderBy: { reference: 'asc' },
    },
    genus: {
      include: {
        subfamily: true,
      },
    },
  },
})

export type SpeciesWithRelations = Prisma.specieGetPayload<typeof speciesInclude>

export default defineEventHandler(async () => {
  return await db.specie.findMany({
    include: speciesInclude.include,
  })
})
