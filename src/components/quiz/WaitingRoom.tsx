'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from 'gsap'
import { Users, Globe, Timer, AlertCircle } from "lucide-react"
import { useQuizStore } from "@/store"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/components/ui/AnimatedBackground"

interface ParticipantCardProps {
  name: string
  avatar: string
  index: number
}

const ParticipantCard = ({ name, avatar, index }: ParticipantCardProps) => {
  const cardRef = useRef(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: index * 0.1, ease: "power3.out" }
      )
    }
  }, [index])

  return (
    <motion.div 
      ref={cardRef}
      whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.2)" }}
      className="bg-white/90 backdrop-blur-md rounded-lg p-4 flex items-center gap-3 border border-blue-100 shadow-md"
    >
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium text-blue-600">
        {avatar}
      </div>
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">Aguardando início...</p>
      </div>
    </motion.div>
  )
}

export function WaitingRoom() {
  const { currentQuiz, setCurrentStep } = useQuizStore()
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [participants, setParticipants] = useState<any[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const particlesRef = useRef(null)
  const countdownRef = useRef(null)

  // Fetch de status da sessão
  const fetchSessionStatus = useCallback(async () => {
    if (!currentQuiz?.id) return

    try {
      const response = await fetch(`/api/quiz/${currentQuiz.id}/session`)
      if (!response.ok) throw new Error("Falha ao buscar status da sessão")
      
      const data = await response.json()
      setIsActive(data.isActive)
      setParticipants(data.participants || [])
      setLoading(false)

      if (data.isActive && countdown === null) {
        setCountdown(5) // Inicia contagem regressiva
      }
    } catch (error) {
      console.error("Erro ao buscar status:", error)
      setError("Erro ao conectar com a sessão")
      setLoading(false)
    }
  }, [currentQuiz?.id, countdown])

  // Partículas de fundo
  useEffect(() => {
    if (!particlesRef.current) return

    const particleCount = window.innerWidth < 768 ? 15 : 30
    const particles = Array.from({ length: particleCount }).map(() => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-blue-500/30 rounded-full'
      particlesRef.current.appendChild(particle)
      return particle
    })

    particles.forEach((particle) => {
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      })

      gsap.to(particle, {
        duration: 5 + Math.random() * 3,
        x: `+=${Math.random() * 60 - 30}`,
        y: `+=${Math.random() * 60 - 30}`,
        opacity: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    return () => particles.forEach((particle) => particle.remove())
  }, [])

  // Atualização de status e contagem regressiva
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
      if (countdownRef.current && countdown > 0) {
        gsap.to(countdownRef.current, {
          scale: 1.2,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, setCurrentStep])

  // Efeitos de loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        <AnimatedBackground variant="quiz" density="medium" speed="slow" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-700 font-medium text-lg sm:text-xl">Conectando à sala...</p>
        </motion.div>
      </div>
    )
  }

  // Tela de erro
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 relative overflow-hidden">
        <AnimatedBackground variant="error" density="low" speed="slow" />
        <Card className="p-6 sm:p-8 max-w-md w-full bg-white/90 backdrop-blur-md shadow-xl border border-red-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Erro de Conexão</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-full shadow-md"
            >
              Tentar Novamente
            </Button>
          </motion.div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      <AnimatedBackground variant="quiz" density="medium" speed="normal" />
      
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-8 sm:pt-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {currentQuiz?.title}
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            {isActive ? "O quiz começará em breve!" : "Aguardando início do quiz..."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Participantes */}
          <Card className="bg-white/90 backdrop-blur-md p-4 sm:p-6 shadow-lg border border-blue-100">
            <motion.div 
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                Participantes
              </h2>
              <motion.span 
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.1 }}
              >
                {participants.length}
              </motion.span>
            </motion.div>

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

          {/* Status da Sala */}
          <Card className="bg-white/90 backdrop-blur-md p-4 sm:p-6 shadow-lg border border-blue-100">
            <motion.div 
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                Status da Sala
              </h2>
              <motion.span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isActive ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}
                animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
              >
                {isActive ? 'Iniciando' : 'Aguardando'}
              </motion.span>
            </motion.div>

            <div className="space-y-4">
              {countdown !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="text-center py-6 sm:py-8"
                >
                  <motion.div
                    ref={countdownRef}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 shadow-md"
                  >
                    <span className="text-3xl sm:text-4xl font-bold text-blue-600">{countdown}</span>
                  </motion.div>
                  <p className="text-gray-600 text-sm sm:text-base">O quiz começará em breve!</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-blue-500" />
                  Informações do Quiz
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• {currentQuiz?.questions?.length || 0} questões</li>
                  <li>• {currentQuiz?.totalTimeLimit || 5} minutos de duração</li>
                  <li>• Pontuação baseada no tempo</li>
                </ul>
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}