import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Quiz } from "@/models";
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

export const GET = async (
  req: NextRequest,
  { params }: { params: { quizId: string } }
) => {
  try {
    // Acessa o parâmetro de forma segura
    const id = params.quizId;
    
    const quiz = await validateQuizId(id);

    // Para quizzes publicados, não exigimos autenticação
    if (!quiz.isPublished) {
      const session = await validateSession();
      
      // Se não for o dono do quiz e o quiz não estiver publicado, não permite acesso
      if (session.user.id !== quiz.userId.toString()) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
    }

    return NextResponse.json({
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
      isPublished: quiz.isPublished,
    });
  } catch (error: any) {
    console.error("Erro ao buscar quiz:", error);
    if (error.message === "Quiz não encontrado") {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    } else if (error.message === "Não autorizado") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    } else if (error.message === "ID de quiz inválido") {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao buscar quiz" }, { status: 500 });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { quizId: string } }
) => {
  try {
    // Acessa o parâmetro de forma segura
    const id = params.quizId;
    
    // Validar sessão
    const session = await validateSession();
    
    // Validar quiz
    const quiz = await validateQuizId(id);
    
    // Verificar se é o dono do quiz
    if (session.user.id !== quiz.userId.toString()) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    
    const body = await req.json();
    
    // Atualizar quiz
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        questions: body.questions,
        isPublished: body.isPublished
      },
      { new: true }
    );
    
    return NextResponse.json({
      id: updatedQuiz?._id.toString(),
      title: updatedQuiz?.title,
      description: updatedQuiz?.description,
      questions: updatedQuiz?.questions,
      isPublished: updatedQuiz?.isPublished
    });
  } catch (error: any) {
    console.error("Erro ao atualizar quiz:", error);
    if (error.message === "Quiz não encontrado") {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    } else if (error.message === "Não autorizado") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro ao atualizar quiz" }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { quizId: string } }
) => {
  try {
    // Acessa o parâmetro de forma segura
    const id = params.quizId;
    
    // Validar sessão
    const session = await validateSession();
    
    // Validar quiz
    const quiz = await validateQuizId(id);
    
    // Verificar se é o dono do quiz
    if (session.user.id !== quiz.userId.toString()) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    
    // Excluir quiz
    await Quiz.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Quiz excluído com sucesso" });
  } catch (error: any) {
    console.error("Erro ao excluir quiz:", error);
    if (error.message === "Quiz não encontrado") {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    } else if (error.message === "Não autorizado") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro ao excluir quiz" }, { status: 500 });
  }
};