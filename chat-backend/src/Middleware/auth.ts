import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Definir una interfaz extendida para Request
interface CustomRequest extends Request {
  user?: string | JwtPayload; // Aquí se almacena el usuario decodificado
}

// Clave secreta JWT (reemplázala con una variable de entorno o valor seguro)
const JWT_SECRET: string = "tu_clave_secreta";

// Middleware de autenticación
function auth(req: CustomRequest, res: Response, next: NextFunction): Response | void {
  try {
    // Obtener el token del encabezado de autorización
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Verificar si no hay token
    if (!token) {
      return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Almacenar el usuario decodificado en la solicitud

    next(); // Llamar al siguiente middleware
  } catch (error) {
    return res.status(400).json({ message: "Token no válido." });
  }
}

export default auth;
