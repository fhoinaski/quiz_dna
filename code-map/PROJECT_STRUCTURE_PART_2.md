# Estrutura do Projeto - Parte PART_2

**Gerado em:** 23/02/2025, 22:16:51  
**Node Version:** v18.20.4  
**Diretório Raiz:** `E:\Projetos\quiz-dna\dna-vital-quiz-next`

- 📁 src/
  - 📁 app/
    - 📁 (auth)/
      - 📁 login/
        - 📄 page.tsx
        
```tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { gsap } from 'gsap'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Credenciais inválidas')
      // Efeito de shake no formulário
      if (formRef.current) {
        gsap.to(formRef.current, {
          x: -10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(formRef.current!, { x: 0 }),
        })
      }
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  // Efeito de partículas
  useEffect(() => {
    if (!particlesRef.current) return

    const particleCount = window.innerWidth < 768 ? 20 : 50
    const particles = Array.from({ length: particleCount }).map(() => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-primary-light rounded-full opacity-30'
      particlesRef.current?.appendChild(particle)
      return particle
    })

    particles.forEach((particle) => {
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      })

      gsap.to(particle, {
        duration: 3 + Math.random() * 2,
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 100 - 50}`,
        opacity: 0.1 + Math.random() * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    return () => {
      particles.forEach((particle) => particle.remove())
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Container das partículas */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      <motion.div
        ref={formRef}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', bounce: 0.3 }}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200 relative z-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex justify-center mb-6"
        >
          <Dna className="w-12 h-12 text-primary" />
        </motion.div>

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Bem-vindo ao DNA Vital Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
            disabled={loading}
            className={`border-gray-300 focus:ring-primary ${
              error ? 'border-error animate-pulse' : ''
            }`}
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            disabled={loading}
            className={`border-gray-300 focus:ring-primary ${
              error ? 'border-error animate-pulse' : ''
            }`}
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-error text-sm text-center"
              role="alert"
            >
              {error}
            </motion.p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary hover:bg-primary-dark text-white"
            aria-label="Entrar no sistema"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-t-white border-gray-300 rounded-full"
              />
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
        ```

      - 📁 register/
        - 📄 page.tsx
        
```tsx
'use client'

import { useState,  useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Dna } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'

import { AnimatedBackground } from '@/components/ui/AnimatedBackground'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1 
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    const { name, email, password, confirmPassword } = formData

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar conta')
      }

      router.push('/login?registered=true')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setErrorMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4 overflow-hidden relative">
      <AnimatedBackground 
        variant="quiz" 
        density="medium" 
        speed="normal" 
        interactive={true} 
        className="z-0"
      />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        ref={containerRef}
        className="relative z-10 w-full max-w-lg"
      >
        <motion.div 
          className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-blue-100 p-8"
          variants={itemVariants}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex justify-center mb-6"
          >
            <Dna size={80} className="text-blue-600" />
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-8 text-gray-800"
          >
            Junte-se ao DNA Vital Quiz
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <Input
                label="Nome"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="bg-gray-50 text-gray-800 placeholder-gray-400 border-blue-200 focus:ring-blue-400"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="bg-gray-50 text-gray-800 placeholder-gray-400 border-blue-200 focus:ring-blue-400"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Senha"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                disabled={loading}
                className="bg-gray-50 text-gray-800 placeholder-gray-400 border-blue-200 focus:ring-blue-400"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Confirmar Senha"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                minLength={6}
                disabled={loading}
                className="bg-gray-50 text-gray-800 placeholder-gray-400 border-blue-200 focus:ring-blue-400"
              />
            </motion.div>

            <AnimatePresence>
              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm text-center"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants}>
              {/* Substituindo Button por motion.button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                    </svg>
                    Criando conta...
                  </span>
                ) : (
                  'Criar conta'
                )}
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Já tem uma conta? Faça login
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}
        ```

    - 📁 api/
      - 📁 auth/
        - 📁 [...nextauth]/
          - 📄 route.ts
          
```typescript

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Export simplificado
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
          ```

      - 📁 profile/
        - 📄 route.ts
        
```typescript
// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { Model } from "mongoose"
import { IUser, User } from "@/models"
import bcrypt from "bcryptjs"

type UserModel = Model<IUser>

// GET - Obter perfil do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const user = await (User as UserModel).findById(
      session.user.id,
      { password: 0 } // Excluir o campo password
    )

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar perfil do usuário
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    await connectToDatabase()

    // Se houver nova senha, fazer hash
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10)
    }

    const updatedUser = await (User as UserModel).findByIdAndUpdate(
      session.user.id,
      { $set: body },
      { new: true, select: '-password' }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    )
  }
}
        ```

      - 📁 quiz/
        - 📄 route.ts
        
```typescript
// src/app/api/quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

import {  Quiz } from "@/models";



// POST - Criar novo quiz
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.title || !body.description || !body.questions || typeof body.totalTimeLimit !== 'number') {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    await connectToDatabase()

    const quiz = await Quiz.create({
      title: body.title,
      description: body.description,
      questions: body.questions,
      totalTimeLimit: body.totalTimeLimit, // Tempo em minutos
      userId: new mongoose.Types.ObjectId(session.user.id),
      isPublished: body.isPublished || false,
    })

    return NextResponse.json({ success: true, quiz }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/quiz] Error:', error)
    return NextResponse.json({ error: 'Erro ao criar quiz' }, { status: 500 })
  }
}

// GET - Listar quizzes do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();

    const quizzes = await Quiz.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(session.user.id) } },
      {
        $lookup: {
          from: "quizresults",
          localField: "_id",
          foreignField: "quizId",
          as: "results",
        },
      },
      {
        $project: {
          id: { $toString: "$_id" },
          title: 1,
          description: 1,
          isPublished: 1,
          createdAt: 1,
          _count: {
            results: { $size: "$results" },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar quizzes:", error);
    return NextResponse.json({ error: "Erro ao listar quizzes" }, { status: 500 });
  }
}

// DELETE - Excluir um quiz
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const url = new URL(request.url);
    const quizId = url.pathname.split('/').pop(); // Extrai o quizId da URL

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const quiz = await Quiz.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(quizId),
      userId: new mongoose.Types.ObjectId(session.user.id),
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado ou não pertence ao usuário" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quiz excluído com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir quiz:", error);
    return NextResponse.json({ error: "Erro ao excluir quiz" }, { status: 500 });
  }
}
        ```

        - 📁 [quizId]/
          - 📁 public/
            - 📄 route.ts
            
```typescript
// src/app/api/quiz/[quizId]/public/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, Quiz } from "@/models";

// Tipando o modelo Quiz explicitamente
type QuizModel = Model<IQuiz>;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: 'Parâmetro quizId inválido' },
        { status: 400 }
      );
    }

    // Conectar ao banco de dados
    await connectToDatabase();

    // Buscar o quiz, verificando se ele está publicado (isPublished: true)
    const quiz = await (Quiz as QuizModel)
      .findOne({ 
        _id: quizId,
        isPublished: true // Apenas quizzes públicos podem ser acessados por essa rota
      })
      .exec();

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz não encontrado ou não está disponível publicamente' },
        { status: 404 }
      );
    }

    // Transformar o documento do Mongoose em um objeto simples
    // Remover informações sensíveis como userId para rotas públicas
    const quizData = {
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      // Para quizzes públicos, talvez queira omitir a resposta correta
      questions: quiz.questions.map(q => ({
        text: q.text,
        options: q.options,
        order: q.order,
        correctAnswer: q.correctAnswer // Incluindo a resposta correta para o quiz funcionar
      })),
      isPublished: quiz.isPublished
    };

    return NextResponse.json(quizData);
  } catch (error) {
    console.error(`Erro na rota /quiz/[quizId]/public: ${error}`);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
            ```

          - 📁 ranking/
            - 📄 route.ts
            
```typescript
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizResult, Quiz, QuizResult } from "@/models";

type QuizModel = Model<IQuiz>;
type QuizResultModel = Model<IQuizResult>;

// GET - Obter ranking do quiz
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const params = await context.params;
    const { quizId } = params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verificar se o quiz existe
    const quiz = await (Quiz as QuizModel).findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      );
    }

    // Buscar resultados do quiz
    const results = await (QuizResult as QuizResultModel)
      .find({ quizId })
      .sort({ score: -1, timeSpent: 1 }) // Ordem decrescente por score, crescente por tempo
      .lean();

    // Formatar o ranking usando o score salvo
    const rankings = results.map((result, index) => ({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score, // Usa o score salvo, que já inclui o bônus
      timeSpent: result.timeSpent,
      rank: index + 1,
      createdAt: result.createdAt.toISOString(),
    }));

    console.log(`Ranking para quiz ${quizId}:`, rankings);

    return NextResponse.json(rankings);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
            ```

          - 📁 results/
            - 📁 public/
              - 📄 route.ts
              
```typescript
// src/app/api/quiz/[quizId]/results/public/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizResult, Quiz, QuizResult } from "@/models";

// Tipando os modelos explicitamente
type QuizModel = Model<IQuiz>;
type QuizResultModel = Model<IQuizResult>;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      // Retornar array vazio em vez de erro
      return NextResponse.json([], { status: 200 });
    }

    // Conectar ao banco de dados
    await connectToDatabase();

    // Verificar se o quiz existe e é público
    const quiz = await (Quiz as QuizModel)
      .findOne({ _id: quizId, isPublished: true })
      .exec();

    if (!quiz) {
      // Retornar array vazio em vez de erro
      return NextResponse.json([], { status: 200 });
    }

    // Buscar os resultados do quiz
    const results = await (QuizResult as QuizResultModel)
      .find({ quizId })
      .sort({ score: -1, createdAt: -1 })
      .exec();

    // Se não houver resultados, retornar array vazio
    if (!results || results.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Transformar os documentos do Mongoose em objetos simples
    const formattedResults = results.map(result => ({
      id: result._id.toString(),
      quizId: result.quizId.toString(),
      playerName: result.playerName,
      score: result.score,
      totalQuestions: result.totalQuestions,
      createdAt: result.createdAt,
    }));

    // Garantir que sempre retornamos um array, mesmo se vazio
    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error) {
    console.error(`Erro na rota /quiz/[quizId]/results/public: ${error}`);
    // Retornar array vazio em caso de erro
    return NextResponse.json([], { status: 200 });
  }
}
              ```

            - 📄 route.ts
            
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { Quiz, QuizResult } from "@/models";



// Função para calcular a pontuação regressiva (igual ao cliente)
function calculateRegressiveScore(timeToAnswer: number, maxTime: number = 10): number {
  const timeInSeconds = timeToAnswer / 1000; // Converte de ms para s
  console.log(`Calculating regressive score for ${timeInSeconds} seconds`);
  const maxScore = 1000;
  if (timeInSeconds >= maxTime) return 0;
  const score = Math.floor(maxScore * (1 - timeInSeconds / maxTime));
  return Math.max(score, 0);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await context.params;
    console.log("Requisição GET para resultados do quiz:", quizId);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const quiz = await Quiz.findOne({
      _id: quizId,
      userId: session.user.id,
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    const results = await QuizResult.find({ quizId })
      .sort({ createdAt: -1 })
      .lean();

    const formattedResults = results.map((result) => ({
      id: result._id.toString(),
      playerName: result.playerName,
      score: result.score,
      totalQuestions: quiz.questions.length,
      createdAt: result.createdAt.toISOString(),
    }));

    return NextResponse.json({
      quiz: {
        id: quiz._id.toString(),
        title: quiz.title,
      },
      results: formattedResults,
    });
  } catch (error) {
    console.error("Erro ao buscar resultados:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await context.params;
    console.log("Requisição POST para salvar resultado do quiz:", quizId);

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { playerName, playerAvatar, answers } = body;

    if (!playerName || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Dados incompletos: playerName e answers são obrigatórios" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    const totalQuestions = quiz.questions.length;
    const enrichedAnswers = answers.map((answer: any) => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      return {
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        timeToAnswer: answer.timeToAnswer,
        isCorrect: isCorrect || false,
      };
    });

    // Calcular pontuação total com regressão
    const score = enrichedAnswers.reduce((acc: number, answer: any) => {
      const timeInSeconds = answer.timeToAnswer / 1000; // Converte de ms para s
      const questionScore = answer.isCorrect ? calculateRegressiveScore(answer.timeToAnswer) : 0;
      console.log(`Answer ${answer.questionIndex}: isCorrect=${answer.isCorrect}, timeToAnswer=${timeInSeconds}s, score=${questionScore}`);
      return acc + questionScore;
    }, 0);

    const timeSpent = enrichedAnswers.reduce((acc: number, answer: any) => {
      return acc + answer.timeToAnswer / 1000; // Soma o tempo em segundos
    }, 0);

    console.log(`Pontuação calculada: ${score}, Time Spent: ${timeSpent}s`);

    const result = await QuizResult.create({
      quizId,
      userId: null,
      playerName,
      playerAvatar: playerAvatar || "",
      score,
      totalQuestions,
      timeSpent,
      answers: enrichedAnswers,
    });

    return NextResponse.json(
      {
        id: result._id.toString(),
        score,
        playerName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao salvar resultado:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await context.params;
    console.log("Requisição DELETE para zerar resultados do quiz:", quizId);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();

    const quiz = await Quiz.findOne({
      _id: quizId,
      userId: session.user.id,
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    const deleteResult = await QuizResult.deleteMany({ quizId });

    return NextResponse.json({
      message: "Resultados zerados com sucesso",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Erro ao zerar resultados:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
            ```

          - 📄 route.ts
          
```typescript
// src/app/api/quiz/[quizId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, Quiz } from "@/models";

// Tipando o modelo Quiz explicitamente
type QuizModel = Model<IQuiz>;

// GET - Obter quiz por ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Buscar o quiz e verificar se o usuário tem permissão
    const quiz = await (Quiz as QuizModel)
      .findOne({
        _id: quizId,
        userId: session.user.id,
      })
      .exec();

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado ou não autorizado" },
        { status: 404 }
      );
    }

    // Transformar o documento do Mongoose em um objeto simples
    const quizData = {
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions,
      isPublished: quiz.isPublished,
      userId: quiz.userId.toString(),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    };

    return NextResponse.json(quizData);
  } catch (error) {
    console.error(`Erro ao obter quiz: ${error}`);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar quiz existente
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validação básica dos campos obrigatórios
    if (!body.title || !body.description || !body.questions) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Verificar se o quiz existe e pertence ao usuário
    const existingQuiz = await (Quiz as QuizModel)
      .findOne({
        _id: quizId,
        userId: session.user.id,
      })
      .exec();

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado ou não autorizado" },
        { status: 404 }
      );
    }

    // Atualiza o quiz
    const updatedQuiz = await (Quiz as QuizModel).findByIdAndUpdate(
      quizId,
      {
        title: body.title,
        description: body.description,
        questions: body.questions,
        isPublished: body.isPublished || false, // Garantir que o campo isPublished seja atualizado
      },
      { new: true } // Retorna o documento atualizado
    );

    // Transformar o documento do Mongoose em um objeto simples
    const quizData = {
      id: updatedQuiz._id.toString(),
      title: updatedQuiz.title,
      description: updatedQuiz.description,
      questions: updatedQuiz.questions,
      isPublished: updatedQuiz.isPublished,
      userId: updatedQuiz.userId.toString(),
      createdAt: updatedQuiz.createdAt,
      updatedAt: updatedQuiz.updatedAt
    };

    return NextResponse.json(quizData);
  } catch (error) {
    console.error(`Erro ao atualizar quiz: ${error}`);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir quiz existente
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Aguardar os parâmetros
    const params = await context.params;
    const { quizId } = params;

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
      );
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Verificar se o quiz existe e pertence ao usuário
    const existingQuiz = await (Quiz as QuizModel)
      .findOne({
        _id: quizId,
        userId: session.user.id,
      })
      .exec();

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado ou não autorizado" },
        { status: 404 }
      );
    }

    // Excluir o quiz
    await (Quiz as QuizModel).findByIdAndDelete(quizId);

    // Também poderia excluir resultados associados aqui, se necessário
    // await QuizResult.deleteMany({ quizId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Erro ao excluir quiz: ${error}`);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
          ```

          - 📁 session/
            - 📁 join/
              - 📄 route.ts
              
```typescript
// src/app/api/quiz/[quizId]/session/join/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from "mongoose";

import {  QuizSession } from '@/models'



interface JoinRequestBody {
  playerName: string
  playerAvatar: string
  userId?: string | null
}

export async function POST(request: NextRequest, context: { params: Promise<{ quizId: string }> }) {
  try {
    const params = await context.params
    const { quizId } = params

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: 'ID de quiz inválido', details: 'O quizId fornecido não é um ObjectId válido' },
        { status: 400 }
      )
    }

    const body: JoinRequestBody = await request.json()
    const { playerName, playerAvatar, userId } = body

    if (!playerName) {
      return NextResponse.json({ error: 'Nome do jogador é obrigatório' }, { status: 400 })
    }

    await connectToDatabase()

    const session = await QuizSession.findOneAndUpdate(
      { quizId },
      {
        $push: {
          participants: {
            userId: userId || null,
            name: playerName,
            avatar: playerAvatar || '🧑‍🚀', // Avatar padrão se não fornecido
            joined: new Date(),
            score: 0,
            timeBonus: 0,
            lastActive: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({ success: true, session })
  } catch (error) {
    console.error('Error in join session:', error)
    return NextResponse.json(
      { error: 'Erro ao entrar na sessão', details: error.message },
      { status: 500 }
    )
  }
}
              ```

            - 📄 route.ts
            
```typescript
// src/app/api/quiz/[quizId]/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

import {  Quiz, IQuizSession, QuizSession } from "@/models";



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();
    const session = await QuizSession.findOne({ quizId }) as IQuizSession | null;

    return NextResponse.json({
      exists: !!session,
      isActive: session?.isActive || false,
      startsAt: session?.startsAt || null,
      endsAt: session?.endsAt || null,
      timeLimit: session?.timeLimit || 30,
      participants: session?.participants || [],
      currentQuestion: session?.currentQuestion || 0,
    });
  } catch (error) {
    console.error("Erro ao buscar sessão:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> } // params é uma Promise
) {
  try {
    const { quizId } = await params; // Aguarde a resolução da Promise
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "ID de quiz inválido" }, { status: 400 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { action, timeLimit } = body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    }

    let session = await QuizSession.findOne({ quizId }) as IQuizSession | null;

    switch (action) {
      case "start":
        if (!session) {
          session = await QuizSession.create({
            quizId,
            isActive: true,
            isPaused: false,
            timeLimit: timeLimit || 30,
            startsAt: new Date(),
            endsAt: null,
            currentQuestion: 0,
            participants: [],
          }) as IQuizSession;
        } else if (!session.isActive) {
          session.isActive = true;
          session.startsAt = new Date();
          session.endsAt = null;
          await session.save();
        }
        break;

      case "stop":
        if (session && session.isActive) {
          session.isActive = false;
          session.endsAt = new Date();
          await session.save();
        }
        break;

      case "reset":
        if (session) {
          await QuizSession.deleteOne({ quizId });
          session = null;
        }
        break;

      case "updateSettings":
        if (!session) {
          return NextResponse.json(
            { error: "Nenhuma sessão existente para atualizar" },
            { status: 400 }
          );
        }
        if (typeof timeLimit !== "number" || timeLimit < 10 || timeLimit > 300) {
          return NextResponse.json(
            { error: "Tempo limite inválido (deve ser entre 10 e 300 segundos)" },
            { status: 400 }
          );
        }
        session.timeLimit = timeLimit;
        await session.save();
        break;

      default:
        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }

    return NextResponse.json({
      message: "Ação executada com sucesso",
      session: {
        exists: !!session,
        isActive: session?.isActive || false,
        startsAt: session?.startsAt || null,
        endsAt: session?.endsAt || null,
        timeLimit: session?.timeLimit || 30,
        participants: session?.participants || [],
      },
    });
  } catch (error) {
    console.error("[POST /session]", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

            ```

      - 📁 quizzes/
        - 📄 route.ts
        
```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'
import { Quiz } from '@/models'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.log('Sessão inválida ou usuário não autenticado:', session)
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await connectToDatabase()

    const quizzes = await Quiz.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(session.user.id) } },
      {
        $lookup: {
          from: 'quizresults',
          localField: '_id',
          foreignField: 'quizId',
          as: 'results'
        }
      },
      {
        $project: {
          id: '$_id',
          title: 1,
          description: 1,
          createdAt: 1,
          '_count.results': { $size: '$results' }
        }
      }
    ])

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Erro ao buscar quizzes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
        ```

      - 📁 register/
        - 📄 route.ts
        
```typescript
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { Model } from "mongoose";
import { IUser, User } from "@/models";

// Tipagem explícita do modelo User
type UserModel = Model<IUser>;

export async function POST(request: NextRequest) {
  console.log("Requisição recebida em /api/register");

  try {
    // Conecta ao banco de dados primeiro
    await connectToDatabase();

    // Tenta parsear o corpo da requisição com segurança
    let body;
    try {
      body = await request.json();
      console.log("Corpo da requisição recebido:", { 
        name: body.name, 
        email: body.email,
        password: body.password ? "[REDACTED]" : undefined 
      });
    } catch (jsonError) {
      console.error("Erro ao parsear JSON da requisição:", jsonError);
      return NextResponse.json(
        { error: "Formato de dados inválido" }, 
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    // Validação dos campos
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: "Email válido é obrigatório" }, { status: 400 });
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 6 caracteres" }, 
        { status: 400 }
      );
    }

    // Verifica se o email já está em uso - com cast explícito para UserModel
    const existingUser = await (User as UserModel).findOne({ email });

    if (existingUser) {
      console.log("Email já em uso:", email);
      return NextResponse.json(
        { error: "Email já está em uso" }, 
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário - com cast explícito para UserModel
    const user = await (User as UserModel).create({
      name,
      email,
      password: hashedPassword,
    });

    // Retorna o usuário criado (sem a senha)
    const newUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    console.log("Usuário criado com sucesso:", { id: newUser.id, name: newUser.name, email: newUser.email });
    
    return NextResponse.json(newUser, { status: 201 });
    
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    
    // Mensagem de erro mais detalhada para debugging
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Erro desconhecido";
      
    return NextResponse.json(
      { 
        error: "Erro interno do servidor", 
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      }, 
      { status: 500 }
    );
  }
}
        ```

    - 📁 dashboard/
      - 📁 documentation/
        - 📄 page.tsx
        
```tsx
// src/app/dashboard/documentation/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Book, Search, Terminal,  Settings, Database } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

const sections = [
  {
    title: 'Começando',
    icon: Book,
    content: `
      # Introdução ao Quiz DNA
      
      O Quiz DNA é uma plataforma moderna para criação e gerenciamento de quizzes interativos.
      
      ## Funcionalidades Principais
      
      - Criação de quizzes personalizados
      - Sistema de pontuação em tempo real
      - Ranking de participantes
      - Análise de resultados
      - Compartilhamento fácil
    `
  },
  {
    title: 'Criando Quizzes',
    icon: Terminal,
    content: `
      # Como Criar um Quiz
      
      1. Acesse o Dashboard
      2. Clique em "Novo Quiz"
      3. Preencha as informações básicas
      4. Adicione suas questões
      5. Configure as opções de tempo
      6. Salve e publique
    `
  },
  {
    title: 'Configurações Avançadas',
    icon: Settings,
    content: `
      # Configurações do Quiz
      
      - Tempo por questão
      - Pontuação personalizada
      - Opções de compartilhamento
      - Configurações de privacidade
    `
  },
  {
    title: 'Gerenciamento de Dados',
    icon: Database,
    content: `
      # Gerenciando seus Dados
      
      - Exportação de resultados
      - Backup de quizzes
      - Análise de desempenho
      - Relatórios detalhados
    `
  }
]

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState(0)

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Documentação</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar na documentação..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1 p-4">
          <nav>
            {filteredSections.map((section, index) => (
              <motion.button
                key={section.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 ${
                  selectedSection === index
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSection(index)}
              >
                <section.icon className="w-5 h-5" />
                {section.title}
              </motion.button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <Card className="md:col-span-3 p-6">
          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose max-w-none"
          >
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
              {/* <filteredSections[selectedSection].icon className="w-6 h-6" /> */}
              {filteredSections[selectedSection].title}
            </h2>
            <div className="markdown-content">
              {filteredSections[selectedSection].content}
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  )
}
        ```

      - 📁 help/
        - 📄 page.tsx
        
```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  HelpCircle,
  Book,
  MessageCircle,
  Video,
  ChevronRight,
  Mail,
  X
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

