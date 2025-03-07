import { prisma } from '../prisma'
import { publicProcedure, router } from '../trpc'

export const axleBusinessRouter = router({
  list: publicProcedure.query(async () => {
    const businessCount = await prisma.axleBusiness.count()

    return businessCount
  }),
})
