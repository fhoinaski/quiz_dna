'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, BarChart2, RotateCcw } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Particles } from '@/components/ui/Particles'

export function ResultsScreen() {
  const { score, playerName, currentQuiz } = useQuizStore()
  const [hasBeenSaved, setHasBeenSaved] = useState(false)

  useEffect(() => {
    let isMounted = true

    const saveResult = async () => {
      if (!currentQuiz || hasBeenSaved) return

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

        if (response.ok && isMounted) {
          setHasBeenSaved(true)
        }
      } catch (error) {
        console.error('Erro ao salvar resultado:', error)
      }
    }

    saveResult()

    return () => {
      isMounted = false
    }
  }, [currentQuiz, score, playerName, hasBeenSaved])

  if (!currentQuiz) return null

  const percentage = (score / currentQuiz.questions.length) * 100

  // Resto do componente permanece igual...
  return (
    <div className="min-h-screen bg-white p-4">
      <Particles />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto pt-10 relative z-10"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block"
            >
              <Trophy size={80} className="text-blue-600 mx-auto mb-4" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Parabéns, {playerName}!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Você acertou {score} de {currentQuiz.questions.length} questões ({percentage.toFixed(1)}%)
            </p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="h-4 bg-gray-200 rounded-full overflow-hidden mb-12"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="h-full bg-blue-600"
              />
            </motion.div>

            <div className="flex gap-4 justify-center">
              <Link href={`/quiz/${currentQuiz.id}/ranking`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg"
                >
                  <BarChart2 className="h-5 w-5" />
                  Ver Ranking
                </motion.button>
              </Link>

           
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}