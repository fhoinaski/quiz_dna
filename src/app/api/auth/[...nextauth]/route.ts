import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Importar uma única vez e reutilizar o handler
const handler = NextAuth(authOptions)

// Exportar o handler para GET e POST
export { handler as GET, handler as POST }