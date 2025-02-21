import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma-client"

// Tipos
interface ResultRequestBody {
  playerName: string;
  score: number;
  totalQuestions: number;
}

interface RouteContext {
  params: Promise<{ quizId: string }>;
}

// Funções auxiliares
async function getQuizById(quizId: string) {
  try {
    return await prisma.quiz.findUnique({
      where: { id: quizId }
    });
  } catch (error) {
    console.error('Erro ao buscar quiz:', error);
    return null;
  }
}

async function getTopResults(quizId: string) {
  try {
    // Primeiro, pegamos os melhores resultados por jogador
    const results = await prisma.result.findMany({
      where: { quizId },
      orderBy: [
        { score: 'desc' },
        { createdAt: 'desc' }
      ],
      distinct: ['playerName'],
      take: 10,
      select: {
        id: true,
        playerName: true,
        score: true,
        totalQuestions: true,
        createdAt: true,
        answers: true
      }
    });

    return results;
  } catch (error) {
    console.error('Erro ao buscar top resultados:', error);
    return [];
  }
}

async function createResult(quizId: string, data: ResultRequestBody) {
  try {
    return await prisma.result.create({
      data: {
        quizId,
        playerName: data.playerName,
        score: data.score,
        totalQuestions: data.totalQuestions,
      }
    });
  } catch (error) {
    console.error('Erro ao criar resultado:', error);
    throw error;
  }
}

async function checkRecentResult(quizId: string, playerName: string) {
  try {
    return await prisma.result.findFirst({
      where: {
        quizId,
        playerName,
        createdAt: {
          gte: new Date(Date.now() - 5000) // 5 segundos
        }
      }
    });
  } catch (error) {
    console.error('Erro ao verificar resultado recente:', error);
    return null;
  }
}

// Handlers
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const params = await context.params;
    const { quizId } = params;

    console.log('Buscando quiz:', quizId);

    const quiz = await getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      );
    }

    const results = await getTopResults(quizId);
    return NextResponse.json(results);

  } catch (error) {
    console.error('Erro no GET:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const params = await context.params;
    const { quizId } = params;

    // Validação do Quiz
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      );
    }

    // Validação do body
    const body: ResultRequestBody = await request.json();
    if (!body.playerName || typeof body.score !== 'number' || typeof body.totalQuestions !== 'number') {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Verifica submissão recente
    const recentResult = await checkRecentResult(quizId, body.playerName);
    if (recentResult) {
      return NextResponse.json(recentResult);
    }

    // Cria novo resultado
    const result = await createResult(quizId, body);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro no POST:', error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}