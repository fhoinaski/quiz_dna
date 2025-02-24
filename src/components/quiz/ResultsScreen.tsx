import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Trophy, Crown, Medal, Award, Share2,  RefreshCw } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import confetti from 'canvas-confetti'
import { useSpring, animated } from '@react-spring/web'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/ui/Toast'

interface RankingEntry {
  playerName: string
  score: number
  timeBonus: number
  totalScore: number
  position?: number
  avatar?: string
}

const ScoreAnimation = ({ value }: { value: number }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 }
  })

  return (
    <animated.span>
      {number.to((n) => Math.floor(n).toLocaleString())}
    </animated.span>
  )
}

const RankingCard = ({ entry, index, isCurrentPlayer }: { 
  entry: RankingEntry
  index: number 
  isCurrentPlayer: boolean
}) => {
  const isTopThree = index < 3
  const icons = [Crown, Medal, Award]
  const colors = [
    'text-yellow-500 bg-yellow-100',
    'text-gray-500 bg-gray-100',
    'text-amber-500 bg-amber-100'
  ]

  const IconComponent = isTopThree ? icons[index] : Trophy
  const colorClass = isTopThree ? colors[index] : 'text-blue-500 bg-blue-100'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <Card 
        className={`bg-white/90 backdrop-blur-sm p-4 transform transition-all hover:scale-102 hover:shadow-lg
          ${isCurrentPlayer ? 'border-2 border-blue-400' : ''}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center`}>
            <IconComponent className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">
                {entry.playerName}
                {isCurrentPlayer && (
                  <span className="ml-2 text-sm text-blue-600">(Você)</span>
                )}
              </h3>
              {entry.avatar && (
                <span className="text-2xl">{entry.avatar}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Pontuação: {entry.score}</span>
              {entry.timeBonus > 0 && (
                <span className="text-green-600">+{entry.timeBonus} (bônus)</span>
              )}
            </div>
          </div>

          <div className="text-2xl font-bold text-gray-800">
            #{index + 1}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const StatsCard = ({ title, value, icon: Icon, color }: {
  title: string
  value: number | string
  icon: any
  color: string
}) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            <ScoreAnimation value={typeof value === 'number' ? value : parseInt(value)} />
          </p>
        </div>
      </div>
    </Card>
  )
}

export function ResultsScreen() {
  const { currentQuiz, playerName} = useQuizStore()
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [playerRank, setPlayerRank] = useState<number | null>(null)
  const { toast, showToast, hideToast } = useToast()

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347']
    })
  }, [])

  useEffect(() => {
    if (loading) return
    
    const playerPosition = rankings.findIndex(r => r.playerName === playerName)
    if (playerPosition < 3) {
      triggerConfetti()
      
      const messages = [
        '🏆 Parabéns! Você está no topo do ranking!',
        '🥈 Incrível! Você conquistou a segunda posição!',
        '🥉 Muito bem! Você está entre os três melhores!'
      ]
      showToast(messages[playerPosition], 'success')
    }
  }, [loading, rankings, playerName, showToast, triggerConfetti])

  const fetchResults = useCallback(async () => {
    if (!currentQuiz?.id) return

    try {
      const response = await fetch(`/api/quiz/${currentQuiz.id}/results/public`)
      if (!response.ok) throw new Error('Falha ao carregar resultados')
      
      const data = await response.json()
      const processedRankings = data
        .map((entry: any) => ({
          playerName: entry.playerName || 'Anônimo',
          score: entry.score || 0,
          timeBonus: entry.timeBonus || 0,
          totalScore: (entry.score || 0) + (entry.timeBonus || 0),
          avatar: entry.playerAvatar
        }))
        .sort((a: RankingEntry, b: RankingEntry) => b.totalScore - a.totalScore)
        .map((entry: RankingEntry, index: number) => ({
          ...entry,
          position: index + 1
        }))

      setRankings(processedRankings)
      
      const playerRankPosition = processedRankings.findIndex(
        (r: RankingEntry) => r.playerName === playerName
      )
      setPlayerRank(playerRankPosition + 1)
    } catch (error) {
      console.error('Erro ao carregar resultados:', error)
      showToast('Erro ao carregar resultados', 'error')
    } finally {
      setLoading(false)
    }
  }, [currentQuiz?.id, playerName, showToast])

  useEffect(() => {
    fetchResults()
    const interval = setInterval(fetchResults, 5000)
    return () => clearInterval(interval)
  }, [fetchResults])

  const playerStats = rankings.find(r => r.playerName === playerName) || {
    score: 0,
    timeBonus: 0,
    totalScore: 0
  }

  const shareResults = async () => {
    const text = `🏆 Completei o quiz "${currentQuiz?.title}" com ${playerStats.totalScore} pontos! (${playerStats.score} pontos + ${playerStats.timeBonus} bônus)${playerRank ? ` #${playerRank}` : ''}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu resultado no Quiz',
          text: text,
          url: window.location.href
        })
        showToast('Resultado compartilhado com sucesso!', 'success')
      } catch (err) {
        if (err.name !== 'AbortError') {
          showToast('Erro ao compartilhar resultado', 'error')
        }
      }
    } else {
      navigator.clipboard.writeText(text)
        .then(() => {
          showToast('Resultado copiado para a área de transferência!', 'success')
        })
        .catch(() => {
          showToast('Erro ao copiar resultado', 'error')
        })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Calculando resultados...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      <AnimatedBackground variant="celebration" density="high" speed="normal" />
      
      <div className="relative z-10 max-w-5xl mx-auto p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Quiz Finalizado!
          </h1>
          <p className="text-xl text-gray-600">
            {currentQuiz?.title}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            title="Sua Pontuação"
            value={playerStats.score}
            icon={Trophy}
            color="bg-yellow-100 text-yellow-600"
          />
          <StatsCard
            title="Bônus de Tempo"
            value={playerStats.timeBonus}
            icon={Award}
            color="bg-green-100 text-green-600"
          />
          <StatsCard
            title="Sua Posição"
            value={playerRank || '-'}
            icon={Medal}
            color="bg-blue-100 text-blue-600"
          />
        </div>

        <Card className="bg-white/90 backdrop-blur-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Ranking
            </h2>
            <Button
              onClick={shareResults}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {rankings.map((entry, index) => (
                <RankingCard
                  key={`${entry.playerName}-${index}`}
                  entry={entry}
                  index={index}
                  isCurrentPlayer={entry.playerName === playerName}
                />
              ))}
            </AnimatePresence>
          </div>
        </Card>

      
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}