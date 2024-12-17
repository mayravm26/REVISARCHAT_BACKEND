"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const register_1 = __importDefault(require("./routes/register"));
const login_1 = __importDefault(require("./routes/login"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// * Cargar variables de entorno
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/chatdb";
// * Inicializar la aplicación Express
const app = (0, express_1.default)();
// * Configurar CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:55321", // URL de tu frontend Flutter
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
}));
// * Middleware Body Parser
app.use(express_1.default.json());
//rutas principales
app.use("/api/register", register_1.default);
app.use("/api/login", login_1.default);
// * Crear servidor HTTP
const server = http_1.default.createServer(app);
// * Inicializar Socket.IO con CORS
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:62043", // URL de tu frontend Flutter
            "http://localhost:62043", // Origen actual del frontend Flutter
        ],
        methods: ["GET", "POST"],
    },
});
// * Middleware para autenticación en Socket.IO
io.use((socket, next) => {
    var _a;
    const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        return next(new Error("Token no proporcionado"));
    }
    try {
        // Verificar el token (reemplaza 'secretkey' con tu clave secreta JWT)
        const decoded = jsonwebtoken_1.default.verify(token, "secretkey");
        console.log("Token válido, usuario conectado:", decoded);
        socket.data.user = decoded; // Almacena los datos del usuario autenticado en el socket
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Token inválido:", err.message);
            next(new Error("Autenticación fallida"));
        }
        else {
            console.error("Error desconocido");
            next(new Error("Error desconocido"));
        }
    }
});
// * Socket.IO - Configuración de eventos
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    // Ejemplo de evento de mensaje
    socket.on("chatMessage", (message) => {
        console.log(`Mensaje recibido: ${message}`);
        io.emit("message", message); // Enviar mensaje a todos los clientes conectados
    });
    // Evento de desconexión
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});
// * Conectar a MongoDB
const db = config_1.default.get("mongoURI");
mongoose_1.default
    .connect(MONGO_URI, {})
    .then(() => console.log("MongoDB conectado..."))
    .catch((err) => console.error("Error al conectar MongoDB:", err));
// * Configurar Morgan para logs
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// * Ruta básica para prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente...");
});
// * Puerto y ejecución del servidor
console.log('imprimier puerto');
server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
