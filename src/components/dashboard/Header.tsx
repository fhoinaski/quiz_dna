'use client'

import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { LogOut, Menu, User, Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type HeaderProps = {
  user?: {
    name?: string | null
    email?: string | null
  }
  onMenuClick?: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const handleSignOut = () => {
    // Limpar localStorage primeiro
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('manual_auth')
    localStorage.removeItem('auth_timestamp')
    
    signOut({
      callbackUrl: '/login',
      redirect: true
    })
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-semibold text-gray-800 hidden md:block">DNA Vital Quiz</h1>
          <h1 className="text-xl font-semibold text-gray-800 md:hidden">DNA Quiz</h1>
        </div>

        {/* Barra de pesquisa - visível apenas em telas médias e maiores */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
              placeholder="Pesquisar quizzes..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notificações */}
          <button className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          {/* Menu do usuário */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={16} className="text-blue-700" />
              </div>
              <span className="hidden md:block text-sm font-medium truncate max-w-[100px]">
                {user?.name || user?.email || 'Usuário'}
              </span>
            </button>
            
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'Usuário'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Perfil
                </a>
                <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configurações
                </a>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Barra de pesquisa móvel - visível apenas em telas pequenas */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
            placeholder="Pesquisar quizzes..."
          />
        </div>
      </div>
    </header>
  )
}