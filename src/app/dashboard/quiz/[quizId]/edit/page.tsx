'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
  const router = useRouter()
  const quizId = params.quizId as string
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Dados do formulário
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/quiz/${quizId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Quiz não encontrado')
          }
          throw new Error('Falha ao carregar o quiz')
        }
        
        const data = await response.json()
        
        // Verificar se os dados são válidos
        if (!data || typeof data !== 'object') {
          throw new Error('Formato de dados inválido')
        }
        
        // Normalizar as questões para garantir que tenham o formato correto
        const normalizedQuestions = Array.isArray(data.questions) 
          ? data.questions.map((q: any, index: number) => ({
              id: q.id || `temp-${index}`,
              text: q.text || '',
              options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
              correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
              order: typeof q.order === 'number' ? q.order : index
            }))
          : [];
        
        // Criar um objeto quiz normalizado
        const normalizedQuiz = {
          id: data.id || quizId,
          title: data.title || '',
          description: data.description || '',
          questions: normalizedQuestions,
          isPublished: Boolean(data.isPublished)
        };
        
        setQuiz(normalizedQuiz)
        
        // Atualizar o estado do formulário
        setTitle(normalizedQuiz.title)
        setDescription(normalizedQuiz.description)
        setQuestions(normalizedQuiz.questions)
        setIsPublished(normalizedQuiz.isPublished)
        
      } catch (error) {
        console.error('Erro ao buscar quiz:', error)
        setError('Não foi possível carregar o quiz. Tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchQuiz()
    }
  }, [quizId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (questions.length === 0) {
      setError('O quiz precisa ter pelo menos uma questão')
      return
    }
    
    try {
      setSaving(true)
      setError(null)
      
      // Validar se todas as questões estão preenchidas
      const invalidQuestions = questions.filter(q => !q.text || q.options.some(opt => !opt))
      
      if (invalidQuestions.length > 0) {
        setError('Todas as questões e opções devem ser preenchidas')
        setSaving(false)
        return
      }
      
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          questions,
          isPublished,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao atualizar o quiz')
      }

      setSuccessMessage('Quiz atualizado com sucesso!')
      
      // Limpar a mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
      
    } catch (error: any) {
      console.error('Erro ao atualizar quiz:', error)
      setError(error.message || 'Erro ao atualizar o quiz')
    } finally {
      setSaving(false)
    }
  }

  // Funções para gerenciar questões
  const addQuestion = () => {
    const newQuestion: Question = {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      order: questions.length
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setQuestions(updatedQuestions)
  }

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    const options = [...updatedQuestions[questionIndex].options]
    options[optionIndex] = value
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options }
    setQuestions(updatedQuestions)
  }

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      setError('O quiz precisa ter pelo menos uma questão')
      return
    }
    const updatedQuestions = questions.filter((_, i) => i !== index)
    setQuestions(updatedQuestions)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !quiz) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Erro</h3>
          <p className="text-red-700">{error}</p>
          <div className="mt-4">
            <Link href="/dashboard">
              <Button variant="outline" className="mr-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o dashboard
              </Button>
            </Link>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Editar Quiz</h1>
        </div>
        <div>
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={() => router.push(`/quiz/${quizId}`)}
          >
            Visualizar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <p className="text-red-700">{error}</p>
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
        >
          <p className="text-green-700">{successMessage}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título do Quiz
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Publicar quiz</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Questões</h2>
          
          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <div 
                key={question.id || questionIndex} 
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium">Questão {questionIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remover
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto da questão
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opções
                  </label>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="radio"
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                        className="mr-2"
                        required
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Opção ${optionIndex + 1}`}
                        required
                      />
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-1">
                    Selecione o botão ao lado da resposta correta
                  </p>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-2 px-4 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center"
            >
              Adicionar questão
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link href="/dashboard">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </div>
  )
}