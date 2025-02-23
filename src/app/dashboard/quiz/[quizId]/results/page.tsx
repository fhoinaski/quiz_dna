"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Result {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

interface Quiz {
  id: string;
  title: string;
}

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  const [results, setResults] = useState<Result[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResults = useCallback(async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/quiz/${quizId}/results`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao carregar resultados");
      }
      
      const data = await response.json();
      
      // Validar estrutura dos dados
      if (!data.quiz || !data.results || !Array.isArray(data.results)) {
        throw new Error("Formato de dados inválido");
      }

      // Validar e formatar os resultados
      const validResults = data.results.filter((result: any) => {
        return (
          result &&
          typeof result.id === 'string' &&
          typeof result.playerName === 'string' &&
          typeof result.score === 'number' &&
          typeof result.totalQuestions === 'number' &&
          typeof result.createdAt === 'string'
        );
      });

      setQuiz(data.quiz);
      setResults(validResults);
    } catch (err: any) {
      const errorMessage = err.message || "Erro desconhecido";
      setError(errorMessage);
      if (errorMessage === "Não autorizado") {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [quizId, router]);

  const handleDeleteResults = async () => {
    if (!quizId) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/quiz/${quizId}/results`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao zerar resultados");
      }

      setResults([]);
    } catch (err: any) {
      setError(err.message || "Erro ao zerar resultados");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      fetchResults();
    }
  }, [quizId, fetchResults]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Resultados: {quiz?.title || "Carregando..."}
            </h1>
          </div>
          {results.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Zerar Resultados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja zerar todos os resultados deste
                    quiz? Essa ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteResults}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Zerar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </motion.div>

        {/* Estado de Carregamento */}
        {loading && (
          <Card className="p-6 flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </Card>
        )}

        {/* Erro */}
        <AnimatePresence>
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <Card className="p-6 bg-red-50 border-red-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-red-800">
                      Erro
                    </h2>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resultados */}
        {!loading && !error && quiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 sm:p-6">
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Nenhum resultado encontrado para este quiz.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">
                          Posição
                        </th>
                        <th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">
                          Jogador
                        </th>
                        <th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">
                          Pontuação
                        </th>
                        <th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr
                          key={result.id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <td className="py-3 px-2 sm:px-4 flex items-center gap-2">
                            {index < 3 ? (
                              <Trophy
                                className={`w-5 h-5 ${
                                  index === 0
                                    ? "text-yellow-500"
                                    : index === 1
                                    ? "text-gray-400"
                                    : "text-amber-600"
                                }`}
                              />
                            ) : null}
                            {index + 1}º
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-gray-800">
                            {result.playerName}
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-gray-800">
                            {result.score}/{result.totalQuestions}
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-gray-600 text-sm">
                            {new Date(result.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}