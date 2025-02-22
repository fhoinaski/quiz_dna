// src/app/api/quiz/[quizId]/results/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizResult, Quiz, QuizResult } from "@/models";

// Tipando os modelos explicitamente
type QuizModel = Model<IQuiz>;
type QuizResultModel = Model<IQuizResult>;

// Função para calcular bônus de tempo
function calculateTimeBonus(timeToAnswer: number): number {
  // Se responder em menos de 3 segundos, ganha 50 pontos extras
  // Se responder entre 3 e 10 segundos, ganha entre 1 e 50 pontos extras (linear)
  // Após 10 segundos, não há bônus
  if (timeToAnswer <= 3) {
    return 50;
  } else if (timeToAnswer <= 10) {
    return Math.floor(50 * ((10 - timeToAnswer) / 7));
  } else {
    return 0;
  }
}

// POST - Criar novo resultado de quiz (pode ser enviado sem autenticação)
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    // Obter sessão atual (opcional para resultados públicos)
    const session = await getServerSession(authOptions);
    
    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    // Validar quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    // Obter dados do corpo da requisição
    const body = await request.json();
    
    // Validar campos obrigatórios
    if (!body.playerName) {
      return NextResponse.json(
        { error: "Nome do jogador é obrigatório" },
        { status: 400 }
      );
    }

    // Conectar ao banco de dados
    await connectToDatabase();

    // Buscar o quiz
    const quiz = await (Quiz as QuizModel).findById(quizId);
    
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      );
    }

    // Cálculo da pontuação com base no tempo (se fornecido)
    let calculatedScore = 0;
    
    // Se o score foi enviado diretamente, usar esse valor
    if (body.score) {
      calculatedScore = body.score;
    } 
    // Caso contrário, calcular com base nas respostas e nos tempos
    else if (body.answers) {
      body.answers.forEach((answer: number, index: number) => {
        if (index < quiz.questions.length) {
          const isCorrect = answer === quiz.questions[index].correctAnswer;
          
          // Pontuação base: 100 pontos por resposta correta
          const basePoints = isCorrect ? 100 : 0;
          
          // Bônus por tempo, se fornecido
          let timeBonus = 0;
          if (isCorrect && body.timeToAnswer && body.timeToAnswer[index]) {
            timeBonus = calculateTimeBonus(body.timeToAnswer[index]);
          }
          
          calculatedScore += basePoints + timeBonus;
        }
      });
    }

    // Criar o resultado no banco de dados com os novos campos de tempo
    const quizResult = await (QuizResult as QuizResultModel).create({
      quizId,
      userId: session?.user?.id || null,
      playerName: body.playerName,
      score: calculatedScore,
      totalQuestions: quiz.questions.length,
      timeSpent: body.timeSpent || 0, // Tempo total (segundos)
      answers: body.answers.map((answer: number, index: number) => ({
        questionIndex: index,
        selectedAnswer: answer,
        timeToAnswer: body.timeToAnswer?.[index] || 0, // Tempo para cada resposta
        isCorrect: index < quiz.questions.length ? 
          answer === quiz.questions[index].correctAnswer : 
          false,
      })),
    });

    return NextResponse.json({
      success: true,
      result: {
        id: quizResult._id,
        score: quizResult.score,
        playerName: quizResult.playerName,
      },
    });
  } catch (error: any) {
    console.error("Erro ao salvar resultado:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Obter resultados de um quiz (requer autenticação)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const params = await context.params;
    const { quizId } = params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verificar se o quiz pertence ao usuário
    const quiz = await (Quiz as QuizModel).findOne({
      _id: quizId,
      userId: session.user.id,
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado ou não autorizado" },
        { status: 404 }
      );
    }

    // Buscar os resultados
    const results = await (QuizResult as QuizResultModel)
      .find({ quizId })
      .sort({ score: -1, timeSpent: 1 }) // Ordenar por pontuação (decrescente) e tempo (crescente)
      .lean();

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Erro ao buscar resultados:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}