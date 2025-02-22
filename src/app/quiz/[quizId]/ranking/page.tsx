'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, ArrowLeft, AlertTriangle, Globe, Eye } from 'lucide-react'
import { Particles } from '@/components/ui/Particles'
import { Button } from '@/components/ui/button'

interface Result {
  id: string
  playerName: string
  score: number
  totalQuestions: number
  createdAt: string
}

interface Quiz {
  id: string
  title: string
}

export default function RankingPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.quizId as string
  const [results, setResults] = useState<Result[]>([])
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isQuizPrivate, setIsQuizPrivate] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Buscar informações do quiz
        console.log(`Buscando informações do quiz ${quizId}...`);
        const quizResponse = await fetch(`/api/quiz/${quizId}/public`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });
        
        console.log(`Status da resposta do quiz: ${quizResponse.status}`);
        
        if (quizResponse.status === 404) {
          console.error(`Quiz não encontrado ou não está público: ${quizResponse.status}`);
          setIsQuizPrivate(true);
          throw new Error("Este quiz não está disponível publicamente. Se você é o proprietário, torne-o público nas configurações.");
        } else if (!quizResponse.ok) {
          console.error(`Erro ao carregar quiz: ${quizResponse.status}`);
          // Tentar ler o corpo da resposta para obter detalhes do erro
          try {
            const errorData = await quizResponse.json();
            console.error('Detalhes do erro:', errorData);
          } catch  {
            console.error('Não foi possível ler detalhes do erro');
          }
          throw new Error(`Erro ao carregar o quiz. Código: ${quizResponse.status}`);
        }
        
        const quizData = await quizResponse.json();
        console.log('Quiz carregado:', quizData);
        setQuiz(quizData);
        
        // Buscar resultados do quiz
        console.log(`Buscando resultados do quiz ${quizId}...`);
        const resultsResponse = await fetch(`/api/quiz/${quizId}/results/public`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });
        
        console.log(`Status da resposta dos resultados: ${resultsResponse.status}`);
        
        // Mesmo se a resposta não for ok, tentamos processar como array vazio
        let resultsData = [];
        
        if (resultsResponse.ok) {
          try {
            const data = await resultsResponse.json();
            resultsData = Array.isArray(data) ? data : [];
            console.log(`Resultados carregados: ${resultsData.length}`);
          } catch (jsonError) {
            console.error('Erro ao processar JSON dos resultados:', jsonError);
          }
        } else {
          console.warn(`Aviso: Não foi possível carregar resultados. Status: ${resultsResponse.status}`);
        }
        
        // Ordenar por pontuação (descendente) e depois por data (mais recente primeiro)
        const sortedResults = [...resultsData].sort((a, b) => {
          if (b.score === a.score) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return b.score - a.score;
        });
        
        setResults(sortedResults);
      } catch (err: any) {
        console.error('Erro ao carregar ranking:', err);
        setError(err.message || 'Ocorreu um erro ao carregar o ranking');
      } finally {
        setLoading(false);
      }
    };
    
    if (quizId) {
      fetchData();
    }
  }, [quizId]);

  const getPositionBadge = (position: number) => {
    if (position === 0) {
      return (
        <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 text-white rounded-full">
          <Trophy className="w-4 h-4" />
        </div>
      );
    } else if (position === 1) {
      return (
        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-400 text-white rounded-full">
          2º
        </div>
      );
    } else if (position === 2) {
      return (
        <div className="inline-flex items-center justify-center w-8 h-8 bg-amber-700 text-white rounded-full">
          3º
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-full">
          {position + 1}º
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isQuizPrivate) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-yellow-600 mr-2" />
              <h2 className="text-xl font-semibold text-yellow-800">Quiz Privado</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Este quiz não está disponível publicamente. Se você é o proprietário, você pode torná-lo público nas configurações.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline" 
                className="inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ir para o Dashboard
              </Button>
              
              <Button 
                onClick={() => router.push(`/dashboard/quiz/${quizId}/edit`)}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Editar Este Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-red-800">Erro</h2>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-gray-600 mb-4">
              Este quiz pode não estar disponível publicamente ou pode ter sido removido.
            </p>
            <div className="mt-4">
              <Button 
                onClick={() => router.push('/')}
                variant="outline" 
                className="inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para a página inicial
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">Quiz não encontrado</h2>
            <p className="text-gray-600 mb-4">
              Este quiz pode não estar disponível publicamente ou pode ter sido removido.
            </p>
            <div className="mt-4">
              <Button 
                onClick={() => router.push('/')}
                variant="outline" 
                className="inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para a página inicial
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white p-4">
      <Particles />
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="mb-6">
          <Link href={`/quiz/${quizId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para o Quiz
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">
            {quiz?.title || 'Ranking de Resultados'}
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Veja como você se compara com os outros participantes
          </p>
          
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posição
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pontuação
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <motion.tr
                      key={`${result.id || index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPositionBadge(index)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {result.playerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.score}/{result.totalQuestions} 
                          <span className="ml-1 text-gray-500">
                            ({Math.round((result.score / result.totalQuestions) * 100)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">Ainda não há participantes neste quiz.</p>
              <p className="text-gray-600">Seja o primeiro a participar!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}