'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuizStore } from '@/store'
import { QuizScreen } from '@/components/quiz/QuizScreen'
import { ResultsScreen } from '@/components/quiz/ResultsScreen'
import { WaitingRoom } from '@/components/quiz/WaitingRoom'
import { WelcomeScreen } from '@/components/quiz/WelcomeScreen'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

// interface Question {
//   text: string
//   options: string[]
//   correctAnswer: number
//   order: number
// }

// interface Quiz {
//   id: string
//   title: string
//   description: string
//   questions: Question[]
// }

export default function QuizPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { currentStep, setCurrentQuiz, checkSessionStatus, isQuizActive } = useQuizStore()

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        console.log(`[QuizPage] Carregando quiz com ID: ${quizId}`)

        const response = await fetch(`/api/quiz/${quizId}/public`)
        if (!response.ok) {
          throw new Error('Não foi possível carregar o quiz')
        }

        const quiz = await response.json()
        console.log('[QuizPage] Quiz carregado:', quiz)
        setCurrentQuiz(quiz)
        setError('')

        await checkSessionStatus()
        console.log('[QuizPage] Status da sessão verificado:', { isQuizActive })
      } catch (error: any) {
        console.error('[QuizPage] Erro ao carregar quiz:', error)
        setError(error.message || 'Erro ao carregar quiz')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()

    const interval = setInterval(() => {
      checkSessionStatus()
    }, 3000)

    return () => clearInterval(interval)
}, [quizId, setCurrentQuiz, checkSessionStatus, isQuizActive]) // Adicionado isQuizActive aqui

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
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Ocorreu um erro</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="inline-flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o início
          </Link>
        </div>
      </div>
    )
  }

  console.log('[QuizPage] Renderizando com currentStep:', currentStep)
  return (
    <>
      {currentStep === 'waiting' && <WaitingRoom />}
      {currentStep === 'welcome' && <WelcomeScreen />}
      {currentStep === 'quiz' && <QuizScreen />}
      {currentStep === 'results' && <ResultsScreen />}
    </>
  )
}