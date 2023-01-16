import db from '../db'

export default defineEventHandler(() => {
  return db.specie.findMany({
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
})
