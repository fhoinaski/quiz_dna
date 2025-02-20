import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma, Result } from "@prisma/client"

interface ResultRequestBody {
  playerName: string
  score: number
  totalQuestions: number
}

interface RouteContext {
  params: {
    quizId: string
  }
}

type GroupByResult = Prisma.PickEnumerable<Prisma.ResultGroupByOutputType, ["playerName"]> & {
  _max: {
    score: number | null
    totalQuestions: number | null
  }
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { quizId } = context.params

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      )
    }

    const topResults = await prisma.result.groupBy({
      by: ['playerName'],
      where: { quizId },
      _max: {
        score: true,
        totalQuestions: true,
      },
      orderBy: {
        _max: {
          score: 'desc'
        }
      },
      take: 10
    })

    const detailedResults = await Promise.all(
      topResults.map(async (result: GroupByResult) => {
        if (result._max.score === null) return null

        return prisma.result.findFirst({
          where: {
            quizId,
            playerName: result.playerName,
            score: {
              equals: result._max.score
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      })
    )

    const finalResults = detailedResults
      .filter((result): result is NonNullable<typeof result> => result !== null)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

    return NextResponse.json(finalResults)
  } catch (error) {
    console.error('Erro ao buscar resultados:', error)
    return NextResponse.json({ results: [] })
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { quizId } = context.params

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      )
    }

    const body: ResultRequestBody = await request.json()

    const recentResult = await prisma.result.findFirst({
      where: {
        quizId,
        playerName: body.playerName,
        createdAt: {
          gte: new Date(Date.now() - 5000)
        }
      }
    })

    if (recentResult) {
      return NextResponse.json(recentResult)
    }
    
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