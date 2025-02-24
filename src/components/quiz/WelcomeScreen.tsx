// src/components/quiz/WelcomeScreen.tsx

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Dna } from 'lucide-react'
import { useQuizStore } from '@/store'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'
import gsap from 'gsap'
import { getQuizSession, hasActiveQuizSession, clearQuizSession } from '@/utils/clientId'

const avatars = ['🧑‍🚀', '🦸‍♂️', '🦹‍♀️', '🧙‍♂️', '🧝‍♀️', '🦊', '🐉', '🦄']

export function WelcomeScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('')
  const [playerNameInput, setPlayerNameInput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true) // Iniciar como true para verificação
  const particlesRef = useRef<HTMLDivElement>(null)
  const { currentQuiz, joinSession, setPlayerName, setPlayerAvatar } = useQuizStore()
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const autoJoinAttempted = useRef<boolean>(false)

  // Detectar dispositivo móvel
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Verificar sessão ativa e redirecionar se necessário
  useEffect(() => {
    if (!currentQuiz?.id || autoJoinAttempted.current) return;
    
    const checkExistingSession = async () => {
      try {
        // Verificar se já tem uma sessão ativa para este quiz
        if (hasActiveQuizSession(currentQuiz.id)) {
          const sessionData = getQuizSession(currentQuiz.id);
          console.log('Sessão anterior encontrada:', sessionData);
          
          // Verificar se o quiz foi zerado - vamos checar se a sessão no servidor ainda existe
          const sessionResponse = await fetch(`/api/quiz/${currentQuiz.id}/session`);
          const serverSessionData = await sessionResponse.json();
          
          // Se a sessão não existir ou estiver zerada (não tiver participantes ou isActive=false)
          const isReset = !serverSessionData.exists || 
                         !serverSessionData.isActive || 
                         (serverSessionData.participants && serverSessionData.participants.length === 0);
          
          if (isReset) {
            console.log('Quiz foi zerado, limpando sessão local');
            clearQuizSession(currentQuiz.id);
            
            // Preencher o formulário apenas como sugestão
            if (sessionData && sessionData.playerName) {
              setPlayerNameInput(sessionData.playerName);
            }
            if (sessionData && sessionData.playerAvatar) {
              setSelectedAvatar(sessionData.playerAvatar);
            }
          } else if (sessionData && sessionData.playerName && sessionData.playerAvatar) {
            // Se o quiz não foi zerado e temos dados de sessão, fazer auto-join
            console.log('Quiz ativo, tentando auto-join');
            setPlayerNameInput(sessionData.playerName);
            setSelectedAvatar(sessionData.playerAvatar);
            
            // Configurar dados no store
            setPlayerName(sessionData.playerName);
            setPlayerAvatar(sessionData.playerAvatar);
            
            // Tentar juntar-se automaticamente à sessão
            try {
              await joinSession(currentQuiz.id, sessionData.playerName, sessionData.playerAvatar);
              console.log('Auto-join bem-sucedido!');
            } catch (err) {
              console.error('Erro no auto-join:', err);
              // Erro silencioso - o formulário já está preenchido
            }
          }
        } else {
          console.log('Nenhuma sessão anterior encontrada para este quiz');
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
        autoJoinAttempted.current = true;
      }
    };
    
    checkExistingSession();
  }, [currentQuiz?.id, joinSession, setPlayerName, setPlayerAvatar]);

  // Seleção inicial de avatar se não tivermos um guardado
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
      setLoading(true);
      setPlayerName(playerNameInput)
      setPlayerAvatar(selectedAvatar)
      await joinSession(currentQuiz.id, playerNameInput, selectedAvatar)
    } catch (err) {
      setError('Erro ao entrar na sessão. Tente novamente.')
      console.error('Join session error:', err)
    } finally {
      setLoading(false);
    }
  }

  // Se estiver carregando, mostrar indicador de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verificando status do quiz...</p>
        </motion.div>
      </div>
    );
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
            
            <Button onClick={handleJoin} className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar no Quiz'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}