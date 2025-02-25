'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Edit, BarChart2, Trash2, AlertTriangle, ExternalLink, Globe, Plus, Share2, Lock, Zap } from 'lucide-react'
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
  const containerRef = useRef(null)
 



  // Fetch dos quizzes
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
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
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
        x: -50,
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

  const handleShare = async (quizId) => {
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
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-t-blue-600 border-gray-200 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg font-medium text-gray-600"
        >
          Carregando quizzes...
        </motion.p>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md mx-auto mt-12 p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-gray-100"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <>
   
  
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header fixo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-8 flex justify-end  items-center"
        >
         
          <Link href="/dashboard/quiz/create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Novo Quiz
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Container de quizzes */}
        {quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', bounce: 0.3 }}
            className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-20"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-lg"
            >
              <Plus className="w-10 h-10 text-blue-600" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Nenhum Quiz Encontrado
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-base mb-8"
            >
              Parece que você ainda não criou nenhum quiz. Que tal começar agora?
            </motion.p>
            <Link href="/dashboard/quiz/create">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Criar Novo Quiz
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <AnimatePresence>
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  id={`quiz-${quiz.id}`}
                  className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  style={{ boxShadow: '0 10px 30px rgba(59, 130, 246, 0.1)' }}
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 tracking-tight line-clamp-1">
                        {quiz.title}
                      </h3>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="flex items-center"
                      >
                        {quiz.isPublished ? (
                          <Globe className="w-5 h-5 text-green-600" />
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
                  <div className="p-4 bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-gray-200">
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
                      transition={{ delay: 0.2 }}
                      className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex justify-between items-center"
                    >
                      <span className="text-xs text-blue-700 font-medium">Publicado</span>
                      <Link
                        href={`/quiz/${quiz.id}`}
                        target="_blank"
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
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
          <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-xl bg-white/80 backdrop-blur-md shadow-xl border border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
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
                    className="w-full rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  >
                    Cancelar
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full shadow-lg transition-all duration-300"
                    onClick={handleDeleteQuiz}
                  >
                    Excluir
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}