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