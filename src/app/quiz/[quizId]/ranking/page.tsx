"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trophy, ArrowLeft, AlertTriangle } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

interface Result {
  id: string;
  playerName: string;
  score: number;
  timeSpent: number;
  rank: number;
  createdAt: string;
}

// interface Quiz {
//   id: string;
//   title: string;
// }

export default function RankingPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchRanking = useCallback(async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/quiz/${quizId}/ranking`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch ranking");
      }
      
      const data = await response.json();
      setResults(data);
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
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }, [results]);

  if (loading && results.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ranking</h1>
        {/* <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link> */}
      </div>

      <div ref={containerRef} className="space-y-4">
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'}
                  `}>
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">{result.playerName}</h3>
                    <p className="text-sm text-gray-500">
                      Score: {result.score.toLocaleString()} pts | 
                      Tempo: {result.timeSpent.toFixed(1)}s
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  #{index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>
    </div>
  );
}