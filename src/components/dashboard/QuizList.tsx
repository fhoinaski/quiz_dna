'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Edit, BarChart2, Trash2, Eye } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Quiz = {
  id: string
  title: string
  description: string
  _count?: {
    results: number
  }
  createdAt: string
  isPublished: boolean
}

export function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/quiz')
      if (!response.ok) throw new Error('Erro ao carregar quizzes')
      const data = await response.json()
      setQuizzes(data)
      setError('')
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error)
      setError('Erro ao carregar quizzes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return
  
    try {
      const response = await fetch(`/api/quiz/${quizToDelete}`, {
        method: 'DELETE'
      })
  
      const data = await response.json()
  
      if (data.success) {
        setQuizzes(current => current.filter(quiz => quiz.id !== quizToDelete))
      } else {
        throw new Error(data.message || 'Erro ao excluir quiz')
      }
    } catch (error) {
      setError(
        error instanceof Error 
          ? error.message 
          : 'Erro ao excluir quiz'
      )
      fetchQuizzes()
    } finally {
      setIsDeleteModalOpen(false)
      setQuizToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setQuizToDelete(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchQuizzes}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Tentar novamente
        </motion.button>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum quiz encontrado
        </h3>
        <p className="text-gray-500 mb-6">
          Comece criando seu primeiro quiz
        </p>
        {/* <Link href="/dashboard/quiz/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Criar Quiz
          </motion.button>
        </Link> */}
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6">
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {quiz.title}
                </h3>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{quiz._count?.results || 0} participações</span>
                  <span>•</span>
                  <span>Criado em {new Date(quiz.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className={quiz.isPublished ? 'text-green-600' : 'text-yellow-600'}>
                    {quiz.isPublished ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/quiz/${quiz.id}`} target="_blank">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Visualizar Quiz"
                  >
                    <Eye className="h-5 w-5" />
                  </motion.button>
                </Link>

                <Link href={`/dashboard/quiz/${quiz.id}/edit`}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    title="Editar Quiz"
                  >
                    <Edit className="h-5 w-5" />
                  </motion.button>
                </Link>

                <Link href={`/dashboard/results?quizId=${quiz.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Ver Resultados"
                  >
                    <BarChart2 className="h-5 w-5" />
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteClick(quiz.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Excluir Quiz"
                >
                  <Trash2 className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}