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
import type { QuizWithResultCount } from "@/types"

export function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizWithResultCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/quiz')
      
      if (!response.ok) {
        throw new Error('Falha ao carregar quizzes')
      }
      
      const data = await response.json()
      setQuizzes(data)
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error)
      setError('Não foi possível carregar seus quizzes. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!quizToDelete) return

    try {
      const response = await fetch(`/api/quiz/${quizToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Falha ao excluir quiz')
      }

      // Remove o quiz da lista
      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizToDelete))
    } catch (error) {
      console.error('Erro ao excluir quiz:', error)
      setError('Não foi possível excluir o quiz. Tente novamente mais tarde.')
    } finally {
      setIsDeleteDialogOpen(false)
      setQuizToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchQuizzes}
          className="mt-2 text-blue-600 hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center p-6 bg-blue-50 rounded-lg">
        <p className="text-gray-600">Você ainda não tem nenhum quiz.</p>
        <p className="mt-2">
          <Link href="/dashboard/quiz/create" className="text-blue-600 hover:underline">
            Crie seu primeiro quiz agora
          </Link>
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 truncate">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{quiz.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    quiz.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {quiz.isPublished ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                
                <span className="text-sm text-gray-500 flex items-center">
                  <BarChart2 className="w-4 h-4 mr-1" />
                  {quiz._count.results} respostas
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between">
              <div className="space-x-2">
                <Link href={`/dashboard/quiz/${quiz.id}/edit`}>
                  <button className="p-1 text-gray-600 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </Link>
                
                <Link href={`/dashboard/results?quizId=${quiz.id}`}>
                  <button className="p-1 text-gray-600 hover:text-blue-600">
                    <BarChart2 className="w-4 h-4" />
                  </button>
                </Link>
                
                <button 
                  onClick={() => handleDeleteClick(quiz.id)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <Link 
                href={`/quiz/${quiz.id}`} 
                target="_blank"
                className={`flex items-center space-x-1 text-sm ${
                  quiz.isPublished ? "text-blue-600 hover:text-blue-800" : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={(e) => !quiz.isPublished && e.preventDefault()}
              >
                <Eye className="w-4 h-4" />
                <span>Visualizar</span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja excluir este quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os dados relacionados a este quiz serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}