const helpTopics = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos',
    description: 'Aprenda a criar e gerenciar seus primeiros quizzes',
    icon: Book,
    articles: [
      'Como criar um novo quiz',
      'Gerenciando participantes',
      'Configurando tempo e pontuação'
    ]
  },
  {
    id: 'quiz-management',
    title: 'Gerenciamento de Quiz',
    description: 'Dicas avançadas para gerenciar suas sessões',
    icon: MessageCircle,
    articles: [
      'Monitorando sessões ativas',
      'Analisando resultados',
      'Customizando configurações'
    ]
  },
  {
    id: 'tutorials',
    title: 'Tutoriais em Vídeo',
    description: 'Aprenda através de nossos vídeos explicativos',
    icon: Video,
    articles: [
      'Tutorial básico',
      'Recursos avançados',
      'Melhores práticas'
    ]
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  // Função auxiliar para pesquisa segura
  const searchInString = (text: string, query: string): boolean => {
    return text.toLowerCase().includes(query.toLowerCase())
  }

  const filteredTopics = helpTopics.filter(topic => {
    if (!searchQuery) return true
    return (
      searchInString(topic.title, searchQuery) ||
      searchInString(topic.description, searchQuery) ||
      topic.articles.some(article => searchInString(article, searchQuery))
    )
  })

  // Encontrar o tópico selecionado
  const currentTopic = selectedTopic 
    ? helpTopics.find(topic => topic.id === selectedTopic) 
    : null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <HelpCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Como podemos ajudar?
          </h1>
          <p className="text-gray-600 mb-8">
            Encontre respostas para suas dúvidas sobre o sistema de quiz
          </p>

          {/* Barra de Pesquisa */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Pesquisar ajuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Exibir detalhes do tópico selecionado */}
        {currentTopic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{currentTopic.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTopic(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-gray-600 mb-4">{currentTopic.description}</p>
            <ul className="space-y-2">
              {currentTopic.articles.map((article, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  {article}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Grid de Tópicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-white hover:shadow-lg transition-shadow">
                <motion.button
                  onClick={() => setSelectedTopic(topic.id)}
                  className="w-full text-left p-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <topic.icon className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <div className="space-y-2">
                    {topic.articles.map((article, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-gray-700 hover:text-blue-500"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        <span>{article}</span>
                      </div>
                    ))}
                  </div>
                </motion.button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Seção de Contato */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ainda precisa de ajuda?
            </h2>
            <p className="text-gray-600 mb-6">
              Nossa equipe está pronta para ajudar você com qualquer dúvida
            </p>
            <Button
              onClick={() => window.location.href = 'mailto:suporte@exemplo.com'}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contatar Suporte
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
        ```

      - 📄 layout.tsx
      
```tsx
// src/app/dashboard/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  
  // Verificar autenticação
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') || localStorage.getItem('manual_auth')
    
    const checkAuth = () => {
      if (status === 'unauthenticated' && !isAuth) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }
    
    const timer = setTimeout(checkAuth, 500)
    return () => clearTimeout(timer)
  }, [status, router])
  
  // Detectar tamanho da tela para sidebar responsiva
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Toggle para sidebar em dispositivos móveis
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }
  
  // Função de logout corrigida
  const handleLogout = async () => {
    try {
      // Limpar localStorage primeiro
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('manual_auth')
      localStorage.removeItem('auth_timestamp')
      
      // Fazer logout via NextAuth
      await signOut({ 
        redirect: false 
      })
      
      // Forçar redirecionamento completo
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Redirecionar mesmo em caso de erro
      window.location.href = '/login'
    }
  }
  
  // Mostrar loader enquanto verifica autenticação
  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="ml-3">Verificando autenticação...</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header responsivo */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-semibold text-gray-800">DNA Vital Quiz</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-gray-600">
              {session?.user?.email || 'Usuário'}
            </span>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar responsiva */}
        <div 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0
            fixed lg:static left-0 top-16 h-[calc(100vh-4rem)] z-20
            w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          `}
        >
          <Sidebar />
        </div>
        
        {/* Overlay para fechar sidebar em dispositivos móveis */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Conteúdo principal - children será o conteúdo de page.tsx */}
        <main className={`flex-1 p-4 md:p-6 overflow-auto transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
      ```

      - 📄 page.tsx
      
```tsx
'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { QuizList } from '@/components/dashboard/QuizList'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Meus Quizzes</h1>
        <Link href="/dashboard/quiz/create">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-md whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Quiz
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-4 md:p-6"
      >
        <QuizList />
      </motion.div>

      {/* Informações adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Instruções Rápidas</h2>
          <p className="text-gray-600 text-sm">
            Crie quizzes interativos e gerencie sessões diretamente do dashboard. Inicie ou pare quizzes com um clique!
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Ajuda</h2>
          <p className="text-gray-600 text-sm mb-3">
            Precisa de ajuda para utilizar a plataforma?
          </p>
          <Link href="/dashboard/documentation" className="text-blue-600 text-sm hover:underline">
            Acessar documentação →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
      ```

      - 📁 profile/
        - 📄 page.tsx
        
```tsx
// src/app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProfileSettings } from '@/components/dashboard/ProfileSettings'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import {
  User,
  
  Shield,
  
 
  Trash2,
  BarChart,
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const tabs = [
  { 
    id: 'general', 
    label: 'Geral', 
    icon: User,
    description: 'Informações básicas e preferências'
  },
  { 
    id: 'security', 
    label: 'Segurança', 
    icon: Shield,
    description: 'Senha e autenticação'
  },

]

interface ProfileStats {
  totalQuizzes: number
  totalParticipants: number
  avgScore: number
  bestScore: number
  lastActive: string
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalQuizzes: 0,
    totalParticipants: 0,
    avgScore: 0,
    bestScore: 0,
    lastActive: ''
  })

  useEffect(() => {
    // Simular carregamento das estatísticas
    const fetchStats = async () => {
      setLoading(true)
      try {
        // TODO: Substituir por chamada real à API
        const response = await fetch('/api/profile/stats')
        const data = await response.json()
        setProfileStats(data)
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implementar lógica de exclusão
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowDeleteDialog(false)
      // Redirecionar para logout
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Configurações de Perfil
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas preferências e informações pessoais
          </p>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Quizzes</p>
                <p className="text-xl font-semibold">
                  {loading ? '-' : profileStats.totalQuizzes}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Participantes</p>
                <p className="text-xl font-semibold">
                  {loading ? '-' : profileStats.totalParticipants}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Melhor Pontuação</p>
                <p className="text-xl font-semibold">
                  {loading ? '-' : profileStats.bestScore}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Atividade</p>
                <p className="text-xl font-semibold">
                  {loading ? '-' : new Date(profileStats.lastActive).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Navegação */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="overflow-hidden">
              <nav className="divide-y divide-gray-100">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center p-4 transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`mr-3 ${
                        activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className={`font-medium ${
                          activeTab === tab.id ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {tab.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          {tab.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </Card>

            {/* Zona de Perigo */}
            <Card className="p-4 border-red-100">
              <h3 className="text-red-600 font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Zona de Perigo
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ações que não podem ser desfeitas
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Conta
              </Button>
            </Card>
          </motion.div>

          {/* Área Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <Card className="p-6">
              <ProfileSettings activeTab={activeTab} />
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita
              e todos os seus dados serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, excluir minha conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
        ```

      - 📁 quiz/
        - 📁 create/
          - 📄 page.tsx
          
```tsx
'use client'


import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { QuizForm } from '@/components/dashboard/QuizForm'

export default function CreateQuizPage() {
  // const router = useRouter()

  // Dados iniciais para um novo quiz (explicitamente definindo isPublished como false)
  const initialData = {
    title: '',
    description: '',
    questions: [
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        order: 0
      }
    ],
    isPublished: false // definido explicitamente como false para um novo quiz
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para o Dashboard
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-6">Criar Novo Quiz</h1>
        
        <QuizForm initialData={initialData} />
      </motion.div>
    </div>
  )
}
          ```

        - 📁 [quizId]/
          - 📁 edit/
            - 📄 page.tsx
            
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { QuizForm } from '@/components/dashboard/QuizForm'
import { QuizControlPanel } from '@/components/dashboard/QuizControlPanel'

interface Question {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  totalTimeLimit: number
  isPublished: boolean
}

export default function EditQuizPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/quiz/${quizId}`, {
          headers: { 'Cache-Control': 'no-cache' }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Falha ao carregar quiz')
        }

        const data = await response.json()
        setQuiz(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar quiz')
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 p-6 rounded-lg shadow-md"
        >
          <p className="text-error text-lg font-medium">{error || 'Quiz não encontrado'}</p>
          <Link href="/dashboard" className="mt-4 inline-flex items-center text-primary hover:text-primary-dark transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para Dashboard
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <nav className="text-sm text-gray-600 mb-4">
          <Link href="/dashboard" className="hover:text-primary">Dashboard</Link> / Editar Quiz
        </nav>
        <Link href="/dashboard" className="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-2 text-gray-800">Editar Quiz</h1>
      </motion.div>

      <QuizControlPanel quizId={quizId} />
      <QuizForm
        initialData={{
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
          totalTimeLimit: quiz.totalTimeLimit,
          isPublished: quiz.isPublished
        }}
      />
    </div>
  )
}
            ```

          - 📁 results/
            - 📄 page.tsx
            
```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Result {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

interface Quiz {
  id: string;
  title: string;
}

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  const [results, setResults] = useState<Result[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResults = useCallback(async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/quiz/${quizId}/results`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao carregar resultados");
      }
      
      const data = await response.json();
      
      // Validar estrutura dos dados
      if (!data.quiz || !data.results || !Array.isArray(data.results)) {
        throw new Error("Formato de dados inválido");
      }

      // Validar e formatar os resultados
      const validResults = data.results.filter((result: any) => {
        return (
          result &&
          typeof result.id === 'string' &&
          typeof result.playerName === 'string' &&
          typeof result.score === 'number' &&
          typeof result.totalQuestions === 'number' &&
          typeof result.createdAt === 'string'
        );
      });

      setQuiz(data.quiz);
      setResults(validResults);
    } catch (err: any) {
      const errorMessage = err.message || "Erro desconhecido";
      setError(errorMessage);
      if (errorMessage === "Não autorizado") {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [quizId, router]);

  const handleDeleteResults = async () => {
    if (!quizId) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/quiz/${quizId}/results`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao zerar resultados");
      }

      setResults([]);
    } catch (err: any) {
      setError(err.message || "Erro ao zerar resultados");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      fetchResults();
    }
  }, [quizId, fetchResults]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Resultados: {quiz?.title || "Carregando..."}
            </h1>
          </div>
          {results.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Zerar Resultados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja zerar todos os resultados deste
                    quiz? Essa ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteResults}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Zerar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </motion.div>

        {/* Estado de Carregamento */}
        {loading && (
          <Card className="p-6 flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </Card>
        )}

        {/* Erro */}
        <AnimatePresence>
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <Card className="p-6 bg-red-50 border-red-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-red-800">
                      Erro
                    </h2>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resultados */}
        {!loading && !error && quiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 sm:p-6">
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Nenhum resultado encontrado para este quiz.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">
                          Posição
                        </th>
                        <th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">
                          Jogador
                        </th>
                        <th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">
                          Pontuação
                        </th>
                        <th className="py-3 px-2 sm:px-4 text-sm font-semibold text-gray-700">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr
                          key={result.id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <td className="py-3 px-2 sm:px-4 flex items-center gap-2">
                            {index < 3 ? (
                              <Trophy
                                className={`w-5 h-5 ${
                                  index === 0
                                    ? "text-yellow-500"
                                    : index === 1
                                    ? "text-gray-400"
                                    : "text-amber-600"
                                }`}
                              />
                            ) : null}
                            {index + 1}º
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-gray-800">
                            {result.playerName}
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-gray-800">
                            {result.score}/{result.totalQuestions}
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-gray-600 text-sm">
                            {new Date(result.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
            ```

      - 📁 results/
        - 📄 page.tsx
        
```tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { BarChart2, AlertTriangle, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

interface QuizWithResultCount {
  id: string
  title: string
  description: string
  _count: {
    results: number
  }
  createdAt: string
}

export default function DashboardResultsPage() {
  const [quizzes, setQuizzes] = useState<QuizWithResultCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const hasFetched = useRef(false) // Controle para evitar loop

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/quizzes', { credentials: 'include' })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao carregar os quizzes')
      }
      const data = await response.json()
      console.log('Quizzes recebidos:', data)
      const formattedData = data
        .map((quiz: any) => ({
          id: quiz.id || quiz._id.toString(),
          title: quiz.title,
          description: quiz.description,
          _count: { results: quiz._count?.results || 0 },
          createdAt: quiz.createdAt,
        }))
        // Ordenar da maior para a menor quantidade de resultados
        .sort((a: QuizWithResultCount, b: QuizWithResultCount) => b._count.results - a._count.results)
      setQuizzes(formattedData)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar os quizzes')
      console.error('Erro ao carregar quizzes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!hasFetched.current) {
      fetchQuizzes()
      hasFetched.current = true // Marca como já buscado
    }
  }, [fetchQuizzes])

  // Animação GSAP para entrada dos cards
  useEffect(() => {
    if (!loading && quizzes.length > 0 && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    }
  }, [loading, quizzes])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-600">Carregando resultados...</p>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className="max-w-md mx-auto mt-12 p-6 bg-red-50 rounded-xl shadow-md"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
        <Button
          onClick={() => {
            setError('')
            fetchQuizzes()
          }}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-all duration-200"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
        >
          Tentar Novamente
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-indigo-600" />
            Resultados dos Quizzes
          </h1>
          <Link href="/dashboard/quiz/create">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-200"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Quiz
            </Button>
          </Link>
        </motion.div>

        {quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-xl font-medium mb-6">
              Nenhum resultado encontrado
            </p>
            <Link href="/dashboard/quiz/create">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Novo Quiz
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-semibold text-gray-800 tracking-tight line-clamp-1">
                        {quiz.title}
                      </h2>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {quiz._count.results} {quiz._count.results === 1 ? 'resultado' : 'resultados'}
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{quiz.description}</p>
                    <div className="text-xs text-gray-500">
                      Criado em: {new Date(quiz.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <Link href={`/dashboard/quiz/${quiz.id}/results`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center gap-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
                        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                      >
                        <BarChart2 className="w-4 h-4" />
                        Ver Resultados
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
        ```

    - 📄 globals.css
    
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%
  }
}
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
    ```

    - 📄 layout.tsx
    
```tsx
import { Suspense } from 'react'
import AuthProvider from '@/providers/SessionProvider'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
    ```

    - 📄 loading.tsx
    
```tsx
export default function Loading() {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }
    ```

    - 📄 page.tsx
    
```tsx
import RedirectToLogin from '@/components/RedirectToLogin';

export default function Home() {
  return <RedirectToLogin />; // Sem elementos extras
}
    ```

    - 📁 quiz/
      - 📁 [quizId]/
        - 📄 page.tsx
        
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuizScreen } from '@/components/quiz/QuizScreen'
import { ResultsScreen } from '@/components/quiz/ResultsScreen'
import { WaitingRoom } from '@/components/quiz/WaitingRoom'
import { WelcomeScreen } from '@/components/quiz/WelcomeScreen'
import { useQuizStore } from '@/store'

export default function QuizPage() {
  const params = useParams()

  const quizId = params.quizId as string
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const { currentQuiz, currentStep, fetchQuiz } = useQuizStore()

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        if (!quizId) {
          throw new Error('ID do quiz não fornecido')
        }
        if (!currentQuiz || currentQuiz.id !== quizId) {
          await fetchQuiz(quizId)
        }
        setLoading(false)
      } catch (err) {
        setError('Erro ao carregar o quiz. Tente novamente.')
        console.error('[QuizPage] Erro:', err)
        setLoading(false)
      }
    }
    loadQuiz()
  }, [quizId, currentQuiz, fetchQuiz])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-800 mb-4">{error}</p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {currentStep === 'welcome' && <WelcomeScreen />}
      {currentStep === 'waiting' && <WaitingRoom />}
      {currentStep === 'quiz' && <QuizScreen />}
      {currentStep === 'results' && <ResultsScreen />}
    </motion.div>
  )
}
        ```

        - 📁 ranking/
          - 📄 page.tsx
          
```tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trophy, ArrowLeft, AlertTriangle } from "lucide-react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

interface Result {
  id: string;
  playerName: string;
  score: number;
  timeSpent: number;
  rank: number;
  createdAt: string;
}

// interface Quiz {
//   id: string;
//   title: string;
// }

export default function RankingPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchRanking = useCallback(async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/quiz/${quizId}/ranking`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch ranking");
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError("Failed to load ranking");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchRanking();
    const interval = setInterval(fetchRanking, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [fetchRanking]);

  useEffect(() => {
    if (containerRef.current && results.length > 0) {
      gsap.from(containerRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }, [results]);

  if (loading && results.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ranking</h1>
        {/* <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link> */}
      </div>

      <div ref={containerRef} className="space-y-4">
        <AnimatePresence>
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'}
                  `}>
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">{result.playerName}</h3>
                    <p className="text-sm text-gray-500">
                      Score: {result.score.toLocaleString()} pts | 
                      Tempo: {result.timeSpent.toFixed(1)}s
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  #{index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Nenhum resultado encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
          ```

  - 📁 components/
    - 📁 auth/
      - 📄 LoginForm.tsx
      
```tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciais inválidas')
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Ocorreu um erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            Acesse sua conta para gerenciar os quizzes
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />

        <Input
          label="Senha"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </Card>
  )
}
      ```

      - 📄 RegisterForm.tsx
      
```tsx

      ```

    - 📁 dashboard/
      - 📄 Header.tsx
      
```tsx
'use client'

import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { LogOut, Menu, User, Bell, Search } from 'lucide-react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type HeaderProps = {
  user?: {
    name?: string | null
    email?: string | null
  }
  onMenuClick?: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  
  const handleSignOut = async () => {
    try {
      // Limpar localStorage primeiro
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('manual_auth')
      localStorage.removeItem('auth_timestamp')
      
      // Forçar redirecionamento antes do signOut para evitar problemas
      await signOut({
        callbackUrl: '/login',
        redirect: false
      })
      
      // Redirecionar manualmente para garantir
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Redirecionar de qualquer forma
      router.push('/login')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 p-1 rounded-full hover:bg-gray-100 lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-gray-100 w-64 py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Bell className="w-6 h-6 text-gray-600" />
          </button>
          
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <span className="hidden md:inline font-medium">
              {user?.name || 'Usuário'}
            </span>
          </button>
        </div>

        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10"
          >
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </motion.div>
        )}
      </div>
    </header>
  )
}
      ```

      - 📄 ProfileSettings.tsx
      
```tsx
// src/components/dashboard/ProfileSettings.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import {
 
  Key,
  Save,
  AlertTriangle,
  Camera,
 
  Check,
  User
} from 'lucide-react'
import Image from 'next/image'

