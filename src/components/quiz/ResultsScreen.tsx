'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, BarChart2 } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Particles } from '@/components/ui/Particles'

export function ResultsScreen() {
  const { score, playerName, currentQuiz } = useQuizStore()
  const [hasBeenSaved, setHasBeenSaved] = useState(false)
  
  // Usando ref para controlar se o salvamento já foi iniciado
  const saveInitiatedRef = useRef(false)
  
  useEffect(() => {
    let isMounted = true
    
    const saveResult = async () => {
      // Verificações para evitar múltiplos salvamentos
      if (!currentQuiz || hasBeenSaved || saveInitiatedRef.current) return
      
      // Marcar que o salvamento foi iniciado antes da requisição
      saveInitiatedRef.current = true
      
      try {
        // Configurar estado como salvo primeiro para evitar múltiplas tentativas
        if (isMounted) setHasBeenSaved(true)
        
        const response = await fetch(`/api/quiz/${currentQuiz.id}/results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            playerName,
            score,
            totalQuestions: currentQuiz.questions.length,
            timestamp: Date.now() // Adiciona timestamp para evitar duplicatas
          })
        })
        
        if (!response.ok) {
          // Se erro, só volta o estado se o componente ainda estiver montado
          if (isMounted) {
            setHasBeenSaved(false)
            saveInitiatedRef.current = false
          }
          throw new Error('Falha ao salvar resultado')
        }
        
        // Mesmo que seja uma resposta de "já salvo", consideramos como sucesso
        console.log('Resultado salvo com sucesso!')
      } catch (error) {
        console.error('Erro ao salvar resultado:', error)
        // Só reverte status se componente ainda estiver montado
        if (isMounted) {
          setHasBeenSaved(false)
          saveInitiatedRef.current = false
        }
      }
    }
    
    // Executar apenas uma vez quando componente montar
    saveResult()
    
    // Cleanup function para quando o componente desmontar
    return () => {
      isMounted = false
    }
  }, [currentQuiz, score, playerName, hasBeenSaved])
  
  if (!currentQuiz) return null
  
  const percentage = Math.round((score / currentQuiz.questions.length) * 100)
  
  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <Particles />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full z-10 relative"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Trophy className="w-12 h-12 text-blue-600" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Resultado
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-600 mb-6"
          >
            Parabéns, {playerName}!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 p-6 rounded-lg mb-6"
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {score} / {currentQuiz.questions.length}
            </div>
            <div className="text-lg text-gray-600">
              {percentage}% de acerto
            </div>
          </motion.div>
          
          <div className="flex flex-col space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href={`/quiz/${currentQuiz.id}/ranking`} className="block">
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition">
                  <BarChart2 className="w-5 h-5" />
                  <span>Ver Ranking</span>
                </button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link href="/" className="block">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition">
                  Voltar para o Início
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}