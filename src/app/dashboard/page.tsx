'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { 
 
  BarChart2, 
  Users, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  BookOpen,
  HelpCircle,
  Trophy
} from 'lucide-react'
import { QuizList } from '@/components/dashboard/QuizList'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { QuickStartGuide } from '@/components/ui/QuickStartGuide'

interface DashboardStats {
  totalQuizzes: number
  totalParticipants: number
  totalResults: number
  bestScore: number
  avgScore: number
  avgTimeSpent: number
  completionRate: number
  lastActive: string
  isLoading: boolean
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuizzes: 0,
    totalParticipants: 0,
    totalResults: 0,
    bestScore: 0,
    avgScore: 0,
    avgTimeSpent: 0,
    completionRate: 0,
    lastActive: '',
    isLoading: true
  })
  const [showGuide, setShowGuide] = useState(false)
  const statsRef = useRef(null)
  const particlesRef = useRef(null)

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

  // Verificar primeira visita
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('quickStartGuideCompleted')
    if (!hasSeenGuide) {
      setShowGuide(true)
    }
  }, [])

  // Buscar estatísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (!response.ok) throw new Error('Falha ao buscar estatísticas')
        const statsData = await response.json()
        setStats({ ...statsData, isLoading: false })
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
        setStats({
          totalQuizzes: 5,
          totalParticipants: 120,
          totalResults: 245,
          bestScore: 980,
          avgScore: 720,
          avgTimeSpent: 3.2,
          completionRate: 87,
          lastActive: new Date().toISOString(),
          isLoading: false
        })
      }
    }
    fetchStats()
  }, [])

  // Animação GSAP para estatísticas
  useEffect(() => {
    if (!stats.isLoading && statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out'
        }
      )
    }
  }, [stats.isLoading])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Partículas */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10"
        >
          {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Dashboard
            </span>
          </h1> */}
          {/* <Link href="/dashboard/quiz/create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 rounded-full shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Criar Novo Quiz
              </Button>
            </motion.div>
          </Link> */}
        </motion.div>

        {/* Estatísticas */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <StatCard title="Total de Quizzes" value={stats.totalQuizzes} icon={BarChart2} color="bg-blue-500" isLoading={stats.isLoading} />
          <StatCard title="Participantes" value={stats.totalParticipants} icon={Users} color="bg-green-500" isLoading={stats.isLoading} />
          <StatCard title="Melhor Pontuação" value={stats.bestScore} icon={Trophy} color="bg-amber-500" isLoading={stats.isLoading} />
          <StatCard title="Total de Resultados" value={stats.totalResults} icon={Award} color="bg-purple-500" isLoading={stats.isLoading} />
          <StatCard title="Taxa de Conclusão" value={`${stats.completionRate}%`} icon={TrendingUp} color="bg-emerald-500" isLoading={stats.isLoading} />
          <StatCard title="Tempo Médio" value={`${stats.avgTimeSpent} min`} icon={Clock} color="bg-orange-500" isLoading={stats.isLoading} />
          <StatCard title="Pontuação Média" value={stats.avgScore} icon={BarChart2} color="bg-red-500" isLoading={stats.isLoading} />
          <StatCard title="Última Atividade" value={formatDate(stats.lastActive)} icon={Calendar} color="bg-indigo-500" isLoading={stats.isLoading} />
        </div>

        {/* Lista de Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 mb-8 sm:mb-10 border border-gray-100"
          whileHover={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)" }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">Meus Quizzes</h2>
          <QuizList />
        </motion.div>

        {/* Informações Adicionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <Card className="p-4 sm:p-5 border border-gray-100 bg-white/90 backdrop-blur-md">
            <div className="flex items-start gap-3 mb-4">
              <motion.div 
                className="p-2 bg-blue-100 rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                <BookOpen className="w-5 h-5 text-blue-600" />
              </motion.div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Instruções Rápidas</h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Crie quizzes interativos e gerencie sessões diretamente do dashboard.
            </p>
            <Button 
              onClick={() => setShowGuide(true)} 
              variant="outline" 
              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Ver Guia
            </Button>
          </Card>

          <Card className="p-4 sm:p-5 border border-gray-100 bg-white/90 backdrop-blur-md">
            <div className="flex items-start gap-3 mb-4">
              <motion.div 
                className="p-2 bg-purple-100 rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                <HelpCircle className="w-5 h-5 text-purple-600" />
              </motion.div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Ajuda</h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Acesse a documentação ou contate o suporte para dúvidas.
            </p>
            <Link href="/dashboard/help">
              <Button variant="outline" className="w-full">Centro de Ajuda</Button>
            </Link>
          </Card>

          <Card className="p-4 sm:p-5 border border-gray-100 bg-white/90 backdrop-blur-md">
            <div className="flex items-start gap-3 mb-4">
              <motion.div 
                className="p-2 bg-green-100 rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                <TrendingUp className="w-5 h-5 text-green-600" />
              </motion.div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Análise</h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Acompanhe o desempenho com gráficos detalhados.
            </p>
            <Link href="/dashboard/results">
              <Button variant="outline" className="w-full">Ver Resultados</Button>
            </Link>
          </Card>
        </motion.div>

        {/* Modal de Guia */}
        {showGuide && <QuickStartGuide onClose={() => setShowGuide(false)} />}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, isLoading }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.1)" }}
      className="p-4 sm:p-5 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <motion.div 
          className={`p-2 sm:p-3 rounded-xl ${color} bg-opacity-15`}
          whileHover={{ scale: 1.1 }}
        >
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace('bg-', 'text-')}`} />
        </motion.div>
        <div>
          <h3 className="text-sm sm:text-base text-gray-600 font-medium">{title}</h3>
          {isLoading ? (
            <div className="h-6 sm:h-7 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">{value}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}