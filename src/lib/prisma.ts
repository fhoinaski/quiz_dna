import { PrismaClient } from '@prisma/client'

// PrismaClient é anexado ao objeto global em desenvolvimento para evitar
// esgotamento de conexões durante hot reloading
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

// Definimos uma variável para evitar instanciações múltiplas em desenvolvimento
// e uma instância limpa em produção
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Em desenvolvimento, anexamos o cliente ao objeto global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}