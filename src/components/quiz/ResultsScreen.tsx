"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, Award, Share2, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { useQuizStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import confetti from "canvas-confetti";
import { useSpring, animated } from "@react-spring/web";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalculatingResults } from "@/components/ui/CalculatingResults";

interface RankingEntry {
  playerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  position?: number;
  avatar?: string;
}

const ScoreAnimation = ({ value }: { value: number }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay: 300,
    config: { mass: 1, tension: 30, friction: 12 },
  });

  return <animated.span>{number.to((n) => Math.floor(n).toLocaleString())}</animated.span>;
};

const RankingCard = ({ entry, index, isCurrentPlayer }: { entry: RankingEntry; index: number; isCurrentPlayer: boolean }) => {
  const isTopThree = index < 3;
  const icons = [Crown, Medal, Award];
  const colors = ["bg-yellow-100 text-yellow-600", "bg-gray-100 text-gray-600", "bg-amber-100 text-amber-600"];
  const IconComponent = isTopThree ? icons[index] : Trophy;
  const colorClass = isTopThree ? colors[index] : "bg-blue-100 text-blue-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="relative"
    >
      <Card
        className={`bg-white/95 backdrop-blur-sm p-5 transition-all hover:shadow-md border-l-4 ${
          isTopThree ? (index === 0 ? "border-yellow-400" : index === 1 ? "border-gray-400" : "border-amber-400") : "border-transparent"
        } ${isCurrentPlayer ? "border-2 border-blue-500 shadow-lg" : ""}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center shrink-0`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {entry.playerName}
                  {isCurrentPlayer && <span className="ml-2 text-sm text-blue-600 font-medium">(Você)</span>}
                </h3>
                {entry.avatar && <span className="text-2xl">{entry.avatar}</span>}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" /> {entry.correctAnswers}/{entry.totalQuestions}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-500" /> {entry.timeSpent.toFixed(1)}s
                </span>
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-700">#{index + 1}</div>
        </div>
      </Card>
    </motion.div>
  );
};

