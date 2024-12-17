import express, { Application } from "express";
import mongoose from "mongoose";
import config from "config";
import morgan from "morgan";
import dotenv from "dotenv";
import http from "http";
import { Server, Socket } from "socket.io";
import registerRouter from "./routes/register";
import loginRouter from "./routes/login";
import cors from "cors";
import jwt from "jsonwebtoken";

// * Cargar variables de entorno
const PORT: number = 5000; 
const MONGO_URI: string = "mongodb://localhost:27017/chatdb";

// * Inicializar la aplicación Express
const app: Application = express();

// * Configurar CORS
app.use(cors({
  origin: "http://localhost:55321", // URL de tu frontend Flutter
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
}));

// * Middleware Body Parser
app.use(express.json());

//rutas principales
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);


// * Crear servidor HTTP
const server = http.createServer(app);



// * Inicializar Socket.IO con CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:62043", // URL de tu frontend Flutter
      "http://localhost:62043", // Origen actual del frontend Flutter
    ],
    methods: ["GET", "POST"],
  },
});

// * Middleware para autenticación en Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Token no proporcionado"));
  }

  try {
    // Verificar el token (reemplaza 'secretkey' con tu clave secreta JWT)
    const decoded = jwt.verify(token, "secretkey");
    console.log("Token válido, usuario conectado:", decoded);
    socket.data.user = decoded; // Almacena los datos del usuario autenticado en el socket
    next();
  } catch (err) {
    if (err instanceof Error) {
      console.error("Token inválido:", err.message);
      next(new Error("Autenticación fallida"));
    } else {
      console.error("Error desconocido");
      next(new Error("Error desconocido"));
    }
  }
});



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

// * Ruta básica para prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente...");

});

// * Puerto y ejecución del servidor

console.log('imprimier puerto')

server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
