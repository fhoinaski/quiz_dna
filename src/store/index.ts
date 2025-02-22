'use client'

import { create } from 'zustand'

type Question = {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

type Quiz = {
  id: string
  title: string
  description: string
  questions: Question[]
}

type Participant = {
  name: string
  avatar: string
  joined: Date
}

type QuizStore = {
  currentStep: 'waiting' | 'welcome' | 'quiz' | 'results'
  currentQuiz: Quiz | null
  playerName: string
  playerAvatar: string
  currentQuestionIndex: number
  score: number
  selectedAnswers: number[]
  answersTime: number[]
  startTime: number
  questionStartTime: number
  totalTimeSpent: number
  isQuizActive: boolean
  participants: Participant[]

  setPlayerName: (name: string) => void
  setPlayerAvatar: (avatar: string) => void
  startQuiz: () => void
  answerQuestion: (answerIndex: number, bonusPoints: number) => void
  setCurrentQuiz: (quiz: Quiz) => void
  saveResult: () => Promise<void>
  resetQuiz: () => void
  joinSession: () => Promise<void>
  checkSessionStatus: () => Promise<boolean>
  updateParticipants: (participants: Participant[]) => void
  setQuizActive: (active: boolean) => void
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentStep: 'waiting',
  currentQuiz: null,
  playerName: '',
  playerAvatar: '',
  currentQuestionIndex: 0,
  score: 0,
  selectedAnswers: [],
  answersTime: [],
  startTime: 0,
  questionStartTime: 0,
  totalTimeSpent: 0,
  isQuizActive: false,
  participants: [],
  

  setPlayerName: (name) => {
    console.log('[Store] Definindo playerName:', name)
    set({ playerName: name })
  },
  setPlayerAvatar: (avatar) => {
    console.log('[Store] Definindo playerAvatar:', avatar)
    set({ playerAvatar: avatar })
  },

  joinSession: async () => {
    const { playerName, playerAvatar, currentQuiz } = get()
    console.log('[Store] joinSession chamado:', { playerName, playerAvatar, quizId: currentQuiz?.id })
    if (!currentQuiz || !playerName.trim() || !playerAvatar) {
      console.error('[Store] Dados insuficientes para entrar na sessão')
      return
    }

    try {
      const response = await fetch(`/api/quiz/${currentQuiz.id}/session/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, playerAvatar }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao entrar na sessão')
      }

      const data = await response.json()
      console.log('[Store] Resposta do joinSession:', data)
      set({ participants: data.participants }) // Atualiza os participantes
      if (data.isActive) set({ currentStep: 'welcome', isQuizActive: true })
    } catch (error) {
      console.error('[Store] Erro ao entrar na sessão:', error)
      throw error
    }
  },

  checkSessionStatus: async () => {
    const { currentQuiz } = get()
    if (!currentQuiz) return false

    try {
      const response = await fetch(`/api/quiz/${currentQuiz.id}/session`)
      if (!response.ok) throw new Error('Falha ao verificar status da sessão')
      const data = await response.json()
      console.log('[Store] checkSessionStatus:', data)
      set({
        isQuizActive: data.isActive,
        participants: data.participants || [],
      })
      if (data.isActive && get().currentStep === 'waiting') {
        set({ currentStep: 'welcome' })
      }
      return data.isActive
    } catch (error) {
      console.error('[Store] Erro ao verificar status da sessão:', error)
      return false
    }
  },

  updateParticipants: (participants) => {
    console.log('[Store] Atualizando participantes:', participants)
    set({ participants })
  },

  setQuizActive: (active) => set({ isQuizActive: active }),

  startQuiz: () => {
    const now = Date.now()
    set({ currentStep: 'quiz', startTime: now, questionStartTime: now })
  },

  answerQuestion: (answerIndex, bonusPoints) => {
    const { currentQuiz, currentQuestionIndex, selectedAnswers, score, questionStartTime, answersTime, startTime } = get()
    if (!currentQuiz) return

    const now = Date.now()
    const timeToAnswer = now - questionStartTime
    const isCorrect = currentQuiz.questions[currentQuestionIndex].correctAnswer === answerIndex
    const basePoints = isCorrect ? 100 : 0
    const newScore = score + basePoints + bonusPoints
    const newAnswers = [...selectedAnswers, answerIndex]
    const newAnswersTime = [...answersTime, timeToAnswer]

    if (currentQuestionIndex + 1 < currentQuiz.questions.length) {
      set({
        currentQuestionIndex: currentQuestionIndex + 1,
        score: newScore,
        selectedAnswers: newAnswers,
        answersTime: newAnswersTime,
        questionStartTime: now,
      })
    } else {
      set({
        currentStep: 'results',
        score: newScore,
        selectedAnswers: newAnswers,
        answersTime: newAnswersTime,
        totalTimeSpent: (now - startTime) / 1000,
      })
    }
  },

  setCurrentQuiz: (quiz) => {
    console.log('[Store] Definindo currentQuiz:', quiz)
    set({ currentQuiz: quiz })
  },

  saveResult: async () => {
    const { currentQuiz, playerName, playerAvatar, score, selectedAnswers, answersTime, totalTimeSpent } = get()
    if (!currentQuiz || !playerName) return

    try {
      const response = await fetch(`/api/quiz/${currentQuiz.id}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName,
          playerAvatar,
          answers: selectedAnswers,
          timeToAnswer: answersTime,
          timeSpent: totalTimeSpent,
          score,
        }),
      })
      if (!response.ok) throw new Error('Falha ao salvar resultado')
      console.log('[Store] Resultado salvo com sucesso')
    } catch (error) {
      console.error('[Store] Erro ao salvar resultado:', error)
    }
  },

  resetQuiz: () =>
    set({
      currentStep: 'waiting',
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswers: [],
      answersTime: [],
      startTime: 0,
      questionStartTime: 0,
      totalTimeSpent: 0,
      isQuizActive: false,
    }),
}))