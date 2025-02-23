// src/hooks/useQuizSession.ts

import { useState, useEffect, useCallback } from 'react'


interface UseQuizSessionOptions {
  quizId: string
  onSessionStart?: () => void
  onSessionEnd?: () => void
}

export function useQuizSession({ quizId, onSessionStart}: UseQuizSessionOptions) {
  const [isActive, setIsActive] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [timeLimit, setTimeLimit] = useState(60)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchSessionStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`)
      if (!response.ok) throw new Error('Falha ao buscar status da sessão')
      
      const data = await response.json()
      setIsActive(data.status === 'active')
      setTimeLimit(data.timeLimit || 60)
      setParticipants(data.participants || [])
    } catch (err) {
      console.error('Erro ao buscar status:', err)
      setError('Falha ao verificar status da sessão')
    }
  }, [quizId])

  const startSession = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'active',
          timeLimit 
        })
      })

      if (!response.ok) throw new Error('Falha ao iniciar sessão')
      
      setIsActive(true)
      onSessionStart?.()
      await fetchSessionStatus()
    } catch (err) {
      console.error('Erro ao iniciar sessão:', err)
      setError('Falha ao iniciar sessão do quiz')
      throw err
    } finally {
      setLoading(false)
    }
  }, [quizId, timeLimit, fetchSessionStatus, onSessionStart])

  const pauseSession = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' })
      })

      if (!response.ok) throw new Error('Falha ao pausar sessão')
      
      setIsActive(false)
      await fetchSessionStatus()
    } catch (err) {
      console.error('Erro ao pausar sessão:', err)
      setError('Falha ao pausar sessão do quiz')
      throw err
    } finally {
      setLoading(false)
    }
  }, [quizId, fetchSessionStatus])

  const updateTimeLimit = useCallback(async (newTimeLimit: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeLimit: newTimeLimit })
      })

      if (!response.ok) throw new Error('Falha ao atualizar tempo limite')
      
      setTimeLimit(newTimeLimit)
      await fetchSessionStatus()
    } catch (err) {
      console.error('Erro ao atualizar tempo:', err)
      setError('Falha ao atualizar tempo limite')
      throw err
    } finally {
      setLoading(false)
    }
  }, [quizId, fetchSessionStatus])

  // Polling para atualizações de status
  useEffect(() => {
    if (!quizId) return

    const interval = setInterval(fetchSessionStatus, 5000)
    fetchSessionStatus()

    return () => clearInterval(interval)
  }, [quizId, fetchSessionStatus])

  return {
    isActive,
    participants,
    timeLimit,
    error,
    loading,
    startSession,
    pauseSession,
    updateTimeLimit
  }
}