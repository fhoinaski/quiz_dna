// src/lib/animations.ts
import { gsap } from 'gsap'

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
}

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: { duration: 0.3 }
}

export function createParticles(
  container: HTMLElement,
  count: number,
  options: {
    size?: string
    color?: string
    duration?: number
    spread?: number
  } = {}
) {
  const {
    size = 'w-2 h-2',
    color = 'bg-blue-500',
    duration = 2,
    spread = 100
  } = options

  const particles = Array.from({ length: count }).map(() => {
    const particle = document.createElement('div')
    particle.className = `absolute ${size} ${color} rounded-full opacity-50`
    return particle
  })

  particles.forEach(particle => {
    container.appendChild(particle)
    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: Math.random() * 0.5 + 0.5
    })

    gsap.to(particle, {
      duration: duration + Math.random() * 2,
      x: `+=${Math.random() * spread - spread / 2}`,
      y: `+=${Math.random() * spread - spread / 2}`,
      opacity: Math.random() * 0.3 + 0.2,
      scale: Math.random() * 0.5 + 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'none'
    })
  })

  return () => particles.forEach(p => p.remove())
}

export function createConfetti(
  container: HTMLElement,
  count: number = 50
) {
  const colors = [
    'bg-yellow-500',
    'bg-pink-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500'
  ]

  const particles = Array.from({ length: count }).map(() => {
    const particle = document.createElement('div')
    const color = colors[Math.floor(Math.random() * colors.length)]
    particle.className = `absolute w-3 h-3 ${color} rounded-lg`
    return particle
  })

  particles.forEach(particle => {
    container.appendChild(particle)
    
    gsap.fromTo(
      particle,
      {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        scale: 0
      },
      {
        duration: Math.random() * 2 + 1,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: Math.random() * 1 + 0.5,
        ease: 'power4.out',
        onComplete: () => {
          gsap.to(particle, {
            duration: 0.5,
            opacity: 0,
            scale: 0,
            onComplete: () => particle.remove()
          })
        }
      })
  })

  return () => particles.forEach(p => p.remove())
}

export const transitionVariants = {
  pageInitial: {
    opacity: 0,
    x: -20
  },
  pageAnimate: {
    opacity: 1,
    x: 0
  },
  pageExit: {
    opacity: 0,
    x: 20
  }
}

export const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20
  }
}

export function createRipple(
  event: React.MouseEvent<HTMLElement>,
  color: string = 'rgba(255, 255, 255, 0.7)'
) {
  const button = event.currentTarget
  const circle = document.createElement('span')
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  const rect = button.getBoundingClientRect()
  
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - rect.left - radius}px`
  circle.style.top = `${event.clientY - rect.top - radius}px`
  circle.style.position = 'absolute'
  circle.style.borderRadius = '50%'
  circle.style.backgroundColor = color
  circle.style.transform = 'scale(0)'
  circle.style.animation = 'ripple 600ms linear'

  const ripple = button.getElementsByClassName('ripple')[0]
  if (ripple) {
    ripple.remove()
  }

  circle.classList.add('ripple')
  button.appendChild(circle)

  return () => circle.remove()
}