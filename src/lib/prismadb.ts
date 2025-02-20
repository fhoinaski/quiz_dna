// src/lib/prismadb.ts
import { PrismaClient } from '@prisma/client'

// Cria uma instância do Prisma Client
let prismadb: PrismaClient

// Em ambiente de produção, sempre cria uma nova instância
if (process.env.NODE_ENV === 'production') {
  prismadb = new PrismaClient()
} 
// Em desenvolvimento, reutiliza a conexão se já existir
else {
  // @ts-ignore - ignorar o erro de tipo global
  if (!global.prismadb) {
    // @ts-ignore - ignorar o erro de tipo global
    global.prismadb = new PrismaClient()
  }
  // @ts-ignore - ignorar o erro de tipo global
  prismadb = global.prismadb
}

export { prismadb }