// src/models/QuizSession.ts - Adicionando campo clientId

import mongoose, { Schema, Document } from 'mongoose';

interface IParticipant {
  userId: string | null;
  name: string;
  avatar: string;
  joined: Date;
  score: number;
  timeBonus: number;
  lastActive: Date;
  clientId?: string | null; // Novo campo para rastreamento de cliente
}

export interface IQuizSession extends Document {
  quizId: mongoose.Types.ObjectId;
  isActive: boolean;
  isPaused: boolean;
  timeLimit: number;
  startsAt: Date | null;
  endsAt: Date | null;
  currentQuestion: number;
  participants: IParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizSessionSchema = new Schema<IQuizSession>({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isPaused: {
    type: Boolean,
    default: false
  },
  timeLimit: {
    type: Number,
    default: 30,
    min: 10,
    max: 300
  },
  startsAt: {
    type: Date,
    default: null
  },
  endsAt: {
    type: Date,
    default: null
  },
  currentQuestion: {
    type: Number,
    default: 0
  },
  participants: [{
    userId: {
      type: String,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    joined: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      default: 0
    },
    timeBonus: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    clientId: {
      type: String,
      default: null
    }
  }]
}, {
  timestamps: true
});

// Evite redefinição do modelo
export const QuizSession = (mongoose.models.QuizSession || mongoose.model<IQuizSession>('QuizSession', QuizSessionSchema)) as typeof mongoose.Model<IQuizSession>;