import express from 'express';
import { login, logout } from '../controladores/authController.js';
import { validarBody } from '../middleware/validacion.js';
import { loginSchema } from '../esquemas/validacionEsquema.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', validarBody(loginSchema), login);

router.post('/logout', verifyAuth, logout);

export default router;