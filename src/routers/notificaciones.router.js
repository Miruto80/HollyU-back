import express from 'express';
import {
  getHistorialNotificacionesController,
  getNotificacionesPendientesController,
  marcarNotificacionesEnviadasController
} from '../controllers/notificaciones.controller.js';

const router = express.Router();

router.get('/notificaciones/historial', getHistorialNotificacionesController);
router.get('/notificaciones', getNotificacionesPendientesController);
router.patch('/notificaciones/enviadas', marcarNotificacionesEnviadasController);

export default router;
