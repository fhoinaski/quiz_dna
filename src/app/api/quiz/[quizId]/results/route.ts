import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
  return quiz;
};

// Helper function para validar a sessão
const validateSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }
  return session;
};

export async function GET(
  request: Request, 
  { params }: { params: { quizId: string } }
) {
  try {
    // No Next.js 15, devemos aguardar os parâmetros
    const quizId = params.quizId;
    
    const quiz = await validateQuizId(quizId);
    
    // Para visualizar resultados, é necessário estar autenticado
    const session = await validateSession();
    
    // Se não for o dono do quiz, não permite acesso aos resultados
    if (session.user.id !== quiz.userId.toString()) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    
    // Busca os resultados do quiz
    const results = await QuizResult.find({ 
      quizId: new mongoose.Types.ObjectId(quizId) 
    }).sort({ score: -1, createdAt: 1 });
    
    // Formata os resultados
    const formattedResults = results.map(result => ({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score,
      totalQuestions: result.totalQuestions,
      createdAt: result.createdAt
    }));
    
    return NextResponse.json(formattedResults);
  } catch (error: any) {
    console.error("Erro ao buscar resultados:", error);
    if (error.message === "Quiz não encontrado") {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    } else if (error.message === "Não autorizado") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    } else if (error.message === "ID de quiz inválido") {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao buscar resultados" }, { status: 500 });
  }
}

export async function POST(
  request: Request, 
  { params }: { params: { quizId: string } }
) {
  try {
    // No Next.js 15, devemos aguardar os parâmetros
    const quizId = params.quizId;
    
    const quiz = await validateQuizId(quizId);
    
    // Para resultados, não exigimos que o usuário esteja autenticado, apenas que o quiz exista e esteja publicado
    if (!quiz.isPublished) {
      return NextResponse.json({ error: "Quiz não está publicado" }, { status: 403 });
    }
    
    const body = await request.json();
    
    // Validar os dados recebidos
    if (!body.playerName || typeof body.score !== 'number' || typeof body.totalQuestions !== 'number') {
      return NextResponse.json({ error: "Dados incompletos ou inválidos" }, { status: 400 });
    }
    
    // Verificar se já existe um resultado similar recente (últimos 30 segundos)
    const recentResult = await QuizResult.findOne({
      quizId: new mongoose.Types.ObjectId(quizId),
      playerName: body.playerName,
      createdAt: { $gte: new Date(Date.now() - 30000) } // 30 segundos atrás
    });
    
    if (recentResult) {
      return NextResponse.json({
        id: recentResult._id.toString(),
        playerName: recentResult.playerName,
        score: recentResult.score,
        totalQuestions: recentResult.totalQuestions,
        createdAt: recentResult.createdAt,
        message: "Resultado já registrado"
      }, { status: 200 });
    }
    
    // Criar o resultado
    const result = await QuizResult.create({
      quizId: new mongoose.Types.ObjectId(quizId),
      playerName: body.playerName,
      score: body.score,
      totalQuestions: body.totalQuestions
    });
    
    return NextResponse.json({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score,
      totalQuestions: result.totalQuestions,
      createdAt: result.createdAt
    }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao salvar resultado:", error);
    if (error.message === "Quiz não encontrado") {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    } else if (error.message === "ID de quiz inválido") {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao salvar resultado" }, { status: 500 });
  }
}