interface ProfileSettingsProps {
  activeTab: string
}

interface UserProfile {
  name: string
  email: string
  phone: string
  language: string
  avatar: string
  notifications: {
    email: boolean
    push: boolean
    quiz: boolean
    marketing: boolean
  }
}

export function ProfileSettings({ activeTab }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    language: 'pt-BR',
    avatar: '',
    notifications: {
      email: true,
      push: true,
      quiz: true,
      marketing: false
    }
  })
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: Substituir por chamada real à API
        const response = await fetch('/api/profile')
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        setError('Não foi possível carregar as informações do perfil')
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // TODO: Implementar lógica de atualização
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch  {
      setError('Erro ao salvar alterações')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) {
      setError('As senhas não coincidem')
      return
    }

    setLoading(true)
    setError('')

    try {
      // TODO: Implementar lógica de alteração de senha
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
      setPasswordData({ current: '', new: '', confirm: '' })

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch  {
      setError('Erro ao alterar senha')
    } finally {
      setLoading(false)
    }
  }



  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {activeTab === 'general' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Informações Gerais
              </h2>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </span>
                )}
              </Button>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {avatarPreview || profile.avatar ? (
                    <Image
                      src={avatarPreview || profile.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  <Camera className="w-4 h-4 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Foto de Perfil</h3>
                <p className="text-sm text-gray-500">
                  PNG, JPG ou GIF. Tamanho máximo de 1MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <Input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Seu nome"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="seu@email.com"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="(00) 00000-0000"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idioma
                </label>
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({...profile, language: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Segurança
              </h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Atual
                  </label>
                  <Input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    placeholder="••••••••"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <Input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    placeholder="••••••••"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    placeholder="••••••••"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <h3 className="text-yellow-800 font-medium flex items-center gap-2 mb-2">
                  <Key className="w-5 h-5" />
                  Requisitos de Senha
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Mínimo de 8 caracteres</li>
                  <li>• Pelo menos uma letra maiúscula</li>
                  <li>• Pelo menos um número</li>
                  <li>• Pelo menos um caractere especial</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? 'Atualizando...' : 'Atualizar Senha'}
              </Button>
            </form>

         
          </div>
        )}

       

        {/* Mensagens de Feedback */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Alterações salvas com sucesso!
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
      ```

      - 📄 QuizControlPanel.tsx
      
```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Play, Pause, RefreshCw, AlertTriangle, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type QuizControlPanelProps = {
  quizId: string
}

interface Participant {
  userId: string | null
  name: string
  avatar: string
  joined: string
}

interface SessionStatus {
  exists: boolean
  isActive: boolean
  participants: Participant[]
}

export function QuizControlPanel({ quizId }: QuizControlPanelProps) {
  const [status, setStatus] = useState<SessionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'start' | 'stop' | 'reset'>('start')
  const [showParticipants, setShowParticipants] = useState(true)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [quizDuration, setQuizDuration] = useState(300)
  const [customDuration, setCustomDuration] = useState('5')

  // Defina handleAutoStop primeiro, sem dependências
  const handleAutoStop = useCallback(async () => {
    if (!quizId) return

    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      })
      
      if (!response.ok) throw new Error('Erro ao parar automaticamente')
      
      localStorage.removeItem(`quiz_${quizId}_startTime`)
      localStorage.removeItem(`quiz_${quizId}_duration`)
      setTimeLeft(null)
      
      // Atualize o status após parar
      const newStatusResponse = await fetch(`/api/quiz/${quizId}/session`, { cache: 'no-store' })
      if (newStatusResponse.ok) {
        const newStatus = await newStatusResponse.json()
        setStatus(newStatus)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao parar automaticamente')
      console.error('Erro ao parar automaticamente:', err)
    }
  }, [quizId])

  // Agora fetchStatus pode usar handleAutoStop
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/session`, { cache: 'no-store' })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao carregar status da sessão')
      }
      
      const data = await response.json()
      setStatus(data)
      setError('')
      
      if (data.isActive && localStorage.getItem(`quiz_${quizId}_startTime`)) {
        const startTime = new Date(localStorage.getItem(`quiz_${quizId}_startTime`)!).getTime()
        const storedDuration = parseInt(localStorage.getItem(`quiz_${quizId}_duration`) || '300')
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = storedDuration - elapsed
        
        if (remaining > 0) {
          setTimeLeft(remaining)
          setQuizDuration(storedDuration)
        } else {
          setTimeLeft(0)
          await handleAutoStop()
        }
      } else {
        setTimeLeft(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar status')
      console.error('Erro ao buscar status:', err)
    } finally {
      setLoading(false)
    }
  }, [quizId, handleAutoStop])

  // Efeitos atualizados com todas as dependências necessárias
  useEffect(() => {
    fetchStatus()
    const fetchInterval = setInterval(fetchStatus, 5000)
    return () => clearInterval(fetchInterval)
  }, [fetchStatus])

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null

    if (status?.isActive && timeLeft !== null && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            handleAutoStop()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [status?.isActive, timeLeft, handleAutoStop])

  // Resto do código permanece o mesmo...
  const handleAction = (action: 'start' | 'stop' | 'reset') => {
    if (action === 'start') {
      const duration = parseInt(customDuration)
      if (isNaN(duration) || duration <= 0) {
        setError('Por favor, insira uma duração válida em minutos')
        return
      }
      setQuizDuration(duration * 60)
    }
    setConfirmAction(action)
    setShowConfirmDialog(true)
  }

  const confirmActionExecute = async () => {
    setShowConfirmDialog(false)
    setActionLoading(true)
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: confirmAction,
          duration: confirmAction === 'start' ? quizDuration : undefined 
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao executar ação')
      }
      
      await fetchStatus()
      
      if (confirmAction === 'start') {
        localStorage.setItem(`quiz_${quizId}_startTime`, new Date().toISOString())
        localStorage.setItem(`quiz_${quizId}_duration`, quizDuration.toString())
        setTimeLeft(quizDuration)
      } else if (confirmAction === 'stop' || confirmAction === 'reset') {
        setTimeLeft(null)
        localStorage.removeItem(`quiz_${quizId}_startTime`)
        localStorage.removeItem(`quiz_${quizId}_duration`)
      }
      
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao executar ação')
      console.error('Erro ao executar ação:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCustomDuration(value)
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Controle do Quiz
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStatus}
            disabled={loading}
            className="text-indigo-600 hover:text-indigo-700"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-md rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ) : error ? (
              <div className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Estado</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status?.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                {status?.isActive && timeLeft !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-500" /> Tempo Restante
                    </span>
                    <span className="font-semibold text-indigo-600">{formatTime(timeLeft)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" /> Participantes
                  </span>
                  <span className="font-semibold text-gray-800">{status?.participants.length || 0}</span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-md rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Controles</h3>
            <div className="space-y-3">
              {!status?.isActive && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração do Quiz (minutos)
                  </label>
                  <Input
                    type="number"
                    value={customDuration}
                    onChange={handleDurationChange}
                    min="1"
                    max="60"
                    className="w-full"
                    placeholder="Digite a duração em minutos"
                  />
                </div>
              )}
              <Button
                onClick={() => handleAction(status?.isActive ? 'stop' : 'start')}
                disabled={actionLoading || loading}
                variant={status?.isActive ? 'destructive' : 'default'}
                className={`w-full ${
                  status?.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white rounded-full shadow-md`}
              >
                {actionLoading && confirmAction === (status?.isActive ? 'stop' : 'start') ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executando...
                  </span>
                ) : status?.isActive ? (
                  <><Pause className="w-4 h-4 mr-2" /> Parar Sessão</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" /> Iniciar Sessão</>
                )}
              </Button>
              <Button
                onClick={() => handleAction('reset')}
                disabled={actionLoading || loading}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full shadow-md"
              >
                {actionLoading && confirmAction === 'reset' ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Executando...
                  </span>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-2" /> Resetar Sessão</>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {status?.participants.length > 0 && (
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-md rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Participantes ({status.participants.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowParticipants(!showParticipants)}
                className="text-gray-600 hover:text-gray-800 border-gray-300 rounded-full"
              >
                {showParticipants ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            <AnimatePresence>
              {showParticipants && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {status.participants.map((participant, index) => (
                    <motion.div
                      key={participant.userId || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-2xl">{participant.avatar}</div>
                      <div>
                        <p className="font-medium text-gray-800">{participant.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(participant.joined).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md rounded-xl bg-white shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-gray-800">
                Confirmar Ação
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-sm">
                {confirmAction === 'start' && (
                  <>Deseja iniciar uma nova sessão do quiz com duração de {customDuration} minutos?</>
                )}
                {confirmAction === 'stop' && 'Deseja encerrar a sessão atual? A pontuação será salva.'}
                {confirmAction === 'reset' && (
                  <span className="text-red-600">Deseja resetar a sessão? Isso removerá todos os participantes e pontuações.</span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
              <AlertDialogCancel asChild disabled={actionLoading}>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Cancelar
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild disabled={actionLoading}>
                <Button
                  onClick={confirmActionExecute}
                  className={`w-full rounded-full shadow-md transition-all duration-200 ${
                    confirmAction === 'reset'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white`}
                >
                  Confirmar
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-xl shadow-xl flex items-center gap-2 z-50"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
            <button onClick={() => setError('')} className="ml-2 hover:text-gray-200">×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
      ```

      - 📄 QuizForm.tsx
      
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Plus, Trash2, Globe, Info, FileText, Save, X, AlertTriangle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import type { Question } from '@/types'

type QuizFormProps = {
  initialData?: {
    id?: string
    title: string
    description: string
    questions: Question[]
    totalTimeLimit?: number
    isPublished?: boolean
  }
}

export function QuizForm({ initialData }: QuizFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [totalTimeLimit] = useState(initialData?.totalTimeLimit ?? 5)
  const [isPublic, setIsPublic] = useState(initialData?.isPublished ?? false)
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions ?? [{
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      order: 0
    }]
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState('')
  const [importFormat, setImportFormat] = useState<'simple' | 'structured'>('simple')
  const [importPreview, setImportPreview] = useState<Question[]>([])

  const addQuestion = () => {
    const newOrder = questions.length
    setQuestions([
      ...questions,
      { text: '', options: ['', '', '', ''], correctAnswer: 0, order: newOrder }
    ])
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions.map((q, idx) => ({ ...q, order: idx })))
  }

  const updateQuestion = (index: number, field: string, value: string | number) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!title.trim()) throw new Error('Título é obrigatório')
      if (!description.trim()) throw new Error('Descrição é obrigatória')
      if (questions.length === 0) throw new Error('Adicione pelo menos uma questão')
      if (!Number.isInteger(totalTimeLimit) || totalTimeLimit < 1) {
        throw new Error('O tempo máximo deve ser um número inteiro maior ou igual a 1 minuto')
      }

      for (const [index, question] of questions.entries()) {
        if (!question.text.trim()) throw new Error(`Questão ${index + 1}: O texto da pergunta é obrigatório`)
        if (question.options.some(opt => !opt.trim())) throw new Error(`Questão ${index + 1}: Todas as opções devem ser preenchidas`)
        if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          throw new Error(`Questão ${index + 1}: Selecione uma resposta correta válida`)
        }
      }

      const quizData = {
        title,
        description,
        totalTimeLimit,
        questions: questions.map((q, index) => ({ ...q, order: index })),
        isPublished: isPublic
      }

      const url = initialData?.id ? `/api/quiz/${initialData.id}` : '/api/quiz'
      const method = initialData?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar quiz')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o quiz')
      console.error('Erro ao salvar quiz:', err)
    } finally {
      setLoading(false)
    }
  }

  const processImportedText = () => {
    try {
      let parsedQuestions: Question[] = []

      if (importFormat === 'simple') {
        const lines = importText.split('\n').map(line => line.trim()).filter(line => line)
        let currentQuestion: Partial<Question> | null = null

        for (const line of lines) {
          if (line.startsWith('P:')) {
            if (currentQuestion?.text && currentQuestion.options?.length) {
              parsedQuestions.push({
                text: currentQuestion.text,
                options: currentQuestion.options,
                correctAnswer: currentQuestion.correctAnswer || 0,
                order: parsedQuestions.length
              })
            }
            currentQuestion = { text: line.substring(2).trim(), options: [], correctAnswer: 0 }
          } else if (line.startsWith('R:') && currentQuestion) {
            const optionText = line.substring(2).trim()
            if (optionText.startsWith('*')) {
              currentQuestion.correctAnswer = currentQuestion.options?.length || 0
              currentQuestion.options?.push(optionText.substring(1).trim())
            } else {
              currentQuestion.options?.push(optionText)
            }
          }
        }
        if (currentQuestion?.text && currentQuestion.options?.length) {
          parsedQuestions.push({
            text: currentQuestion.text,
            options: currentQuestion.options,
            correctAnswer: currentQuestion.correctAnswer || 0,
            order: parsedQuestions.length
          })
        }
      } else {
        const jsonData = JSON.parse(importText)
        if (Array.isArray(jsonData)) {
          parsedQuestions = jsonData.map((q, index) => ({
            text: q.text || '',
            options: q.options || ['', '', '', ''],
            correctAnswer: q.correctAnswer || 0,
            order: index
          }))
        } else {
          throw new Error('O JSON deve ser um array de questões')
        }
      }

      if (parsedQuestions.length === 0) throw new Error('Nenhuma questão encontrada no texto')
      setImportPreview(parsedQuestions)
    } catch (err: any) {
      setError(err.message || 'Formato de texto inválido')
      console.error('Erro ao processar texto:', err)
    }
  }

  const applyImport = () => {
    setQuestions(importPreview)
    setShowImportModal(false)
    setImportText('')
    setImportPreview([])
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card className="mb-6 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl border border-gray-200">
            <div className="p-6 sm:p-8">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mb-6"
              >
                {initialData?.id ? 'Editar Quiz' : 'Criar Novo Quiz'}
              </motion.h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título do quiz"
                    className="w-full rounded-lg shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o objetivo deste quiz"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[100px]"
                    rows={4}
                    required
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-indigo-50 rounded-lg border border-indigo-200"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="isPublic" className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                      <Globe className="w-5 h-5 mr-2 text-indigo-500" />
                      <span className="text-base font-semibold">Tornar este quiz público</span>
                    </label>
                  </div>
                  <div className="ml-8 text-sm text-gray-600 flex items-start">
                    <Info className="w-4 h-4 mr-1 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <p>Marque esta opção para permitir que qualquer pessoa acesse o quiz sem login.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>

          {/* Seção corrigida para os botões */}
          <div className="mb-6">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4"
            >
              Perguntas
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-end"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowImportModal(true)}
                className="w-full sm:w-auto border-indigo-400 text-indigo-600 hover:bg-indigo-50 rounded-full"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
              >
                <FileText className="w-4 h-4 mr-2" /> Importar Perguntas
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="w-full sm:w-auto border-indigo-400 text-indigo-600 hover:bg-indigo-50 rounded-full"
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Pergunta
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 text-red-700 p-4 rounded-xl shadow-md mb-6"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {questions.map((question, questionIndex) => (
              <motion.div
                key={questionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <Card className="bg-white/95 backdrop-blur-sm shadow-md rounded-xl border border-gray-200">
                  <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 tracking-tight">
                        Pergunta {questionIndex + 1}
                      </h4>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="mb-4">
                      <Input
                        type="text"
                        value={question.text}
                        onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                        placeholder="Digite a pergunta"
                        className="w-full rounded-lg shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Opções</p>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center mb-3 gap-3">
                          <motion.input
                            whileHover={{ scale: 1.1 }}
                            type="radio"
                            name={`question-${questionIndex}-correct`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Opção ${optionIndex + 1}`}
                            className="flex-1 rounded-lg shadow-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {questions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 shadow-sm"
            >
              <p className="text-gray-500 text-lg">Nenhuma pergunta adicionada.<br />Clique em &quot;Adicionar Pergunta&quot; ou &quot;Importar Perguntas&quot;.</p>
            </motion.div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              disabled={loading}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full shadow-md transition-all duration-200"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Quiz
                </>
              )}
            </Button>
          </div>
        </form>

        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Importar Perguntas</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="importFormat"
                      checked={importFormat === 'simple'}
                      onChange={() => setImportFormat('simple')}
                      className="mr-2 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    Formato Simples
                  </label>
                  <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="importFormat"
                      checked={importFormat === 'structured'}
                      onChange={() => setImportFormat('structured')}
                      className="mr-2 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    JSON
                  </label>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-4 text-sm"
                >
                  {importFormat === 'simple' ? (
                    <div>
                      <p className="font-medium mb-2 text-indigo-800">Instruções:</p>
                      <pre className="bg-white p-3 rounded-lg my-2 text-xs font-mono text-gray-800 shadow-sm">
                        P: Qual a capital do Brasil?{'\n'}
                        R: Rio de Janeiro{'\n'}
                        R: *Brasília{'\n'}
                        R: São Paulo{'\n'}
                        R: Belo Horizonte
                      </pre>
                      <ul className="list-disc pl-5 text-gray-600 text-xs">
                        <li>Cada pergunta começa com &quot;P:&quot;</li>
                        <li>Cada resposta começa com &quot;R:&quot;</li>
                        <li>Marque a resposta correta com &quot;*&quot;</li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium mb-2 text-indigo-800">Formato JSON:</p>
                      <pre className="bg-white p-3 rounded-lg my-2 text-xs font-mono text-gray-800 shadow-sm">
                        {JSON.stringify([{ text: "Qual a capital do Brasil?", options: ["Rio de Janeiro", "Brasília", "São Paulo", "Belo Horizonte"], correctAnswer: 1 }], null, 2)}
                      </pre>
                    </div>
                  )}
                </motion.div>

                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={importFormat === 'simple' ? 'Cole seu texto aqui...' : 'Cole seu JSON aqui...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[150px] font-mono text-sm"
                  rows={8}
                />
              </div>

              <div className="flex justify-end gap-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setImportText(''); setImportPreview([]) }}
                  disabled={!importText}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full shadow-md transition-all duration-200"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                >
                  Limpar
                </Button>
                <Button
                  type="button"
                  onClick={processImportedText}
                  disabled={!importText}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full shadow-md transition-all duration-200"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                >
                  Visualizar
                </Button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-50 text-red-700 p-4 rounded-xl shadow-md mb-6"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {importPreview.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Prévia ({importPreview.length} perguntas):</h4>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto shadow-inner border border-gray-200">
                    <AnimatePresence>
                      {importPreview.map((q, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="mb-4 pb-4 border-b border-gray-200 last:border-0"
                        >
                          <p className="font-medium text-gray-800">{idx + 1}. {q.text}</p>
                          <ul className="mt-2 pl-6 text-sm">
                            {q.options.map((opt, optIdx) => (
                              <li key={optIdx} className={optIdx === q.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                {optIdx === q.correctAnswer ? '✓ ' : '- '}{opt}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImportModal(false)}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full shadow-md transition-all duration-200"
                      onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                      onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={applyImport}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-full shadow-md transition-all duration-200"
                      onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
                      onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                    >
                      Importar {importPreview.length} Perguntas
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
      ```

      - 📄 QuizList.tsx
      
```tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { Edit, BarChart2, Trash2, AlertTriangle, ExternalLink, Globe, Plus, Share2, Lock, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

type Quiz = {
  id: string
  title: string
  description: string
  isPublished: boolean
  _count?: { results: number }
  createdAt: string
}

export function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [copyTooltip, setCopyTooltip] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/quiz')
        if (!response.ok) throw new Error('Falha ao carregar quizzes')
        const data = await response.json()
        setQuizzes(data)
      } catch (err) {
        console.error('Erro ao carregar quizzes:', err)
        setError('Ocorreu um erro ao carregar os quizzes.')
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  // Animação GSAP para entrada dos cards
  useEffect(() => {
    if (!loading && quizzes.length > 0 && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )
    }
  }, [loading, quizzes])

  const handleDeleteQuiz = async () => {
    if (!deleteQuizId) return
    const quizElement = document.getElementById(`quiz-${deleteQuizId}`)
    if (quizElement) {
      await gsap.to(quizElement, {
        opacity: 0,
        x: -30,
        duration: 0.4,
        ease: 'power2.in',
      })
    }
    try {
      const response = await fetch(`/api/quiz/${deleteQuizId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Falha ao excluir quiz')
      setQuizzes(quizzes.filter((quiz) => quiz.id !== deleteQuizId))
      setShowDeleteDialog(false)
      setDeleteQuizId(null)
    } catch (err) {
      console.error('Erro ao excluir quiz:', err)
      setError('Ocorreu um erro ao excluir o quiz.')
    }
  }

  const handleShare = async (quizId: string) => {
    try {
      const shareUrl = `${window.location.origin}/quiz/${quizId}`
      await navigator.clipboard.writeText(shareUrl)
      setCopyTooltip(quizId)
      setTimeout(() => setCopyTooltip(null), 2000)
    } catch (err) {
      console.error('Erro ao copiar link:', err)
      setError('Não foi possível copiar o link.')
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-600">Carregando quizzes...</p>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className="max-w-md mx-auto mt-12 p-6 bg-red-50 rounded-xl shadow-md"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
      {quizzes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center"
        >
          <Plus className="w-16 h-16 text-gray-300 mb-6" />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
            Nenhum quiz encontrado
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-md">
            Parece que você ainda não criou nenhum quiz. Comece agora!
          </p>
          <Link href="/dashboard/quiz/create">
            <Button
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Novo Quiz
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <AnimatePresence>
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                id={`quiz-${quiz.id}`}
                className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 tracking-tight line-clamp-1">
                      {quiz.title}
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center"
                    >
                      {quiz.isPublished ? (
                        <Globe className="w-5 h-5 text-green-500" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                    </motion.div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{quiz.description}</p>
                  <div className="text-xs text-gray-500">
                    {quiz._count?.results || 0} {quiz._count?.results === 1 ? 'resposta' : 'respostas'}
                  </div>
                </div>
                <div
                  className={`p-3 bg-gray-50 grid ${quiz.isPublished ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'} gap-2 border-t border-gray-200`}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex flex-col items-center gap-1 text-blue-600 hover:bg-blue-50 w-full py-2"
                    >
                      <Link href={`/dashboard/quiz/${quiz.id}/edit`}>
                        <Edit className="w-4 h-4" />
                        <span className="text-xs">Editar</span>
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex flex-col items-center gap-1 text-indigo-600 hover:bg-indigo-50 w-full py-2"
                    >
                      <Link href={`/dashboard/quiz/${quiz.id}/results`}>
                        <BarChart2 className="w-4 h-4" />
                        <span className="text-xs">Resultados</span>
                      </Link>
                    </Button>
                  </motion.div>
                  {quiz.isPublished && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(quiz.id)}
                        className="flex flex-col items-center gap-1 text-green-600 hover:bg-green-50 w-full py-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs">Compartilhar</span>
                      </Button>
                      <AnimatePresence>
                        {copyTooltip === quiz.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg shadow-md"
                          >
                            Link copiado!
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteQuizId(quiz.id)
                        setShowDeleteDialog(true)
                      }}
                      className="flex flex-col items-center gap-1 text-red-600 hover:bg-red-50 w-full py-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-xs">Excluir</span>
                    </Button>
                  </motion.div>
                </div>
                {quiz.isPublished && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 py-2 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center"
                  >
                    <span className="text-xs text-indigo-700 font-medium">Publicado</span>
                    <Link
                      href={`/quiz/${quiz.id}`}
                      target="_blank"
                      className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span className="mr-1">Visualizar</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </motion.div>
                )}
              </Card>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-xl bg-white shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                Excluir Quiz?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-sm">
                Tem certeza que deseja excluir este quiz? Todos os resultados associados serão perdidos e esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
              <AlertDialogCancel asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1 })}
                >
                  Cancelar
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-all duration-200"
                  onClick={handleDeleteQuiz}
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05 })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1 })}
                >
                  Excluir
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
      ```

      - 📄 ResultsTable.tsx
      
```tsx
// src/components/dashboard/ResultsTable.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { AlertTriangle } from 'lucide-react'
import type { QuizResult } from '@/types'

