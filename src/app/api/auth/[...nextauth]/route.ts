
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Export simplificado
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }