// src/app/api/quiz/[quizId]/results/public/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizResult, Quiz, QuizResult } from "@/models";

// Tipando os modelos explicitamente
type QuizModel = Model<IQuiz>;
type QuizResultModel = Model<IQuizResult>;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      // Retornar array vazio em vez de erro
      return NextResponse.json([], { status: 200 });
    }

    // Conectar ao banco de dados
    await connectToDatabase();

    // Verificar se o quiz existe e é público
    const quiz = await (Quiz as QuizModel)
      .findOne({ _id: quizId, isPublished: true })
      .exec();

    if (!quiz) {
      // Retornar array vazio em vez de erro
      return NextResponse.json([], { status: 200 });
    }

    // Buscar os resultados do quiz
    const results = await (QuizResult as QuizResultModel)
      .find({ quizId })
      .sort({ score: -1, createdAt: -1 })
      .exec();

    // Se não houver resultados, retornar array vazio
    if (!results || results.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Transformar os documentos do Mongoose em objetos simples
    const formattedResults = results.map(result => ({
      id: result._id.toString(),
      quizId: result.quizId.toString(),
      playerName: result.playerName,
      score: result.score,
      totalQuestions: result.totalQuestions,
      createdAt: result.createdAt,
    }));

    // Garantir que sempre retornamos um array, mesmo se vazio
    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error) {
    console.error(`Erro na rota /quiz/[quizId]/results/public: ${error}`);
    // Retornar array vazio em caso de erro
    return NextResponse.json([], { status: 200 });
  }
}