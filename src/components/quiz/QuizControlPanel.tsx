import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, Settings, Users, BarChart2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

interface QuizControlPanelProps {
  quizId: string;
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  participantCount: number;
}

export function QuizControlPanel({
  
  isActive,
  onStart,
  onPause,
  participantCount
}: QuizControlPanelProps) {
  const [timeLimit, setTimeLimit] = useState(60); // Default 60 seconds
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quiz Controls</h3>
          <motion.div
            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
            className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-gray-600" />
            <Input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              min={10}
              max={300}
              className="w-24"
            />
            <span className="text-sm text-gray-600">seconds</span>
          </div>
          
          <Button
            onClick={isActive ? onPause : onStart}
            className="w-full"
            variant={isActive ? "destructive" : "default"}
          >
            {isActive ? (
              <><Pause className="w-4 h-4 mr-2" /> Pause Quiz</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Start Quiz</>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Participants</h3>
          <Users className="w-5 h-5 text-gray-600" />
        </div>
        <div className="text-3xl font-bold text-center">{participantCount}</div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <Settings className="w-5 h-5 text-gray-600" />
        </div>
        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            <BarChart2 className="w-4 h-4 mr-2" />
            View Rankings
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default QuizControlPanel;