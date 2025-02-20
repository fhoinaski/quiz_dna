
import { PrismaClient } from '@prisma/client'

// Usa um nome diferente para evitar conflitos
const globalForPrisma = global as unknown as { 
  prismadb: PrismaClient | undefined 
}

// Inicializa o cliente apenas uma vez
export const prismadb = globalForPrisma.prismadb || new PrismaClient()

// Em desenvolvimento, salva a instância no global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismadb = prismadb
}