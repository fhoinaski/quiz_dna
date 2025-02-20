'use client'

import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type HeaderProps = {
  user?: {
    name?: string | null
    email?: string | null
  }
  onMenuClick?: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const handleSignOut = () => {
    signOut({
      callbackUrl: '/login', // Specify the redirect URL after signing out
      redirect: true
    })
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-800">DNA Vital Quiz</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </motion.button>
        </div>
      </div>
    </header>
  )
}