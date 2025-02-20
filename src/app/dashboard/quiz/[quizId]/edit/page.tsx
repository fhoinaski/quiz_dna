'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Question = {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

type Quiz = {
  id: string
  title: string
  description: string
  questions: Question[]
  isPublished: boolean
}

export default function EditQuizPage() {
  const params = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/${params.quizId}`)
      if (!response.ok) throw new Error('Quiz não encontrado')
      const data = await response.json()
      setQuiz(data)
    } catch (error) {
      console.error('Erro ao carregar quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuiz();
  }, [params.quizId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quiz) return

    setSaving(true)
    try {
      const response = await fetch(`/api/quiz/${quiz.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz)
      })

      if (!response.ok) throw new Error('Erro ao atualizar quiz')
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro ao atualizar quiz:', error)
    } finally {
      setSaving(false)
    }
  }

  const addQuestion = () => {
    if (!quiz) return
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          order: quiz.questions.length
        }
      ]
    })
  }

  const removeQuestion = (index: number) => {
    if (!quiz || quiz.questions.length <= 1) return
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index)
    })
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
        <p className="text-red-600">Quiz não encontrado</p>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 text-blue-600"
          >
            Voltar para o dashboard
          </motion.button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-blue-600"
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
            />
            <label htmlFor="isPublished" className="text-gray-700">
              Publicar quiz
            </label>
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Questão {qIndex + 1}
                </h3>
                {quiz.questions.length > 1 && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                )}
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => {
                    const newQuestions = [...quiz.questions]
                    newQuestions[qIndex] = {
                      ...question,
                      text: e.target.value
                    }
                    setQuiz({ ...quiz, questions: newQuestions })
                  }}
                  placeholder="Digite a pergunta"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <div className="space-y-3">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex gap-3 items-center">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => {
                          const newQuestions = [...quiz.questions]
                          newQuestions[qIndex] = {
                            ...question,
                            correctAnswer: oIndex
                          }
                          setQuiz({ ...quiz, questions: newQuestions })
                        }}
                        required
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newQuestions = [...quiz.questions]
                          newQuestions[qIndex] = {
                            ...question,
                            options: question.options.map((opt, i) =>
                              i === oIndex ? e.target.value : opt
                            )
                          }
                          setQuiz({ ...quiz, questions: newQuestions })
                        }}
                        placeholder={`Opção ${oIndex + 1}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-between">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addQuestion}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg"
          >
            <Plus className="h-5 w-5" />
            Adicionar Questão
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}