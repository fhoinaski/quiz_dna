import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDatabase } from "./mongodb";
import { User } from "@/models";
import { Model } from "mongoose";
import { IUser } from "@/models";

// Tipagem explícita para o modelo User
type UserModel = Model<IUser>;

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
        // Verifica se as credenciais foram fornecidas
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Conecta ao banco de dados
          await connectToDatabase();

          // Busca o usuário no banco de dados - com cast explícito para UserModel
          const user = await (User as UserModel).findOne({ email: credentials.email });

          // Se o usuário não existir, retorna null
          if (!user) {
            console.log(`Usuário não encontrado: ${credentials.email}`);
            return null;
          }

          // Verifica se a senha está correta
          const passwordIsValid = await compare(credentials.password, user.password);

          // Se a senha estiver incorreta, retorna null
          if (!passwordIsValid) {
            console.log(`Senha inválida para o usuário: ${credentials.email}`);
            return null;
          }

          // Retorna o usuário
          console.log(`Login bem-sucedido para: ${credentials.email}`);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  // Configurações da sessão
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  // Páginas personalizadas
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Página de erro (também pode ser personalizada)
  },
  // Callbacks
  callbacks: {
    // Modifica o token JWT para incluir o id do usuário
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Modifica a sessão para incluir o id do usuário
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // Callback de redirecionamento após login/logout
    async redirect({ url, baseUrl }) {
      // Força redirecionamento para dashboard após login bem-sucedido
      if (url.startsWith(baseUrl)) {
        // Mantém URLs internas (mesmo site)
        if (url.includes("/login") || url === baseUrl || url === `${baseUrl}/`) {
          return `${baseUrl}/dashboard`;
        }
        return url;
      } else if (url.startsWith("/")) {
        // Converte URLs relativas
        return `${baseUrl}${url}`;
      }
      // Retorna para a URL original ou para o baseUrl
      return url.startsWith("http") ? url : baseUrl;
    },
  },
  // Configurações secretas
  secret: process.env.NEXTAUTH_SECRET,
  // Habilitar debug em desenvolvimento
  debug: process.env.NODE_ENV === "development",
};