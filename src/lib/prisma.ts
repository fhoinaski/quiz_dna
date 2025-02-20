import { PrismaClient } from '@prisma/client'

// Evita múltiplas instâncias do Prisma Client durante hot reload
const prismaGlobal = global as unknown as { prisma: PrismaClient }

export const prisma = 
  prismaGlobal.prisma || 
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma
}