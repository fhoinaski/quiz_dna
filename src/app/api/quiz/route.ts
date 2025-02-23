// src/app/api/quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

import {  Quiz } from "@/models";



// POST - Criar novo quiz
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.title || !body.description || !body.questions || typeof body.totalTimeLimit !== 'number') {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    await connectToDatabase()

    const quiz = await Quiz.create({
      title: body.title,
      description: body.description,
      questions: body.questions,
      totalTimeLimit: body.totalTimeLimit, // Tempo em minutos
      userId: new mongoose.Types.ObjectId(session.user.id),
      isPublished: body.isPublished || false,
    })

    return NextResponse.json({ success: true, quiz }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/quiz] Error:', error)
    return NextResponse.json({ error: 'Erro ao criar quiz' }, { status: 500 })
  }
}

// GET - Listar quizzes do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    const quizzes = await Quiz.aggregate([
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

// DELETE - Excluir um quiz
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const url = new URL(request.url);
    const quizId = url.pathname.split('/').pop(); // Extrai o quizId da URL

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const quiz = await Quiz.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(quizId),
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado ou não pertence ao usuário" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quiz excluído com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir quiz:", error);
    return NextResponse.json({ error: "Erro ao excluir quiz" }, { status: 500 });
  }
}