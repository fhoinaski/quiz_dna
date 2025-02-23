'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Plus, Trash2, Globe, Info, FileText, Save, X, AlertTriangle, Loader2 } from 'lucide-react'
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
    totalTimeLimit?: number
    isPublished?: boolean
  }
}

export function QuizForm({ initialData }: QuizFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [totalTimeLimit] = useState(initialData?.totalTimeLimit ?? 5)
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
      { text: '', options: ['', '', '', ''], correctAnswer: 0, order: newOrder }
    ])
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions.map((q, idx) => ({ ...q, order: idx })))
  }

  const updateQuestion = (index: number, field: string, value: string | number) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
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
      if (!title.trim()) throw new Error('Título é obrigatório')
      if (!description.trim()) throw new Error('Descrição é obrigatória')
      if (questions.length === 0) throw new Error('Adicione pelo menos uma questão')
      if (!Number.isInteger(totalTimeLimit) || totalTimeLimit < 1) {
        throw new Error('O tempo máximo deve ser um número inteiro maior ou igual a 1 minuto')
      }

      for (const [index, question] of questions.entries()) {
        if (!question.text.trim()) throw new Error(`Questão ${index + 1}: O texto da pergunta é obrigatório`)
        if (question.options.some(opt => !opt.trim())) throw new Error(`Questão ${index + 1}: Todas as opções devem ser preenchidas`)
        if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          throw new Error(`Questão ${index + 1}: Selecione uma resposta correta válida`)
        }
      }

      const quizData = {
        title,
        description,
        totalTimeLimit,
        questions: questions.map((q, index) => ({ ...q, order: index })),
        isPublished: isPublic
      }

      const url = initialData?.id ? `/api/quiz/${initialData.id}` : '/api/quiz'
      const method = initialData?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar quiz')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o quiz')
      console.error('Erro ao salvar quiz:', err)
    } finally {
      setLoading(false)
    }
  }

  const processImportedText = () => {
    try {
      let parsedQuestions: Question[] = []

      if (importFormat === 'simple') {
        const lines = importText.split('\n').map(line => line.trim()).filter(line => line)
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
            currentQuestion = { text: line.substring(2).trim(), options: [], correctAnswer: 0 }
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
      }

      if (parsedQuestions.length === 0) throw new Error('Nenhuma questão encontrada no texto')
      setImportPreview(parsedQuestions)
    } catch (err: any) {
      setError(err.message || 'Formato de texto inválido')
      console.error('Erro ao processar texto:', err)
    }
  }

  const applyImport = () => {
    setQuestions(importPreview)
    setShowImportModal(false)
    setImportText('')
    setImportPreview([])
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card className="mb-6 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl border border-gray-200">
            <div className="p-6 sm:p-8">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mb-6"
              >
                {initialData?.id ? 'Editar Quiz' : 'Criar Novo Quiz'}
              </motion.h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do quiz"
                    className="w-full rounded-lg shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o objetivo deste quiz"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[100px]"
                    rows={4}
                    required
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-indigo-50 rounded-lg border border-indigo-200"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="isPublic" className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                      <Globe className="w-5 h-5 mr-2 text-indigo-500" />
                      <span className="text-base font-semibold">Tornar este quiz público</span>
                    </label>
                  </div>
                  <div className="ml-8 text-sm text-gray-600 flex items-start">
                    <Info className="w-4 h-4 mr-1 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <p>Marque esta opção para permitir que qualquer pessoa acesse o quiz sem login.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>

          {/* Seção corrigida para os botões */}
          <div className="mb-6">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4"
            >
              Perguntas
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-end"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowImportModal(true)}
                className="w-full sm:w-auto border-indigo-400 text-indigo-600 hover:bg-indigo-50 rounded-full"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
              >
                <FileText className="w-4 h-4 mr-2" /> Importar Perguntas
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="w-full sm:w-auto border-indigo-400 text-indigo-600 hover:bg-indigo-50 rounded-full"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Pergunta
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 text-red-700 p-4 rounded-xl shadow-md mb-6"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {questions.map((question, questionIndex) => (
              <motion.div
                key={questionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <Card className="bg-white/95 backdrop-blur-sm shadow-md rounded-xl border border-gray-200">
                  <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 tracking-tight">
                        Pergunta {questionIndex + 1}
                      </h4>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="mb-4">
                      <Input
                        type="text"
                        value={question.text}
                        onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                        placeholder="Digite a pergunta"
                        className="w-full rounded-lg shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Opções</p>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center mb-3 gap-3">
                          <motion.input
                            whileHover={{ scale: 1.1 }}
                            type="radio"
                            name={`question-${questionIndex}-correct`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Opção ${optionIndex + 1}`}
                            className="flex-1 rounded-lg shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {questions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 shadow-sm"
            >
              <p className="text-gray-500 text-lg">Nenhuma pergunta adicionada.<br />Clique em &quot;Adicionar Pergunta&quot; ou &quot;Importar Perguntas&quot;.</p>
            </motion.div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              disabled={loading}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full shadow-md transition-all duration-200"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Quiz
                </>
              )}
            </Button>
          </div>
        </form>

        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Importar Perguntas</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="importFormat"
                      checked={importFormat === 'simple'}
                      onChange={() => setImportFormat('simple')}
                      className="mr-2 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    Formato Simples
                  </label>
                  <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="importFormat"
                      checked={importFormat === 'structured'}
                      onChange={() => setImportFormat('structured')}
                      className="mr-2 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    JSON
                  </label>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-4 text-sm"
                >
                  {importFormat === 'simple' ? (
                    <div>
                      <p className="font-medium mb-2 text-indigo-800">Instruções:</p>
                      <pre className="bg-white p-3 rounded-lg my-2 text-xs font-mono text-gray-800 shadow-sm">
                        P: Qual a capital do Brasil?{'\n'}
                        R: Rio de Janeiro{'\n'}
                        R: *Brasília{'\n'}
                        R: São Paulo{'\n'}
                        R: Belo Horizonte
                      </pre>
                      <ul className="list-disc pl-5 text-gray-600 text-xs">
                        <li>Cada pergunta começa com &quot;P:&quot;</li>
                        <li>Cada resposta começa com &quot;R:&quot;</li>
                        <li>Marque a resposta correta com &quot;*&quot;</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium mb-2 text-indigo-800">Formato JSON:</p>
                      <pre className="bg-white p-3 rounded-lg my-2 text-xs font-mono text-gray-800 shadow-sm">
                        {JSON.stringify([{ text: "Qual a capital do Brasil?", options: ["Rio de Janeiro", "Brasília", "São Paulo", "Belo Horizonte"], correctAnswer: 1 }], null, 2)}
                      </pre>
                    </div>
                  )}
                </motion.div>

                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={importFormat === 'simple' ? 'Cole seu texto aqui...' : 'Cole seu JSON aqui...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[150px] font-mono text-sm"
                  rows={8}
                />
              </div>

              <div className="flex justify-end gap-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setImportText(''); setImportPreview([]) }}
                  disabled={!importText}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full shadow-md transition-all duration-200"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                >
                  Limpar
                </Button>
                <Button
                  type="button"
                  onClick={processImportedText}
                  disabled={!importText}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full shadow-md transition-all duration-200"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                >
                  Visualizar
                </Button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-50 text-red-700 p-4 rounded-xl shadow-md mb-6"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {importPreview.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Prévia ({importPreview.length} perguntas):</h4>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto shadow-inner border border-gray-200">
                    <AnimatePresence>
                      {importPreview.map((q, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="mb-4 pb-4 border-b border-gray-200 last:border-0"
                        >
                          <p className="font-medium text-gray-800">{idx + 1}. {q.text}</p>
                          <ul className="mt-2 pl-6 text-sm">
                            {q.options.map((opt, optIdx) => (
                              <li key={optIdx} className={optIdx === q.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                {optIdx === q.correctAnswer ? '✓ ' : '- '}{opt}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImportModal(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full shadow-md transition-all duration-200"
                      onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                      onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={applyImport}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full shadow-md transition-all duration-200"
                      onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                      onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                    >
                      Importar {importPreview.length} Perguntas
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}