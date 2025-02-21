import { connectToDatabase } from "./mongodb";
// import mongoose, { Model } from "mongoose";
import { IUser, User } from "@/models";
import bcrypt from "bcryptjs";
import { Model } from "mongoose";

// Tipando o modelo User explicitamente
type UserModel = Model<IUser>;

async function initMongoDB() {
  try {
    console.log("Conectando ao MongoDB...");
    await connectToDatabase();
    console.log("Conexão com MongoDB estabelecida com sucesso!");

    // Verifica se existe algum usuário
    const userCount = await (User as UserModel).countDocuments();

    if (userCount === 0) {
      console.log("Nenhum usuário encontrado. Criando usuário de teste...");

      // Cria um usuário de teste
      const hashedPassword = await bcrypt.hash("123456", 10);

      const testUser = await (User as UserModel).create({
        name: "Usuário Teste",
        email: "teste@exemplo.com",
        password: hashedPassword,
      });

      console.log("Usuário de teste criado com sucesso:", {
        id: testUser._id.toString(),
        name: testUser.name,
        email: testUser.email,
      });
    } else {
      console.log(`${userCount} usuário(s) encontrado(s) no banco de dados.`);
    }
  } catch (error) {
    console.error("Erro ao inicializar MongoDB:", error);
  }
}

// Executar em ambiente de desenvolvimento
if (process.env.NODE_ENV !== "production") {
  initMongoDB();
}

export default initMongoDB;