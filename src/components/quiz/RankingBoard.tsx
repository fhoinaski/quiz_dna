// src/components/quiz/RankingBoard.tsx
"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useRanking } from "@/hooks/useRanking";

interface RankingBoardProps {
  quizId: string;
  pollingInterval?: number;
}

export function RankingBoard({ quizId, pollingInterval = 3000 }: RankingBoardProps) {
  const { rankings, loading, error } = useRanking(quizId, pollingInterval);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-red-600 text-center">Erro ao carregar ranking: {error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Ranking</h2>
      {rankings.length === 0 ? (
        <p className="text-gray-600">Nenhum resultado ainda.</p>
      ) : (
        <div className="space-y-2">
          {rankings.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                {entry.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                {entry.rank === 3 && <Star className="w-5 h-5 text-amber-600" />}
                <span className="font-semibold">{entry.rank}. {entry.playerName}</span>
              </div>
              <span className="text-gray-800">{entry.score} pontos</span>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}