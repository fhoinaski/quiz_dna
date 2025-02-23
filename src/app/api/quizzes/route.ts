import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'
import { Quiz } from '@/models'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.log('Sessão inválida ou usuário não autenticado:', session)
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await connectToDatabase()

    const quizzes = await Quiz.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(session.user.id) } },
      {
        $lookup: {
          from: 'quizresults',
          localField: '_id',
          foreignField: 'quizId',
          as: 'results'
        }
      },
      {
        $project: {
          id: '$_id',
          title: 1,
          description: 1,
          createdAt: 1,
          '_count.results': { $size: '$results' }
        }
      }
    ])

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Erro ao buscar quizzes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}