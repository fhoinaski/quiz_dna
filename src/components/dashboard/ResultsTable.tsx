'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import type { QuizResult } from '@/types'

type ResultsTableProps = {
  quizId: string
}

export function ResultsTable({ quizId }: ResultsTableProps) {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)

 

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/results`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Erro ao carregar resultados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }
  useEffect(() => {
    const fetchData = async () => {
      await fetchResults();
    };
    fetchData();
  }, [quizId, fetchResults]);

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Participante
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Pontuação
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Percentual
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Data
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <motion.tr
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b"
              >
                <td className="px-6 py-4 text-sm text-gray-800">
                  {result.playerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {result.score} / {result.totalQuestions}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {((result.score / result.totalQuestions) * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {new Date(result.createdAt).toLocaleDateString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum resultado encontrado</p>
          </div>
        )}
      </div>
    </Card>
  )
}