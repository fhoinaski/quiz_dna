import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizResult, Quiz, QuizResult } from "@/models";

type QuizModel = Model<IQuiz>;
type QuizResultModel = Model<IQuizResult>;

// GET - Obter ranking do quiz
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

    // Verificar se o quiz existe
    const quiz = await (Quiz as QuizModel).findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      );
    }

    // Buscar resultados do quiz
    const results = await (QuizResult as QuizResultModel)
      .find({ quizId })
      .sort({ score: -1, timeSpent: 1 }) // Ordem decrescente por score, crescente por tempo
      .lean();

    // Formatar o ranking usando o score salvo
    const rankings = results.map((result, index) => ({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score, // Usa o score salvo, que já inclui o bônus
      timeSpent: result.timeSpent,
      rank: index + 1,
      createdAt: result.createdAt.toISOString(),
    }));

    console.log(`Ranking para quiz ${quizId}:`, rankings);

    return NextResponse.json(rankings);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}