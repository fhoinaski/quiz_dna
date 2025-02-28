"use client";

import { create } from "zustand";

// Função para gerar um ID de cliente único
function generateClientId(): string {
  return 'client_' + 
    Date.now().toString(36) + 
    Math.random().toString(36).substring(2, 10);
}

// Função para obter o ID do cliente atual ou gerar um novo
function getClientId(): string {
  if (typeof window === 'undefined') {
    return generateClientId();
  }
  
  const CLIENT_ID_KEY = 'quiz_client_id';
  let clientId = localStorage.getItem(CLIENT_ID_KEY);
  
  if (!clientId) {
    clientId = generateClientId();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }
  
  return clientId;
}

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
  clientId?: string; // Adicionado o clientId para identificação única
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
  setAnswers: (answers: Answer[]) => void; // Nova ação adicionada
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
  startQuiz: () => void;
};

function calculateScore(isCorrect: boolean): number {
  return isCorrect ? 100 : 0;
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
  setAnswers: (answers) => set({ answers }), // Implementação da nova ação

  answerQuestion: (quizId, questionIndex, answer, timeTaken) => {
    const state = useQuizStore.getState();
    const question = state.currentQuiz?.questions[questionIndex];
    const isCorrect = question && question.correctAnswer === answer;
    const score = calculateScore(isCorrect);
  
    console.log(
      `[Store] Resposta - Quiz: ${quizId}, Questão: ${questionIndex}, Resposta: ${answer}, Acerto: ${isCorrect}, Tempo: ${timeTaken}s`
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
      
      const sessionKey = `quiz_session_${quizId}`;
      const storedSession = typeof window !== 'undefined' ? localStorage.getItem(sessionKey) : null;
      const clientId = getClientId();
      
      if (storedSession) {
        const session = JSON.parse(storedSession);
        console.log('[Store] Sessão existente encontrada:', session);
        
        if (session.playerName !== playerName || session.playerAvatar !== playerAvatar) {
          session.playerName = playerName;
          session.playerAvatar = playerAvatar;
          localStorage.setItem(sessionKey, JSON.stringify(session));
        }
        
        set({ playerName, playerAvatar, currentStep: "waiting" });
        return;
      }

      const response = await fetch(`/api/quiz/${quizId}/session/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          playerName, 
          playerAvatar,
          clientId
        }),
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

      if (typeof window !== 'undefined') {
        localStorage.setItem(sessionKey, JSON.stringify({
          quizId,
          playerName,
          playerAvatar,
          clientId,
          joinedAt: new Date().toISOString()
        }));
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
            clientId
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
      const { playerName, playerAvatar, currentQuiz } = useQuizStore.getState();
      if (!playerName) {
        throw new Error("Nome do jogador não definido");
      }
  
      if (!currentQuiz) {
        throw new Error("Quiz não carregado");
      }
  
      const enrichedAnswers = answers.map((answer) => {
        const question = currentQuiz.questions[answer.questionIndex];
        const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
        return {
          ...answer,
          isCorrect,
        };
      });
  
      const correctAnswers = enrichedAnswers.reduce((count, answer) => {
        return answer.isCorrect ? count + 1 : count;
      }, 0);
  
      console.log(`[Store] Calculado localmente: ${correctAnswers}/${answers.length} acertos`);
  
      const clientId = getClientId();
  
      set({ currentStep: "results" });
  
      const response = await fetch(`/api/quiz/${quizId}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName,
          playerAvatar: playerAvatar || "",
          answers: enrichedAnswers,
          clientId,
          correctAnswers,
          totalQuestions: currentQuiz.questions.length,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }
  
      const data = await response.json();
      console.log("[Store] Resultado salvo:", data);
  
      const rankingResponse = await fetch(`/api/quiz/${quizId}/ranking`);
      if (rankingResponse.ok) {
        const rankingData = await rankingResponse.json();
        set({ participants: rankingData });
      }
  
      set({ currentStep: "results" });
    } catch (error) {
      console.error("[Store] Erro ao finalizar quiz:", error);
      set({ currentStep: "results" });
      throw error;
    }
  },

  startQuiz: () => {
    set((state) => {
      if (!state.currentQuiz) {
        console.error("[Store] Nenhum quiz carregado para iniciar");
        return state;
      }
      if (!state.playerName.trim()) {
        console.error("[Store] Nome do jogador não definido");
        return state;
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