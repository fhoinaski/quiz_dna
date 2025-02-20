'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'

// Types
interface Question {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

interface QuizFormData {
  title: string
  description: string
  questions: Question[]
  isPublished: boolean
}

// Components
interface QuestionFormProps {
  question: Question
  questionIndex: number
  onUpdate: (index: number, field: keyof Question, value: string | string[] | number) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

const QuestionForm = ({ question, questionIndex, onUpdate, onRemove, canRemove }: QuestionFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Questão {questionIndex + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(questionIndex)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Digite a pergunta"
          value={question.text}
          onChange={(e) => onUpdate(questionIndex, 'text', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="space-y-3">
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex gap-3 items-center">
              <input
                type="radio"
                name={`correct-${questionIndex}`}
                checked={question.correctAnswer === optionIndex}
                onChange={() => onUpdate(questionIndex, 'correctAnswer', optionIndex)}
                required
              />
              <input
                type="text"
                placeholder={`Opção ${optionIndex + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options]
                  newOptions[optionIndex] = e.target.value
                  onUpdate(questionIndex, 'options', newOptions)
                }}
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

// Custom Hook
const useQuizForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      order: 0
    }
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        order: questions.length
      }
    ])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: string | string[] | number) => {
    setQuestions(questions.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ))
  }

  return {
    title,
    setTitle,
    description,
    setDescription,
    error,
    setError,
    loading,
    setLoading,
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion
  }
}

// Main Component
export default function CreateQuizPage() {
  const router = useRouter()
  const {
    title,
    setTitle,
    description,
    setDescription,
    error,
    setError,
    loading,
    setLoading,
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion
  } = useQuizForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData: QuizFormData = {
      title,
      description,
      questions,
      isPublished: false
    }

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData: { error: string } = await response.json()
        throw new Error(errorData.error || 'Erro ao criar quiz')
      }

      await response.json()
      router.push('/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Erro ao criar quiz')
      }
      console.error('Erro ao criar quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Criar Novo Quiz</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <QuestionForm
                key={index}
                question={question}
                questionIndex={index}
                onUpdate={updateQuestion}
                onRemove={removeQuestion}
                canRemove={questions.length > 1}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <motion.button
              type="button"
              onClick={addQuestion}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Questão
            </motion.button>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Quiz'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}