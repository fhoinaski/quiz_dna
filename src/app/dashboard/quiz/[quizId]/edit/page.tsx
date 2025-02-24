'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { QuizForm } from '@/components/dashboard/QuizForm'
import { QuizControlPanel } from '@/components/dashboard/QuizControlPanel'

interface Question {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  totalTimeLimit: number
  isPublished: boolean
}

export default function EditQuizPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/quiz/${quizId}`, {
          headers: { 'Cache-Control': 'no-cache' }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Falha ao carregar quiz')
        }

        const data = await response.json()
        setQuiz(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar quiz')
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 p-6 rounded-lg shadow-md"
        >
          <p className="text-error text-lg font-medium">{error || 'Quiz não encontrado'}</p>
          <Link href="/dashboard" className="mt-4 inline-flex items-center text-primary hover:text-primary-dark transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para Dashboard
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <nav className="text-sm text-gray-600 mb-4">
          <Link href="/dashboard" className="hover:text-primary">Dashboard</Link> / Editar Quiz
        </nav>
        <Link href="/dashboard" className="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-2 text-gray-800">Editar Quiz</h1>
      </motion.div>

      <QuizControlPanel quizId={quizId} />
      <QuizForm
        initialData={{
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
          totalTimeLimit: quiz.totalTimeLimit,
          isPublished: quiz.isPublished
        }}
      />
    </div>
  )
}