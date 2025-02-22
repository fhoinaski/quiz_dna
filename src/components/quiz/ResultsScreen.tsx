'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Button } from '@/components/ui/button'

export function ResultsScreen() {
  const { score, playerName, playerAvatar, currentQuiz } = useQuizStore()

  useEffect(() => {
    // Aqui você pode salvar o resultado na API, se desejar
  }, [])

  if (!currentQuiz) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white p-4 flex items-center justify-center"
    >
      <div className="text-center">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Parabéns, {playerName}!</h1>
        <span className="text-4xl">{playerAvatar}</span>
        <p className="text-xl mb-6">Sua pontuação: {score}</p>
        <Link href="/dashboard">
          <Button>Voltar ao Dashboard</Button>
        </Link>
      </div>
    </motion.div>
  )
}