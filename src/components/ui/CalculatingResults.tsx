"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Dna } from "lucide-react";
import { gsap } from "gsap";

interface CalculatingResultsProps {
  duration?: number;
  onComplete?: () => void;
}

export function CalculatingResults({ duration = 15, onComplete }: CalculatingResultsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particlesRef.current) return;

    const particleCount = window.innerWidth < 768 ? 15 : 30;
    const particles = Array.from({ length: particleCount }).map(() => {
      const particle = document.createElement("div");
      particle.className = "absolute w-2 h-2 bg-blue-500/30 rounded-full blur-sm";
      particlesRef.current?.appendChild(particle);
      return particle;
    });

    particles.forEach((particle) => {
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      });

      gsap.to(particle, {
        duration: 5 + Math.random() * 3,
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 100 - 50}`,
        opacity: 0.1 + Math.random() * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => particles.forEach((particle) => particle.remove());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-8 flex flex-col items-center justify-center border border-gray-100 w-full max-w-md mx-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Dna className="w-12 h-12 text-blue-600" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-center text-gray-900"
        >
          Calculando Resultados
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: duration, ease: "linear" }}
          className="w-full h-2 bg-blue-200 rounded-full mt-6 overflow-hidden"
        >
          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-gray-600 text-center text-sm md:text-base"
        >
          Estamos processando suas respostas...
        </motion.p>
      </motion.div>
    </div>
  );
}