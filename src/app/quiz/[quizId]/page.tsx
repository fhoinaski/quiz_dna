"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizScreen } from "@/components/quiz/QuizScreen";
import { ResultsScreen } from "@/components/quiz/ResultsScreen";
import { WaitingRoom } from "@/components/quiz/WaitingRoom";
import { WelcomeScreen } from "@/components/quiz/WelcomeScreen";
import { useQuizStore } from "@/store";

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { currentQuiz, currentStep, fetchQuiz, answers } = useQuizStore();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        if (!quizId) {
          throw new Error("ID do quiz não fornecido");
        }
        if (!currentQuiz || currentQuiz.id !== quizId) {
          await fetchQuiz(quizId);
        }
        setLoading(false);

        // Verifica se o quiz foi concluído (todas as perguntas respondidas)
        if (currentQuiz && answers.length === currentQuiz.questions.length && currentStep !== "results") {
          useQuizStore.getState().setCurrentStep("results");
        }
      } catch (err) {
        setError("Erro ao carregar o quiz. Tente novamente.");
        console.error("[QuizPage] Erro:", err);
        setLoading(false);
      }
    };
    loadQuiz();
  }, [quizId, currentQuiz, fetchQuiz, answers, currentStep]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-800 mb-4">{error}</p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen">
      {currentStep === "welcome" && <WelcomeScreen />}
      {currentStep === "waiting" && <WaitingRoom />}
      {currentStep === "quiz" && <QuizScreen />}
      {currentStep === "results" && <ResultsScreen />}
    </motion.div>
  );
}