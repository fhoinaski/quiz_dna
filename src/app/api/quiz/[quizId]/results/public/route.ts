// src/app/api/quiz/[quizId]/results/public/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Quiz, QuizResult } from "@/models";
import mongoose from "mongoose";

// Helper function para validar o quizId
const validateQuizId = async (quizId: string) => {
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    throw new Error("ID de quiz inválido");
  }
  
  await connectToDatabase();
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new Error("Quiz não encontrado");
  }
  
  if (!quiz.isPublished) {
    throw new Error("Quiz não está publicado");
  }
  
  return quiz;
};

// Corrigindo para usar a sintaxe correta do Next.js 15 para route handlers
export async function GET(
  request: NextRequest,
  context: { params: { quizId: string } }
) {
  try {
    const { quizId } = context.params;
    
    // Valida o quiz e verifica se está publicado
    await validateQuizId(quizId);
    
    // Conecta ao banco de dados
    await connectToDatabase();
    
    // Busca resultados para o quiz específico
    const results = await QuizResult.find({ quizId: new mongoose.Types.ObjectId(quizId) })
      .sort({ score: -1, createdAt: 1 })
      .limit(100); // Limitando a 100 resultados
    
    return NextResponse.json(results.map(result => ({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score,
      totalQuestions: result.totalQuestions,
      createdAt: result.createdAt
    })));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}