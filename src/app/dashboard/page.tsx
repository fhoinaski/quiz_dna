// src/app/dashboard/page.tsx
'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { QuizList } from '@/components/dashboard/QuizList'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">Meus Quizzes</h1>
        <Link href="/dashboard/quiz/create" passHref>
          <Button size="sm" className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Quiz
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <QuizList />
      </div>
      
      {/* Informações adicionais */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">Instruções Rápidas</h2>
          <p className="text-gray-600 text-sm">
            Crie quizzes interativos e compartilhe com seus alunos ou participantes.
            Você pode visualizar todos os resultados em tempo real.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">Estatísticas</h2>
          <div className="flex justify-between">
            <div className="text-center">
              <span className="block text-2xl font-bold text-blue-600">3</span>
              <span className="text-sm text-gray-500">Quizzes</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-green-600">27</span>
              <span className="text-sm text-gray-500">Respostas</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-purple-600">82%</span>
              <span className="text-sm text-gray-500">Média</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-2">Ajuda</h2>
          <p className="text-gray-600 text-sm mb-2">
            Precisa de ajuda para utilizar a plataforma?
          </p>
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Acessar documentação →
          </a>
        </div>
      </div>
    </div>
  )
}