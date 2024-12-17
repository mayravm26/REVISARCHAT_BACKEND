"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Clave secreta JWT (reemplázala con una variable de entorno o valor seguro)
const JWT_SECRET = "tu_clave_secreta";
// Middleware de autenticación
function auth(req, res, next) {
    var _a;
    try {
        // Obtener el token del encabezado de autorización
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        // Verificar si no hay token
        if (!token) {
            return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
        }
        // Verificar y decodificar el token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded; // Almacenar el usuario decodificado en la solicitud
        next(); // Llamar al siguiente middleware
    }
    catch (error) {
        return res.status(400).json({ message: "Token no válido." });
    }
}
exports.default = auth;
