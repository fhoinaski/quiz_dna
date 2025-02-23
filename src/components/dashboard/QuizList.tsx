'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Edit, BarChart2, Trash2, AlertTriangle, ExternalLink, Globe, Plus, Share2, Lock, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

type Quiz = {
  id: string
  title: string
  description: string
  isPublished: boolean
  _count?: { results: number }
  createdAt: string
}

export function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [copyTooltip, setCopyTooltip] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/quiz')
        if (!response.ok) throw new Error('Falha ao carregar quizzes')
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

  // Animação GSAP para entrada dos cards
  useEffect(() => {
    if (!loading && quizzes.length > 0 && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    }
  }, [loading, quizzes])

  const handleDeleteQuiz = async () => {
    if (!deleteQuizId) return
    const quizElement = document.getElementById(`quiz-${deleteQuizId}`)
    if (quizElement) {
      await gsap.to(quizElement, {
        opacity: 0,
        x: -30,
        duration: 0.4,
        ease: 'power2.in',
      })
    }
    try {
      const response = await fetch(`/api/quiz/${deleteQuizId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Falha ao excluir quiz')
      setQuizzes(quizzes.filter((quiz) => quiz.id !== deleteQuizId))
      setShowDeleteDialog(false)
      setDeleteQuizId(null)
    } catch (err) {
      console.error('Erro ao excluir quiz:', err)
      setError('Ocorreu um erro ao excluir o quiz.')
    }
  }

  const handleShare = async (quizId: string) => {
    try {
      const shareUrl = `${window.location.origin}/quiz/${quizId}`
      await navigator.clipboard.writeText(shareUrl)
      setCopyTooltip(quizId)
      setTimeout(() => setCopyTooltip(null), 2000)
    } catch (err) {
      console.error('Erro ao copiar link:', err)
      setError('Não foi possível copiar o link.')
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-600">Carregando quizzes...</p>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className="max-w-md mx-auto mt-12 p-6 bg-red-50 rounded-xl shadow-md"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
      {quizzes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center"
        >
          <Plus className="w-16 h-16 text-gray-300 mb-6" />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
            Nenhum quiz encontrado
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-md">
            Parece que você ainda não criou nenhum quiz. Comece agora!
          </p>
          <Link href="/dashboard/quiz/create">
            <Button
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Novo Quiz
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <AnimatePresence>
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                id={`quiz-${quiz.id}`}
                className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 tracking-tight line-clamp-1">
                      {quiz.title}
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center"
                    >
                      {quiz.isPublished ? (
                        <Globe className="w-5 h-5 text-green-500" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                    </motion.div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{quiz.description}</p>
                  <div className="text-xs text-gray-500">
                    {quiz._count?.results || 0} {quiz._count?.results === 1 ? 'resposta' : 'respostas'}
                  </div>
                </div>
                <div
                  className={`p-3 bg-gray-50 grid ${quiz.isPublished ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'} gap-2 border-t border-gray-200`}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex flex-col items-center gap-1 text-blue-600 hover:bg-blue-50 w-full py-2"
                    >
                      <Link href={`/dashboard/quiz/${quiz.id}/edit`}>
                        <Edit className="w-4 h-4" />
                        <span className="text-xs">Editar</span>
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex flex-col items-center gap-1 text-indigo-600 hover:bg-indigo-50 w-full py-2"
                    >
                      <Link href={`/dashboard/quiz/${quiz.id}/results`}>
                        <BarChart2 className="w-4 h-4" />
                        <span className="text-xs">Resultados</span>
                      </Link>
                    </Button>
                  </motion.div>
                  {quiz.isPublished && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(quiz.id)}
                        className="flex flex-col items-center gap-1 text-green-600 hover:bg-green-50 w-full py-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs">Compartilhar</span>
                      </Button>
                      <AnimatePresence>
                        {copyTooltip === quiz.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg shadow-md"
                          >
                            Link copiado!
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteQuizId(quiz.id)
                        setShowDeleteDialog(true)
                      }}
                      className="flex flex-col items-center gap-1 text-red-600 hover:bg-red-50 w-full py-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-xs">Excluir</span>
                    </Button>
                  </motion.div>
                </div>
                {quiz.isPublished && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 py-2 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center"
                  >
                    <span className="text-xs text-indigo-700 font-medium">Publicado</span>
                    <Link
                      href={`/quiz/${quiz.id}`}
                      target="_blank"
                      className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span className="mr-1">Visualizar</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </motion.div>
                )}
              </Card>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-xl bg-white shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                Excluir Quiz?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-sm">
                Tem certeza que deseja excluir este quiz? Todos os resultados associados serão perdidos e esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
              <AlertDialogCancel asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1 })}
                >
                  Cancelar
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-all duration-200"
                  onClick={handleDeleteQuiz}
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1 })}
                >
                  Excluir
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}