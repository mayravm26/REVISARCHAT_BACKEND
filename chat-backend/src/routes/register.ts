import express, { Router, Request, Response } from "express";
import User from "../schema/User"; // Ruta correcta del modelo
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Instancia del enrutador de Express
const router: Router = express.Router();

// Clave secreta JWT - Usa una clave segura
const JWT_SECRET: string = "mi_clave_secreta";

// POST Request - Registrar un nuevo usuario
router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validar campos
    if (!username || !password) {
      return res.status(400).json({
        message: "Por favor, ingresa nombre de usuario y contraseña",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "El usuario ya existe",
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Generar un token JWT
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
});

export default router;
