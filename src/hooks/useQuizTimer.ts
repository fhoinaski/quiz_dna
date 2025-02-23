import { useState, useEffect, useCallback } from 'react'

interface QuizTimerOptions {
  initialTime: number // em segundos
  onTimeUp?: () => void
  autoStart?: boolean
}

export const useQuizTimer = ({
  initialTime,
  onTimeUp,
  autoStart = true,
}: QuizTimerOptions) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isPaused, setIsPaused] = useState(false)

  const start = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    if (isPaused) {
      setIsRunning(true)
      setIsPaused(false)
    }
  }, [isPaused])

  const reset = useCallback(() => {
    setTimeLeft(initialTime)
    setIsRunning(autoStart)
    setIsPaused(false)
  }, [initialTime, autoStart])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval)
          onTimeUp?.()
          return 0
        }
        return prev - 0.1 // Atualização a cada 100ms
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, onTimeUp])

  return { timeLeft, isRunning, isPaused, start, pause, resume, reset }
}