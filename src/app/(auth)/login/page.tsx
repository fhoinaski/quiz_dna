'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion} from 'framer-motion'
import { Dna, Zap } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { gsap } from 'gsap'
import { CustomCursor } from '@/components/ui/CustomCursor'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const particlesRef = useRef(null)
  const formRef = useRef(null)
  const logoRef = useRef(null)
 





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

  const handleSubmit = async (e) => {
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
      if (formRef.current) {
        gsap.to(formRef.current, {
          x: -10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(formRef.current, { x: 0 }),
        })
      }
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <>
    <CustomCursor />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Partículas de fundo */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

        {/* Container principal */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', bounce: 0.3 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 border border-gray-100 relative z-10"
          style={{
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.1)'
          }}
        >
          {/* Logo animado */}
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
            Entrar no DNA Quiz
          </motion.h1>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                required
                disabled={loading}
                className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  error ? 'border-red-500' : ''
                }`}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                disabled={loading}
                className={`w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  error ? 'border-red-500' : ''
                }`}
              />
            </motion.div>

            {/* Mensagem de erro */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Botão de submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
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
                    Entrar
                  </div>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Link para registro */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-4 text-center text-gray-600"
          >
            Não tem uma conta?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Registre-se
            </a>
          </motion.p>
        </motion.div>
      </div>
    </>
  )
}