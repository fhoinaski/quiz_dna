import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteContext {
  params: Promise<{ quizId: string }>
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { quizId } = await params

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
  { params }: RouteContext
) {
  try {
    const { quizId } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        message: "Não autorizado"
      }, { status: 401 })
    }

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

    await prisma.result.deleteMany({
      where: { quizId }
    })

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
  { params }: RouteContext
) {
  try {
    const { quizId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()

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