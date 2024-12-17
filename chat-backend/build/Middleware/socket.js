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
const misc_1 = require("../hepers/misc");
const Message_1 = __importDefault(require("../schema/Message"));
exports.default = (app, io) => {
    io.on("connection", (socket) => {
        console.log("Un usuario se ha conectado");
        // Manejar la desconexión de un usuario
        socket.on("disconnect", () => {
            console.log("Un usuario se ha desconectado");
        });
        // Manejar la adición de un usuario
        socket.on("addUser", (userData) => {
            // Llamar a addUser pasando socket como segundo argumento
            (0, misc_1.addUser)(userData, socket);
        });
        // Manejar mensajes enviados
        socket.on("sendMessage", (messageData) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Crear un nuevo mensaje y guardarlo en la base de datos
                const newMessage = new Message_1.default({
                    sender: messageData.sender,
                    content: messageData.content,
                    timestamp: new Date(),
                });
                yield newMessage.save();
                // Emitir el mensaje guardado a todos los sockets conectados
                io.emit("message", newMessage);
            }
            catch (error) {
                console.error("Error al guardar el mensaje:", error);
            }
        }));
    });
};
