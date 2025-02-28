// src/models/index.ts
import mongoose, { Document, Schema } from "mongoose";
import { QuizSession } from "./QuizSession";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  order: number;
}

export interface IQuiz extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  userId: mongoose.Types.ObjectId;
  totalTimeLimit: number; // Tempo máximo em minutos
  
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizResult extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | null;
  playerName: string;
  playerAvatar?: string;
  score: number;
  correctAnswers: number;        // Número de respostas corretas
  percentCorrect: number;       // Porcentagem de acertos
  totalQuestions: number;
  timeSpent: number;
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    timeToAnswer: number;
    isCorrect: boolean;
  }[];
  clientId?: string;           // ID do cliente para evitar duplicações
  createdAt: Date;
  updatedAt: Date;
}

export interface IParticipant {
  userId: string | null;
  name: string;
  avatar: string;
  joined: Date;
}

export type { IQuizSession } from "./QuizSession";

// Esquemas
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);



const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: [{
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    order: { type: Number, required: true }
  }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalTimeLimit: { type: Number, required: true, default: 5 }, // Default: 5 minutos
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AnswerSchema = new Schema(
  {
    questionIndex: { type: Number, required: true },
    selectedAnswer: { type: Number, required: true },
    timeToAnswer: { type: Number, required: true, default: 0 },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const QuizResultSchema = new Schema<IQuizResult>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    playerName: { type: String, required: true },
    playerAvatar: { type: String, default: "" },
    score: { type: Number, required: true },
    correctAnswers: { type: Number, required: true }, // Sem default, obrigatório
    percentCorrect: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
    timeSpent: { type: Number, required: true, default: 0 },
    answers: { type: [AnswerSchema], default: [] },
    clientId: { type: String, default: null },
  },
  { timestamps: true }
);



// Modelos - Evitar redefinição
export const User = (mongoose.models.User || mongoose.model<IUser>("User", UserSchema)) as typeof mongoose.Model<IUser>;
export const Quiz = (mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema)) as typeof mongoose.Model<IQuiz>;
export const QuizResult = (mongoose.models.QuizResult || mongoose.model<IQuizResult>("QuizResult", QuizResultSchema)) as typeof mongoose.Model<IQuizResult>;
export { QuizSession }; // Reexporte o modelo