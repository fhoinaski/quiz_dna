'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart2 } from 'lucide-react'

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
  const [fetchAttempted, setFetchAttempted] = useState(false)

  useEffect(() => {
    // Evitar múltiplas chamadas
    if (fetchAttempted) return
    
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        setFetchAttempted(true)
        
        const response = await fetch('/api/quiz')
        
        if (!response.ok) {
          throw new Error('Falha ao carregar quizzes')
        }
        
        const data = await response.json()
        
        // Ordenar por data de criação (mais recente primeiro)
        const sortedQuizzes = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        
        setQuizzes(sortedQuizzes)
      } catch (err: any) {
        console.error('Erro ao carregar quizzes:', err)
        setError(err.message || 'Ocorreu um erro ao carregar os quizzes')
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuizzes()
  }, [fetchAttempted])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h2 className="text-red-800 font-medium mb-2">Erro</h2>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => {
            setFetchAttempted(false)
            setError('')
          }}
          className="mt-4 text-blue-600 hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Resultados</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <BarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">Nenhum quiz encontrado</h2>
          <p className="text-gray-600 mb-6">
            Você ainda não criou nenhum quiz. Crie seu primeiro quiz para começar a ver resultados.
          </p>
          
          <Link href="/dashboard/quiz/create" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Criar novo quiz
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Resultados</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-600 mb-6">
          Selecione um quiz para ver seus resultados detalhados:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/dashboard/quiz/${quiz.id}/results`}>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{quiz.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">
                      {quiz._count?.results || 0} {quiz._count?.results === 1 ? 'resposta' : 'respostas'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{quiz.description}</p>
                  <div className="text-xs text-gray-400">
                    Criado em {new Date(quiz.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}