// src/utils/scoring.ts
interface ScoreResult {
    totalScore: number;
    correctAnswers: number;
    totalQuestions: number;
    percentCorrect: number;
  }
  
  export const calculateQuizScore = (answers: { questionIndex: number; selectedAnswer: number; timeToAnswer: number; isCorrect: boolean }[]): ScoreResult => {
    let totalScore = 0;
    let correctAnswers = 0;
    const totalQuestions = answers.length;
  
    answers.forEach(answer => {
      if (answer.isCorrect) {
        const baseScore = 100; // Pontuação fixa por acerto
        totalScore += baseScore;
        correctAnswers++;
      }
    });
  
    const percentCorrect = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
    console.log("[calculateQuizScore] Resultado:", { totalScore, correctAnswers, totalQuestions, percentCorrect });
  
    return {
      totalScore,
      correctAnswers,
      totalQuestions,
      percentCorrect
    };
  };