// src/components/ui/Timer.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface TimerProps {
  duration: number // in seconds
  onComplete?: () => void
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'warning' | 'danger'
}

export function Timer({
  duration,
  onComplete,
  className = '',
  showIcon = true,
  size = 'md',
  
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(true)

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

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

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const getVariantClasses = () => {
    const percentage = (timeLeft / duration) * 100
    if (percentage <= 25) return 'text-red-600 bg-red-100'
    if (percentage <= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-blue-600 bg-blue-100'
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showIcon && (
        <Clock className={`${sizeClasses[size]} ${
          timeLeft <= duration * 0.25 ? 'text-red-600' :
          timeLeft <= duration * 0.5 ? 'text-yellow-600' :
          'text-blue-600'
        }`} />
      )}
      
      <div className="relative rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-0 ${getVariantClasses()}`}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: timeLeft / duration }}
          transition={{ duration: 1 }}
        />
        
        <span className={`relative px-3 py-1 ${sizeClasses[size]} font-medium`}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  )
}