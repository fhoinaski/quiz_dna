// src/app/api/quiz/[quizId]/results/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Quiz, QuizResult, IQuizResult } from "@/models";
import { calculateQuizScore } from "@/utils/scoring";

// Função para corrigir documentos antigos sem correctAnswers


export async function POST(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { playerName, playerAvatar, answers, clientId, correctAnswers: frontendCorrectAnswers } = body;

    if (!playerName || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    await connectToDatabase();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    const existingResult = clientId ? await QuizResult.findOne({ quizId, clientId }) : null;
    if (existingResult) {
      return NextResponse.json(
        {
          id: existingResult._id.toString(),
          score: existingResult.score,
          correctAnswers: existingResult.correctAnswers,
          playerName,
        },
        { status: 200 }
      );
    }

    const totalQuestions = quiz.questions.length;
    const enrichedAnswers = answers.map((answer: any) => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      return {
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        timeToAnswer: answer.timeToAnswer,
        isCorrect: isCorrect || answer.isCorrect,
      };
    });

    const scoreResult = calculateQuizScore(enrichedAnswers);
    const timeSpent = enrichedAnswers.reduce((acc: number, answer: any) => acc + answer.timeToAnswer / 1000, 0);

    if (frontendCorrectAnswers !== undefined && frontendCorrectAnswers !== scoreResult.correctAnswers) {
      console.warn(
        `[POST /api/quiz/${quizId}/results] Diferença nos acertos: Frontend=${frontendCorrectAnswers}, Backend=${scoreResult.correctAnswers}`
      );
    }

    // Tipar resultData como um subconjunto de IQuizResult
    const resultData: Pick<
      IQuizResult,
      "quizId" | "userId" | "playerName" | "playerAvatar" | "score" | "correctAnswers" | "percentCorrect" | "totalQuestions" | "timeSpent" | "answers" | "clientId"
    > = {
      quizId: new mongoose.Types.ObjectId(quizId),
      userId: null,
      playerName,
      playerAvatar: playerAvatar || "",
      score: scoreResult.totalScore,
      correctAnswers: scoreResult.correctAnswers,
      percentCorrect: scoreResult.percentCorrect,
      totalQuestions,
      timeSpent,
      answers: enrichedAnswers,
      clientId,
    };

    console.log(`[POST /api/quiz/${quizId}/results] Dados a serem salvos:`, resultData);

    // Criar o documento e garantir que todos os campos sejam salvos
    const result = await QuizResult.create(resultData); // Voltar para create() para simplificar

    console.log(`[POST /api/quiz/${quizId}/results] Documento salvo no MongoDB (via create):`, result.toObject());

    // Verificar diretamente no MongoDB após salvar
    const savedDoc = await QuizResult.findById(result._id).lean();
    console.log(`[POST /api/quiz/${quizId}/results] Documento recuperado do MongoDB:`, savedDoc);

    return NextResponse.json(
      {
        id: result._id.toString(),
        score: scoreResult.totalScore,
        correctAnswers: scoreResult.correctAnswers,
        totalQuestions,
        playerName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao salvar resultado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// Manter os métodos GET e DELETE como estão
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { quizId } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const quiz = await Quiz.findOne({
      _id: quizId,
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado ou não autorizado" }, { status: 404 });
    }

    const results = await QuizResult.find({ quizId })
      .sort({ correctAnswers: -1, timeSpent: 1 }) // Ordem por acertos (desc) e tempo (asc)
      .lean();

    const formattedResults = results.map((result) => ({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score,
      correctAnswers: result.correctAnswers || 0,
      totalQuestions: result.totalQuestions,
      timeSpent: result.timeSpent,
      createdAt: result.createdAt,
    }));

    return NextResponse.json({
      quiz: {
        id: quiz._id.toString(),
        title: quiz.title,
      },
      results: formattedResults,
    });
  } catch (error) {
    console.error("Erro ao buscar resultados:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { quizId } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const quiz = await Quiz.findOne({
      _id: quizId,
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado ou não autorizado" }, { status: 404 });
    }

    const result = await QuizResult.deleteMany({ quizId });

    return NextResponse.json({
      message: `${result.deletedCount} resultado(s) excluído(s) com sucesso`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Erro ao excluir resultados:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}