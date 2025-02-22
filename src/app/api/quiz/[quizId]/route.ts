// src/app/api/quiz/[quizId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, Quiz } from "@/models";

// Tipando o modelo Quiz explicitamente
type QuizModel = Model<IQuiz>;

// GET - Obter quiz por ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Buscar o quiz e verificar se o usuário tem permissão
    const quiz = await (Quiz as QuizModel)
      .findOne({
        _id: quizId,
        userId: session.user.id,
      })
      .exec();

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado ou não autorizado" },
        { status: 404 }
      );
    }

    // Transformar o documento do Mongoose em um objeto simples
    const quizData = {
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
      isPublished: quiz.isPublished,
      userId: quiz.userId.toString(),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    };

    return NextResponse.json(quizData);
  } catch (error) {
    console.error(`Erro ao obter quiz: ${error}`);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar quiz existente
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validação básica dos campos obrigatórios
    if (!body.title || !body.description || !body.questions) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Verificar se o quiz existe e pertence ao usuário
    const existingQuiz = await (Quiz as QuizModel)
      .findOne({
        _id: quizId,
        userId: session.user.id,
      })
      .exec();

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado ou não autorizado" },
        { status: 404 }
      );
    }

    // Atualiza o quiz
    const updatedQuiz = await (Quiz as QuizModel).findByIdAndUpdate(
      quizId,
      {
        title: body.title,
        description: body.description,
        questions: body.questions,
        isPublished: body.isPublished || false, // Garantir que o campo isPublished seja atualizado
      },
      { new: true } // Retorna o documento atualizado
    );

    // Transformar o documento do Mongoose em um objeto simples
    const quizData = {
      id: updatedQuiz._id.toString(),
      title: updatedQuiz.title,
      description: updatedQuiz.description,
      questions: updatedQuiz.questions,
      isPublished: updatedQuiz.isPublished,
      userId: updatedQuiz.userId.toString(),
      createdAt: updatedQuiz.createdAt,
      updatedAt: updatedQuiz.updatedAt
    };

    return NextResponse.json(quizData);
  } catch (error) {
    console.error(`Erro ao atualizar quiz: ${error}`);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir quiz existente
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Verificar se o quiz existe e pertence ao usuário
    const existingQuiz = await (Quiz as QuizModel)
      .findOne({
        _id: quizId,
        userId: session.user.id,
      })
      .exec();

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado ou não autorizado" },
        { status: 404 }
      );
    }

    // Excluir o quiz
    await (Quiz as QuizModel).findByIdAndDelete(quizId);

    // Também poderia excluir resultados associados aqui, se necessário
    // await QuizResult.deleteMany({ quizId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Erro ao excluir quiz: ${error}`);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}