import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';

interface QuizTimerProps {
  duration: number; // in milliseconds
  timeLeft: number;
  onTimeUp?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showWarning?: boolean;
  warningThreshold?: number; // percentage when to show warning
  className?: string;
}

export function QuizTimer({
  duration,
  timeLeft,
  
  size = 'md',
  showWarning = true,
  warningThreshold = 30,
  className = ''
}: QuizTimerProps) {
  const [isWarning, setIsWarning] = useState(false);
  
  // Calculate percentage remaining
  const percentage = (timeLeft / duration) * 100;
  const formattedTime = (timeLeft / 1000).toFixed(1);

  useEffect(() => {
    if (showWarning && percentage <= warningThreshold && !isWarning) {
      setIsWarning(true);
      // Pulse animation when warning starts
      gsap.to('.timer-warning', {
        scale: 1.1,
        duration: 0.2,
        repeat: 3,
        yoyo: true
      });
    }
  }, [percentage, warningThreshold, showWarning, isWarning]);

  // Size classes mapping
  const sizeClasses = {
    sm: 'h-2 text-sm',
    md: 'h-3 text-base',
    lg: 'h-4 text-lg'
  };

  // Color classes based on time remaining
  const getColorClasses = () => {
    if (percentage <= 25) return 'from-red-500 to-red-600';
    if (percentage <= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Timer className={`${
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
          } ${percentage <= warningThreshold ? 'text-red-500' : 'text-gray-600'}`} />
          <span className="font-medium">Time Remaining</span>
        </div>
        <AnimatePresence>
          {isWarning && percentage <= warningThreshold && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="timer-warning flex items-center gap-1 text-red-500"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Running out of time!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative w-full">
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getColorClasses()}`}
            initial={{ width: '100%' }}
            animate={{ 
              width: `${percentage}%`,
              transition: { duration: 0.1, ease: 'linear' }
            }}
          />
        </div>
        
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 font-bold"
          animate={{
            scale: timeLeft <= 5000 ? [1, 1.1, 1] : 1,
            color: timeLeft <= 5000 ? '#EF4444' : '#1F2937'
          }}
          transition={{ duration: 0.3 }}
        >
          {formattedTime}s
        </motion.div>
      </div>
    </div>
  );
}

export default QuizTimer;