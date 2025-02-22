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
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [error, setError] = useState<string>('')
  const listRef = useRef<HTMLDivElement>(null) // Referência para a lista inteira
  const containerRef = useRef<HTMLDivElement>(null) // Referência para o container

  // Verificar status da sessão a cada 5 segundos e mudar para 'welcome' quando ativo
  useEffect(() => {
    if (!currentQuiz) return
    console.log('[WaitingRoom] Verificando status da sessão...')
    const interval = setInterval(async () => {
      const active = await checkSessionStatus()
      if (active) {
        console.log('[WaitingRoom] Quiz liberado, mudando para welcome')
        clearInterval(interval)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [checkSessionStatus, currentQuiz])

  // Handler para entrar na sessão
  const handleJoin = async () => {
    if (!playerName.trim() || selectedAvatarIndex === null) {
      setError('Digite um nome e selecione um avatar.')
      console.log('[WaitingRoom] Validação falhou:', { playerName, selectedAvatarIndex })
      return
    }

    setIsJoining(true)
    setError('')
    const selectedAvatar = avatars[selectedAvatarIndex]
    console.log('[WaitingRoom] Tentando entrar na sessão:', { playerName, selectedAvatar })

    try {
      setPlayerAvatar(selectedAvatar)
      await joinSession()
      setHasJoined(true)
      console.log('[WaitingRoom] Entrou na sessão com sucesso')
    } catch (error) {
      console.error('[WaitingRoom] Erro ao entrar na sessão:', error)
      setError(error instanceof Error ? error.message : 'Erro ao entrar na sessão')
    } finally {
      setIsJoining(false)
    }
  }

  // Animação da lista com GSAP
  useEffect(() => {
    if (!hasJoined || participants.length === 0 || !listRef.current || !containerRef.current) return

    const containerHeight = window.innerHeight
    const listHeight = listRef.current.offsetHeight
    const maxY = containerHeight - listHeight - 20 // Margem de 20px nas bordas

    // Posição inicial no centro vertical
    gsap.set(listRef.current, { y: (containerHeight - listHeight) / 2 })

    // Movimento "bêbado" suave
    gsap.to(listRef.current, {
      y: () => (Math.random() - 0.5) * maxY * 0.8, // Movimento vertical limitado a 80% da área disponível
      x: () => (Math.random() - 0.5) * 200, // Movimento horizontal sutil
      duration: 6 + Math.random() * 4, // Duração entre 6 e 10 segundos
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      onRepeat: () => {
        // Novo movimento aleatório para o próximo ciclo
        gsap.to(listRef.current, {
          y: (Math.random() - 0.5) * maxY * 0.8,
          x: (Math.random() - 0.5) * 200,
          duration: 6 + Math.random() * 4,
          ease: 'sine.inOut',
        })
      },
      modifiers: {
        y: (y) => `${Math.max(20, Math.min(parseFloat(y), maxY))}px`, // Mantém dentro da tela com margem
        x: (x) => `${Math.max(20, Math.min(parseFloat(x), window.innerWidth - listRef.current!.offsetWidth - 20))}px`,
      },
    })
  }, [hasJoined, participants])

  if (!currentQuiz) {
    console.log('[WaitingRoom] currentQuiz não está definido')
    return <div>Carregando quiz...</div>
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-white overflow-hidden">
      <Particles />
      <div ref={containerRef} className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 relative z-10">
          Sala de Espera: {currentQuiz.title}
        </h1>

        {!hasJoined ? (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto relative z-10">
            <Input
              placeholder="Digite seu nome"
              value={playerName}
              onChange={(e) => {
                console.log('[WaitingRoom] Nome digitado:', e.target.value)
                setPlayerName(e.target.value)
              }}
              className="mb-4"
              disabled={isJoining}
            />
            <div className="grid grid-cols-5 gap-2 mb-4">
              {avatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log('[WaitingRoom] Avatar selecionado:', { index, avatar })
                    setSelectedAvatarIndex(index)
                  }}
                  className={`text-3xl p-2 rounded-full ${
                    selectedAvatarIndex === index ? 'bg-blue-200' : 'bg-gray-100'
                  }`}
                  disabled={isJoining}
                >
                  {avatar}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              onClick={handleJoin}
              disabled={!playerName.trim() || selectedAvatarIndex === null || isJoining}
              className="w-full"
            >
              {isJoining ? (
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 animate-spin" /> Entrando...
                </span>
              ) : (
                <span className="flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" /> Entrar na Sessão
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="relative z-0 w-full max-w-2xl">
            <p className="text-lg text-gray-600 mb-6 relative z-10">
              Aguardando o início do quiz... Participantes: {participants.length}
            </p>
            <div ref={listRef} className="absolute w-full">
              {participants.map((participant, index) => (
                <div
                  key={participant.name + index}
                  className="bg-gray-100 flex items-center p-4 rounded-lg shadow-md border border-gray-200 mb-2"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl mr-4">
                    {participant.avatar}
                  </div>
                  <span className="text-lg font-medium text-gray-800 flex-1 text-left">
                    {participant.name}
                  </span>
                  <Clock className="w-5 h-5 text-gray-600 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}