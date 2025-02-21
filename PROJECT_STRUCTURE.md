# Estrutura do Projeto

**Gerado em:** 20/02/2025, 22:48:04  
**Node Version:** v18.20.4  
**Diretório Raiz:** `E:\Projetos\quiz-dna\dna-vital-quiz-next`

- 📄 .env.example
- 📄 .eslintrc.json

```json
{
    "extends": "next/core-web-vitals",
    "rules": {
      // "@typescript-eslint/no-explicit-any": ["error", {
      //   "ignoreRestArgs": true
      // }],
      // "@typescript-eslint/no-unused-vars": ["error", {
      //   "argsIgnorePattern": "^_",
      //   "varsIgnorePattern": "^_",
      //   "caughtErrorsIgnorePattern": "^_"
      // }],
      "react-hooks/exhaustive-deps": "warn",
      // "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error"
    }
  }
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

- 📄 eslint.config.mjs
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
declare global {
    var prisma: import('@prisma/client').PrismaClient | undefined;
  }
  
  // Isso é necessário para que o TypeScript trate este arquivo como um módulo
  export {};
```

- 📁 netlify/
  - 📁 functions/
    - 📄 postinstall.js
    
```javascript
// netlify/functions/postinstall.js
const { execSync } = require('child_process');

exports.handler = async function(event, context) {
  try {
    console.log('Gerando Prisma Client...');
    execSync('npx prisma generate');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Prisma Client gerado com sucesso' })
    };
  } catch (error) {
    console.error('Erro ao gerar Prisma Client:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao gerar Prisma Client' })
    };
  }
};
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
    "lint": "next lint",
    "vercel-build": "node vercel-build.js"
  },
  "prisma": {
    "schema": "prisma/schema.prisma"
  },
  "dependencies": {
    "@prisma/client": "^6.4.1",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-slot": "^1.1.2",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.4.5",
    "gsap": "^3.12.7",
    "lucide-react": "^0.475.0",
    "mongodb": "^6.13.0",
    "next": "^15.1.7",
    "next-auth": "^4.24.11",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "shadcn-ui": "^0.9.4",
// ... (conteúdo truncado)
```

- 📄 postcss.config.mjs
- 📁 prisma/
  - 📄 schema.prisma
- 📄 PROJECT_STRUCTURE.md

```md
# Estrutura do Projeto

**Gerado em:** 20/02/2025, 21:41:29  
**Node Version:** v18.20.4  
**Diretório Raiz:** `E:\Projetos\quiz-dna\dna-vital-quiz-next`

- 📄 .env.example
- 📄 .eslintrc.json

```json
{
    "extends": "next/core-web-vitals",
    "rules": {
      // "@typescript-eslint/no-explicit-any": ["error", {
      //   "ignoreRestArgs": true
      // }],
      // "@typescript-eslint/no-unused-vars": ["error", {
      //   "argsIgnorePattern": "^_",
      //   "varsIgnorePattern": "^_",
      //   "caughtErrorsIgnorePattern": "^_"
      // }],
      "react-hooks/exhaustive-deps": "warn",
      // "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error"
    }
  }
```

- 📄 .gitattributes
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
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
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
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function LoginPage() {
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
// app/api/quiz/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma  from "@/lib/prisma-client"

// POST - Criar novo quiz
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const quiz = await prisma.quiz.create({
      data: {
        title: body.title,
        description: body.description,
        questions: body.questions,
        userId: session.user.id,
        isPublished: body.isPublished || false
      }
    })

    return NextResponse.json(quiz)
// ... (conteúdo truncado)
        ```

        - 📁 [quizId]/
          - 📁 results/
            - 📄 route.ts
            
```typescript
import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma-client"

// Tipos
interface ResultRequestBody {
  playerName: string;
  score: number;
  totalQuestions: number;
}

interface RouteContext {
  params: Promise<{ quizId: string }>;
}

// Funções auxiliares
async function getQuizById(quizId: string) {
  try {
    return await prisma.quiz.findUnique({
      where: { id: quizId }
    });
  } catch (error) {
    console.error('Erro ao buscar quiz:', error);
    return null;
  }
}

async function getTopResults(quizId: string) {
  try {
    // Primeiro, pegamos os melhores resultados por jogador
    const results = await prisma.result.findMany({
// ... (conteúdo truncado)
            ```

          - 📄 route.ts
          
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma  from "@/lib/prisma-client"

