'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search,
  HelpCircle,
  Book,
  Video,
  Terminal,
  ChevronRight,
  Mail,
  X,
 
  Share2,

  ArrowLeft,

} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/Card'


// Dados organizados para o conteúdo de ajuda
const helpCategories = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos',
    description: 'Aprenda a criar e gerenciar seus primeiros quizzes',
    icon: Book,
    articles: [
      {
        id: 'create-quiz',
        title: 'Como criar um novo quiz',
        content: `
### Criando seu Primeiro Quiz

1. **Acesse o Dashboard**: Após o login, vá para o Dashboard clicando no botão "Dashboard" no menu principal.

2. **Inicie a Criação**: Clique no botão "Criar Novo Quiz" no canto superior direito da tela.

3. **Configure as Informações Básicas**:
   - Digite um título atrativo
   - Adicione uma descrição clara do objetivo do quiz
   - Escolha se deseja publicar o quiz imediatamente ou salvá-lo como rascunho

4. **Adicione Perguntas**:
   - Clique em "Adicionar Pergunta" para cada nova questão
   - Digite o texto da pergunta
   - Adicione as opções de resposta
   - Selecione a resposta correta clicando no botão de opção correspondente

5. **Importe Perguntas (Opcional)**:
   - Se já possui perguntas em formato de texto, use a opção "Importar Perguntas"
   - Siga o formato especificado para importar múltiplas perguntas de uma vez

6. **Finalize e Salve**: Clique em "Salvar Quiz" quando terminar

Seu quiz está pronto para ser compartilhado com participantes!
        `
      },
      {
        id: 'managing-participants',
        title: 'Gerenciando participantes',
        content: `
### Gerenciamento de Participantes

O DNA Vital Quiz permite a você monitorar participantes em tempo real durante as sessões de quiz.

#### Visualizando Participantes

1. **Acesse o Dashboard**: Vá para a lista de quizzes no dashboard
2. **Selecione o Quiz**: Escolha o quiz que deseja gerenciar
3. **Acesse Controles**: Clique em "Editar" para acessar o painel de controle
4. **Visualize Participantes**: No painel de controle do quiz, a seção "Participantes" mostra todos os usuários conectados

#### Recursos de Gerenciamento

- **Visualizar Informações**: Veja nomes e avatares dos participantes
- **Monitorar Atividade**: Acompanhe quando os participantes se juntaram à sessão
- **Atividade em Tempo Real**: Observe novos participantes se juntando instantaneamente

#### Dicas

- Mantenha o painel aberto durante toda a sessão para monitoramento constante
- Recarregue a página caso encontre problemas de atualização
- Para sessões com muitos participantes, use a visualização compacta clicando em "Ocultar"
        `
      },
      {
        id: 'time-config',
        title: 'Configurando tempo e pontuação',
        content: `
### Configuração de Tempo e Pontuação

O sistema de pontuação do DNA Vital Quiz é baseado tanto na precisão quanto na velocidade das respostas.

#### Configurações de Tempo

1. **Tempo Total**: Defina o tempo total do quiz em minutos
   - Padrão: 5 minutos
   - Recomendado: 1-2 minutos para quizzes curtos (até 10 questões)
   - Recomendado: 3-5 minutos para quizzes médios (10-20 questões)

2. **Tempo por Questão**: O sistema calcula automaticamente o tempo médio por questão

#### Sistema de Pontuação

A pontuação é calculada usando um sistema regressivo que premia respostas rápidas:

- **Resposta Correta Base**: 100 pontos
- **Bônus de Tempo**: Até 900 pontos adicionais com base na velocidade
- **Fórmula**: Pontuação = 100 + (900 * TempoRestante/TempoTotal)

Exemplo:
- Resposta correta instantânea = 1000 pontos
- Resposta correta no meio do tempo = 550 pontos
- Resposta correta no limite de tempo = 100 pontos
- Resposta incorreta = 0 pontos

#### Dicas para Configuração Ideal

- Para quiz competitivos: Use tempos mais curtos para aumentar a pressão
- Para quiz educativos: Configure tempos mais generosos para permitir reflexão
- Equilibre o tempo com a dificuldade das perguntas
        `
      }
    ]
  },
  {
    id: 'quiz-management',
    title: 'Gerenciamento de Quiz',
    description: 'Dicas avançadas para gerenciar suas sessões',
    icon: Terminal,
    articles: [
      {
        id: 'live-sessions',
        title: 'Monitorando sessões ativas',
        content: `
### Monitoramento de Sessões Ativas

O DNA Vital Quiz oferece um painel de controle em tempo real para gerenciar sessões ativas de quiz.

#### Iniciar uma Sessão

1. **Acesse o Painel de Controle**: Vá para a página de edição do quiz
2. **Configure o Tempo**: Defina a duração da sessão (em minutos)
3. **Inicie a Sessão**: Clique no botão "Iniciar Sessão"
4. **Compartilhe o Link**: Distribua o link gerado para os participantes

#### Durante a Sessão

O painel de controle mostra informações importantes:

- **Status da Sessão**: Ativo/Inativo
- **Tempo Restante**: Contagem regressiva em tempo real
- **Participantes Conectados**: Número atual de participantes
- **Lista de Participantes**: Nome e avatar de cada participante

#### Controles Disponíveis

- **Pausar Sessão**: Congela o tempo e impede novas respostas
- **Parar Sessão**: Finaliza a sessão imediatamente
- **Resetar Sessão**: Limpa todos os participantes e resultados

#### Melhores Práticas

- Monitore o tempo restante e faça anúncios verbais para os participantes
- Verifique se todos os participantes esperados estão conectados antes de iniciar
- Use a função de pausa se precisar fazer uma interrupção temporária
- Considere a conexão de internet dos participantes ao configurar o tempo
        `
      },
      {
        id: 'results-analysis',
        title: 'Analisando resultados',
        content: `
### Análise de Resultados

O DNA Vital Quiz oferece ferramentas completas para análise de desempenho.

#### Acessando os Resultados

1. **Dashboard**: Vá para a lista de quizzes no dashboard
2. **Opções do Quiz**: Clique no botão "Resultados" no card do quiz
3. **Visualização Detalhada**: Veja a lista completa de participantes e pontuações

#### Métricas Disponíveis

- **Ranking Completo**: Lista ordenada por pontuação
- **Pontuação Base**: Pontos obtidos por respostas corretas
- **Bônus de Tempo**: Pontos adicionais por velocidade
- **Tempo Total**: Duração total para completar o quiz
- **Data de Participação**: Quando o participante realizou o quiz

#### Recursos Analíticos

- **Comparação**: Veja como diferentes participantes se saíram na mesma questão
- **Identificação de Tendências**: Descubra quais questões foram mais difíceis
- **Progresso ao Longo do Tempo**: Compare resultados de sessões diferentes

#### Exportação de Dados (Em breve)

- Exportação para CSV para análise detalhada
- Relatórios em PDF com visualizações gráficas
- Integração com sistemas de gestão de aprendizado
        `
      },
      {
        id: 'custom-settings',
        title: 'Customizando configurações',
        content: `
### Personalização de Configurações

O DNA Vital Quiz permite personalizar diversas configurações para atender às suas necessidades específicas.

#### Configurações de Quiz

1. **Acesse Configurações**: Edite seu quiz e vá para a seção de configurações
2. **Visibilidade do Quiz**:
   - **Privado**: Apenas com link direto
   - **Público**: Visível para todos (com o link)

3. **Opções de Interface**:
   - Animações: Ative/desative efeitos visuais
   - Cores: Personalize o esquema de cores (em breve)
   - Layout: Escolha entre diferentes layouts de exibição (em breve)

4. **Configurações Avançadas**:
   - Ordem aleatória de perguntas (em breve)
   - Tempo personalizado por questão (em breve)
   - Feedback imediato ou apenas no final (em breve)

#### Melhores Práticas

- **Objetivos Educacionais**: Para fins educativos, considere desativar o cronômetro de tempo ou aumentá-lo
- **Competições**: Para eventos competitivos, mantenha o cronômetro e feedback imediato
- **Apresentações**: Para uso em apresentações, escolha a interface limpa com animações sutis
- **Acessibilidade**: Considere usuários com necessidades especiais ao configurar tempo e interface

#### Recuperação e Backup

- O sistema salva automaticamente suas alterações
- Você pode duplicar quizzes existentes para criar variações
- Seus quizzes ficam disponíveis em todas as suas sessões logadas
        `
      },
    ]
  },
  {
    id: 'tutorials',
    title: 'Tutoriais em Vídeo',
    description: 'Aprenda através de nossos vídeos explicativos',
    icon: Video,
    articles: [
      {
        id: 'basic-tutorial',
        title: 'Tutorial básico',
        content: `
### Tutorial Básico do DNA Vital Quiz

> Nota: Os vídeos tutoriais serão disponibilizados em breve. Por enquanto, oferecemos este guia textual.

#### Primeiros Passos (Guia Rápido)

1. **Criação de Conta**
   - Acesse a página de registro
   - Preencha seus dados pessoais
   - Verifique seu email para confirmar a conta

2. **Criando Seu Primeiro Quiz**
   - Clique em "Criar Novo Quiz" no dashboard
   - Preencha o título e descrição
   - Adicione perguntas e respostas
   - Defina as respostas corretas
   - Salve seu quiz

3. **Compartilhando Seu Quiz**
   - Publique o quiz marcando a opção "Tornar este quiz público"
   - Copie o link gerado clicando em "Compartilhar"
   - Distribua o link para seus participantes

4. **Visualizando Resultados**
   - Acesse a seção "Resultados" no menu principal
   - Clique no quiz específico para ver os resultados
   - Analise o desempenho dos participantes

#### Recursos Adicionais

- Consulte a documentação completa para recursos avançados
- Participe da nossa comunidade para dicas e sugestões
- Confira exemplos de quizzes populares para inspiração
        `
      },
      {
        id: 'advanced-features',
        title: 'Recursos avançados',
        content: `
### Recursos Avançados do DNA Vital Quiz

> Nota: Os vídeos demonstrativos destes recursos serão disponibilizados em breve.

#### 1. Importação em Massa de Perguntas

DNA Vital Quiz permite importar perguntas em dois formatos:

**Formato Simples**:
\`\`\`
P: Qual a capital do Brasil?
R: Rio de Janeiro
R: *Brasília
R: São Paulo
R: Belo Horizonte

P: Qual o maior planeta do Sistema Solar?
R: Terra
R: Marte
R: *Júpiter
R: Vênus
\`\`\`

**Formato JSON**:
\`\`\`json
[
  {
    "text": "Qual a capital do Brasil?",
    "options": ["Rio de Janeiro", "Brasília", "São Paulo", "Belo Horizonte"],
    "correctAnswer": 1
  },
  {
    "text": "Qual o maior planeta do Sistema Solar?",
    "options": ["Terra", "Marte", "Júpiter", "Vênus"],
    "correctAnswer": 2
  }
]
\`\`\`

#### 2. Sessões Interativas em Tempo Real

- Monitoramento ao vivo de participantes
- Contagem regressiva sincronizada para todos
- Atualizações de ranking em tempo real

#### 3. Sistema de Pontuação Avançado

- Pontuação base para respostas corretas
- Bônus de velocidade com decaimento gradual
- Penalidades opcionais para respostas incorretas (em breve)

#### 4. Personalização Visual

- Escolha entre diferentes temas (em breve)
- Adicione seu logo e marca personalizada (em breve)
- Personalize mensagens de feedback (em breve)
        `
      },
      {
        id: 'best-practices',
        title: 'Melhores práticas',
        content: `
### Melhores Práticas para o DNA Vital Quiz

Estas recomendações ajudarão você a aproveitar ao máximo sua experiência com o DNA Vital Quiz.

#### Criação de Conteúdo Eficaz

1. **Clareza nas Perguntas**
   - Evite ambiguidades e duplas interpretações
   - Use linguagem direta e objetiva
   - Mantenha as perguntas concisas

2. **Equilíbrio de Dificuldade**
   - Misture perguntas fáceis, médias e difíceis
   - Comece com perguntas mais simples para envolver os participantes
   - Aumente gradualmente a complexidade

3. **Opções de Resposta Eficientes**
   - Evite opções obviamente incorretas
   - Mantenha todas as opções com comprimento similar
   - Use distrações plausíveis mas claramente incorretas

#### Otimização da Experiência

1. **Teste Previamente**
   - Sempre teste seu quiz antes de compartilhar
   - Peça feedback para um pequeno grupo
   - Verifique o tempo necessário para completar

2. **Configuração de Tempo**
   - Ajuste o tempo com base na complexidade das perguntas
   - Para perguntas que exigem cálculos, conceda mais tempo
   - Considere o público-alvo ao definir limites de tempo

3. **Engajamento dos Participantes**
   - Use títulos atrativos para seus quizzes
   - Forneça uma descrição clara do objetivo e tema
   - Compartilhe resultados e rankings para estimular competição

#### Considerações Técnicas

1. **Compartilhamento Eficiente**
   - Use links encurtados para compartilhar
   - Teste o link em diferentes dispositivos
   - Envie o link com antecedência para os participantes

2. **Monitoramento durante a Sessão**
   - Mantenha o painel de controle aberto durante a sessão
   - Verifique se todos os participantes esperados estão conectados
   - Esteja preparado para pausar ou reiniciar se necessário
        `
      },
    ]
  },
  {
    id: 'sharing',
    title: 'Compartilhamento e Relatórios',
    description: 'Aprenda a compartilhar e analisar seus quizzes',
    icon: Share2,
    articles: [
      {
        id: 'sharing-quiz',
        title: 'Compartilhando seu quiz',
        content: `
### Compartilhando seu Quiz

O DNA Vital Quiz oferece diversas maneiras de compartilhar seus quizzes com participantes.

#### Links Públicos

1. **Publicar o Quiz**:
   - Edite seu quiz e ative a opção "Tornar este quiz público"
   - Salve as alterações

2. **Obter o Link**:
   - No dashboard, clique no botão "Compartilhar" no card do quiz
   - Copie o link gerado

3. **Distribuição**:
   - Compartilhe via email
   - Envie por mensagem
   - Incorpore em sites ou sistemas de aprendizado

#### Códigos QR (Em breve)

- Gere um código QR para acesso rápido
- Imprima para eventos presenciais
- Adicione a apresentações para acesso imediato

#### Direitos de Acesso

- **Quiz Público**: Qualquer pessoa com o link pode acessar
- **Quiz Privado**: Apenas você pode visualizar (útil para rascunhos)

#### Recomendações para Compartilhamento

- **Eventos ao Vivo**: Compartilhe o link momentos antes do início
- **Salas de Aula**: Envie o link por email ou sistema de gestão de aprendizado
- **Treinamentos**: Incorpore em materiais de treinamento existentes

#### Suporte Multi-dispositivo

O DNA Vital Quiz funciona em diversos dispositivos:
- Computadores desktop e notebooks
- Tablets
- Smartphones
        `
      },
      {
        id: 'export-reports',
        title: 'Exportando relatórios',
        content: `
### Exportação de Relatórios

> Nota: Recursos de exportação avançada serão implementados em breve.

#### Recursos Atuais

1. **Visualização de Resultados**:
   - Acesse a página de resultados do quiz
   - Visualize todos os participantes e pontuações
   - Veja estatísticas básicas como média e melhor pontuação

2. **Captura de Tela**:
   - Para registros simples, utilize a função de captura de tela do seu navegador
   - Imprima a página de resultados usando a função de impressão do navegador

#### Recursos Planejados

1. **Exportação para CSV**:
   - Dados completos de todos os participantes
   - Análise detalhada por questão
   - Métricas de tempo e desempenho

2. **Relatórios em PDF**:
   - Relatórios formatados profissionalmente
   - Incluindo gráficos e visualizações
   - Personalização de layout e informações incluídas

3. **Relatórios Detalhados**:
   - Análise por participante
   - Desempenho por questão
   - Comparações com sessões anteriores
   - Evolução ao longo do tempo

#### Retenção de Dados

- Os resultados de quizzes são armazenados permanentemente
- Você pode acessar dados históricos a qualquer momento
- Backups regulares garantem a segurança dos dados
        `
      },
      {
        id: 'analytics',
        title: 'Análise de desempenho',
        content: `
### Análise de Desempenho

O DNA Vital Quiz oferece ferramentas de análise para entender melhor o desempenho dos participantes.

#### Métricas Disponíveis

1. **Métricas por Participante**:
   - Pontuação total
   - Tempo total para conclusão
   - Tempo médio por questão
   - Taxa de acertos

2. **Métricas por Questão**:
   - Taxa de acerto/erro
   - Tempo médio para resposta
   - Distribuição de respostas escolhidas

3. **Métricas Gerais**:
   - Número total de participantes
   - Pontuação média geral
   - Tempo médio de conclusão
   - Questões mais difíceis/fáceis

#### Visualizações (Em desenvolvimento)

- Gráficos de desempenho
- Mapas de calor de respostas
- Comparativos entre sessões
- Análise de tendências ao longo do tempo

#### Aplicações Práticas

- **Educação**: Identifique conceitos que precisam ser reforçados
- **Treinamento**: Descubra áreas de conhecimento com lacunas
- **Competições**: Compare desempenho entre diferentes grupos
- **Avaliação**: Utilize dados para ajustar níveis de dificuldade

#### Dicas para Análise Eficaz

- Compare resultados antes e depois de intervenções educativas
- Identifique padrões de erro para direcionar instrução
- Use dados temporais para otimizar duração de futuros quizzes
- Analise distribuição de respostas para melhorar as opções
        `
      }
    ]
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>('getting-started')
  const [selectedArticle, setSelectedArticle] = useState<string | null>('create-quiz')
  const contentRef = useRef<HTMLDivElement>(null)

  // Filtrar categorias e artigos com base na busca
  const filteredCategories = helpCategories.filter(category => {
    if (!searchQuery) return true
    
    // Verificar se a categoria contém a consulta de busca
    if (
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return true
    }
    
    // Verificar se algum artigo contém a consulta de busca
    return category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Quando o usuário seleciona um artigo, role para o topo do conteúdo
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [selectedArticle])

  // Aplicar efeito de destaque nos resultados da pesquisa
  useEffect(() => {
    if (!searchQuery || !contentRef.current) return
    
    // Encontrar todas as ocorrências do termo de busca e destacá-las
    const content = contentRef.current
    const highlightSearch = () => {
      if (!content || !searchQuery) return

      // Restaurar conteúdo original primeiro (remove destaques anteriores)
      const originalHTML = content.innerHTML
      if (!searchQuery.trim()) {
        return
      }

      // Esta é uma solução simplificada. Em um cenário real,
      // você pode querer usar uma biblioteca de marcação de texto mais robusta.
      const regex = new RegExp(`(${searchQuery})`, 'gi')
      content.innerHTML = originalHTML.replace(
        regex, 
        '<span class="bg-yellow-200 px-1 rounded-sm">$1</span>'
      )
    }

    // Pequeno atraso para garantir que o conteúdo já foi renderizado
    const timer = setTimeout(highlightSearch, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedArticle])

  // Selecionar artigo atual com base na categoria selecionada e termo de busca
  const currentArticle = selectedCategory && selectedArticle
    ? helpCategories
        .find(c => c.id === selectedCategory)
        ?.articles.find(a => a.id === selectedArticle)
    : null

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8 md:mb-12"
        >
          <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden md:inline">Voltar ao Dashboard</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 flex items-center">
            <HelpCircle className="w-8 h-8 text-blue-500 mr-2" />
            Central de Ajuda
          </h1>
          <div className="w-8 md:w-24"></div> {/* Espaçador para centralizar o título */}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Barra de pesquisa e navegação */}
          <Card className="md:col-span-1 p-4 md:p-6 bg-white/95 backdrop-blur-sm shadow-md">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar ajuda..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <nav className="space-y-2">
              <h2 className="text-xs uppercase font-semibold text-gray-500 mb-3 pl-2">Categorias</h2>
              
              <AnimatePresence>
                {filteredCategories.map((category) => {
                  const isActive = selectedCategory === category.id
                  const Icon = category.icon
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setSelectedArticle(category.articles[0].id)
                        }}
                        className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{category.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{category.description}</p>
                        </div>
                      </button>
                      
                      {/* Lista de artigos quando a categoria está ativa */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-8 space-y-1 mb-4"
                        >
                          {category.articles.map((article) => (
                            <motion.button
                              key={article.id}
                              whileHover={{ x: 4 }}
                              onClick={() => setSelectedArticle(article.id)}
                              className={`block w-full text-left py-2 px-3 rounded-lg text-sm ${
                                selectedArticle === article.id
                                  ? 'text-blue-600 font-medium bg-blue-50'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              <span className="flex items-center">
                                <ChevronRight className={`w-3 h-3 mr-1 transition-transform ${
                                  selectedArticle === article.id ? 'transform rotate-90 text-blue-600' : 'text-gray-400'
                                }`} />
                                {article.title}
                              </span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </nav>

            {/* Contato de suporte */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                Precisa de mais ajuda?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Nossa equipe está disponível para resolver suas dúvidas.
              </p>
              <Button
                onClick={() => window.location.href = 'mailto:suporte@dnavital.com'}
                className="w-full text-sm"
                variant="outline"
              >
                Contatar Suporte
              </Button>
            </div>
          </Card>

          {/* Conteúdo do artigo */}
          <Card className="md:col-span-3 p-4 md:p-6 bg-white/95 backdrop-blur-sm shadow-md max-h-[80vh] overflow-auto" ref={contentRef}>
            <AnimatePresence mode="wait">
              {currentArticle ? (
                <motion.div
                  key={currentArticle.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">
                    {currentArticle.title}
                  </h2>
                  <div className="prose prose-blue max-w-none">
                    {/* Converter texto markdown para HTML */}
                    <div dangerouslySetInnerHTML={{ 
                      __html: convertMarkdownToHTML(currentArticle.content) 
                    }} />
                  </div>

                  {/* Navegação entre artigos */}
                  <div className="mt-12 pt-4 border-t flex justify-between">
                    {getPreviousArticle() && (
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedArticle(getPreviousArticle()?.id || null)}
                        className="flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {getPreviousArticle()?.title}
                      </Button>
                    )}
                    
                    <div></div> {/* Espaçador */}
                    
                    {getNextArticle() && (
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedArticle(getNextArticle()?.id || null)}
                        className="flex items-center"
                      >
                        {getNextArticle()?.title}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Nenhum artigo selecionado
                  </h3>
                  <p className="text-gray-500">
                    Selecione uma categoria e um artigo para visualizar o conteúdo
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        {/* Cards de artigos relacionados/populares */}
        {currentArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <h3 className="col-span-full text-xl font-semibold text-gray-800 mb-2">
              Artigos Relacionados
            </h3>
            
            {getRelatedArticles().map((article, index) => (
              <Card 
                key={article.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  const category = helpCategories.find(c => 
                    c.articles.some(a => a.id === article.id)
                  );
                  if (category) {
                    setSelectedCategory(category.id);
                    setSelectedArticle(article.id);
                  }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <h4 className="font-medium text-blue-600 mb-2">{article.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {getArticleExcerpt(article.content)}
                  </p>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    Ler mais <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
                </motion.div>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )

  // Função auxiliar para converter Markdown para HTML básico
  function convertMarkdownToHTML(markdown: string) {
    if (!markdown) return '';
    
    // Esta é uma conversão simplificada. Para produção, use uma biblioteca completa como marked.js
    let html = markdown;
    
    // Cabeçalhos
    html = html.replace(/### (.*?)\n/g, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
    html = html.replace(/#### (.*?)\n/g, '<h4 class="text-lg font-medium mt-4 mb-2">$1</h4>');
    
    // Listas
    html = html.replace(/- (.*?)\n/g, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/\d+\. (.*?)\n/g, '<li class="ml-6 list-decimal">$1</li>');
    
    // Negrito e itálico
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Blocos de código
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-md text-sm overflow-auto my-4">$1</pre>');
    
    // Blockquote
    html = html.replace(/> (.*?)\n/g, '<blockquote class="border-l-4 border-blue-200 pl-4 italic text-gray-600 my-4">$1</blockquote>');
    
    // Parágrafos
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    
    // Quebras de linha
    html = html.replace(/\n/g, '<br>');
    
    return '<p class="mb-4">' + html + '</p>';
  }

  // Função para extrair um trecho do conteúdo
  function getArticleExcerpt(content: string) {
    // Remove marcações markdown e extrai primeiros 100 caracteres
    const plainText = content
      .replace(/#{1,6} /g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/>/g, '')
      .trim();
    
    return plainText.slice(0, 120) + '...';
  }

  // Função para obter o próximo artigo na mesma categoria
  function getNextArticle() {
    if (!selectedCategory || !selectedArticle) return null;
    
    const category = helpCategories.find(c => c.id === selectedCategory);
    if (!category) return null;
    
    const currentIndex = category.articles.findIndex(a => a.id === selectedArticle);
    if (currentIndex === -1 || currentIndex === category.articles.length - 1) return null;
    
    return category.articles[currentIndex + 1];
  }

  // Função para obter o artigo anterior na mesma categoria
  function getPreviousArticle() {
    if (!selectedCategory || !selectedArticle) return null;
    
    const category = helpCategories.find(c => c.id === selectedCategory);
    if (!category) return null;
    
    const currentIndex = category.articles.findIndex(a => a.id === selectedArticle);
    if (currentIndex <= 0) return null;
    
    return category.articles[currentIndex - 1];
  }

  // Função para obter artigos relacionados (de outras categorias, com base em palavras-chave)
  function getRelatedArticles() {
    if (!currentArticle) return [];
    
    // Implementação simplificada: retorna até 3 artigos de outras categorias
    const relatedArticles = helpCategories
      .flatMap(category => category.articles)
      .filter(article => article.id !== currentArticle.id)
      // Aqui você poderia implementar uma lógica mais sofisticada de relevância
      .slice(0, 3);
    
    return relatedArticles;
  }
}