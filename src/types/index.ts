// src/types/index.ts

export type User = {
  id: string
  name: string
  email: string
}

export type Question = {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

export type Quiz = {
  id: string
  title: string
  description: string
  questions: Question[]
  isPublished: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Atualizado para incluir tempo
export type QuizResult = {
  id: string
  quizId: string
  userId?: string | null
  playerName: string
  score: number
  totalQuestions: number
  timeSpent: number // tempo total em segundos
  answers: {
    questionIndex: number
    selectedAnswer: number
    timeToAnswer: number // tempo para responder em segundos
    isCorrect: boolean
  }[]
  createdAt: Date
  updatedAt?: Date
}

// Nova definição para sessão de quiz
export type QuizSession = {
  id: string
  quizId: string
  isActive: boolean
  startsAt: Date | null
  endsAt: Date | null
  participants: {
    userId: string | null
    name: string
    joined: Date
  }[]
  createdAt: Date
  updatedAt?: Date
}