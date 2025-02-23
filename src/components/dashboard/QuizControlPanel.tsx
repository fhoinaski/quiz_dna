'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Play, Pause, RefreshCw, AlertTriangle, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type QuizControlPanelProps = {
  quizId: string
}

interface Participant {
  userId: string | null
  name: string
  avatar: string
  joined: string
}

interface SessionStatus {
  exists: boolean
  isActive: boolean
  participants: Participant[]
}

export function QuizControlPanel({ quizId }: QuizControlPanelProps) {
  const [status, setStatus] = useState<SessionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'start' | 'stop' | 'reset'>('start')
  const [showParticipants, setShowParticipants] = useState(true)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [quizDuration, setQuizDuration] = useState(300)
  const [customDuration, setCustomDuration] = useState('5')

  // Defina handleAutoStop primeiro, sem dependências
  const handleAutoStop = useCallback(async () => {
    if (!quizId) return

    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      })
      
      if (!response.ok) throw new Error('Erro ao parar automaticamente')
      
      localStorage.removeItem(`quiz_${quizId}_startTime`)
      localStorage.removeItem(`quiz_${quizId}_duration`)
      setTimeLeft(null)
      
      // Atualize o status após parar
      const newStatusResponse = await fetch(`/api/quiz/${quizId}/session`, { cache: 'no-store' })
      if (newStatusResponse.ok) {
        const newStatus = await newStatusResponse.json()
        setStatus(newStatus)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao parar automaticamente')
      console.error('Erro ao parar automaticamente:', err)
    }
  }, [quizId])

  // Agora fetchStatus pode usar handleAutoStop
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/session`, { cache: 'no-store' })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao carregar status da sessão')
      }
      
      const data = await response.json()
      setStatus(data)
      setError('')
      
      if (data.isActive && localStorage.getItem(`quiz_${quizId}_startTime`)) {
        const startTime = new Date(localStorage.getItem(`quiz_${quizId}_startTime`)!).getTime()
        const storedDuration = parseInt(localStorage.getItem(`quiz_${quizId}_duration`) || '300')
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = storedDuration - elapsed
        
        if (remaining > 0) {
          setTimeLeft(remaining)
          setQuizDuration(storedDuration)
        } else {
          setTimeLeft(0)
          await handleAutoStop()
        }
      } else {
        setTimeLeft(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar status')
      console.error('Erro ao buscar status:', err)
    } finally {
      setLoading(false)
    }
  }, [quizId, handleAutoStop])

  // Efeitos atualizados com todas as dependências necessárias
  useEffect(() => {
    fetchStatus()
    const fetchInterval = setInterval(fetchStatus, 5000)
    return () => clearInterval(fetchInterval)
  }, [fetchStatus])

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null

    if (status?.isActive && timeLeft !== null && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            handleAutoStop()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [status?.isActive, timeLeft, handleAutoStop])

  // Resto do código permanece o mesmo...
  const handleAction = (action: 'start' | 'stop' | 'reset') => {
    if (action === 'start') {
      const duration = parseInt(customDuration)
      if (isNaN(duration) || duration <= 0) {
        setError('Por favor, insira uma duração válida em minutos')
        return
      }
      setQuizDuration(duration * 60)
    }
    setConfirmAction(action)
    setShowConfirmDialog(true)
  }

  const confirmActionExecute = async () => {
    setShowConfirmDialog(false)
    setActionLoading(true)
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: confirmAction,
          duration: confirmAction === 'start' ? quizDuration : undefined 
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao executar ação')
      }
      
      await fetchStatus()
      
      if (confirmAction === 'start') {
        localStorage.setItem(`quiz_${quizId}_startTime`, new Date().toISOString())
        localStorage.setItem(`quiz_${quizId}_duration`, quizDuration.toString())
        setTimeLeft(quizDuration)
      } else if (confirmAction === 'stop' || confirmAction === 'reset') {
        setTimeLeft(null)
        localStorage.removeItem(`quiz_${quizId}_startTime`)
        localStorage.removeItem(`quiz_${quizId}_duration`)
      }
      
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao executar ação')
      console.error('Erro ao executar ação:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCustomDuration(value)
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Controle do Quiz
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStatus}
            disabled={loading}
            className="text-indigo-600 hover:text-indigo-700"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-md rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ) : error ? (
              <div className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Estado</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status?.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                {status?.isActive && timeLeft !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-500" /> Tempo Restante
                    </span>
                    <span className="font-semibold text-indigo-600">{formatTime(timeLeft)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" /> Participantes
                  </span>
                  <span className="font-semibold text-gray-800">{status?.participants.length || 0}</span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-md rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Controles</h3>
            <div className="space-y-3">
              {!status?.isActive && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração do Quiz (minutos)
                  </label>
                  <Input
                    type="number"
                    value={customDuration}
                    onChange={handleDurationChange}
                    min="1"
                    max="60"
                    className="w-full"
                    placeholder="Digite a duração em minutos"
                  />
                </div>
              )}
              <Button
                onClick={() => handleAction(status?.isActive ? 'stop' : 'start')}
                disabled={actionLoading || loading}
                variant={status?.isActive ? 'destructive' : 'default'}
                className={`w-full ${
                  status?.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white rounded-full shadow-md`}
              >
                {actionLoading && confirmAction === (status?.isActive ? 'stop' : 'start') ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executando...
                  </span>
                ) : status?.isActive ? (
                  <><Pause className="w-4 h-4 mr-2" /> Parar Sessão</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" /> Iniciar Sessão</>
                )}
              </Button>
              <Button
                onClick={() => handleAction('reset')}
                disabled={actionLoading || loading}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full shadow-md"
              >
                {actionLoading && confirmAction === 'reset' ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executando...
                  </span>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Resetar Sessão</>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {status?.participants.length > 0 && (
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-md rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Participantes ({status.participants.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowParticipants(!showParticipants)}
                className="text-gray-600 hover:text-gray-800 border-gray-300 rounded-full"
              >
                {showParticipants ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            <AnimatePresence>
              {showParticipants && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {status.participants.map((participant, index) => (
                    <motion.div
                      key={participant.userId || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-2xl">{participant.avatar}</div>
                      <div>
                        <p className="font-medium text-gray-800">{participant.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(participant.joined).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md rounded-xl bg-white shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-gray-800">
                Confirmar Ação
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-sm">
                {confirmAction === 'start' && (
                  <>Deseja iniciar uma nova sessão do quiz com duração de {customDuration} minutos?</>
                )}
                {confirmAction === 'stop' && 'Deseja encerrar a sessão atual? A pontuação será salva.'}
                {confirmAction === 'reset' && (
                  <span className="text-red-600">Deseja resetar a sessão? Isso removerá todos os participantes e pontuações.</span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
              <AlertDialogCancel asChild disabled={actionLoading}>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Cancelar
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild disabled={actionLoading}>
                <Button
                  onClick={confirmActionExecute}
                  className={`w-full rounded-full shadow-md transition-all duration-200 ${
                    confirmAction === 'reset'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white`}
                >
                  Confirmar
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-xl shadow-xl flex items-center gap-2 z-50"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
            <button onClick={() => setError('')} className="ml-2 hover:text-gray-200">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}