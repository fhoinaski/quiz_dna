# Estrutura do Projeto - Parte PART_1

**Gerado em:** 23/02/2025, 22:16:51  
**Node Version:** v18.20.4  
**Diretório Raiz:** `E:\Projetos\quiz-dna\dna-vital-quiz-next`

- 📄 .env.example
- 📄 .eslintrc.js

```javascript
// .eslintrc.js
module.exports = {
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    parser: "@typescript-eslint/parser", // Define o parser para TypeScript
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    extends: [
      "next/core-web-vitals", // Configuração padrão do Next.js
      "plugin:@typescript-eslint/recommended", // Regras recomendadas do @typescript-eslint
    ],
    plugins: ["@typescript-eslint"], // Adiciona o plugin @typescript-eslint
    rules: {
    
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "off", // Define como aviso
      "@typescript-eslint/no-unused-vars": "error", // Define como erro
    },
  };
```

- 📄 .gitattributes
- 📄 components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- 📄 generate-code-map copy.js

```javascript
// generate-code-map.js
const fs = require('fs');
const path = require('path');

// Configurações
const EXCLUDED_DIRS = ['node_modules', '.next', '.git', '.github'];
const EXCLUDED_FILES = [
  '.gitignore',
  '.env',
  'package-lock.json',
  'yarn.lock',
  'generate-code-map.js',      // Adicionado para ignorar o próprio script
  'PROJECT_STRUCTURE_FULL.md'  // Adicionado para ignorar o arquivo gerado
];
const TEXT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss', '.html', '.md'];

function findProjectRoot() {
  let currentDir = __dirname;
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error('Raiz do projeto não encontrada');
}

function buildMarkdown(structure, depth = 0) {
  if (!structure || typeof structure !== 'object' || Object.keys(structure).length === 0) {
    return '';
  }

  let md = '';
  const indent = '  '.repeat(depth);

  for (const [name, item] of Object.entries(structure)) {
    if (!item) continue;

    if (item.content !== undefined) {
      // Processar arquivo
      md += `${indent}- 📄 ${name}\n`;
      
      if (item.content !== '[Arquivo binário]') {
        const ext = path.extname(name);
        const codeLang = ext === '.ts' ? 'typescript' : 
                        ext === '.js' ? 'javascript' :
                        ext.slice(1) || 'text';
        
        // Exibir o conteúdo completo sem truncar
        const content = item.content;
        
        md += `${indent}\n\`\`\`${codeLang}\n`;
        md += `${content}\n`;
        md += `${indent}\`\`\`\n\n`;
      }
    } else {
      // Processar pasta
      md += `${indent}- 📁 ${name}/\n`;
      const subMd = buildMarkdown(item, depth + 1);
      md += subMd;
    }
  }
  
  return md;
}

function generateMarkdownReport(structure) {
  return `# Estrutura do Projeto

**Gerado em:** ${new Date().toLocaleString()}  
**Node Version:** ${process.version}  
**Diretório Raiz:** \`${structure.metadata.projectRoot}\`

${buildMarkdown(structure.structure).trim()}
`;
}

function readDirectory(dirPath, rootPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const structure = {};

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.relative(rootPath, fullPath);

      // Ignorar entradas excluídas
      if (EXCLUDED_DIRS.includes(entry.name) || EXCLUDED_FILES.includes(entry.name)) {
        continue;
      }

      // Processamento especial para a pasta prisma
      if (path.basename(dirPath) === 'prisma' && entry.name !== 'schema.prisma') {
        continue;
      }

      if (entry.isDirectory()) {
        const subStructure = readDirectory(fullPath, rootPath);
        if (Object.keys(subStructure).length > 0) {
          structure[entry.name] = subStructure;
        }
      } else {
        try {
          const ext = path.extname(entry.name);
          const content = TEXT_EXTENSIONS.includes(ext)
            ? fs.readFileSync(fullPath, 'utf-8')
            : '[Arquivo binário]';

          structure[entry.name] = {
            content,
            path: relativePath,
            size: content.length
          };
        } catch (error) {
          structure[entry.name] = {
            error: error.message,
            path: relativePath
          };
        }
      }
    }
    return structure;

  } catch (error) {
    console.error(`❌ Erro em ${dirPath}: ${error.message}`);
    return { error: error.message };
  }
}

