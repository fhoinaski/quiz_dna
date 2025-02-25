'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Card } from '@/components/ui/Card'
import { AlertTriangle, Zap } from 'lucide-react'
import { CustomCursor } from '@/components/ui/CustomCursor'
import type { QuizResult } from '@/types'

type ResultsTableProps = {
  quizId: string
}

export function ResultsTable({ quizId }: ResultsTableProps) {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)

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

  // Animação GSAP para entrada das linhas
  useEffect(() => {
    if (!loading && results.length > 0 && tableRef.current) {
      gsap.fromTo(
        tableRef.current.querySelectorAll('tbody tr'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    }
  }, [loading, results])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center py-20 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-t-blue-600 border-gray-200 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg font-medium text-gray-600"
        >
          Carregando resultados...
        </motion.p>
      </motion.div>
    )
  }

  return (
    <>
      <CustomCursor />
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', bounce: 0.3 }}
        className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8"
          >
            Resultados do Quiz
          </motion.h2>

          {error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-100 mb-6"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 bg-blue-50 rounded-xl border border-dashed border-blue-200 shadow-sm"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Zap className="w-8 h-8 text-blue-600" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-lg"
              >
                Nenhum resultado encontrado para este quiz.
              </motion.p>
            </motion.div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-6 overflow-x-auto">
                <table ref={tableRef} className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-4 px-4 sm:px-6">Jogador</th>
                      <th className="py-4 px-4 sm:px-6">Pontuação</th>
                      <th className="py-4 px-4 sm:px-6">Total de Questões</th>
                      <th className="py-4 px-4 sm:px-6">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {results.map((result) => (
                        <motion.tr
                          key={result.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.4 }}
                          className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4 sm:px-6 font-medium text-gray-800">{result.playerName}</td>
                          <td className="py-4 px-4 sm:px-6 text-blue-600 font-semibold">{result.score}</td>
                          <td className="py-4 px-4 sm:px-6">{result.totalQuestions}</td>
                          <td className="py-4 px-4 sm:px-6 text-gray-500">
                            {new Date(result.createdAt).toLocaleString()}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Toast de erro */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-xl shadow-xl flex items-center gap-2 z-50"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
              <button onClick={() => setError('')} className="ml-2 hover:text-gray-200">×</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}