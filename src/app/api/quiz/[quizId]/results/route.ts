import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Quiz, QuizResult } from "@/models";



// Função para calcular a pontuação regressiva (igual ao cliente)
function calculateRegressiveScore(timeToAnswer: number, maxTime: number = 10): number {
  const timeInSeconds = timeToAnswer / 1000; // Converte de ms para s
  console.log(`Calculating regressive score for ${timeInSeconds} seconds`);
  const maxScore = 1000;
  if (timeInSeconds >= maxTime) return 0;
  const score = Math.floor(maxScore * (1 - timeInSeconds / maxTime));
  return Math.max(score, 0);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await context.params;
    console.log("Requisição GET para resultados do quiz:", quizId);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const quiz = await Quiz.findOne({
      _id: quizId,
      userId: session.user.id,
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    const results = await QuizResult.find({ quizId })
      .sort({ createdAt: -1 })
      .lean();

    const formattedResults = results.map((result) => ({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score,
      totalQuestions: quiz.questions.length,
      createdAt: result.createdAt.toISOString(),
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
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await context.params;
    console.log("Requisição POST para salvar resultado do quiz:", quizId);

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { playerName, playerAvatar, answers } = body;

    if (!playerName || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Dados incompletos: playerName e answers são obrigatórios" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    const totalQuestions = quiz.questions.length;
    const enrichedAnswers = answers.map((answer: any) => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      return {
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        timeToAnswer: answer.timeToAnswer,
        isCorrect: isCorrect || false,
      };
    });

    // Calcular pontuação total com regressão
    const score = enrichedAnswers.reduce((acc: number, answer: any) => {
      const timeInSeconds = answer.timeToAnswer / 1000; // Converte de ms para s
      const questionScore = answer.isCorrect ? calculateRegressiveScore(answer.timeToAnswer) : 0;
      console.log(`Answer ${answer.questionIndex}: isCorrect=${answer.isCorrect}, timeToAnswer=${timeInSeconds}s, score=${questionScore}`);
      return acc + questionScore;
    }, 0);

    const timeSpent = enrichedAnswers.reduce((acc: number, answer: any) => {
      return acc + answer.timeToAnswer / 1000; // Soma o tempo em segundos
    }, 0);

    console.log(`Pontuação calculada: ${score}, Time Spent: ${timeSpent}s`);

    const result = await QuizResult.create({
      quizId,
      userId: null,
      playerName,
      playerAvatar: playerAvatar || "",
      score,
      totalQuestions,
      timeSpent,
      answers: enrichedAnswers,
    });

    return NextResponse.json(
      {
        id: result._id.toString(),
        score,
        playerName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao salvar resultado:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await context.params;
    console.log("Requisição DELETE para zerar resultados do quiz:", quizId);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const quiz = await Quiz.findOne({
      _id: quizId,
      userId: session.user.id,
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    const deleteResult = await QuizResult.deleteMany({ quizId });

    return NextResponse.json({
      message: "Resultados zerados com sucesso",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Erro ao zerar resultados:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}