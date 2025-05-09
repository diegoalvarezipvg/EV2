// Rutas de recordatorios
import express from 'express';
import { 
  listarRecordatorios, 
  obtenerRecordatorio, 
  crearRecordatorio, 
  actualizarRecordatorio, 
  eliminarRecordatorio 
} from '../controladores/recordatorioController.js';
import { validarEsquema } from '../middleware/validacion.js';
import { recordatorioCreacionSchema, recordatorioActualizacionSchema } from '../esquemas/validacionEsquema.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas de recordatorios están protegidas por el middleware de autenticación
router.use(verifyAuth);

// Listar todos los recordatorios
router.get('/', listarRecordatorios);

// Obtener un recordatorio por su ID
router.get('/:id', obtenerRecordatorio);

// Crear un nuevo recordatorio
router.post('/', validarEsquema(recordatorioCreacionSchema), crearRecordatorio);

// Actualizar parcialmente un recordatorio
router.patch('/:id', validarEsquema(recordatorioActualizacionSchema), actualizarRecordatorio);

// Eliminar un recordatorio
router.delete('/:id', eliminarRecordatorio);

export default router;