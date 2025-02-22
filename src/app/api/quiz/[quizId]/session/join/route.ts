import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose, { Model } from 'mongoose'
import { IQuizSession, QuizSession } from '@/models'

// Tipagem explícita para o modelo QuizSession
type QuizSessionModel = Model<IQuizSession>

// Interface para o corpo da requisição
interface JoinRequestBody {
  playerName: string
  playerAvatar: string
  userId?: string | null
}

export async function POST(request: NextRequest, context: { params: Promise<{ quizId: string }> }) {
  try {
    // Extrair os parâmetros da URL
    const params = await context.params
    const { quizId } = params
    console.log(`[POST /api/quiz/${quizId}/session/join] Recebendo requisição para quizId: ${quizId}`)

    // Validar o quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      console.error(`[ERROR] ID de quiz inválido: ${quizId}`)
      return NextResponse.json(
        { error: 'ID de quiz inválido', details: 'O quizId fornecido não é um ObjectId válido' },
        { status: 400 }
      )
    }

    // Parsear o corpo da requisição
    let body: JoinRequestBody
    try {
      body = await request.json()
      console.log(`[INFO] Corpo da requisição recebido:`, {
        playerName: body.playerName,
        playerAvatar: body.playerAvatar,
        userId: body.userId,
      })
    } catch (jsonError) {
      console.error(`[ERROR] Erro ao parsear JSON:`, jsonError)
      return NextResponse.json(
        { error: 'Formato de dados inválido', details: 'O corpo da requisição deve ser um JSON válido' },
        { status: 400 }
      )
    }

    const { playerName, playerAvatar, userId = null } = body

    // Validar os campos obrigatórios
    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
      console.error(`[ERROR] Nome do jogador inválido: ${playerName}`)
      return NextResponse.json(
        { error: 'Nome do jogador é obrigatório', details: 'O campo playerName deve ser uma string não vazia' },
        { status: 400 }
      )
    }
    if (!playerAvatar || typeof playerAvatar !== 'string' || playerAvatar.trim() === '') {
      console.error(`[ERROR] Avatar do jogador inválido: ${playerAvatar}`)
      return NextResponse.json(
        { error: 'Avatar do jogador é obrigatório', details: 'O campo playerAvatar deve ser uma string não vazia' },
        { status: 400 }
      )
    }

    // Conectar ao banco de dados
    await connectToDatabase()
    console.log(`[INFO] Conexão com o banco de dados estabelecida`)

    // Buscar ou criar a sessão do quiz
    let session = await (QuizSession as QuizSessionModel).findOne({ quizId })
    if (!session) {
      console.log(`[INFO] Nenhuma sessão encontrada para quizId: ${quizId}. Criando nova sessão.`)
      session = await (QuizSession as QuizSessionModel).create({
        quizId: new mongoose.Types.ObjectId(quizId),
        participants: [{ userId, name: playerName.trim(), avatar: playerAvatar.trim(), joined: new Date() }],
        isActive: false,
      })
    } else {
      // Verificar se o participante já existe
      const participantExists = session.participants.some((p) => p.name === playerName.trim())
      if (participantExists) {
        console.log(`[INFO] Participante ${playerName} já está na sessão`)
        return NextResponse.json(
          { message: 'Jogador já está na sessão', isActive: session.isActive, participants: session.participants },
          { status: 200 }
        )
      }

      // Adicionar novo participante
      session.participants.push({ userId, name: playerName.trim(), avatar: playerAvatar.trim(), joined: new Date() })
      await session.save()
      console.log(`[INFO] Participante ${playerName} adicionado à sessão existente`)
    }

    // Resposta bem-sucedida
    const response = {
      message: 'Jogador entrou na sessão com sucesso',
      isActive: session.isActive,
      participants: session.participants.map((p) => ({
        userId: p.userId,
        name: p.name,
        avatar: p.avatar,
        joined: p.joined,
      })),
    }
    console.log(`[SUCCESS] Resposta enviada:`, response)
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error(`[ERROR] Erro interno ao processar a requisição:`, error)
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}