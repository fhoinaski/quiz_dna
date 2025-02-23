// src/app/dashboard/documentation/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Book, Search, Terminal,  Settings, Database } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

const sections = [
  {
    title: 'Começando',
    icon: Book,
    content: `
      # Introdução ao Quiz DNA
      
      O Quiz DNA é uma plataforma moderna para criação e gerenciamento de quizzes interativos.
      
      ## Funcionalidades Principais
      
      - Criação de quizzes personalizados
      - Sistema de pontuação em tempo real
      - Ranking de participantes
      - Análise de resultados
      - Compartilhamento fácil
    `
  },
  {
    title: 'Criando Quizzes',
    icon: Terminal,
    content: `
      # Como Criar um Quiz
      
      1. Acesse o Dashboard
      2. Clique em "Novo Quiz"
      3. Preencha as informações básicas
      4. Adicione suas questões
      5. Configure as opções de tempo
      6. Salve e publique
    `
  },
  {
    title: 'Configurações Avançadas',
    icon: Settings,
    content: `
      # Configurações do Quiz
      
      - Tempo por questão
      - Pontuação personalizada
      - Opções de compartilhamento
      - Configurações de privacidade
    `
  },
  {
    title: 'Gerenciamento de Dados',
    icon: Database,
    content: `
      # Gerenciando seus Dados
      
      - Exportação de resultados
      - Backup de quizzes
      - Análise de desempenho
      - Relatórios detalhados
    `
  }
]

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState(0)

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Documentação</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar na documentação..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1 p-4">
          <nav>
            {filteredSections.map((section, index) => (
              <motion.button
                key={section.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 ${
                  selectedSection === index
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSection(index)}
              >
                <section.icon className="w-5 h-5" />
                {section.title}
              </motion.button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <Card className="md:col-span-3 p-6">
          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose max-w-none"
          >
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-6">
              {/* <filteredSections[selectedSection].icon className="w-6 h-6" /> */}
              {filteredSections[selectedSection].title}
            </h2>
            <div className="markdown-content">
              {filteredSections[selectedSection].content}
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  )
}