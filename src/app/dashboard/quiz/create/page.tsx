'use client'


import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { QuizForm } from '@/components/dashboard/QuizForm'

export default function CreateQuizPage() {
  // const router = useRouter()

  // Dados iniciais para um novo quiz (explicitamente definindo isPublished como false)
  const initialData = {
    title: '',
    description: '',
    questions: [
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        order: 0
      }
    ],
    isPublished: false // definido explicitamente como false para um novo quiz
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para o Dashboard
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-6">Criar Novo Quiz</h1>
        
        <QuizForm initialData={initialData} />
      </motion.div>
    </div>
  )
}