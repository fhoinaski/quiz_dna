'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, ArrowLeft } from 'lucide-react'
import { Particles } from '@/components/ui/Particles'

interface Result {
  id: string
  playerName: string
  score: number
  totalQuestions: number
  createdAt: string
}

interface Quiz {
  id: string
  title: string
}

export default function RankingPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const [results, setResults] = useState<Result[]>([])
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Buscar informações do quiz
        const quizResponse = await fetch(`/api/quiz/${quizId}`)
        if (!quizResponse.ok) {
          throw new Error('Falha ao carregar quiz')
        }
        const quizData = await quizResponse.json()
        setQuiz({
          id: quizData.id,
          title: quizData.title
        })
        
        // Buscar os resultados públicos
        const resultsResponse = await fetch(`/api/quiz/${quizId}/results/public`)
        if (!resultsResponse.ok && resultsResponse.status !== 404) {
          throw new Error('Falha ao carregar ranking')
        }
        
        if (resultsResponse.status === 404) {
          setResults([])
        } else {
          // Usando conversão de tipo explícita para os dados da resposta
          const resultsData = (await resultsResponse.json()) as Result[]
          
          // Os resultados já vêm deduplicados da API
          setResults(resultsData)
        }
        
        setError('')
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setError('Não foi possível carregar o ranking. Tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [quizId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Erro
          </h2>
          <p className="text-gray-600 mb-8">
            {error}
          </p>
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">
            Voltar para o Início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white p-4 overflow-hidden">
      <Particles />
      
      <Link href={`/quiz/${quizId}`} className="absolute top-4 left-4 z-10 flex items-center text-gray-600 hover:text-blue-600 transition">
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span>Voltar</span>
      </Link>
      
      <div className="max-w-3xl mx-auto pt-16 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Trophy className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Ranking
          </h1>
          {quiz && (
            <p className="text-lg text-gray-600">
              {quiz.title}
            </p>
          )}
        </motion.div>
        
        {results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">
              Ainda não há resultados para este quiz.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-gray-500 font-medium">Posição</th>
                  <th className="px-6 py-4 text-left text-gray-500 font-medium">Jogador</th>
                  <th className="px-6 py-4 text-right text-gray-500 font-medium">Pontuação</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <motion.tr
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b ${index < 3 ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-2 ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                          }`}>
                            {index + 1}
                          </div>
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center text-gray-500 mr-2">
                            {index + 1}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {result.playerName}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold">
                        {result.score} / {result.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((result.score / result.totalQuestions) * 100)}%
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href={`/quiz/${quizId}`} className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition">
            Jogar Novamente
          </Link>
        </div>
      </div>
    </div>
  )
}