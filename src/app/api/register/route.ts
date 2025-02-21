import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models";

export async function POST(request: Request) {
  console.log("Requisição recebida em /api/register");

  try {
    // Tenta parsear o corpo da requisição com segurança
    let body;
    try {
      body = await request.json();
      console.log("Corpo da requisição recebido:", body);
    } catch (jsonError) {
      console.error("Erro ao parsear JSON da requisição:", jsonError);
      return NextResponse.json({ error: "Formato de dados inválido" }, { status: 400 });
    }

    const { name, email, password } = body;

    // Verifica se todos os campos necessários estão presentes
    if (!name || !email || !password) {
      console.log("Dados incompletos recebidos:", { name, email, password });
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Conecta ao banco de dados
    await connectToDatabase();

    // Verifica se o email já está em uso
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Email já em uso:", email);
      return NextResponse.json({ error: "Email já está em uso" }, { status: 409 });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const user = await User.create({
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

    console.log("Usuário criado com sucesso:", newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}