// src/hooks/useTimer.ts
import { useState, useEffect, useCallback } from 'react'

interface UseTimerProps {
  initialTime: number // em segundos
  onComplete?: () => void
  autoStart?: boolean
}

export function useTimer({
  initialTime,
  onComplete,
  autoStart = true
}: UseTimerProps) {
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
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(initialTime)
    setIsRunning(false)
    setIsPaused(false)
  }, [initialTime])

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRunning(false)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, onComplete])

  return {
    timeLeft,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    progress: (timeLeft / initialTime) * 100
  }
}



