'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ProfileSettings } from '@/components/dashboard/ProfileSettings'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import {
  User,
  Shield,
  Trash2,
  AlertTriangle,
  BarChart2,
  Users as UsersIcon,
  Trophy,
  Clock
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const tabs = [
  { id: 'general', label: 'Geral', icon: User, description: 'Informações básicas e preferências' },
  { id: 'security', label: 'Segurança', icon: Shield, description: 'Senha e autenticação' },
]

interface ProfileStats {
  totalQuizzes: number
  totalParticipants: number
  avgScore: number
  bestScore: number
  lastActive: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalQuizzes: 0,
    totalParticipants: 0,
    avgScore: 0,
    bestScore: 0,
    lastActive: ''
  })
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

  // Fetch de estatísticas
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/profile/stats')
        if (!response.ok) throw new Error('Erro ao carregar estatísticas')
        const data = await response.json()
        setProfileStats(data)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
        // Dados fictícios para demonstração
        setProfileStats({
          totalQuizzes: 5,
          totalParticipants: 120,
          avgScore: 720,
          bestScore: 980,
          lastActive: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const handleDeleteAccount = async () => {
    try {
      // Simulação de exclusão (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowDeleteDialog(false)
      // Redirecionar para logout após exclusão
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Partículas */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Configurações de Perfil
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Gerencie suas preferências e informações pessoais
          </p>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10"
        >
          <StatCard 
            icon={BarChart2} 
            title="Total de Quizzes" 
            value={loading ? '...' : profileStats.totalQuizzes} 
            color="bg-blue-500" 
          />
          <StatCard 
            icon={UsersIcon} 
            title="Participantes" 
            value={loading ? '...' : profileStats.totalParticipants} 
            color="bg-green-500" 
          />
          <StatCard 
            icon={Trophy} 
            title="Melhor Pontuação" 
            value={loading ? '...' : profileStats.bestScore} 
            color="bg-amber-500" 
          />
          <StatCard 
            icon={Clock} 
            title="Última Atividade" 
            value={loading ? '...' : formatDate(profileStats.lastActive)} 
            color="bg-indigo-500" 
          />
        </motion.div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar de Navegação */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1 space-y-4 sm:space-y-6"
          >
            <Card className="bg-white/90 backdrop-blur-md overflow-hidden border border-gray-100 shadow-lg">
              <nav className="divide-y divide-gray-100">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center p-4 transition-colors ${
                        activeTab === tab.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <div className={`mr-3 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-left">
                        <p className={`font-medium ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-700'}`}>
                          {tab.label}
                        </p>
                        <p className="text-sm text-gray-500">{tab.description}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </nav>
            </Card>

            {/* Zona de Perigo */}
            <Card className="p-4 sm:p-5 bg-white/90 backdrop-blur-md border border-red-100 shadow-lg">
              <h3 className="text-red-600 font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Zona de Perigo
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Ações que não podem ser desfeitas
              </p>
              <Button
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Conta
              </Button>
            </Card>
          </motion.div>

          {/* Área Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-3"
          >
            <Card className="p-4 sm:p-6 bg-white/90 backdrop-blur-md border border-gray-100 shadow-lg">
              <ProfileSettings activeTab={activeTab} />
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Diálogo de Confirmação de Exclusão */}
      <AnimatePresence>
        {showDeleteDialog && (
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent className="bg-white/95 backdrop-blur-md border border-gray-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600">Excluir Conta</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão permanentemente removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                >
                  Sim, excluir minha conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, color }) {
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
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </motion.div>
  )
}