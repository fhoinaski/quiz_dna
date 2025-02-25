'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence} from 'framer-motion'
import { Dna, Zap } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { gsap } from 'gsap'
import { CustomCursor } from '@/components/ui/CustomCursor'

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
  const containerRef = useRef(null)
  const logoRef = useRef(null)
 
  const particlesRef = useRef(null)





  // Efeito de rotação do logo
  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      })
    }
  }, [])

  // Efeito de partículas
  useEffect(() => {
    if (!particlesRef.current) return

    const particleCount = window.innerWidth < 768 ? 15 : 30
    const particles = Array.from({ length: particleCount }).map(() => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-blue-500/30 rounded-full blur-sm'
      particlesRef.current?.appendChild(particle)
      return particle
    })

    particles.forEach((particle) => {
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      })

      gsap.to(particle, {
        duration: 5 + Math.random() * 3,
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 100 - 50}`,
        opacity: 0.1 + Math.random() * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    return () => particles.forEach((particle) => particle.remove())
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    const { name, email, password, confirmPassword } = formData

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem')
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          x: -10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(containerRef.current, { x: 0 }),
        })
      }
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setErrorMessage(errorMessage)
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          x: -10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(containerRef.current, { x: 0 }),
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <CustomCursor />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Partículas */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
        
        {/* Fundo animado */}
        <AnimatedBackground 
          variant="quiz" 
          density="medium" 
          speed="normal" 
          interactive={true} 
          className="absolute inset-0 z-0"
        />

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', bounce: 0.3 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div 
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 p-8"
            style={{ boxShadow: '0 10px 30px rgba(59, 130, 246, 0.1)' }}
          >
            {/* Logo */}
            <motion.div
              ref={logoRef}
              className="flex justify-center mb-8"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-lg">
                <Dna className="w-10 h-10 text-blue-600" />
              </div>
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Junte-se ao DNA Quiz
            </motion.h1>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Input
                  label="Nome"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Input
                  label="Senha"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Input
                  label="Confirmar Senha"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  disabled={loading}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </motion.div>

              {/* Mensagem de erro */}
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

              {/* Botão */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-t-white border-gray-300 rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Criar Conta
                    </div>
                  )}
                </Button>
              </motion.div>

              {/* Link para login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center"
              >
                <Link 
                  href="/login" 
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Já tem uma conta? Faça login
                </Link>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  )
}