interface RouteContext {
  params: Promise<{ quizId: string }>
}

// Helper function para validar o quizId
const validateQuizId = async (quizId: string) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId }
  })
  return quiz
}

// Helper function para validar a sessão
const validateSession = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }
  return session
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
// ... (conteúdo truncado)
          ```

      - 📁 register/
        - 📄 route.ts
        
```typescript
import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma-client'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            )
        }

        // Verifica se o email já está em uso
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email já está em uso' },
                { status: 400 }
            )
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10)
// ... (conteúdo truncado)
        ```

    - 📁 dashboard/
      - 📄 layout.tsx
      
```tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Header } from '@/components/dashboard/Header'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login') // Changed from '/auth/login' to '/login'
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Carregando...</div>
  }

  if (!session) {
    return null
  }

// ... (conteúdo truncado)
      ```

      - 📄 page.tsx
      
```tsx
'use client'


import Link from 'next/link'
import { Plus } from 'lucide-react'
import { QuizList } from '@/components/dashboard/QuizList'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Meus Quizzes</h1>
        <Link href="/dashboard/quiz/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Quiz
          </Button>
        </Link>
      </div>

      <QuizList />
    </div>
  )
}
      ```

      - 📁 quiz/
        - 📁 create/
          - 📄 page.tsx
          
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'

// Types
interface Question {
  text: string
  options: string[]
  correctAnswer: number
  order: number
}

interface QuizFormData {
  title: string
  description: string
  questions: Question[]
  isPublished: boolean
}

// Components
interface QuestionFormProps {
  question: Question
  questionIndex: number
  onUpdate: (index: number, field: keyof Question, value: string | string[] | number) => void
  onRemove: (index: number) => void
  canRemove: boolean
}
// ... (conteúdo truncado)
          ```

        - 📁 [quizId]/
          - 📁 edit/
            - 📄 page.tsx
            
```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Interfaces
interface Question {
  id: string
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

interface ApiError {
  message: string
}

// Componentes
// ... (conteúdo truncado)
            ```

      - 📁 results/
        - 📄 page.tsx
        
```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BarChart2, FileText } from 'lucide-react'

type Quiz = {
  id: string
  title: string
  description: string
  _count: {
    results: number
  }
}

type Result = {
  id: string
  quizId: string
  playerName: string
  score: number
  totalQuestions: number
  createdAt: string
  quiz: {
    title: string
  }
}

export default function DashboardResultsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
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
      - 📄 route.ts
      
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma  from "@/lib/prisma-client"

// POST - Criar novo quiz
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const quiz = await prisma.quiz.create({
      data: {
        title: body.title,
        description: body.description,
        questions: body.questions,
        userId: session.user.id,
        isPublished: body.isPublished || false
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
// ... (conteúdo truncado)
      ```

      - 📁 [quizId]/
        - 📄 page.tsx
        
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuizStore } from '@/store'
import { WelcomeScreen } from '@/components/quiz/WelcomeScreen'
import { QuizScreen } from '@/components/quiz/QuizScreen'
import { ResultsScreen } from '@/components/quiz/ResultsScreen'

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
}

interface ApiError {
  message: string
}

export default function QuizPage() {
  const params = useParams()
  const quizId = params.quizId as string
// ... (conteúdo truncado)
        ```

        - 📁 ranking/
          - 📄 page.tsx
          
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, ArrowLeft } from 'lucide-react'
import { Particles } from '@/components/ui/Particles'

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
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

type HeaderProps = {
  user?: {
    name?: string | null
    email?: string | null
  }
  onMenuClick?: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const handleSignOut = () => {
    signOut({
      callbackUrl: '/login', // Specify the redirect URL after signing out
      redirect: true
    })
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
// ... (conteúdo truncado)
      ```

      - 📄 QuizForm.tsx
      
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Upload } from 'lucide-react'
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
  }
}

