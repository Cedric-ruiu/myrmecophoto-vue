export const reverseString = (email: string): string => {
  return email.split('').reverse().join('')
}

export const encryptEmail = (email: string): string => {
  return reverseString(email)
}

export const decryptEmail = (email: string): string => {
  return reverseString(email)
}

export const useAbsoluteUrl = (relativeUrl: string) => {
  const config = useRuntimeConfig()
  return new URL(relativeUrl, config.public.baseURL).href
}

/** Long-form French date, e.g. "28 février 2026". */
export const formatArticleDate = (date: string | Date): string =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

/** Site URLs end with a slash (see site.trailingSlash). */
export const withTrailingSlash = (path: string): string =>
  path.endsWith('/') ? path : `${path}/`

/**
 * Viewing angle of a taxonomic photograph.
 *
 * `taxonomy_picture.description` is filled in for only a minority of photos, whereas
 * the angle is always encoded in the file name, shaped as
 * `genus-species-caste-<angle>-<reference>` (e.g. `camponotus-cruentatus-major-dessus-f0002`).
 * We therefore derive it from the file name, for lack of a dedicated database column.
 */
const CASTE_TOKENS = new Set([
  'ouvriere', 'gyne', 'male', 'major', 'media', 'minor',
  'soldat', 'oeuf', 'larve', 'nymphe', 'cocon', 'autre',
])

/** File names carry no accents: they are restored for display. */
const VIEW_TOKEN_ACCENTS: Record<string, string> = {
  petiole: 'pétiole',
  tete: 'tête',
  oeil: 'œil',
  propodeal: 'propodéal',
  eperon: 'éperon',
  arriere: 'arrière',
  inverse: 'inversé',
}

const humanizeViewTokens = (tokens: string[]): string =>
  capitalizeFirst(
    tokens.map((token) => VIEW_TOKEN_ACCENTS[token] ?? token).join(' '),
  )

/** Segments following the last caste token (`…-major-profil-oeil` → `profil oeil`). */
const tokensAfterCaste = (slug: string): string[] => {
  const tokens = slug.split(/[-\s]+/).filter(Boolean).map((t) => t.toLowerCase())

  let lastCaste = -1
  tokens.forEach((token, index) => {
    if (CASTE_TOKENS.has(token)) lastCaste = index
  })

  if (lastCaste === -1) return tokens
  if (lastCaste === tokens.length - 1) return tokens.slice(0, lastCaste)
  return tokens.slice(lastCaste + 1)
}

export const taxonViewLabel = (fileName: string, description?: string | null): string => {
  // `description` mixes written-out labels ("Détail du clypeus") with raw slugs
  // ("spiracle-propodeal - major"): only the former start with a capital letter
  // and can be displayed as-is.
  if (description) {
    if (/^\p{Lu}/u.test(description)) return description
    return humanizeViewTokens(tokensAfterCaste(description))
  }

  const base = fileName
    .replace(/\.(jpg|jpeg|png|avif)$/i, '')
    .replace(/-[fs]\d+$/i, '')

  const tokens = base.split('-').filter(Boolean).map((t) => t.toLowerCase())

  let lastCaste = -1
  tokens.forEach((token, index) => {
    if (CASTE_TOKENS.has(token)) lastCaste = index
  })

  if (lastCaste === -1 || lastCaste === tokens.length - 1) return ''

  return humanizeViewTokens(tokens.slice(lastCaste + 1))
}

/** Capture dates are stored as ISO (`2005-10-20`); rendered in long form. */
export const formatCaptureDate = (value: string): string =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) ? formatArticleDate(value) : value

export const capitalizeFirst = (text: string): string => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}