type ResultsTableProps = {
  quizId: string
}

export function ResultsTable({ quizId }: ResultsTableProps) {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/results`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Falha ao carregar resultados')
      }
      
      const data = await response.json() as QuizResult[]
      setResults(data)
      setError('')
    } catch (err) {
      console.error('[ResultsTable] Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar resultados')
    } finally {
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Nenhum resultado encontrado para este quiz.</p>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="py-3 px-6">Jogador</th>
              <th className="py-3 px-6">Pontuação</th>
              <th className="py-3 px-6">Total de Questões</th>
              <th className="py-3 px-6">Data</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <motion.tr
                key={result.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="py-4 px-6">{result.playerName}</td>
                <td className="py-4 px-6">{result.score}</td>
                <td className="py-4 px-6">{result.totalQuestions}</td>
                <td className="py-4 px-6">
                  {new Date(result.createdAt).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
      ```

      - 📄 Sidebar.tsx
      
```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, PlusCircle, BarChart2,HelpCircle, User } from 'lucide-react'
import { cn } from '@/utils/cn'

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    href: '/dashboard/quiz/create',
    label: 'Novo Quiz',
    icon: PlusCircle
  },
  {
    href: '/dashboard/results',
    label: 'Resultados',
    icon: BarChart2
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white">
      <div className="py-6 flex-1">
        <div className="px-3 py-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            MENU PRINCIPAL
          </h2>
          <nav className="mt-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md group relative overflow-hidden transition-all",
                    isActive 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <item.icon className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                  )} />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="px-3 py-2 mt-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            SUPORTE
          </h2>
          <nav className="mt-3 space-y-1">
        
            <Link
              href="/dashboard/help"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50 group"
            >
              <HelpCircle className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
              <span className="truncate">Ajuda</span>
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Perfil no rodapé da sidebar */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={16} className="text-blue-700" />
          </div>
          <div className="ml-3">
            <Link href="/dashboard/profile">
            <p className="text-sm font-medium text-gray-700 truncate">Sua Conta</p>
            <p className="text-xs text-gray-500 truncate">Ver perfil</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
      ```

    - 📁 documentation/
      - 📄 CodeExample.tsx
      
```tsx
// src/components/documentation/CodeExample.tsx
'use client'

import { useState } from 'react'

import { Check, Copy, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CodeExampleProps {
  title: string
  code: string
  language?: string
  description?: string
}

export function CodeExample({
  title,
  code,
  language = 'typescript',
  description
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      {description && (
        <div className="px-4 py-2 border-b bg-gray-50">
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}
      <pre className="p-4 overflow-x-auto bg-gray-900 text-gray-100">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

      ```

      - 📄 DocSection.tsx
      
```tsx
// src/components/documentation/DocSection.tsx
'use client'


import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface DocSectionProps {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
  children: React.ReactNode
}

export function DocSection({
  title,
  description,
  icon: Icon,
  className,
  children
}: DocSectionProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="border-b p-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-6 h-6 text-white" />}
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        {description && (
          <p className="mt-2 text-blue-50 text-sm">{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </Card>
  )
}



      ```

      - 📄 SearchBar.tsx
      
```tsx
// src/components/documentation/SearchBar.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface SearchBarProps {
  onSearch: (term: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar na documentação...",
  className
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, onSearch])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
      ```

    - 📁 quiz/
      - 📄 QuizControlPanel.tsx
      
```tsx
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
      ```

      - 📄 QuizScreen.tsx
      
```tsx
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { useQuizStore } from "@/store"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { Clock, Trophy, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { gsap } from "gsap"
import { useRouter } from "next/navigation"
import { Progress } from '@/components/ui/progress'

export function QuizScreen() {
  const router = useRouter()
  const { currentQuiz, currentQuestionIndex, answerQuestion, timeLimit, answers, finishQuiz, currentStep } = useQuizStore()
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [startTime, setStartTime] = useState<number>(0)
  const [isFinished, setIsFinished] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex]
  const totalTimeLimitMs = timeLimit * 1000

  const calculateRegressiveScore = useCallback((timeTaken: number, maxTime: number = 10): number => {
    const maxScore = 1000
    if (timeTaken >= maxTime) return 0
    const score = Math.floor(maxScore * (1 - timeTaken / maxTime))
    return Math.max(score, 0)
  }, [])

  useEffect(() => {
    if (!currentQuiz?.id || !currentQuiz.questions || currentQuiz.questions.length === 0) {
      router.push("/dashboard")
      return
    }
    setTimeLeft(totalTimeLimitMs)
    setStartTime(Date.now())
    setIsLoading(false)
    gsap.from(containerRef.current, { opacity: 0, y: 50, duration: 1, ease: "power3.out" })
  }, [currentQuiz, router, totalTimeLimitMs])

  useEffect(() => {
    if (isFinished || currentStep !== "quiz" || showFeedback || timeLeft <= 0 || isLoading || !currentQuiz?.id) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 10
        if (newTime <= 0) {
          clearInterval(timer)
          setIsFinished(true)
          finishQuiz(currentQuiz.id, answers)
          return 0
        }
        return newTime
      })
    }, 10)

    return () => clearInterval(timer)
  }, [showFeedback, timeLeft, isLoading, currentQuiz, answers, finishQuiz, isFinished, currentStep])

  const handleAnswer = useCallback((optionIndex: number) => {
    if (showFeedback || !currentQuiz?.id || !currentQuestion || isFinished) return

    const timeElapsed = (Date.now() - startTime) / 1000
    const correct = optionIndex === currentQuestion.correctAnswer

    setIsCorrect(correct)
    setShowFeedback(true)
    setSelectedOption(optionIndex)

    gsap.to(`.option-${optionIndex}`, { scale: 1.05, duration: 0.4, ease: "elastic.out(1, 0.3)", yoyo: true, repeat: 1 })
    gsap.to(containerRef.current, { rotate: correct ? 2 : -2, duration: 0.3, ease: "power2.inOut", yoyo: true, repeat: 1 })

    setTimeout(() => {
      answerQuestion(currentQuiz.id, currentQuestionIndex, optionIndex, timeElapsed)
      setShowFeedback(false)
      setSelectedOption(null)
      if (currentQuestionIndex + 1 >= currentQuiz.questions.length) {
        const finalAnswers = [...answers, { questionIndex: currentQuestionIndex, selectedAnswer: optionIndex, timeToAnswer: timeElapsed * 1000 }]
        setIsFinished(true)
        finishQuiz(currentQuiz.id, finalAnswers)
      } else {
        setStartTime(Date.now())
      }
    }, 2000)
  }, [currentQuestion, currentQuiz, currentQuestionIndex, answerQuestion, showFeedback, finishQuiz, startTime, answers, isFinished])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} className="rounded-full h-10 w-10 border-b-2 border-primary" />
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="mt-2 text-gray-700 text-lg font-medium">
            Preparando seu desafio...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <AlertTriangle className="w-12 h-12 text-error mx-auto mb-4" />
          </motion.div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Erro no Quiz</h1>
          <p className="text-gray-600 mb-4 text-lg">Nenhuma pergunta carregada.</p>
          <Link href="/dashboard">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
              <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Dashboard
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    )
  }

  if (!currentQuestion || isFinished || currentStep === "results") {
    if (currentQuiz?.id && !isFinished) {
      finishQuiz(currentQuiz.id, answers)
      setIsFinished(true)
    }
    return null
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2 text-gray-800">
            <span className="text-sm sm:text-base font-medium">Questão {currentQuestionIndex + 1} de {currentQuiz.questions.length}</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="text-sm sm:text-base font-medium text-gray-700">{(timeLeft / 1000).toFixed(1)}s / {timeLimit}s</span>
            </div>
          </div>
          <Progress value={(timeLeft / totalTimeLimitMs) * 100} className="h-2 bg-gray-200" />
        </motion.div>

        <Card className="bg-white shadow-md border border-gray-200 rounded-lg">
          <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -50, scale: 0.95 }} transition={{ duration: 0.7 }} className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 leading-tight">{currentQuestion.text}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, backgroundColor: "#e0f2fe" }}
                  whileTap={{ scale: 0.98 }}
                  className={`option-${index} w-full p-3 sm:p-4 text-left rounded-lg border-2 border-gray-200 text-gray-800 font-medium hover:border-primary-light transition-all ${
                    showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? "bg-success/20 border-success text-success"
                        : index === selectedOption
                        ? "bg-error/20 border-error text-error"
                        : "bg-white border-gray-200"
                      : selectedOption === index
                      ? "bg-primary/20 border-primary"
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
              transition={{ duration: 0.6 }}
              className={`mt-6 p-4 rounded-lg shadow-md text-center ${isCorrect ? "bg-success/10 border-l-4 border-success text-success" : "bg-error/10 border-l-4 border-error text-error"}`}
            >
              <div className="flex items-center justify-center gap-3">
                {isCorrect ? (
                  <>
                    <Trophy className="w-5 h-5 text-success" />
                    <span className="font-bold text-lg">Correto!</span>
                    <span className="ml-2 text-sm">+{calculateRegressiveScore((Date.now() - startTime) / 1000)} pontos</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-error" />
                    <span className="font-bold text-lg">Incorreto!</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
      ```

      - 📄 QuizTimer.tsx
      
```tsx
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
      ```

      - 📄 RankingBoard.tsx
      
```tsx
// src/components/quiz/RankingBoard.tsx
"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useRanking } from "@/hooks/useRanking";

interface RankingBoardProps {
  quizId: string;
  pollingInterval?: number;
}

export function RankingBoard({ quizId, pollingInterval = 3000 }: RankingBoardProps) {
  const { rankings, loading, error } = useRanking(quizId, pollingInterval);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-red-600 text-center">Erro ao carregar ranking: {error}</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Ranking</h2>
      {rankings.length === 0 ? (
        <p className="text-gray-600">Nenhum resultado ainda.</p>
      ) : (
        <div className="space-y-2">
          {rankings.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                {entry.rank === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                {entry.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                {entry.rank === 3 && <Star className="w-5 h-5 text-amber-600" />}
                <span className="font-semibold">{entry.rank}. {entry.playerName}</span>
              </div>
              <span className="text-gray-800">{entry.score} pontos</span>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
      ```

      - 📄 ResultsScreen.tsx
      
```tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

interface RankingEntry {
  playerName: string
  score: number
  timeBonus: number
  totalScore: number
  position?: number
}

export function ResultsScreen() {
  const { 
    currentQuiz, 
    playerName,
   
  } = useQuizStore()
  
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      if (!currentQuiz?.id) return

      try {
        const response = await fetch(`/api/quiz/${currentQuiz.id}/results/public`)
        if (!response.ok) throw new Error('Falha ao carregar resultados')
        
        const data = await response.json()
        // Processar e ordenar os resultados
        const processedRankings = data
          .map((entry: any) => ({
            playerName: entry.playerName || 'Jogador Anônimo',
            score: entry.score || 0,
            timeBonus: entry.timeBonus || 0,
            totalScore: (entry.score || 0) + (entry.timeBonus || 0)
          }))
          .sort((a: RankingEntry, b: RankingEntry) => b.totalScore - a.totalScore)
          .map((entry: RankingEntry, index: number) => ({
            ...entry,
            position: index + 1
          }))

        setRankings(processedRankings)
      } catch (error) {
        console.error('Erro ao carregar resultados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [currentQuiz?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Ranking Final
          </h2>

          <div className="space-y-4">
            {rankings.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${
                  entry.playerName === playerName
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-500">
                      #{entry.position}
                    </span>
                    <div>
                      <h3 className="font-semibold text-lg">{entry.playerName}</h3>
                      <div className="text-sm text-gray-600">
                        Pontuação: {entry.score} 
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {entry.totalScore} pts
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Link href={`/quiz/${currentQuiz?.id}/ranking`} passHref>
          <Button variant="outline" className="gap-2">
            <Trophy className="w-4 h-4" />
            Ver Ranking Completo
          </Button>
        </Link>
        
   
      </div>
    </div>
  )
}
      ```

      - 📄 WaitingRoom.tsx
      
```tsx
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
      ```

      - 📄 WelcomeScreen.tsx
      
```tsx
// src/components/quiz/WelcomeScreen.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion} from 'framer-motion'
import { Dna } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import gsap from 'gsap'

const avatars = ['🧑‍🚀', '🦸‍♂️', '🦹‍♀️', '🧙‍♂️', '🧝‍♀️', '🦊', '🐉', '🦄']

export function WelcomeScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('')
  const [playerNameInput, setPlayerNameInput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const particlesRef = useRef<HTMLDivElement>(null)
  const { currentQuiz, joinSession, setPlayerName, setPlayerAvatar } = useQuizStore()
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // Detectar dispositivo móvel
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Seleção inicial de avatar
  useEffect(() => {
    if (!selectedAvatar) {
      setSelectedAvatar(avatars[Math.floor(Math.random() * avatars.length)])
    }
  }, [selectedAvatar])

  // Configuração de partículas otimizada
  const setupParticles = useCallback(() => {
    if (!particlesRef.current || typeof window === 'undefined') return

    const particleCount = isMobile ? 20 : 50
    const particles = Array.from({ length: particleCount }).map(() => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-blue-600 rounded-full opacity-50'
      return particle
    })

    particles.forEach(particle => {
      particlesRef.current?.appendChild(particle)
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      })
      gsap.to(particle, {
        duration: 2 + Math.random() * 2,
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 100 - 50}`,
        opacity: 0,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })
    })

    return () => particles.forEach(p => p.remove())
  }, [isMobile])

  useEffect(() => {
    const cleanup = setupParticles()
    return cleanup
  }, [setupParticles])

  const handleJoin = async () => {
    if (!playerNameInput.trim()) {
      setError('Por favor, insira um nome')
      return
    }
    if (!currentQuiz?.id) {
      setError('Quiz não encontrado')
      return
    }

    try {
      setPlayerName(playerNameInput)
      setPlayerAvatar(selectedAvatar)
      await joinSession(currentQuiz.id, playerNameInput, selectedAvatar)
    } catch (err) {
      setError('Erro ao entrar na sessão. Tente novamente.')
      console.error('Join session error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
        <Card className="relative z-10">
          <div className="p-6 sm:p-8">
            <div className="flex justify-center mb-6">
              <Dna className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">Bem-vindo ao Quiz</h1>
            
            <Input
              label="Seu Nome"
              value={playerNameInput}
              onChange={(e) => setPlayerNameInput(e.target.value)}
              placeholder="Digite seu nome"
              className="mb-4"
            />
            
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Escolha seu avatar:</p>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {avatars.map((avatar) => (
                  <motion.button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-2xl p-2 rounded-full ${
                      selectedAvatar === avatar ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            
            <Button onClick={handleJoin} className="w-full">
              Entrar no Quiz
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
      ```

    - 📄 QuizScreen.tsx
    
```tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuizStore } from '@/store'

export const QuizScreen = () => {
  const { currentQuiz, currentQuestionIndex, answerQuestion } = useQuizStore()
  const [startTime, setStartTime] = useState<number>(0)
  
  // Iniciar o tempo quando a questão é exibida
  useEffect(() => {
    setStartTime(Date.now())
  }, [currentQuestionIndex])

  const handleAnswer = (selectedOptionIndex: number) => {
    if (!currentQuiz?.id) return
    
    const timeToAnswer = Date.now() - startTime // Tempo em milissegundos
    const timeTakenInSeconds = timeToAnswer / 1000 // Convertendo para segundos

    answerQuestion(
      currentQuiz.id,
      currentQuestionIndex,
      selectedOptionIndex,
      timeTakenInSeconds
    )
  }
  
  // Verificação de segurança
  if (!currentQuiz?.questions || currentQuiz.questions.length === 0 || !currentQuiz.questions[currentQuestionIndex]) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Erro ao carregar as questões
          </h2>
          <p className="text-gray-600">
            Por favor, tente novamente mais tarde.
          </p>
        </div>
      </div>
    )
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-white p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
          <p className="text-right mt-2 text-gray-600">
            Questão {currentQuestionIndex + 1} de {currentQuiz.questions.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
    ```

    - 📄 RedirectToLogin.tsx
    
```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login'); // Usando replace para evitar histórico
  }, [router]);

  return null; // Nenhum conteúdo renderizado
}
    ```

    - 📄 ResultsScreen.tsx
    
```tsx
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
}
    ```

    - 📁 ui/
      - 📄 alert-dialog.tsx
      
```tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

      ```

      - 📄 AnimatedBackground.tsx
      
```tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

interface AnimatedBackgroundProps {
  variant?: 'default' | 'quiz' | 'celebration' | 'success' | 'error'
  density?: 'low' | 'medium' | 'high'
  className?: string
  animate?: boolean
  speed?: 'slow' | 'normal' | 'fast'
  interactive?: boolean
}

interface ParticleStyle {
  size: string
  color: string
  baseOpacity: number
  shapes?: string[]
}

interface AnimationConfig {
  duration: number
  movement: {
    x: number
    y: number
  }
  rotation?: number
  ease: string
}

export function AnimatedBackground({
  variant = 'default',
  density = 'medium',
  className = '',
  animate = true,
  speed = 'normal',
  interactive = false
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const [isHovered, setIsHovered] = useState(false)

  // Memoize configurations
  const getParticleCount = useCallback(() => {
    const counts = {
      low: 30,
      medium: 50,
      high: 80
    }
    return counts[density]
  }, [density])

  const getSpeedConfig = useCallback(() => {
    const configs = {
      slow: 1.5,
      normal: 1,
      fast: 0.5
    }
    return configs[speed]
  }, [speed])

  const getParticleStyles = useCallback(() => {
    const styles: Record<string, ParticleStyle> = {
      default: {
        size: 'w-2 h-2',
        color: 'bg-gray-200',
        baseOpacity: 0.2,
        shapes: ['rounded-full']
      },
      quiz: {
        size: 'w-2 h-2',
        color: 'bg-blue-400',
        baseOpacity: 0.3,
        shapes: ['rounded-full', 'rounded-lg']
      },
      celebration: {
        size: 'w-3 h-3',
        color: 'bg-yellow-400',
        baseOpacity: 0.4,
        shapes: ['rounded-full', 'rounded-lg', 'rotate-45']
      },
      success: {
        size: 'w-2 h-2',
        color: 'bg-green-400',
        baseOpacity: 0.35,
        shapes: ['rounded-full']
      },
      error: {
        size: 'w-2 h-2',
        color: 'bg-red-400',
        baseOpacity: 0.35,
        shapes: ['rounded-full']
      }
    }
    return styles[variant]
  }, [variant])

  const getAnimationConfigs = useCallback(() => {
    const configs: Record<string, AnimationConfig> = {
      default: {
        duration: 4,
        movement: { x: 50, y: 50 },
        ease: 'sine.inOut'
      },
      quiz: {
        duration: 3,
        movement: { x: 100, y: 100 },
        ease: 'none'
      },
      celebration: {
        duration: 2,
        movement: { x: 150, y: 150 },
        rotation: 360,
        ease: 'power1.inOut'
      },
      success: {
        duration: 3,
        movement: { x: 80, y: 80 },
        rotation: 180,
        ease: 'power2.inOut'
      },
      error: {
        duration: 2.5,
        movement: { x: 120, y: 120 },
        rotation: -180,
        ease: 'power3.inOut'
      }
    }
    return configs[variant]
  }, [variant])

  useEffect(() => {
    if (!containerRef.current || !animate) return

    const container = containerRef.current
    const particleStyle = getParticleStyles()
    const animConfig = getAnimationConfigs()
    const particleCount = getParticleCount()
    const speedMultiplier = getSpeedConfig()

    // Limpar partículas existentes
    particlesRef.current.forEach(particle => particle?.remove())
    particlesRef.current = []

    // Criar novas partículas
    const particles = Array.from({ length: particleCount }).map(() => {
      const particle = document.createElement('div')
      const shape = particleStyle.shapes?.[Math.floor(Math.random() * particleStyle.shapes.length)] || 'rounded-full'
      particle.className = `absolute ${particleStyle.size} ${particleStyle.color} ${shape} transition-transform`
      return particle
    })

    // Adicionar partículas ao container
    particles.forEach(particle => {
      container.appendChild(particle)
      particlesRef.current.push(particle)

      // Posição inicial
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * particleStyle.baseOpacity + particleStyle.baseOpacity
      })

      // Animação principal
      gsap.to(particle, {
        duration: animConfig.duration * speedMultiplier,
        x: `+=${(Math.random() * animConfig.movement.x - animConfig.movement.x / 2)}`,
        y: `+=${(Math.random() * animConfig.movement.y - animConfig.movement.y / 2)}`,
        rotation: animConfig.rotation ? Math.random() * animConfig.rotation : 0,
        opacity: Math.random() * particleStyle.baseOpacity + particleStyle.baseOpacity,
        scale: Math.random() * 0.5 + 0.5,
        ease: animConfig.ease,
        repeat: -1,
        yoyo: true
      })
    })

    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode === container) {
          particle.remove()
        }
      })
      particlesRef.current = []
    }
  }, [animate, getParticleStyles, getAnimationConfigs, getParticleCount, getSpeedConfig])

  // Efeito de interatividade
  useEffect(() => {
    if (!interactive || !containerRef.current) return

    const container = containerRef.current
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      if (!rect) return

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      particlesRef.current.forEach(particle => {
        const particleRect = particle.getBoundingClientRect()
        const particleX = particleRect.left - rect.left + particleRect.width / 2
        const particleY = particleRect.top - rect.top + particleRect.height / 2

        const distanceX = mouseX - particleX
        const distanceY = mouseY - particleY
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

        if (distance < 100) {
          gsap.to(particle, {
            duration: 0.3,
            x: particleX - distanceX * 0.1,
            y: particleY - distanceY * 0.1,
            ease: 'power2.out'
          })
        }
      })
    }

    container.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [interactive])

  // Efeito de hover
  useEffect(() => {
    if (!interactive || !isHovered) return

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        duration: 0.5,
        scale: 1.2,
        opacity: getParticleStyles().baseOpacity * 1.5,
        ease: 'power2.out'
      })
    })

    return () => {
      particlesRef.current.forEach(particle => {
        gsap.to(particle, {
          duration: 0.5,
          scale: Math.random() * 0.5 + 0.5,
          opacity: Math.random() * getParticleStyles().baseOpacity + getParticleStyles().baseOpacity,
          ease: 'power2.out'
        })
      })
    }
  }, [isHovered, interactive, getParticleStyles])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleResize = () => {
      particlesRef.current.forEach(particle => {
        gsap.to(particle, {
          duration: 0.3,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          ease: 'power2.out'
        })
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${
        interactive ? 'pointer-events-auto' : ''
      } ${className}`}
      style={{ perspective: '1000px' }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    />
  )
}
      ```

      - 📄 button.tsx
      
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

      ```

      - 📄 Card.tsx
      
```tsx
import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, header, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-lg shadow-lg overflow-hidden",
          className
        )}
        {...props}
      >
        {header && (
          <div className="px-6 py-4 border-b">{header}</div>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t bg-gray-50">{footer}</div>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'
      ```

      - 📄 Input.tsx
      
```tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
      ```

      - 📄 Particles.tsx
      
```tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function Particles() {
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const particles = Array.from({ length: 50 }).map(() => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-blue-600 rounded-full opacity-50'
      return particle
    })

    if (particlesRef.current) {
      particles.forEach(particle => {
        particlesRef.current?.appendChild(particle)
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        })

        gsap.to(particle, {
          duration: 2 + Math.random() * 2,
          x: '+=' + (Math.random() * 100 - 50),
          y: '+=' + (Math.random() * 100 - 50),
          opacity: 0,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        })
      })
    }

    return () => {
      particles.forEach(particle => particle.remove())
    }
  }, [])

  return <div ref={particlesRef} className="" />
}
      ```

      - 📄 progress.tsx
      
```tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

      ```

      - 📄 Timer.tsx
      
```tsx
// src/components/ui/Timer.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface TimerProps {
  duration: number // in seconds
  onComplete?: () => void
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'warning' | 'danger'
}

export function Timer({
  duration,
  onComplete,
  className = '',
  showIcon = true,
  size = 'md',
  
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(true)

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRunning(false)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, onComplete])

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const getVariantClasses = () => {
    const percentage = (timeLeft / duration) * 100
    if (percentage <= 25) return 'text-red-600 bg-red-100'
    if (percentage <= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-blue-600 bg-blue-100'
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showIcon && (
        <Clock className={`${sizeClasses[size]} ${
          timeLeft <= duration * 0.25 ? 'text-red-600' :
          timeLeft <= duration * 0.5 ? 'text-yellow-600' :
          'text-blue-600'
        }`} />
      )}
      
      <div className="relative rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-0 ${getVariantClasses()}`}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: timeLeft / duration }}
          transition={{ duration: 1 }}
        />
        
        <span className={`relative px-3 py-1 ${sizeClasses[size]} font-medium`}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  )
}
      ```

      - 📄 tooltip.tsx
      
```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

      ```

    - 📄 WelcomeScreen.tsx
    
```tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { Dna } from 'lucide-react'
import { useQuizStore } from '@/store'


export const WelcomeScreen = () => {
  const particlesRef = useRef<HTMLDivElement>(null)
  const { setPlayerName, startQuiz, playerName } = useQuizStore()

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (particlesRef.current) {
      const particles = Array.from({ length: 50 }).map(() => {
        const particle = document.createElement('div')
        particle.className = 'absolute w-2 h-2 bg-blue-600 rounded-full opacity-50'
        return particle
      })

      particles.forEach(particle => {
        particlesRef.current?.appendChild(particle)
        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        })

        gsap.to(particle, {
          duration: 2 + Math.random() * 2,
          x: '+=' + (Math.random() * 100 - 50),
          y: '+=' + (Math.random() * 100 - 50),
          opacity: 0,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        })
      })
      
      return () => {
        particles.forEach(particle => particle.remove())
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div ref={particlesRef} className="absolute inset-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <Dna size={80} className="text-blue-600" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          DNA Vital Group Quiz
        </h1>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="w-full max-w-md"
        >
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startQuiz}
          disabled={!playerName.trim()}
          className="mt-6 px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Iniciar Desafio
        </motion.button>
      </motion.div>
    </div>
  )
}
    ```

  - 📁 hooks/
    - 📄 useQuizControl.ts
    
```typescript
import { useState, useCallback } from 'react';

export const useQuizControl = (quizId: string) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });

      if (!response.ok) throw new Error('Failed to start quiz');
      setIsActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to start quiz');
      console.error(err);
    }
  }, [quizId]);

  const pauseQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' })
      });

      if (!response.ok) throw new Error('Failed to pause quiz');
      setIsActive(false);
      setError(null);
    } catch (err) {
      setError('Failed to pause quiz');
      console.error(err);
    }
  }, [quizId]);

  const resetQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'reset' })
      });

      if (!response.ok) throw new Error('Failed to reset quiz');
      setIsActive(false);
      setError(null);
    } catch (err) {
      setError('Failed to reset quiz');
      console.error(err);
    }
  }, [quizId]);

  return {
    isActive,
    error,
    startQuiz,
    pauseQuiz,
    resetQuiz
  };
};
    ```

    - 📄 useQuizScoring.ts
    
```typescript
// src/hooks/useQuizScoring.ts
import { useState, useCallback } from 'react';

