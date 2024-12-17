"use strict";
/*import express, { Router, Request, Response } from "express";
import User from "../schema/User";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";

// Crear el enrutador
const router: Router = express.Router();

// * POST Request * //
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    res.status(200).json({ message: "Ruta POST funcionando correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;*/
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
const User_1 = __importDefault(require("../schema/User")); // Modelo de Usuario
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Clave secreta para JWT
const JWT_SECRET = "mi_clave_secreta"; // Usa una clave segura en producción
// Crear el enrutador
const router = express_1.default.Router();
// * POST Request - Login * //
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // 1. Validar que los campos no estén vacíos
        if (!email || !password) {
            return res.status(400).json({
                message: "Por favor, proporciona un email y una contraseña",
            });
        }
        // 2. Buscar el usuario en la base de datos
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Usuario no encontrado",
            });
        }
        // 3. Comparar la contraseña encriptada
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Contraseña incorrecta",
            });
        }
        // 4. Generar un token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        // 5. Devolver el token
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
        });
    }
    catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({
            message: "Error en el servidor",
        });
    }
}));
exports.default = router;
