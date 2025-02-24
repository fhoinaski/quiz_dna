import { Document } from 'mongoose'

export interface Question {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  isPublished: boolean
  totalTimeLimit: number // em minutos
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface QuizResult {
  id: string
  quizId: string
  userId?: string | null
  playerName: string
  playerAvatar?: string
  score: number
  timeBonus: number
  totalScore: number
  totalQuestions: number
  timeSpent: number // em segundos
  answers: QuizAnswer[]
  createdAt: Date
  updatedAt?: Date
}

export interface QuizAnswer {
  questionIndex: number
  selectedAnswer: number
  timeToAnswer: number // em milissegundos
  isCorrect: boolean
}

export interface QuizSession {
  id: string
  quizId: string
  isActive: boolean
  isPaused: boolean
  timeLimit: number // em segundos
  startsAt: Date | null
  endsAt: Date | null
  currentQuestion: number
  participants: QuizParticipant[]
  createdAt: Date
  updatedAt: Date
}

export interface QuizParticipant {
  userId: string | null
  name: string
  avatar: string
  joined: Date
  score: number
  timeBonus: number
  lastActive: Date
}

export interface QuizStats {
  totalParticipants: number
  averageScore: number
  bestScore: number
  completionRate: number
  averageTimePerQuestion: number
}

export interface RankingEntry {
  id: string
  playerName: string
  playerAvatar?: string
  score: number
  timeBonus: number
  totalScore: number
  position: number
  timeSpent: number
  createdAt: Date
}

// Interface para o documento Mongoose
export interface IQuiz extends Document {
  title: string
  description: string
  questions: Question[]
  userId: string
  totalTimeLimit: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IQuizResult extends Document {
  quizId: string
  userId: string | null
  playerName: string
  playerAvatar: string
  score: number
  timeBonus: number
  totalScore: number
  totalQuestions: number
  timeSpent: number
  answers: QuizAnswer[]
  createdAt: Date
  updatedAt: Date
}

export interface IQuizSession extends Document {
  quizId: string
  isActive: boolean
  isPaused: boolean
  timeLimit: number
  startsAt: Date | null
  endsAt: Date | null
  currentQuestion: number
  participants: QuizParticipant[]
  createdAt: Date
  updatedAt: Date
}

// Tipos para as ações do quiz
export type QuizAction = 
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER_QUESTION'; payload: QuizAnswer }
  | { type: 'FINISH_QUIZ' }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET_QUIZ' }

// Estados possíveis do quiz
export type QuizStep = 'welcome' | 'waiting' | 'quiz' | 'results'

// Configurações do quiz
export interface QuizConfig {
  timeLimit: number
  showFeedback: boolean
  showTimer: boolean
  allowSkip: boolean
  randomizeQuestions: boolean
  showCorrectAnswer: boolean
}