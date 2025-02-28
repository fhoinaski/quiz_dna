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
  CheckCircle,
  Clock,
  Award,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Result {
  id: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
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
      if (!data.quiz || !data.results || !Array.isArray(data.results)) {
        throw new Error("Formato de dados inválido");
      }

      const validResults = data.results.filter(
        (result: any) =>
          result &&
          typeof result.id === "string" &&
          typeof result.playerName === "string" &&
          typeof result.score === "number" &&
          typeof result.correctAnswers === "number" &&
          typeof result.totalQuestions === "number" &&
          typeof result.timeSpent === "number" &&
          typeof result.createdAt === "string"
      );

      setQuiz(data.quiz);
      setResults(validResults);
    } catch (err: any) {
      const errorMessage = err.message || "Erro desconhecido";
      setError(errorMessage);
      if (errorMessage === "Não autorizado") router.push("/login");
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
      setError(""); // Limpa erro anterior, se houver
    } catch (err: any) {
      setError(err.message || "Erro ao zerar resultados");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (quizId) fetchResults();
  }, [quizId, fetchResults]);

  if (loading && results.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <span className="text-gray-700 text-lg font-medium">Carregando resultados...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Resultados: {quiz?.title || "Carregando..."}
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            {results.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Zerar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white rounded-lg shadow-xl max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-700">Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      Todos os resultados deste quiz serão apagados permanentemente. Deseja prosseguir?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex justify-end gap-2">
                    <AlertDialogCancel className="hover:bg-gray-100">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteResults} className="bg-red-600 hover:bg-red-700">
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </motion.div>

        {/* Mensagem de Erro */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="p-4 bg-red-50 border-red-200 shadow-md">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                  <div>
                    <h2 className="text-lg font-semibold text-red-800">Erro</h2>
                    <p className="text-red-600 text-sm">{error}</p>
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
            transition={{ duration: 0.6 }}
          >
            <Card className="p-4 sm:p-6 bg-white shadow-lg rounded-xl">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-700 text-lg font-medium">Nenhum resultado ainda</p>
                    <p className="text-gray-500 text-sm mt-2">Convide jogadores para participar!</p>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pódio (apenas em telas médias e grandes) */}
                  {results.length >= 3 && (
                    <div className="hidden sm:grid sm:grid-cols-3 gap-4 mb-8">
                      {[1, 0, 2].map((pos, idx) => {
                        const result = results[pos];
                        if (!result) return null;
                        return (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            className={`p-4 rounded-lg shadow-md ${
                              pos === 0
                                ? "bg-yellow-50 border-yellow-200"
                                : pos === 1
                                ? "bg-gray-100 border-gray-200"
                                : "bg-amber-50 border-amber-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Trophy
                                className={`w-6 h-6 ${
                                  pos === 0 ? "text-yellow-500" : pos === 1 ? "text-gray-400" : "text-amber-600"
                                }`}
                              />
                              <div>
                                <p className="font-semibold text-gray-800 text-base">
                                  {pos + 1}º - {result.playerName}
                                </p>
                                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    {result.correctAnswers}/{result.totalQuestions}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {result.timeSpent.toFixed(1)}s
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mt-1">
                                  {result.score} pts
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Tabela Responsiva */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Posição</th>
                          <th className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Jogador</th>
                          <th className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Acertos</th>
                          <th className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Tempo</th>
                          <th className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">Pontos</th>
                          <th className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                            Data
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result, index) => (
                          <motion.tr
                            key={result.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-3 sm:px-4 flex items-center gap-2 text-sm">
                              {index < 3 ? (
                                <Trophy
                                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                    index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"
                                  }`}
                                />
                              ) : null}
                              {index + 1}º
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-gray-800 font-medium text-sm truncate max-w-[120px] sm:max-w-none">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>{result.playerName}</TooltipTrigger>
                                  <TooltipContent>{result.playerName}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-sm">
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {result.correctAnswers}/{result.totalQuestions}
                              </span>
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-gray-600 text-sm">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {result.timeSpent.toFixed(1)}s
                              </span>
                            </td>
                            <td className="py-3 px-3 sm:px-4 font-semibold text-gray-700 text-sm">
                              {result.score}
                            </td>
                            <td className="py-3 px-3 sm:px-4 text-gray-600 text-sm hidden md:table-cell">
                              {new Date(result.createdAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}