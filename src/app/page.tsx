'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import Link from 'next/link'
import { 
  Dna, 
  BarChart2, 
  Users, 
  Clock, 
  Globe, 
  Share2, 
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
  Menu,
  X,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { CustomCursor } from '@/components/ui/CustomCursor'

export default function WelcomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const useCasesRef = useRef(null)
  const ctaRef = useRef(null)
  const logoRef = useRef(null)
  const featuresGridRef = useRef(null)

  // Para efeitos de scroll
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150])

  // Features para mostrar na seção de destaques
  const features = [
    {
      title: "Quizzes Interativos",
      description: "Crie quizzes envolventes com pontuação em tempo real e feedback instantâneo para os participantes.",
      icon: BarChart2,
      color: "bg-blue-100 text-blue-600",
      glowColor: "0 0 20px rgba(59, 130, 246, 0.5)"
    },
    {
      title: "Sessões ao Vivo",
      description: "Conduza sessões ao vivo com monitoramento em tempo real dos participantes e resultados imediatos.",
      icon: Users,
      color: "bg-green-100 text-green-600",
      glowColor: "0 0 20px rgba(34, 197, 94, 0.5)"
    },
    {
      title: "Sistema de Pontuação Avançado",
      description: "Recompense respostas rápidas e precisas com nosso sistema de pontuação baseado em tempo.",
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
      glowColor: "0 0 20px rgba(245, 158, 11, 0.5)"
    },
    {
      title: "Compartilhamento Simplificado",
      description: "Compartilhe seus quizzes facilmente com links públicos, códigos QR ou incorporação em sites.",
      icon: Share2,
      color: "bg-purple-100 text-purple-600",
      glowColor: "0 0 20px rgba(147, 51, 234, 0.5)"
    },
    {
      title: "Análise Detalhada",
      description: "Acesse estatísticas completas sobre desempenho, tendências e pontos a melhorar.",
      icon: BarChart2,
      color: "bg-red-100 text-red-600",
      glowColor: "0 0 20px rgba(239, 68, 68, 0.5)"
    },
    {
      title: "Disponível em Qualquer Dispositivo",
      description: "Acesse e realize quizzes em qualquer dispositivo com interface adaptativa para telas de todos os tamanhos.",
      icon: Globe,
      color: "bg-indigo-100 text-indigo-600",
      glowColor: "0 0 20px rgba(79, 70, 229, 0.5)"
    }
  ]

  // Casos de uso para diferentes setores
  const useCases = [
    {
      title: "Educação",
      description: "Professores podem criar quizzes interativos para avaliar o conhecimento dos alunos de forma engajadora.",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    {
      title: "Treinamento Corporativo",
      description: "Treinadores podem medir a retenção de informações e identificar áreas que necessitam de reforço.",
      gradient: "bg-gradient-to-br from-green-500 to-green-700"
    },
    {
      title: "Eventos",
      description: "Anime suas festas e eventos com competições divertidas usando quizzes temáticos.",
      gradient: "bg-gradient-to-br from-amber-500 to-amber-700"
    }
  ]

  // Efeito de rotação infinita do logo
  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
      })
    }
  }, [])

  // Efeito de destaque para a seção features
  useEffect(() => {
    if (featuresGridRef.current) {
      const cards = featuresGridRef.current.querySelectorAll('.feature-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresGridRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }
  }, [])

  // Detectar qual seção está visível
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3
      if (heroRef.current && scrollPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
        setActiveSection('hero')
      } else if (featuresRef.current && scrollPosition < featuresRef.current.offsetTop + featuresRef.current.offsetHeight) {
        setActiveSection('features')
      } else if (useCasesRef.current && scrollPosition < useCasesRef.current.offsetTop + useCasesRef.current.offsetHeight) {
        setActiveSection('useCases')
      } else if (ctaRef.current) {
        setActiveSection('cta')
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      })
    }
    if (isMenuOpen) setIsMenuOpen(false)
  }

  return (
    <>
      <CustomCursor />

      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Barra de navegação */}
        <nav className="fixed top-0 left-0 right-0 z-30 backdrop-blur-md bg-white/90 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900">
              <Dna className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <span>DNA Quiz</span>
            </Link>
            
            <div className="block md:hidden">
              <button 
                onClick={toggleMenu} 
                className="text-gray-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                <motion.div animate={{ rotate: isMenuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </button>
            </div>
            
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <button 
                onClick={() => scrollToSection('features')}
                className={`text-gray-700 hover:text-blue-600 transition-colors ${activeSection === 'features' ? 'text-blue-600 font-medium' : ''}`}
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => scrollToSection('use-cases')}
                className={`text-gray-700 hover:text-blue-600 transition-colors ${activeSection === 'useCases' ? 'text-blue-600 font-medium' : ''}`}
              >
                Soluções
              </button>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full shadow-md">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-white/90 shadow-lg"
              >
                <div className="p-4 flex flex-col gap-4">
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="text-gray-700 hover:text-blue-600 transition-colors py-2 text-left"
                  >
                    Funcionalidades
                  </button>
                  <button 
                    onClick={() => scrollToSection('use-cases')}
                    className="text-gray-700 hover:text-blue-600 transition-colors py-2 text-left"
                  >
                    Soluções
                  </button>
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      Entrar
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero section */}
        <section 
          id="hero"
          ref={heroRef}
          className="min-h-screen flex items-center justify-center pt-20 pb-16 relative overflow-hidden"
        >
          <AnimatedBackground variant="quiz" density="high" speed="normal" interactive={true} />
          
          <motion.div 
            style={{ opacity, scale, y: heroY }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
          >
            <motion.div 
              ref={logoRef}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"
            >
              <Dna className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Quizzes Interativos
              </span>{" "}
              para Engajar
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-10 max-w-3xl mx-auto"
            >
              Crie, compartilhe e analise quizzes de forma simples e rápida. Perfeito para educadores, empresas e eventos.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full shadow-lg">
                    <Zap className="w-5 h-5 mr-2" /> Começar Gratuitamente
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full border-2 hover:bg-gray-50">
                    Fazer Login
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => scrollToSection('features')}
          >
            <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 rotate-90" />
          </motion.div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
                initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", scale: Math.random() * 1 + 0.5 }}
                animate={{ y: [0, Math.random() * 20 - 10], x: [0, Math.random() * 20 - 10], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        </section>

        {/* Features section */}
        <section id="features" ref={featuresRef} className="py-16 sm:py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center mb-12 sm:mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Recursos</span> Poderosos
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Tudo o que você precisa para criar experiências de quiz memoráveis
              </motion.p>
            </motion.div>
            <div ref={featuresGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  className="feature-card bg-white/90 backdrop-blur-md rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  whileHover={{ y: -5, boxShadow: feature.glowColor }}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg ${feature.color} flex items-center justify-center mb-4 sm:mb-6`}>
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" ref={useCasesRef} className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-12 sm:mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                Para Todos os Propósitos
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
              >
                O DNA Quiz é versátil e atende a diversas necessidades
              </motion.p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {useCases.map((useCase) => (
                <motion.div
                  key={useCase.title}
                  className={`${useCase.gradient} rounded-xl p-5 sm:p-6 shadow-lg`}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-xl sm:text-2xl font-bold mb-4">{useCase.title}</h3>
                  <p className="text-sm sm:text-base text-gray-200">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" ref={ctaRef} className="py-16 sm:py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Pronto para Começar?
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto">
                Crie seu primeiro quiz em minutos e surpreenda seus participantes com uma experiência interativa única.
              </p>
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full shadow-lg">
                      <Zap className="w-5 h-5 mr-2" /> Criar Conta Gratuita
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/demo">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full border-2 hover:bg-gray-50">
                      Ver Demonstração
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-10 sm:py-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 text-lg sm:text-xl font-bold mb-4">
                  <Dna className="w-6 h-6 text-blue-400" /> DNA Quiz
                </div>
                <p className="text-sm sm:text-base text-gray-400 mb-4">
                  Transformando a maneira como as pessoas aprendem e interagem através de quizzes.
                </p>
                <div className="flex gap-4">
                  <Link href="https://github.com" aria-label="GitHub"><Github className="w-5 h-5 hover:text-blue-400" /></Link>
                  <Link href="https://linkedin.com" aria-label="LinkedIn"><Linkedin className="w-5 h-5 hover:text-blue-400" /></Link>
                  <Link href="https://twitter.com" aria-label="Twitter"><Twitter className="w-5 h-5 hover:text-blue-400" /></Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-sm sm:text-base"
              >
                <h4 className="text-base sm:text-lg font-semibold mb-4">Links Rápidos</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollToSection('features')} className="hover:text-blue-400">Funcionalidades</button></li>
                  <li><button onClick={() => scrollToSection('use-cases')} className="hover:text-blue-400">Soluções</button></li>
                  <li><Link href="/login" className="hover:text-blue-400">Login</Link></li>
                </ul>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 text-center text-gray-400 text-sm"
            >
              <p>© {new Date().getFullYear()} DNA Quiz. Todos os direitos reservados.</p>
            </motion.div>
          </div>
        </footer>
      </div>
    </>
  )
}