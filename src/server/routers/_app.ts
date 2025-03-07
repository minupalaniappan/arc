/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc'
import { axleBusinessRouter } from './axelBusinessRouter'

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  axleBusiness: axleBusinessRouter,
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
