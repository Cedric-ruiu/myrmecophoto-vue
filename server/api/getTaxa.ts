import db from '../db'

export default defineEventHandler(() => {
  return db.subfamily.findMany({
    include: {
      genus: {
        include: {
          specie: {
            include: {
              researcher: true,
            },
            orderBy: { name: 'asc' },
          },
        },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })
})
