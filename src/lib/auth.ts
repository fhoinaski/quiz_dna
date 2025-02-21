import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Provedores de autenticação
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        // Importação dinâmica do Prisma Client
        const prisma = (await import("./prisma-client")).default;

        try {
          // Verifica se as credenciais foram fornecidas
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Busca o usuário no banco de dados
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Se o usuário não existir, retorna null
          if (!user) {
            return null;
          }

          // Compara a senha fornecida com a senha criptografada
          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          // Se a senha não for válida, retorna null
          if (!isPasswordValid) {
            return null;
          }

          // Retorna os dados do usuário autenticado
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],

  // Configuração da sessão
  session: {
    strategy: "jwt", // Usa JWT para gerenciar sessões
  },

  // Chave secreta para assinar tokens
  secret: process.env.NEXTAUTH_SECRET,

  // Páginas personalizadas
  pages: {
    signIn: "/login", // Redireciona para a página de login personalizada
  },

  // Callbacks para personalizar o comportamento
  callbacks: {
    // Adiciona o ID do usuário ao token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Adiciona o ID do usuário à sessão
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};