'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const particlesRef = useRef<HTMLDivElement>(null)

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
        })
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      console.log('Tentando login com:', { email })

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        console.error('Erro de login:', result.error)
        setErrorMessage('Email ou senha inválidos')
        setLoading(false)
      } else {
        console.log('Login bem-sucedido, redirecionando...')
        // Força redirecionamento programático
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Erro ao processar login:', error)
      setErrorMessage('Ocorreu um erro ao tentar fazer login')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg"
        >
          <div className="flex justify-center mb-6">
            <Dna className="h-12 w-12 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            DNA Vital Quiz
          </h2>
          
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            >
              {errorMessage}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Registre-se
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}