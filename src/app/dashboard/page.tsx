'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { QuizList } from '@/components/dashboard/QuizList'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Meus Quizzes</h1>
        <Link href="/dashboard/quiz/create">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-md whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Quiz
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-4 md:p-6"
      >
        <QuizList />
      </motion.div>

      {/* Informações adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Instruções Rápidas</h2>
          <p className="text-gray-600 text-sm">
            Crie quizzes interativos e gerencie sessões diretamente do dashboard. Inicie ou pare quizzes com um clique!
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Ajuda</h2>
          <p className="text-gray-600 text-sm mb-3">
            Precisa de ajuda para utilizar a plataforma?
          </p>
          <Link href="/dashboard/documentation" className="text-blue-600 text-sm hover:underline">
            Acessar documentação →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}