'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useQuizStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

export function QuizScreen() {
  const {
    currentQuiz,
    currentQuestionIndex,
    answerQuestion,
    // playerName,
    // questionStartTime,
  } = useQuizStore()
  const [timeLeft, setTimeLeft] = useState(1000) // Contagem de 1000 a 0
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex]

  // Memoizando a função handleAnswer para evitar recriações a cada renderização
  const handleAnswer = useCallback((optionIndex: number) => {
    const bonusPoints = Math.floor(timeLeft / 10) // Mais rápido = mais pontos (máximo 100)
    answerQuestion(optionIndex, bonusPoints)
    setSelectedOption(null)
  }, [timeLeft, answerQuestion])

  // Contagem regressiva
  useEffect(() => {
    if (!currentQuestion) return
    setTimeLeft(1000) // Reinicia para 1000 a cada nova pergunta
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleAnswer(selectedOption ?? 0) // Responde automaticamente com 0 se o tempo acabar
          return 0
        }
        return prev - 1
      })
    }, 10) // 10ms para uma contagem mais suave
    return () => clearInterval(interval)
  }, [currentQuestionIndex, currentQuestion, handleAnswer, selectedOption])

  if (!currentQuiz?.questions || !currentQuestion) {
    return <div>Erro ao carregar as questões</div>
  }

  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Pergunta {currentQuestionIndex + 1}</h2>
            <div className="flex items-center text-blue-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>{timeLeft}</span>
            </div>
          </div>
          <p className="text-lg mb-6">{currentQuestion.text}</p>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedOption === index ? 'default' : 'outline'}
                  className="w-full text-left justify-start"
                  onClick={() => {
                    setSelectedOption(index)
                    handleAnswer(index)
                  }}
                  disabled={timeLeft <= 0}
                >
                  {option}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}