"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Globe } from "lucide-react";
import { useQuizStore } from "@/store";

export function WaitingRoom() {
  const { currentQuiz, setCurrentStep } = useQuizStore();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);

  const fetchSessionStatus = useCallback(async () => {
    if (!currentQuiz?.id) return;

    try {
      const response = await fetch(`/api/quiz/${currentQuiz.id}/session`);
      if (!response.ok) throw new Error("Falha ao buscar status da sessão");
      const data = await response.json();
      setIsActive(data.isActive);
      setParticipantCount(data.participants.length);
      setLoading(false);
      if (data.isActive) {
        setCurrentStep("quiz");
      }
    } catch (error) {
      console.error("Erro ao buscar status da sessão:", error);
      setLoading(false);
    }
  }, [currentQuiz?.id, setCurrentStep]); // Dependências do useCallback

  useEffect(() => {
    fetchSessionStatus();
    const interval = setInterval(fetchSessionStatus, 5000);

    return () => clearInterval(interval);
  }, [fetchSessionStatus]); // Agora fetchSessionStatus é a única dependência

  if (!currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Nenhum quiz carregado.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sala de Espera</h2>
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-gray-700">
            <Globe className="w-5 h-5" /> Quiz: {currentQuiz.title}
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5" /> Participantes: {participantCount}
          </p>
          <p className="text-gray-700">
            Status: {isActive ? "Iniciado" : "Aguardando início"}
          </p>
        </div>
      </div>
    </div>
  );
}