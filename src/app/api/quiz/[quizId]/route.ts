import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  context: { params: { quizId: string } }
) {
  const { quizId } = await Promise.resolve(context.params)

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    })

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
  context: { params: { quizId: string } }
) {
  const { quizId } = await Promise.resolve(context.params)

  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: "Não autorizado"
      }, { status: 401 })
    }

    // Verificar se o quiz existe e pertence ao usuário
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    })

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

    // Excluir os resultados primeiro
    await prisma.result.deleteMany({
      where: { quizId }
    })

    // Depois excluir o quiz
    await prisma.quiz.delete({
      where: { id: quizId }
    })

    return NextResponse.json({
      success: true,
      message: "Quiz excluído com sucesso"
    }, { status: 200 })

  } catch (error) {
    console.error('Erro ao excluir quiz:', error)
    return NextResponse.json({
      success: false,
      message: "Erro ao excluir quiz"
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  context: { params: { quizId: string } }
) {
  const { quizId } = await Promise.resolve(context.params)

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Verificar se o quiz existe e pertence ao usuário
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    })

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      )
    }

    if (existingQuiz.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 403 }
      )
    }

    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        title: body.title,
        description: body.description,
        questions: body.questions,
        isPublished: body.isPublished
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Erro ao atualizar quiz:', error)
    return NextResponse.json(
      { error: "Erro ao atualizar quiz" },
      { status: 500 }
    )
  }
}