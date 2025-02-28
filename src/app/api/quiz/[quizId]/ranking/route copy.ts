// src/app/api/quiz/[quizId]/ranking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizResult, Quiz, QuizResult } from "@/models";
import { getCachedData, setCachedData } from "@/lib/cache";

type QuizModel = Model<IQuiz>;
type QuizResultModel = Model<IQuizResult>;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const params = await context.params;
    const { quizId } = params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    // Chave única para o cache baseada no quizId
    const cacheKey = `quiz-ranking-${quizId}`;
    const cachedData = getCachedData(cacheKey);

    // Verificar se os dados estão no cache
    if (cachedData) {
   
      return NextResponse.json(cachedData);
    }

    await connectToDatabase();

    const quiz = await (Quiz as QuizModel).findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    const results = await (QuizResult as QuizResultModel)
      .find({ quizId })
      .lean();

    console.log(`[GET /api/quiz/${quizId}/ranking] Resultados brutos do MongoDB:`, results);

    const sortedResults = results.sort((a, b) => {
      if (a.correctAnswers !== b.correctAnswers) {
        return b.correctAnswers - a.correctAnswers; // Mais acertos ganha
      }
      return a.timeSpent - b.timeSpent; // Menor tempo ganha em caso de empate
    });

    const rankings = sortedResults.map((result, index) => ({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      timeSpent: result.timeSpent,
      rank: index + 1,
      createdAt: result.createdAt.toISOString(),
    }));

    // Armazenar os dados no cache
    setCachedData(cacheKey, rankings);
    console.log(`[GET /api/quiz/${quizId}/ranking] Dados armazenados no cache`);

    console.log(`Ranking para quiz ${quizId}:`, rankings);
    return NextResponse.json(rankings);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}