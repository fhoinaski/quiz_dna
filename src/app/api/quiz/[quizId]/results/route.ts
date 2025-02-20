import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  const quizId = params.quizId

  try {
    // Verifica se o quiz existe
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      )
    }

    // Busca o melhor resultado de cada jogador
    const results = await prisma.result.groupBy({
      by: ['playerName'],
      where: { quizId },
      _max: {
        score: true,
        createdAt: true,
        totalQuestions: true,
      },
      orderBy: {
        _max: {
          score: 'desc'
        }
      },
      take: 10
    })

    // Busca os detalhes completos dos melhores resultados
    const detailedResults = await Promise.all(
      results.map(async (result) => {
        return prisma.result.findFirst({
          where: {
            quizId,
            playerName: result.playerName,
            score: result._max.score,
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      })
    )

    // Remove possíveis resultados nulos e ordena
    const finalResults = detailedResults
      .filter(Boolean)
      .sort((a, b) => {
        if (b!.score !== a!.score) {
          return b!.score - a!.score
        }
        return new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime()
      })

    return NextResponse.json(finalResults)
  } catch (error) {
    console.error('Erro ao buscar resultados:', error)
    return NextResponse.json({ results: [] })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  const quizId = params.quizId

  try {
    // Verifica se o quiz existe
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Verifica se já existe um resultado recente para este jogador
    const recentResult = await prisma.result.findFirst({
      where: {
        quizId,
        playerName: body.playerName,
        createdAt: {
          gte: new Date(Date.now() - 5000) // últimos 5 segundos
        }
      }
    })

    if (recentResult) {
      return NextResponse.json(recentResult)
    }
    
    // Cria novo resultado
    const result = await prisma.result.create({
      data: {
        quizId,
        playerName: body.playerName,
        score: body.score,
        totalQuestions: body.totalQuestions,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao salvar resultado:', error)
    return NextResponse.json(
      { error: "Erro ao salvar resultado" },
      { status: 500 }
    )
  }
}