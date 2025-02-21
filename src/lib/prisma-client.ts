import { PrismaClient } from '@prisma/client';

// Criação simples de uma única instância do Prisma
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

export default prisma;