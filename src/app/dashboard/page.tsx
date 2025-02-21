'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { QuizList } from '@/components/dashboard/QuizList'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  
  // Verificar autenticação e localStorage
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated')
    console.log('Dashboard - Estado da sessão:', status)
    console.log('Dashboard - Local storage auth:', isAuth)
    
    if (status === 'unauthenticated' && !isAuth) {
      console.log('Não autenticado no dashboard, redirecionando...')
      window.location.href = '/login'
    } else {
      setIsLoading(false)
    }
  }, [status])
  
  // Mostrar um loader enquanto verifica autenticação
  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="ml-3">Verificando autenticação...</p>
      </div>
    )
  }
  
  // Se chegou aqui, deve estar autenticado
  // Remover o flag do localStorage pois o usuário já está no dashboard
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuthenticated')
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Meus Quizzes</h1>
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Conectado como: {session?.user?.email || 'Usuário'}
          </p>
          <Link href="/dashboard/quiz/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Quiz
            </Button>
          </Link>
        </div>
      </div>

      <QuizList />
    </div>
  )
}