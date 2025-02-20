const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Limpar banco de dados existente
    await prisma.result.deleteMany({})
    await prisma.quiz.deleteMany({})
    await prisma.user.deleteMany({})

    // Criar usuário admin
    const hashedPassword = await hash('123456', 10)
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@dnavital.com',
        password: hashedPassword,
      },
    })

    console.log('Admin criado:', admin)

    // Criar quiz exemplo
    const quiz = await prisma.quiz.create({
      data: {
        title: 'Quiz DNA Básico',
        description: 'Teste seus conhecimentos sobre DNA e genética',
        isPublished: true,
        userId: admin.id,
        questions: [
          {
            text: 'Qual é a função principal do DNA?',
            options: [
              'Armazenar e transmitir informação genética',
              'Produzir energia para a célula',
              'Transportar nutrientes',
              'Destruir bactérias'
            ],
            correctAnswer: 0,
            order: 0
          },
          {
            text: 'O que significa DNA?',
            options: [
              'Determinador Natural Atômico',
              'Ácido Desoxirribonucleico',
              'Detector de Nutrientes Ativos',
              'Divisor Natural Automático'
            ],
            correctAnswer: 1,
            order: 1
          },
          {
            text: 'Onde o DNA está localizado na célula?',
            options: [
              'Apenas na membrana celular',
              'Somente no citoplasma',
              'No núcleo e nas mitocôndrias',
              'Apenas nos ribossomos'
            ],
            correctAnswer: 2,
            order: 2
          }
        ]
      }
    })

    console.log('Quiz criado:', quiz)
    console.log('Seed concluído com sucesso!')

  } catch (error) {
    console.error('Erro ao executar seed:', error)
    throw error
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