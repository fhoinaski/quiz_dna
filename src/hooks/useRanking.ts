// src/hooks/useRanking.ts
import { useState, useEffect, useCallback } from 'react';

interface RankingEntry {
  id: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  rank: number;
  createdAt: string;
}

export function useRanking(quizId: string, pollingInterval = 3000) {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPolling, setIsPolling] = useState(true);

  const fetchRankings = useCallback(async () => {
    if (!isPolling) return;

    try {
      const response = await fetch(`/api/quiz/${quizId}/ranking`);
      if (!response.ok) {
        throw new Error('Falha ao carregar ranking');
      }

      const data: RankingEntry[] = await response.json();
      setRankings(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar ranking:', err);
    }
  }, [quizId, isPolling]);

  useEffect(() => {
    fetchRankings();
    const intervalId = setInterval(fetchRankings, pollingInterval);

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [fetchRankings, pollingInterval]);

  return {
    rankings,
    loading,
    error,
    stopPolling: () => setIsPolling(false),
    startPolling: () => setIsPolling(true),
  };
}