interface ScoreCalculation {
  baseScore: number;
  timeBonus: number;
  totalScore: number;
}

export function useQuizScoring(maxTime: number = 1000) {
  const [currentScore, setCurrentScore] = useState(0);
  
  const calculateScore = useCallback((timeLeft: number, isCorrect: boolean): ScoreCalculation => {
    if (!isCorrect) {
      return { baseScore: 0, timeBonus: 0, totalScore: 0 };
    }

    // Base score for correct answer
    const baseScore = 100;

    // Time bonus calculation (0-900 points based on remaining time)
    const timeBonus = Math.floor((timeLeft / maxTime) * 900);
    
    // Total score
    const totalScore = baseScore + timeBonus;

    return { baseScore, timeBonus, totalScore };
  }, [maxTime]);

  const addScore = useCallback((timeLeft: number, isCorrect: boolean) => {
    const { totalScore } = calculateScore(timeLeft, isCorrect);
    setCurrentScore(prev => prev + totalScore);
    return totalScore;
  }, [calculateScore]);

  const resetScore = useCallback(() => {
    setCurrentScore(0);
  }, []);

  return {
    currentScore,
    calculateScore,
    addScore,
    resetScore
  };
}
    ```

    - 📄 useQuizSession.ts
    
```typescript
// src/hooks/useQuizSession.ts

