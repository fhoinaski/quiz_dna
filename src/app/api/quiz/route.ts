import { NextRequest, NextResponse } from "next/server"; // Use NextRequest para consistência
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, Quiz } from "@/models";

// Tipando o modelo Quiz explicitamente
type QuizModel = Model<IQuiz>;

// POST - Criar novo quiz
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Validação básica dos campos obrigatórios
    if (!body.title || !body.description || !body.questions) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Cria o quiz com tipagem explícita
    const quiz = await (Quiz as QuizModel).create({
      title: body.title,
      description: body.description,
      questions: body.questions,
      userId: new mongoose.Types.ObjectId(session.user.id),
      isPublished: body.isPublished || false,
    });

    return NextResponse.json({
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
      isPublished: quiz.isPublished,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar quiz:", error);
    return NextResponse.json({ error: "Erro ao criar quiz" }, { status: 500 });
  }
}

// GET - Listar quizzes do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Busca os quizzes do usuário com contagem de resultados
    const quizzes = await (Quiz as QuizModel).aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(session.user.id) } },
      {
        $lookup: {
          from: "quizresults",
          localField: "_id",
          foreignField: "quizId",
          as: "results",
        },
      },
      {
        $project: {
          id: { $toString: "$_id" },
          title: 1,
          description: 1,
          isPublished: 1,
          createdAt: 1,
          _count: {
            results: { $size: "$results" },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar quizzes:", error);
    return NextResponse.json({ error: "Erro ao listar quizzes" }, { status: 500 });
  }
}