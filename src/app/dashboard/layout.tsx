'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Menu, X, Dna } from 'lucide-react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const particlesRef = useRef(null)
  const logoRef = useRef(null)

  // Verificar autenticação
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') || localStorage.getItem('manual_auth')
    const checkAuth = () => {
      if (status === 'unauthenticated' && !isAuth) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }
    const timer = setTimeout(checkAuth, 500)
    return () => clearTimeout(timer)
  }, [status, router])

  // Detectar tamanho da tela para sidebar responsiva
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024) // lg: breakpoint
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Partículas de fundo
  useEffect(() => {
    if (!particlesRef.current) return

    const particleCount = window.innerWidth < 768 ? 15 : 30
    const particles = Array.from({ length: particleCount }).map(() => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-blue-500/30 rounded-full'
      particlesRef.current.appendChild(particle)
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
        x: `+=${Math.random() * 60 - 30}`,
        y: `+=${Math.random() * 60 - 30}`,
        opacity: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    return () => particles.forEach((particle) => particle.remove())
  }, [])

  // Animação do logo
  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      })
    }
  }, [])

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  const handleLogout = async () => {
    try {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('manual_auth')
      localStorage.removeItem('auth_timestamp')
      await signOut({ redirect: false })
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      window.location.href = '/login'
    }
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-t-blue-600 border-gray-300 rounded-full"
        />
        <p className="ml-4 text-gray-700 text-lg">Verificando autenticação...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col relative overflow-hidden">
      {/* Partículas */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 shadow-sm"
      >
        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none lg:hidden"
              aria-label="Toggle sidebar"
            >
              <motion.div animate={{ rotate: sidebarOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </button>
            <div className="flex items-center gap-2">
              <motion.div ref={logoRef} className="flex items-center">
                <Dna className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </motion.div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  DNA Quiz
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline text-sm sm:text-base text-gray-600 truncate max-w-[200px]">
              {session?.user?.email || 'Usuário'}
            </span>
            <Button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-1.5 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md"
              aria-label="Sair da sessão"
            >
              Sair
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-lg lg:shadow-none z-20"
            >
              <Sidebar />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay para mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black lg:hidden z-10"
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>

        {/* Conteúdo principal */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}