import { Application } from "express";
import { Server, Socket } from "socket.io";
import { addUser } from "../hepers/misc";
import Messages from "../schema/Message";

export default (app: Application, io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Un usuario se ha conectado");

    // Manejar la desconexión de un usuario
    socket.on("disconnect", () => {
      console.log("Un usuario se ha desconectado");
    });

    // Manejar la adición de un usuario
    socket.on("addUser", (userData) => {
        // Llamar a addUser pasando socket como segundo argumentos
        addUser(userData, socket);
      });

    // Manejar mensajes enviados
    socket.on("sendMessage", async (messageData: { sender: string; content: string }) => {
      try {
        // Crear un nuevo mensaje y guardarlo en la base de datos
        const newMessage = new Messages({
          sender: messageData.sender,
          content: messageData.content,
          timestamp: new Date(),
        });

        await newMessage.save();

        // Emitir el mensaje guardado a todos los sockets conectados
        io.emit("message", newMessage);
      } catch (error) {
        console.error("Error al guardar el mensaje:", error);
      }
    });
  });
};
