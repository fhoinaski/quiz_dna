import { PrismaClient } from '@prisma/client'

// Declaramos uma variável global para o PrismaClient
const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined
}

// Criar e exportar a instância do PrismaClient com uma verificação mais robusta
export const prisma = 
  globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// Em desenvolvimento, anexamos o cliente ao objeto global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}