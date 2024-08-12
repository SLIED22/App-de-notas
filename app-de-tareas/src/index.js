import app from "./app.js"; // Importa la instancia de la aplicación Express desde el archivo 'app.js'
import { PORT } from "./config.js"; // Importa el puerto en el que el servidor escuchará desde la configuración
import { connectDB } from "./db.js"; // Importa la función para conectar a la base de datos desde el archivo 'db.js'

// Función principal para iniciar el servidor y conectar a la base de datos
async function main() {
  try {
    // Conecta a la base de datos
    await connectDB();
    // Inicia el servidor en el puerto especificado
    app.listen(PORT);
    // Imprime un mensaje en la consola indicando que el servidor está escuchando en el puerto especificado
    console.log(`Listening on port http://localhost:${PORT}`);
    // Imprime el entorno en el que se está ejecutando la aplicación (por ejemplo, 'development' o 'production')
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    // Si ocurre un error al conectar a la base de datos o al iniciar el servidor, lo imprime en la consola
    console.error(error);
  }
}

// Llama a la función principal para iniciar la aplicación
main();
