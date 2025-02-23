'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { BarChart2, AlertTriangle, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

interface QuizWithResultCount {
  id: string
  title: string
  description: string
  _count: {
    results: number
  }
  createdAt: string
}

export default function DashboardResultsPage() {
  const [quizzes, setQuizzes] = useState<QuizWithResultCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const hasFetched = useRef(false) // Controle para evitar loop

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/quizzes', { credentials: 'include' })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao carregar os quizzes')
      }
      const data = await response.json()
      console.log('Quizzes recebidos:', data)
      const formattedData = data
        .map((quiz: any) => ({
          id: quiz.id || quiz._id.toString(),
          title: quiz.title,
          description: quiz.description,
          _count: { results: quiz._count?.results || 0 },
          createdAt: quiz.createdAt,
        }))
        // Ordenar da maior para a menor quantidade de resultados
        .sort((a: QuizWithResultCount, b: QuizWithResultCount) => b._count.results - a._count.results)
      setQuizzes(formattedData)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar os quizzes')
      console.error('Erro ao carregar quizzes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!hasFetched.current) {
      fetchQuizzes()
      hasFetched.current = true // Marca como já buscado
    }
  }, [fetchQuizzes])

  // Animação GSAP para entrada dos cards
  useEffect(() => {
    if (!loading && quizzes.length > 0 && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    }
  }, [loading, quizzes])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-600">Carregando resultados...</p>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className="max-w-md mx-auto mt-12 p-6 bg-red-50 rounded-xl shadow-md"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
        <Button
          onClick={() => {
            setError('')
            fetchQuizzes()
          }}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-all duration-200"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
        >
          Tentar Novamente
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-indigo-600" />
            Resultados dos Quizzes
          </h1>
          <Link href="/dashboard/quiz/create">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-200"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Quiz
            </Button>
          </Link>
        </motion.div>

        {quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-xl font-medium mb-6">
              Nenhum resultado encontrado
            </p>
            <Link href="/dashboard/quiz/create">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Novo Quiz
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-semibold text-gray-800 tracking-tight line-clamp-1">
                        {quiz.title}
                      </h2>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {quiz._count.results} {quiz._count.results === 1 ? 'resultado' : 'resultados'}
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{quiz.description}</p>
                    <div className="text-xs text-gray-500">
                      Criado em: {new Date(quiz.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <Link href={`/dashboard/quiz/${quiz.id}/results`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center gap-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
                        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                      >
                        <BarChart2 className="w-4 h-4" />
                        Ver Resultados
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}