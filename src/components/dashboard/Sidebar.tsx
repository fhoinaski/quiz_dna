'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, PlusCircle, BarChart2, Settings, HelpCircle, User } from 'lucide-react'
import { cn } from '@/utils/cn'

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    href: '/dashboard/quiz/create',
    label: 'Novo Quiz',
    icon: PlusCircle
  },
  {
    href: '/dashboard/results',
    label: 'Resultados',
    icon: BarChart2
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white">
      <div className="py-6 flex-1">
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            MENU PRINCIPAL
          </h2>
          <nav className="mt-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md group relative overflow-hidden transition-all",
                    isActive 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <item.icon className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                  )} />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="px-3 py-2 mt-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            SUPORTE
          </h2>
          <nav className="mt-3 space-y-1">
            <Link
              href="/dashboard/settings"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50 group"
            >
              <Settings className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
              <span className="truncate">Configurações</span>
            </Link>
            <Link
              href="/dashboard/help"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50 group"
            >
              <HelpCircle className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
              <span className="truncate">Ajuda</span>
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Perfil no rodapé da sidebar */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={16} className="text-blue-700" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 truncate">Sua Conta</p>
            <p className="text-xs text-gray-500 truncate">Ver perfil</p>
          </div>
        </div>
      </div>
    </div>
  )
}