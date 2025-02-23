// src/app/api/quiz/[quizId]/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

import {  Quiz, IQuizSession, QuizSession } from "@/models";



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();
    const session = await QuizSession.findOne({ quizId }) as IQuizSession | null;

    return NextResponse.json({
      exists: !!session,
      isActive: session?.isActive || false,
      startsAt: session?.startsAt || null,
      endsAt: session?.endsAt || null,
      timeLimit: session?.timeLimit || 30,
      participants: session?.participants || [],
      currentQuestion: session?.currentQuestion || 0,
    });
  } catch (error) {
    console.error("Erro ao buscar sessão:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> } // params é uma Promise
) {
  try {
    const { quizId } = await params; // Aguarde a resolução da Promise
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { action, timeLimit } = body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    let session = await QuizSession.findOne({ quizId }) as IQuizSession | null;

    switch (action) {
      case "start":
        if (!session) {
          session = await QuizSession.create({
            quizId,
            isActive: true,
            isPaused: false,
            timeLimit: timeLimit || 30,
            startsAt: new Date(),
            endsAt: null,
            currentQuestion: 0,
            participants: [],
          }) as IQuizSession;
        } else if (!session.isActive) {
          session.isActive = true;
          session.startsAt = new Date();
          session.endsAt = null;
          await session.save();
        }
        break;

      case "stop":
        if (session && session.isActive) {
          session.isActive = false;
          session.endsAt = new Date();
          await session.save();
        }
        break;

      case "reset":
        if (session) {
          await QuizSession.deleteOne({ quizId });
          session = null;
        }
        break;

      case "updateSettings":
        if (!session) {
          return NextResponse.json(
            { error: "Nenhuma sessão existente para atualizar" },
            { status: 400 }
          );
        }
        if (typeof timeLimit !== "number" || timeLimit < 10 || timeLimit > 300) {
          return NextResponse.json(
            { error: "Tempo limite inválido (deve ser entre 10 e 300 segundos)" },
            { status: 400 }
          );
        }
        session.timeLimit = timeLimit;
        await session.save();
        break;

      default:
        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }

    return NextResponse.json({
      message: "Ação executada com sucesso",
      session: {
        exists: !!session,
        isActive: session?.isActive || false,
        startsAt: session?.startsAt || null,
        endsAt: session?.endsAt || null,
        timeLimit: session?.timeLimit || 30,
        participants: session?.participants || [],
      },
    });
  } catch (error) {
    console.error("[POST /session]", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
