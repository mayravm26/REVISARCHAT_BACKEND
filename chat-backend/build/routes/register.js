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
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../schema/User")); // Ruta correcta del modelo
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Instancia del enrutador de Express
const router = express_1.default.Router();
// Clave secreta JWT - Usa una clave segura
const JWT_SECRET = "mi_clave_secreta";
// POST Request - Registrar un nuevo usuario
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Validar campos
        if (!username || !password) {
            return res.status(400).json({
                message: "Por favor, ingresa nombre de usuario y contraseña",
            });
        }
        // Verificar si el usuario ya existe
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                message: "El usuario ya existe",
            });
        }
        // Hashear la contraseña
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Crear un nuevo usuario
        const newUser = new User_1.default({
            username,
            password: hashedPassword,
        });
        yield newUser.save();
        // Generar un token JWT
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token });
    }
    catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({
            message: "Error en el servidor",
        });
    }
}));
exports.default = router;
