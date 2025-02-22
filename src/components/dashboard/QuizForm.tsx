'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Globe, Info, FileText, Save, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import type { Question } from '@/types'

type QuizFormProps = {
  initialData?: {
    id?: string
    title: string
    description: string
    questions: Question[]
    isPublished?: boolean
  }
}

export function QuizForm({ initialData }: QuizFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [isPublic, setIsPublic] = useState(initialData?.isPublished ?? false)
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions ?? [{
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      order: 0
    }]
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState('')
  const [importFormat, setImportFormat] = useState<'simple' | 'structured'>('simple')
  const [importPreview, setImportPreview] = useState<Question[]>([])

  const addQuestion = () => {
    const newOrder = questions.length
    setQuestions([
      ...questions,
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        order: newOrder
      }
    ])
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)

    const reorderedQuestions = newQuestions.map((q, idx) => ({
      ...q,
      order: idx
    }))

    setQuestions(reorderedQuestions)
  }

  const updateQuestion = (index: number, field: string, value: string | number) => {
    const newQuestions = [...questions]
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    }
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!title.trim()) {
        throw new Error('Título é obrigatório')
      }

      if (!description.trim()) {
        throw new Error('Descrição é obrigatória')
      }

      if (questions.length === 0) {
        throw new Error('Adicione pelo menos uma questão')
      }

      for (const [index, question] of questions.entries()) {
        if (!question.text.trim()) {
          throw new Error(`Questão ${index + 1}: O texto da pergunta é obrigatório`)
        }

        if (question.options.some(option => !option.trim())) {
          throw new Error(`Questão ${index + 1}: Todas as opções devem ser preenchidas`)
        }

        if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          throw new Error(`Questão ${index + 1}: Selecione uma resposta correta válida`)
        }
      }

      const quizData = {
        title,
        description,
        questions: questions.map((q, index) => ({
          ...q,
          order: index
        })),
        isPublished: isPublic
      }

      const url = initialData?.id
        ? `/api/quiz/${initialData.id}`
        : '/api/quiz'

      const method = initialData?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar quiz')
      }

      router.push('/dashboard')

    } catch (err: any) {
      console.error('Erro ao salvar quiz:', err)
      setError(err.message || 'Ocorreu um erro ao salvar o quiz')
    } finally {
      setLoading(false)
    }
  }

  const processImportedText = () => {
    try {
      let parsedQuestions: Question[] = []

      if (importFormat === 'simple') {
        const lines = importText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
        let currentQuestion: Partial<Question> | null = null

        for (const line of lines) {
          if (line.startsWith('P:')) {
            if (currentQuestion?.text && currentQuestion.options?.length) {
              parsedQuestions.push({
                text: currentQuestion.text,
                options: currentQuestion.options,
                correctAnswer: currentQuestion.correctAnswer || 0,
                order: parsedQuestions.length
              })
            }

            currentQuestion = {
              text: line.substring(2).trim(),
              options: [],
              correctAnswer: 0
            }
          } else if (line.startsWith('R:') && currentQuestion) {
            const optionText = line.substring(2).trim()

            if (optionText.startsWith('*')) {
              currentQuestion.correctAnswer = currentQuestion.options?.length || 0
              currentQuestion.options?.push(optionText.substring(1).trim())
            } else {
              currentQuestion.options?.push(optionText)
            }
          }
        }

        if (currentQuestion?.text && currentQuestion.options?.length) {
          parsedQuestions.push({
            text: currentQuestion.text,
            options: currentQuestion.options,
            correctAnswer: currentQuestion.correctAnswer || 0,
            order: parsedQuestions.length
          })
        }
      } else {
        try {
          const jsonData = JSON.parse(importText)

          if (Array.isArray(jsonData)) {
            parsedQuestions = jsonData.map((q, index) => ({
              text: q.text || '',
              options: q.options || ['', '', '', ''],
              correctAnswer: q.correctAnswer || 0,
              order: index
            }))
          } else {
            throw new Error('O JSON deve ser um array de questões')
          }
        } catch {
          throw new Error('Erro ao processar JSON: Formato inválido')
        }
      }

      if (parsedQuestions.length === 0) {
        throw new Error('Nenhuma questão encontrada no texto')
      }

      setImportPreview(parsedQuestions)

    } catch (err: any) {
      console.error('Erro ao processar texto:', err)
      setError(err.message || 'Formato de texto inválido')
    }
  }

  const applyImport = () => {
    setQuestions(importPreview)
    setShowImportModal(false)
    setImportText('')
    setImportPreview([])
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do quiz"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o objetivo deste quiz"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              rows={3}
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="flex items-center text-sm font-medium text-gray-700">
                <Globe className="w-5 h-5 mr-1 text-blue-500" />
                <span className="text-base font-semibold">Tornar este quiz público</span>
              </label>
            </div>

            <div className="ml-7 text-sm text-gray-600 flex items-start">
              <Info className="w-4 h-4 mr-1 text-blue-500 mt-0.5 flex-shrink-0" />
              <p>
                Marque esta opção para permitir que qualquer pessoa acesse o quiz sem precisar de login.
                Os quizzes públicos podem ser compartilhados e têm uma página de ranking acessível.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Perguntas</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImportModal(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Importar Perguntas
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Pergunta
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <AnimatePresence>
          {questions.map((question, questionIndex) => (
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-800">Pergunta {questionIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <Input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                    placeholder="Digite a pergunta"
                    className="w-full"
                  />
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Opções</p>

                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={`question-${questionIndex}-correct`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <Input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                        placeholder={`Opção ${optionIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {questions.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhuma pergunta adicionada. Clique em &quot;Adicionar Pergunta&quot; ou &quot;Importar Perguntas&quot;.</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full" />
                Salvando...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Salvar Quiz
              </span>
            )}
          </Button>
        </div>
      </form>

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Importar Perguntas</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex gap-3 mb-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importFormat"
                      checked={importFormat === 'simple'}
                      onChange={() => setImportFormat('simple')}
                      className="mr-2"
                    />
                    <span>Formato Simples</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="importFormat"
                      checked={importFormat === 'structured'}
                      onChange={() => setImportFormat('structured')}
                      className="mr-2"
                    />
                    <span>JSON</span>
                  </label>
                </div>

                <div className="bg-gray-50 p-3 rounded-md text-sm mb-3">
                  {importFormat === 'simple' ? (
                    <div>
                      <p className="font-medium mb-1">Instruções:</p>
                      <p>Use o seguinte formato:</p>
                      <pre className="bg-gray-100 p-2 rounded my-2 overflow-x-auto">
                        P: Qual a capital do Brasil?{'\n'}
                        R: Rio de Janeiro{'\n'}
                        R: *Brasília{'\n'}
                        R: São Paulo{'\n'}
                        R: Belo Horizonte
                      </pre>
                      <ul className="list-disc pl-5 text-gray-600">
                        <li>Cada pergunta começa com &quot;P:&quot;</li>
                        <li>Cada resposta começa com &quot;R:&quot;</li>
                        <li>Marque a resposta correta com um asterisco (*)</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium mb-1">Formato JSON:</p>
                      <pre className="bg-gray-100 p-2 rounded my-2 overflow-x-auto">
                        {JSON.stringify([
                          {
                            text: "Qual a capital do Brasil?",
                            options: ["Rio de Janeiro", "Brasília", "São Paulo", "Belo Horizonte"],
                            correctAnswer: 1
                          }
                        ], null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={importFormat === 'simple'
                    ? "Cole seu texto aqui no formato especificado..."
                    : "Cole seu JSON aqui..."}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  rows={8}
                />
              </div>

              <div className="flex justify-end gap-2 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setImportText('')
                    setImportPreview([])
                  }}
                  disabled={!importText}
                >
                  Limpar
                </Button>
                <Button
                  type="button"
                  onClick={processImportedText}
                  disabled={!importText}
                >
                  Visualizar
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              {importPreview.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Prévia ({importPreview.length} perguntas):</h4>
                  <div className="bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto">
                    {importPreview.map((q, idx) => (
                      <div key={idx} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
                        <p className="font-medium">{idx + 1}. {q.text}</p>
                        <ul className="mt-1 pl-6">
                          {q.options.map((option, optIdx) => (
                            <li key={optIdx} className={optIdx === q.correctAnswer ? 'text-green-600 font-medium' : ''}>
                              {optIdx === q.correctAnswer ? '✓ ' : ''}{option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImportModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={applyImport}
                    >
                      Importar {importPreview.length} Perguntas
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}