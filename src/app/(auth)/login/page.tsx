'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { gsap } from 'gsap'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Credenciais inválidas')
      // Efeito de shake no formulário
      if (formRef.current) {
        gsap.to(formRef.current, {
          x: -10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(formRef.current!, { x: 0 }),
        })
      }
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  // Efeito de partículas
  useEffect(() => {
    if (!particlesRef.current) return

    const particleCount = window.innerWidth < 768 ? 20 : 50
    const particles = Array.from({ length: particleCount }).map(() => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-primary-light rounded-full opacity-30'
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
        duration: 3 + Math.random() * 2,
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 100 - 50}`,
        opacity: 0.1 + Math.random() * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    return () => {
      particles.forEach((particle) => particle.remove())
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Container das partículas */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      <motion.div
        ref={formRef}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.3 }}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200 relative z-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex justify-center mb-6"
        >
          <Dna className="w-12 h-12 text-primary" />
        </motion.div>

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Bem-vindo ao DNA Vital Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
            disabled={loading}
            className={`border-gray-300 focus:ring-primary ${
              error ? 'border-error animate-pulse' : ''
            }`}
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            disabled={loading}
            className={`border-gray-300 focus:ring-primary ${
              error ? 'border-error animate-pulse' : ''
            }`}
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-error text-sm text-center"
              role="alert"
            >
              {error}
            </motion.p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary hover:bg-primary-dark text-white"
            aria-label="Entrar no sistema"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-t-white border-gray-300 rounded-full"
              />
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}