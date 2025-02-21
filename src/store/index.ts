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

type QuizStore = {
  currentStep: 'welcome' | 'quiz' | 'results'
  currentQuiz: Quiz | null
  playerName: string
  currentQuestionIndex: number
  score: number
  selectedAnswers: number[]
  setPlayerName: (name: string) => void
  startQuiz: () => void
  answerQuestion: (answerIndex: number) => void
  setCurrentQuiz: (quiz: Quiz) => void
  saveResult: () => Promise<void>
  resetQuiz: () => void
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentStep: 'welcome',
  currentQuiz: null,
  playerName: '',
  currentQuestionIndex: 0,
  score: 0,
  selectedAnswers: [],
  
  setPlayerName: (name) => set({ playerName: name }),
  
  startQuiz: () => set({ 
    currentStep: 'quiz',
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswers: []
  }),
  
  answerQuestion: (answerIndex) => {
    const { currentQuiz, currentQuestionIndex, score, selectedAnswers } = get()
    
    if (!currentQuiz) return
    
    const isCorrect = answerIndex === currentQuiz.questions[currentQuestionIndex].correctAnswer
    const newScore = isCorrect ? score + 1 : score
    const newSelectedAnswers = [...selectedAnswers, answerIndex]
    
    const nextIndex = currentQuestionIndex + 1
    
    if (nextIndex >= currentQuiz.questions.length) {
      set({ 
        currentStep: 'results',
        score: newScore,
        selectedAnswers: newSelectedAnswers
      })
    } else {
      set({ 
        currentQuestionIndex: nextIndex,
        score: newScore,
        selectedAnswers: newSelectedAnswers
      })
    }
  },
  
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  
  saveResult: async () => {
    const { currentQuiz, playerName, score } = get()
    
    if (!currentQuiz) {
      throw new Error('Nenhum quiz ativo')
    }
    
    try {
      const response = await fetch(`/api/quiz/${currentQuiz.id}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerName,
          score,
          totalQuestions: currentQuiz.questions.length,
          timestamp: Date.now() // Adiciona timestamp para evitar duplicatas
        })
      })
      
      if (!response.ok) {
        throw new Error('Falha ao salvar resultado')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao salvar resultado:', error)
      throw error
    }
  },
  
  resetQuiz: () => set({
    currentStep: 'welcome',
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswers: []
  })
}))