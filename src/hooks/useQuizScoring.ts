// src/hooks/useQuizScoring.ts
import { useState, useCallback } from 'react';

interface ScoreCalculation {
  baseScore: number;
  timeBonus: number;
  totalScore: number;
}

export function useQuizScoring(maxTime: number = 1000) {
  const [currentScore, setCurrentScore] = useState(0);
  
  const calculateScore = useCallback((timeLeft: number, isCorrect: boolean): ScoreCalculation => {
    if (!isCorrect) {
      return { baseScore: 0, timeBonus: 0, totalScore: 0 };
    }

    // Base score for correct answer
    const baseScore = 100;

    // Time bonus calculation (0-900 points based on remaining time)
    const timeBonus = Math.floor((timeLeft / maxTime) * 900);
    
    // Total score
    const totalScore = baseScore + timeBonus;

    return { baseScore, timeBonus, totalScore };
  }, [maxTime]);

  const addScore = useCallback((timeLeft: number, isCorrect: boolean) => {
    const { totalScore } = calculateScore(timeLeft, isCorrect);
    setCurrentScore(prev => prev + totalScore);
    return totalScore;
  }, [calculateScore]);

  const resetScore = useCallback(() => {
    setCurrentScore(0);
  }, []);

  return {
    currentScore,
    calculateScore,
    addScore,
    resetScore
  };
}