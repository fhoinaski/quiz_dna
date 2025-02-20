'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Upload } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Question } from '@/types'

type QuizFormProps = {
  initialData?: {
    id?: string
    title: string
    description: string
    questions: Question[]
  }
}

export function QuizForm({ initialData }: QuizFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions ?? [{
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      order: 0
    }]
  )
  const [loading, setLoading] = useState(false)

  // Função para processar texto direto
  const processText = (text: string) => {
    try {
      // Divide o texto em linhas e remove espaços em branco extras
      const lines = text.split('\n').map(line => line.trim()).filter(line => line)
      
      const newQuestions: Question[] = []
      let currentQuestion: Partial<Question> = {}
      let currentOptions: string[] = []
      
      lines.forEach(line => {
        // Verifica se é uma nova questão (começa com número seguido de ponto)
        if (/^\d+\./.test(line)) {
          // Se já temos uma questão em processamento, salvamos ela
          if (currentQuestion.text && currentOptions.length > 0) {
            newQuestions.push({
              text: currentQuestion.text,
              options: currentOptions,
              correctAnswer: currentQuestion.correctAnswer ?? 0,
              order: newQuestions.length
            })
          }
          
          // Extrai o texto da questão (remove números e asteriscos)
          const questionText = line.replace(/^\d+\.\s*\*\*|\*\*$/g, '').trim()
          currentQuestion = { text: questionText }
          currentOptions = []
        }
        // Verifica se é uma opção (começa com hífen)
        else if (line.startsWith('-')) {
          const option = line.replace(/^-\s*/, '').trim()
          // Remove a indicação "(Correta)" e marca como resposta correta se necessário
          if (option.includes('(Correta)')) {
            currentOptions.push(option.replace('(Correta)', '').trim())
            currentQuestion.correctAnswer = currentOptions.length - 1
          } else {
            currentOptions.push(option)
          }
        }
      })
      
      // Adiciona a última questão
      if (currentQuestion.text && currentOptions.length > 0) {
        newQuestions.push({
          text: currentQuestion.text,
          options: currentOptions,
          correctAnswer: currentQuestion.correctAnswer ?? 0,
          order: newQuestions.length
        })
      }

      if (newQuestions.length > 0) {
        setQuestions(newQuestions)
      }
    } catch (error) {
      console.error('Erro ao processar texto:', error)
      alert('Erro ao processar o texto. Verifique o formato.')
    }
  }

  // Função para carregar arquivo de texto
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      processText(content)
    }
    reader.readAsText(file)
  }

  // Função para processar texto colado
  const handlePaste = (event: React.ClipboardEvent) => {
    const text = event.clipboardData.getData('text')
    processText(text)
    event.preventDefault()
  }

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

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setQuestions(questions.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = initialData?.id 
        ? `/api/quiz/${initialData.id}`
        : '/api/quiz'
      
      const response = await fetch(endpoint, {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          questions
        })
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Erro ao salvar quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <Card className="mb-8">
        <div className="space-y-6">
          <Input
            label="Título do Quiz"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-2 border rounded"
              placeholder="Cole aqui o texto das questões..."
              onPaste={handlePaste}
            />
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Carregar Arquivo
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <AnimatePresence>
          {questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Questão {index + 1}
                  </h3>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <Input
                    label="Pergunta"
                    value={question.text}
                    onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                    required
                  />

                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-3 items-center">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                        required
                      />
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options]
                          newOptions[optionIndex] = e.target.value
                          updateQuestion(index, 'options', newOptions)
                        }}
                        placeholder={`Opção ${optionIndex + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={addQuestion}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Questão
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Quiz'}
          </Button>
        </div>
      </div>
    </form>
  )
}