// src/app/dashboard/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  
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
      setSidebarOpen(window.innerWidth >= 768)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Toggle para sidebar em dispositivos móveis
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }
  
  // Função de logout corrigida
  const handleLogout = async () => {
    try {
      // Limpar localStorage primeiro
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('manual_auth')
      localStorage.removeItem('auth_timestamp')
      
      // Fazer logout via NextAuth
      await signOut({ 
        redirect: false 
      })
      
      // Forçar redirecionamento completo
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Redirecionar mesmo em caso de erro
      window.location.href = '/login'
    }
  }
  
  // Mostrar loader enquanto verifica autenticação
  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="ml-3">Verificando autenticação...</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header responsivo */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-semibold text-gray-800">DNA Vital Quiz</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-gray-600">
              {session?.user?.email || 'Usuário'}
            </span>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar responsiva */}
        <div 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0
            fixed lg:static left-0 top-16 h-[calc(100vh-4rem)] z-20
            w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          `}
        >
          <Sidebar />
        </div>
        
        {/* Overlay para fechar sidebar em dispositivos móveis */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Conteúdo principal - children será o conteúdo de page.tsx */}
        <main className={`flex-1 p-4 md:p-6 overflow-auto transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}