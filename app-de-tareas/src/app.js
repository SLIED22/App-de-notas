import express from "express"; // Importa el framework Express para crear el servidor
import cors from "cors"; // Importa el middleware para habilitar CORS (Cross-Origin Resource Sharing)
import morgan from "morgan"; // Importa el middleware para registrar solicitudes HTTP
import cookieParser from "cookie-parser"; // Importa el middleware para analizar cookies

import authRoutes from "./routes/auth.routes.js"; // Importa las rutas de autenticación
import taksRoutes from "./routes/tasks.routes.js"; // Importa las rutas de tareas
import { FRONTEND_URL } from "./config.js"; // Importa la URL del frontend desde la configuración

const app = express(); // Crea una instancia de la aplicación Express

// Configura CORS para permitir solicitudes desde el frontend y habilitar credenciales
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL, // Permite solicitudes solo desde la URL especificada
  })
);

// Configura Express para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Configura Morgan para registrar solicitudes HTTP en la consola en modo desarrollo
app.use(morgan("dev"));

// Configura CookieParser para analizar cookies en las solicitudes
app.use(cookieParser());

// Configura las rutas para la autenticación bajo el prefijo /api/auth
app.use("/api/auth", authRoutes);

// Configura las rutas para las tareas bajo el prefijo /api
app.use("/api", taksRoutes);

// Configura el servidor para servir archivos estáticos en producción
if (process.env.NODE_ENV === "production") {
  // Importa el módulo 'path' dinámicamente
  const path = await import("path");
  // Configura el middleware para servir archivos estáticos desde la carpeta 'client/dist'
  app.use(express.static("client/dist"));

  // Configura una ruta para manejar cualquier solicitud no reconocida y devolver el archivo 'index.html'
  app.get("*", (req, res) => {
    // Registra la ruta al archivo 'index.html'
    console.log(path.resolve("client", "dist", "index.html"));
    // Envía el archivo 'index.html' como respuesta
    res.sendFile(path.resolve("client", "dist", "index.html"));
  });
}

export default app; // Exporta la instancia de la aplicación Express
