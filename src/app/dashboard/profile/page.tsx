// src/app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProfileSettings } from '@/components/dashboard/ProfileSettings'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import {
  User,
  
  Shield,
  
 
  Trash2,
  BarChart,
  Clock,
  Award,
  AlertTriangle
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
  { 
    id: 'general', 
    label: 'Geral', 
    icon: User,
    description: 'Informações básicas e preferências'
  },
  { 
    id: 'security', 
    label: 'Segurança', 
    icon: Shield,
    description: 'Senha e autenticação'
  },

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
  const [loading, setLoading] = useState(false)
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalQuizzes: 0,
    totalParticipants: 0,
    avgScore: 0,
    bestScore: 0,
    lastActive: ''
  })

  useEffect(() => {
    // Simular carregamento das estatísticas
    const fetchStats = async () => {
      setLoading(true)
      try {
        // TODO: Substituir por chamada real à API
        const response = await fetch('/api/profile/stats')
        const data = await response.json()
        setProfileStats(data)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implementar lógica de exclusão
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowDeleteDialog(false)
      // Redirecionar para logout
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Configurações de Perfil
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas preferências e informações pessoais
          </p>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Quizzes</p>
                <p className="text-xl font-semibold">
                  {loading ? '-' : profileStats.totalQuizzes}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Participantes</p>
                <p className="text-xl font-semibold">
                  {loading ? '-' : profileStats.totalParticipants}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Melhor Pontuação</p>
                <p className="text-xl font-semibold">
                  {loading ? '-' : profileStats.bestScore}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Atividade</p>
                <p className="text-xl font-semibold">
                  {loading ? '-' : new Date(profileStats.lastActive).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Navegação */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="overflow-hidden">
              <nav className="divide-y divide-gray-100">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center p-4 transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`mr-3 ${
                        activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className={`font-medium ${
                          activeTab === tab.id ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {tab.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          {tab.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </Card>

            {/* Zona de Perigo */}
            <Card className="p-4 border-red-100">
              <h3 className="text-red-600 font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Zona de Perigo
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ações que não podem ser desfeitas
              </p>
              <Button
                variant="destructive"
                className="w-full"
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
            className="lg:col-span-3"
          >
            <Card className="p-6">
              <ProfileSettings activeTab={activeTab} />
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita
              e todos os seus dados serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, excluir minha conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}