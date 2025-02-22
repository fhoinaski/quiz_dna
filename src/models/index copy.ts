import mongoose, { Document, Schema } from 'mongoose';

// Interfaces
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
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizResult extends Document {
  quizId: mongoose.Types.ObjectId;
  playerName: string;
  score: number;
  totalQuestions: number;
  createdAt: Date;
}

// Esquemas

// Esquema de Usuário
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Esquema de Questão (como subdocumento)
const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

// Esquema de Quiz
const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Esquema de Resultado do Quiz
const QuizResultSchema = new Schema<IQuizResult>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    playerName: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Modelos
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
export const QuizResult = mongoose.models.QuizResult || mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);