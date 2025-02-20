'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useQuizStore } from '@/store'

export const QuizScreen = () => {
    const { questions, currentQuestionIndex, answerQuestion } = useQuizStore()
    
    // Verificação de segurança
    if (!questions || questions.length === 0 || !questions[currentQuestionIndex]) {
      return (
        <div className="min-h-screen bg-white p-4 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Erro ao carregar as questões
            </h2>
            <p className="text-gray-600">
              Por favor, tente novamente mais tarde.
            </p>
          </div>
        </div>
      )
    }
  
    const currentQuestion = questions[currentQuestionIndex]
  
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
                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                className="bg-blue-600 h-2 rounded-full"
              />
            </div>
            <p className="text-right mt-2 text-gray-600">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>
  
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-lg p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentQuestion.text}
              </h2>
  
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => answerQuestion(index)}
                    className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    )
  }