'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { gsap } from 'gsap'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  
  // Motion values para rastrear a posição do mouse
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Desativa em dispositivos móveis (menor que 768px)
      if (window.innerWidth < 768) return

      const { clientX, clientY } = e
      mouseX.set(clientX)
      mouseY.set(clientY)

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.2,
          ease: 'power2.out',
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={cursorRef}
      className="hidden md:block fixed w-8 h-8 rounded-full bg-blue-500/30 backdrop-blur-sm z-50 pointer-events-none mix-blend-screen"
      style={{ 
        left: '-20px', 
        top: '-20px',
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
      }}
    >
      <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" />
    </motion.div>
  )
}