import { useState, useEffect, useCallback } from 'react'


interface UseQuizSessionOptions {
  quizId: string
  onSessionStart?: () => void
  onSessionEnd?: () => void
}

export function useQuizSession({ quizId, onSessionStart}: UseQuizSessionOptions) {
  const [isActive, setIsActive] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [timeLimit, setTimeLimit] = useState(60)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchSessionStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/session`)
      if (!response.ok) throw new Error('Falha ao buscar status da sessão')
      
      const data = await response.json()
      setIsActive(data.status === 'active')
      setTimeLimit(data.timeLimit || 60)
      setParticipants(data.participants || [])
    } catch (err) {
      console.error('Erro ao buscar status:', err)
      setError('Falha ao verificar status da sessão')
    }
  }, [quizId])

  const startSession = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'active',
          timeLimit 
        })
      })

      if (!response.ok) throw new Error('Falha ao iniciar sessão')
      
      setIsActive(true)
      onSessionStart?.()
      await fetchSessionStatus()
    } catch (err) {
      console.error('Erro ao iniciar sessão:', err)
      setError('Falha ao iniciar sessão do quiz')
      throw err
    } finally {
      setLoading(false)
    }
  }, [quizId, timeLimit, fetchSessionStatus, onSessionStart])

  const pauseSession = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' })
      })

      if (!response.ok) throw new Error('Falha ao pausar sessão')
      
      setIsActive(false)
      await fetchSessionStatus()
    } catch (err) {
      console.error('Erro ao pausar sessão:', err)
      setError('Falha ao pausar sessão do quiz')
      throw err
    } finally {
      setLoading(false)
    }
  }, [quizId, fetchSessionStatus])

  const updateTimeLimit = useCallback(async (newTimeLimit: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/quiz/${quizId}/session`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeLimit: newTimeLimit })
      })

      if (!response.ok) throw new Error('Falha ao atualizar tempo limite')
      
      setTimeLimit(newTimeLimit)
      await fetchSessionStatus()
    } catch (err) {
      console.error('Erro ao atualizar tempo:', err)
      setError('Falha ao atualizar tempo limite')
      throw err
    } finally {
      setLoading(false)
    }
  }, [quizId, fetchSessionStatus])

  // Polling para atualizações de status
  useEffect(() => {
    if (!quizId) return

    const interval = setInterval(fetchSessionStatus, 5000)
    fetchSessionStatus()

    return () => clearInterval(interval)
  }, [quizId, fetchSessionStatus])

  return {
    isActive,
    participants,
    timeLimit,
    error,
    loading,
    startSession,
    pauseSession,
    updateTimeLimit
  }
}
    ```

    - 📄 useQuizTimer.ts
    
```typescript
import { useState, useEffect, useCallback } from 'react'