export function QuizForm({ initialData }: QuizFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions ?? [{
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      order: 0
// ... (conteúdo truncado)
      ```

      - 📄 QuizList.tsx
      
```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Edit, BarChart2, Trash2, Eye } from 'lucide-react'
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

type Quiz = {
  id: string
  title: string
  description: string
  _count?: {
    results: number
  }
  createdAt: string
  isPublished: boolean
}

export function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
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

  const fetchResults = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/results`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Erro ao carregar resultados:', error)
    } finally {
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    const fetchData = async () => {
      await fetchResults()
// ... (conteúdo truncado)
      ```

      - 📄 Sidebar.tsx
      
```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, PlusCircle, BarChart2 } from 'lucide-react'
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

import { motion, AnimatePresence } from 'framer-motion'
import { useQuizStore } from '@/store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'

export function QuizScreen() {
  const { currentQuiz, currentQuestionIndex, answerQuestion } = useQuizStore()

  if (!currentQuiz) return null

  const currentQuestion = currentQuiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100

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
              animate={{ width: `${progress}%` }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
// ... (conteúdo truncado)
      ```

      - 📄 ResultsScreen.tsx
      
```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trophy, BarChart2 } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Particles } from '@/components/ui/Particles'

export function ResultsScreen() {
  const { score, playerName, currentQuiz } = useQuizStore()
  const [hasBeenSaved, setHasBeenSaved] = useState(false)

  useEffect(() => {
    let isMounted = true

    const saveResult = async () => {
      if (!currentQuiz || hasBeenSaved) return

      try {
        const response = await fetch(`/api/quiz/${currentQuiz.id}/results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            playerName,
            score,
            totalQuestions: currentQuiz.questions.length,
            timestamp: Date.now() // Adiciona timestamp para evitar duplicatas
// ... (conteúdo truncado)
      ```

      - 📄 WelcomeScreen.tsx
      
```tsx
'use client'

import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Particles } from '@/components/ui/Particles'

type Quiz = {
  id: string
  title: string
  description: string
  questions: {
    text: string
    options: string[]
    correctAnswer: number
    order: number
  }[]
}

type WelcomeScreenProps = {
  quiz: Quiz
}

export function WelcomeScreen({ quiz }: WelcomeScreenProps) {
  const { setPlayerName, startQuiz, playerName } = useQuizStore()

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <Particles />
      
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
        // Importação dinâmica do Prisma Client
        const prisma = (await import("./prisma-client")).default;

        try {
          // Verifica se as credenciais foram fornecidas
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Busca o usuário no banco de dados
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Se o usuário não existir, retorna null
          if (!user) {
// ... (conteúdo truncado)
    ```

    - 📄 db.ts
    
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  try {
    // Tenta criar um usuário de teste
    const user = await prisma.user.create({
      data: {
        name: 'Teste',
        email: 'teste@teste.com',
        password: '123456'
      }
    })
    
    console.log('Conexão bem sucedida!')
    console.log('Usuário criado:', user)

    // Lista todos os usuários
    const users = await prisma.user.findMany()
    console.log('Usuários no banco:', users)

  } catch (error) {
    console.error('Erro ao conectar:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
// ... (conteúdo truncado)
    ```

    - 📄 prisma-client.ts
    
```typescript
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

export default prisma;
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
  const token = await getToken({ req: request })
  
  // Rotas do dashboard são protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Usuários autenticados são redirecionados para o dashboard nas páginas de autenticação
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Configure o matcher para aplicar somente nas rotas necessárias
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}
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

type QuizStore = {
  currentStep: 'welcome' | 'quiz' | 'results'
  currentQuiz: Quiz | null
  playerName: string
  currentQuestionIndex: number
  score: number
  setPlayerName: (name: string) => void
  startQuiz: () => void
  answerQuestion: (answerIndex: number) => void
  setCurrentQuiz: (quiz: Quiz) => void
  saveResult: () => Promise<void>
}

export const useQuizStore = create<QuizStore>((set, get) => ({
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
export type User = {
    id: string
    name: string
    email: string
  }
  
  export type Question = {
    id?: string
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
    createdAt: Date
    updatedAt: Date
  }
  
  export type QuizResult = {
    id: string
    quizId: string
    playerName: string
    score: number
    totalQuestions: number
    createdAt: Date
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
    - 📄 api.ts
    
```typescript

    ```

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
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
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
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
// ... (conteúdo truncado)
```

- 📄 vercel-build.js

```javascript
const { execSync } = require('child_process');

console.log('Generating Prisma Client...');
execSync('npx prisma generate', { stdio: 'inherit' });

console.log('Building Next.js app...');
execSync('next build', { stdio: 'inherit' });
```

- 📄 vercel.json

```json
{
  "builds": [
    {
      "src": "./src/app/**/*",
      "use": "@vercel/next"
    }
  ],
  "cache": {
    "disable": true
  }
}
```
