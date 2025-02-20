import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  try {
    // Tenta criar um usuário de teste
    const user = await prisma.user.create({
      data: {
        name: 'Teste',
        email: 'teste@teste.com',
        password: '123456'
      }
    })
    
    console.log('Conexão bem sucedida!')
    console.log('Usuário criado:', user)

    // Lista todos os usuários
    const users = await prisma.user.findMany()
    console.log('Usuários no banco:', users)

  } catch (error) {
    console.error('Erro ao conectar:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })