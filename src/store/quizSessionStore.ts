// src/store/quizSessionStore.ts
import { create } from 'zustand'

interface Participant {
  userId: string | null
  name: string
  avatar: string
  joined: string
  score?: number
  timeBonus?: number
  lastActive?: string
}

interface QuizSessionState {
  timeLimit: number
  currentQuestion: number
  timeLeft: number
  participants: Participant[]
  isActive: boolean
  isPaused: boolean
  startTime: string | null
  endTime: string | null
  
  // Actions
  setTimeLimit: (time: number) => void
  startSession: () => void
  pauseSession: () => void
  resetSession: () => void
  updateTimeLeft: (time: number) => void
  updateParticipants: (participants: Participant[]) => void
}

export const useQuizSessionStore = create<QuizSessionState>((set) => ({
  timeLimit: 30,
  currentQuestion: 0,
  timeLeft: 1000,
  participants: [],
  isActive: false,
  isPaused: false,
  startTime: null,
  endTime: null,

  setTimeLimit: (time) => set({ timeLimit: time }),
  startSession: () => set({ isActive: true, isPaused: false, startTime: new Date().toISOString() }),
  pauseSession: () => set({ isPaused: true }),
  resetSession: () => set({ 
    currentQuestion: 0,
    timeLeft: 1000,
    participants: [],
    isActive: false,
    isPaused: false,
    startTime: null,
    endTime: null
  }),
  updateTimeLeft: (time) => set({ timeLeft: time }),
  updateParticipants: (participants) => set({ participants })
}))

