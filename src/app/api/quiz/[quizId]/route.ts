import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteContext {
  params: Promise<{ quizId: string }>
}

// Helper function para validar o quizId
const validateQuizId = async (quizId: string) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId }
  })
  return quiz
}

// Helper function para validar a sessão
const validateSession = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }
  return session
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { quizId } = await params
    const quiz = await validateQuizId(quizId)

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Erro ao buscar quiz:', error)
    return NextResponse.json(
      { error: "Erro ao buscar quiz" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { quizId } = await params
    const session = await validateSession()
    const quiz = await validateQuizId(quizId)

    if (!quiz) {
      return NextResponse.json({
        success: false,
        message: "Quiz não encontrado"
      }, { status: 404 })
    }

    if (quiz.userId !== session.user.id) {
      return NextResponse.json({
        success: false,
        message: "Não autorizado"
      }, { status: 403 })
    }

    // Usando transação para garantir a integridade dos dados
    await prisma.$transaction([
      prisma.result.deleteMany({ where: { quizId } }),
      prisma.quiz.delete({ where: { id: quizId } })
    ])

    return NextResponse.json({
      success: true,
      message: "Quiz excluído com sucesso"
    })

  } catch (error) {
    if (error instanceof Error && error.message === "Não autorizado") {
      return NextResponse.json({
        success: false,
        message: "Não autorizado"
      }, { status: 401 })
    }

    console.error('Erro ao excluir quiz:', error)
    return NextResponse.json({
      success: false,
      message: "Erro ao excluir quiz"
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { quizId } = await params
    const session = await validateSession()
    const quiz = await validateQuizId(quizId)

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      )
    }

    if (quiz.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        title: body.title,
        description: body.description,
        questions: body.questions,
        isPublished: body.isPublished
      }
    })

    return NextResponse.json(updatedQuiz)
  } catch (error) {
    if (error instanceof Error && error.message === "Não autorizado") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    console.error('Erro ao atualizar quiz:', error)
    return NextResponse.json(
      { error: "Erro ao atualizar quiz" },
      { status: 500 }
    )
  }
}