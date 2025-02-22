'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, ArrowLeft, AlertTriangle } from 'lucide-react'

// Interfaces baseadas no seu projeto
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

export default function QuizResultsPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const [results, setResults] = useState<Result[]>([])
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fetchAttempted, setFetchAttempted] = useState(false)

  // Função para buscar os dados
  useEffect(() => {
    if (fetchAttempted) return

    const fetchResults = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/quiz/${quizId}/results`)
        if (!response.ok) {
          throw new Error('Falha ao carregar os resultados')
        }
        const data = await response.json()
        setResults(data.results || [])
        setQuiz(data.quiz || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
        setFetchAttempted(true)
      }
    }

    fetchResults()
  }, [quizId, fetchAttempted])

  // Variantes de animação
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Renderização condicional
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro</h2>
          <p className="text-gray-600">{error}</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Quiz não encontrado</h2>
          <Link href="/dashboard" className="text-blue-600 hover:underline mt-4 inline-block">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Resultados: {quiz.title}
        </h1>
      </div>

      {/* Tabela de resultados */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jogador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pontuação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.length > 0 ? (
              results.map((result, index) => (
                <motion.tr
                  key={result.id} // Usando result.id como chave única
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.playerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.score} / {result.totalQuestions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Nenhum resultado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}