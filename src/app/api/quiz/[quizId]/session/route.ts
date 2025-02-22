// src/app/api/quiz/[quizId]/session/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizSession, Quiz, QuizSession } from "@/models";

type QuizModel = Model<IQuiz>;
type QuizSessionModel = Model<IQuizSession>;

// POST - Criar ou atualizar sessão de quiz
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const params = await context.params;
    const { quizId } = params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verificar se o quiz existe e pertence ao usuário atual
    const quiz = await (Quiz as QuizModel).findOne({
      _id: quizId,
      userId: session.user.id,
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado ou não autorizado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { action } = body;

    // Buscar ou criar sessão do quiz
    let quizSession = await (QuizSession as QuizSessionModel).findOne({
      quizId,
    });

    if (!quizSession) {
      quizSession = await (QuizSession as QuizSessionModel).create({
        quizId,
        isActive: false,
        participants: [],
      });
    }

    // Ações disponíveis
    switch (action) {
      case "activate":
        quizSession.isActive = true;
        quizSession.startsAt = new Date();
        quizSession.endsAt = null;
        break;
      case "deactivate":
        quizSession.isActive = false;
        quizSession.endsAt = new Date();
        break;
      case "reset":
        quizSession.isActive = false;
        quizSession.startsAt = null;
        quizSession.endsAt = null;
        quizSession.participants = [];
        break;
      default:
        return NextResponse.json(
          { error: "Ação inválida" },
          { status: 400 }
        );
    }

    await quizSession.save();

    return NextResponse.json({
      success: true,
      session: quizSession,
    });
  } catch (error: any) {
    console.error("Erro na API de sessão do quiz:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Obter status da sessão
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const params = await context.params;
    const { quizId } = params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const quizSession = await (QuizSession as QuizSessionModel).findOne({
      quizId,
    });

    if (!quizSession) {
      return NextResponse.json(
        { exists: false, isActive: false, participants: [] }
      );
    }

    return NextResponse.json({
      exists: true,
      isActive: quizSession.isActive,
      startsAt: quizSession.startsAt,
      endsAt: quizSession.endsAt,
      participants: quizSession.participants,
    });
  } catch (error: any) {
    console.error("Erro ao obter status da sessão:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}