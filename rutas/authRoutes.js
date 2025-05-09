import express from 'express';
import { login, logout } from '../controladores/authController.js';
import { validarEsquema } from '../esquemas/validacion.js';
import { loginSchema } from '../esquemas/validacion.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', validarEsquema(loginSchema), login);

router.post('/logout', verifyAuth, logout);

export default router;