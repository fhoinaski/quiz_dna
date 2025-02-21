import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizResult, Quiz, QuizResult } from "@/models";

// Interface para os parâmetros da rota
interface RouteParams {
  params: { quizId: string };
}

// Tipando os modelos explicitamente
type QuizModel = Model<IQuiz>;
type QuizResultModel = Model<IQuizResult>;

// Helper function para validar o quizId
const validateQuizId = async (quizId: string): Promise<IQuiz> => {
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    throw new Error("ID de quiz inválido");
  }

  await connectToDatabase();
  // Ajuste na chamada ao findById para garantir tipagem correta
  const quiz = await (Quiz as QuizModel).findById(quizId).exec() as IQuiz | null;
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

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { quizId } = params;

    // Valida a sessão e o acesso
    const session = await validateSession();

    // Valida o quiz
    const quiz = await validateQuizId(quizId);

    // Verifica se o usuário é o dono do quiz
    if (quiz.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // Busca resultados para o quiz específico
    const results = await (QuizResult as QuizResultModel)
      .find({ quizId: new mongoose.Types.ObjectId(quizId) })
      .sort({ createdAt: -1 })
      .exec();

    // Mapeia os resultados para o formato desejado
    const formattedResults = results.map((result) => ({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score,
      totalQuestions: result.totalQuestions,
      createdAt: result.createdAt,
    }));

    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { quizId } = params;

    // Valida o quiz
    await validateQuizId(quizId);

    // Extrai dados do corpo da requisição
    const body = await request.json();

    // Valida os dados necessários
    if (
      !body.playerName ||
      typeof body.score !== "number" ||
      typeof body.totalQuestions !== "number"
    ) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Cria o resultado
    const result = await (QuizResult as QuizResultModel).create({
      quizId: new mongoose.Types.ObjectId(quizId),
      playerName: body.playerName,
      score: body.score,
      totalQuestions: body.totalQuestions,
    });

    // Formata o resultado criado
    const formattedResult = {
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score,
      totalQuestions: result.totalQuestions,
      createdAt: result.createdAt,
    };

    return NextResponse.json(formattedResult, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}