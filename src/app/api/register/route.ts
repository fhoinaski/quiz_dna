import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma-client'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            )
        }

        // Verifica se o email já está em uso
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email já está em uso' },
                { status: 400 }
            )
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10)

        // Cria o usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword)
    } catch (error: unknown) {
        console.error('Erro ao registrar usuário:', error)
        return NextResponse.json(
            { error: 'Erro ao criar conta' },
            { status: 500 }
        )
    }
}