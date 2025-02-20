'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuizStore } from '@/store'
import { WelcomeScreen } from '@/components/quiz/WelcomeScreen'
import { QuizScreen } from '@/components/quiz/QuizScreen'
import { ResultsScreen } from '@/components/quiz/ResultsScreen'

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
}

interface ApiError {
  message: string
}

export default function QuizPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { currentStep, setCurrentQuiz } = useQuizStore()

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch(`/api/quiz/${quizId}`)
        if (!response.ok) {
          const errorData = await response.json() as ApiError
          throw new Error(errorData.message || 'Quiz não encontrado')
        }
        const data = await response.json() as Quiz
        setQuiz(data)
        setCurrentQuiz(data)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Erro desconhecido ao carregar o quiz')
        }
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchQuiz()
    }
  }, [quizId, setCurrentQuiz])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Quiz não encontrado'}
          </h1>
          <p className="text-gray-600">
            O quiz que você está procurando não existe ou não está disponível.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {currentStep === 'welcome' && <WelcomeScreen quiz={quiz} />}
      {currentStep === 'quiz' && <QuizScreen />}
      {currentStep === 'results' && <ResultsScreen />}
    </div>
  )
}