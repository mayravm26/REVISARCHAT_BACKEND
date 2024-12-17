import mongoose, { Schema, Model, Document } from "mongoose";

// Definir una interfaz para el documento de mensajes
export interface IMessages extends Document {
    sender: string;
  content: string;
  timestamp: Date;
}

// Crear el esquema de mensajes
const MessagesSchema: Schema = new Schema <IMessages>({
    sender: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Crear y exportar el modelo de mensajes
const Messages: Model<IMessages> = mongoose.model<IMessages>("messages", MessagesSchema);
export default Messages;
