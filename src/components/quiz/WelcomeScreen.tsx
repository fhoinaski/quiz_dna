'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Particles } from '@/components/ui/Particles'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'

// Lista de avatares (usando emojis como exemplo; você pode substituir por URLs de imagens)
const avatars = ['🧑‍🚀', '🐱', '🦁', '🐸', '🦄', '🤖', '🐼', '🦊']

export function WelcomeScreen() {
  const { currentQuiz, playerName, setPlayerName, startQuiz } = useQuizStore()
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)

  // Escolher avatar aleatório ao montar o componente
  useEffect(() => {
    if (!selectedAvatar) {
      setSelectedAvatar(avatars[Math.floor(Math.random() * avatars.length)])
    }
  }, [selectedAvatar])

  // Iniciar contagem regressiva quando o nome for inserido
  useEffect(() => {
    if (playerName.trim() && countdown === null) {
      setCountdown(5) // 5 segundos para começar automaticamente
    }
  }, [playerName, countdown])

  // Lógica da contagem regressiva
  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      if (countdown === 0 && playerName.trim()) startQuiz()
      return
    }
    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown, playerName, startQuiz])

  if (!currentQuiz) return null

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <Particles />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg text-center"
      >
        <Dna className="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <h1 className="text-2xl font-bold mb-4">{currentQuiz.title}</h1>
        <p className="text-gray-600 mb-6">{currentQuiz.description}</p>

        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl mr-4">{selectedAvatar}</span>
          <Input
            placeholder="Digite seu nome"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {countdown !== null && (
          <motion.p
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-xl font-semibold text-blue-600"
          >
            O quiz começa em {countdown}...
          </motion.p>
        )}

        <Button
          onClick={() => {
            if (playerName.trim()) startQuiz()
          }}
          disabled={!playerName.trim()}
          className="mt-4"
        >
          Pular Contagem
        </Button>
      </motion.div>
    </div>
  )
}