function generateCodeMap() {
  try {
    const projectRoot = findProjectRoot();
    console.log('\n🚀 Iniciando geração do relatório...');

    const structure = {
      metadata: {
        projectRoot,
        generatedAt: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform
      },
      structure: readDirectory(projectRoot, projectRoot)
    };

    const outputFile = path.join(projectRoot, 'PROJECT_STRUCTURE_FULL.md');
    fs.writeFileSync(outputFile, generateMarkdownReport(structure));
    
    console.log('\n✅ Relatório Markdown gerado com sucesso!');
    console.log(`📁 Arquivo: ${outputFile}`);

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

generateCodeMap();
```

- 📄 global.d.ts

```typescript
import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Isso é necessário para que o TypeScript trate este arquivo como um módulo
export {};
```

- 📄 next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

- 📄 next.config.mjs
- 📄 package.json

```json
{
  "name": "dna-vital-quiz-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.4.5",
    "gsap": "^3.12.7",
    "lucide-react": "^0.475.0",
    "mongoose": "^8.10.1",
    "next": "^15.1.7",
    "next-auth": "^4.24.11",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "shadcn-ui": "^0.9.4",
    "socket.io": "^4.7.5",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^22.13.4",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^8.24.1",
    "@typescript-eslint/parser": "^8.24.1",
    "autoprefixer": "^10.4.17",
    "critters": "^0.0.25",
    "eslint": "^8.57.1",
    "eslint-config-next": "^15.1.7",
    "eslint-define-config": "^2.0.0",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.7.3"
  }
}

```

- 📄 postcss.config.mjs
- 📁 public/
  - 📄 file.svg
  - 📄 globe.svg
  - 📄 next.svg
  - 📄 vercel.svg
  - 📄 window.svg
- 📄 README.md

```md
# Migração de Prisma para Mongoose

Este guia explica as mudanças feitas para migrar o projeto do Prisma para o Mongoose.

## Mudanças Principais

1. **Instalação do Mongoose**: Removemos o Prisma e instalamos o Mongoose como ORM para MongoDB.

2. **Modelos de Dados**: Criamos modelos Mongoose equivalentes aos modelos Prisma anteriores:
   - User
   - Quiz
   - QuizResult

3. **Conexão com o Banco de Dados**: Implementamos um sistema de conexão persistente com o MongoDB.

4. **APIs**: Atualizamos todas as APIs para usar o Mongoose em vez do Prisma.

5. **Tipos**: Atualizamos as definições de tipos para refletir a estrutura do MongoDB.

## Como configurar o projeto

1. Crie um arquivo `.env` com base no `.env.example` fornecido e configure sua URI do MongoDB.

2. Instale as dependências:
   ```
   npm install
   ```

3. Execute o projeto em desenvolvimento:
   ```
   npm run dev
   ```

## Estrutura do Banco de Dados

A estrutura do banco de dados MongoDB segue este padrão:

### Coleção: users
```
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Coleção: quizzes
```
{
  _id: ObjectId,
  title: String,
  description: String,
  questions: [
    {
      text: String,
      options: [String],
      correctAnswer: Number,
      order: Number
    }
  ],
  userId: ObjectId,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Coleção: quizresults
```
{
  _id: ObjectId,
  quizId: ObjectId,
  playerName: String,
  score: Number,
  totalQuestions: Number,
  createdAt: Date
}
```

## Notas Importantes

- Os IDs do MongoDB são do tipo ObjectId, mas nas APIs são convertidos para string para compatibilidade.
- O sistema agora usa uma conexão persistente com o MongoDB em desenvolvimento para evitar múltiplas conexões.
- Os arquivos relacionados ao Prisma foram removidos ou substituídos.

## Diferenças de Consulta

### Prisma (Antes):
```typescript
const user = await prisma.user.findUnique({
  where: { email }
});
```

### Mongoose (Agora):
```typescript
const user = await User.findOne({ email });
```

## Avisos para Desenvolvimento

- Ao fazer consultas que envolvem relacionamentos, você agora precisa usar o método `populate` do Mongoose ou consultas de agregação.
- Os IDs no MongoDB precisam ser convertidos para ObjectId ao fazer consultas ou atualizações.
- O Mongoose não gera automaticamente tipos como o Prisma, então é importante manter os tipos atualizados manualmente.
```
