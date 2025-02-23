'use client'

import { useState,  useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Dna } from 'lucide-react'
import { Input } from '@/components/ui/Input'

import { Card } from '@/components/ui/Card'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'

export default function LoginPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setErrorMessage('Email ou senha inválidos')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setErrorMessage('Erro ao fazer login. Tente novamente.')
      console.error('Login error:', error)
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
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-md shadow-2xl border border-blue-100">
          <motion.div 
            className="p-8"
            variants={itemVariants}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex justify-center mb-6"
            >
              <Dna className="w-16 h-16 text-blue-600" />
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl font-bold text-center mb-6 text-gray-800"
            >
              Bem-vindo ao DNA Vital Quiz
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                      </svg>
                      Carregando...
                    </span>
                  ) : (
                    'Entrar'
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}