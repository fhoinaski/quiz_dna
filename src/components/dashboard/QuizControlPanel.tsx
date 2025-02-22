'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Play, Pause, RefreshCw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

type QuizControlPanelProps = {
  quizId: string
}

interface SessionStatus {
  exists: boolean
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
  participants: {
    userId: string | null
    name: string
    joined: string
  }[]
}

export function QuizControlPanel({ quizId }: QuizControlPanelProps) {
  const [status, setStatus] = useState<SessionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)
  
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/session`)
      
      if (!response.ok) {
        throw new Error('Falha ao buscar status da sessão')
      }
      
      const data = await response.json()
      setStatus(data)
      setError('')
    } catch (error: any) {
      setError(error.message || 'Erro ao buscar status da sessão')
    } finally {
      setLoading(false)
    }
  }, [quizId])
  
  const startCountdown = useCallback(() => {
    setCountdown(10)
  }, [])

  const handleSessionAction = useCallback(async (action: 'activate' | 'deactivate' | 'reset') => {
    try {
      setActionLoading(true)
      
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      if (!response.ok) {
        throw new Error(`Falha ao ${action === 'activate' ? 'ativar' : action === 'deactivate' ? 'desativar' : 'resetar'} a sessão`)
      }
      
      await fetchStatus()
      setError('')
      
      if (action === 'activate') {
        startCountdown()
      } else {
        setCountdown(null)
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar sessão')
    } finally {
      setActionLoading(false)
    }
  }, [quizId, fetchStatus, startCountdown])
  
  useEffect(() => {
    fetchStatus()
    
    const interval = setInterval(() => {
      fetchStatus()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [fetchStatus])
  
  useEffect(() => {
    if (countdown === null) return
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [countdown])
  
  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return '--'
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }, [])
  
  if (loading && !status) {
    return (
      <Card className="mb-6">
        <div className="p-6">
          <div className="text-center py-10">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent mx-auto"></div>
            <p className="text-sm text-gray-500 mt-3">Carregando status da sessão...</p>
          </div>
        </div>
      </Card>
    )
  }
  
  return (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
            Controle do Quiz
          </h3>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchStatus()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 p-3 rounded-md mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        {status && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Status do Quiz</h4>
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${
                      status.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                  <span className="font-medium">
                    {status.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Participantes</h4>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">{status.participants?.length || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Início</h4>
                <p className="text-sm">{formatDate(status.startsAt)}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Término</h4>
                <p className="text-sm">{formatDate(status.endsAt)}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Lista de Participantes</h4>
              
              {status.participants && status.participants.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-2 text-xs font-medium text-gray-500">Nome</th>
                        <th className="pb-2 text-xs font-medium text-gray-500">Entrada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {status.participants.map((participant, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="py-2 text-sm">{participant.name}</td>
                          <td className="py-2 text-sm text-gray-500">
                            {formatDate(participant.joined)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-2">
                  Nenhum participante ainda
                </p>
              )}
            </div>
            
            {countdown !== null && (
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Iniciando em...
                </h4>
                <div className="text-3xl font-bold text-blue-600">{countdown}</div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 mt-2">
              {!status.isActive ? (
                <Button
                  onClick={() => handleSessionAction('activate')}
                  disabled={actionLoading}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Quiz
                </Button>
              ) : (
                <Button
                  onClick={() => handleSessionAction('deactivate')}
                  disabled={actionLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar Quiz
                </Button>
              )}
              
              <Button
                onClick={() => handleSessionAction('reset')}
                disabled={actionLoading}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resetar Sessão
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}