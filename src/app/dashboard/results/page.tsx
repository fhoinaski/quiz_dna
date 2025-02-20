'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BarChart2, FileText } from 'lucide-react' // Mudado para FileText que é um ícone válido do Lucide

type Quiz = {
  id: string
  title: string
  description: string
  _count: {
    results: number
  }
}

type Result = {
  id: string
  quizId: string
  playerName: string
  score: number
  totalQuestions: number
  createdAt: string
  quiz: {
    title: string
  }
}

export default function DashboardResultsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [results, setResults] = useState<Result[]>([])

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch('/api/quiz')
        if (!response.ok) throw new Error('Erro ao carregar quizzes')
        const data = await response.json()
        setQuizzes(data)
        if (data.length > 0) {
          setSelectedQuiz(data[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar quizzes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  useEffect(() => {
    if (!selectedQuiz) return

    async function fetchResults() {
      try {
        const response = await fetch(`/api/quiz/${selectedQuiz}/results`)
        if (!response.ok) throw new Error('Erro ao carregar resultados')
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Erro ao carregar resultados:', error)
      }
    }

    fetchResults()
  }, [selectedQuiz])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Resultados dos Quizzes
        </h1>
        <p className="text-gray-600">
          Visualize o desempenho dos participantes em cada quiz
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Resumo dos Quizzes */}
        <div className="md:col-span-1 space-y-4">
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedQuiz === quiz.id ? 'bg-blue-50 border-blue-200' : 'bg-white'
              } border shadow-sm`}
              onClick={() => setSelectedQuiz(quiz.id)}
            >
              <div className="flex items-center gap-3">
                <FileText className={`h-5 w-5 ${
                  selectedQuiz === quiz.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="font-medium text-gray-800">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">
                    {quiz._count.results} participações
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lista de Resultados */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">
                  {quizzes.find(q => q.id === selectedQuiz)?.title}
                </h2>
              </div>
              {selectedQuiz && (
                <Link href={`/quiz/${selectedQuiz}/ranking`} target="_blank">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Ver ranking completo
                  </motion.button>
                </Link>
              )}
            </div>

            <div className="divide-y">
              {results.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">
                        {result.playerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {result.score} / {result.totalQuestions}
                      </p>
                      <p className="text-sm text-gray-500">
                        {((result.score / result.totalQuestions) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {results.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Nenhum resultado registrado para este quiz
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}