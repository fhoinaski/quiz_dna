'use client'

import { useState,  useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Dna } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'

import { AnimatedBackground } from '@/components/ui/AnimatedBackground'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1 
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    const { name, email, password, confirmPassword } = formData

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar conta')
      }

      router.push('/login?registered=true')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setErrorMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4 overflow-hidden relative">
      <AnimatedBackground 
        variant="quiz" 
        density="medium" 
        speed="normal" 
        interactive={true} 
        className="z-0"
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        ref={containerRef}
        className="relative z-10 w-full max-w-lg"
      >
        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-blue-100 p-8"
          variants={itemVariants}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex justify-center mb-6"
          >
            <Dna size={80} className="text-blue-600" />
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-8 text-gray-800"
          >
            Junte-se ao DNA Vital Quiz
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <Input
                label="Nome"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="bg-gray-50 text-gray-800 placeholder-gray-400 border-blue-200 focus:ring-blue-400"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="bg-gray-50 text-gray-800 placeholder-gray-400 border-blue-200 focus:ring-blue-400"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Senha"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                disabled={loading}
                className="bg-gray-50 text-gray-800 placeholder-gray-400 border-blue-200 focus:ring-blue-400"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Confirmar Senha"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={6}
                disabled={loading}
                className="bg-gray-50 text-gray-800 placeholder-gray-400 border-blue-200 focus:ring-blue-400"
              />
            </motion.div>

            <AnimatePresence>
              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm text-center"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              {/* Substituindo Button por motion.button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                    </svg>
                    Criando conta...
                  </span>
                ) : (
                  'Criar conta'
                )}
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Já tem uma conta? Faça login
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}