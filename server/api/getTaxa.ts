import db from '../db'

export default defineEventHandler(() => {
  return db.subfamily.findMany({
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
    orderBy: { name: 'asc' },
  })
})
