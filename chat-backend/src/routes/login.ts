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

import express, { Router, Request, Response } from "express";
import User from "../schema/User"; // Modelo de Usuario
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";

// Clave secreta para JWT
const JWT_SECRET: string = "mi_clave_secreta"; // Usa una clave segura en producción

// Crear el enrutador
const router: Router = express.Router();

// * POST Request - Login * //
router.post("/", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que los campos no estén vacíos
    if (!email || !password) {
      return res.status(400).json({
        message: "Por favor, proporciona un email y una contraseña",
      });
    }

    // 2. Buscar el usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Usuario no encontrado",
      });
    }

    // 3. Comparar la contraseña encriptada
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Contraseña incorrecta",
      });
    }

    // 4. Generar un token JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // 5. Devolver el token
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
});

export default router;



