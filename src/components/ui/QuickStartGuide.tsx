'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { X, Book, ArrowRight, CheckCircle, PlusCircle, Share2, BarChart2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface QuickStartGuideProps {
  onClose: () => void
}

export function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const particlesRef = useRef(null)

  const steps = [
    {
      title: 'Bem-vindo ao DNA Quiz',
      description: 'Uma plataforma avançada para criar e gerenciar quizzes interativos. Vamos dar uma olhada rápida nas principais funcionalidades.',
      icon: Book,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Criando seu Primeiro Quiz',
      description: 'Clique no botão "Criar Novo Quiz" para começar. Adicione título, descrição e perguntas.',
      icon: PlusCircle,
      color: 'bg-green-100 text-green-600',
      action: { label: 'Criar Agora', href: '/dashboard/quiz/create' }
    },
    {
      title: 'Compartilhando seu Quiz',
      description: 'Marque seu quiz como "Público" e use o botão de compartilhar para obter o link.',
      icon: Share2,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Analisando Resultados',
      description: 'Acesse "Resultados" para ver o desempenho dos participantes e análises detalhadas.',
      icon: BarChart2,
      color: 'bg-amber-100 text-amber-600',
      action: { label: 'Ver Resultados', href: '/dashboard/results' }
    }
  ]

  // Partículas de fundo
  useEffect(() => {
    if (!particlesRef.current) return

    const particleCount = window.innerWidth < 768 ? 10 : 20
    const particles = Array.from({ length: particleCount }).map(() => {
      const particle = document.createElement('div')
      particle.className = 'absolute w-2 h-2 bg-blue-500/30 rounded-full'
      particlesRef.current.appendChild(particle)
      return particle
    })

    particles.forEach((particle) => {
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      })

      gsap.to(particle, {
        duration: 5 + Math.random() * 3,
        x: `+=${Math.random() * 60 - 30}`,
        y: `+=${Math.random() * 60 - 30}`,
        opacity: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })

    return () => particles.forEach((particle) => particle.remove())
  }, [])

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      if (typeof window !== 'undefined') {
        localStorage.setItem('quickStartGuideCompleted', 'true')
      }
    }, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden"
        >
          {/* Partículas */}
          <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
            className="w-full max-w-md sm:max-w-lg lg:max-w-xl relative z-10"
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border border-gray-100">
              {/* Cabeçalho */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.div
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Book className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                    Guia de Início Rápido
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20"
                  aria-label="Fechar guia"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="p-4 sm:p-6">
                {/* Progresso */}
                <div className="flex mb-6">
                  {steps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-1 flex-1 mx-1 rounded-full ${
                        index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: index <= currentStep ? 1 : 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    />
                  ))}
                </div>

                {/* Etapa atual */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3 sm:gap-4 mb-6"
                  >
                    <motion.div
                      className={`p-2 sm:p-3 rounded-lg ${steps[currentStep].color}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {(() => {
                        const Icon = steps[currentStep].icon
                        return <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      })()}
                    </motion.div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {steps[currentStep].description}
                      </p>
                      {steps[currentStep].action && (
                        <Link href={steps[currentStep].action.href}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-md"
                              onClick={handleClose}
                            >
                              {steps[currentStep].action.label}
                            </Button>
                          </motion.div>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Rodapé */}
              <div className="border-t border-gray-200 p-4 sm:p-5 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-500 order-1 sm:order-2">
                  Passo {currentStep + 1} de {steps.length}
                </span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto order-3">
                  <Button
                    onClick={handleNextStep}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-md"
                  >
                    {currentStep < steps.length - 1 ? (
                      <>
                        Próximo <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Concluir <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default QuickStartGuide