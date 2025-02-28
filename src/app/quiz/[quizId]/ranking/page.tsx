"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trophy, ArrowLeft, AlertTriangle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Result {
  id: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  rank: number;
  createdAt: string;
}

export default function RankingPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchRanking = useCallback(async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/quiz/${quizId}/ranking`);
      if (!response.ok) throw new Error("Failed to fetch ranking");
      const data = await response.json();
      setResults(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load ranking");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchRanking();
    const interval = setInterval(fetchRanking, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchRanking]);

  useEffect(() => {
    if (containerRef.current && results.length > 0) {
      gsap.from(containerRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  }, [results]);

  if (loading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-t-transparent border-blue-600"
        />
        <p className="text-gray-500">Carregando ranking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 text-red-600 mb-6 bg-red-50 p-4 rounded-lg">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ranking</h1>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-sm text-gray-500">
                    Última atualização: {lastUpdated.toLocaleTimeString()}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>O ranking é atualizado automaticamente a cada 5 segundos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button variant="ghost" size="sm" onClick={fetchRanking}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>

      <div ref={containerRef} className="space-y-3">
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`
                bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow
                ${index < 3 ? "border-l-4" : "border-l-0"}
                ${index === 0 ? "border-yellow-400" : index === 1 ? "border-gray-400" : index === 2 ? "border-orange-400" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold
                    ${index === 0 ? "bg-yellow-100 text-yellow-700" :
                      index === 1 ? "bg-gray-100 text-gray-700" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-blue-100 text-blue-700"}
                  `}>
                    {index < 3 ? <Trophy className="w-5 h-5" /> : index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{result.playerName}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {result.correctAnswers}/{result.totalQuestions}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {result.timeSpent.toFixed(1)}s
                      </span>
                      <span className="font-semibold text-blue-600">
                        {result.score.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  #{result.rank}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
            <p className="text-lg">Nenhum resultado encontrado ainda.</p>
            <p className="text-sm mt-2">Participe do quiz para aparecer no ranking!</p>
          </div>
        )}
      </div>
    </div>
  );
}