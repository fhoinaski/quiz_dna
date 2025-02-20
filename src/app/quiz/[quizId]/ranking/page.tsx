'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, ArrowLeft } from 'lucide-react'
import { Particles } from '@/components/ui/Particles'

interface Result {
  id: string
  playerName: string
  score: number
  totalQuestions: number
  createdAt: string
}

interface Quiz {
  id: string
  title: string
}



export default function RankingPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const [results, setResults] = useState<Result[]>([])
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar informações do quiz
        const quizResponse = await fetch(`/api/quiz/${quizId}`)
        if (!quizResponse.ok) throw new Error('Quiz não encontrado')
        const quizData = await quizResponse.json() as Quiz
        setQuiz(quizData)

        // Buscar resultados
        const resultsResponse = await fetch(`/api/quiz/${quizId}/results`)
        if (!resultsResponse.ok) throw new Error('Erro ao carregar ranking')
        const resultsData = await resultsResponse.json() as Result[]
        setResults(resultsData)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Erro ao carregar dados'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [quizId])

  const renderLoadingState = () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  )

  const renderErrorState = () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {error || 'Erro ao carregar ranking'}
        </h1>
        <Link href={`/quiz/${quizId}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o quiz
          </motion.button>
        </Link>
      </div>
    </div>
  )

  const getPositionStyle = (index: number): string => {
    switch (index) {
      case 0: return 'text-yellow-500'
      case 1: return 'text-gray-400'
      case 2: return 'text-amber-600'
      default: return 'text-blue-600'
    }
  }

  const calculatePercentage = (score: number, total: number): string => {
    return ((score / total) * 100).toFixed(1)
  }

  if (loading) return renderLoadingState()
  if (error || !quiz) return renderErrorState()

  return (
    <div className="min-h-screen bg-white">
      <Particles />
      
      <div className="max-w-2xl mx-auto p-8 relative z-10">
        <div className="mb-8">
          <Link href={`/quiz/${quizId}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o quiz
            </motion.button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block"
            >
              <Trophy size={80} className="text-blue-600 mx-auto mb-4" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Ranking
            </h1>
            <p className="text-gray-600">{quiz.title}</p>
          </div>

          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${getPositionStyle(index)}`}>
                      #{index + 1}
                    </span>
                    <div>
                      <span className="font-medium">{result.playerName}</span>
                      <p className="text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg">
                      {result.score} / {result.totalQuestions}
                    </span>
                    <p className="text-sm text-gray-500">
                      {calculatePercentage(result.score, result.totalQuestions)}%
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum resultado registrado ainda
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}