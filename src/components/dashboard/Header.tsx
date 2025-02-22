'use client'

import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { LogOut, Menu, User, Bell, Search } from 'lucide-react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type HeaderProps = {
  user?: {
    name?: string | null
    email?: string | null
  }
  onMenuClick?: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  
  const handleSignOut = async () => {
    try {
      // Limpar localStorage primeiro
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('manual_auth')
      localStorage.removeItem('auth_timestamp')
      
      // Forçar redirecionamento antes do signOut para evitar problemas
      await signOut({
        callbackUrl: '/login',
        redirect: false
      })
      
      // Redirecionar manualmente para garantir
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Redirecionar de qualquer forma
      router.push('/login')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 p-1 rounded-full hover:bg-gray-100 lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-gray-100 w-64 py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Bell className="w-6 h-6 text-gray-600" />
          </button>
          
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <span className="hidden md:inline font-medium">
              {user?.name || 'Usuário'}
            </span>
          </button>
        </div>

        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
          >
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </motion.div>
        )}
      </div>
    </header>
  )
}