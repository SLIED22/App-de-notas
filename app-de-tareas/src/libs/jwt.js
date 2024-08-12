import { TOKEN_SECRET } from "../config.js"; // Importa el secreto para firmar los tokens desde la configuración
import jwt from "jsonwebtoken"; // Importa la biblioteca para manejar JSON Web Tokens

// Función asíncrona para crear un token de acceso
export async function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    // Utiliza la biblioteca 'jsonwebtoken' para firmar un nuevo token
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      // Si ocurre un error al firmar el token, rechaza la promesa con el error
      if (err) reject(err);
      // Si el token se firma correctamente, resuelve la promesa con el token generado
      resolve(token);
    });
  });
}
