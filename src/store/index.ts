"use client";

import { create } from "zustand";

type Question = {
  text: string;
  options: string[];
  correctAnswer: number;
  order: number;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isPublished?: boolean;
  totalTimeLimit?: number; // Tempo total em minutos
};

type Answer = {
  questionIndex: number;
  selectedAnswer: number;
  timeToAnswer: number; // Tempo em milissegundos
};

type Participant = {
  userId: string | null;
  name: string;
  avatar: string;
  joined: Date;
  score: number;
  timeTaken: number; // Tempo total gasto em segundos
  lastActive?: Date;
};

type QuizState = {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  score: number;
  playerName: string;
  playerAvatar: string;
  participants: Participant[];
  answers: Answer[];
  timeLimit: number; // Tempo total restante em segundos
  currentStep: "welcome" | "waiting" | "quiz" | "results";
  setQuiz: (quiz: Quiz) => void;
  setCurrentStep: (step: "welcome" | "waiting" | "quiz" | "results") => void;
  setPlayerName: (name: string) => void;
  setPlayerAvatar: (avatar: string) => void;
  answerQuestion: (
    quizId: string,
    questionIndex: number,
    answer: number,
    timeTaken: number // Tempo em segundos
  ) => void;
  joinSession: (quizId: string, playerName: string, playerAvatar: string) => Promise<void>;
  fetchQuiz: (quizId: string) => Promise<void>;
  updateTimeLeft: (timeLeft: number) => void;
  finishQuiz: (quizId: string, answers: Answer[]) => Promise<void>;
  startQuiz: () => void; // Adicionado ao tipo
};

// Função para calcular a pontuação regressiva
function calculateRegressiveScore(timeTaken: number, maxTime: number = 10): number {
  const maxScore = 1000; // Pontuação máxima por questão
  if (timeTaken >= maxTime) return 0; // Se exceder o tempo máximo, pontuação é 0
  const score = Math.floor(maxScore * (1 - timeTaken / maxTime)); // Diminui linearmente
  return Math.max(score, 0); // Garante que não seja negativo
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  score: 0,
  playerName: "",
  playerAvatar: "",
  participants: [],
  answers: [],
  timeLimit: 300, // Padrão: 5 minutos (300 segundos)
  currentStep: "welcome",

  setQuiz: (quiz) =>
    set({ currentQuiz: quiz, timeLimit: (quiz.totalTimeLimit || 5) * 60, answers: [] }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setPlayerName: (name) => set({ playerName: name }),
  setPlayerAvatar: (avatar) => set({ playerAvatar: avatar }),

  answerQuestion: (quizId, questionIndex, answer, timeTaken) => {
    const state = useQuizStore.getState();
    const question = state.currentQuiz?.questions[questionIndex];
    const isCorrect = question && question.correctAnswer === answer;
    const score = isCorrect ? calculateRegressiveScore(timeTaken) : 0;

    console.log(
      `[Store] Resposta - Quiz: ${quizId}, Questão: ${questionIndex}, Resposta: ${answer}, Pontuação: ${score}, Tempo: ${timeTaken}s`
    );

    set((state) => ({
      score: state.score + score,
      currentQuestionIndex: state.currentQuestionIndex + 1,
      answers: [
        ...state.answers,
        { questionIndex, selectedAnswer: answer, timeToAnswer: timeTaken * 1000 },
      ],
      participants: state.participants.map((p) =>
        p.name === state.playerName && p.avatar === state.playerAvatar
          ? { ...p, score: p.score + score, timeTaken }
          : p
      ),
    }));
  },

  joinSession: async (quizId, playerName, playerAvatar) => {
    try {
      console.log(`[Store] Entrando na sessão do quiz ${quizId} com ${playerName}`);
      const response = await fetch(`/api/quiz/${quizId}/session/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, playerAvatar }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to join session";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      set((state) => ({
        participants: [
          ...state.participants,
          {
            userId: null,
            name: playerName,
            avatar: playerAvatar,
            joined: new Date(),
            score: 0,
            timeTaken: 0,
          },
        ],
        currentStep: "waiting",
      }));
    } catch (error) {
      console.error("[Store] Erro ao entrar na sessão:", error);
      throw error;
    }
  },

  fetchQuiz: async (quizId) => {
    try {
      console.log(`[Store] Buscando quiz ${quizId}`);
      const response = await fetch(`/api/quiz/${quizId}/public`);
      if (!response.ok) {
        throw new Error("Falha ao carregar quiz");
      }
      const quizData: Quiz = await response.json();
      set({
        currentQuiz: quizData,
        currentQuestionIndex: 0,
        score: 0,
        timeLimit: (quizData.totalTimeLimit || 5) * 60,
        answers: [],
      });
      console.log(`[Store] Quiz ${quizId} carregado:`, quizData);
    } catch (error) {
      console.error("[Store] Erro ao buscar quiz:", error);
      throw error;
    }
  },

  updateTimeLeft: (timeLeft) => set({ timeLimit: timeLeft }),

  finishQuiz: async (quizId, answers) => {
    try {
      console.log(`[Store] Finalizando quiz ${quizId} com ${answers.length} respostas`);
      const { playerName, playerAvatar } = useQuizStore.getState();
      if (!playerName) {
        throw new Error("Nome do jogador não definido");
      }

      const response = await fetch(`/api/quiz/${quizId}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, playerAvatar: playerAvatar || "", answers }),
      });

      if (!response.ok) {
        let errorMessage = "Falha ao salvar resultado";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}`;
        }
        console.error("[Store] Resposta da API:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("[Store] Resultado salvo:", data);

      const rankingResponse = await fetch(`/api/quiz/${quizId}/ranking`);
      if (!rankingResponse.ok) {
        throw new Error("Falha ao carregar ranking");
      }
      const rankingData: Participant[] = await rankingResponse.json();
      set({ participants: rankingData, currentStep: "results" });
    } catch (error) {
      console.error("[Store] Erro ao finalizar quiz:", error);
      throw error;
    }
  },

  startQuiz: () => {
    set((state) => {
      if (!state.currentQuiz) {
        console.error("[Store] Nenhum quiz carregado para iniciar");
        return state; // Não faz nada se não houver quiz
      }
      if (!state.playerName.trim()) {
        console.error("[Store] Nome do jogador não definido");
        return state; // Não inicia sem nome
      }
      console.log(`[Store] Iniciando quiz para ${state.playerName}`);
      return {
        currentStep: "quiz",
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
      };
    });
  },
}));