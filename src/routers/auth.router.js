// src/routers/auth.router.js
import express from 'express';
import {
  loginController,
  registerController,
  restablecerContrasenaController,
  solicitarRestablecimientoContrasenaController
} from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/auth/login', loginController);
router.post('/auth/register', registerController);
router.post('/auth/forgot-password', solicitarRestablecimientoContrasenaController);
router.post('/auth/reset-password', restablecerContrasenaController);

export default router;