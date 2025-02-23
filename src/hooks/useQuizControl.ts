import { useState, useCallback } from 'react';

export const useQuizControl = (quizId: string) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });

      if (!response.ok) throw new Error('Failed to start quiz');
      setIsActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to start quiz');
      console.error(err);
    }
  }, [quizId]);

  const pauseQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' })
      });

      if (!response.ok) throw new Error('Failed to pause quiz');
      setIsActive(false);
      setError(null);
    } catch (err) {
      setError('Failed to pause quiz');
      console.error(err);
    }
  }, [quizId]);

  const resetQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'reset' })
      });

      if (!response.ok) throw new Error('Failed to reset quiz');
      setIsActive(false);
      setError(null);
    } catch (err) {
      setError('Failed to reset quiz');
      console.error(err);
    }
  }, [quizId]);

  return {
    isActive,
    error,
    startQuiz,
    pauseQuiz,
    resetQuiz
  };
};