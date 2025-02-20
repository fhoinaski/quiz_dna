'use client'

import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Particles } from '@/components/ui/Particles'

type Quiz = {
  id: string
  title: string
  description: string
  questions: {
    text: string
    options: string[]
    correctAnswer: number
    order: number
  }[]
}

type WelcomeScreenProps = {
  quiz: Quiz
}

export function WelcomeScreen({ quiz }: WelcomeScreenProps) {
  const { setPlayerName, startQuiz, playerName } = useQuizStore()

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <Particles />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <Dna size={80} className="text-blue-600" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          {quiz.title}
        </h1>

        <p className="text-gray-600 mb-8 text-center max-w-md">
          {quiz.description}
        </p>

        <div className="w-full max-w-md space-y-6">
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startQuiz}
            disabled={!playerName.trim()}
            className="w-full px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Iniciar Desafio
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}