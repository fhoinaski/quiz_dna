# Estrutura do Projeto - Parte PART_3

**Gerado em:** 23/02/2025, 22:16:51  
**Node Version:** v18.20.4  
**Diretório Raiz:** `E:\Projetos\quiz-dna\dna-vital-quiz-next`

- 📄 tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'], // Mantém suporte a modo escuro com classe
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Configuração do container para layouts centralizados
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Border Radius com variáveis para consistência
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // Tipografia padronizada
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],    // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fonte moderna e acessível
      },

      // Sombras para consistência visual
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },

      // Paleta de cores refinada
      colors: {
        // Cores base do tema
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Card
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Popover
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Primária (Azul moderno)
        primary: {
          DEFAULT: '#2563eb', // Azul principal
          light: '#60a5fa',   // Tom mais claro
          dark: '#1e40af',    // Tom mais escuro
          foreground: 'hsl(var(--primary-foreground))',
        },

        // Secundária (Cinza neutro)
        secondary: {
          DEFAULT: '#6b7280', // Cinza principal
          light: '#9ca3af',   // Tom mais claro
          dark: '#4b5563',    // Tom mais escuro
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // Feedback do usuário
        success: '#10b981', // Verde para sucesso
        error: '#ef4444',   // Vermelho para erros
        warning: '#f59e0b', // Amarelo para avisos

        // Outras cores do tema
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Gráficos
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },

      // Animações
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Animação extra para fade-in sutil
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-in',
      },
    },
  },
  plugins: [require('tailwindcss-animate')], // Mantém suporte a animações
}

export default config
```

- 📄 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext", // Alinhar com "lib" e versões modernas do JS
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true, // Já está OK, mantém para evitar conflitos
    "strict": false, // Temporariamente desativar para diagnosticar o erro
    "noEmit": true,
    "esModuleInterop": true,
    "noImplicitAny": false, // Desativar junto com "strict" temporariamente
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "next-env.d.ts",
    "src/app/api/**/*.ts" // Manter apenas os arquivos fonte
    ,
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next" // Excluir explicitamente .next para evitar interferência
  ]
}

```

- 📄 vercel-build.js

```javascript
const { execSync } = require('child_process');

console.log('Building Next.js app...');
execSync('next build', { stdio: 'inherit' });
```

- 📄 vercel.json

```json
{
  "functions": {
    "src/app/api/**/*": {
      "memory": 1024
    }
  }
}
```
