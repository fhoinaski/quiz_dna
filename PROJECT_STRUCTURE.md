# Estrutura do Projeto

**Gerado em:** 22/02/2025, 08:26:03  
**Node Version:** v18.20.4  
**Diretório Raiz:** `E:\Projetos\quiz-dna\dna-vital-quiz-next`

- 📄 .env.example
- 📄 .eslintrc.js

```javascript
// .eslintrc.js
module.exports = {
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    parser: "@typescript-eslint/parser", // Define o parser para TypeScript
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    extends: [
      "next/core-web-vitals", // Configuração padrão do Next.js
      "plugin:@typescript-eslint/recommended", // Regras recomendadas do @typescript-eslint
    ],
    plugins: ["@typescript-eslint"], // Adiciona o plugin @typescript-eslint
    rules: {
    
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "off", // Define como aviso
      "@typescript-eslint/no-unused-vars": "error", // Define como erro
    },
  };
```

- 📄 .gitattributes
- 📄 components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- 📄 generate-code-map.js

```javascript
// generate-code-map.js
const fs = require('fs');
const path = require('path');

// Configurações
const EXCLUDED_DIRS = ['node_modules', '.next', '.git', '.github'];
const EXCLUDED_FILES = ['.gitignore', '.env', 'package-lock.json', 'yarn.lock'];
const TEXT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss', '.html', '.md'];
const MAX_CONTENT_LINES = 30;

function findProjectRoot() {
  let currentDir = __dirname;
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error('Raiz do projeto não encontrada');
}

function buildMarkdown(structure, depth = 0) {
  if (!structure || typeof structure !== 'object' || Object.keys(structure).length === 0) {
    return '';
  }

  let md = '';
  const indent = '  '.repeat(depth);

  for (const [name, item] of Object.entries(structure)) {
// ... (conteúdo truncado)
```

- 📄 global.d.ts

```typescript
import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Isso é necessário para que o TypeScript trate este arquivo como um módulo
export {};
```

- 📄 netlify.toml
- 📄 next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

- 📄 next.config.mjs
- 📄 package.json

```json
{
  "name": "dna-vital-quiz-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-slot": "^1.1.2",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.4.5",
    "gsap": "^3.12.7",
    "lucide-react": "^0.475.0",
    "mongoose": "^8.10.1",
    "next": "^15.1.7",
    "next-auth": "^4.24.11",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "shadcn-ui": "^0.9.4",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
// ... (conteúdo truncado)
```

- 📄 postcss.config.mjs
- 📄 PROJECT_STRUCTURE.md

