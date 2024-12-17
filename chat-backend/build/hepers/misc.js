"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const Chats_1 = __importDefault(require("../schema/Chats")); // Asegúrate de que la ruta sea correcta
const uuid_1 = require("uuid");
// Función para agregar un usuario al chat
const addUser = (_a, socket_1) => __awaiter(void 0, [_a, socket_1], void 0, function* ({ receiverEmail, senderEmail }, socket) {
    try {
        // Generar un ID único para el chat
        const chatId = (0, uuid_1.v4)();
        // Crear un nuevo documento en la base de datos
        const newChat = new Chats_1.default({
            chatId,
            receiverEmail,
            senderEmail,
        });
        // Guardar en la base de datos
        yield newChat.save();
        console.log("Usuario agregado al chat:", { receiverEmail, senderEmail });
        // Emitir un evento a través del socket
        socket.emit("userAdded", { chatId, receiverEmail, senderEmail });
    }
    catch (error) {
        console.error("Error al agregar el usuario al chat:", error);
        // Emitir un evento de error al cliente
        socket.emit("error", { message: "Error al agregar el usuario al chat" });
    }
});
exports.addUser = addUser;
