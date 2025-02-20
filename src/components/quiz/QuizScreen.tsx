'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useQuizStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function QuizScreen() {
  const { currentQuiz, currentQuestionIndex, answerQuestion } = useQuizStore()

  if (!currentQuiz) return null

  const currentQuestion = currentQuiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
          <p className="text-right mt-2 text-gray-600">
            Questão {currentQuestionIndex + 1} de {currentQuiz.questions.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <Card>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentQuestion.text}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    onClick={() => answerQuestion(index)}
                    className="w-full justify-start h-auto py-4 text-left"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}