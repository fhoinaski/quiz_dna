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

// Usando a sintaxe correta do Next.js 15 para route handlers
export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    // Acessa o parâmetro do objeto params
    const id = params.quizId;
    
    // Validar quiz e verificar se está publicado
    await validateQuizId(id);
    
    // Busca os resultados do quiz
    const resultsQuery = await QuizResult.find({ 
      quizId: new mongoose.Types.ObjectId(id) 
    })
      .sort({ score: -1, createdAt: 1 })
      .limit(100); // Limita a 100 resultados para melhor performance
    
    // Converte os resultados em objetos simples
    const results = resultsQuery.map(doc => {
      return {
        id: doc._id.toString(),
        playerName: doc.playerName,
        score: doc.score,
        totalQuestions: doc.totalQuestions,
        createdAt: doc.createdAt
      };
    });
    
    // Remover duplicados (mantém apenas a maior pontuação por jogador)
    const uniqueResults = Object.values(
      results.reduce((acc: Record<string, any>, current) => {
        if (!acc[current.playerName] || acc[current.playerName].score < current.score) {
          acc[current.playerName] = current;
        }
        return acc;
      }, {})
    );
    
    // Reordenar após remoção de duplicados
    uniqueResults.sort((a: any, b: any) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    
    return NextResponse.json(uniqueResults);
  } catch (error: any) {
    console.error("Erro ao buscar resultados públicos:", error);
    if (error.message === "Quiz não encontrado") {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    } else if (error.message === "Quiz não está publicado") {
      return NextResponse.json({ error: "Quiz não está publicado" }, { status: 403 });
    } else if (error.message === "ID de quiz inválido") {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao buscar resultados" }, { status: 500 });
  }
}