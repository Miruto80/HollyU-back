import express from 'express';
import { getCotizacionesController } from '../controllers/cotizaciones.controller.js';

const router = express.Router();

router.get('/cotizaciones', getCotizacionesController);

export default router;
