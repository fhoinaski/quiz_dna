import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { Model } from "mongoose";
import { IUser, User } from "@/models";

// Tipagem explícita do modelo User
type UserModel = Model<IUser>;

export async function POST(request: NextRequest) {
  console.log("Requisição recebida em /api/register");

  try {
    // Conecta ao banco de dados primeiro
    await connectToDatabase();

    // Tenta parsear o corpo da requisição com segurança
    let body;
    try {
      body = await request.json();
      console.log("Corpo da requisição recebido:", { 
        name: body.name, 
        email: body.email,
        password: body.password ? "[REDACTED]" : undefined 
      });
    } catch (jsonError) {
      console.error("Erro ao parsear JSON da requisição:", jsonError);
      return NextResponse.json(
        { error: "Formato de dados inválido" }, 
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    // Validação dos campos
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: "Email válido é obrigatório" }, { status: 400 });
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 6 caracteres" }, 
        { status: 400 }
      );
    }

    // Verifica se o email já está em uso - com cast explícito para UserModel
    const existingUser = await (User as UserModel).findOne({ email });

    if (existingUser) {
      console.log("Email já em uso:", email);
      return NextResponse.json(
        { error: "Email já está em uso" }, 
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário - com cast explícito para UserModel
    const user = await (User as UserModel).create({
      name,
      email,
      password: hashedPassword,
    });

    // Retorna o usuário criado (sem a senha)
    const newUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    console.log("Usuário criado com sucesso:", { id: newUser.id, name: newUser.name, email: newUser.email });
    
    return NextResponse.json(newUser, { status: 201 });
    
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    
    // Mensagem de erro mais detalhada para debugging
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Erro desconhecido";
      
    return NextResponse.json(
      { 
        error: "Erro interno do servidor", 
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      }, 
      { status: 500 }
    );
  }
}