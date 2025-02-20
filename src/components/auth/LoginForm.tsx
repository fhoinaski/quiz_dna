'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
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
    } catch (error) {
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