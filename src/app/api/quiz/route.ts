// app/api/quiz/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma-client"

// POST - Criar novo quiz
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const quiz = await prisma.quiz.create({
      data: {
        title: body.title,
        description: body.description,
        questions: body.questions,
        userId: session.user.id,
        isPublished: body.isPublished || false
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error("Erro ao criar quiz:", error)
    return NextResponse.json(
      { error: "Erro ao criar quiz" },
      { status: 500 }
    )
  }
}

// GET - Listar quizzes
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        _count: {
          select: {
            results: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error("Erro ao listar quizzes:", error)
    return NextResponse.json(
      { error: "Erro ao listar quizzes" },
      { status: 500 }
    )
  }
}
