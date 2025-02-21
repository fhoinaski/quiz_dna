'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Edit, BarChart2, Trash2, Eye, AlertTriangle, ExternalLink } from 'lucide-react'
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/quiz')
      
      if (!response.ok) {
        throw new Error('Falha ao carregar quizzes')
      }
      
      let data = await response.json()
      
      // Verificar se data é um array
      if (!Array.isArray(data)) {
        console.error('Dados recebidos não são um array:', data)
        data = [] // Forçar para array vazio se não for array
      }
      
      // Garantir que todos os itens tenham as propriedades necessárias
      const safeData = data.map((quiz: any) => ({
        id: quiz.id || '',
        title: quiz.title || 'Sem título',
        description: quiz.description || 'Sem descrição',
        isPublished: Boolean(quiz.isPublished),
        _count: {
          results: quiz._count?.results || 0
        },
        createdAt: quiz.createdAt || new Date().toISOString()
      }))
      
      setQuizzes(safeData)
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error)
      setError('Não foi possível carregar os quizzes. Tente novamente mais tarde.')
      setQuizzes([]) // Garantir que quizzes seja um array vazio em caso de erro
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return

    try {
      const response = await fetch(`/api/quiz/${quizToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Falha ao excluir quiz')
      }

      // Atualiza a lista removendo o quiz excluído
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizToDelete))
    } catch (error) {
      console.error('Erro ao excluir quiz:', error)
      setError('Não foi possível excluir o quiz. Tente novamente mais tarde.')
    } finally {
      setQuizToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">Ocorreu um problema</h3>
          <p className="text-sm text-yellow-700 mt-1">{error}</p>
          <button 
            onClick={fetchQuizzes}
            className="mt-2 text-xs font-medium text-yellow-800 hover:text-yellow-900"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
          <AlertTriangle className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum Quiz Encontrado</h3>
        <p className="text-gray-500 mb-4">Você ainda não criou nenhum quiz.</p>
        <Link href="/dashboard/quiz/create">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Criar meu primeiro quiz
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o quiz
              e todas as respostas associadas a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Versão Mobile (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                  {quiz.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  quiz.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {quiz.isPublished ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {quiz.description}
              </p>
              
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <span className="flex items-center">
                  <BarChart2 className="h-3.5 w-3.5 mr-1" />
                  {quiz._count?.results || 0} respostas
                </span>
                <span className="mx-2">•</span>
                <span>
                  Criado em {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Link href={`/dashboard/quiz/${quiz.id}/edit`}>
                    <button 
                      className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Editar quiz"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href={`/dashboard/quiz/${quiz.id}/results`}>
                    <button 
                      className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      title="Ver resultados"
                    >
                      <BarChart2 className="h-4 w-4" />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDeleteClick(quiz.id)}
                    className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="Excluir quiz"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <Link 
                  href={`/quiz/${quiz.id}`} 
                  target="_blank"
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full ${
                    quiz.isPublished 
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => !quiz.isPublished && e.preventDefault()}
                  title={quiz.isPublished ? "Visualizar quiz" : "Quiz não publicado"}
                >
                  <Eye className="h-3 w-3" />
                  <span className="text-xs font-medium">Visualizar</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Versão para tablet e desktop (Grid de cards) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {quiz.title}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  quiz.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {quiz.isPublished ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 h-[3em]">
                {quiz.description}
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  {quiz._count?.results || 0} respostas
                </span>
                <span>
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Link href={`/dashboard/quiz/${quiz.id}/edit`}>
                    <button 
                      className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center"
                      title="Editar quiz"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Editar</span>
                    </button>
                  </Link>
                  <Link href={`/dashboard/quiz/${quiz.id}/results`}>
                    <button 
                      className="p-2 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors flex items-center"
                      title="Ver resultados"
                    >
                      <BarChart2 className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Resultados</span>
                    </button>
                  </Link>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDeleteClick(quiz.id)}
                    className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="Excluir quiz"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <Link 
                    href={`/quiz/${quiz.id}`} 
                    target="_blank"
                    className={`p-2 rounded-md ${
                      quiz.isPublished 
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => !quiz.isPublished && e.preventDefault()}
                    title={quiz.isPublished ? "Visualizar quiz" : "Quiz não publicado"}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Versão de tabela para telas muito grandes (opcional) */}
      <div className="hidden xl:block mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quiz
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Respostas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <motion.tr 
                key={quiz.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[300px]">{quiz.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    quiz.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {quiz.isPublished ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {quiz._count?.results || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <Link href={`/dashboard/quiz/${quiz.id}/edit`}>
                      <button className="flex items-center text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4 mr-1" />
                        <span>Editar</span>
                      </button>
                    </Link>
                    <Link href={`/dashboard/quiz/${quiz.id}/results`}>
                      <button className="flex items-center text-green-600 hover:text-green-900">
                        <BarChart2 className="h-4 w-4 mr-1" />
                        <span>Resultados</span>
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDeleteClick(quiz.id)}
                      className="flex items-center text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span>Excluir</span>
                    </button>
                    <Link 
                      href={`/quiz/${quiz.id}`} 
                      target="_blank"
                      className={`flex items-center ${
                        quiz.isPublished 
                          ? 'text-gray-600 hover:text-gray-900' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => !quiz.isPublished && e.preventDefault()}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <span>Visualizar</span>
                    </Link>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}