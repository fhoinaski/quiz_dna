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