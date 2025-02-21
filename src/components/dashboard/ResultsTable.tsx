'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import type { QuizResult } from '@/types'

type ResultsTableProps = {
  quizId: string
}

export function ResultsTable({ quizId }: ResultsTableProps) {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/results`)
      
      if (!response.ok) {
        throw new Error('Falha ao carregar resultados')
      }
      
      const data = await response.json() as QuizResult[]
      
      // Remover resultados duplicados baseados no playerName (mantém o de maior pontuação)
      const uniqueResults = data.reduce<Record<string, QuizResult>>((acc, current) => {
        // Se é a primeira vez que vemos esse playerName ou o score é maior que o existente
        if (!acc[current.playerName] || current.score > acc[current.playerName].score) {
          acc[current.playerName] = current
        }
        return acc
      }, {})
      
      // Converter de volta para array e ordenar
      const filteredResults = Object.values(uniqueResults)
        .sort((a, b) => {
          // Primeiro por pontuação (decrescente)
          if (b.score !== a.score) return b.score - a.score
          // Depois por data (mais antigo primeiro)
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
      
      setResults(filteredResults)
      setError('')
    } catch (error) {
      console.error('Erro ao carregar resultados:', error)
      setError('Não foi possível carregar os resultados. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    if (quizId) {
      fetchResults()
    }
  }, [quizId, fetchResults])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => fetchResults()}
          className="mt-2 text-blue-600 hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center p-6 bg-blue-50 rounded-lg">
        <p className="text-gray-600">Nenhum resultado encontrado para este quiz.</p>
      </div>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
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
            {results.map((result, index) => (
              <motion.tr 
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="font-medium text-gray-900">{result.playerName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">
                    {result.score} / {result.totalQuestions}
                    <span className="ml-2 text-sm text-gray-500">
                      ({Math.round((result.score / result.totalQuestions) * 100)}%)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(result.createdAt).toLocaleString('pt-BR')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}