interface QuizTimerOptions {
  initialTime: number // em segundos
  onTimeUp?: () => void
  autoStart?: boolean
}

export const useQuizTimer = ({
  initialTime,
  onTimeUp,
  autoStart = true,
}: QuizTimerOptions) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isPaused, setIsPaused] = useState(false)

  const start = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    if (isPaused) {
      setIsRunning(true)
      setIsPaused(false)
    }
  }, [isPaused])

  const reset = useCallback(() => {
    setTimeLeft(initialTime)
    setIsRunning(autoStart)
    setIsPaused(false)
  }, [initialTime, autoStart])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(interval)
          onTimeUp?.()
          return 0
        }
        return prev - 0.1 // Atualização a cada 100ms
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, onTimeUp])

  return { timeLeft, isRunning, isPaused, start, pause, resume, reset }
}
    ```

    - 📄 useRanking.ts
    
```typescript
// src/hooks/useRanking.ts
import { useState, useEffect, useCallback } from 'react'

interface RankingEntry {
  id: string
  playerName: string
  score: number
  timeSpent: number
  rank: number
  createdAt: string
}

export function useRanking(quizId: string, pollingInterval = 3000) { // Aumentei o intervalo para 3 segundos
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPolling, setIsPolling] = useState(true)

  const fetchRankings = useCallback(async () => {
    if (!isPolling) return;
    
    try {
      const response = await fetch(`/api/quiz/${quizId}/ranking`)
      
      if (!response.ok) {
        throw new Error('Falha ao carregar ranking')
      }

      const data = await response.json()
      setRankings(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao buscar ranking:', err)
    }
  }, [quizId, isPolling])

  useEffect(() => {
    fetchRankings()
    
    const intervalId = setInterval(fetchRankings, pollingInterval)

    return () => {
      clearInterval(intervalId)
      setIsPolling(false)
    }
  }, [fetchRankings, pollingInterval])

  return {
    rankings,
    loading,
    error,
    stopPolling: () => setIsPolling(false),
    startPolling: () => setIsPolling(true)
  }
}
    ```

    - 📄 useTimer.ts
    
```typescript
// src/hooks/useTimer.ts
import { useState, useEffect, useCallback } from 'react'

interface UseTimerProps {
  initialTime: number // em segundos
  onComplete?: () => void
  autoStart?: boolean
}

export function useTimer({
  initialTime,
  onComplete,
  autoStart = true
}: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isPaused, setIsPaused] = useState(false)

  const start = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(initialTime)
    setIsRunning(false)
    setIsPaused(false)
  }, [initialTime])

  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRunning(false)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, onComplete])

  return {
    timeLeft,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    reset,
    progress: (timeLeft / initialTime) * 100
  }
}




    ```

    - 📄 useToast.ts
    
```typescript

    ```

  - 📁 lib/
    - 📄 animations.ts
    
```typescript
// src/lib/animations.ts
import { gsap } from 'gsap'

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: { duration: 0.3 }
}

export function createParticles(
  container: HTMLElement,
  count: number,
  options: {
    size?: string
    color?: string
    duration?: number
    spread?: number
  } = {}
) {
  const {
    size = 'w-2 h-2',
    color = 'bg-blue-500',
    duration = 2,
    spread = 100
  } = options

  const particles = Array.from({ length: count }).map(() => {
    const particle = document.createElement('div')
    particle.className = `absolute ${size} ${color} rounded-full opacity-50`
    return particle
  })

  particles.forEach(particle => {
    container.appendChild(particle)
    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: Math.random() * 0.5 + 0.5
    })

    gsap.to(particle, {
      duration: duration + Math.random() * 2,
      x: `+=${Math.random() * spread - spread / 2}`,
      y: `+=${Math.random() * spread - spread / 2}`,
      opacity: Math.random() * 0.3 + 0.2,
      scale: Math.random() * 0.5 + 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'none'
    })
  })

  return () => particles.forEach(p => p.remove())
}

export function createConfetti(
  container: HTMLElement,
  count: number = 50
) {
  const colors = [
    'bg-yellow-500',
    'bg-pink-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500'
  ]

  const particles = Array.from({ length: count }).map(() => {
    const particle = document.createElement('div')
    const color = colors[Math.floor(Math.random() * colors.length)]
    particle.className = `absolute w-3 h-3 ${color} rounded-lg`
    return particle
  })

  particles.forEach(particle => {
    container.appendChild(particle)
    
    gsap.fromTo(
      particle,
      {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        scale: 0
      },
      {
        duration: Math.random() * 2 + 1,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: Math.random() * 1 + 0.5,
        ease: 'power4.out',
        onComplete: () => {
          gsap.to(particle, {
            duration: 0.5,
            opacity: 0,
            scale: 0,
            onComplete: () => particle.remove()
          })
        }
      })
  })

  return () => particles.forEach(p => p.remove())
}

export const transitionVariants = {
  pageInitial: {
    opacity: 0,
    x: -20
  },
  pageAnimate: {
    opacity: 1,
    x: 0
  },
  pageExit: {
    opacity: 0,
    x: 20
  }
}

export const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20
  }
}

export function createRipple(
  event: React.MouseEvent<HTMLElement>,
  color: string = 'rgba(255, 255, 255, 0.7)'
) {
  const button = event.currentTarget
  const circle = document.createElement('span')
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  const rect = button.getBoundingClientRect()
  
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - rect.left - radius}px`
  circle.style.top = `${event.clientY - rect.top - radius}px`
  circle.style.position = 'absolute'
  circle.style.borderRadius = '50%'
  circle.style.backgroundColor = color
  circle.style.transform = 'scale(0)'
  circle.style.animation = 'ripple 600ms linear'

  const ripple = button.getElementsByClassName('ripple')[0]
  if (ripple) {
    ripple.remove()
  }

  circle.classList.add('ripple')
  button.appendChild(circle)

  return () => circle.remove()
}
    ```

    - 📄 auth.ts
    
```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDatabase } from "./mongodb";
import { User } from "@/models";
import { Model } from "mongoose";
import { IUser } from "@/models";

// Tipagem explícita para o modelo User
type UserModel = Model<IUser>;

export const authOptions: NextAuthOptions = {
  // Provedores de autenticação
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Verifica se as credenciais foram fornecidas
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Conecta ao banco de dados
          await connectToDatabase();

          // Busca o usuário no banco de dados - com cast explícito para UserModel
          const user = await (User as UserModel).findOne({ email: credentials.email });

          // Se o usuário não existir, retorna null
          if (!user) {
            console.log(`Usuário não encontrado: ${credentials.email}`);
            return null;
          }

          // Verifica se a senha está correta
          const passwordIsValid = await compare(credentials.password, user.password);

          // Se a senha estiver incorreta, retorna null
          if (!passwordIsValid) {
            console.log(`Senha inválida para o usuário: ${credentials.email}`);
            return null;
          }

          // Retorna o usuário
          console.log(`Login bem-sucedido para: ${credentials.email}`);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  // Configurações da sessão
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  // Páginas personalizadas
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Página de erro (também pode ser personalizada)
  },
  // Callbacks
  callbacks: {
    // Modifica o token JWT para incluir o id do usuário
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Modifica a sessão para incluir o id do usuário
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // Callback de redirecionamento após login/logout
    async redirect({ url, baseUrl }) {
      // Força redirecionamento para dashboard após login bem-sucedido
      if (url.startsWith(baseUrl)) {
        // Mantém URLs internas (mesmo site)
        if (url.includes("/login") || url === baseUrl || url === `${baseUrl}/`) {
          return `${baseUrl}/dashboard`;
        }
        return url;
      } else if (url.startsWith("/")) {
        // Converte URLs relativas
        return `${baseUrl}${url}`;
      }
      // Retorna para a URL original ou para o baseUrl
      return url.startsWith("http") ? url : baseUrl;
    },
  },
  // Configurações secretas
  secret: process.env.NEXTAUTH_SECRET,
  // Habilitar debug em desenvolvimento
  debug: process.env.NODE_ENV === "development",
};
    ```

    - 📄 init-mongodb.ts
    