export function ResultsScreen() {
  const { currentQuiz, playerName, answers } = useQuizStore();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showCalculating, setShowCalculating] = useState(true); // Novo estado para animação
  const { toast, showToast, hideToast } = useToast();
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateCorrectAnswers = useCallback(() => {
    if (!currentQuiz?.questions || !answers.length) return 0;
    return answers.reduce((count, answer) => {
      const question = currentQuiz.questions[answer.questionIndex];
      return question && question.correctAnswer === answer.selectedAnswer ? count + 1 : count;
    }, 0);
  }, [currentQuiz?.questions, answers]);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FFA500", "#FF6347", "#4CAF50"],
    });
  }, []);

  useEffect(() => {
    if (loading || !playerRank || playerRank > 3) return;
    triggerConfetti();
    const messages = [
      "🏆 Parabéns! Você conquistou o 1º lugar!",
      "🥈 Fantástico! Segundo lugar é seu!",
      "🥉 Excelente! Você está no pódio!",
    ];
    showToast(messages[playerRank - 1], "success");
  }, [loading, playerRank, showToast, triggerConfetti]);

  const fetchResults = useCallback(async () => {
    if (!currentQuiz?.id || isFetching) return;
    try {
      setIsFetching(true);
      const response = await fetch(`/api/quiz/${currentQuiz.id}/ranking`);
      if (!response.ok) throw new Error("Falha ao carregar resultados");
      const data: RankingEntry[] = await response.json();

      const isDifferent = JSON.stringify(data) !== JSON.stringify(rankings);
      if (isDifferent) {
        setRankings(data);
        const playerRankPosition = data.findIndex((r) => r.playerName === playerName);
        setPlayerRank(playerRankPosition >= 0 ? playerRankPosition + 1 : null);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erro ao carregar resultados:", error);
      showToast("Erro ao carregar resultados", "error");
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [currentQuiz?.id, playerName, rankings, isFetching, showToast]);

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(() => {
    // Inicia a animação por 15 segundos antes de carregar os resultados
    const timer = setTimeout(() => {
      setShowCalculating(false); // Termina a animação após 15 segundos
      fetchResults(); // Carrega os resultados após a animação
    }, 15000);

    fetchIntervalRef.current = setInterval(() => {
      fetchResults(); // Polling a cada 20 segundos após o carregamento inicial
    }, 15000);

    return () => {
      clearTimeout(timer);
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, []);

  const handleManualRefresh = () => {
    fetchResults();
    showToast("Ranking atualizado manualmente!", "success");
  };

  const playerEntry = rankings.find((r) => r.playerName === playerName) || {
    score: 0,
    correctAnswers: calculateCorrectAnswers(),
    totalQuestions: currentQuiz?.questions?.length || 0,
    timeSpent: answers.reduce((total, a) => total + a.timeToAnswer / 1000, 0),
  };

  const playerStats = playerEntry;

  const shareResults = async () => {
    const text = `🏆 Quiz "${currentQuiz?.title}": ${playerStats.correctAnswers}/${playerStats.totalQuestions} acertos em ${playerStats.timeSpent.toFixed(1)}s! ${playerRank ? `Posição: #${playerRank}` : ""}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Meu Resultado no Quiz", text, url: window.location.href });
        showToast("Resultado compartilhado com sucesso!", "success");
      } catch (err) {
        if (err.name !== "AbortError") showToast("Erro ao compartilhar", "error");
      }
    } else {
      navigator.clipboard.writeText(text)
        .then(() => showToast("Copiado para a área de transferência!", "success"))
        .catch(() => showToast("Erro ao copiar", "error"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <AnimatedBackground variant="celebration" density="medium" speed="slow" />

      <AnimatePresence>
        {showCalculating && <CalculatingResults duration={15} />}
      </AnimatePresence>

      {!showCalculating && (
        <div className="relative z-10 max-w-5xl mx-auto p-6 py-10">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Parabéns!</h1>
                <p className="text-xl text-gray-600">{currentQuiz?.title}</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <StatsCard
                  title="Acertos"
                  value={`${playerStats.correctAnswers}/${playerStats.totalQuestions}`}
                  icon={CheckCircle}
                  color="bg-green-100 text-green-600"
                />
                <StatsCard title="Pontuação" value={playerStats.score} icon={Trophy} color="bg-purple-100 text-purple-600" />
                <StatsCard title="Tempo" value={`${playerStats.timeSpent.toFixed(1)}s`} icon={Clock} color="bg-blue-100 text-blue-600" />
                <StatsCard title="Posição" value={playerRank ? `#${playerRank}` : "-"} icon={Crown} color="bg-yellow-100 text-yellow-600" />
              </div>

              <Card className="bg-white/95 backdrop-blur-sm p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-500" /> Ranking
                  </h2>
                  <div className="flex items-center gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-sm text-gray-500">
                            {lastUpdated ? `Atualizado: ${lastUpdated.toLocaleTimeString()}` : "Atualizando..."}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>Atualiza automaticamente a cada 20 segundos</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={isFetching}
                      aria-label="Atualizar ranking manualmente"
                    >
                      <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={shareResults} variant="outline" className="gap-2">
                      <Share2 className="w-4 h-4" /> Compartilhar
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {rankings.map((entry, index) => (
                      <RankingCard
                        key={`${entry.playerName}-${index}`}
                        entry={entry}
                        index={index}
                        isCurrentPlayer={entry.playerName === playerName}
                      />
                    ))}
                  </AnimatePresence>
                  {rankings.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum resultado disponível ainda.</p>}
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  );
}

const StatsCard = ({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: any; color: string }) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-xl font-bold text-gray-800">{typeof value === "number" ? <ScoreAnimation value={value} /> : value}</p>
        </div>
      </div>
    </Card>
  );
};