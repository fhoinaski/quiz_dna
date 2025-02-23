// src/components/dashboard/ResultsTable.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { AlertTriangle } from 'lucide-react'
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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao carregar resultados')
      }
      
      const data = await response.json() as QuizResult[]
      setResults(data)
      setError('')
    } catch (err) {
      console.error('[ResultsTable] Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar resultados')
    } finally {
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Nenhum resultado encontrado para este quiz.</p>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="py-3 px-6">Jogador</th>
              <th className="py-3 px-6">Pontuação</th>
              <th className="py-3 px-6">Total de Questões</th>
              <th className="py-3 px-6">Data</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <motion.tr
                key={result.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="py-4 px-6">{result.playerName}</td>
                <td className="py-4 px-6">{result.score}</td>
                <td className="py-4 px-6">{result.totalQuestions}</td>
                <td className="py-4 px-6">
                  {new Date(result.createdAt).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}