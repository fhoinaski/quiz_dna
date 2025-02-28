import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { useQuizStore } from "@/store"

import { Clock, Trophy, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

import confetti from 'canvas-confetti'
import { useSpring, animated } from '@react-spring/web'
import { gsap } from 'gsap'

const QuestionCard = ({ question, onAnswer, selectedOption, isDisabled }: {
  question: { text: string; options: string[]; correctAnswer: number }
  onAnswer: (index: number) => void
  selectedOption: number | null
  isDisabled: boolean
}) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    }),
    exit: { opacity: 0, y: -20 }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      <motion.h2 
        variants={variants}
        className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 leading-tight"
      >
        {question.text}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            variants={variants}
            custom={index}
            whileHover={!isDisabled ? { scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            onClick={() => !isDisabled && onAnswer(index)}
            disabled={isDisabled}
            className={`
              relative overflow-hidden p-6 rounded-xl text-left transition-all option-${index}
              ${selectedOption === index 
                ? 'bg-blue-50 border-2 border-blue-400' 
                : 'bg-white border-2 border-gray-100 hover:border-blue-200'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold
                ${selectedOption === index ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
              `}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1 text-lg">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

const Timer = ({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) => {
  const isWarning = timeLeft <= 5000
  const progress = (timeLeft / totalTime) * 100

  const { width } = useSpring({
    from: { width: "100%" },
    to: { width: `${progress}%` },
    config: { duration: 100 }
  })

  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <animated.div
        style={{ width }}
        className={`absolute left-0 top-0 h-full rounded-full transition-colors duration-300
          ${isWarning ? 'bg-red-500' : 'bg-blue-500'}`}
      />
    </div>
  )
}

export function QuizScreen() {
  const router = useRouter()
  const {
    currentQuiz,
    currentQuestionIndex,
    answerQuestion,
    timeLimit,
    answers,
    finishQuiz,
    currentStep
  } = useQuizStore()

  const [timeLeft, setTimeLeft] = useState<number>(timeLimit * 1000)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [startTime, setStartTime] = useState<number>(0)
  const [isFinished, setIsFinished] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex]
  const totalTimeLimitMs = timeLimit * 1000

  useEffect(() => {
    if (!currentQuiz?.id || !currentQuiz.questions || currentQuiz.questions.length === 0) {
      router.push("/dashboard")
      return
    }

    setTimeLeft(totalTimeLimitMs)
    setStartTime(Date.now())
    setIsLoading(false)

    gsap.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out"
    })
  }, [currentQuiz, router, totalTimeLimitMs])

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4CAF50', '#2196F3', '#FFC107']
    })
  }, [])

  const handleAnswer = useCallback((optionIndex: number) => {
    if (showFeedback || !currentQuiz?.id || !currentQuestion || isFinished) return

    const timeElapsed = (Date.now() - startTime) / 1000
    const correct = optionIndex === currentQuestion.correctAnswer

    setIsCorrect(correct)
    setShowFeedback(true)
    setSelectedOption(optionIndex)

    if (correct) {
      triggerConfetti()
    }

    gsap.to(`.option-${optionIndex}`, {
      scale: 1.05,
      duration: 0.4,
      ease: "elastic.out(1, 0.3)",
      yoyo: true,
      repeat: 1
    })

    setTimeout(() => {
      answerQuestion(currentQuiz.id, currentQuestionIndex, optionIndex, timeElapsed)
      setShowFeedback(false)
      setSelectedOption(null)

      if (currentQuestionIndex + 1 >= currentQuiz.questions.length) {
        const finalAnswers = [
          ...answers,
          { questionIndex: currentQuestionIndex, selectedAnswer: optionIndex, timeToAnswer: timeElapsed * 1000 }
        ]
        setIsFinished(true)
        finishQuiz(currentQuiz.id, finalAnswers)
      } else {
        setStartTime(Date.now())
      }
    }, 2000)
  }, [
    currentQuestion,
    currentQuiz,
    currentQuestionIndex,
    answerQuestion,
    showFeedback,
    startTime,
    answers,
    finishQuiz,
    isFinished,
    triggerConfetti
  ])

  useEffect(() => {
    if (isFinished || currentStep !== "quiz" || showFeedback || timeLeft <= 0 || isLoading || !currentQuiz?.id) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 10
        if (newTime <= 0) {
          clearInterval(timer)
          setIsFinished(true)
          finishQuiz(currentQuiz.id, answers)
          return 0
        }
        return newTime
      })
    }, 10)

    return () => clearInterval(timer)
  }, [showFeedback, timeLeft, isLoading, currentQuiz, answers, finishQuiz, isFinished, currentStep])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"
          />
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium text-gray-700"
          >
            Preparando seu desafio...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
              <Clock className={`w-6 h-6 ${timeLeft <= 5000 ? 'text-red-500' : 'text-blue-500'}`} />
              <span className="text-xl font-medium">
                {(timeLeft / 1000).toFixed(1)}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-xl font-medium">
                Questão {currentQuestionIndex + 1} de {currentQuiz?.questions.length}
              </span>
            </div>
          </div>

          <Timer
            timeLeft={timeLeft}
            totalTime={totalTimeLimitMs}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestionIndex}
              question={currentQuestion}
              onAnswer={handleAnswer}
              selectedOption={selectedOption}
              isDisabled={showFeedback}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                mt-6 p-6 rounded-xl shadow-lg backdrop-blur-sm
                ${isCorrect ? 'bg-green-50/90 border-green-200' : 'bg-red-50/90 border-red-200'}
                border-2
              `}
            >
              <div className="flex items-center justify-center gap-4">
                {isCorrect ? (
                  <Check className="w-8 h-8 text-green-500" />
                ) : (
                  <X className="w-8 h-8 text-red-500" />
                )}
                <span className="text-xl font-semibold">
                  {isCorrect ? 'Correto!' : 'Incorreto!'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}