```md
# Estrutura do Projeto

**Gerado em:** 22/02/2025, 01:05:47  
**Node Version:** v18.20.4  
**Diretório Raiz:** `E:\Projetos\quiz-dna\dna-vital-quiz-next`

- 📄 .env.example
- 📄 .eslintrc.js

```javascript
// .eslintrc.js
module.exports = {
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    parser: "@typescript-eslint/parser", // Define o parser para TypeScript
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    extends: [
      "next/core-web-vitals", // Configuração padrão do Next.js
      "plugin:@typescript-eslint/recommended", // Regras recomendadas do @typescript-eslint
    ],
    plugins: ["@typescript-eslint"], // Adiciona o plugin @typescript-eslint
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "warn", // Define como aviso
// ... (conteúdo truncado)
```

- 📁 public/
  - 📄 file.svg
  - 📄 globe.svg
  - 📄 next.svg
  - 📄 vercel.svg
  - 📄 window.svg
- 📄 README.md

```md
# Migração de Prisma para Mongoose

Este guia explica as mudanças feitas para migrar o projeto do Prisma para o Mongoose.

## Mudanças Principais

1. **Instalação do Mongoose**: Removemos o Prisma e instalamos o Mongoose como ORM para MongoDB.

2. **Modelos de Dados**: Criamos modelos Mongoose equivalentes aos modelos Prisma anteriores:
   - User
   - Quiz
   - QuizResult

3. **Conexão com o Banco de Dados**: Implementamos um sistema de conexão persistente com o MongoDB.

4. **APIs**: Atualizamos todas as APIs para usar o Mongoose em vez do Prisma.

5. **Tipos**: Atualizamos as definições de tipos para refletir a estrutura do MongoDB.

## Como configurar o projeto

1. Crie um arquivo `.env` com base no `.env.example` fornecido e configure sua URI do MongoDB.

2. Instale as dependências:
   ```
   npm install
   ```

3. Execute o projeto em desenvolvimento:
   ```
// ... (conteúdo truncado)
```

- 📁 src/
  - 📁 app/
    - 📁 (auth)/
      - 📁 login/
        - 📄 page.tsx
        
```tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const particlesRef = useRef<HTMLDivElement>(null)
  const [redirectCount, setRedirectCount] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Configuração das partículas
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
// ... (conteúdo truncado)
        ```

      - 📁 register/
        - 📄 page.tsx
        
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Link from 'next/link'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (particlesRef.current) {
      const particles = Array.from({ length: 50 }).map(() => {
        const particle = document.createElement('div')
        particle.className = 'absolute w-2 h-2 bg-blue-600 rounded-full opacity-50'
// ... (conteúdo truncado)
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

      - 📁 quiz/
        - 📄 route.ts
        
```typescript
import { NextRequest, NextResponse } from "next/server"; // Use NextRequest para consistência
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, Quiz } from "@/models";

// Tipando o modelo Quiz explicitamente
type QuizModel = Model<IQuiz>;

// POST - Criar novo quiz
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Validação básica dos campos obrigatórios
    if (!body.title || !body.description || !body.questions) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Cria o quiz com tipagem explícita
    const quiz = await (Quiz as QuizModel).create({
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
              ```

            - 📄 route.ts
            
```typescript
// src/app/api/quiz/[quizId]/results/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizResult, Quiz, QuizResult } from "@/models";

// Tipando os modelos explicitamente
type QuizModel = Model<IQuiz>;
type QuizResultModel = Model<IQuizResult>;

// Função para calcular bônus de tempo
function calculateTimeBonus(timeToAnswer: number): number {
  // Se responder em menos de 3 segundos, ganha 50 pontos extras
  // Se responder entre 3 e 10 segundos, ganha entre 1 e 50 pontos extras (linear)
  // Após 10 segundos, não há bônus
  if (timeToAnswer <= 3) {
    return 50;
  } else if (timeToAnswer <= 10) {
    return Math.floor(50 * ((10 - timeToAnswer) / 7));
  } else {
    return 0;
  }
}

// POST - Criar novo resultado de quiz (pode ser enviado sem autenticação)
export async function POST(
  request: NextRequest,
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
          ```

          - 📁 session/
            - 📁 join/
              - 📄 route.ts
              
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose, { Model } from 'mongoose'
import { IQuizSession, QuizSession } from '@/models'

// Tipagem explícita para o modelo QuizSession
type QuizSessionModel = Model<IQuizSession>

// Interface para o corpo da requisição
interface JoinRequestBody {
  playerName: string
  playerAvatar: string
  userId?: string | null
}

export async function POST(request: NextRequest, context: { params: Promise<{ quizId: string }> }) {
  try {
    // Extrair os parâmetros da URL
    const params = await context.params
    const { quizId } = params
    console.log(`[POST /api/quiz/${quizId}/session/join] Recebendo requisição para quizId: ${quizId}`)

    // Validar o quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      console.error(`[ERROR] ID de quiz inválido: ${quizId}`)
      return NextResponse.json(
        { error: 'ID de quiz inválido', details: 'O quizId fornecido não é um ObjectId válido' },
        { status: 400 }
      )
    }
// ... (conteúdo truncado)
              ```

            - 📄 route.ts
            
```typescript
// src/app/api/quiz/[quizId]/session/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose, { Model } from "mongoose";
import { IQuiz, IQuizSession, Quiz, QuizSession } from "@/models";

type QuizModel = Model<IQuiz>;
type QuizSessionModel = Model<IQuizSession>;

// POST - Criar ou atualizar sessão de quiz
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const params = await context.params;
    const { quizId } = params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json(
        { error: "ID de quiz inválido" },
        { status: 400 }
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
        ```

    - 📁 dashboard/
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
// ... (conteúdo truncado)
      ```

      - 📄 page.tsx
      
```tsx
// src/app/dashboard/page.tsx
'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { QuizList } from '@/components/dashboard/QuizList'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">Meus Quizzes</h1>
        <Link href="/dashboard/quiz/create" passHref>
          <Button size="sm" className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Quiz
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <QuizList />
      </div>
      
      {/* Informações adicionais */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-2">Instruções Rápidas</h2>
          <p className="text-gray-600 text-sm">
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
          ```

        - 📁 [quizId]/
          - 📁 edit/
            - 📄 page.tsx
            
```tsx
// src/app/dashboard/quiz/[quizId]/edit/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { QuizForm } from '@/components/dashboard/QuizForm'
import { QuizControlPanel } from '@/components/dashboard/QuizControlPanel'

// Interfaces
interface Question {
  id?: string
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
  isPublished: boolean
}

export default function EditQuizPage() {
// ... (conteúdo truncado)
            ```

          - 📁 results/
            - 📄 page.tsx
            
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, ArrowLeft, AlertTriangle } from 'lucide-react'

// Interfaces baseadas no seu projeto
interface Result {
  id: string
  playerName: string
  score: number
  totalQuestions: number
  createdAt: string
}

interface Quiz {
  id: string
  title: string
}

export default function QuizResultsPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const [results, setResults] = useState<Result[]>([])
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fetchAttempted, setFetchAttempted] = useState(false)
// ... (conteúdo truncado)
            ```

      - 📁 results/
        - 📄 page.tsx
        
```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart2 } from 'lucide-react'

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
  const [fetchAttempted, setFetchAttempted] = useState(false)

  useEffect(() => {
    // Evitar múltiplas chamadas
    if (fetchAttempted) return
    
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
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
import { useQuizStore } from '@/store'
import { QuizScreen } from '@/components/quiz/QuizScreen'
import { ResultsScreen } from '@/components/quiz/ResultsScreen'
import { WaitingRoom } from '@/components/quiz/WaitingRoom'
import { WelcomeScreen } from '@/components/quiz/WelcomeScreen'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

// interface Question {
//   text: string
//   options: string[]
//   correctAnswer: number
//   order: number
// }

// interface Quiz {
//   id: string
//   title: string
//   description: string
//   questions: Question[]
// }

export default function QuizPage() {
  const params = useParams()
  const quizId = params.quizId as string
  const [loading, setLoading] = useState(true)
// ... (conteúdo truncado)
        ```

        - 📁 ranking/
          - 📄 page.tsx
          
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, ArrowLeft, AlertTriangle, Globe, Eye } from 'lucide-react'
import { Particles } from '@/components/ui/Particles'
import { Button } from '@/components/ui/button'

interface Result {
  id: string
  playerName: string
  score: number
  totalQuestions: number
  createdAt: string
}

interface Quiz {
  id: string
  title: string
}

export default function RankingPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.quizId as string
  const [results, setResults] = useState<Result[]>([])
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
      ```

      - 📄 QuizControlPanel.tsx
      
```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Play, Pause, RefreshCw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

type QuizControlPanelProps = {
  quizId: string
}

interface SessionStatus {
  exists: boolean
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
  participants: {
    userId: string | null
    name: string
    joined: string
  }[]
}

export function QuizControlPanel({ quizId }: QuizControlPanelProps) {
  const [status, setStatus] = useState<SessionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)
  
// ... (conteúdo truncado)
      ```

      - 📄 QuizForm.tsx
      
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Globe, Info, FileText, Save, X } from 'lucide-react'
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
    isPublished?: boolean
  }
}

export function QuizForm({ initialData }: QuizFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [isPublic, setIsPublic] = useState(initialData?.isPublished ?? false)
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions ?? [{
      text: '',
      options: ['', '', '', ''],
// ... (conteúdo truncado)
      ```

      - 📄 QuizList.tsx
      
```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Edit, BarChart2, Trash2,  AlertTriangle, ExternalLink, Globe, Plus, Share2, Lock } from 'lucide-react'
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

// Definição de tipos com valores padrão
type Quiz = {
  id: string
  title: string
  description: string
  isPublished: boolean
  _count?: {
    results: number
  }
  createdAt: string
}

export function QuizList() {
// ... (conteúdo truncado)
      ```

      - 📄 ResultsTable.tsx
      
```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
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
        throw new Error('Falha ao carregar resultados')
      }
      
      const data = await response.json() as QuizResult[]
      
      // Remover resultados duplicados baseados no playerName (mantém o de maior pontuação)
      const uniqueResults = data.reduce<Record<string, QuizResult>>((acc, current) => {
        // Se é a primeira vez que vemos esse playerName ou o score é maior que o existente
// ... (conteúdo truncado)
      ```

      - 📄 Sidebar.tsx
      
```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, PlusCircle, BarChart2, Settings, HelpCircle, User } from 'lucide-react'
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
// ... (conteúdo truncado)
      ```

    - 📁 quiz/
      - 📄 QuizScreen.tsx
      
```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuizStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

export function QuizScreen() {
  const {
    currentQuiz,
    currentQuestionIndex,
    answerQuestion,
    // playerName,
    // questionStartTime,
  } = useQuizStore()
  const [timeLeft, setTimeLeft] = useState(1000) // Contagem de 1000 a 0
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex]

  // Contagem regressiva
  useEffect(() => {
    if (!currentQuestion) return
    setTimeLeft(1000) // Reinicia para 1000 a cada nova pergunta
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleAnswer(selectedOption ?? 0) // Responde automaticamente com 0 se o tempo acabar
// ... (conteúdo truncado)
      ```

      - 📄 ResultsScreen.tsx
      
```tsx
'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Button } from '@/components/ui/button'

export function ResultsScreen() {
  const { score, playerName, playerAvatar, currentQuiz } = useQuizStore()

  useEffect(() => {
    // Aqui você pode salvar o resultado na API, se desejar
  }, [])

  if (!currentQuiz) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white p-4 flex items-center justify-center"
    >
      <div className="text-center">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Parabéns, {playerName}!</h1>
        <span className="text-4xl">{playerAvatar}</span>
        <p className="text-xl mb-6">Sua pontuação: {score}</p>
        <Link href="/dashboard">
// ... (conteúdo truncado)
      ```

      - 📄 WaitingRoom.tsx
      
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuizStore } from '@/store'
import { gsap } from 'gsap'
import { Particles } from '@/components/ui/Particles'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { UserPlus,  Clock } from 'lucide-react'

// Lista de avatares disponíveis
const avatars = [
  '🧑‍🚀', '🐱', '🦁', '🐸', '🦄', '🤖', '🐼', '🦊', '🐻', '🐰',
  '🦝', '🐯', '🐵', '🐙', '🦎', '🐴', '🦜', '🐍', '🦋', '🐳',
]

export function WaitingRoom() {
  const {
    playerName,
    setPlayerName,
    // playerAvatar,
    setPlayerAvatar,
    currentQuiz,
    joinSession,
    checkSessionStatus,
    // isQuizActive,
    participants,
  } = useQuizStore()

  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null)
// ... (conteúdo truncado)
      ```

      - 📄 WelcomeScreen.tsx
      
```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Particles } from '@/components/ui/Particles'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'

// Lista de avatares (usando emojis como exemplo; você pode substituir por URLs de imagens)
const avatars = ['🧑‍🚀', '🐱', '🦁', '🐸', '🦄', '🤖', '🐼', '🦊']

export function WelcomeScreen() {
  const { currentQuiz, playerName, setPlayerName, startQuiz } = useQuizStore()
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [countdown, setCountdown] = useState<number | null>(null)

  // Escolher avatar aleatório ao montar o componente
  useEffect(() => {
    if (!selectedAvatar) {
      setSelectedAvatar(avatars[Math.floor(Math.random() * avatars.length)])
    }
  }, [selectedAvatar])

  // Iniciar contagem regressiva quando o nome for inserido
  useEffect(() => {
    if (playerName.trim() && countdown === null) {
      setCountdown(5) // 5 segundos para começar automaticamente
    }
// ... (conteúdo truncado)
      ```

    - 📄 QuizScreen.tsx
    
```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useQuizStore } from '@/store'

export const QuizScreen = () => {
  const { currentQuiz, currentQuestionIndex, answerQuestion } = useQuizStore()
  
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
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
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

// ... (conteúdo truncado)
    ```

  - 📁 lib/
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

// ... (conteúdo truncado)
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

// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
    ```

    - 📄 utils.ts
    
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
    ```

    - 📄 index.ts
    
```typescript
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
// ... (conteúdo truncado)
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
'use client'

import { create } from 'zustand'

type Question = {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

type Quiz = {
  id: string
  title: string
  description: string
  questions: Question[]
}

type Participant = {
  name: string
  avatar: string
  joined: Date
}

type QuizStore = {
  currentStep: 'waiting' | 'welcome' | 'quiz' | 'results'
  currentQuiz: Quiz | null
  playerName: string
  playerAvatar: string
  currentQuestionIndex: number
// ... (conteúdo truncado)
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
// ... (conteúdo truncado)
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

- 📄 tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
// ... (conteúdo truncado)
```

- 📄 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext", // Alinhar com "lib" e versões modernas do JS
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true, // Já está OK, mantém para evitar conflitos
    "strict": false, // Temporariamente desativar para diagnosticar o erro
    "noEmit": true,
    "esModuleInterop": true,
    "noImplicitAny": false, // Desativar junto com "strict" temporariamente
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
// ... (conteúdo truncado)
```

- 📄 vercel-build.js

```javascript
const { execSync } = require('child_process');

console.log('Building Next.js app...');
execSync('next build', { stdio: 'inherit' });
```

- 📄 vercel.json

```json
{
  "functions": {
    "src/app/api/**/*": {
      "memory": 1024
    }
  }
}
```
