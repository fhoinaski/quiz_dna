// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { Model } from "mongoose"
import { IUser, User } from "@/models"
import bcrypt from "bcryptjs"

type UserModel = Model<IUser>

// GET - Obter perfil do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const user = await (User as UserModel).findById(
      session.user.id,
      { password: 0 } // Excluir o campo password
    )

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar perfil do usuário
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    await connectToDatabase()

    // Se houver nova senha, fazer hash
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10)
    }

    const updatedUser = await (User as UserModel).findByIdAndUpdate(
      session.user.id,
      { $set: body },
      { new: true, select: '-password' }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    )
  }
}