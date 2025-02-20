'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, PlusCircle, BarChart2 } from 'lucide-react'
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
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                      isActive 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="w-1 h-full bg-blue-600 absolute right-0"
                        initial={false}
                      />
                    )}
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}