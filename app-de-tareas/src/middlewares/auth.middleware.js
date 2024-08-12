import jwt from "jsonwebtoken"; // Importa la biblioteca para manejar JSON Web Tokens
import { TOKEN_SECRET } from "../config.js"; // Importa el secreto para verificar el token desde la configuración

// Middleware para autenticar las solicitudes
export const auth = (req, res, next) => {
  try {
    // Extrae el token de las cookies de la solicitud
    const { token } = req.cookies;

    // Si no hay token, responde con un estado 401 y un mensaje de autorización denegada
    if (!token)
      return res
        .status(401)
        .json({ message: "No hay token, autorización denegada" });

    // Verifica el token usando 'jsonwebtoken'
    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        // Si el token no es válido, responde con un estado 401 y un mensaje de token no válido
        return res.status(401).json({ message: "Token no es válido" });
      }
      // Si el token es válido, agrega la información del usuario a la solicitud
      req.user = user;
      // Llama al siguiente middleware o ruta en la cadena de procesamiento
      next();
    });
  } catch (error) {
    // Maneja errores y responde con un estado 500
    return res.status(500).json({ message: error.message });
  }
};
