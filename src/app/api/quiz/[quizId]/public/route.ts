// src/app/api/quiz/[quizId]/public/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, Quiz } from "@/models";

// Tipando o modelo Quiz explicitamente
type QuizModel = Model<IQuiz>;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: 'Parâmetro quizId inválido' },
        { status: 400 }
      );
    }

    // Conectar ao banco de dados
    await connectToDatabase();

    // Buscar o quiz, verificando se ele está publicado (isPublished: true)
    const quiz = await (Quiz as QuizModel)
      .findOne({ 
        _id: quizId,
        isPublished: true // Apenas quizzes públicos podem ser acessados por essa rota
      })
      .exec();

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz não encontrado ou não está disponível publicamente' },
        { status: 404 }
      );
    }

    // Transformar o documento do Mongoose em um objeto simples
    // Remover informações sensíveis como userId para rotas públicas
    const quizData = {
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      // Para quizzes públicos, talvez queira omitir a resposta correta
      questions: quiz.questions.map(q => ({
        text: q.text,
        options: q.options,
        order: q.order,
        correctAnswer: q.correctAnswer // Incluindo a resposta correta para o quiz funcionar
      })),
      isPublished: quiz.isPublished
    };

    return NextResponse.json(quizData);
  } catch (error) {
    console.error(`Erro na rota /quiz/[quizId]/public: ${error}`);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}