import Task from "../models/task.model.js"; // Importa el modelo de tarea

// Función para obtener todas las tareas del usuario actual
export const getTasks = async (req, res) => {
  try {
    // Busca todas las tareas del usuario actual e incluye los datos del usuario relacionado
    const tasks = await Task.find({ user: req.user.id }).populate("user");
    // Responde con la lista de tareas
    res.json(tasks);
  } catch (error) {
    // Maneja errores y responde con un estado 500
    return res.status(500).json({ message: error.message });
  }
};

// Función para crear una nueva tarea
export const createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body; // Extrae los datos de la tarea del cuerpo de la solicitud
    // Crea una nueva tarea con los datos proporcionados y el ID del usuario actual
    const newTask = new Task({
      title,
      description,
      date,
      user: req.user.id,
    });
    // Guarda la nueva tarea en la base de datos
    await newTask.save();
    // Responde con la tarea creada
    res.json(newTask);
  } catch (error) {
    // Maneja errores y responde con un estado 500
    return res.status(500).json({ message: error.message });
  }
};

// Función para eliminar una tarea existente
export const deleteTask = async (req, res) => {
  try {
    // Busca y elimina la tarea por su ID
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Tarea no encontrada" });

    // Responde con un estado 204 (sin contenido) si la tarea fue eliminada
    return res.sendStatus(204);
  } catch (error) {
    // Maneja errores y responde con un estado 500
    return res.status(500).json({ message: error.message });
  }
};

// Función para actualizar una tarea existente
export const updateTask = async (req, res) => {
  try {
    const { title, description, date } = req.body; // Extrae los datos actualizados de la tarea del cuerpo de la solicitud
    // Busca y actualiza la tarea por su ID con los datos proporcionados
    const taskUpdated = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { title, description, date },
      { new: true } // Devuelve el documento actualizado
    );
    // Responde con la tarea actualizada
    return res.json(taskUpdated);
  } catch (error) {
    // Maneja errores y responde con un estado 500
    return res.status(500).json({ message: error.message });
  }
};

// Función para obtener una tarea específica por su ID
export const getTask = async (req, res) => {
  try {
    // Busca la tarea por su ID
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });
    // Responde con la tarea encontrada
    return res.json(task);
  } catch (error) {
    // Maneja errores y responde con un estado 500
    return res.status(500).json({ message: error.message });
  }
};
