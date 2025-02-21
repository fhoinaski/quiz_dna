import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const { quizId } = params;

    if (!quizId || typeof quizId !== 'string') {
      return NextResponse.json(
        { error: 'Parâmetro quizId inválido' },
        { status: 400 }
      );
    }

    const result = {
      quizId,
      status: 'completed',
      score: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`Erro na rota /quiz/[quizId]/results/public: ${error}`);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}