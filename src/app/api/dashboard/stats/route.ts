// src/app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Quiz, QuizResult } from "@/models";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Buscar quizzes do usuário
    const quizzes = await Quiz.find({
      userId: new mongoose.Types.ObjectId(session.user.id)
    });

    const quizIds = quizzes.map(quiz => quiz._id);

    // Buscar resultados de todos os quizzes do usuário
    const results = await QuizResult.find({
      quizId: { $in: quizIds }
    });

    // Calcular estatísticas
    const totalQuizzes = quizzes.length;
    const totalResults = results.length;
    
    // Agrupar participantes únicos por nome
    const uniqueParticipants = [...new Set(results.map(r => r.playerName))];
    const totalParticipants = uniqueParticipants.length;

    // Calcular pontuações
    let bestScore = 0;
    let totalScore = 0;
    let totalTimeSpent = 0;

    results.forEach(result => {
      if (result.score > bestScore) {
        bestScore = result.score;
      }
      totalScore += result.score;
      totalTimeSpent += result.timeSpent || 0;
    });

    const avgScore = totalResults > 0 ? Math.round(totalScore / totalResults) : 0;
    const avgTimeSpent = totalResults > 0 ? parseFloat((totalTimeSpent / totalResults / 60).toFixed(1)) : 0; // Converter para minutos

    // Calcular taxa de conclusão (simulada)
    // Em um cenário real, você precisaria de mais dados para calcular isso corretamente
    const completionRate = 87; // Exemplo fixo, mas poderia ser calculado com dados reais

    // Última atividade (último resultado ou última atualização de quiz)
    const lastResultDate = results.length > 0 
      ? Math.max(...results.map(r => new Date(r.createdAt).getTime())) 
      : null;
      
    const lastQuizUpdateDate = quizzes.length > 0 
      ? Math.max(...quizzes.map(q => new Date(q.updatedAt).getTime())) 
      : null;
      
    const lastActiveTimestamp = Math.max(
      lastResultDate || 0,
      lastQuizUpdateDate || 0
    );
    
    const lastActive = lastActiveTimestamp > 0 
      ? new Date(lastActiveTimestamp).toISOString() 
      : new Date().toISOString();

    return NextResponse.json({
      totalQuizzes,
      totalParticipants,
      totalResults,
      bestScore,
      avgScore,
      avgTimeSpent,
      completionRate,
      lastActive
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}