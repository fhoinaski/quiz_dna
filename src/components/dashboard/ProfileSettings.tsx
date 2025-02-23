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