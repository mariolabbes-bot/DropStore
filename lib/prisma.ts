// Prefer local generated client for demo (schema.local) when available
let PrismaClientImpl: any
try {
  PrismaClientImpl = require('../node_modules/.prisma/client-local').PrismaClient
} catch (e) {
  // fallback to installed @prisma/client
  // @ts-ignore
  const { PrismaClient } = require('@prisma/client')
  PrismaClientImpl = PrismaClient
}

declare global {
  // allow global `var` across hot-reloads in dev
  // eslint-disable-next-line vars-on-top
  var prisma: any
}

const prisma = (global as any).prisma || new PrismaClientImpl()
if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma

export default prisma
