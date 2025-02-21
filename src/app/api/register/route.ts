import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  console.log("Requisição recebida em /api/register");

  const prisma = (await import("@/lib/prisma-client")).default;
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

    // Verifica se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      console.log("Email já em uso:", email);
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Senha criptografada com sucesso para:", email);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    console.log("Usuário criado com sucesso:", user.id);

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const { password: _, ...userWithoutPassword } = user;

    // Retorna a resposta com status explícito
    console.log("Retornando resposta ao cliente:", userWithoutPassword);
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: unknown) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 });
  }
}