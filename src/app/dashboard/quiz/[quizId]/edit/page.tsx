// src/app/dashboard/quiz/[quizId]/edit/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { QuizForm } from '@/components/dashboard/QuizForm'
import { QuizControlPanel } from '@/components/dashboard/QuizControlPanel'

// Interfaces
interface Question {
  id?: string
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
        const response = await fetch(`/api/quiz/${quizId}`)
      
        if (!response.ok) {
          throw new Error('Falha ao carregar quiz')
        }
        
        const data = await response.json()
        setQuiz(data)
      } catch (error: any) {
        setError(error.message || 'Erro ao carregar quiz')
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuiz()
  }, [quizId])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error || 'Quiz não encontrado'}</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">
            Voltar para Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-2">Editar Quiz</h1>
      </div>
      
      {/* Adicionar o painel de controle */}
      <QuizControlPanel quizId={quizId} />
      
      <QuizForm
        initialData={{
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
          isPublished: quiz.isPublished
        }}
      />
    </div>
  )
}