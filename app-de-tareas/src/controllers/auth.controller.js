import User from "../models/user.model.js"; // Importa el modelo de usuario
import jwt from "jsonwebtoken"; // Importa la biblioteca para manejar JSON Web Tokens
import bcrypt from "bcryptjs"; // Importa la biblioteca para el hash de contraseñas
import { TOKEN_SECRET } from "../config.js"; // Importa el secreto para firmar los tokens
import { createAccessToken } from "../libs/jwt.js"; // Importa la función para crear tokens de acceso

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Extrae el username, email y password del cuerpo de la solicitud

    // Verifica si ya existe un usuario con el mismo email
    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json({
        message: ["El email ya está en uso"],
      });

    // Hashing de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // Guarda el usuario en la base de datos
    const userSaved = await newUser.save();

    // Crea un token de acceso
    const token = await createAccessToken({
      id: userSaved._id,
    });

    // Configura una cookie con el token de acceso
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development", // Asegura que la cookie solo sea accesible a través de HTTP
      secure: true, // Asegura que la cookie solo se envíe a través de HTTPS
      sameSite: "none", // Permite que la cookie sea enviada en solicitudes de terceros
    });

    // Responde con los detalles del usuario
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    // Maneja errores
    res.status(500).json({ message: error.message });
  }
};

// Función para iniciar sesión de un usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Extrae el email y la contraseña del cuerpo de la solicitud
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({
        message: ["El email no existe"],
      });

    // Compara la contraseña proporcionada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["La contraseña es incorrecta"],
      });
    }

    // Crea un token de acceso
    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
    });

    // Configura una cookie con el token de acceso
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    // Responde con los detalles del usuario
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    // Maneja errores
    return res.status(500).json({ message: error.message });
  }
};

// Función para verificar el token de acceso
export const verifyToken = async (req, res) => {
  const { token } = req.cookies; // Extrae el token de las cookies
  if (!token) return res.send(false); // Si no hay token, responde con false

  // Verifica el token
  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401); // Si el token no es válido, responde con un error 401

    // Busca al usuario en la base de datos
    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401); // Si el usuario no existe, responde con un error 401

    // Responde con los detalles del usuario
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

// Función para cerrar sesión de un usuario
export const logout = async (req, res) => {
  // Elimina la cookie del token configurando su valor como vacío y su fecha de expiración en el pasado
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200); // Responde con un estado 200 (éxito)
};
