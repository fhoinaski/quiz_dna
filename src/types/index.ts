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

export type QuizResult = {
  id: string
  quizId: string
  playerName: string
  score: number
  totalQuestions: number
  createdAt: Date
}

export type QuizWithResultCount = {
  id: string
  title: string
  description: string
  isPublished: boolean
  createdAt: string
  _count: {
    results: number
  }
}