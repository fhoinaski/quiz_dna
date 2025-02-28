"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useRanking } from "@/hooks/useRanking";



interface RankingBoardProps {
  quizId: string;
  pollingInterval?: number;
}

export function RankingBoard({ quizId, pollingInterval = 3000 }: RankingBoardProps) {
  const { rankings, loading, error } = useRanking(quizId, pollingInterval);

  if (loading) return <Card className="p-6"><div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600" /> <span className="ml-2">Carregando...</span></div></Card>;
  if (error) return <Card className="p-6"><div className="text-red-600 text-center">Erro: {error}</div></Card>;

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Ranking</h2>
      {rankings.length === 0 ? (
        <p className="text-gray-600">Nenhum resultado ainda.</p>
      ) : (
        <div className="space-y-3">
          {rankings.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                {entry.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                {entry.rank === 3 && <Star className="w-5 h-5 text-amber-600" />}
                {entry.rank > 3 && <span className="w-5 text-center">{entry.rank}</span>}
                <span className="font-semibold">{entry.playerName}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {entry.correctAnswers}/{entry.totalQuestions}
                </span>
                <span className="flex items-center gap-1 text-blue-600">
                  <Clock className="w-4 h-4" />
                  {entry.timeSpent.toFixed(1)}s
                </span>
                <span className="font-bold text-gray-800">{entry.score} pts</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}