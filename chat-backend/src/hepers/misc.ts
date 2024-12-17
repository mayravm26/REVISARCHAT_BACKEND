import Chats from "../schema/Chats"; // Asegúrate de que la ruta sea correcta
import { v4 as uuidV4 } from "uuid";
import { Socket } from "socket.io";

// Definir la interfaz para los parámetros de usuario
interface User {
  receiverEmail: string;
  senderEmail: string;
}

// Función para agregar un usuario al chat
const addUser = async ({ receiverEmail, senderEmail }: User, socket: Socket): Promise<void> => {
  try {
    // Generar un ID único para el chat
    const chatId: string = uuidV4();

    // Crear un nuevo documento en la base de datos
    const newChat = new Chats({
      chatId,
      receiverEmail,
      senderEmail,
    });

    // Guardar en la base de datos
    await newChat.save();

    console.log("Usuario agregado al chat:", { receiverEmail, senderEmail });

    // Emitir un evento a través del socket
    socket.emit("userAdded", { chatId, receiverEmail, senderEmail });
  } catch (error) {
    console.error("Error al agregar el usuario al chat:", error);

    // Emitir un evento de error al cliente
    socket.emit("error", { message: "Error al agregar el usuario al chat" });
  }
};

export { addUser };
