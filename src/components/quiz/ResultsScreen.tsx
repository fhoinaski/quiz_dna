import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

interface RankingEntry {
  playerName: string
  score: number
  timeBonus: number
  totalScore: number
  position?: number
}

export function ResultsScreen() {
  const { 
    currentQuiz, 
    playerName,
   
  } = useQuizStore()
  
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      if (!currentQuiz?.id) return

      try {
        const response = await fetch(`/api/quiz/${currentQuiz.id}/results/public`)
        if (!response.ok) throw new Error('Falha ao carregar resultados')
        
        const data = await response.json()
        // Processar e ordenar os resultados
        const processedRankings = data
          .map((entry: any) => ({
            playerName: entry.playerName || 'Jogador Anônimo',
            score: entry.score || 0,
            timeBonus: entry.timeBonus || 0,
            totalScore: (entry.score || 0) + (entry.timeBonus || 0)
          }))
          .sort((a: RankingEntry, b: RankingEntry) => b.totalScore - a.totalScore)
          .map((entry: RankingEntry, index: number) => ({
            ...entry,
            position: index + 1
          }))

        setRankings(processedRankings)
      } catch (error) {
        console.error('Erro ao carregar resultados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [currentQuiz?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Ranking Final
          </h2>

          <div className="space-y-4">
            {rankings.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${
                  entry.playerName === playerName
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-500">
                      #{entry.position}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg">{entry.playerName}</h3>
                      <div className="text-sm text-gray-600">
                        Pontuação: {entry.score} 
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {entry.totalScore} pts
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Link href={`/quiz/${currentQuiz?.id}/ranking`} passHref>
          <Button variant="outline" className="gap-2">
            <Trophy className="w-4 h-4" />
            Ver Ranking Completo
          </Button>
        </Link>
        
   
      </div>
    </div>
  )
}