import { PrismaClient } from '@prisma/client'

// Declaramos uma variável global para o PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Exportamos uma única instância do PrismaClient
export const prisma = globalForPrisma.prisma || new PrismaClient()

// Em desenvolvimento, anexamos o cliente ao objeto global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}