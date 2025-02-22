import mongoose, { Document, Schema } from 'mongoose'

// Interfaces
export interface IUser extends Document {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface IQuestion {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

export interface IQuiz extends Document {
  title: string
  description: string
  questions: IQuestion[]
  userId: mongoose.Types.ObjectId
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IQuizResult extends Document {
  quizId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId | null
  playerName: string
  playerAvatar?: string // Adicionado para suportar avatar no resultado
  score: number
  totalQuestions: number
  timeSpent: number // tempo total em segundos
  answers: {
    questionIndex: number
    selectedAnswer: number
    timeToAnswer: number // tempo em milissegundos para responder
    isCorrect: boolean
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface IParticipant {
  userId: string | null
  name: string
  avatar: string // Adicionado para suportar avatares na sessão
  joined: Date
}

export interface IQuizSession extends Document {
  quizId: mongoose.Types.ObjectId
  isActive: boolean
  startsAt: Date | null
  endsAt: Date | null
  participants: IParticipant[]
  createdAt: Date
  updatedAt: Date
}

// Esquemas

// Esquema de Usuário
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

// Esquema de Questão (subdocumento)
const QuestionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    order: { type: Number, required: true },
  },
  { _id: false }
)

// Esquema de Quiz
const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Esquema de Resposta (subdocumento para QuizResult)
const AnswerSchema = new Schema(
  {
    questionIndex: { type: Number, required: true },
    selectedAnswer: { type: Number, required: true },
    timeToAnswer: { type: Number, required: true, default: 0 }, // Alterado para milissegundos
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
)

// Esquema de Resultado do Quiz (atualizado)
const QuizResultSchema = new Schema<IQuizResult>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    playerName: { type: String, required: true },
    playerAvatar: { type: String, default: '' }, // Adicionado para suportar avatar
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeSpent: { type: Number, required: true, default: 0 }, // Tempo total em segundos
    answers: { type: [AnswerSchema], default: [] },
  },
  { timestamps: true }
)

// Esquema de Participante (subdocumento para QuizSession)
const ParticipantSchema = new Schema<IParticipant>(
  {
    userId: { type: String, default: null },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    joined: { type: Date, default: Date.now },
  },
  { _id: false }
)

// Esquema de Sessão do Quiz
const QuizSessionSchema = new Schema<IQuizSession>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    isActive: { type: Boolean, default: false },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    participants: { type: [ParticipantSchema], default: [] },
  },
  { timestamps: true }
)

// Modelos
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema)
export const QuizResult = mongoose.models.QuizResult || mongoose.model<IQuizResult>('QuizResult', QuizResultSchema)
export const QuizSession = mongoose.models.QuizSession || mongoose.model<IQuizSession>('QuizSession', QuizSessionSchema)