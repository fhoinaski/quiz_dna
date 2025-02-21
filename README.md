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