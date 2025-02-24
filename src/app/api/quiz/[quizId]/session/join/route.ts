// src/app/api/quiz/[quizId]/session/join/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from "mongoose";
import { QuizSession } from '@/models'

interface JoinRequestBody {
  playerName: string
  playerAvatar: string
  userId?: string | null
  clientId?: string // Novo campo para identificação de cliente
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
    const { playerName, playerAvatar, userId, clientId } = body

    if (!playerName) {
      return NextResponse.json({ error: 'Nome do jogador é obrigatório' }, { status: 400 })
    }

    await connectToDatabase()

    // Verificar se o participante já existe na sessão
    const existingSession = await QuizSession.findOne({ quizId })
    
    if (existingSession) {
      // Verificamos por nome e avatar, ou por clientId se fornecido
      const duplicateParticipant = existingSession.participants.find(p => 
        (p.name === playerName && p.avatar === playerAvatar) || 
        (clientId && clientId === p.clientId)
      );

      if (duplicateParticipant) {
        // Se o participante já existe, apenas atualizamos o lastActive
        await QuizSession.updateOne(
          { 
            quizId, 
            "participants.name": playerName,
            "participants.avatar": playerAvatar
          },
          { 
            $set: { 
              "participants.$.lastActive": new Date() 
            } 
          }
        )
        
        return NextResponse.json({ 
          success: true, 
          message: 'Participant already in session, timestamp updated',
          session: existingSession
        })
      }
    }

    // Caso não seja duplicata, adicionamos normalmente
    const session = await QuizSession.findOneAndUpdate(
      { quizId },
      {
        $push: {
          participants: {
            userId: userId || null,
            name: playerName,
            avatar: playerAvatar || '🧑‍🚀', // Avatar padrão se não fornecido
            joined: new Date(),
            clientId: clientId || null, // Armazenamos o clientId, se fornecido
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