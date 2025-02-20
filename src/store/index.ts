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
  setPlayerName: (name: string) => void
  startQuiz: () => void
  answerQuestion: (answerIndex: number) => void
  setCurrentQuiz: (quiz: Quiz) => void
  saveResult: () => Promise<void>
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentStep: 'welcome',
  currentQuiz: null,
  playerName: '',
  currentQuestionIndex: 0,
  score: 0,

  setCurrentQuiz: (quiz) => set({ 
    currentQuiz: quiz,
    currentStep: 'welcome',
    currentQuestionIndex: 0,
    score: 0
  }),
  
  setPlayerName: (name) => set({ playerName: name }),
  
  startQuiz: () => set({ 
    currentStep: 'quiz',
    currentQuestionIndex: 0,
    score: 0
  }),
  
  answerQuestion: (answerIndex) => 
    set((state) => {
      if (!state.currentQuiz) return state

      const isCorrect = state.currentQuiz.questions[state.currentQuestionIndex].correctAnswer === answerIndex
      const newScore = isCorrect ? state.score + 1 : state.score
      const nextIndex = state.currentQuestionIndex + 1
      
      if (nextIndex >= state.currentQuiz.questions.length) {
        return {
          currentStep: 'results',
          score: newScore,
        }
      }
      
      return {
        currentQuestionIndex: nextIndex,
        score: newScore,
      }
    }),

  saveResult: async () => {
    const state = get()
    if (!state.currentQuiz) return

    try {
      await fetch(`/api/quiz/${state.currentQuiz.id}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerName: state.playerName,
          score: state.score,
          totalQuestions: state.currentQuiz.questions.length
        })
      })
    } catch (error) {
      console.error('Erro ao salvar resultado:', error)
      throw error // Propaga o erro para ser tratado no componente
    }
  }
}))