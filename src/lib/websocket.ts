import { Server } from "socket.io";
import { createServer } from "http";
import { connectToDatabase } from "./mongodb";
import { QuizSession } from "@/models";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", async (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("joinQuiz", async (quizId: string) => {
    await connectToDatabase();
    const session = await QuizSession.findOne({ quizId });
    socket.join(quizId);
    io.to(quizId).emit("participantUpdate", session?.participants.length || 0);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

httpServer.listen(3001, () => console.log("WebSocket rodando na porta 3001"));