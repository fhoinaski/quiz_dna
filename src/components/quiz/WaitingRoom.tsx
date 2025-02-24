import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Globe,  Timer, AlertCircle } from "lucide-react"
import { useQuizStore } from "@/store"
import { Card } from "@/components/ui/Card"

import { Button } from "@/components/ui/button"
import { useSpring, animated } from "@react-spring/web"
import { AnimatedBackground } from "@/components/ui/AnimatedBackground"

interface ParticipantCardProps {
  name: string
  avatar: string
  index: number
}

const ParticipantCard = ({ name, avatar, index }: ParticipantCardProps) => {
  const animation = useSpring({
    from: { opacity: 0, transform: 'scale(0.8) translateY(20px)' },
    to: { opacity: 1, transform: 'scale(1) translateY(0px)' },
    delay: index * 100
  })

  return (
    <animated.div style={animation}>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3 border border-blue-100">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
          {avatar}
        </div>
        <div>
          <p className="font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">Aguardando início...</p>
        </div>
      </div>
    </animated.div>
  )
}

export function WaitingRoom() {
  const { currentQuiz, setCurrentStep } = useQuizStore()
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [participants, setParticipants] = useState<any[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchSessionStatus = useCallback(async () => {
    if (!currentQuiz?.id) return

    try {
      const response = await fetch(`/api/quiz/${currentQuiz.id}/session`)
      if (!response.ok) throw new Error("Falha ao buscar status da sessão")
      
      const data = await response.json()
      setIsActive(data.isActive)
      setParticipants(data.participants || [])
      setLoading(false)

      if (data.isActive && !countdown) {
        setCountdown(5) // Inicia contagem regressiva
      }
    } catch (error) {
      console.error("Erro ao buscar status:", error)
      setError("Erro ao conectar com a sessão")
      setLoading(false)
    }
  }, [currentQuiz?.id, countdown])

  useEffect(() => {
    fetchSessionStatus()
    const interval = setInterval(fetchSessionStatus, 2000)
    return () => clearInterval(interval)
  }, [fetchSessionStatus])

  useEffect(() => {
    if (countdown === null) return
    
    if (countdown <= 0) {
      setCurrentStep("quiz")
      return
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev !== null ? prev - 1 : null)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, setCurrentStep])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Conectando à sala...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Erro de Conexão</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      <AnimatedBackground variant="quiz" density="medium" speed="normal" />
      
      <div className="relative z-10 max-w-4xl mx-auto p-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {currentQuiz?.title}
          </h1>
          <p className="text-gray-600">
            {isActive ? "O quiz começará em breve!" : "Aguardando início do quiz..."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Participantes
              </h2>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {participants.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              <AnimatePresence>
                {participants.map((participant, index) => (
                  <ParticipantCard
                    key={participant.id || index}
                    name={participant.name}
                    avatar={participant.avatar}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-500" />
                Status da Sala
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isActive ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {isActive ? 'Iniciando' : 'Aguardando'}
              </span>
            </div>

            <div className="space-y-4">
              {countdown !== null && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <span className="text-4xl font-bold text-blue-600">
                      {countdown}
                    </span>
                  </motion.div>
                  <p className="text-gray-600">O quiz começará em breve!</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-blue-500" />
                  Informações do Quiz
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {currentQuiz?.questions?.length || 0} questões</li>
                  <li>• {currentQuiz?.totalTimeLimit || 5} minutos de duração</li>
                  <li>• Pontuação baseada no tempo de resposta</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}