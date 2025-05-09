// Rutas de recordatorios
import express from 'express';
import { 
  listarRecordatorios, 
  obtenerRecordatorio, 
  crearRecordatorio, 
  actualizarRecordatorio, 
  eliminarRecordatorio 
} from '../controladores/recordatorioController.js';
import { validarBody, validarParams } from '../middleware/validacion.js';
import { recordatorioCreacionSchema, recordatorioActualizacionSchema, idSchema } from '../esquemas/validacionEsquema.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas de recordatorios están protegidas por el middleware de autenticación
router.use(verifyAuth);

// Listar todos los recordatorios
router.get('/', listarRecordatorios);

// Obtener un recordatorio por su ID
router.get('/:id', validarParams(idSchema), obtenerRecordatorio);

// Crear un nuevo recordatorio
router.post('/', validarBody(recordatorioCreacionSchema), crearRecordatorio);

// Actualizar parcialmente un recordatorio
router.patch('/:id', validarParams(idSchema), validarBody(recordatorioActualizacionSchema), actualizarRecordatorio);

// Eliminar un recordatorio
router.delete('/:id', validarParams(idSchema), eliminarRecordatorio);

export default router;