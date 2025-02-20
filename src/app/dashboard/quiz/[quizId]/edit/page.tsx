'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Interfaces
interface Question {
  id: string
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

interface ApiError {
  message: string
}

// Componentes
interface QuestionFormProps {
  question: Question
  index: number
  totalQuestions: number
  onUpdate: (index: number, updates: Partial<Question>) => void
  onRemove: (index: number) => void
}

const QuestionForm = ({ question, index, totalQuestions, onUpdate, onRemove }: QuestionFormProps) => {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Questão {index + 1}
        </h3>
        {totalQuestions > 1 && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
        )}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={question.text}
          onChange={(e) => onUpdate(index, { text: e.target.value })}
          placeholder="Digite a pergunta"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="space-y-3">
          {question.options.map((option, optionIndex) => (
            <div key={`${question.id}-option-${optionIndex}`} className="flex gap-3 items-center">
              <input
                type="radio"
                name={`correct-${question.id}`}
                checked={question.correctAnswer === optionIndex}
                onChange={() => onUpdate(index, { correctAnswer: optionIndex })}
                required
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options]
                  newOptions[optionIndex] = e.target.value
                  onUpdate(index, { options: newOptions })
                }}
                placeholder={`Opção ${optionIndex + 1}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Hook personalizado para gerenciar o estado do quiz
const useQuiz = (quizId: string) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`)
      if (!response.ok) {
        const errorData = await response.json() as ApiError
        throw new Error(errorData.message || 'Quiz não encontrado')
      }
      const data = await response.json()
      
      // Adiciona IDs únicos para questões
      const questionsWithIds = data.questions.map((question: Question, index: number) => ({
        ...question,
        id: question.id || `question-${index}-${Date.now()}`
      }))
      
      setQuiz({
        ...data,
        questions: questionsWithIds
      })
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Erro ao carregar quiz')
      }
      console.error('Erro ao carregar quiz:', error)
    } finally {
      setLoading(false)
    }
  }, [quizId])

  const updateQuiz = async (updatedQuiz: Quiz) => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/quiz/${updatedQuiz.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedQuiz)
      })

      if (!response.ok) {
        const errorData = await response.json() as ApiError
        throw new Error(errorData.message || 'Erro ao atualizar quiz')
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Erro ao atualizar quiz')
      }
      console.error('Erro ao atualizar quiz:', error)
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    quiz,
    setQuiz,
    loading,
    saving,
    error,
    fetchQuiz,
    updateQuiz
  }
}

// Componente principal
export default function EditQuizPage() {
  const params = useParams()
  const router = useRouter()
  const { 
    quiz, 
    setQuiz, 
    loading, 
    saving, 
    error, 
    fetchQuiz, 
    updateQuiz 
  } = useQuiz(params.quizId as string)

  useEffect(() => {
    fetchQuiz()
  }, [fetchQuiz])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!quiz) return

    const success = await updateQuiz(quiz)
    if (success) {
      router.push('/dashboard')
    }
  }

  const addQuestion = () => {
    if (!quiz) return
    const newQuestion: Question = {
      id: `question-${Date.now()}-${quiz.questions.length}`,
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      order: quiz.questions.length
    }
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQuestion]
    })
  }

  const removeQuestion = (index: number) => {
    if (!quiz || quiz.questions.length <= 1) return
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index)
    })
  }

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    if (!quiz) return
    const newQuestions = [...quiz.questions]
    newQuestions[index] = { ...newQuestions[index], ...updates }
    setQuiz({ ...quiz, questions: newQuestions })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error || 'Quiz não encontrado'}</p>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 text-blue-600 hover:text-blue-700 transition-colors"
          >
            Voltar para o dashboard
          </motion.button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-8">
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o dashboard
          </motion.button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            placeholder="Título do Quiz"
            className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <textarea
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            placeholder="Descrição"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={quiz.isPublished}
              onChange={(e) => setQuiz({ ...quiz, isPublished: e.target.checked })}
              id="isPublished"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPublished" className="text-gray-700">
              Publicar quiz
            </label>
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <QuestionForm
              key={question.id}
              question={question}
              index={index}
              totalQuestions={quiz.questions.length}
              onUpdate={updateQuestion}
              onRemove={removeQuestion}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addQuestion}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Adicionar Questão
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}