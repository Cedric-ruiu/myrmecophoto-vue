import db from '../db'

const stripExtension = (fileName: string) => fileName.replace(/\.(jpg|jpeg|png|avif)$/i, '')

export interface TaxonPictureInfo {
  fileBase: string
  file_name: string
  description: string | null
  genus: string
  specie: string
  form: string
  reference: string | null
}

// Specimen photos looked up by file base (`?files=a,b`), returned in request order.
// Used by the homepage hero, which only needs a handful of plates.
export default defineEventHandler(async (event): Promise<TaxonPictureInfo[]> => {
  const files = String(getQuery(event).files || '')
    .split(',')
    .map(f => f.trim())
    .filter(Boolean)
    .slice(0, 20)

  if (!files.length) return []

  const pictures = await db.taxonomy_picture.findMany({
    where: { OR: files.map(f => ({ file_name: { startsWith: f } })) },
    select: {
      file_name: true,
      description: true,
      specimen: {
        select: {
          reference: true,
          form: { select: { name: true } },
          specie: { select: { name: true, genus: { select: { name: true } } } },
        },
      },
    },
  })

  return files.flatMap((fileBase) => {
    const picture = pictures.find(p => stripExtension(p.file_name) === fileBase)
    if (!picture) return []
    return [{
      fileBase,
      file_name: picture.file_name,
      description: picture.description,
      genus: picture.specimen.specie.genus.name,
      specie: picture.specimen.specie.name,
      form: picture.specimen.form.name,
      reference: picture.specimen.reference,
    }]
  })
})
