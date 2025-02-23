// src/app/api/quiz/[quizId]/session/join/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from "mongoose";

import {  QuizSession } from '@/models'



interface JoinRequestBody {
  playerName: string
  playerAvatar: string
  userId?: string | null
}

export async function POST(request: NextRequest, context: { params: Promise<{ quizId: string }> }) {
  try {
    const params = await context.params
    const { quizId } = params

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: 'ID de quiz inválido', details: 'O quizId fornecido não é um ObjectId válido' },
        { status: 400 }
      )
    }

    const body: JoinRequestBody = await request.json()
    const { playerName, playerAvatar, userId } = body

    if (!playerName) {
      return NextResponse.json({ error: 'Nome do jogador é obrigatório' }, { status: 400 })
    }

    await connectToDatabase()

    const session = await QuizSession.findOneAndUpdate(
      { quizId },
      {
        $push: {
          participants: {
            userId: userId || null,
            name: playerName,
            avatar: playerAvatar || '🧑‍🚀', // Avatar padrão se não fornecido
            joined: new Date(),
            score: 0,
            timeBonus: 0,
            lastActive: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({ success: true, session })
  } catch (error) {
    console.error('Error in join session:', error)
    return NextResponse.json(
      { error: 'Erro ao entrar na sessão', details: error.message },
      { status: 500 }
    )
  }
}