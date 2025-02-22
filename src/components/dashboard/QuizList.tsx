'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Edit, BarChart2, Trash2,  AlertTriangle, ExternalLink, Globe, Plus, Share2, Lock } from 'lucide-react'
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

// Definição de tipos com valores padrão
type Quiz = {
  id: string
  title: string
  description: string
  isPublished: boolean
  _count?: {
    results: number
  }
  createdAt: string
}

export function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [copyTooltip, setCopyTooltip] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/quiz')
        
        if (!response.ok) {
          throw new Error('Falha ao carregar quizzes')
        }
        
        const data = await response.json()
        setQuizzes(data)
      } catch (err) {
        console.error('Erro ao carregar quizzes:', err)
        setError('Ocorreu um erro ao carregar os quizzes.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuizzes()
  }, [])

  const handleDeleteQuiz = async () => {
    if (!deleteQuizId) return
    
    try {
      const response = await fetch(`/api/quiz/${deleteQuizId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Falha ao excluir quiz')
      }
      
      // Atualizar a lista removendo o quiz excluído
      setQuizzes(quizzes.filter(quiz => quiz.id !== deleteQuizId))
      
      // Fechar o diálogo
      setShowDeleteDialog(false)
      setDeleteQuizId(null)
    } catch (err) {
      console.error('Erro ao excluir quiz:', err)
      alert('Ocorreu um erro ao excluir o quiz.')
    }
  }

  const handleShare = async (quizId: string) => {
    try {
      const shareUrl = `${window.location.origin}/quiz/${quizId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      // Mostrar tooltip de confirmação
      setCopyTooltip(quizId);
      
      // Esconder após 2 segundos
      setTimeout(() => {
        setCopyTooltip(null);
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      alert('Não foi possível copiar o link. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mb-4">
          <Plus className="w-12 h-12 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum quiz encontrado</h3>
        <p className="text-gray-500 mb-6">Você ainda não criou nenhum quiz.</p>
        <Link href="/dashboard/quiz/create" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Criar novo quiz
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                <div className="flex items-center">
                  {quiz.isPublished ? (
                    <Globe className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{quiz.description}</p>
              <div className="text-xs text-gray-400">
                {quiz._count?.results || 0} {quiz._count?.results === 1 ? 'resposta' : 'respostas'}
              </div>
            </div>
            
            <div className={`p-3 bg-gray-50 grid ${quiz.isPublished ? 'grid-cols-4' : 'grid-cols-3'} gap-1`}>
              <Link 
                href={`/dashboard/quiz/${quiz.id}/edit`}
                className="flex flex-col items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                <Edit className="w-4 h-4 mb-1" />
                <span className="text-xs">Editar</span>
              </Link>
              
              <Link 
                href={`/dashboard/quiz/${quiz.id}/results`}
                className="flex flex-col items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                <BarChart2 className="w-4 h-4 mb-1" />
                <span className="text-xs">Resultados</span>
              </Link>
              
              {quiz.isPublished && (
                <div className="relative">
                  <button 
                    className="w-full flex flex-col items-center p-2 text-gray-600 hover:bg-gray-100 rounded"
                    onClick={() => handleShare(quiz.id)}
                  >
                    <Share2 className="w-4 h-4 mb-1" />
                    <span className="text-xs">Compartilhar</span>
                  </button>
                  
                  {copyTooltip === quiz.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                      Link copiado!
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                </div>
              )}
              
              <button 
                className="flex flex-col items-center p-2 text-red-500 hover:bg-red-50 rounded"
                onClick={() => {
                  setDeleteQuizId(quiz.id)
                  setShowDeleteDialog(true)
                }}
              >
                <Trash2 className="w-4 h-4 mb-1" />
                <span className="text-xs">Excluir</span>
              </button>
            </div>
            
            {quiz.isPublished && (
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex justify-between items-center">
                <div className="text-xs text-blue-700">
                  Quiz publicado
                </div>
                <Link
                  href={`/quiz/${quiz.id}`}
                  target="_blank"
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <span className="mr-1">Visualizar</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita e todos os resultados associados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuiz} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}