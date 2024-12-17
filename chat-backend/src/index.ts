import express, { Application } from "express";
import mongoose from "mongoose";
import config from "config";
import morgan from "morgan";
import dotenv from "dotenv";
import http from "http";
import { Server, Socket } from "socket.io";
import registerRouter from "./routes/register";
import loginRouter from "./routes/login";

// * Cargar variables de entorno
const PORT: number = 5000; 
const MONGO_URI: string = "mongodb://localhost:27017/chatdb";

// * Inicializar la aplicación Express
const app: Application = express();

// * Crear servidor HTTP
const server = http.createServer(app);

// * Inicializar Socket.IO
const io = new Server(server, 
  { cors:{
    origin:"*"
  }}
);

// * Middleware Body Parser
app.use(express.json());
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);


// * Conectar a MongoDB
const db: string = config.get("mongoURI");

mongoose
  .connect(MONGO_URI, {
  } as mongoose.ConnectOptions)
  .then(() => console.log("MongoDB conectado..."))
  .catch((err) => console.error("Error al conectar MongoDB:", err));

// * Configurar Morgan para logs
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// * Socket.IO - Configuración de eventos
io.on("connection", (socket: Socket) => {
  console.log("Nuevo cliente conectado");

  // Ejemplo de evento de mensaje
  socket.on("chatMessage", (message: string) => {
    console.log(`Mensaje recibido: ${message}`);
    io.emit("message", message); // Enviar mensaje a todos los clientes conectados
  });

  // Evento de desconexión
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// * Ruta básica para prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente...");

});

// * Puerto y ejecución del servidor

console.log('imprimier puerto')

server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
