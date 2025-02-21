import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Quiz } from "@/models";
import mongoose from "mongoose";

// POST - Criar novo quiz
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Conecta ao banco de dados
    await connectToDatabase();

    const quiz = await Quiz.create({
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
      updatedAt: quiz.updatedAt
    });
  } catch (error) {
    console.error("Erro ao criar quiz:", error);
    return NextResponse.json({ error: "Erro ao criar quiz" }, { status: 500 });
  }
}

// GET - Listar quizzes do usuário
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Busca os quizzes do usuário com contagem de resultados
    const quizzes = await Quiz.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(session.user.id) } },
      {
        $lookup: {
          from: "quizresults",
          localField: "_id",
          foreignField: "quizId",
          as: "results"
        }
      },
      {
        $project: {
          id: { $toString: "$_id" },
          title: 1,
          description: 1,
          isPublished: 1,
          createdAt: 1,
          _count: {
            results: { $size: "$results" }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Erro ao listar quizzes:", error);
    return NextResponse.json({ error: "Erro ao listar quizzes" }, { status: 500 });
  }
}