```typescript
import { connectToDatabase } from "./mongodb";
// import mongoose, { Model } from "mongoose";
import { IUser, User } from "@/models";
import bcrypt from "bcryptjs";
import { Model } from "mongoose";

// Tipando o modelo User explicitamente
type UserModel = Model<IUser>;

async function initMongoDB() {
  try {
    console.log("Conectando ao MongoDB...");
    await connectToDatabase();
    console.log("Conexão com MongoDB estabelecida com sucesso!");

    // Verifica se existe algum usuário
    const userCount = await (User as UserModel).countDocuments();

    if (userCount === 0) {
      console.log("Nenhum usuário encontrado. Criando usuário de teste...");

      // Cria um usuário de teste
      const hashedPassword = await bcrypt.hash("123456", 10);

      const testUser = await (User as UserModel).create({
        name: "Usuário Teste",
        email: "teste@exemplo.com",
        password: hashedPassword,
      });

      console.log("Usuário de teste criado com sucesso:", {
        id: testUser._id.toString(),
        name: testUser.name,
        email: testUser.email,
      });
    } else {
      console.log(`${userCount} usuário(s) encontrado(s) no banco de dados.`);
    }
  } catch (error) {
    console.error("Erro ao inicializar MongoDB:", error);
  }
}

// Executar em ambiente de desenvolvimento
if (process.env.NODE_ENV !== "production") {
  initMongoDB();
}

export default initMongoDB;
    ```

    - 📄 mongodb.ts
    
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor defina a variável de ambiente MONGODB_URI');
}

// Interface para nossa cache global
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cache para conexão
const globalForMongoose = global as unknown as {
  mongoose: MongooseCache | undefined;
};

// Em desenvolvimento, usamos uma variável global para preservar a conexão
// entre hot reloads, caso contrário, em produção usamos uma conexão normal
const cached: MongooseCache = globalForMongoose.mongoose ?? {
  conn: null,
  promise: null
};

// Inicializa a cache global na primeira execução
if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('Conexão com MongoDB estabelecida');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
    ```

    - 📄 scoring.ts
    
```typescript
export interface TimedScore {
    basePoints: number;
    timeBonus: number;
    total: number;
  }
  
  export const calculateTimedScore = (
    timeLeft: number,
    maxTime: number = 1000,
    basePoints: number = 100
  ): TimedScore => {
    // Time bonus calculation (0-900 points based on remaining time)
    const timeBonus = Math.floor((timeLeft / maxTime) * 900);
    
    return {
      basePoints,
      timeBonus,
      total: basePoints + timeBonus
    };
  };
    ```

    - 📄 utils.ts
    
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

    ```

    - 📄 websocket.ts
    
```typescript
import { Server } from "socket.io";
import { createServer } from "http";
import { connectToDatabase } from "./mongodb";
import { QuizSession } from "@/models";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", async (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("joinQuiz", async (quizId: string) => {
    await connectToDatabase();
    const session = await QuizSession.findOne({ quizId });
    socket.join(quizId);
    io.to(quizId).emit("participantUpdate", session?.participants.length || 0);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

httpServer.listen(3001, () => console.log("WebSocket rodando na porta 3001"));
    ```

  - 📄 middleware.ts
  
```typescript
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Log para diagnóstico
  console.log('Middleware executado para:', request.nextUrl.pathname)
  
  // Tenta obter o token
  let token: any
  try {
    token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    console.log('Token encontrado:', !!token)
  } catch (error) {
    console.error('Erro ao tentar verificar token:', error)
  }
  
  // URLs completos para redirecionamento
  const loginUrl = new URL('/login', request.url)
  const dashboardUrl = new URL('/dashboard', request.url)
  
  // Verificações para rotas específicas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('Não autenticado, redirecionando para login')
      return NextResponse.redirect(loginUrl)
    }
    console.log('Autenticado para dashboard, permitindo acesso')
    return NextResponse.next()
  }
  
  // Redirecionamento para usuários autenticados em páginas de autenticação
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    console.log('Autenticado em página de login/registro, redirecionando para dashboard')
    return NextResponse.redirect(dashboardUrl)
  }
  
  // Para a rota principal (homepage)
  if (request.nextUrl.pathname === '/') {
    if (token) {
      console.log('Autenticado na homepage, redirecionando para dashboard')
      return NextResponse.redirect(dashboardUrl)
    }
    console.log('Não autenticado na homepage, redirecionando para login')
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

// Configure o matcher para aplicar somente nas rotas necessárias
export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register']
}
  ```

  - 📁 models/
    - 📄 index copy.ts
    
```typescript
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
    ```

    - 📄 index.ts
    
```typescript
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
  totalQuestions: number; // Calculado no servidor, não obrigatório no envio
  timeSpent: number;
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    timeToAnswer: number;
    isCorrect: boolean; // Calculado no servidor
  }[];
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

// const QuestionSchema = new Schema<IQuestion>(
//   {
//     text: { type: String, required: true },
//     options: { type: [String], required: true },
//     correctAnswer: { type: Number, required: true },
//     order: { type: Number, required: true },
//   },
//   { _id: false }
// );

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
    isCorrect: { type: Boolean, required: false }, // Tornar opcional, calculado no servidor
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
    totalQuestions: { type: Number, required: false }, // Tornar opcional, calculado no servidor
    timeSpent: { type: Number, required: true, default: 0 },
    answers: { type: [AnswerSchema], default: [] },
  },
  { timestamps: true }
);

// const ParticipantSchema = new Schema<IParticipant>(
//   {
//     userId: { type: String, default: null },
//     name: { type: String, required: true },
//     avatar: { type: String, required: true },
//     joined: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// Modelos - Evitar redefinição
export const User = (mongoose.models.User || mongoose.model<IUser>("User", UserSchema)) as typeof mongoose.Model<IUser>;
export const Quiz = (mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema)) as typeof mongoose.Model<IQuiz>;
export const QuizResult = (mongoose.models.QuizResult || mongoose.model<IQuizResult>("QuizResult", QuizResultSchema)) as typeof mongoose.Model<IQuizResult>;
export { QuizSession }; // Reexporte o modelo
    ```

    - 📄 QuizSession.ts
    
```typescript
// src/models/QuizSession.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IParticipant {
  userId: string | null;
  name: string;
  avatar: string;
  joined: Date;
  score: number;
  timeBonus: number;
  lastActive: Date;
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
    }
  }]
}, {
  timestamps: true
});

// Evite redefinição do modelo
export const QuizSession = (mongoose.models.QuizSession || mongoose.model<IQuizSession>('QuizSession', QuizSessionSchema)) as typeof mongoose.Model<IQuizSession>;
    ```

  - 📁 providers/
    - 📄 SessionProvider.tsx
    
```tsx
'use client'

import { SessionProvider } from "next-auth/react"

export default function AuthProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <SessionProvider>{children}</SessionProvider>
}
    ```

  - 📁 store/
    - 📄 index.ts
    
```typescript
"use client";

import { create } from "zustand";

type Question = {
  text: string;
  options: string[];
  correctAnswer: number;
  order: number;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isPublished?: boolean;
  totalTimeLimit?: number; // Tempo total em minutos
};

type Answer = {
  questionIndex: number;
  selectedAnswer: number;
  timeToAnswer: number; // Tempo em milissegundos
};

type Participant = {
  userId: string | null;
  name: string;
  avatar: string;
  joined: Date;
  score: number;
  timeTaken: number; // Tempo total gasto em segundos
  lastActive?: Date;
};

type QuizState = {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  score: number;
  playerName: string;
  playerAvatar: string;
  participants: Participant[];
  answers: Answer[];
  timeLimit: number; // Tempo total restante em segundos
  currentStep: "welcome" | "waiting" | "quiz" | "results";
  setQuiz: (quiz: Quiz) => void;
  setCurrentStep: (step: "welcome" | "waiting" | "quiz" | "results") => void;
  setPlayerName: (name: string) => void;
  setPlayerAvatar: (avatar: string) => void;
  answerQuestion: (
    quizId: string,
    questionIndex: number,
    answer: number,
    timeTaken: number // Tempo em segundos
  ) => void;
  joinSession: (quizId: string, playerName: string, playerAvatar: string) => Promise<void>;
  fetchQuiz: (quizId: string) => Promise<void>;
  updateTimeLeft: (timeLeft: number) => void;
  finishQuiz: (quizId: string, answers: Answer[]) => Promise<void>;
  startQuiz: () => void; // Adicionado ao tipo
};

// Função para calcular a pontuação regressiva
function calculateRegressiveScore(timeTaken: number, maxTime: number = 10): number {
  const maxScore = 1000; // Pontuação máxima por questão
  if (timeTaken >= maxTime) return 0; // Se exceder o tempo máximo, pontuação é 0
  const score = Math.floor(maxScore * (1 - timeTaken / maxTime)); // Diminui linearmente
  return Math.max(score, 0); // Garante que não seja negativo
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  score: 0,
  playerName: "",
  playerAvatar: "",
  participants: [],
  answers: [],
  timeLimit: 300, // Padrão: 5 minutos (300 segundos)
  currentStep: "welcome",

  setQuiz: (quiz) =>
    set({ currentQuiz: quiz, timeLimit: (quiz.totalTimeLimit || 5) * 60, answers: [] }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setPlayerName: (name) => set({ playerName: name }),
  setPlayerAvatar: (avatar) => set({ playerAvatar: avatar }),

  answerQuestion: (quizId, questionIndex, answer, timeTaken) => {
    const state = useQuizStore.getState();
    const question = state.currentQuiz?.questions[questionIndex];
    const isCorrect = question && question.correctAnswer === answer;
    const score = isCorrect ? calculateRegressiveScore(timeTaken) : 0;

    console.log(
      `[Store] Resposta - Quiz: ${quizId}, Questão: ${questionIndex}, Resposta: ${answer}, Pontuação: ${score}, Tempo: ${timeTaken}s`
    );

    set((state) => ({
      score: state.score + score,
      currentQuestionIndex: state.currentQuestionIndex + 1,
      answers: [
        ...state.answers,
        { questionIndex, selectedAnswer: answer, timeToAnswer: timeTaken * 1000 },
      ],
      participants: state.participants.map((p) =>
        p.name === state.playerName && p.avatar === state.playerAvatar
          ? { ...p, score: p.score + score, timeTaken }
          : p
      ),
    }));
  },

  joinSession: async (quizId, playerName, playerAvatar) => {
    try {
      console.log(`[Store] Entrando na sessão do quiz ${quizId} com ${playerName}`);
      const response = await fetch(`/api/quiz/${quizId}/session/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, playerAvatar }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to join session";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      set((state) => ({
        participants: [
          ...state.participants,
          {
            userId: null,
            name: playerName,
            avatar: playerAvatar,
            joined: new Date(),
            score: 0,
            timeTaken: 0,
          },
        ],
        currentStep: "waiting",
      }));
    } catch (error) {
      console.error("[Store] Erro ao entrar na sessão:", error);
      throw error;
    }
  },

  fetchQuiz: async (quizId) => {
    try {
      console.log(`[Store] Buscando quiz ${quizId}`);
      const response = await fetch(`/api/quiz/${quizId}/public`);
      if (!response.ok) {
        throw new Error("Falha ao carregar quiz");
      }
      const quizData: Quiz = await response.json();
      set({
        currentQuiz: quizData,
        currentQuestionIndex: 0,
        score: 0,
        timeLimit: (quizData.totalTimeLimit || 5) * 60,
        answers: [],
      });
      console.log(`[Store] Quiz ${quizId} carregado:`, quizData);
    } catch (error) {
      console.error("[Store] Erro ao buscar quiz:", error);
      throw error;
    }
  },

  updateTimeLeft: (timeLeft) => set({ timeLimit: timeLeft }),

  finishQuiz: async (quizId, answers) => {
    try {
      console.log(`[Store] Finalizando quiz ${quizId} com ${answers.length} respostas`);
      const { playerName, playerAvatar } = useQuizStore.getState();
      if (!playerName) {
        throw new Error("Nome do jogador não definido");
      }

      const response = await fetch(`/api/quiz/${quizId}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, playerAvatar: playerAvatar || "", answers }),
      });

      if (!response.ok) {
        let errorMessage = "Falha ao salvar resultado";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text || `Erro ${response.status}`;
        }
        console.error("[Store] Resposta da API:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("[Store] Resultado salvo:", data);

      const rankingResponse = await fetch(`/api/quiz/${quizId}/ranking`);
      if (!rankingResponse.ok) {
        throw new Error("Falha ao carregar ranking");
      }
      const rankingData: Participant[] = await rankingResponse.json();
      set({ participants: rankingData, currentStep: "results" });
    } catch (error) {
      console.error("[Store] Erro ao finalizar quiz:", error);
      throw error;
    }
  },

  startQuiz: () => {
    set((state) => {
      if (!state.currentQuiz) {
        console.error("[Store] Nenhum quiz carregado para iniciar");
        return state; // Não faz nada se não houver quiz
      }
      if (!state.playerName.trim()) {
        console.error("[Store] Nome do jogador não definido");
        return state; // Não inicia sem nome
      }
      console.log(`[Store] Iniciando quiz para ${state.playerName}`);
      return {
        currentStep: "quiz",
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
      };
    });
  },
}));
    ```

    - 📄 quizSessionStore.ts
    
```typescript
// src/store/quizSessionStore.ts
import { create } from 'zustand'

interface Participant {
  userId: string | null
  name: string
  avatar: string
  joined: string
  score?: number
  timeBonus?: number
  lastActive?: string
}

interface QuizSessionState {
  timeLimit: number
  currentQuestion: number
  timeLeft: number
  participants: Participant[]
  isActive: boolean
  isPaused: boolean
  startTime: string | null
  endTime: string | null
  
  // Actions
  setTimeLimit: (time: number) => void
  startSession: () => void
  pauseSession: () => void
  resetSession: () => void
  updateTimeLeft: (time: number) => void
  updateParticipants: (participants: Participant[]) => void
}

export const useQuizSessionStore = create<QuizSessionState>((set) => ({
  timeLimit: 30,
  currentQuestion: 0,
  timeLeft: 1000,
  participants: [],
  isActive: false,
  isPaused: false,
  startTime: null,
  endTime: null,

  setTimeLimit: (time) => set({ timeLimit: time }),
  startSession: () => set({ isActive: true, isPaused: false, startTime: new Date().toISOString() }),
  pauseSession: () => set({ isPaused: true }),
  resetSession: () => set({ 
    currentQuestion: 0,
    timeLeft: 1000,
    participants: [],
    isActive: false,
    isPaused: false,
    startTime: null,
    endTime: null
  }),
  updateTimeLeft: (time) => set({ timeLeft: time }),
  updateParticipants: (participants) => set({ participants })
}))


    ```

  - 📁 types/
    - 📄 error.ts
    
```typescript
export type CustomError = {
    message: string;
    code?: string;
    status?: number;
  };
    ```

    - 📄 index.ts
    
```typescript
// src/types/index.ts

export type User = {
  id: string
  name: string
  email: string
}

export type Question = {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

export type Quiz = {
  id: string
  title: string
  description: string
  questions: Question[]
  isPublished: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Atualizado para incluir tempo
export type QuizResult = {
  id: string
  quizId: string
  userId?: string | null
  playerName: string
  score: number
  totalQuestions: number
  timeSpent: number // tempo total em segundos
  answers: {
    questionIndex: number
    selectedAnswer: number
    timeToAnswer: number // tempo para responder em segundos
    isCorrect: boolean
  }[]
  createdAt: Date
  updatedAt?: Date
}

// Nova definição para sessão de quiz
export type QuizSession = {
  id: string
  quizId: string
  isActive: boolean
  startsAt: Date | null
  endsAt: Date | null
  participants: {
    userId: string | null
    name: string
    joined: Date
  }[]
  createdAt: Date
  updatedAt?: Date
}
    ```

    - 📄 next-auth.d.ts
    
```typescript
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
  }
}
    ```

  - 📁 utils/
    - 📄 cn.ts
    
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
    ```
