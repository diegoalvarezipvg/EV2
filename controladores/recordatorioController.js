// Controlador de Recordatorios
import recordatorioRepo from '../repositorios/recordatorioRepo.js';

// Listar todos los recordatorios
export const listarRecordatorios = async (req, res) => {
  try {
    const recordatorios = await recordatorioRepo.listarRecordatorios();
    res.status(200).json(recordatorios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los recordatorios' });
  }
};

// Obtener un recordatorio por su ID
export const obtenerRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    const recordatorio = await recordatorioRepo.obtenerRecordatorio(id.trim());
    
    if (!recordatorio) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    
    res.status(200).json(recordatorio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el recordatorio' });
  }
};

// Crear un nuevo recordatorio
export const crearRecordatorio = async (req, res) => {
  try {
    const { content, important = false } = req.validatedBody;
    
    const recordatorio = await recordatorioRepo.crearRecordatorio({
      content,
      important
    });
    
    res.status(201).json(recordatorio);
  } catch (error) {
    console.error(error); // Agrega este registro para ver los detalle
    res.status(500).json({ error: 'Error al crear el recordatorio' });
  }
};

// Actualizar parcialmente un recordatorio
export const actualizarRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    const { content, important } = req.validatedBody;
    
    // Verificar que al menos un campo esté presente para actualizar
    if (content === undefined && important === undefined) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }
    
    const recordatorio = await recordatorioRepo.actualizarRecordatorio(id.trim(), {
      content,
      important
    });
    
    if (!recordatorio) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    
    res.status(200).json(recordatorio);
  } catch (error) {
    console.error(error); // Agrega este registro para ver los detalles
    res.status(500).json({ error: 'Error al actualizar el recordatorio' });
  }
};

// Eliminar un recordatorio
export const eliminarRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return res.status(400).json({ error: 'ID inválido' });
    }
    
    const success = await recordatorioRepo.eliminarRecordatorio(id.trim());
    
    if (!success) {
      return res.status(404).json({ error: 'Recordatorio no encontrado' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el recordatorio' });
  }
};