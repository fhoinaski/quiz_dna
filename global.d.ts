declare global {
    var prisma: import('@prisma/client').PrismaClient | undefined;
  }
  
  // Isso é necessário para que o TypeScript trate este arquivo como um módulo
  export {};