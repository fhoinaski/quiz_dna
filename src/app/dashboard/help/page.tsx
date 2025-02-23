'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  HelpCircle,
  Book,
  MessageCircle,
  Video,
  ChevronRight,
  Mail,
  X
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'

const helpTopics = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos',
    description: 'Aprenda a criar e gerenciar seus primeiros quizzes',
    icon: Book,
    articles: [
      'Como criar um novo quiz',
      'Gerenciando participantes',
      'Configurando tempo e pontuação'
    ]
  },
  {
    id: 'quiz-management',
    title: 'Gerenciamento de Quiz',
    description: 'Dicas avançadas para gerenciar suas sessões',
    icon: MessageCircle,
    articles: [
      'Monitorando sessões ativas',
      'Analisando resultados',
      'Customizando configurações'
    ]
  },
  {
    id: 'tutorials',
    title: 'Tutoriais em Vídeo',
    description: 'Aprenda através de nossos vídeos explicativos',
    icon: Video,
    articles: [
      'Tutorial básico',
      'Recursos avançados',
      'Melhores práticas'
    ]
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  // Função auxiliar para pesquisa segura
  const searchInString = (text: string, query: string): boolean => {
    return text.toLowerCase().includes(query.toLowerCase())
  }

  const filteredTopics = helpTopics.filter(topic => {
    if (!searchQuery) return true
    return (
      searchInString(topic.title, searchQuery) ||
      searchInString(topic.description, searchQuery) ||
      topic.articles.some(article => searchInString(article, searchQuery))
    )
  })

  // Encontrar o tópico selecionado
  const currentTopic = selectedTopic 
    ? helpTopics.find(topic => topic.id === selectedTopic) 
    : null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <HelpCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Como podemos ajudar?
          </h1>
          <p className="text-gray-600 mb-8">
            Encontre respostas para suas dúvidas sobre o sistema de quiz
          </p>

          {/* Barra de Pesquisa */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Pesquisar ajuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Exibir detalhes do tópico selecionado */}
        {currentTopic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{currentTopic.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTopic(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-gray-600 mb-4">{currentTopic.description}</p>
            <ul className="space-y-2">
              {currentTopic.articles.map((article, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  {article}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Grid de Tópicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-white hover:shadow-lg transition-shadow">
                <motion.button
                  onClick={() => setSelectedTopic(topic.id)}
                  className="w-full text-left p-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <topic.icon className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <div className="space-y-2">
                    {topic.articles.map((article, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-gray-700 hover:text-blue-500"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        <span>{article}</span>
                      </div>
                    ))}
                  </div>
                </motion.button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Seção de Contato */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ainda precisa de ajuda?
            </h2>
            <p className="text-gray-600 mb-6">
              Nossa equipe está pronta para ajudar você com qualquer dúvida
            </p>
            <Button
              onClick={() => window.location.href = 'mailto:suporte@exemplo.com'}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contatar Suporte
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}