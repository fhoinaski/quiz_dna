'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { Dna } from 'lucide-react'
import { useQuizStore } from '@/store'


export const WelcomeScreen = () => {
  const particlesRef = useRef<HTMLDivElement>(null)
  const { setPlayerName, startQuiz, playerName } = useQuizStore()

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (particlesRef.current) {
      const particles = Array.from({ length: 50 }).map(() => {
        const particle = document.createElement('div')
        particle.className = 'absolute w-2 h-2 bg-blue-600 rounded-full opacity-50'
        return particle
      })

      particles.forEach(particle => {
        particlesRef.current?.appendChild(particle)
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        })

        gsap.to(particle, {
          duration: 2 + Math.random() * 2,
          x: '+=' + (Math.random() * 100 - 50),
          y: '+=' + (Math.random() * 100 - 50),
          opacity: 0,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        })
      })
      
      return () => {
        particles.forEach(particle => particle.remove())
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div ref={particlesRef} className="absolute inset-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <Dna size={80} className="text-blue-600" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          DNA Vital Group Quiz
        </h1>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="w-full max-w-md"
        >
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startQuiz}
          disabled={!playerName.trim()}
          className="mt-6 px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Iniciar Desafio
        </motion.button>
      </motion.div>
    </div>
  )
}