"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, AlertTriangle,ArrowLeft } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useRouter } from "next/navigation";

export function QuizScreen() {
  const router = useRouter();
  const {
    currentQuiz,
    currentQuestionIndex,
    answerQuestion,
  
    timeLimit,
    answers,
  
    finishQuiz,
    currentStep,
  } = useQuizStore();

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];
  const totalTimeLimitMs = timeLimit * 1000;

  const calculateRegressiveScore = useCallback((timeTaken: number, maxTime: number = 10): number => {
    const maxScore = 1000;
    if (timeTaken >= maxTime) return 0;
    const score = Math.floor(maxScore * (1 - timeTaken / maxTime));
    return Math.max(score, 0);
  }, []);

  useEffect(() => {
    if (!currentQuiz?.id || !currentQuiz.questions || currentQuiz.questions.length === 0) {
      router.push("/dashboard");
      return;
    }
    setTimeLeft(totalTimeLimitMs);
    setStartTime(Date.now());
    setIsLoading(false);

    gsap.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out", // GSAP suporta power3.out, mas Framer Motion não
    });
  }, [currentQuiz, router, totalTimeLimitMs]);

  useEffect(() => {
    if (isFinished || currentStep !== "quiz" || showFeedback || timeLeft <= 0 || isLoading || !currentQuiz?.id) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 10;
        if (newTime <= 0) {
          clearInterval(timer);
          setIsFinished(true);
          finishQuiz(currentQuiz.id, answers);
          return 0;
        }
        return newTime;
      });
    }, 10);

    return () => clearInterval(timer);
  }, [showFeedback, timeLeft, isLoading, currentQuiz, answers, finishQuiz, isFinished, currentStep]);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (showFeedback || !currentQuiz?.id || !currentQuestion || isFinished) return;
  
      const timeElapsed = (Date.now() - startTime) / 1000;
      const correct = optionIndex === currentQuestion.correctAnswer;
  
      setIsCorrect(correct);
      setShowFeedback(true);
      setSelectedOption(optionIndex);
  
      gsap.to(`.option-${optionIndex}`, {
        scale: 1.05,
        duration: 0.4,
        ease: "elastic.out(1, 0.3)",
        yoyo: true,
        repeat: 1,
      });
  
      gsap.to(containerRef.current, {
        rotate: correct ? 2 : -2,
        duration: 0.3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
      });
  
      setTimeout(() => {
        answerQuestion(currentQuiz.id, currentQuestionIndex, optionIndex, timeElapsed);
        setShowFeedback(false);
        setSelectedOption(null);
  
        if (currentQuestionIndex + 1 >= currentQuiz.questions.length) {
          const finalAnswers = [...answers, { 
            questionIndex: currentQuestionIndex, 
            selectedAnswer: optionIndex, 
            timeToAnswer: timeElapsed * 1000 
          }];
          setIsFinished(true);
          finishQuiz(currentQuiz.id, finalAnswers);
        } else {
          setStartTime(Date.now());
        }
      }, 2000);
    },
    [
      currentQuestion,
      currentQuiz,
      currentQuestionIndex,
      answerQuestion,
      showFeedback,
      finishQuiz,
      startTime,
      answers,
      isFinished
    ]
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-10 w-10 border-b-2 border-gray-600"
          />
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="mt-2 text-gray-700 text-lg font-medium"
          >
            Preparando seu desafio...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Erro no Quiz</h1>
          <p className="text-gray-600 mb-4 text-lg">Nenhuma pergunta carregada.</p>
          <Link href="/dashboard">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Dashboard
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion || isFinished || currentStep === "results") {
    if (currentQuiz?.id && !isFinished) {
      finishQuiz(currentQuiz.id, answers);
      setIsFinished(true);
    }
    return null;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2 text-gray-800">
            <span className="text-sm sm:text-base font-medium">
              Questão {currentQuestionIndex + 1} de {currentQuiz.questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="text-sm sm:text-base font-medium text-gray-700">
                {(timeLeft / 1000).toFixed(1)}s / {timeLimit}s
              </span>
            </div>
          </div>
          <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / totalTimeLimitMs) * 100}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </motion.div>

        <Card className="bg-white shadow-lg border border-gray-200 rounded-lg">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="p-4 sm:p-6 lg:p-8"
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 leading-tight">
              {currentQuestion.text}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, backgroundColor: "#e0f2fe" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`option-${index} w-full p-3 sm:p-4 text-left rounded-lg border-2 border-gray-200 text-gray-800 font-medium hover:border-blue-300 transition-all ${
                    showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? "bg-green-100 border-green-400 text-green-800"
                        : index === selectedOption
                        ? "bg-red-100 border-red-400 text-red-800"
                        : "bg-white border-gray-200"
                      : selectedOption === index
                      ? "bg-blue-100 border-blue-400"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </Card>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`mt-6 p-4 rounded-lg shadow-md text-center ${
                isCorrect
                  ? "bg-green-50 border-l-4 border-green-500 text-green-800"
                  : "bg-red-50 border-l-4 border-red-500 text-red-800"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                {isCorrect ? (
                  <>
                    <Trophy className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-lg">Correto!</span>
                    <span className="ml-2 text-sm">
                      +{calculateRegressiveScore((Date.now() - startTime) / 1000)} pontos
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-lg">Incorreto!</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}