import mongoose, { Schema, Model, Document } from "mongoose";

// Definir una interfaz para el documento de chats
export interface IChats extends Document {
    chatId: string;
  receiverEmail: string;
  senderEmail: string;
}

// Crear el esquema de chats
const ChatsSchema: Schema = new Schema({
    chatId: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  senderEmail: { type: String, required: true },
});

// Crear y exportar el modelo de chats
const Chats: Model<IChats> = mongoose.model<IChats>("chats", ChatsSchema);
export default Chats;
